import { auth } from '@/auth'
import { sql } from '@/lib/db'

export async function GET(_req: Request, { params }: { params: Promise<{ handle: string }> }) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const myId = (session?.user as any)?.id

  const { handle } = await params

  const rows = await sql`
    SELECT id, name, handle, image, bio
    FROM users WHERE handle = ${handle}
  `
  if (rows.length === 0) return Response.json(null, { status: 404 })

  const user = rows[0]

  // Per-pair proximity count (viewer → this user)
  let proximityCount = 0
  if (myId) {
    const pe = await sql`
      SELECT COUNT(*)::int AS cnt FROM proximity_events
      WHERE (user_a_id = ${myId}::uuid AND user_b_id = ${user.id}::uuid)
         OR (user_a_id = ${user.id}::uuid AND user_b_id = ${myId}::uuid)
    `
    proximityCount = pe[0]?.cnt ?? 0
  }

  return Response.json({ ...user, proximityCount })
}
