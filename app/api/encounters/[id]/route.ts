import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { countBetween, countedToday } from '@/lib/encounters'

// POST: 届いた「会った？」に答える { met: boolean }
// 会ったなら会った回数を 1 増やし、送った側に知らせる
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json({ error: 'ログインしてください' }, { status: 401 })

  const { id } = await params
  const { met } = await req.json().catch(() => ({}))

  try {
    const [request] = await sql`
      UPDATE encounter_requests SET status = ${met ? 'accepted' : 'declined'}, responded_at = NOW()
      WHERE id = ${id}::uuid AND to_user_id = ${userId}::uuid AND status = 'pending'
      RETURNING from_user_id
    `
    if (!request) return Response.json({ error: 'この確認はもう終わっています' }, { status: 404 })
    const fromId = request.from_user_id as string

    // 同じ相手からの確認がほかに残っていたら一緒に片付ける
    await sql`
      UPDATE encounter_requests SET status = 'declined', responded_at = NOW()
      WHERE status = 'pending'
        AND ((from_user_id = ${fromId}::uuid AND to_user_id = ${userId}::uuid) OR (from_user_id = ${userId}::uuid AND to_user_id = ${fromId}::uuid))
    `
    await sql`
      UPDATE notifications SET read = TRUE
      WHERE user_id = ${userId}::uuid AND from_user_id = ${fromId}::uuid AND type = 'encounter_request'
    `

    if (met && !(await countedToday(userId, fromId))) {
      await sql`INSERT INTO proximity_events (user_a_id, user_b_id) VALUES (${fromId}::uuid, ${userId}::uuid)`
      await sql`
        INSERT INTO notifications (user_id, type, from_user_id)
        VALUES (${fromId}::uuid, 'encounter_confirmed', ${userId}::uuid)
      `
    }
    return Response.json({ ok: true, count: await countBetween(userId, fromId) })
  } catch (e) {
    console.error('[POST /api/encounters/[id]]', e)
    return Response.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
