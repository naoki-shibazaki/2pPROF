import { sql } from '@/lib/db'
import { NEARBY_FRESH_MINUTES, NEARBY_RADIUS_M } from '@/lib/encounters-config'

// 「近くにいる人」→「会った？」の確認 → 会った回数（proximity_events）を 1 増やす
//
// 位置はボタンを押したときだけ受け取り、近くの判定にだけ使う。相手には距離しか返さない
// 位置はこの時間を過ぎたら消す
const LOCATION_TTL_MINUTES = 60

// 相互フォローで、ブロック関係がなく、最近「さがす」を押して半径内にいる友達
export async function findNearbyFriends(userId: string) {
  return sql`
    WITH me AS (SELECT lat, lng FROM user_locations WHERE user_id = ${userId}::uuid)
    SELECT u.id, u.name, u.handle, u.image,
      ROUND(d.m)::int AS distance_m,
      EXISTS (
        SELECT 1 FROM encounter_requests er
        WHERE er.from_user_id = ${userId}::uuid AND er.to_user_id = u.id AND er.status = 'pending'
      ) AS requested,
      -- 同じ二人で数えるのは 1 日（日本時間）1 回まで
      EXISTS (
        SELECT 1 FROM proximity_events pe
        WHERE ((pe.user_a_id = ${userId}::uuid AND pe.user_b_id = u.id) OR (pe.user_a_id = u.id AND pe.user_b_id = ${userId}::uuid))
          AND (pe.occurred_at AT TIME ZONE 'Asia/Tokyo')::date = (NOW() AT TIME ZONE 'Asia/Tokyo')::date
      ) AS counted_today
    FROM follows f1
    JOIN follows f2 ON f2.follower_id = f1.following_id AND f2.following_id = f1.follower_id
    JOIN users u ON u.id = f1.following_id
    JOIN user_locations ul ON ul.user_id = u.id
    CROSS JOIN me
    CROSS JOIN LATERAL (
      SELECT 6371000 * 2 * ASIN(SQRT(
        POWER(SIN(RADIANS(ul.lat - me.lat) / 2), 2) +
        COS(RADIANS(me.lat)) * COS(RADIANS(ul.lat)) * POWER(SIN(RADIANS(ul.lng - me.lng) / 2), 2)
      )) AS m
    ) d
    WHERE f1.follower_id = ${userId}::uuid
      AND ul.updated_at > NOW() - make_interval(mins => ${NEARBY_FRESH_MINUTES})
      AND d.m <= ${NEARBY_RADIUS_M}
      AND NOT EXISTS (
        SELECT 1 FROM blocks b
        WHERE (b.blocker_id = ${userId}::uuid AND b.blocked_id = u.id)
           OR (b.blocker_id = u.id AND b.blocked_id = ${userId}::uuid)
      )
    ORDER BY d.m
  `
}

export async function saveLocation(userId: string, lat: number, lng: number) {
  await sql`
    INSERT INTO user_locations (user_id, lat, lng, updated_at)
    VALUES (${userId}::uuid, ${lat}, ${lng}, NOW())
    ON CONFLICT (user_id) DO UPDATE SET lat = EXCLUDED.lat, lng = EXCLUDED.lng, updated_at = NOW()
  `
  await sql`DELETE FROM user_locations WHERE updated_at < NOW() - make_interval(mins => ${LOCATION_TTL_MINUTES})`
}

export async function countedToday(a: string, b: string) {
  const [row] = await sql`
    SELECT 1 FROM proximity_events
    WHERE ((user_a_id = ${a}::uuid AND user_b_id = ${b}::uuid) OR (user_a_id = ${b}::uuid AND user_b_id = ${a}::uuid))
      AND (occurred_at AT TIME ZONE 'Asia/Tokyo')::date = (NOW() AT TIME ZONE 'Asia/Tokyo')::date
  `
  return !!row
}

export async function countBetween(a: string, b: string) {
  const [row] = await sql`
    SELECT COUNT(*)::int AS n FROM proximity_events
    WHERE (user_a_id = ${a}::uuid AND user_b_id = ${b}::uuid) OR (user_a_id = ${b}::uuid AND user_b_id = ${a}::uuid)
  `
  return (row?.n as number) ?? 0
}
