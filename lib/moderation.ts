import nodemailer from 'nodemailer'
import { sql } from '@/lib/db'

// 通報・ブロックの記録と開発者への通知（App Store Review Guideline 1.2）
// 通報は 24 時間以内に /admin で確認し、コンテンツの削除・ユーザーの追放を行う

export const REPORT_CONTENT_TYPES = ['post', 'post_comment', 'qa_comment', 'introduction', 'question', 'profile'] as const
export type ReportContentType = (typeof REPORT_CONTENT_TYPES)[number]

export const REPORT_REASONS = {
  spam: 'スパム・宣伝',
  harassment: '嫌がらせ・いじめ',
  inappropriate: '性的・暴力的など不適切な内容',
  impersonation: 'なりすまし',
  other: 'その他',
  block: 'ブロック',
} as const
export type ReportReason = keyof typeof REPORT_REASONS

export const CONTENT_TYPE_LABELS: Record<ReportContentType, string> = {
  post: 'ひとこと',
  post_comment: 'ひとことへのコメント',
  qa_comment: 'Q&A へのコメント',
  introduction: '他己紹介',
  question: '質問',
  profile: 'プロフィール',
}

export async function ensureReportsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS reports (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      reporter_id UUID REFERENCES users(id) ON DELETE SET NULL,
      target_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
      content_type TEXT NOT NULL,
      content_id TEXT,
      content_snapshot TEXT,
      reason TEXT NOT NULL,
      detail TEXT,
      status TEXT NOT NULL DEFAULT 'open',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      resolved_at TIMESTAMPTZ
    )
  `
}

// 通報対象の投稿者と、通報時点の本文（投稿者が削除しても判断できるように残す）を取得する
// 投稿者はクライアントから受け取らず、必ずサーバー側でコンテンツから引く
export async function resolveContent(type: ReportContentType, id: string | null, handle: string | null) {
  if (type === 'profile') {
    if (!handle) return null
    const [u] = await sql`SELECT id FROM users WHERE handle = ${handle}`
    return u ? { authorId: u.id as string, body: null } : null
  }
  if (!id) return null
  const rows = await (async () => {
    switch (type) {
      case 'post': return sql`SELECT user_id AS author_id, body FROM posts WHERE id = ${id}::uuid`
      case 'post_comment': return sql`SELECT author_id, body FROM post_comments WHERE id = ${id}::uuid`
      case 'qa_comment': return sql`SELECT author_id, body FROM qa_comments WHERE id = ${id}::uuid`
      case 'introduction': return sql`SELECT author_id, body FROM introductions WHERE id = ${id}::uuid`
      case 'question': return sql`SELECT sender_id AS author_id, question AS body FROM friend_questions WHERE id = ${id}::uuid`
    }
  })().catch(() => [])
  const row = rows?.[0]
  return row?.author_id ? { authorId: row.author_id as string, body: (row.body as string) ?? null } : null
}

export async function createReport(input: {
  reporterId: string
  targetUserId: string
  contentType: ReportContentType
  contentId: string | null
  body: string | null
  reason: ReportReason
  detail?: string | null
}) {
  await ensureReportsTable()
  const body = input.body
  const [row] = await sql`
    INSERT INTO reports (reporter_id, target_user_id, content_type, content_id, content_snapshot, reason, detail)
    VALUES (${input.reporterId}::uuid, ${input.targetUserId}::uuid, ${input.contentType}, ${input.contentId},
            ${body}, ${input.reason}, ${input.detail ?? null})
    RETURNING id
  `
  const [users] = await sql`
    SELECT (SELECT handle FROM users WHERE id = ${input.reporterId}::uuid) AS reporter,
           (SELECT handle FROM users WHERE id = ${input.targetUserId}::uuid) AS target
  `
  await notifyDeveloper(
    `[2P PROF] ${input.reason === 'block' ? 'ブロック' : '通報'}: @${users?.target ?? '?'} の${CONTENT_TYPE_LABELS[input.contentType]}`,
    [
      `種類: ${input.reason === 'block' ? 'ブロック' : '通報'}（${REPORT_REASONS[input.reason]}）`,
      `対象: @${users?.target ?? '?'} の${CONTENT_TYPE_LABELS[input.contentType]}`,
      `報告者: @${users?.reporter ?? '?'}`,
      body ? `内容:\n${body}` : null,
      input.detail ? `補足:\n${input.detail}` : null,
      '',
      '24時間以内に確認し、問題があればコンテンツの削除・ユーザーの追放を行ってください。',
      `https://2p-profile.info/admin`,
    ].filter(l => l !== null).join('\n'),
  )
  return row.id as string
}

// SMTP が未設定なら通知は送らずログだけ残す（通報自体は DB に保存済み）
export async function notifyDeveloper(subject: string, text: string) {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env
  const to = process.env.MODERATION_EMAIL ?? 'support@2p-profile.info'
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn('[moderation] SMTP not configured; report saved without email', subject)
    return
  }
  try {
    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 465),
      secure: Number(process.env.SMTP_PORT ?? 465) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })
    await transport.sendMail({ from: `2P PROF <${SMTP_USER}>`, to, subject, text })
  } catch (e) {
    console.error('[moderation] email failed', e)
  }
}

// ブロック関係（どちらからでも）にあるユーザーの投稿を除外する WHERE 句で使う
export async function blockedUserIds(userId: string | null): Promise<string[]> {
  if (!userId) return []
  const rows = await sql`
    SELECT blocked_id AS id FROM blocks WHERE blocker_id = ${userId}::uuid
    UNION
    SELECT blocker_id AS id FROM blocks WHERE blocked_id = ${userId}::uuid
  `.catch(() => [])
  return rows.map(r => r.id as string)
}

export function isAdmin(email: string | null | undefined) {
  if (!email) return false
  return (process.env.ADMIN_EMAILS ?? '').split(',').map(s => s.trim().toLowerCase()).includes(email.toLowerCase())
}
