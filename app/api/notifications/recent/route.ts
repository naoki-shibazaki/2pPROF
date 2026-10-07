import { auth } from '@/auth'
import { sql } from '@/lib/db'

const TAB_TYPES: Record<string, string[]> = {
  hitokoto: ['post_comment'],
  friends:  ['followed'],
  others:   ['introduction', 'question', 'qa_comment'],
}

export async function GET(req: Request) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json([])

  try {
    const { searchParams } = new URL(req.url)
    const tab = searchParams.get('tab') ?? ''
    const types = TAB_TYPES[tab]
    if (!types) return Response.json([])

    const rows = await sql`
      SELECT n.type, n.created_at,
             u.name  AS from_name,
             u.handle AS from_handle
      FROM notifications n
      LEFT JOIN users u ON u.id = n.from_user_id
      WHERE n.user_id = ${userId}::uuid
        AND n.read = FALSE
        AND n.type = ANY(${types}::text[])
      ORDER BY n.created_at DESC
      LIMIT 5
    `

    return Response.json(rows)
  } catch (e) {
    console.error('[GET /api/notifications/recent]', e)
    return Response.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
