import { auth } from '@/auth'
import { sql } from '@/lib/db'

// GET: 最近の通知一覧（既読・未読含む、最大30件）
export async function GET() {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json([])

  try {
    const rows = await sql`
      SELECT n.id, n.type, n.read, n.created_at,
             u.name  AS from_name,
             u.handle AS from_handle
      FROM notifications n
      LEFT JOIN users u ON u.id = n.from_user_id
      WHERE n.user_id = ${userId}::uuid
      ORDER BY n.created_at DESC
      LIMIT 30
    `

    return Response.json(rows)
  } catch (e) {
    console.error('[GET /api/notifications/all]', e)
    return Response.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
