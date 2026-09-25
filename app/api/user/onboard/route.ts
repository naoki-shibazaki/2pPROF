import { auth } from '@/auth'
import { sql } from '@/lib/db'

export async function POST(req: Request) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, handle, bio } = await req.json()
  if (!name?.trim() || !handle?.trim()) {
    return Response.json({ error: '名前とハンドルは必須です' }, { status: 400 })
  }

  // handle は英数字とアンダースコアのみ
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(handle)) {
    return Response.json({ error: 'ハンドルは英数字・_のみ、3〜20文字で入力してください' }, { status: 400 })
  }

  // 重複チェック
  const dup = await sql`
    SELECT id FROM users WHERE handle = ${handle} AND id != ${userId}
  `
  if (dup.length > 0) {
    return Response.json({ error: 'このハンドルはすでに使われています' }, { status: 409 })
  }

  await sql`
    UPDATE users
    SET name = ${name.trim()}, handle = ${handle.trim()}, bio = ${bio?.trim() || null}, onboarded = TRUE
    WHERE id = ${userId}
  `

  return Response.json({ ok: true })
}
