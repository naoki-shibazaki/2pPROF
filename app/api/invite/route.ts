import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { randomBytes } from 'crypto'
import { INVITE_LIMIT, invitesUsed } from '@/lib/invite'

// POST: generate invite token
export async function POST() {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    // 招待できるのは INVITE_LIMIT 人まで
    if ((await invitesUsed(userId)) >= INVITE_LIMIT) {
      return Response.json({ error: `招待できるのは ${INVITE_LIMIT} 人までです`, code: 'invite_limit' }, { status: 403 })
    }
    const token = randomBytes(8).toString('hex') // 16文字

    await sql`
      INSERT INTO invite_tokens (token, creator_id)
      VALUES (${token}, ${userId}::uuid)
      ON CONFLICT (token) DO NOTHING
    `

    return Response.json({ token })
  } catch (e) {
    console.error('[POST /api/invite]', e)
    return Response.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
