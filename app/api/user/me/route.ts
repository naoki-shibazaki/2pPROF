import { auth } from '@/auth'
import { getMe } from '@/lib/me'

export async function GET() {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json(null, { status: 401 })

  try {
    return Response.json(await getMe(userId))
  } catch (e) {
    console.error('[GET /api/user/me]', e)
    return Response.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
