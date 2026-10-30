'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

// 招待リンク（https://2p-profile.info/invite/xxxx）か、トークンだけでも受け付ける
function tokenFrom(text: string) {
  return text.trim().match(/(?:invite\/)?([a-f0-9]{16})(?:[/?#]|$)/i)?.[1]?.toLowerCase() ?? null
}

// 招待されていない人に出す画面。2P PROF は友達の招待リンクからだけ始められる
export default function InviteGate({ error: initialError, onClaimed }: { error?: string; onClaimed: (inviter: { name: string | null; handle: string | null }) => void }) {
  const [link, setLink] = useState('')
  const [error, setError] = useState(initialError ?? '')
  const [loading, setLoading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const token = tokenFrom(link)
    if (!token) { setError('招待リンクを貼り付けてください'); return }
    setLoading(true)
    setError('')
    const res = await fetch('/api/user/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    }).catch(() => null)
    const d = await res?.json().catch(() => null)
    setLoading(false)
    if (!res?.ok) { setError(d?.error || '確認できませんでした。もう一度お試しください'); return }
    onClaimed(d.inviter)
  }

  async function deleteAccount() {
    await fetch('/api/user/me/delete', { method: 'POST' }).catch(() => null)
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <div className="space-y-5">
      <div className="text-center space-y-3 py-2">
        <p className="font-pixel" style={{ fontSize: 18, color: '#ffd700', textShadow: '0 0 8px rgba(255,215,0,0.6)' }}>
          2P PROF は招待制です
        </p>
        <p className="font-pixel" style={{ fontSize: 14, color: '#d0c8f0', lineHeight: 2 }}>
          使っている友達に、招待リンクを送ってもらってね。<br />
          届いたリンクを開くと、登録を続けられます。
        </p>
      </div>

      <form onSubmit={submit} className="space-y-2">
        <label htmlFor="invite-link" className="font-pixel block" style={{ fontSize: 13, color: '#40e8ff' }}>
          ▶ 招待リンクを貼り付ける
        </label>
        <input
          id="invite-link"
          value={link}
          onChange={e => setLink(e.target.value)}
          placeholder="https://2p-profile.info/invite/..."
          autoCapitalize="none"
          autoCorrect="off"
          className="w-full bg-transparent font-pixel text-sm px-3 py-2 outline-none"
          style={{ border: '1px solid rgba(64,232,255,0.35)', color: '#c0f0ff', minHeight: 44 }}
        />
        {error && (
          <p role="alert" className="font-pixel" style={{ fontSize: 13, color: '#ff8090', lineHeight: 1.8 }}>⚠ {error}</p>
        )}
        <button type="submit" disabled={loading || !link.trim()} className="pixel-action-btn w-full justify-center py-3" style={{ fontSize: 16 }}>
          {loading ? '確認中...' : '招待リンクで続ける ▶'}
        </button>
      </form>

      <div className="flex flex-col items-center gap-3 pt-4" style={{ borderTop: '1px solid rgba(64,232,255,0.15)' }}>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="font-pixel"
          style={{ fontSize: 14, color: '#ff40c0', background: 'none', border: 'none', cursor: 'pointer', minHeight: 40 }}
        >
          ログアウト
        </button>
        {confirmDelete ? (
          <div className="flex gap-2 items-center">
            <span className="font-pixel" style={{ fontSize: 12, color: '#b0a8d0' }}>このアカウントを削除しますか？</span>
            <button onClick={deleteAccount} className="font-pixel" style={{ fontSize: 12, color: '#ff4060', background: 'none', border: '1px solid rgba(255,64,96,0.5)', padding: '6px 10px', cursor: 'pointer' }}>削除する</button>
            <button onClick={() => setConfirmDelete(false)} className="font-pixel" style={{ fontSize: 12, color: '#8a80b0', background: 'none', border: 'none', cursor: 'pointer' }}>やめる</button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="font-pixel"
            style={{ fontSize: 12, color: '#7a70a0', background: 'none', border: 'none', cursor: 'pointer', minHeight: 36 }}
          >
            アカウントを削除
          </button>
        )}
      </div>
    </div>
  )
}
