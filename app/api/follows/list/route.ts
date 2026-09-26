import { auth } from '@/auth'
import { sql } from '@/lib/db'

// GET /api/follows/list?handle=xxx&type=following|followers
export async function GET(req: Request) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const myId = (session?.user as any)?.id

  const { searchParams } = new URL(req.url)
  const handle = searchParams.get('handle')
  const type = searchParams.get('type') // 'following' | 'followers'

  if (!type || (type !== 'following' && type !== 'followers')) {
    return Response.json({ error: 'type required' }, { status: 400 })
  }

  // Resolve target user
  let targetId: string | null = null
  if (handle) {
    const rows = await sql`SELECT id FROM users WHERE handle = ${handle}`
    if (rows.length === 0) return Response.json([], { status: 200 })
    targetId = rows[0].id
  } else {
    if (!myId) return Response.json([], { status: 200 })
    targetId = myId
  }

  let rows
  if (type === 'following') {
    // Users that targetId follows
    rows = await sql`
      SELECT u.id, u.name, u.handle, u.image
      FROM follows f
      JOIN users u ON u.id = f.following_id
      WHERE f.follower_id = ${targetId}::uuid
      ORDER BY f.created_at DESC
    `
  } else {
    // Users that follow targetId
    rows = await sql`
      SELECT u.id, u.name, u.handle, u.image
      FROM follows f
      JOIN users u ON u.id = f.follower_id
      WHERE f.following_id = ${targetId}::uuid
      ORDER BY f.created_at DESC
    `
  }

  // Add isFollowing flag for each user (if viewer is logged in)
  if (myId && rows.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ids = rows.map((r: any) => r.id)
    const fw = await sql`
      SELECT following_id FROM follows
      WHERE follower_id = ${myId}::uuid
        AND following_id = ANY(${ids}::uuid[])
    `
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const followingSet = new Set(fw.map((r: any) => r.following_id))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Response.json(rows.map((r: any) => ({ ...r, isFollowing: followingSet.has(r.id), isSelf: r.id === myId })))
  }

  return Response.json(rows)
}
