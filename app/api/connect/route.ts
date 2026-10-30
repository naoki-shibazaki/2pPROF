import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { CONNECT_MESSAGE_MAX, ensureConnectionsTable } from '@/lib/common'

const DAILY_LIMIT = 20

// POST { a, b, message }: 自分の友達 a と b を「この 2 人、合いそう」と紹介する。2 人に通知が届く
export async function POST(req: Request) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const me = (session?.user as any)?.id as string | undefined
  if (!me) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { a, b, message } = await req.json()
    const text = typeof message === 'string' ? message.trim() : ''
    if (!text) return Response.json({ error: '紹介の一言を書いてください' }, { status: 400 })
    if (text.length > CONNECT_MESSAGE_MAX) return Response.json({ error: `一言は ${CONNECT_MESSAGE_MAX} 文字までです` }, { status: 400 })
    if (!a || !b || a === b) return Response.json({ error: '紹介する 2 人を選んでください' }, { status: 400 })

    await ensureConnectionsTable()
    const users = await sql`SELECT id, handle FROM users WHERE handle IN (${a}, ${b}) AND onboarded = TRUE`
    const ida = users.find(u => u.handle === a)?.id as string | undefined
    const idb = users.find(u => u.handle === b)?.id as string | undefined
    if (!ida || !idb || ida === me || idb === me) return Response.json({ error: 'ユーザーが見つかりません' }, { status: 404 })

    // 紹介できるのは、自分がフォローしている友達どうしだけ
    const f = await sql`SELECT COUNT(*)::int AS n FROM follows WHERE follower_id = ${me}::uuid AND following_id IN (${ida}::uuid, ${idb}::uuid)`
    if (f[0].n < 2) return Response.json({ error: 'フォローしている友達どうしだけ紹介できます' }, { status: 403 })
    // 3 人の誰かがブロックしあっていたら紹介しない
    const blocked = await sql`
      SELECT 1 FROM blocks
      WHERE blocker_id = ANY(${[me, ida, idb]}::uuid[]) AND blocked_id = ANY(${[me, ida, idb]}::uuid[])
      LIMIT 1
    `.catch(() => [])
    if (blocked.length) return Response.json({ error: 'この 2 人は紹介できません' }, { status: 403 })

    const [today] = await sql`SELECT COUNT(*)::int AS n FROM connections WHERE introducer_id = ${me}::uuid AND created_at > NOW() - INTERVAL '1 day'`
    if (today.n >= DAILY_LIMIT) return Response.json({ error: '今日はもう紹介できません。また明日どうぞ' }, { status: 429 })

    const [lo, hi] = ida < idb ? [ida, idb] : [idb, ida]
    const inserted = await sql`
      INSERT INTO connections (introducer_id, a_id, b_id, message)
      VALUES (${me}::uuid, ${lo}::uuid, ${hi}::uuid, ${text})
      ON CONFLICT DO NOTHING
      RETURNING id
    `
    if (!inserted[0]) return Response.json({ error: 'この 2 人はもう紹介しています' }, { status: 409 })

    await sql`
      INSERT INTO notifications (user_id, type, from_user_id, ref_user_id)
      VALUES (${ida}::uuid, 'connected', ${me}::uuid, ${idb}::uuid), (${idb}::uuid, 'connected', ${me}::uuid, ${ida}::uuid)
    `
    return Response.json({ ok: true })
  } catch (e) {
    console.error('[POST /api/connect]', e)
    return Response.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
