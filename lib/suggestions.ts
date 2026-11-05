import { sql } from '@/lib/db'
import { commonAnswers } from '@/lib/common'

// 「友達じゃないですか？」の候補
// 友達の友達と、同じ人に招待された人だけを出す（つながりのない人は出さない）。
// 並び順: 共通の友達の数 → 同じ招待 → 17 の質問の共通点
let ready: Promise<unknown> | null = null
export function ensureDismissTable() {
  ready ??= sql`
    CREATE TABLE IF NOT EXISTS suggestion_dismissals (
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      dismissed_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (user_id, dismissed_id)
    )
  `.catch(e => { ready = null; throw e })
  return ready
}

export type Suggestion = { id: string; name: string | null; handle: string | null; image: string | null }

export async function suggestionsFor(me: string, limit = 10): Promise<Suggestion[]> {
  await ensureDismissTable()
  const rows = await sql`
    WITH me AS (SELECT invited_by FROM users WHERE id = ${me}::uuid),
    fof AS (
      SELECT f2.following_id AS id, COUNT(DISTINCT f1.following_id)::int AS mutual
      FROM follows f1 JOIN follows f2 ON f2.follower_id = f1.following_id
      WHERE f1.follower_id = ${me}::uuid
      GROUP BY f2.following_id
    ),
    same_invite AS (
      SELECT u.id FROM users u, me
      WHERE me.invited_by IS NOT NULL AND (u.invited_by = me.invited_by OR u.id = me.invited_by)
    ),
    cand AS (
      SELECT id, mutual, FALSE AS invite FROM fof
      UNION ALL SELECT id, 0, TRUE FROM same_invite
    )
    SELECT u.id, u.name, u.handle, u.image, SUM(c.mutual)::int AS mutual, BOOL_OR(c.invite) AS invite, q.items
    FROM cand c
    JOIN users u ON u.id = c.id AND u.onboarded = TRUE AND u.handle IS NOT NULL
    LEFT JOIN self_qa q ON q.user_id = u.id
    WHERE u.id <> ${me}::uuid
      AND NOT EXISTS (SELECT 1 FROM follows f WHERE f.follower_id = ${me}::uuid AND f.following_id = u.id)
      AND NOT EXISTS (SELECT 1 FROM suggestion_dismissals d WHERE d.user_id = ${me}::uuid AND d.dismissed_id = u.id)
      AND NOT EXISTS (
        SELECT 1 FROM blocks b
        WHERE (b.blocker_id = ${me}::uuid AND b.blocked_id = u.id) OR (b.blocker_id = u.id AND b.blocked_id = ${me}::uuid)
      )
    GROUP BY u.id, u.name, u.handle, u.image, q.items
    ORDER BY SUM(c.mutual) DESC, BOOL_OR(c.invite) DESC
    LIMIT 40
  `
  if (!rows.length) return []
  const [mine] = await sql`SELECT items FROM self_qa WHERE user_id = ${me}::uuid`
  const myItems = Array.isArray(mine?.items) ? mine.items : []
  return rows
    .map(r => ({
      r,
      score: r.mutual * 10 + (r.invite ? 15 : 0) + commonAnswers(myItems, Array.isArray(r.items) ? r.items : []).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ r }) => ({ id: r.id, name: r.name, handle: r.handle, image: r.image }))
}
