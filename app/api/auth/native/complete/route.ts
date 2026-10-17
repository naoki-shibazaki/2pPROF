import { cookies } from 'next/headers'
import { auth } from '@/auth'
import { APP_URL_SCHEME, HANDOFF_COOKIE, saveHandoff } from '@/lib/native-handoff'

// OAuth 完了後にアプリ内ブラウザで開かれる。ユーザーと引き渡し用トークンを紐付け、アプリに戻す
export async function GET() {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id as string | undefined
  const store = await cookies()
  const token = store.get(HANDOFF_COOKIE)?.value

  let ok = false
  if (userId && token) {
    try {
      await saveHandoff(token, userId)
      ok = true
    } catch (e) {
      console.error('[auth/native/complete]', e)
    }
  }
  store.delete({ name: HANDOFF_COOKIE, path: '/api/auth/native' })

  const appUrl = `${APP_URL_SCHEME}://auth/${ok ? 'complete' : 'error'}`
  const html = `<!doctype html>
<html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>2P PROF</title>
<style>
  body{margin:0;min-height:100dvh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;
       background:#080614;color:#c0f0ff;font-family:monospace;text-align:center;padding:24px}
  h1{font-size:18px;color:${ok ? '#38ff78' : '#ff8090'};margin:0}
  p{font-size:13px;color:#40e8ffa0;line-height:1.8;margin:0}
  a{display:inline-block;padding:14px 28px;border:2px solid #40e8ff;color:#40e8ff;text-decoration:none;font-size:14px}
</style></head>
<body>
  <h1>${ok ? '✓ ログインしました' : '⚠ ログインできませんでした'}</h1>
  <p>${ok ? 'アプリに戻ります' : 'アプリに戻ってもう一度お試しください'}</p>
  <a href="${appUrl}">アプリに戻る</a>
  <script>location.href = ${JSON.stringify(appUrl)}</script>
</body></html>`
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } })
}
