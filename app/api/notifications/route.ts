import { auth } from '@/auth'
import { sql } from '@/lib/db'

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS notifications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      from_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
      read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS idx_notif_user ON notifications(user_id, read)`
}

// GET: 未読数を返す
export async function GET() {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json({ count: 0 })

  try {
    const rows = await sql`
      SELECT COUNT(*)::int AS count FROM notifications
      WHERE user_id = ${userId}::uuid AND read = FALSE
    `
    return Response.json({ count: rows[0]?.count ?? 0 })
  } catch {
    // テーブルが存在しない場合は作成して0を返す
    await ensureTable().catch(() => {})
    return Response.json({ count: 0 })
  }
}

// POST: 全通知を既読にする
export async function POST() {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json({ ok: false })

  try {
    await sql`
      UPDATE notifications SET read = TRUE
      WHERE user_id = ${userId}::uuid AND read = FALSE
    `
  } catch {
    await ensureTable().catch(() => {})
  }
  return Response.json({ ok: true })
}
