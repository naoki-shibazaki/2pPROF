import { auth } from '@/auth'
import { sql } from '@/lib/db'

// GET: 自分の共有設定 + 共有相手リスト
export async function GET() {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json({ mode: 'all', selected: [] })

  const [modeRows, selectedRows] = await Promise.all([
    sql`SELECT location_share_mode FROM users WHERE id = ${userId}::uuid`.catch(() => []),
    sql`
      SELECT u.id, u.handle, u.name
      FROM location_shares ls
      JOIN users u ON u.id = ls.shared_with_id
      WHERE ls.user_id = ${userId}::uuid
      ORDER BY u.handle
    `.catch(() => []),
  ])

  return Response.json({
    mode: modeRows[0]?.location_share_mode ?? 'all',
    selected: selectedRows,
  })
}

// POST: モード変更 or 個別トグル
// { mode: 'all'|'selected'|'off' }  → モード変更
// { toggleId: '...' }               → selected リストに追加/削除
export async function POST(req: Request) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json({ ok: false }, { status: 401 })

  const body = await req.json().catch(() => ({}))

  if (body.mode) {
    await sql`
      UPDATE users SET location_share_mode = ${body.mode}
      WHERE id = ${userId}::uuid
    `
    return Response.json({ ok: true })
  }

  if (body.toggleId) {
    const existing = await sql`
      SELECT id FROM location_shares
      WHERE user_id = ${userId}::uuid AND shared_with_id = ${body.toggleId}::uuid
    `.catch(() => [])

    if (existing.length > 0) {
      await sql`
        DELETE FROM location_shares
        WHERE user_id = ${userId}::uuid AND shared_with_id = ${body.toggleId}::uuid
      `
    } else {
      await sql`
        INSERT INTO location_shares (user_id, shared_with_id)
        VALUES (${userId}::uuid, ${body.toggleId}::uuid)
        ON CONFLICT DO NOTHING
      `
    }
    return Response.json({ ok: true })
  }

  return Response.json({ ok: false }, { status: 400 })
}
