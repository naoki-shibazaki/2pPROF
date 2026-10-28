import { sql } from '@/lib/db'

// 日ごとのアクティブ記録（DAU / WAU / MAU を出すため）。1 人 1 日 1 行で、その日に開いた回数だけ持つ
let ready: Promise<unknown> | null = null
export function ensureActivityTable() {
  ready ??= sql`
    CREATE TABLE IF NOT EXISTS daily_active (
      day DATE NOT NULL,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      opens INT NOT NULL DEFAULT 1,
      PRIMARY KEY (day, user_id)
    )
  `.catch(e => { ready = null; throw e })
  return ready
}

export async function recordActive(userId: string) {
  await ensureActivityTable()
  await sql`
    INSERT INTO daily_active (day, user_id)
    VALUES ((NOW() AT TIME ZONE 'Asia/Tokyo')::date, ${userId}::uuid)
    ON CONFLICT (day, user_id) DO UPDATE SET opens = daily_active.opens + 1
  `
}
