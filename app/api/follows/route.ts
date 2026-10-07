import { auth } from '@/auth'
import { sql } from '@/lib/db'

// Follow a user by handle
export async function POST(req: Request) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { handle } = await req.json()
    if (!handle) return Response.json({ error: 'handle required' }, { status: 400 })

    const targets = await sql`SELECT id FROM users WHERE handle = ${handle.replace(/^@/, '')}`
    if (targets.length === 0) return Response.json({ error: 'ユーザーが見つかりません' }, { status: 404 })

    const targetId = targets[0].id
    if (targetId === userId) return Response.json({ error: '自分はフォローできません' }, { status: 400 })

    await sql`
      INSERT INTO follows (follower_id, following_id)
      VALUES (${userId}::uuid, ${targetId}::uuid)
      ON CONFLICT DO NOTHING
    `

    // フォローされた通知
    await sql`
      INSERT INTO notifications (user_id, type, from_user_id)
      VALUES (${targetId}::uuid, 'followed', ${userId}::uuid)
    `.catch(() => {})

    return Response.json({ ok: true })
  } catch (e) {
    console.error('[POST /api/follows]', e)
    return Response.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
