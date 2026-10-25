'use client'

import { useEffect, useState } from 'react'
import QRModal from './QRModal'
import QRScanner from './QRScanner'
import { profileData } from '@/data/profileData'

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

type Props = {
  open: boolean
  onClose: () => void
  demo?: boolean
}

type Me = { name: string | null; handle: string | null }

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

// ヘッダーのシェアアイコンから開くメニュー（QR 表示 / QR 読み込み / リンクをコピー / 招待リンクを作成）
export default function SharePanel({ open, onClose, demo }: Props) {
  const [me, setMe] = useState<Me | null>(null)
  const [showQR, setShowQR] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [copied, setCopied] = useState(false)
  const [invite, setInvite] = useState<{ url: string; copied: boolean } | null>(null)
  const [inviteLoading, setInviteLoading] = useState(false)
  const [error, setError] = useState('')

  // コピーはタップ直後に行わないと iOS で失敗するため、プロフィール URL は開いた時点で用意しておく
  useEffect(() => {
    if (!open) { setCopied(false); setInvite(null); setError(''); return }
    if (me) return
    if (demo) { setMe({ name: profileData.name, handle: profileData.handle }); return }
    fetch('/api/user/me').then(r => r.json()).then(u => u && setMe({ name: u.name, handle: u.handle })).catch(() => {})
  }, [open, demo, me])

  const profileUrl = me?.handle ? `${window.location.origin}/profile/${me.handle}` : null

  async function copyProfile() {
    if (!profileUrl) return
    if (await copyText(profileUrl)) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } else setError('コピーできませんでした')
  }

  async function createInvite() {
    if (demo) { setError('デモでは作成できません'); return }
    setInviteLoading(true)
    setError('')
    const data = await fetch('/api/invite', { method: 'POST' }).then(r => r.json()).catch(() => null)
    setInviteLoading(false)
    if (!data?.token) { setError('招待リンクを作成できませんでした'); return }
    const url = `${window.location.origin}/invite/${data.token}`
    // 通信のあとはコピーが拒否されることがある。その場合は下の「コピー」ボタンで再度コピーしてもらう
    setInvite({ url, copied: await copyText(url) })
  }

  async function copyInvite() {
    if (!invite) return
    setInvite({ ...invite, copied: await copyText(invite.url) })
  }

  if (!open && !showQR && !showScanner) return null

  return (
    <>
      {open && (
        <>
          <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 200 }} />
          <div style={{
            position: 'absolute', top: 42, left: 0, right: 0, zIndex: 201,
            background: 'rgba(6,4,18,0.98)', border: '1px solid rgba(64,232,255,0.40)', borderTop: 'none',
          }}>
            <div style={{ padding: '6px 10px', borderBottom: '1px solid rgba(64,232,255,0.25)' }}>
              <span style={{ ...STYLE, fontSize: 12, color: '#40e8ff', letterSpacing: '0.08em' }}>🔗 シェア</span>
            </div>

            <MenuItem
              icon="📱" label="QRコードを表示" disabled={!profileUrl}
              onClick={() => { onClose(); setShowQR(true) }}
            />
            <MenuItem
              icon="📷" label="QRコードを読み込む"
              onClick={() => { onClose(); setShowScanner(true) }}
            />
            <MenuItem
              icon="🔗" label={copied ? '✓ コピーしました' : 'プロフィールのリンクをコピー'} disabled={!profileUrl}
              color={copied ? '#38ff78' : undefined}
              onClick={copyProfile}
            />
            <MenuItem
              icon="✉️" label={inviteLoading ? '作成中...' : '招待リンクを作成'} disabled={inviteLoading}
              onClick={createInvite} last={!invite && !error}
            />

            {invite && (
              <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ ...STYLE, fontSize: 12, color: invite.copied ? '#38ff78' : '#b0a8d0' }}>
                  {invite.copied ? '✓ 招待リンクをコピーしました（7日間有効）' : '招待リンクを作成しました（7日間有効）'}
                </span>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ ...STYLE, fontSize: 12, color: '#8a7aa8', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', userSelect: 'all' }}>
                    {invite.url}
                  </span>
                  <button onClick={copyInvite} style={smallButton}>コピー</button>
                  {typeof navigator !== 'undefined' && 'share' in navigator && (
                    <button onClick={() => navigator.share({ url: invite.url }).catch(() => {})} style={smallButton}>送る</button>
                  )}
                </div>
              </div>
            )}
            {error && (
              <p style={{ ...STYLE, fontSize: 12, color: '#ff4060', padding: '8px 12px' }}>⚠ {error}</p>
            )}
          </div>
        </>
      )}

      {showQR && profileUrl && (
        <QRModal url={profileUrl} name={me?.name ?? me?.handle ?? ''} onClose={() => setShowQR(false)} />
      )}
      {showScanner && <QRScanner onClose={() => setShowScanner(false)} />}
    </>
  )
}

const smallButton = {
  ...STYLE, fontSize: 12, color: '#40e8ff', background: 'transparent',
  border: '1px solid rgba(64,232,255,0.45)', padding: '5px 10px', cursor: 'pointer', flexShrink: 0,
} as const

function MenuItem({ icon, label, onClick, disabled, color, last }: {
  icon: string; label: string; onClick: () => void; disabled?: boolean; color?: string; last?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%', background: 'none', border: 'none', cursor: disabled ? 'default' : 'pointer', textAlign: 'left',
        display: 'flex', alignItems: 'center', gap: 10, padding: '12px', minHeight: 44,
        borderBottom: last ? 'none' : '1px solid rgba(255,255,255,0.05)', opacity: disabled ? 0.5 : 1,
      }}
    >
      <span style={{ fontSize: 16, width: 18, textAlign: 'center' }}>{icon}</span>
      <span style={{ ...STYLE, fontSize: 14, color: color ?? '#c0f0ff' }}>{label}</span>
    </button>
  )
}
