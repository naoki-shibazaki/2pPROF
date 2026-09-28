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

// GET: タブ別未読数を返す { hitokoto, friends, others }
export async function GET() {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json({ hitokoto: 0, friends: 0, others: 0 })

  try {
    const rows = await sql`
      SELECT
        COUNT(*) FILTER (WHERE type = 'post_comment')::int AS hitokoto,
        COUNT(*) FILTER (WHERE type = 'followed')::int AS friends,
        COUNT(*) FILTER (WHERE type IN ('introduction', 'question', 'qa_comment'))::int AS others
      FROM notifications
      WHERE user_id = ${userId}::uuid AND read = FALSE
    `
    const r = rows[0] ?? {}
    return Response.json({
      hitokoto: r.hitokoto ?? 0,
      friends:  r.friends  ?? 0,
      others:   r.others   ?? 0,
    })
  } catch {
    await ensureTable().catch(() => {})
    return Response.json({ hitokoto: 0, friends: 0, others: 0 })
  }
}

// POST: 指定タブの通知を既読に { tab: 'hitokoto' | 'friends' | 'others' | 'all' }
export async function POST(req: Request) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json({ ok: false })

  let tab: string = 'all'
  try { tab = (await req.json())?.tab ?? 'all' } catch { /* no body */ }

  const typeMap: Record<string, string[]> = {
    hitokoto: ['post_comment'],
    friends:  ['followed'],
    others:   ['introduction', 'question', 'qa_comment'],
  }

  try {
    if (tab === 'all' || !typeMap[tab]) {
      await sql`
        UPDATE notifications SET read = TRUE
        WHERE user_id = ${userId}::uuid AND read = FALSE
      `
    } else {
      const types = typeMap[tab]
      await sql`
        UPDATE notifications SET read = TRUE
        WHERE user_id = ${userId}::uuid AND read = FALSE
          AND type = ANY(${types}::text[])
      `
    }
  } catch {
    await ensureTable().catch(() => {})
  }
  return Response.json({ ok: true })
}
