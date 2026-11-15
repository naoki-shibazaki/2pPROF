import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { renderShareCard } from '@/lib/share-card'

// GET: 自分のストーリー用画像（PNG 1080×1920）
//   ?intro=<id>   友達が書いた紹介文のカード（&author=0 で書いた人の名前を出さない）
//   なし          「どんな人？」と紹介文を募集するカード
export async function GET(req: Request) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id as string | undefined
  if (!userId) return new Response('Unauthorized', { status: 401 })

  const { searchParams } = new URL(req.url)
  const introId = searchParams.get('intro')
  const showAuthor = searchParams.get('author') !== '0'

  try {
    const [me] = await sql`
      SELECT u.name, u.handle, u.image,
             (SELECT COUNT(*)::int FROM introductions WHERE target_id = u.id) AS intro_count
      FROM users u WHERE u.id = ${userId}::uuid
    `
    if (!me?.handle) return new Response('Not found', { status: 404 })
    const user = { name: me.name || me.handle, handle: me.handle, image: me.image, introCount: me.intro_count }

    let intro = null
    if (introId) {
      if (!/^[0-9a-f-]{36}$/.test(introId)) return new Response('Bad request', { status: 400 })
      const [row] = await sql`
        SELECT i.body, i.met_year, u.name AS author_name, u.handle AS author_handle
        FROM introductions i JOIN users u ON u.id = i.author_id
        WHERE i.id = ${introId}::uuid AND i.target_id = ${userId}::uuid
      `
      if (!row) return new Response('Not found', { status: 404 })
      intro = { body: row.body, metYear: row.met_year, author: showAuthor ? (row.author_name || row.author_handle) : null }
    }

    return await renderShareCard(user, intro)
  } catch (e) {
    console.error('[GET /api/share-card]', e)
    return new Response('Failed to generate the image', { status: 500 })
  }
}
