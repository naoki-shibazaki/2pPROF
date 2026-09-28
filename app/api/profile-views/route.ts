import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { getUserPlan } from '@/lib/plan'

// POST: プロフィール閲覧を記録
export async function POST(req: Request) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const viewerId = (session?.user as any)?.id
  if (!viewerId) return Response.json({ ok: false }, { status: 401 })

  const { handle } = await req.json()
  if (!handle) return Response.json({ ok: false }, { status: 400 })

  const targets = await sql`SELECT id FROM users WHERE handle = ${handle}`
  const viewedId = targets[0]?.id
  if (!viewedId) return Response.json({ ok: false }, { status: 404 })

  // 自分→自分はスキップ
  if (viewerId === viewedId) return Response.json({ ok: true })

  // ブロック確認（どちらかがブロックしていればスキップ）
  const blocked = await sql`
    SELECT id FROM blocks
    WHERE (blocker_id = ${viewerId}::uuid AND blocked_id = ${viewedId}::uuid)
       OR (blocker_id = ${viewedId}::uuid AND blocked_id = ${viewerId}::uuid)
    LIMIT 1
  `
  if (blocked.length > 0) return Response.json({ ok: true })

  await sql`
    INSERT INTO profile_views (viewer_id, viewed_id)
    VALUES (${viewerId}::uuid, ${viewedId}::uuid)
  `.catch(() => {})

  return Response.json({ ok: true })
}

// GET: 訪問者リスト（?handle=xxx で閲覧されたユーザーを指定、自分のみ取得可）
export async function GET(req: Request) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json(null, { status: 401 })

  const { searchParams } = new URL(req.url)
  const handle = searchParams.get('handle')

  let targetId = userId
  if (handle) {
    const rows = await sql`SELECT id FROM users WHERE handle = ${handle}`
    targetId = rows[0]?.id ?? null
    if (!targetId) return Response.json({ viewers: [], locked: false })
    // 自分のプロフィールのみ閲覧者を確認できる
    if (targetId !== userId) return Response.json(null, { status: 403 })
  }

  const plan = await getUserPlan(userId)

  if (plan === 'free') {
    return Response.json({ viewers: [], locked: true })
  }

  let viewers
  if (plan === 'lite') {
    // 直近1時間
    viewers = await sql`
      SELECT DISTINCT ON (pv.viewer_id)
        pv.viewer_id AS id,
        pv.created_at,
        u.name,
        u.handle,
        u.image
      FROM profile_views pv
      JOIN users u ON u.id = pv.viewer_id
      WHERE pv.viewed_id = ${targetId}::uuid
        AND pv.created_at >= NOW() - INTERVAL '6 hours'
      ORDER BY pv.viewer_id, pv.created_at DESC
    `
  } else {
    // premium: 全履歴
    viewers = await sql`
      SELECT DISTINCT ON (pv.viewer_id)
        pv.viewer_id AS id,
        pv.created_at,
        u.name,
        u.handle,
        u.image
      FROM profile_views pv
      JOIN users u ON u.id = pv.viewer_id
      WHERE pv.viewed_id = ${targetId}::uuid
      ORDER BY pv.viewer_id, pv.created_at DESC
    `
  }

  return Response.json({ viewers, locked: false })
}
