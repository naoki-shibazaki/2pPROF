import { auth } from '@/auth'
import { sql } from '@/lib/db'

// DELETE: 自分の投稿を削除
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json({ ok: false }, { status: 401 })

  try {
    const { id } = await params

    await sql`
      DELETE FROM posts
      WHERE id = ${id}::uuid AND user_id = ${userId}::uuid
    `

    return Response.json({ ok: true })
  } catch (e) {
    console.error('[DELETE /api/posts/[id]]', e)
    return Response.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
