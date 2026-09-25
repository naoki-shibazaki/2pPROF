import { auth } from '@/auth'
import { sql } from '@/lib/db'

export async function GET() {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json(null, { status: 401 })

  const rows = await sql`
    SELECT id, name, email, image, handle, bio, onboarded, hp, proximity_count, proximity_mode
    FROM users WHERE id = ${userId}
  `
  return Response.json(rows[0] ?? null)
}
