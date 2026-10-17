import { cookies } from 'next/headers'
import { auth } from '@/auth'
import { HANDOFF_COOKIE, handoffPage, saveHandoff } from '@/lib/native-handoff'

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

  return handoffPage(ok)
}
