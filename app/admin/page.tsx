'use client'

import { useEffect, useState } from 'react'

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

const TYPE_LABELS: Record<string, string> = {
  post: 'ひとこと', post_comment: 'コメント', qa_comment: 'Q&Aコメント',
  introduction: '他己紹介', question: '質問', profile: 'プロフィール',
}
const REASON_LABELS: Record<string, string> = {
  spam: 'スパム・宣伝', harassment: '嫌がらせ', inappropriate: '不適切な内容',
  impersonation: 'なりすまし', other: 'その他', block: 'ブロック',
}

type Report = {
  id: string; content_type: string; content_id: string | null; content_snapshot: string | null
  reason: string; detail: string | null; status: string; created_at: string
  target_handle: string | null; target_name: string | null; reporter_handle: string | null; target_report_count: number
}

// 通報の管理画面（ADMIN_EMAILS に登録したアカウントのみ）
export default function AdminPage() {
  const [reports, setReports] = useState<Report[] | null>(null)
  const [forbidden, setForbidden] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)
  const [confirmBan, setConfirmBan] = useState<string | null>(null)

  const load = () => fetch('/api/admin/reports').then(async r => {
    if (r.status === 403) { setForbidden(true); return }
    setReports(await r.json())
  })
  useEffect(() => { void load() }, [])

  async function act(id: string, action: 'dismiss' | 'remove_content' | 'ban_user') {
    setBusy(id)
    await fetch('/api/admin/reports', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action }) })
    setBusy(null)
    setConfirmBan(null)
    await load()
  }

  const hoursLeft = (created: string) => Math.max(0, 24 - (Date.now() - new Date(created).getTime()) / 3600000)

  return (
    <div style={{ minHeight: '100dvh', background: '#04020c', color: '#b0a8d0', padding: '32px 16px', maxWidth: 720, margin: '0 auto', ...STYLE }}>
      <a href="/" style={{ fontSize: 11, color: '#40e8ff' }}>◀ もどる</a>
      <h1 style={{ fontSize: 16, color: '#ff40c0', margin: '16px 0 4px' }}>通報の管理</h1>
      <p style={{ fontSize: 9, color: '#604878', marginBottom: 20 }}>通報から24時間以内に対応してください</p>

      {forbidden ? (
        <p style={{ fontSize: 11, color: '#ff4060' }}>このページを見る権限がありません</p>
      ) : !reports ? (
        <p style={{ fontSize: 10 }}>読み込み中...</p>
      ) : reports.length === 0 ? (
        <p style={{ fontSize: 10 }}>通報はありません</p>
      ) : reports.map(r => {
        const open = r.status === 'open'
        const left = hoursLeft(r.created_at)
        return (
          <div key={r.id} style={{ border: `1px solid ${open ? 'rgba(255,64,96,0.5)' : 'rgba(80,72,112,0.3)'}`, padding: 12, marginBottom: 10, opacity: open ? 1 : 0.55 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 10 }}>
              <span style={{ color: r.reason === 'block' ? '#ffd700' : '#ff8090' }}>
                {REASON_LABELS[r.reason] ?? r.reason} ・ {TYPE_LABELS[r.content_type] ?? r.content_type}
              </span>
              <span style={{ color: open ? (left < 6 ? '#ff4060' : '#b0a8d0') : '#604878' }}>
                {open ? `残り ${Math.floor(left)} 時間` : r.status === 'dismissed' ? '問題なし' : '対応済み'}
              </span>
            </div>
            <p style={{ fontSize: 10, margin: '6px 0' }}>
              対象: @{r.target_handle ?? '（削除済み）'}{r.target_name ? ` (${r.target_name})` : ''}
              <span style={{ color: '#604878' }}> ・ このユーザーへの通報 {r.target_report_count} 件 ・ 報告者 @{r.reporter_handle ?? '?'}</span>
            </p>
            {r.content_snapshot && (
              <p style={{ fontSize: 11, color: '#d0c8f0', background: 'rgba(255,255,255,0.04)', padding: 8, whiteSpace: 'pre-wrap', margin: '6px 0' }}>{r.content_snapshot}</p>
            )}
            {r.detail && <p style={{ fontSize: 9, color: '#8070a8' }}>補足: {r.detail}</p>}
            <p style={{ fontSize: 8, color: '#604878' }}>{new Date(r.created_at).toLocaleString('ja-JP')}</p>

            {open && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                <Btn onClick={() => act(r.id, 'dismiss')} disabled={busy === r.id} color="#b0a8d0">問題なし</Btn>
                {r.content_id && <Btn onClick={() => act(r.id, 'remove_content')} disabled={busy === r.id} color="#ffd700">コンテンツを削除</Btn>}
                {r.target_handle && (confirmBan === r.id ? (
                  <>
                    <Btn onClick={() => act(r.id, 'ban_user')} disabled={busy === r.id} color="#ff4060">本当に追放する</Btn>
                    <Btn onClick={() => setConfirmBan(null)} color="#604878">やめる</Btn>
                  </>
                ) : (
                  <Btn onClick={() => setConfirmBan(r.id)} color="#ff4060">削除してユーザーを追放</Btn>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function Btn({ children, onClick, disabled, color }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; color: string }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ ...STYLE, fontSize: 10, color, background: 'transparent', border: `1px solid ${color}80`, padding: '6px 12px', cursor: 'pointer', opacity: disabled ? 0.5 : 1 }}>
      {children}
    </button>
  )
}
