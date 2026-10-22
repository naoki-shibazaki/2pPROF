'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { DeleteAccount } from './SettingsPanel'
import { HP_MAX } from '@/lib/hp-max'

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

// ログインしていなくても見られるページでは数えない
const PUBLIC_PREFIXES = ['/login', '/terms', '/privacy', '/support', '/invite']

type HpState = { hp: number; max: number; locked: boolean; resetAt: string }

// HP = 今日アプリを開ける残り回数。起動・復帰のたびに 1 減り、0 で開くと翌日 0:00 まで使えない
// 減った HP は 'hp-update' イベントで MyProfile に伝える
export default function HpGate() {
  const pathname = usePathname()
  const isPublic = PUBLIC_PREFIXES.some(p => pathname?.startsWith(p))
  const [state, setState] = useState<HpState | null>(null)

  useEffect(() => {
    if (isPublic) return
    const open = () => fetch('/api/user/open', { method: 'POST' })
      .then(r => (r.ok ? r.json() : null))
      .then((s: HpState | null) => {
        if (!s) return
        setState(s)
        window.dispatchEvent(new CustomEvent('hp-update', { detail: s.hp }))
      })
      .catch(() => {})
    void open()
    const onVisible = () => { if (document.visibilityState === 'visible') void open() }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [isPublic])

  if (isPublic || !state?.locked) return null
  return <LockScreen resetAt={state.resetAt} />
}

function LockScreen({ resetAt }: { resetAt: string }) {
  const [now, setNow] = useState(() => Date.now())
  const [deleteOpen, setDeleteOpen] = useState(false)
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(id)
  }, [])

  const mins = Math.max(0, Math.ceil((new Date(resetAt).getTime() - now) / 60_000))
  // 日付が変わったら読み込み直して HP を回復させる
  useEffect(() => { if (mins === 0) window.location.reload() }, [mins])

  const btn = {
    ...STYLE, width: '100%', minHeight: 44, fontSize: 11, background: 'transparent', cursor: 'pointer', letterSpacing: '0.08em',
  } as const

  return (
    <div role="dialog" aria-modal="true" style={{
      position: 'fixed', inset: 0, zIndex: 1000, background: '#04020c', overflowY: 'auto',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 'calc(env(safe-area-inset-top) + 24px) 20px calc(env(safe-area-inset-bottom) + 24px)',
    }}>
      <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
        <p style={{ ...STYLE, fontSize: 40, color: '#ff4060', textShadow: '0 0 16px rgba(255,64,96,0.6)' }}>HP 0</p>
        <h1 style={{ ...STYLE, fontSize: 15, color: '#ff40c0', letterSpacing: '0.08em' }}>今日のHPがなくなりました</h1>
        <p style={{ ...STYLE, fontSize: 11, color: '#b0a8d0', lineHeight: 2 }}>
          アプリを開けるのは1日{HP_MAX}回までです。<br />
          明日 0:00 に全回復します。
        </p>
        <p style={{ ...STYLE, fontSize: 12, color: '#40e8ff' }}>
          回復まであと {Math.floor(mins / 60)}時間{mins % 60}分
        </p>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
          <button onClick={() => signOut({ callbackUrl: '/login' })} style={{ ...btn, color: '#ff40c0', border: '1px solid rgba(255,64,192,0.5)' }}>
            ログアウト
          </button>
          <a href="/support" style={{ ...btn, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b0a8d0', border: '1px solid rgba(176,168,208,0.35)', textDecoration: 'none' }}>
            サポート・お問い合わせ
          </a>
          {deleteOpen ? (
            <div style={{ textAlign: 'left' }}><DeleteAccount onCancel={() => setDeleteOpen(false)} /></div>
          ) : (
            <button onClick={() => setDeleteOpen(true)} style={{ ...btn, fontSize: 10, color: '#804060', border: 'none' }}>
              アカウントを削除
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
