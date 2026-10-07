import { auth } from '@/auth'
import { sql } from '@/lib/db'

// POST: send a question to a user by handle
export async function POST(req: Request) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const senderId = (session?.user as any)?.id
  if (!senderId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { handle, question, anonymous } = await req.json()
    if (!handle || !question?.trim()) return Response.json({ error: 'handle と question は必須です' }, { status: 400 })

    const targets = await sql`SELECT id FROM users WHERE handle = ${handle.replace(/^@/, '')}`
    if (targets.length === 0) return Response.json({ error: 'ユーザーが見つかりません' }, { status: 404 })

    const receiverId = targets[0].id
    if (receiverId === senderId) return Response.json({ error: '自分には送れません' }, { status: 400 })

    // Block check (either direction)
    const blocked = await sql`
      SELECT 1 FROM blocks
      WHERE (blocker_id = ${senderId}::uuid AND blocked_id = ${receiverId}::uuid)
         OR (blocker_id = ${receiverId}::uuid AND blocked_id = ${senderId}::uuid)
      LIMIT 1
    `.catch(() => [])
    if (blocked.length > 0) return Response.json({ error: 'ブロックされているため送信できません' }, { status: 403 })

    const isAnon = anonymous === true

    try {
      await sql`
        INSERT INTO friend_questions (sender_id, receiver_id, question, anonymous)
        VALUES (${senderId}::uuid, ${receiverId}::uuid, ${question.trim()}, ${isAnon})
      `
    } catch {
      // anonymous column may not exist yet — add it then retry
      await sql`ALTER TABLE friend_questions ADD COLUMN IF NOT EXISTS anonymous BOOLEAN DEFAULT FALSE`.catch(() => {})
      await sql`
        INSERT INTO friend_questions (sender_id, receiver_id, question, anonymous)
        VALUES (${senderId}::uuid, ${receiverId}::uuid, ${question.trim()}, ${isAnon})
      `
    }

    // 質問受信通知
    await sql`
      INSERT INTO notifications (user_id, type, from_user_id)
      VALUES (${receiverId}::uuid, 'question', ${senderId}::uuid)
    `.catch(() => {})

    return Response.json({ ok: true })
  } catch (e) {
    console.error('[POST /api/qa/send]', e)
    return Response.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
