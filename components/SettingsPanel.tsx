'use client'

import { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

type Props = {
  open: boolean
  onClose: () => void
  demo?: boolean
  onShowHowTo?: () => void
}

export default function SettingsPanel({ open, onClose, demo, onShowHowTo }: Props) {
  const [email, setEmail] = useState<string | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  useEffect(() => {
    if (!open) { setDeleteOpen(false); return }
    if (demo || email) return
    fetch('/api/user/me')
      .then(r => r.json())
      .then(u => setEmail(u?.email ?? null))
      .catch(() => {})
  }, [open, demo, email])

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 200 }} />

      {/* Panel */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 201,
        background: 'rgba(6,4,18,0.98)',
        border: '1px solid rgba(64,232,255,0.40)',
        borderTop: 'none',
      }}>
        <div style={{
          padding: '6px 10px',
          borderBottom: '1px solid rgba(64,232,255,0.25)',
        }}>
          <span style={{ ...STYLE, fontSize: 12, color: '#40e8ff', letterSpacing: '0.08em' }}>
            ⚙ 設定
          </span>
        </div>

        {email && (
          <Row>
            <span style={{ ...STYLE, fontSize: 12, color: '#8a7aa8' }}>ログイン中</span>
            <span style={{ ...STYLE, fontSize: 13, color: '#b0a8d0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
              {email}
            </span>
          </Row>
        )}

        {onShowHowTo && (
          <button
            onClick={onShowHowTo}
            style={{ width: '100%', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
          >
            <Row>
              <span style={{ ...STYLE, fontSize: 14, color: '#c0f0ff' }}>使い方</span>
              <span style={{ ...STYLE, fontSize: 14, color: '#40e8ff80' }}>▶</span>
            </Row>
          </button>
        )}

        <a href="/terms" style={{ textDecoration: 'none', display: 'block' }}>
          <Row>
            <span style={{ ...STYLE, fontSize: 14, color: '#c0f0ff' }}>利用規約</span>
            <span style={{ ...STYLE, fontSize: 14, color: '#40e8ff80' }}>▶</span>
          </Row>
        </a>

        <a href="/privacy" style={{ textDecoration: 'none', display: 'block' }}>
          <Row>
            <span style={{ ...STYLE, fontSize: 14, color: '#c0f0ff' }}>プライバシーポリシー</span>
            <span style={{ ...STYLE, fontSize: 14, color: '#40e8ff80' }}>▶</span>
          </Row>
        </a>

        <Row>
          <span style={{ ...STYLE, fontSize: 14, color: '#c0f0ff' }}>お問い合わせ</span>
          <span style={{ ...STYLE, fontSize: 13, color: '#b0a8d0', userSelect: 'all' }}>support@2p-profile.info</span>
        </Row>

        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          style={{ width: '100%', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
        >
          <Row>
            <span style={{ ...STYLE, fontSize: 14, color: '#ff40c0' }}>ログアウト</span>
          </Row>
        </button>

        {deleteOpen ? (
          <DeleteAccount onCancel={() => setDeleteOpen(false)} />
        ) : (
          <button
            onClick={() => setDeleteOpen(true)}
            style={{ width: '100%', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
          >
            <Row last>
              <span style={{ ...STYLE, fontSize: 13, color: '#804060' }}>アカウントを削除</span>
            </Row>
          </button>
        )}
      </div>
    </>
  )
}

function Row({ children, last }: { children: React.ReactNode; last?: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
      padding: '12px 12px', minHeight: 44,
      borderBottom: last ? 'none' : '1px solid rgba(255,255,255,0.05)',
    }}>
      {children}
    </div>
  )
}

export function DeleteAccount({ onCancel }: { onCancel: () => void }) {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  async function handleDelete() {
    setDeleting(true)
    setError('')
    const res = await fetch('/api/user/me/delete', { method: 'POST' })
    if (!res.ok) {
      const d = await res.json().catch(() => ({}))
      setError(d.error || 'アカウントの削除に失敗しました')
      setDeleting(false)
      return
    }
    await signOut({ callbackUrl: '/login' })
  }

  const btn = {
    ...STYLE, fontSize: 13, background: 'transparent', padding: '8px 14px',
    cursor: 'pointer', letterSpacing: '0.08em',
  } as const

  return (
    <div className="m-3 p-3 space-y-3" style={{ border: '1px solid #ff4060', background: 'rgba(255,64,96,0.08)' }}>
      <p style={{ ...STYLE, fontSize: 14, color: '#ff8090', lineHeight: 1.8 }}>
        アカウントを削除すると、プロフィール・投稿・Q&amp;A・フォロー関係などすべてのデータが完全に削除され、元に戻せません。
      </p>
      <p style={{ ...STYLE, fontSize: 13, color: '#b0a8d0', lineHeight: 1.8 }}>
        有料プランを利用中の場合、サブスクリプションは自動では解約されません。iPhone の「設定」→ Apple ID →「サブスクリプション」から解約してください。
      </p>
      {error && <p style={{ ...STYLE, fontSize: 13, color: '#ff4060' }}>⚠ {error}</p>}
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} disabled={deleting}
          style={{ ...btn, color: '#b0a8d0', border: '1px solid rgba(176,168,208,0.35)' }}>
          キャンセル
        </button>
        <button onClick={handleDelete} disabled={deleting}
          style={{ ...btn, color: '#fff', background: '#c02040', border: '1px solid #ff4060' }}>
          {deleting ? '削除中...' : '完全に削除する'}
        </button>
      </div>
    </div>
  )
}
