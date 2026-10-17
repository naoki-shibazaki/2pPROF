import { auth } from '@/auth'
import { del } from '@vercel/blob'
import { sql } from '@/lib/db'

// アカウント削除（App Store Review Guideline 5.1.1(v)）
// users 行を削除すると関連テーブルは ON DELETE CASCADE / SET NULL で消える
export async function POST() {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json({ error: 'ログインが必要です' }, { status: 401 })

  try {
    const [user] = await sql`SELECT image FROM users WHERE id = ${userId}::uuid`
    if (user?.image?.includes('blob.vercel-storage.com')) {
      await del(user.image).catch(e => console.error('[blob del]', e))
    }

    await sql`DELETE FROM users WHERE id = ${userId}::uuid`
    return Response.json({ ok: true })
  } catch (e) {
    console.error('[POST /api/user/me/delete]', e)
    return Response.json({ error: 'アカウントの削除に失敗しました' }, { status: 500 })
  }
}

