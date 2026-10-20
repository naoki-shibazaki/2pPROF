import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { blockedUserIds } from '@/lib/moderation'
import { getUserPlan, LIMITS } from '@/lib/plan'

// GET: received questions (inbox)
export async function GET() {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json(null, { status: 401 })

  try {
    const plan = await getUserPlan(userId)
    const limit = LIMITS[plan].questions

    const total = await sql`
      SELECT COUNT(*)::int AS count
      FROM friend_questions
      WHERE receiver_id = ${userId}::uuid
    `
    const totalCount: number = total[0]?.count ?? 0

    const rows = limit === Infinity
      ? await sql`
          SELECT
            fq.id, fq.question, fq.answer, fq.answered_at, fq.created_at, fq.anonymous, fq.sender_id,
            u.name AS sender_name, u.handle AS sender_handle
          FROM friend_questions fq
          LEFT JOIN users u ON u.id = fq.sender_id
          WHERE fq.receiver_id = ${userId}::uuid
          ORDER BY fq.created_at DESC
        `
      : await sql`
          SELECT
            fq.id, fq.question, fq.answer, fq.answered_at, fq.created_at, fq.anonymous, fq.sender_id,
            u.name AS sender_name, u.handle AS sender_handle
          FROM friend_questions fq
          LEFT JOIN users u ON u.id = fq.sender_id
          WHERE fq.receiver_id = ${userId}::uuid
          ORDER BY fq.created_at DESC
          LIMIT ${limit}
        `

    const locked = plan === 'free' && totalCount > limit
    // ブロック関係にあるユーザーからの質問は表示しない。匿名の質問の送信者はクライアントに渡さない
    const blocked = new Set(await blockedUserIds(userId))
    const items = rows
      .filter(r => !blocked.has(r.sender_id))
      .map(({ sender_id: _senderId, ...r }) => (r.anonymous ? { ...r, sender_name: null, sender_handle: null } : r))
    return Response.json({ items, total: totalCount, locked })
  } catch (e) {
    console.error('[GET /api/qa]', e)
    return Response.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
