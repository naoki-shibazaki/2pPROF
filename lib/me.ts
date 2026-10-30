import { sql } from '@/lib/db'
import { currentHp } from '@/lib/hp'

export type Me = {
  id: string
  name: string | null
  email: string | null
  image: string | null
  handle: string | null
  bio: string | null
  onboarded: boolean
  hp: number | null
  proximity_count: number | null
  proximity_mode: string | null
  howto_seen: boolean
  invited_by_name: string | null
  invited_by_handle: string | null
  following_count: number
  followers_count: number
}

export type UnreadCounts = { hitokoto: number; friends: number; others: number }

// 自分のプロフィール（/api/user/me と、ホームを最初に表示するときに使う）
export async function getMe(userId: string): Promise<Me | null> {
  const [rows, counts, hp] = await Promise.all([
    sql`SELECT u.id, u.name, u.email, u.image, u.handle, u.bio, u.onboarded, u.hp, u.proximity_count, u.proximity_mode,
               u.howto_seen_at IS NOT NULL AS howto_seen, i.name AS invited_by_name, i.handle AS invited_by_handle
        FROM users u LEFT JOIN users i ON i.id = u.invited_by
        WHERE u.id = ${userId}`,
    sql`SELECT
          (SELECT COUNT(*)::int FROM follows WHERE follower_id = ${userId}::uuid) AS following_count,
          (SELECT COUNT(*)::int FROM follows WHERE following_id = ${userId}::uuid) AS followers_count`,
    currentHp(userId),
  ])
  if (!rows[0]) return null
  return {
    ...(rows[0] as Omit<Me, 'hp' | 'following_count' | 'followers_count'>),
    hp,
    following_count: counts[0]?.following_count ?? 0,
    followers_count: counts[0]?.followers_count ?? 0,
  }
}

// タブ別の未読数
export async function getUnreadCounts(userId: string): Promise<UnreadCounts> {
  const rows = await sql`
    SELECT
      COUNT(*) FILTER (WHERE type = 'post_comment')::int AS hitokoto,
      COUNT(*) FILTER (WHERE type IN ('followed', 'encounter_request', 'encounter_confirmed', 'connected'))::int AS friends,
      COUNT(*) FILTER (WHERE type IN ('introduction', 'question', 'qa_comment'))::int AS others
    FROM notifications
    WHERE user_id = ${userId}::uuid AND read = FALSE
  `
  const r = rows[0] ?? {}
  return { hitokoto: r.hitokoto ?? 0, friends: r.friends ?? 0, others: r.others ?? 0 }
}
