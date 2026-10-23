import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { countedToday, findNearbyFriends } from '@/lib/encounters'

// GET: 自分宛ての「会った？」の確認（24 時間以内のもの）
export async function GET() {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json({ items: [] })

  try {
    const items = await sql`
      SELECT er.id, er.created_at, u.name, u.handle, u.image
      FROM encounter_requests er
      JOIN users u ON u.id = er.from_user_id
      WHERE er.to_user_id = ${userId}::uuid AND er.status = 'pending'
        AND er.created_at > NOW() - INTERVAL '24 hours'
      ORDER BY er.created_at
    `
    return Response.json({ items })
  } catch (e) {
    console.error('[GET /api/encounters]', e)
    return Response.json({ items: [] })
  }
}

// POST: 近くにいる友達に「会った？」を送る { handle }
export async function POST(req: Request) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json({ error: 'ログインしてください' }, { status: 401 })

  const { handle } = await req.json().catch(() => ({}))
  if (!handle) return Response.json({ error: '相手を指定してください' }, { status: 400 })

  try {
    // 送れるのは、今「近くにいる人」に出ている相手だけ
    const nearby = await findNearbyFriends(userId)
    const target = nearby.find(n => n.handle === handle)
    if (!target) return Response.json({ error: '近くにいる友達が見つかりません。もう一度さがしてください' }, { status: 404 })
    if (await countedToday(userId, target.id)) {
      return Response.json({ error: '今日はもうこの友達と会った回数に数えています' }, { status: 409 })
    }
    if (!target.requested) {
      await sql`
        INSERT INTO encounter_requests (from_user_id, to_user_id)
        VALUES (${userId}::uuid, ${target.id}::uuid)
      `
      await sql`
        INSERT INTO notifications (user_id, type, from_user_id)
        VALUES (${target.id}::uuid, 'encounter_request', ${userId}::uuid)
      `
    }
    return Response.json({ ok: true })
  } catch (e) {
    console.error('[POST /api/encounters]', e)
    return Response.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
