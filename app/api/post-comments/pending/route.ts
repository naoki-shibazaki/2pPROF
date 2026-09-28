import { auth } from '@/auth'
import { sql } from '@/lib/db'

// GET: 自分の投稿に届いたpendingコメント一覧
export async function GET() {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json([])

  const rows = await sql`
    SELECT c.id, c.post_id, c.body, c.created_at,
           u.name AS author_name, u.handle AS author_handle
    FROM post_comments c
    JOIN posts p ON p.id = c.post_id
    JOIN users u ON u.id = c.author_id
    WHERE p.user_id = ${userId}::uuid
      AND c.status = 'pending'
    ORDER BY c.created_at ASC
  `.catch(() => [])

  return Response.json(rows)
}
