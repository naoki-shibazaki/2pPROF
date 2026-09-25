import { auth } from '@/auth'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    const session = await auth()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session?.user as any)?.id
    if (!userId) return Response.json([], { status: 200 })

    const rows = await sql`
      SELECT
        u.id,
        u.name,
        u.handle,
        u.image,
        COUNT(pe.id)::int AS proximity_count
      FROM follows f
      JOIN users u ON u.id = f.following_id
      LEFT JOIN proximity_events pe ON
        (pe.user_a_id = ${userId}::uuid AND pe.user_b_id = u.id)
        OR
        (pe.user_a_id = u.id AND pe.user_b_id = ${userId}::uuid)
      WHERE f.follower_id = ${userId}::uuid
      GROUP BY u.id, u.name, u.handle, u.image
      ORDER BY COUNT(pe.id) DESC, u.name
    `

    return Response.json(rows)
  } catch (e) {
    console.error('[/api/friends]', e)
    return Response.json([], { status: 200 })
  }
}
