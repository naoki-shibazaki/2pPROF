import { cookies } from 'next/headers'
import { APPLE_NONCE_COOKIE, issueNonce } from '@/lib/apple-auth'

// Sign in with Apple 用の使い捨て nonce を発行する（5分で失効）
export async function POST() {
  const { raw, hashed } = issueNonce()
  const store = await cookies()
  store.set(APPLE_NONCE_COOKIE, raw, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/auth',
    maxAge: 300,
  })
  return Response.json({ nonce: hashed })
}
