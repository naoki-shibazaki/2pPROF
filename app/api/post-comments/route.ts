import { auth } from '@/auth'
import { sql } from '@/lib/db'
import OpenAI from 'openai'

// GET: approved comments for a post (?postId=xxx)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const postId = searchParams.get('postId')
  if (!postId) return Response.json([])

  try {
    const rows = await sql`
      SELECT c.id, c.body, c.created_at,
             u.name AS author_name, u.handle AS author_handle
      FROM post_comments c
      JOIN users u ON u.id = c.author_id
      WHERE c.post_id = ${postId}::uuid
        AND c.status = 'approved'
      ORDER BY c.created_at ASC
    `

    return Response.json(rows)
  } catch (e) {
    console.error('[GET /api/post-comments]', e)
    return Response.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}

// POST: submit a comment (OpenAI moderation)
export async function POST(req: Request) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const authorId = (session?.user as any)?.id
  if (!authorId) return Response.json({ ok: false }, { status: 401 })

  try {
    const { postId, body } = await req.json()
    if (!postId || !body?.trim()) return Response.json({ ok: false }, { status: 400 })
    if (body.trim().length > 200) return Response.json({ ok: false, error: '200字以内で入力してください' }, { status: 400 })

    // 投稿の存在確認と投稿者取得
    const posts = await sql`SELECT user_id FROM posts WHERE id = ${postId}::uuid`
    if (!posts[0]) return Response.json({ ok: false }, { status: 404 })
    const postOwnerId = posts[0].user_id

    // ブロック確認（自分の投稿へのコメントはスキップ）
    const blocked = await sql`
      SELECT 1 FROM blocks
      WHERE (blocker_id = ${authorId}::uuid AND blocked_id = ${postOwnerId}::uuid)
         OR (blocker_id = ${postOwnerId}::uuid AND blocked_id = ${authorId}::uuid)
      LIMIT 1
    `.catch(() => [])
    if (blocked.length > 0) return Response.json({ ok: false }, { status: 403 })

    // OpenAI Moderation
    let flagged = false
    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
      const modRes = await openai.moderations.create({ input: body.trim() })
      flagged = modRes.results[0]?.flagged ?? false
    } catch { /* silent */ }

    // 自分の投稿へのコメントは即承認
    const status = flagged ? 'rejected' : postOwnerId === authorId ? 'approved' : 'pending'

    const inserted = await sql`
      INSERT INTO post_comments (post_id, author_id, body, status, moderation_flagged)
      VALUES (${postId}::uuid, ${authorId}::uuid, ${body.trim()}, ${status}, ${flagged})
      RETURNING id
    `
    if (!flagged) {
      await sql`
        INSERT INTO notifications (user_id, type, from_user_id)
        VALUES (${postOwnerId}::uuid, 'post_comment', ${authorId}::uuid)
      `.catch(() => {})
    }

    return Response.json({ ok: true, flagged, id: inserted[0]?.id ?? null })
  } catch (e) {
    console.error('[POST /api/post-comments]', e)
    return Response.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
