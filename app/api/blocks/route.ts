import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { createReport, REPORT_CONTENT_TYPES, resolveContent, type ReportContentType } from '@/lib/moderation'

// GET: list users I have blocked
export async function GET() {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const myId = (session?.user as any)?.id
  if (!myId) return Response.json([], { status: 401 })

  try {
    const rows = await sql`
      SELECT b.id, b.created_at,
             u.id AS user_id, u.name, u.handle, u.image
      FROM blocks b
      JOIN users u ON u.id = b.blocked_id
      WHERE b.blocker_id = ${myId}::uuid
      ORDER BY b.created_at DESC
    `
    return Response.json(rows)
  } catch (e) {
    console.error('[GET /api/blocks]', e)
    return Response.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS blocks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      blocker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      blocked_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(blocker_id, blocked_id)
    )
  `
}

// POST: ブロックする（{ handle } か、投稿から { contentType, contentId }）
// ブロックすると相手のコンテンツはフィードから即座に消え、開発者にも通知する（Guideline 1.2）
export async function POST(req: Request) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const myId = (session?.user as any)?.id
  if (!myId) return Response.json({ ok: false }, { status: 401 })

  try {
    const { handle, contentType, contentId } = await req.json()
    const type: ReportContentType = REPORT_CONTENT_TYPES.includes(contentType) ? contentType : 'profile'
    const content = await resolveContent(type, contentId ?? null, handle ?? null)
    if (!content) return Response.json({ ok: false }, { status: 404 })
    const targetId = content.authorId

    if (targetId === myId) return Response.json({ ok: false }, { status: 400 })

    await ensureTable()
    await sql`
      INSERT INTO blocks (blocker_id, blocked_id)
      VALUES (${myId}::uuid, ${targetId}::uuid)
      ON CONFLICT DO NOTHING
    `
    // Remove follows in both directions
    await sql`
      DELETE FROM follows
      WHERE (follower_id = ${myId}::uuid AND following_id = ${targetId}::uuid)
         OR (follower_id = ${targetId}::uuid AND following_id = ${myId}::uuid)
    `
    await createReport({
      reporterId: myId, targetUserId: targetId, contentType: type,
      contentId: type === 'profile' ? null : contentId, body: content.body, reason: 'block',
    }).catch(e => console.error('[blocks] report failed', e))
    return Response.json({ ok: true })
  } catch (e) {
    console.error('[POST /api/blocks]', e)
    return Response.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}

// DELETE: unblock a user by handle
export async function DELETE(req: Request) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const myId = (session?.user as any)?.id
  if (!myId) return Response.json({ ok: false }, { status: 401 })

  try {
    const { handle } = await req.json()
    if (!handle) return Response.json({ ok: false }, { status: 400 })

    const targets = await sql`SELECT id FROM users WHERE handle = ${handle}`
    if (!targets[0]) return Response.json({ ok: false }, { status: 404 })
    const targetId = targets[0].id

    await sql`
      DELETE FROM blocks
      WHERE blocker_id = ${myId}::uuid AND blocked_id = ${targetId}::uuid
    `
    return Response.json({ ok: true })
  } catch (e) {
    console.error('[DELETE /api/blocks]', e)
    return Response.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
