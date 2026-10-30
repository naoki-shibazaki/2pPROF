import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { commonBetween, connectionsBetween } from '@/lib/common'

// GET ?handle=X: 自分と X の共通点、X との紹介
// GET ?handle=X&with=Y: X と Y の共通点（2 人を紹介するときの一言の候補。2 人ともフォローしている人だけ）
export async function GET(req: Request) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const me = (session?.user as any)?.id as string | undefined
  if (!me) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const handles = [searchParams.get('handle'), searchParams.get('with')].filter(Boolean) as string[]
    if (!handles.length) return Response.json({ error: 'handle が必要です' }, { status: 400 })
    const rows = await sql`SELECT id, handle FROM users WHERE handle = ANY(${handles}::text[])`
    const idOf = (h: string) => rows.find(r => r.handle === h)?.id as string | undefined
    const x = idOf(handles[0])
    if (!x) return Response.json({ error: 'ユーザーが見つかりません' }, { status: 404 })

    if (handles[1]) {
      const y = idOf(handles[1])
      if (!y) return Response.json({ error: 'ユーザーが見つかりません' }, { status: 404 })
      const f = await sql`SELECT COUNT(*)::int AS n FROM follows WHERE follower_id = ${me}::uuid AND following_id IN (${x}::uuid, ${y}::uuid)`
      if (f[0].n < 2) return Response.json({ error: 'Forbidden' }, { status: 403 })
      return Response.json(await commonBetween(x, y))
    }

    if (x === me) return Response.json({ answers: [], mutual: [], connections: [] })
    const [common, connections] = await Promise.all([commonBetween(me, x), connectionsBetween(me, x)])
    return Response.json({ ...common, connections })
  } catch (e) {
    console.error('[GET /api/common]', e)
    return Response.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
