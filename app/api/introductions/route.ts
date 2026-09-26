import { auth } from '@/auth'
import { sql } from '@/lib/db'

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS introductions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      target_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      body TEXT NOT NULL,
      met_year SMALLINT,
      met_month SMALLINT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(target_id, author_id)
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS idx_intro_target ON introductions(target_id)`
  await sql`ALTER TABLE introductions ADD COLUMN IF NOT EXISTS met_year SMALLINT`.catch(() => {})
  await sql`ALTER TABLE introductions ADD COLUMN IF NOT EXISTS met_month SMALLINT`.catch(() => {})
}

// GET: 自分宛の紹介文一覧
export async function GET() {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json([])

  try {
    const rows = await sql`
      SELECT i.id, i.body, i.met_year, i.met_month, i.created_at,
             u.name AS author_name, u.handle AS author_handle
      FROM introductions i
      JOIN users u ON u.id = i.author_id
      WHERE i.target_id = ${userId}::uuid
      ORDER BY i.created_at DESC
    `
    return Response.json(rows)
  } catch {
    await ensureTable().catch(() => {})
    return Response.json([])
  }
}

// POST: 紹介文を書く / 更新する
export async function POST(req: Request) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const authorId = (session?.user as any)?.id
  if (!authorId) return Response.json({ ok: false }, { status: 401 })

  const { handle, body, metYear, metMonth } = await req.json()
  if (!handle || !body?.trim()) return Response.json({ ok: false }, { status: 400 })

  const targets = await sql`SELECT id FROM users WHERE handle = ${handle}`
  if (!targets[0]) return Response.json({ ok: false }, { status: 404 })
  const targetId = targets[0].id

  if (targetId === authorId) return Response.json({ ok: false }, { status: 400 })

  const year = metYear ? Number(metYear) : null
  const month = metMonth ? Number(metMonth) : null

  try {
    await sql`
      INSERT INTO introductions (target_id, author_id, body, met_year, met_month)
      VALUES (${targetId}::uuid, ${authorId}::uuid, ${body.trim()}, ${year}, ${month})
      ON CONFLICT (target_id, author_id) DO UPDATE
        SET body = EXCLUDED.body, met_year = EXCLUDED.met_year, met_month = EXCLUDED.met_month, created_at = NOW()
    `
    await sql`
      INSERT INTO notifications (user_id, type, from_user_id)
      VALUES (${targetId}::uuid, 'introduction', ${authorId}::uuid)
    `.catch(() => {})
    return Response.json({ ok: true })
  } catch {
    await ensureTable().catch(() => {})
    return Response.json({ ok: false }, { status: 500 })
  }
}
