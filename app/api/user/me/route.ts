import { auth } from '@/auth'
import { sql } from '@/lib/db'

export async function GET() {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json(null, { status: 401 })

  try {
    const [rows, counts] = await Promise.all([
      sql`SELECT id, name, email, image, handle, bio, onboarded, hp, proximity_count, proximity_mode
          FROM users WHERE id = ${userId}`,
      sql`SELECT
            (SELECT COUNT(*)::int FROM follows WHERE follower_id = ${userId}::uuid) AS following_count,
            (SELECT COUNT(*)::int FROM follows WHERE following_id = ${userId}::uuid) AS followers_count`,
    ])
    if (!rows[0]) return Response.json(null)
    return Response.json({ ...rows[0], following_count: counts[0]?.following_count ?? 0, followers_count: counts[0]?.followers_count ?? 0 })
  } catch (e) {
    console.error('[GET /api/user/me]', e)
    return Response.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
