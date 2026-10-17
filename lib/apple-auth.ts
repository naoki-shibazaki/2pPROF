import { createPublicKey, verify, type JsonWebKey } from 'node:crypto'

// ネイティブの Sign in with Apple が返す identityToken を Apple の公開鍵で検証する
// ネイティブのトークンは aud が Bundle ID になる（Web の Services ID ではない）
const APPLE_BUNDLE_ID = process.env.APPLE_NATIVE_BUNDLE_ID ?? 'com.twopprof.app'

type AppleJWK = JsonWebKey & { kid: string }
let jwksCache: { keys: AppleJWK[]; cachedAt: number } | null = null

async function getAppleJWKS(): Promise<AppleJWK[]> {
  if (jwksCache && Date.now() - jwksCache.cachedAt < 3600_000) return jwksCache.keys
  const res = await fetch('https://appleid.apple.com/auth/keys')
  if (!res.ok) throw new Error('Failed to fetch Apple JWKS')
  const data = (await res.json()) as { keys: AppleJWK[] }
  jwksCache = { keys: data.keys, cachedAt: Date.now() }
  return data.keys
}

export async function verifyAppleIdToken(idToken: string): Promise<{ sub: string; email?: string }> {
  const parts = idToken.split('.')
  if (parts.length !== 3) throw new Error('invalid id_token')

  const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString()) as { kid?: string; alg?: string }
  if (header.alg !== 'RS256') throw new Error('unexpected alg')

  const jwk = (await getAppleJWKS()).find(k => k.kid === header.kid)
  if (!jwk) throw new Error('no matching JWKS key')

  const publicKey = createPublicKey({ key: jwk, format: 'jwk' })
  const valid = verify('SHA256', Buffer.from(`${parts[0]}.${parts[1]}`), publicKey, Buffer.from(parts[2], 'base64url'))
  if (!valid) throw new Error('invalid signature')

  const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString()) as {
    iss?: string; aud?: string; exp?: number; sub?: string; email?: string
  }
  if (payload.iss !== 'https://appleid.apple.com') throw new Error('invalid iss')
  if (payload.aud !== APPLE_BUNDLE_ID) throw new Error(`invalid aud: ${payload.aud}`)
  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) throw new Error('token expired')
  if (!payload.sub) throw new Error('no sub')

  return { sub: payload.sub, email: payload.email }
}
