import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { getUnreadCounts } from '@/lib/me'

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
    return Response.json(await getUnreadCounts(userId))
  } catch {
    await ensureTable().catch(() => {})
    return Response.json({ hitokoto: 0, friends: 0, others: 0 })
  }
}

// POST: 指定タブの通知を既読に { tab: 'hitokoto' | 'friends' | 'others' | 'all' }、または 1 件だけ { id }
export async function POST(req: Request) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json({ ok: false })

  let tab: string = 'all'
  let id: string | null = null
  try {
    const body = await req.json()
    tab = body?.tab ?? 'all'
    id = typeof body?.id === 'string' ? body.id : null
  } catch { /* no body */ }

  const typeMap: Record<string, string[]> = {
    hitokoto: ['post_comment'],
    friends:  ['followed', 'encounter_request', 'encounter_confirmed', 'connected'],
    others:   ['introduction', 'question', 'qa_comment'],
  }

  try {
    // 通知を 1 件タップしたときは、その 1 件だけ既読にする
    if (id) {
      await sql`
        UPDATE notifications SET read = TRUE
        WHERE id = ${id}::uuid AND user_id = ${userId}::uuid
      `
    } else if (tab === 'all' || !typeMap[tab]) {
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
