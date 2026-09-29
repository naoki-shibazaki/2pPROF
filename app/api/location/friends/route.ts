import { auth } from '@/auth'
import { sql } from '@/lib/db'

// GET: 相互フォロー中の友達の現在位置（10分以内に更新）
export async function GET() {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json([])

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
      AND (u.proximity_mode IS NULL OR u.proximity_mode = 'on')
    ORDER BY ul.updated_at DESC
  `.catch(() => [])

  return Response.json(rows)
}
