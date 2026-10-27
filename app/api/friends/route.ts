import { auth } from '@/auth'
import { sql } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const session = await auth()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const selfId = (session?.user as any)?.id

    const { searchParams } = new URL(req.url)
    const handle = searchParams.get('handle')

    let targetId: string
    if (handle) {
      const rows = await sql`SELECT id FROM users WHERE handle = ${handle}`
      if (!rows[0]) return Response.json([], { status: 200 })
      targetId = rows[0].id
    } else {
      if (!selfId) return Response.json([], { status: 200 })
      targetId = selfId
    }

    // 会った回数（誰とどのくらい会っているか）は本人にだけ返す
    // 他の人の友達一覧では回数を返さず、並び順も回数に関係ない名前順にする
    if (targetId !== selfId) {
      const rows = await sql`
        SELECT u.id, u.name, u.handle, u.image
        FROM follows f
        JOIN users u ON u.id = f.following_id
        WHERE f.follower_id = ${targetId}::uuid
        ORDER BY u.name NULLS LAST, u.handle
      `
      return Response.json(rows)
    }

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
        (pe.user_a_id = ${targetId}::uuid AND pe.user_b_id = u.id)
        OR
        (pe.user_a_id = u.id AND pe.user_b_id = ${targetId}::uuid)
      WHERE f.follower_id = ${targetId}::uuid
      GROUP BY u.id, u.name, u.handle, u.image
      ORDER BY COUNT(pe.id) DESC, u.name
    `

    return Response.json(rows)
  } catch (e) {
    console.error('[/api/friends]', e)
    return Response.json([], { status: 200 })
  }
}
