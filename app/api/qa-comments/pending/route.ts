import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { blockedUserIds } from '@/lib/moderation'

// GET: pending comments on the authenticated user's Q&A items
export async function GET() {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json([])

  try {
    const rows = await sql`
      SELECT c.id, c.question_hash, c.body, c.created_at, c.author_id,
             u.name AS author_name, u.handle AS author_handle
      FROM qa_comments c
      JOIN users u ON u.id = c.author_id
      WHERE c.target_user_id = ${userId}::uuid
        AND c.status = 'pending'
      ORDER BY c.created_at ASC
    `
    // ブロック関係にあるユーザーのコメントは表示しない
    const blocked = new Set(await blockedUserIds(userId))
    return Response.json(rows.filter(r => !blocked.has(r.author_id)))
  } catch {
    return Response.json([])
  }
}
