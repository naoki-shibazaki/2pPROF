'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AvatarSVG from '@/components/AvatarSVG'

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

type Creator = {
  id: string
  name: string | null
  handle: string | null
  image: string | null
}

export default function InvitePage() {
  const { token } = useParams<{ token: string }>()
  const router = useRouter()
  const [creator, setCreator] = useState<Creator | null>(null)
  const [loading, setLoading] = useState(true)
  const [invalid, setInvalid] = useState(false)
  const [accepting, setAccepting] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    fetch(`/api/invite/${token}`)
      .then(r => { if (!r.ok) { setInvalid(true); setLoading(false); return null } return r.json() })
      .then(data => { if (data) { setCreator(data); setLoading(false) } })
      .catch(() => { setInvalid(true); setLoading(false) })
  }, [token])

  async function accept() {
    setAccepting(true)
    const res = await fetch(`/api/invite/${token}`, { method: 'POST' })
    const data = await res.json()
    if (res.ok) {
      setDone(true)
      setTimeout(() => router.push('/'), 1500)
    } else {
      alert(data.error ?? 'エラーが発生しました')
      setAccepting(false)
    }
  }

  return (
    <div style={{
      minHeight: '100dvh', background: 'rgba(4,2,12,1)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      {loading ? (
        <span style={{ ...STYLE, fontSize: 11, color: '#40e8ff' }}>読み込み中...</span>
      ) : invalid ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 40 }}>👾</span>
          <p style={{ ...STYLE, fontSize: 11, color: '#ff4060', textAlign: 'center' }}>
            招待リンクが無効または期限切れです
          </p>
          <button onClick={() => router.push('/')} style={{ ...STYLE, fontSize: 10, color: '#40e8ff', background: 'none', border: '1px solid #40e8ff', padding: '6px 16px', cursor: 'pointer' }}>
            ホームへ
          </button>
        </div>
      ) : creator ? (
        <div style={{
          background: 'rgba(8,6,20,0.98)',
          border: '3px solid #ffd700',
          boxShadow: '0 0 24px rgba(255,215,0,0.35)',
          width: '100%', maxWidth: 300,
        }}>
          <div style={{
            ...STYLE, fontSize: 13, color: '#ffd700',
            background: 'linear-gradient(90deg,#18042e,#2e0860,#18042e)',
            borderBottom: '2px solid #ffd700',
            padding: '6px 12px', letterSpacing: '0.10em',
            textShadow: '0 0 8px rgba(255,215,0,0.70)',
          }}>
            ■ ともだち招待
          </div>

          <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 72, height: 72, overflow: 'hidden' }}>
              {creator.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={creator.image} alt="" width={72} height={72}
                  style={{ objectFit: 'cover', imageRendering: 'pixelated', display: 'block' }} />
              ) : <AvatarSVG size={72} />}
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ ...STYLE, fontSize: 16, color: '#d0c8f0', letterSpacing: '0.12em' }}>
                {creator.name ?? creator.handle}
              </div>
              <div style={{ ...STYLE, fontSize: 9, color: '#504870', marginTop: 2 }}>
                @{creator.handle}
              </div>
            </div>

            <p style={{ ...STYLE, fontSize: 10, color: '#b0a8d0', textAlign: 'center', lineHeight: 2, marginTop: 4 }}>
              があなたを招待しています。<br />フォローしてつながりましょう！
            </p>

            {done ? (
              <div style={{ ...STYLE, fontSize: 12, color: '#38ff78', textShadow: '0 0 8px rgba(56,255,120,0.60)' }}>
                ✓ フォローしました！
              </div>
            ) : (
              <button
                onClick={accept}
                disabled={accepting}
                style={{
                  ...STYLE, fontSize: 12, color: '#38ff78',
                  background: 'rgba(4,2,12,0.90)',
                  border: '2px solid rgba(56,255,120,0.70)',
                  boxShadow: '0 0 10px rgba(56,255,120,0.25)',
                  padding: '8px 24px', cursor: accepting ? 'default' : 'pointer',
                  opacity: accepting ? 0.6 : 1, width: '100%',
                  letterSpacing: '0.08em',
                }}
              >
                {accepting ? '処理中...' : 'フォローする'}
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
