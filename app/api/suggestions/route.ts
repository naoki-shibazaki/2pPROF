import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { ensureDismissTable, suggestionsFor } from '@/lib/suggestions'

// GET: 「友達じゃないですか？」の候補
export async function GET() {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const me = (session?.user as any)?.id as string | undefined
  if (!me) return Response.json([], { status: 401 })
  try {
    return Response.json(await suggestionsFor(me))
  } catch (e) {
    console.error('[GET /api/suggestions]', e)
    return Response.json([])
  }
}

// POST { id }: ✕ を押した人は、もう出さない
export async function POST(req: Request) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const me = (session?.user as any)?.id as string | undefined
  if (!me) return Response.json({ ok: false }, { status: 401 })
  try {
    const { id } = await req.json()
    if (typeof id !== 'string' || !/^[0-9a-f-]{36}$/i.test(id) || id === me) return Response.json({ ok: false }, { status: 400 })
    await ensureDismissTable()
    await sql`INSERT INTO suggestion_dismissals (user_id, dismissed_id) VALUES (${me}::uuid, ${id}::uuid) ON CONFLICT DO NOTHING`
    return Response.json({ ok: true })
  } catch (e) {
    console.error('[POST /api/suggestions]', e)
    return Response.json({ ok: false }, { status: 500 })
  }
}
