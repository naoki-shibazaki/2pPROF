import { cookies } from 'next/headers'
import { signIn } from '@/auth'
import { lineAuthorizeUrl } from '@/lib/line-native'
import { HANDOFF_COOKIE, NATIVE_PROVIDERS, type NativeProvider } from '@/lib/native-handoff'

// アプリ内ブラウザで開かれる。引き渡し用トークンを Cookie に保存して OAuth を開始する
export async function GET(req: Request) {
  const url = new URL(req.url)
  const provider = url.searchParams.get('provider') as NativeProvider
  const token = url.searchParams.get('token') ?? ''
  if (!NATIVE_PROVIDERS.includes(provider) || !/^[A-Za-z0-9_-]{32,128}$/.test(token)) {
    return new Response('Bad Request', { status: 400 })
  }

  // LINE は戻り先が Safari になることがあるため、Cookie を使わない専用の経路にする
  if (provider === 'line') {
    return Response.redirect(lineAuthorizeUrl(url.origin, token), 302)
  }

  const store = await cookies()
  store.set(HANDOFF_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/auth/native',
    maxAge: 600,
  })

  // signIn は OAuth 画面へのリダイレクトを投げる
  await signIn(provider, { redirectTo: '/api/auth/native/complete' })
}
