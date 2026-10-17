import { SignJWT, importPKCS8 } from 'jose'
import { sql } from '@/lib/db'
import { APP_BUNDLE_ID } from '@/lib/app-id'

// アカウント削除時の Sign in with Apple 連携解除（App Store Review Guideline 5.1.1(v)）
// 1. サインイン時に authorizationCode を refresh_token に交換し、accounts.refresh_token に保存する
// 2. 削除時にその refresh_token を Apple の /auth/revoke で取り消す
// どちらも Apple Developer で作った Sign in with Apple 用の鍵（.p8）で client_secret を作る

const APPLE_AUTH = 'https://appleid.apple.com/auth'

function config() {
  const { APPLE_TEAM_ID, APPLE_KEY_ID, APPLE_PRIVATE_KEY } = process.env
  if (!APPLE_TEAM_ID || !APPLE_KEY_ID || !APPLE_PRIVATE_KEY) return null
  // Vercel の環境変数では改行が \n の文字列になっていることがある
  return { teamId: APPLE_TEAM_ID, keyId: APPLE_KEY_ID, privateKey: APPLE_PRIVATE_KEY.replace(/\\n/g, '\n') }
}

async function clientSecret() {
  const c = config()
  if (!c) return null
  const key = await importPKCS8(c.privateKey, 'ES256')
  return new SignJWT({})
    .setProtectedHeader({ alg: 'ES256', kid: c.keyId })
    .setIssuer(c.teamId)
    .setSubject(APP_BUNDLE_ID)
    .setAudience('https://appleid.apple.com')
    .setIssuedAt()
    .setExpirationTime('5m')
    .sign(key)
}

// サインイン時に呼ぶ。失敗してもサインイン自体は止めない
export async function storeAppleRefreshToken(appleSub: string, authorizationCode: string) {
  try {
    const secret = await clientSecret()
    if (!secret) return
    const res = await fetch(`${APPLE_AUTH}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: APP_BUNDLE_ID,
        client_secret: secret,
        code: authorizationCode,
        grant_type: 'authorization_code',
      }),
    })
    const data = await res.json()
    if (!res.ok || !data.refresh_token) throw new Error(JSON.stringify(data))
    await sql`
      UPDATE accounts SET refresh_token = ${data.refresh_token}
      WHERE provider = 'apple' AND "providerAccountId" = ${appleSub}
    `
  } catch (e) {
    console.error('[apple] refresh_token exchange failed', e)
  }
}

// アカウント削除時に呼ぶ。トークンが保存されていないユーザー（鍵の設定前にサインインした人）は何もしない
export async function revokeAppleTokens(userId: string) {
  const rows = await sql`
    SELECT refresh_token FROM accounts
    WHERE "userId" = ${userId}::uuid AND provider = 'apple' AND refresh_token IS NOT NULL
  `
  if (rows.length === 0) return
  const secret = await clientSecret()
  if (!secret) {
    console.error('[apple] revoke skipped: APPLE_* env not set')
    return
  }
  for (const { refresh_token } of rows) {
    const res = await fetch(`${APPLE_AUTH}/revoke`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: APP_BUNDLE_ID,
        client_secret: secret,
        token: refresh_token,
        token_type_hint: 'refresh_token',
      }),
    })
    if (!res.ok) console.error('[apple] revoke failed', res.status, await res.text())
  }
}
