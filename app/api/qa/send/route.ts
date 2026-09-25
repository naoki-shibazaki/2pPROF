import { auth } from '@/auth'
import { sql } from '@/lib/db'

// POST: send a question to a user by handle
export async function POST(req: Request) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const senderId = (session?.user as any)?.id
  if (!senderId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { handle, question } = await req.json()
  if (!handle || !question?.trim()) return Response.json({ error: 'handle と question は必須です' }, { status: 400 })

  const targets = await sql`SELECT id FROM users WHERE handle = ${handle.replace(/^@/, '')}`
  if (targets.length === 0) return Response.json({ error: 'ユーザーが見つかりません' }, { status: 404 })

  const receiverId = targets[0].id
  if (receiverId === senderId) return Response.json({ error: '自分には送れません' }, { status: 400 })

  await sql`
    INSERT INTO friend_questions (sender_id, receiver_id, question)
    VALUES (${senderId}::uuid, ${receiverId}::uuid, ${question.trim()})
  `

  return Response.json({ ok: true })
}
