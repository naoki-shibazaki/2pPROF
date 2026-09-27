import { auth } from '@/auth'
import { sql } from '@/lib/db'

// GET: pending comments on the authenticated user's Q&A items
export async function GET() {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json([])

  try {
    const rows = await sql`
      SELECT c.id, c.question_hash, c.body, c.created_at,
             u.name AS author_name, u.handle AS author_handle
      FROM qa_comments c
      JOIN users u ON u.id = c.author_id
      WHERE c.target_user_id = ${userId}::uuid
        AND c.status = 'pending'
      ORDER BY c.created_at ASC
    `
    return Response.json(rows)
  } catch {
    return Response.json([])
  }
}
