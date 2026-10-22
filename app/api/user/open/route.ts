import { auth } from '@/auth'
import { recordOpen } from '@/lib/hp'

// アプリの起動・復帰のたびに呼ぶ。HP（今日開ける残り回数）を 1 減らして返す
export async function POST() {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json(null, { status: 401 })
  try {
    return Response.json(await recordOpen(userId, session?.user?.email))
  } catch (e) {
    console.error('[POST /api/user/open]', e)
    return Response.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
