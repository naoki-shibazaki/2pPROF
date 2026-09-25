import { auth } from '@/auth'
import { sql } from '@/lib/db'

// GET: get invite info (creator's name/handle)
export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params

  const rows = await sql`
    SELECT u.id, u.name, u.handle, u.image
    FROM invite_tokens it
    JOIN users u ON u.id = it.creator_id
    WHERE it.token = ${token}
      AND it.expires_at > NOW()
  `
  if (rows.length === 0) return Response.json({ error: '招待リンクが無効または期限切れです' }, { status: 404 })

  return Response.json(rows[0])
}

// POST: accept invite (follow creator)
export async function POST(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { token } = await params

  const rows = await sql`
    SELECT creator_id FROM invite_tokens
    WHERE token = ${token} AND expires_at > NOW()
  `
  if (rows.length === 0) return Response.json({ error: '招待リンクが無効または期限切れです' }, { status: 404 })

  const creatorId = rows[0].creator_id
  if (creatorId === userId) return Response.json({ error: '自分の招待リンクは使えません' }, { status: 400 })

  // Follow creator
  await sql`
    INSERT INTO follows (follower_id, following_id)
    VALUES (${userId}::uuid, ${creatorId}::uuid)
    ON CONFLICT DO NOTHING
  `

  // Get creator handle for redirect
  const user = await sql`SELECT handle FROM users WHERE id = ${creatorId}::uuid`

  return Response.json({ ok: true, handle: user[0]?.handle })
}
