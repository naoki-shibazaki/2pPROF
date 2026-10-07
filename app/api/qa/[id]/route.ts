import { auth } from '@/auth'
import { sql } from '@/lib/db'

// PATCH: answer a question
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const { answer } = await req.json()
    if (!answer?.trim()) return Response.json({ error: 'answer は必須です' }, { status: 400 })

    await sql`
      UPDATE friend_questions
      SET answer = ${answer.trim()}, answered_at = NOW()
      WHERE id = ${id}::uuid AND receiver_id = ${userId}::uuid
    `

    return Response.json({ ok: true })
  } catch (e) {
    console.error('[PATCH /api/qa/[id]]', e)
    return Response.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}

// DELETE: dismiss question
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params

    await sql`
      DELETE FROM friend_questions
      WHERE id = ${id}::uuid AND receiver_id = ${userId}::uuid
    `

    return Response.json({ ok: true })
  } catch (e) {
    console.error('[DELETE /api/qa/[id]]', e)
    return Response.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
