'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AvatarSVG from '@/components/AvatarSVG'
import { getProximityTitle, PROXIMITY_TITLES } from '@/lib/proximity'

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

type PublicUser = {
  id: string
  name: string | null
  handle: string | null
  image: string | null
  bio: string | null
  proximityCount: number
}

export default function ProfilePage() {
  const { handle } = useParams<{ handle: string }>()
  const router = useRouter()
  const [user, setUser] = useState<PublicUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  // Question sending
  const [showQuestion, setShowQuestion] = useState(false)
  const [questionText, setQuestionText] = useState('')
  const [qSending, setQSending] = useState(false)
  const [qSent, setQSent] = useState(false)
  const qInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch(`/api/user/${handle}`)
      .then(r => {
        if (r.status === 404) { setNotFound(true); setLoading(false); return null }
        return r.json()
      })
      .then(data => { if (data) { setUser(data); setLoading(false) } })
      .catch(() => setLoading(false))
  }, [handle])

  useEffect(() => {
    if (showQuestion) qInputRef.current?.focus()
  }, [showQuestion])

  async function sendQuestion() {
    if (!questionText.trim() || !handle) return
    setQSending(true)
    const res = await fetch('/api/qa/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ handle, question: questionText }),
    })
    if (res.ok) { setQSent(true); setQuestionText(''); setTimeout(() => { setQSent(false); setShowQuestion(false) }, 2000) }
    setQSending(false)
  }

  const pt = user ? getProximityTitle(user.proximityCount) : null
  const next = user ? PROXIMITY_TITLES.slice().reverse().find(t => t.min > user.proximityCount) : null

  return (
    <div style={{ minHeight: '100dvh', background: 'rgba(4,2,12,1)', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 12px',
        background: 'rgba(8,6,20,0.98)',
        borderBottom: '2px solid #ff40c0',
        boxShadow: '0 0 12px rgba(255,64,192,0.30)',
      }}>
        <button
          onClick={() => router.back()}
          style={{
            ...STYLE, fontSize: 11, color: '#ff40c0',
            background: 'none', border: 'none', cursor: 'pointer',
            textShadow: '0 0 6px rgba(255,64,192,0.60)',
          }}
        >
          ‹ もどる
        </button>
        <span style={{ ...STYLE, fontSize: 11, color: '#d0c8f0', letterSpacing: '0.10em' }}>
          プロフィール
        </span>
      </div>

      {loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ ...STYLE, fontSize: 10, color: '#40e8ff' }}>読み込み中...</span>
        </div>
      ) : notFound ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <span style={{ fontSize: 40 }}>👾</span>
          <p style={{ ...STYLE, fontSize: 11, color: '#504870' }}>ユーザーが見つかりません</p>
        </div>
      ) : user && pt ? (
        <div className="overflow-y-auto" style={{ flex: 1 }}>
          {/* Avatar + name */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '24px 16px 16px',
            borderBottom: '1px solid rgba(255,64,192,0.25)',
            background: 'rgba(14,6,32,0.60)',
            gap: 10,
          }}>
            <div style={{ width: 100, height: 100, overflow: 'hidden' }}>
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt={user.name ?? ''} width={100} height={100}
                  style={{ objectFit: 'cover', imageRendering: 'pixelated', display: 'block' }} />
              ) : (
                <AvatarSVG size={100} />
              )}
            </div>
            <span style={{ ...STYLE, fontSize: 18, color: '#d0c8f0', letterSpacing: '0.15em', textShadow: '0 0 10px rgba(208,200,240,0.35)' }}>
              {user.name ?? user.handle ?? '???'}
            </span>
            <span style={{ ...STYLE, fontSize: 10, color: '#604878' }}>
              @{user.handle}
            </span>
          </div>

          {/* Proximity */}
          <div style={{
            margin: 12,
            background: 'rgba(4,2,12,0.70)',
            border: `2px solid ${pt.color}55`,
            boxShadow: `0 0 12px ${pt.color}22`,
          }}>
            <div style={{
              ...STYLE, fontSize: 10, color: pt.color,
              background: `${pt.color}14`,
              borderBottom: `1px solid ${pt.color}33`,
              padding: '4px 10px', letterSpacing: '0.08em',
            }}>
              ■ あなたとの関係
            </div>
            <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ ...STYLE, fontSize: 11, color: pt.color, textShadow: `0 0 8px ${pt.color}99`, letterSpacing: '0.12em' }}>
                  ⚔️ {pt.title}
                </div>
                {next && (
                  <div style={{ ...STYLE, fontSize: 8, color: '#504870', marginTop: 3 }}>
                    次: {next.min - user.proximityCount}回で「{next.title}」
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ ...STYLE, fontSize: 26, color: '#ffd700', textShadow: '0 0 10px rgba(255,215,0,0.60)', lineHeight: 1 }}>
                  {user.proximityCount}
                </div>
                <div style={{ ...STYLE, fontSize: 8, color: '#504870' }}>近くにいた回数</div>
              </div>
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <div style={{ padding: '0 12px 12px' }}>
              <div style={{ ...STYLE, fontSize: 10, color: '#40e8ff', letterSpacing: '0.08em', textShadow: '0 0 6px rgba(64,232,255,0.60)', marginBottom: 6 }}>
                ■ じこしょうかい
              </div>
              <p style={{ ...STYLE, fontSize: 11, color: '#b0a8d0', lineHeight: 2, whiteSpace: 'pre-line' }}>
                {user.bio}
              </p>
            </div>
          )}

          {/* 質問を送る */}
          <div style={{ padding: '0 12px 20px' }}>
            {!showQuestion ? (
              <button
                onClick={() => setShowQuestion(true)}
                style={{
                  ...STYLE, width: '100%', fontSize: 11, color: '#ff40c0',
                  background: 'rgba(4,2,12,0.80)',
                  border: '1px solid rgba(255,64,192,0.45)',
                  boxShadow: '0 0 8px rgba(255,64,192,0.15)',
                  padding: '8px 0', cursor: 'pointer', letterSpacing: '0.08em',
                }}
              >
                💬 質問を送る
              </button>
            ) : qSent ? (
              <div style={{ ...STYLE, fontSize: 11, color: '#38ff78', textAlign: 'center', padding: '8px 0', textShadow: '0 0 8px rgba(56,255,120,0.60)' }}>
                ✓ 質問を送りました！
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, background: 'rgba(8,6,20,0.90)', border: '1px solid rgba(255,64,192,0.35)', padding: 10 }}>
                <span style={{ ...STYLE, fontSize: 9, color: '#ff40c0', letterSpacing: '0.08em' }}>💬 質問を送る</span>
                <input
                  ref={qInputRef}
                  type="text"
                  value={questionText}
                  onChange={e => setQuestionText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendQuestion()}
                  placeholder="質問を入力..."
                  maxLength={100}
                  style={{
                    fontFamily: 'var(--font-pixel, monospace)', fontSize: 11, color: '#d0c8f0',
                    background: 'rgba(4,2,12,0.80)', border: '1px solid rgba(208,200,240,0.30)',
                    padding: '5px 8px', outline: 'none',
                  }}
                />
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={sendQuestion}
                    disabled={qSending || !questionText.trim()}
                    style={{
                      fontFamily: 'var(--font-pixel, monospace)', flex: 1, fontSize: 10, color: '#ff40c0',
                      background: 'rgba(4,2,12,0.90)', border: '1px solid rgba(255,64,192,0.50)',
                      padding: '5px 0', cursor: 'pointer', opacity: qSending ? 0.5 : 1,
                    }}
                  >
                    {qSending ? '送信中...' : '送信'}
                  </button>
                  <button
                    onClick={() => { setShowQuestion(false); setQuestionText('') }}
                    style={{
                      fontFamily: 'var(--font-pixel, monospace)', fontSize: 10, color: '#504870',
                      background: 'transparent', border: '1px solid rgba(80,72,112,0.30)',
                      padding: '5px 12px', cursor: 'pointer',
                    }}
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
