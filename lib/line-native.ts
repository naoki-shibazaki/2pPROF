import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { pool } from '@/lib/db'

// iOS アプリでの LINE ログイン
// 「LINEアプリでログイン」を選ぶと、LINE アプリからの戻り先がアプリ内ブラウザではなく Safari になる。
// Auth.js は開始時の Cookie で state を照合するため Safari では失敗する。
// そこで state を署名付きで URL に載せ、Cookie なしで照合できるアプリ専用の経路を使う。
// 結果は Google と同じく native_handoffs 経由でアプリに引き渡す（lib/native-handoff.ts）

export const LINE_NATIVE_CALLBACK_PATH = '/api/auth/native/line/callback'
const STATE_TTL_MS = 10 * 60 * 1000

type StatePayload = { th: string; n: string; exp: number }

const b64url = (buf: Buffer) => buf.toString('base64url')
const sign = (data: string) => createHmac('sha256', process.env.AUTH_SECRET!).update(`line-native:${data}`).digest()

function encodeState(payload: StatePayload) {
  const data = b64url(Buffer.from(JSON.stringify(payload)))
  return `${data}.${b64url(sign(data))}`
}

function decodeState(state: string): StatePayload | null {
  const [data, sig] = state.split('.')
  if (!data || !sig) return null
  const expected = sign(data)
  const given = Buffer.from(sig, 'base64url')
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null
  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString()) as StatePayload
    return payload.exp > Date.now() ? payload : null
  } catch {
    return null
  }
}

export function lineAuthorizeUrl(origin: string, handoffToken: string) {
  const nonce = b64url(randomBytes(16))
  const state = encodeState({
    th: createHash('sha256').update(handoffToken).digest('hex'),
    n: nonce,
    exp: Date.now() + STATE_TTL_MS,
  })
  const url = new URL('https://access.line.me/oauth2/v2.1/authorize')
  url.search = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.LINE_CLIENT_ID!,
    redirect_uri: origin + LINE_NATIVE_CALLBACK_PATH,
    state,
    scope: 'profile openid email',
    nonce,
  }).toString()
  return url.toString()
}

export type LineIdentity = { sub: string; name: string | null; picture: string | null; email: string | null }

// 認可コードをトークンに交換し、ID トークンを LINE の検証 API で確かめる
// 戻り値の th は引き渡しトークンのハッシュ
export async function completeLineLogin(origin: string, code: string, state: string) {
  const payload = decodeState(state)
  if (!payload) throw new Error('invalid state')

  const tokenRes = await fetch('https://api.line.me/oauth2/v2.1/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: origin + LINE_NATIVE_CALLBACK_PATH,
      client_id: process.env.LINE_CLIENT_ID!,
      client_secret: process.env.LINE_CLIENT_SECRET!,
    }),
  })
  const tokens = await tokenRes.json()
  if (!tokenRes.ok || !tokens.id_token) throw new Error(`token exchange failed: ${JSON.stringify(tokens)}`)

  const verifyRes = await fetch('https://api.line.me/oauth2/v2.1/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ id_token: tokens.id_token, client_id: process.env.LINE_CLIENT_ID!, nonce: payload.n }),
  })
  const claims = await verifyRes.json()
  if (!verifyRes.ok || !claims.sub) throw new Error(`id_token verify failed: ${JSON.stringify(claims)}`)

  const identity: LineIdentity = {
    sub: claims.sub,
    name: claims.name ?? null,
    picture: claims.picture ?? null,
    email: claims.email ?? null,
  }
  return { identity, tokenHash: payload.th }
}

// Web の LINE ログイン（Auth.js）と同じ accounts 行を使うので、どちらから入っても同じユーザーになる
export async function findOrCreateLineUser(line: LineIdentity) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const linked = await client.query(
      `SELECT u.id FROM users u
       JOIN accounts a ON a."userId" = u.id
       WHERE a.provider = 'line' AND a."providerAccountId" = $1`,
      [line.sub],
    )
    if (linked.rows[0]) {
      await client.query('COMMIT')
      return linked.rows[0].id as string
    }

    // LINE が返すメールアドレスは LINE 側で確認済み。Web 側の設定と同じく同じメールのユーザーに紐付ける
    let user = line.email
      ? (await client.query('SELECT id FROM users WHERE email = $1', [line.email])).rows[0]
      : undefined
    if (!user) {
      user = (await client.query(
        'INSERT INTO users (email, name, image) VALUES ($1, $2, $3) RETURNING id',
        [line.email, line.name, line.picture],
      )).rows[0]
    }
    await client.query(
      `INSERT INTO accounts ("userId", type, provider, "providerAccountId") VALUES ($1, 'oidc', 'line', $2)`,
      [user.id, line.sub],
    )

    await client.query('COMMIT')
    return user.id as string
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}
