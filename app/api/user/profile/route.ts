import { auth } from '@/auth'
import { sql } from '@/lib/db'

export async function PATCH(req: Request) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, bio, hp, proximity_mode } = await req.json()

  await sql`
    UPDATE users
    SET
      name           = COALESCE(${name?.trim() ?? null}, name),
      bio            = COALESCE(${bio?.trim() ?? null}, bio),
      hp             = COALESCE(${hp ?? null}, hp),
      proximity_mode = COALESCE(${proximity_mode ?? null}, proximity_mode)
    WHERE id = ${userId}
  `

  return Response.json({ ok: true })
}
