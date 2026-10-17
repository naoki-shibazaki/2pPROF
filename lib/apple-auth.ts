import { createHash, randomBytes } from 'node:crypto'
import { createRemoteJWKSet, jwtVerify } from 'jose'
import { pool } from '@/lib/db'
import { APP_BUNDLE_ID } from '@/lib/app-id'

// Sign in with Apple（iOS ネイティブ）
// 1. /api/auth/apple/nonce が nonce を発行し、生の値を httpOnly Cookie に保存、ハッシュ値をアプリに返す
// 2. アプリはハッシュ値を nonce として Apple に渡し、identityToken を受け取る
// 3. サーバーは identityToken の署名・iss・aud・exp と、nonce が Cookie の値と一致するかを検証する

export const APPLE_NONCE_COOKIE = 'apple_nonce'

const appleJWKS = createRemoteJWKSet(new URL('https://appleid.apple.com/auth/keys'))

export const hashNonce = (raw: string) => createHash('sha256').update(raw).digest('hex')

export function issueNonce(): { raw: string; hashed: string } {
  const raw = randomBytes(32).toString('base64url')
  return { raw, hashed: hashNonce(raw) }
}

export type AppleIdentity = { sub: string; email: string | null; emailVerified: boolean }

export async function verifyAppleIdentityToken(token: string, rawNonce: string): Promise<AppleIdentity> {
  const { payload } = await jwtVerify(token, appleJWKS, {
    issuer: 'https://appleid.apple.com',
    audience: APP_BUNDLE_ID,
    algorithms: ['RS256'],
    clockTolerance: 30,
  })
  if (!payload.sub) throw new Error('sub がありません')
  if (payload.nonce !== hashNonce(rawNonce)) throw new Error('nonce が一致しません')

  // Apple は email_verified を文字列 "true" で返すことがある
  const emailVerified = payload.email_verified === true || payload.email_verified === 'true'
  return { sub: payload.sub, email: (payload.email as string | undefined) ?? null, emailVerified }
}

// Apple の sub に紐づくユーザーを返す。いなければ確認済みメールで既存ユーザーに紐付けるか、新規作成する
export async function findOrCreateAppleUser(apple: AppleIdentity, fullName: string | null) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const linked = await client.query(
      `SELECT u.id, u.name, u.email, u.image FROM users u
       JOIN accounts a ON a."userId" = u.id
       WHERE a.provider = 'apple' AND a."providerAccountId" = $1`,
      [apple.sub],
    )
    if (linked.rows[0]) {
      await client.query('COMMIT')
      return linked.rows[0]
    }

    let user = apple.email && apple.emailVerified
      ? (await client.query('SELECT id, name, email, image FROM users WHERE email = $1', [apple.email])).rows[0]
      : undefined
    if (!user) {
      user = (await client.query(
        'INSERT INTO users (email, name) VALUES ($1, $2) RETURNING id, name, email, image',
        [apple.email, fullName],
      )).rows[0]
    }
    await client.query(
      `INSERT INTO accounts ("userId", type, provider, "providerAccountId") VALUES ($1, 'oidc', 'apple', $2)`,
      [user.id, apple.sub],
    )

    await client.query('COMMIT')
    return user
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}
