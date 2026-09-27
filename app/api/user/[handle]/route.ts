import { auth } from '@/auth'
import { sql } from '@/lib/db'

export async function GET(_req: Request, { params }: { params: Promise<{ handle: string }> }) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const myId = (session?.user as any)?.id

  const { handle } = await params

  const rows = await sql`
    SELECT id, name, handle, image, bio
    FROM users WHERE handle = ${handle}
  `
  if (rows.length === 0) return Response.json(null, { status: 404 })

  const user = rows[0]

  const isSelf = myId === user.id

  // Block check: if they blocked me → look like 404
  if (myId && !isSelf) {
    const blockedByTarget = await sql`
      SELECT 1 FROM blocks
      WHERE blocker_id = ${user.id}::uuid AND blocked_id = ${myId}::uuid
      LIMIT 1
    `.catch(() => [])
    if (blockedByTarget.length > 0) return Response.json(null, { status: 404 })
  }

  // Per-pair proximity count + isFollowing + isBlocked
  let proximityCount = 0
  let isFollowing = false
  let isBlocked = false
  if (myId && !isSelf) {
    const [pe, fw, bl] = await Promise.all([
      sql`
        SELECT COUNT(*)::int AS cnt FROM proximity_events
        WHERE (user_a_id = ${myId}::uuid AND user_b_id = ${user.id}::uuid)
           OR (user_a_id = ${user.id}::uuid AND user_b_id = ${myId}::uuid)
      `,
      sql`
        SELECT 1 FROM follows
        WHERE follower_id = ${myId}::uuid AND following_id = ${user.id}::uuid
        LIMIT 1
      `,
      sql`
        SELECT 1 FROM blocks
        WHERE blocker_id = ${myId}::uuid AND blocked_id = ${user.id}::uuid
        LIMIT 1
      `.catch(() => []),
    ])
    proximityCount = pe[0]?.cnt ?? 0
    isFollowing = fw.length > 0
    isBlocked = bl.length > 0
  }

  // Self Q&A (answered only) + follow counts
  const [qaRows, countRows] = await Promise.all([
    sql`SELECT items FROM self_qa WHERE user_id = ${user.id}::uuid`,
    sql`SELECT
          (SELECT COUNT(*)::int FROM follows WHERE follower_id = ${user.id}::uuid) AS following_count,
          (SELECT COUNT(*)::int FROM follows WHERE following_id = ${user.id}::uuid) AS followers_count`,
  ])
  const allItems: { q: string; a: string }[] = Array.isArray(qaRows[0]?.items) ? qaRows[0].items : []
  const qaItems = allItems.filter(i => i.a?.trim())
  const followingCount = countRows[0]?.following_count ?? 0
  const followersCount = countRows[0]?.followers_count ?? 0

  return Response.json({ ...user, proximityCount, qaItems, isFollowing, isSelf, followingCount, followersCount, isBlocked })
}
