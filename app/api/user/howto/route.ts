import { auth } from '@/auth'
import { sql } from '@/lib/db'

// 使い方（HOWTO）を見終えたことを記録する。次からは自動で出さない
export async function POST() {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  await sql`UPDATE users SET howto_seen_at = COALESCE(howto_seen_at, NOW()) WHERE id = ${userId}`
  return Response.json({ ok: true })
}
