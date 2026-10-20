import { auth } from '@/auth'
import { del } from '@vercel/blob'
import { sql } from '@/lib/db'
import { revokeAppleTokens } from '@/lib/apple-revoke'
import { ensureReportsTable, isAdmin } from '@/lib/moderation'

// 通報の確認と対応（管理者のみ）。通報から 24 時間以内に対応する
async function requireAdmin() {
  const session = await auth()
  return isAdmin(session?.user?.email) ? session : null
}

export async function GET() {
  if (!(await requireAdmin())) return Response.json({ error: 'Forbidden' }, { status: 403 })
  await ensureReportsTable()
  const rows = await sql`
    SELECT r.id, r.content_type, r.content_id, r.content_snapshot, r.reason, r.detail, r.status, r.created_at,
           t.handle AS target_handle, t.name AS target_name, rp.handle AS reporter_handle,
           (SELECT COUNT(*)::int FROM reports r2 WHERE r2.target_user_id = r.target_user_id) AS target_report_count
    FROM reports r
    LEFT JOIN users t ON t.id = r.target_user_id
    LEFT JOIN users rp ON rp.id = r.reporter_id
    ORDER BY (r.status = 'open') DESC, r.created_at DESC
    LIMIT 200
  `
  return Response.json(rows)
}

async function removeContent(type: string, id: string) {
  switch (type) {
    case 'post': await sql`DELETE FROM posts WHERE id = ${id}::uuid`; break
    case 'post_comment': await sql`DELETE FROM post_comments WHERE id = ${id}::uuid`; break
    case 'qa_comment': await sql`DELETE FROM qa_comments WHERE id = ${id}::uuid`; break
    case 'introduction': await sql`DELETE FROM introductions WHERE id = ${id}::uuid`; break
    case 'question': await sql`DELETE FROM friend_questions WHERE id = ${id}::uuid`; break
  }
}

// action: dismiss（問題なし）/ remove_content（コンテンツ削除）/ ban_user（コンテンツ削除＋ユーザーを追放）
export async function POST(req: Request) {
  if (!(await requireAdmin())) return Response.json({ error: 'Forbidden' }, { status: 403 })
  const { id, action } = await req.json()
  const [report] = await sql`SELECT * FROM reports WHERE id = ${id}::uuid`
  if (!report) return Response.json({ error: 'Not found' }, { status: 404 })

  try {
    if ((action === 'remove_content' || action === 'ban_user') && report.content_id) {
      await removeContent(report.content_type, report.content_id)
    }
    if (action === 'ban_user' && report.target_user_id) {
      const userId = report.target_user_id as string
      const [user] = await sql`SELECT image FROM users WHERE id = ${userId}::uuid`
      if (user?.image?.includes('blob.vercel-storage.com')) await del(user.image).catch(() => {})
      await revokeAppleTokens(userId).catch(() => {})
      // 追放したユーザーへの通報もまとめて対応済みにする
      await sql`UPDATE reports SET status = 'resolved', resolved_at = NOW() WHERE target_user_id = ${userId}::uuid`
      await sql`DELETE FROM users WHERE id = ${userId}::uuid`
    }
    const status = action === 'dismiss' ? 'dismissed' : 'resolved'
    await sql`UPDATE reports SET status = ${status}, resolved_at = NOW() WHERE id = ${id}::uuid`
    return Response.json({ ok: true })
  } catch (e) {
    console.error('[POST /api/admin/reports]', e)
    return Response.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
