import { createHash } from 'node:crypto'
import { sql } from '@/lib/db'
import { APP_BUNDLE_ID } from '@/lib/app-id'

// iOS アプリでの Google / LINE ログイン
// WKWebView 内では Google が OAuth を拒否し、外部 Safari ではログイン状態がアプリに戻らない。そこで:
// 1. アプリがランダムなトークンを作り、アプリ内ブラウザ（SFSafariViewController）で /api/auth/native/start を開く
// 2. ブラウザ側で通常どおり Auth.js の OAuth を行い、/api/auth/native/complete でトークンのハッシュとユーザーを紐付ける
// 3. カスタム URL スキームでアプリに戻り、アプリはトークンで 'native-handoff' プロバイダにサインインする
// トークン自体は URL スキームに載せないので、スキームを横取りされてもログインはできない

export const NATIVE_PROVIDERS = ['google', 'line'] as const
export type NativeProvider = (typeof NATIVE_PROVIDERS)[number]

export const HANDOFF_COOKIE = 'native_handoff'
export const APP_URL_SCHEME = APP_BUNDLE_ID
const TTL_MINUTES = 10

const hash = (token: string) => createHash('sha256').update(token).digest('hex')

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS native_handoffs (
      token_hash TEXT PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
}

export async function saveHandoff(token: string, userId: string) {
  await ensureTable()
  await sql`DELETE FROM native_handoffs WHERE created_at < NOW() - make_interval(mins => ${TTL_MINUTES})`
  await sql`
    INSERT INTO native_handoffs (token_hash, user_id) VALUES (${hash(token)}, ${userId}::uuid)
    ON CONFLICT (token_hash) DO NOTHING
  `
}

// 一度だけ使える。期限内なら削除してユーザーを返す
export async function consumeHandoff(token: string) {
  await ensureTable()
  const rows = await sql`
    DELETE FROM native_handoffs
    WHERE token_hash = ${hash(token)} AND created_at > NOW() - make_interval(mins => ${TTL_MINUTES})
    RETURNING user_id
  `
  if (!rows[0]) return null
  const users = await sql`SELECT id, name, email, image FROM users WHERE id = ${rows[0].user_id}::uuid`
  return users[0] ?? null
}
