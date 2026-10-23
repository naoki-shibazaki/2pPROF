import { auth } from '@/auth'
import { findNearbyFriends, placeDemoFriendsNearby, saveLocation } from '@/lib/encounters'

// POST: 今の位置を保存して、近くにいる友達を返す（「近くの友達をさがす」ボタン）
// 返すのは距離だけで、相手の位置は返さない
export async function POST(req: Request) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json({ error: 'ログインしてください' }, { status: 401 })

  const { lat, lng } = await req.json().catch(() => ({}))
  if (typeof lat !== 'number' || typeof lng !== 'number' || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    return Response.json({ error: '位置情報が正しくありません' }, { status: 400 })
  }

  try {
    await saveLocation(userId, lat, lng)
    await placeDemoFriendsNearby(session?.user?.email, lat, lng)
    return Response.json({ items: await findNearbyFriends(userId) })
  } catch (e) {
    console.error('[POST /api/nearby]', e)
    return Response.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
