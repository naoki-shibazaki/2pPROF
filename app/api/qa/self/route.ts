import { auth } from '@/auth'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    const session = await auth()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session?.user as any)?.id
    if (!userId) return Response.json(null, { status: 401 })

    const rows = await sql`
      SELECT items FROM self_qa WHERE user_id = ${userId}::uuid
    `
    return Response.json(rows[0]?.items ?? null)
  } catch (e) {
    console.error('[/api/qa/self GET]', e)
    return Response.json(null, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session?.user as any)?.id
    if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { items } = await req.json()
    if (!Array.isArray(items)) return Response.json({ error: 'items must be array' }, { status: 400 })

    await sql`
      INSERT INTO self_qa (user_id, items, updated_at)
      VALUES (${userId}::uuid, ${JSON.stringify(items)}, NOW())
      ON CONFLICT (user_id) DO UPDATE
        SET items = ${JSON.stringify(items)}, updated_at = NOW()
    `
    return Response.json({ ok: true })
  } catch (e) {
    console.error('[/api/qa/self PUT]', e)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
