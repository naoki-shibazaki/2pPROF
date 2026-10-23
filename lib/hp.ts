import { sql } from '@/lib/db'
import { HP_MAX } from '@/lib/hp-max'

// HP = その日（日本時間）にアプリを開ける残り回数。0 になると翌日 0:00 まで使えない
export { HP_MAX }
// 続けて開き直したときに何度も減らないよう、この間隔より短い再オープンは数えない
const DEBOUNCE_SECONDS = 30

export type HpState = { hp: number; max: number; locked: boolean; resetAt: string }

// App Review のデモアカウント（とデモの友達）は HP が 0 になっても締め出さない（審査中に使えなくなるため）
function isExempt(email: string | null | undefined) {
  const list = (process.env.HP_EXEMPT_EMAILS ?? 'review@2pprof.com,friend1@2pprof.com').split(',').map(s => s.trim().toLowerCase())
  return !!email && list.includes(email.toLowerCase())
}

// 次の日本時間 0:00
function nextResetAt() {
  const jst = new Date(Date.now() + 9 * 3600_000)
  jst.setUTCHours(24, 0, 0, 0)
  return new Date(jst.getTime() - 9 * 3600_000).toISOString()
}

// アプリを開いた（起動・復帰した）ことを記録して、残り HP を返す
// hp_opens が HP_MAX を超えたら締め出し中（HP 0 の状態で新しく開いた）
export async function recordOpen(userId: string, email: string | null | undefined): Promise<HpState> {
  const cap = isExempt(email) ? HP_MAX : HP_MAX + 1
  const [row] = await sql`
    WITH cur AS (
      SELECT
        CASE WHEN hp_day = (NOW() AT TIME ZONE 'Asia/Tokyo')::date THEN COALESCE(hp_opens, 0) ELSE 0 END AS opens,
        COALESCE(hp_day = (NOW() AT TIME ZONE 'Asia/Tokyo')::date
          AND hp_last_open > NOW() - make_interval(secs => ${DEBOUNCE_SECONDS}), false) AS recent
      FROM users WHERE id = ${userId}::uuid
    )
    UPDATE users SET
      hp_day = (NOW() AT TIME ZONE 'Asia/Tokyo')::date,
      hp_opens = CASE WHEN cur.recent THEN cur.opens ELSE LEAST(cur.opens + 1, ${cap}) END,
      hp_last_open = NOW(),
      hp = GREATEST(0, ${HP_MAX} - CASE WHEN cur.recent THEN cur.opens ELSE LEAST(cur.opens + 1, ${cap}) END)
    FROM cur
    WHERE id = ${userId}::uuid
    RETURNING hp_opens
  `
  const opens = (row?.hp_opens as number | undefined) ?? 0
  return { hp: Math.max(0, HP_MAX - opens), max: HP_MAX, locked: opens > HP_MAX, resetAt: nextResetAt() }
}

// 開いた回数を増やさずに今日の残り HP を返す（日付が変わっていれば満タン）
export async function currentHp(userId: string): Promise<number> {
  const [row] = await sql`
    SELECT CASE WHEN hp_day = (NOW() AT TIME ZONE 'Asia/Tokyo')::date THEN COALESCE(hp_opens, 0) ELSE 0 END AS opens
    FROM users WHERE id = ${userId}::uuid
  `
  return Math.max(0, HP_MAX - ((row?.opens as number | undefined) ?? 0))
}
