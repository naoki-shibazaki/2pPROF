import { sql } from '@/lib/db'

// 招待制: 新しく登録する人は、誰かの招待リンクがないと初期登録を終えられない
// 1 人が招待できるのは INVITE_LIMIT 人まで（招待で登録を終えた人の数で数える）
export const INVITE_LIMIT = 5
// 招待リンクを開いた人のトークンを、ログイン・登録が終わるまで覚えておく cookie
export const INVITE_COOKIE = 'invite_token'
export const INVITE_TOKEN_RE = /^[a-f0-9]{16}$/

let ready: Promise<unknown> | null = null
export function ensureInviteColumns() {
  ready ??= sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS invited_by UUID REFERENCES users(id) ON DELETE SET NULL`
    .catch(e => { ready = null; throw e })
  return ready
}

export async function invitesUsed(userId: string): Promise<number> {
  await ensureInviteColumns()
  const [r] = await sql`SELECT COUNT(*)::int AS n FROM users WHERE invited_by = ${userId}::uuid AND onboarded = TRUE`
  return r?.n ?? 0
}

export type Inviter = { name: string | null; handle: string | null }

// 招待されているか（招待した人）
export async function inviteStatus(userId: string): Promise<{ inviter: Inviter | null }> {
  await ensureInviteColumns()
  const [r] = await sql`
    SELECT i.name, i.handle FROM users u JOIN users i ON i.id = u.invited_by
    WHERE u.id = ${userId}::uuid
  `
  return { inviter: r ? { name: r.name, handle: r.handle } : null }
}

export type ClaimResult = { ok: true; inviter: Inviter } | { ok: false; error: string }

// 招待リンクのトークンを、まだ登録を終えていない自分に結びつける
export async function claimInvite(userId: string, token: string): Promise<ClaimResult> {
  await ensureInviteColumns()
  if (!INVITE_TOKEN_RE.test(token)) return { ok: false, error: '招待リンクが正しくありません' }

  const [t] = await sql`
    SELECT i.id, i.name, i.handle, i.onboarded
    FROM invite_tokens it JOIN users i ON i.id = it.creator_id
    WHERE it.token = ${token} AND it.expires_at > NOW()
  `
  if (!t || !t.onboarded) return { ok: false, error: '招待リンクが無効か、期限切れです。友達に新しいリンクをもらってください' }
  if (t.id === userId) return { ok: false, error: '自分の招待リンクは使えません' }
  if ((await invitesUsed(t.id)) >= INVITE_LIMIT) {
    return { ok: false, error: `この友達はもう ${INVITE_LIMIT} 人招待しています。ほかの友達に招待してもらってください` }
  }

  const rows = await sql`
    UPDATE users SET invited_by = ${t.id}::uuid
    WHERE id = ${userId}::uuid AND COALESCE(onboarded, FALSE) = FALSE
    RETURNING id
  `
  if (!rows[0]) return { ok: false, error: 'すでに登録が終わっています' }
  return { ok: true, inviter: { name: t.name, handle: t.handle } }
}

// 招待で登録を終えた人と招待した人を、お互いにフォローした状態にして、招待した人に知らせる
export async function connectWithInviter(userId: string) {
  const [u] = await sql`SELECT invited_by FROM users WHERE id = ${userId}::uuid`
  const inviterId = u?.invited_by as string | undefined
  if (!inviterId) return
  await sql`
    INSERT INTO follows (follower_id, following_id)
    VALUES (${userId}::uuid, ${inviterId}::uuid), (${inviterId}::uuid, ${userId}::uuid)
    ON CONFLICT DO NOTHING
  `
  await sql`INSERT INTO notifications (user_id, type, from_user_id) VALUES (${inviterId}::uuid, 'followed', ${userId}::uuid)`
}
