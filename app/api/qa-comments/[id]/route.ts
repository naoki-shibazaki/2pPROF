import { auth } from '@/auth'
import { sql } from '@/lib/db'
import OpenAI from 'openai'

// PATCH: two cases —
//   { status: 'approved'|'rejected' } → target user approves/rejects
//   { body: '...' }                   → author edits their own pending comment
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json({ ok: false }, { status: 401 })

  const { id } = await params
  const payload = await req.json()

  // ── Author edit ──────────────────────────────────────────────
  if ('body' in payload) {
    const body = payload.body?.trim()
    if (!body) return Response.json({ ok: false }, { status: 400 })
    if (body.length > 200) return Response.json({ ok: false, error: '200字以内で入力してください' }, { status: 400 })

    // Re-run moderation
    let flagged = false
    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
      const modRes = await openai.moderations.create({ input: body })
      flagged = modRes.results[0]?.flagged ?? false
    } catch { /* silent */ }

    if (flagged) return Response.json({ ok: false, flagged: true })

    const rows = await sql`
      UPDATE qa_comments
      SET body = ${body}
      WHERE id = ${id}::uuid
        AND author_id = ${userId}::uuid
        AND status = 'pending'
      RETURNING id
    `
    if (!rows[0]) return Response.json({ ok: false }, { status: 403 })
    return Response.json({ ok: true })
  }

  // ── Owner approve / reject ────────────────────────────────────
  const { status } = payload
  if (status !== 'approved' && status !== 'rejected') return Response.json({ ok: false }, { status: 400 })

  const rows = await sql`
    UPDATE qa_comments
    SET status = ${status}
    WHERE id = ${id}::uuid
      AND target_user_id = ${userId}::uuid
      AND status = 'pending'
    RETURNING id
  `
  if (!rows[0]) return Response.json({ ok: false }, { status: 403 })
  return Response.json({ ok: true })
}
