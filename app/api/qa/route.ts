import { auth } from '@/auth'
import { sql } from '@/lib/db'

// GET: received questions (inbox)
export async function GET() {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json(null, { status: 401 })

  const rows = await sql`
    SELECT
      fq.id,
      fq.question,
      fq.answer,
      fq.answered_at,
      fq.created_at,
      u.name AS sender_name,
      u.handle AS sender_handle
    FROM friend_questions fq
    LEFT JOIN users u ON u.id = fq.sender_id
    WHERE fq.receiver_id = ${userId}::uuid
    ORDER BY fq.created_at DESC
  `

  return Response.json(rows)
}
