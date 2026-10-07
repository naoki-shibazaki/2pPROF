import { auth } from '@/auth'
import { sql } from '@/lib/db'

// GET: 自分に位置を共有している友達の現在位置（10分以内に更新）
// 相手の location_share_mode に従ってフィルタリング
export async function GET() {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json([])

  try {
    const rows = await sql`
      SELECT u.handle, u.name, ul.lat, ul.lng, ul.updated_at
      FROM follows f1
      JOIN follows f2
        ON f2.follower_id = f1.followed_id
       AND f2.followed_id = f1.follower_id
      JOIN users u ON u.id = f1.followed_id
      JOIN user_locations ul ON ul.user_id = u.id
      WHERE f1.follower_id = ${userId}::uuid
        AND ul.updated_at > NOW() - INTERVAL '10 minutes'
        AND (
          -- 'all': 全員に共有
          u.location_share_mode = 'all'
          OR
          -- 'selected': 選んだ人のみ（自分がそのリストに入っているか確認）
          (
            u.location_share_mode = 'selected'
            AND EXISTS (
              SELECT 1 FROM location_shares ls
              WHERE ls.user_id = u.id
                AND ls.shared_with_id = ${userId}::uuid
            )
          )
          -- 'off' のときは除外
        )
      ORDER BY ul.updated_at DESC
    `

    return Response.json(rows)
  } catch (e) {
    console.error('[GET /api/location/friends]', e)
    return Response.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
