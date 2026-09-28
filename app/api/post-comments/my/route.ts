import { auth } from '@/auth'
import { sql } from '@/lib/db'

// GET: 自分のpendingコメント（特定の投稿）?postId=xxx
export async function GET(req: Request) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const authorId = (session?.user as any)?.id
  if (!authorId) return Response.json(null)

  const { searchParams } = new URL(req.url)
  const postId = searchParams.get('postId')
  if (!postId) return Response.json(null)

  const rows = await sql`
    SELECT id, body, created_at
    FROM post_comments
    WHERE post_id = ${postId}::uuid
      AND author_id = ${authorId}::uuid
      AND status = 'pending'
    LIMIT 1
  `.catch(() => [])

  return Response.json(rows[0] ?? null)
}
