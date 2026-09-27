import { auth } from '@/auth'
import { sql } from '@/lib/db'
import OpenAI from 'openai'

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS qa_comments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      target_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      question_hash TEXT NOT NULL,
      author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      body TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      moderation_flagged BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS idx_qa_comments_target ON qa_comments(target_user_id, question_hash)`
}

// GET: approved comments for a specific Q&A item
// ?handle=xxx&qhash=yyy
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const handle = searchParams.get('handle')
  const qhash = searchParams.get('qhash')
  if (!handle || !qhash) return Response.json([])

  try {
    const users = await sql`SELECT id FROM users WHERE handle = ${handle}`
    if (!users[0]) return Response.json([])
    const targetId = users[0].id

    const rows = await sql`
      SELECT c.id, c.body, c.created_at,
             u.name AS author_name, u.handle AS author_handle
      FROM qa_comments c
      JOIN users u ON u.id = c.author_id
      WHERE c.target_user_id = ${targetId}::uuid
        AND c.question_hash = ${qhash}
        AND c.status = 'approved'
      ORDER BY c.created_at ASC
    `
    return Response.json(rows)
  } catch {
    return Response.json([])
  }
}

// POST: submit a comment (runs OpenAI Moderation)
export async function POST(req: Request) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const authorId = (session?.user as any)?.id
  if (!authorId) return Response.json({ ok: false }, { status: 401 })

  const { handle, qhash, body } = await req.json()
  if (!handle || !qhash || !body?.trim()) return Response.json({ ok: false }, { status: 400 })
  if (body.trim().length > 200) return Response.json({ ok: false, error: '200字以内で入力してください' }, { status: 400 })

  const targets = await sql`SELECT id FROM users WHERE handle = ${handle}`
  if (!targets[0]) return Response.json({ ok: false }, { status: 404 })
  const targetId = targets[0].id

  if (targetId === authorId) return Response.json({ ok: false }, { status: 400 })

  // OpenAI Moderation (free API)
  let flagged = false
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const modRes = await openai.moderations.create({ input: body.trim() })
    flagged = modRes.results[0]?.flagged ?? false
  } catch {
    // Moderation failure: allow through but mark as not flagged
    flagged = false
  }

  // Auto-reject if AI flagged as harmful
  const status = flagged ? 'rejected' : 'pending'

  try {
    const inserted = await sql`
      INSERT INTO qa_comments (target_user_id, question_hash, author_id, body, status, moderation_flagged)
      VALUES (${targetId}::uuid, ${qhash}, ${authorId}::uuid, ${body.trim()}, ${status}, ${flagged})
      RETURNING id
    `
    if (!flagged) {
      await sql`
        INSERT INTO notifications (user_id, type, from_user_id)
        VALUES (${targetId}::uuid, 'qa_comment', ${authorId}::uuid)
      `.catch(() => {})
    }
    return Response.json({ ok: true, flagged, id: inserted[0]?.id ?? null })
  } catch {
    await ensureTable().catch(() => {})
    return Response.json({ ok: false }, { status: 500 })
  }
}
