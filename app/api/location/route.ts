import { auth } from '@/auth'
import { sql } from '@/lib/db'

export async function POST(req: Request) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { lat, lng } = await req.json()
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return Response.json({ error: 'Invalid coordinates' }, { status: 400 })
  }

  // Upsert current user's location (active for 2 minutes)
  await sql`
    INSERT INTO user_locations (user_id, lat, lng, updated_at)
    VALUES (${userId}, ${lat}, ${lng}, NOW())
    ON CONFLICT (user_id) DO UPDATE
      SET lat = ${lat}, lng = ${lng}, updated_at = NOW()
  `

  // Find users within 50m who were active in the last 2 minutes
  // Haversine formula (approximate, using equirectangular projection for short distances)
  const nearby = await sql`
    SELECT ul.user_id
    FROM user_locations ul
    WHERE ul.user_id != ${userId}
      AND ul.updated_at > NOW() - INTERVAL '2 minutes'
      AND (
        6371000 * SQRT(
          POWER(RADIANS(ul.lat - ${lat}), 2)
          + POWER(COS(RADIANS(${lat})) * RADIANS(ul.lng - ${lng}), 2)
        )
      ) <= 50
  `

  if (nearby.length === 0) {
    // Return current proximity_count
    const rows = await sql`SELECT proximity_count FROM users WHERE id = ${userId}`
    return Response.json({ count: rows[0]?.proximity_count ?? 0 })
  }

  // For each nearby user, record proximity event if not already recorded in last 1 hour
  let newEvents = 0
  for (const row of nearby) {
    const otherId = row.user_id

    // Canonical pair order (smaller id first) for dedup
    const [aId, bId] = userId < otherId ? [userId, otherId] : [otherId, userId]

    const existing = await sql`
      SELECT id FROM proximity_events
      WHERE user_a_id = ${aId}
        AND user_b_id = ${bId}
        AND occurred_at > NOW() - INTERVAL '1 day'
      LIMIT 1
    `

    if (existing.length === 0) {
      // Compute actual distance
      const distRows = await sql`
        SELECT ROUND((
          6371000 * SQRT(
            POWER(RADIANS(ul.lat - ${lat}), 2)
            + POWER(COS(RADIANS(${lat})) * RADIANS(ul.lng - ${lng}), 2)
          )
        )::numeric, 1) AS dist_m
        FROM user_locations ul
        WHERE ul.user_id = ${otherId}
      `
      const distM = distRows[0]?.dist_m ?? 0

      await sql`
        INSERT INTO proximity_events (user_a_id, user_b_id, distance_m, occurred_at)
        VALUES (${aId}, ${bId}, ${distM}, NOW())
      `

      // Increment both users' proximity_count
      await sql`UPDATE users SET proximity_count = proximity_count + 1 WHERE id = ${userId}`
      await sql`UPDATE users SET proximity_count = proximity_count + 1 WHERE id = ${otherId}`

      newEvents++
    }
  }

  const rows = await sql`SELECT proximity_count FROM users WHERE id = ${userId}`
  return Response.json({ count: rows[0]?.proximity_count ?? 0, newEvents })
}
