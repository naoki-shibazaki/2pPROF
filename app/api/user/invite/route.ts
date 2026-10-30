import { auth } from '@/auth'
import { cookies } from 'next/headers'
import { INVITE_COOKIE, INVITE_LIMIT, claimInvite, inviteStatus, invitesUsed } from '@/lib/invite'

// GET: 自分の招待の状態（招待してくれた人、招待できる残り人数）
export async function GET() {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const [{ inviter }, used] = await Promise.all([inviteStatus(userId), invitesUsed(userId)])
    return Response.json({ inviter, used, limit: INVITE_LIMIT, remaining: Math.max(0, INVITE_LIMIT - used) })
  } catch (e) {
    console.error('[GET /api/user/invite]', e)
    return Response.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}

// POST: 招待リンクを使う { token }。token がなければ、招待リンクを開いたときに覚えた cookie を使う
export async function POST(req: Request) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json().catch(() => ({}))
    const jar = await cookies()
    const token = typeof body?.token === 'string' && body.token ? body.token : jar.get(INVITE_COOKIE)?.value
    if (!token) return Response.json({ error: '招待リンクがありません' }, { status: 400 })
    const result = await claimInvite(userId, token)
    if (!result.ok) return Response.json({ error: result.error }, { status: 400 })
    jar.delete(INVITE_COOKIE)
    return Response.json({ inviter: result.inviter })
  } catch (e) {
    console.error('[POST /api/user/invite]', e)
    return Response.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
