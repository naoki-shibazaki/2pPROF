import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { isAdmin } from '@/lib/moderation'
import { ensureActivityTable } from '@/lib/activity'

// 利用状況の集計（管理者のみ）。審査用・テスト用のアカウントは数えない
const EXCLUDED_EMAILS = (process.env.STATS_EXCLUDE_EMAILS ?? 'review@2pprof.com,friend1@2pprof.com')
  .split(',').map(s => s.trim().toLowerCase()).filter(Boolean)

export async function GET() {
  const session = await auth()
  if (!isAdmin(session?.user?.email)) return Response.json({ error: 'Forbidden' }, { status: 403 })
  await ensureActivityTable()

  const [totals] = await sql`
    WITH u AS (
      SELECT id, created_at FROM users
      WHERE COALESCE(LOWER(email), '') <> ALL(${EXCLUDED_EMAILS}::text[])
        AND COALESCE(email, '') NOT LIKE 'e2e-%@example.com'
    ),
    today AS (SELECT (NOW() AT TIME ZONE 'Asia/Tokyo')::date AS d)
    SELECT
      (SELECT COUNT(*)::int FROM u) AS users,
      (SELECT COUNT(*)::int FROM u, today WHERE (u.created_at AT TIME ZONE 'Asia/Tokyo')::date = today.d) AS signups_today,
      (SELECT COUNT(*)::int FROM u, today WHERE (u.created_at AT TIME ZONE 'Asia/Tokyo')::date > today.d - 7) AS signups_7d,
      (SELECT COUNT(DISTINCT a.user_id)::int FROM daily_active a JOIN u ON u.id = a.user_id, today WHERE a.day = today.d) AS dau,
      (SELECT COUNT(DISTINCT a.user_id)::int FROM daily_active a JOIN u ON u.id = a.user_id, today WHERE a.day > today.d - 7) AS wau,
      (SELECT COUNT(DISTINCT a.user_id)::int FROM daily_active a JOIN u ON u.id = a.user_id, today WHERE a.day > today.d - 30) AS mau,
      (SELECT MIN(day) FROM daily_active) AS tracking_since
  `

  // 直近 30 日の日別（新規登録・アクティブ人数・開いた回数）
  const daily = await sql`
    WITH u AS (
      SELECT id, created_at FROM users
      WHERE COALESCE(LOWER(email), '') <> ALL(${EXCLUDED_EMAILS}::text[])
        AND COALESCE(email, '') NOT LIKE 'e2e-%@example.com'
    ),
    days AS (
      SELECT generate_series((NOW() AT TIME ZONE 'Asia/Tokyo')::date - 29, (NOW() AT TIME ZONE 'Asia/Tokyo')::date, '1 day')::date AS d
    )
    SELECT
      to_char(days.d, 'YYYY-MM-DD') AS day,
      (SELECT COUNT(*)::int FROM u WHERE (u.created_at AT TIME ZONE 'Asia/Tokyo')::date = days.d) AS signups,
      (SELECT COUNT(*)::int FROM daily_active a JOIN u ON u.id = a.user_id WHERE a.day = days.d) AS active,
      (SELECT COALESCE(SUM(a.opens), 0)::int FROM daily_active a JOIN u ON u.id = a.user_id WHERE a.day = days.d) AS opens
    FROM days
    ORDER BY days.d
  `

  return Response.json({ ...totals, daily })
}
