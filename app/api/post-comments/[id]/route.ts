import { auth } from '@/auth'
import { sql } from '@/lib/db'
import OpenAI from 'openai'

// PATCH: { status } → 投稿オーナーが承認/却下
//        { body }   → 投稿者が自分のpendingコメントを編集
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json({ ok: false }, { status: 401 })

  try {
    const { id } = await params
    const payload = await req.json()

    // ── 著者による編集 ──
    if ('body' in payload) {
      const body = payload.body?.trim()
      if (!body || body.length > 200) return Response.json({ ok: false }, { status: 400 })

      let flagged = false
      try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
        const modRes = await openai.moderations.create({ input: body })
        flagged = modRes.results[0]?.flagged ?? false
      } catch { /* silent */ }

      if (flagged) return Response.json({ ok: false, flagged: true })

      const rows = await sql`
        UPDATE post_comments
        SET body = ${body}
        WHERE id = ${id}::uuid
          AND author_id = ${userId}::uuid
          AND status = 'pending'
        RETURNING id
      `
      if (!rows[0]) return Response.json({ ok: false }, { status: 403 })
      return Response.json({ ok: true })
    }

    // ── オーナーによる承認/却下 ──
    const { status } = payload
    if (status !== 'approved' && status !== 'rejected') return Response.json({ ok: false }, { status: 400 })

    // post_id から投稿オーナーを確認
    const rows = await sql`
      UPDATE post_comments pc
      SET status = ${status}
      FROM posts p
      WHERE pc.id = ${id}::uuid
        AND pc.post_id = p.id
        AND p.user_id = ${userId}::uuid
        AND pc.status = 'pending'
      RETURNING pc.id
    `
    if (!rows[0]) return Response.json({ ok: false }, { status: 403 })
    return Response.json({ ok: true })
  } catch (e) {
    console.error('[PATCH /api/post-comments/[id]]', e)
    return Response.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
