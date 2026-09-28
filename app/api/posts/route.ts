import { auth } from '@/auth'
import { sql } from '@/lib/db'

// GET: フィード（自分＋フォロー中のユーザーの投稿）
export async function GET() {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json(null, { status: 401 })

  const rows = await sql`
    SELECT
      p.id, p.body, p.created_at,
      u.id AS user_id, u.name, u.handle, u.image
    FROM posts p
    JOIN users u ON u.id = p.user_id
    WHERE p.user_id = ${userId}::uuid
       OR p.user_id IN (
         SELECT following_id FROM follows WHERE follower_id = ${userId}::uuid
       )
    ORDER BY p.created_at DESC
    LIMIT 50
  `

  return Response.json(rows)
}

// POST: 投稿する
export async function POST(req: Request) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json({ ok: false }, { status: 401 })

  const { body } = await req.json()
  const trimmed = body?.trim()
  if (!trimmed || trimmed.length > 100) return Response.json({ ok: false }, { status: 400 })

  const rows = await sql`
    INSERT INTO posts (user_id, body)
    VALUES (${userId}::uuid, ${trimmed})
    RETURNING id, body, created_at
  `

  return Response.json({ ok: true, post: rows[0] })
}
