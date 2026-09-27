import { auth } from '@/auth'
import { sql } from '@/lib/db'

// PATCH: approve or reject a pending comment (only the target user can do this)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json({ ok: false }, { status: 401 })

  const { id } = await params
  const { status } = await req.json()
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
