import { auth } from '@/auth'
import { sql } from '@/lib/db'

// GET: current user's own pending comment for a specific Q&A item
// ?handle=xxx&qhash=yyy
export async function GET(req: Request) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const authorId = (session?.user as any)?.id
  if (!authorId) return Response.json(null)

  const { searchParams } = new URL(req.url)
  const handle = searchParams.get('handle')
  const qhash = searchParams.get('qhash')
  if (!handle || !qhash) return Response.json(null)

  try {
    const targets = await sql`SELECT id FROM users WHERE handle = ${handle}`
    if (!targets[0]) return Response.json(null)
    const targetId = targets[0].id

    const rows = await sql`
      SELECT id, body, created_at
      FROM qa_comments
      WHERE target_user_id = ${targetId}::uuid
        AND question_hash = ${qhash}
        AND author_id = ${authorId}::uuid
        AND status = 'pending'
      LIMIT 1
    `
    return Response.json(rows[0] ?? null)
  } catch {
    return Response.json(null)
  }
}
