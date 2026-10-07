import { auth } from '@/auth'
import { sql } from '@/lib/db'

export async function DELETE(_req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { userId: targetId } = await params

    await sql`
      DELETE FROM follows
      WHERE follower_id = ${userId}::uuid AND following_id = ${targetId}::uuid
    `

    return Response.json({ ok: true })
  } catch (e) {
    console.error('[DELETE /api/follows/[userId]]', e)
    return Response.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
