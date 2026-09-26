'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AvatarSVG from '@/components/AvatarSVG'
import FollowListModal from '@/components/FollowListModal'
import PixelBackground from '@/components/PixelBackground'
import { getProximityTitle, PROXIMITY_TITLES } from '@/lib/proximity'

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

type QAItem = { q: string; a: string }

type PublicUser = {
  id: string
  name: string | null
  handle: string | null
  image: string | null
  bio: string | null
  proximityCount: number
  qaItems: QAItem[]
  isFollowing: boolean
  isSelf: boolean
  followingCount: number
  followersCount: number
}

export default function ProfilePage() {
  const { handle } = useParams<{ handle: string }>()
  const router = useRouter()
  const [user, setUser] = useState<PublicUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  // Follow
  const [isFollowing, setIsFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)

  // Share
  const [shareCopied, setShareCopied] = useState(false)
  const [followListType, setFollowListType] = useState<'following' | 'followers' | null>(null)

  // Question sending
  const [showQuestion, setShowQuestion] = useState(false)
  const [questionText, setQuestionText] = useState('')
  const [qSending, setQSending] = useState(false)
  const [qSent, setQSent] = useState(false)
  const qInputRef = useRef<HTMLInputElement>(null)

  // Introduction
  const [showIntro, setShowIntro] = useState(false)
  const [introText, setIntroText] = useState('')
  const [introSending, setIntroSending] = useState(false)
  const [introSent, setIntroSent] = useState(false)

  useEffect(() => {
    fetch(`/api/user/${handle}`)
      .then(r => {
        if (r.status === 404) { setNotFound(true); setLoading(false); return null }
        return r.json()
      })
      .then(data => { if (data) { setUser(data); setIsFollowing(data.isFollowing); setLoading(false) } })
      .catch(() => setLoading(false))
  }, [handle])

  useEffect(() => {
    if (showQuestion) qInputRef.current?.focus()
  }, [showQuestion])

  async function toggleFollow() {
    if (!handle || !user || user.isSelf) return
    setFollowLoading(true)
    if (isFollowing) {
      await fetch(`/api/follows/${user.id}`, { method: 'DELETE' })
      setIsFollowing(false)
    } else {
      await fetch('/api/follows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle }),
      })
      setIsFollowing(true)
    }
    setFollowLoading(false)
  }

  async function sendIntro() {
    if (!introText.trim() || !handle) return
    setIntroSending(true)
    const res = await fetch('/api/introductions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ handle, body: introText }),
    })
    if (res.ok) { setIntroSent(true); setTimeout(() => { setIntroSent(false); setShowIntro(false); setIntroText('') }, 2000) }
    setIntroSending(false)
  }

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

  const titleText = loading
    ? 'プロフィール'
    : notFound
    ? 'プロフィール'
    : user?.handle
    ? `@${user.handle}`
    : 'プロフィール'

  return (
    <div className="relative min-h-dvh">
      <PixelBackground />
      <main className="relative z-10 flex justify-center items-start min-h-dvh px-3 py-10" role="main">
        <div className="w-full" style={{ maxWidth: 360 }}>

          {/* ── Title bar ── */}
          <div className="pixel-titlebar" style={{ justifyContent: 'space-between' }}>
            <button
              onClick={() => router.back()}
              style={{
                ...STYLE, fontSize: 11, color: '#ff40c0',
                background: 'none', border: 'none', cursor: 'pointer',
                textShadow: '0 0 6px rgba(255,64,192,0.60)',
                padding: '0 4px',
              }}
            >
              ‹ もどる
            </button>
            <span style={{ ...STYLE, fontSize: 12, color: '#ffd700', letterSpacing: '0.10em', textShadow: '0 0 8px rgba(255,215,0,0.70)', flex: 1, textAlign: 'center' }}>
              {titleText}
            </span>
            <div style={{ width: 52 }} />
          </div>

          {/* ── Window body ── */}
          <div className="pixel-window overflow-hidden relative scanlines">

            {loading ? (
              <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ ...STYLE, fontSize: 10, color: '#40e8ff' }}>読み込み中...</span>
              </div>
            ) : notFound ? (
              <div style={{ height: 240, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <span style={{ fontSize: 40 }}>👾</span>
                <p style={{ ...STYLE, fontSize: 11, color: '#504870' }}>ユーザーが見つかりません</p>
              </div>
            ) : user && pt ? (
              <div className="overflow-y-auto" style={{ maxHeight: 'calc(100dvh - 180px)' }}>

                {/* ── Header ── */}
                <div
                  className="flex flex-col items-center py-5 px-4 gap-3"
                  style={{ borderBottom: '1px solid rgba(255,64,192,0.30)', background: 'rgba(14,6,32,0.60)' }}
                >
                  {/* Avatar */}
                  <div style={{ width: 140, height: 140, overflow: 'hidden' }}>
                    {user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.image}
                        alt={user.name ?? ''}
                        width={140}
                        height={140}
                        style={{ objectFit: 'cover', imageRendering: 'pixelated', display: 'block' }}
                      />
                    ) : (
                      <AvatarSVG size={140} />
                    )}
                  </div>

                  {/* Name */}
                  <span
                    className="text-xl font-bold"
                    style={{ ...STYLE, color: '#d0c8f0', letterSpacing: '0.15em', textShadow: '0 0 10px rgba(208,200,240,0.35)' }}
                  >
                    {user.name ?? user.handle ?? '???'}
                  </span>

                  {/* Handle */}
                  <p className="text-xs -mt-2" style={{ ...STYLE, color: '#604878' }}>
                    @{user.handle}
                  </p>

                  {/* フォロー / フォロワー counts */}
                  <div style={{ display: 'flex', gap: 20, marginTop: 2 }}>
                    <button
                      onClick={() => setFollowListType('following')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, padding: 0 }}
                    >
                      <span style={{ ...STYLE, fontSize: 16, color: '#d0c8f0', lineHeight: 1 }}>{user.followingCount ?? 0}</span>
                      <span style={{ ...STYLE, fontSize: 8, color: '#604878' }}>フォロー</span>
                    </button>
                    <button
                      onClick={() => setFollowListType('followers')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, padding: 0 }}
                    >
                      <span style={{ ...STYLE, fontSize: 16, color: '#d0c8f0', lineHeight: 1 }}>{user.followersCount ?? 0}</span>
                      <span style={{ ...STYLE, fontSize: 8, color: '#604878' }}>フォロワー</span>
                    </button>
                  </div>

                  {/* フォロー + シェア + QR (non-self only) */}
                  {!user.isSelf && (
                    <div className="w-full flex flex-col gap-2 mt-1">
                      <button
                        onClick={toggleFollow}
                        disabled={followLoading}
                        style={{
                          ...STYLE, width: '100%', fontSize: 10,
                          color: isFollowing ? '#38ff78' : '#ff40c0',
                          background: 'rgba(8,6,20,0.92)',
                          border: `1px solid ${isFollowing ? 'rgba(56,255,120,0.50)' : 'rgba(255,64,192,0.45)'}`,
                          padding: '5px 0', cursor: followLoading ? 'default' : 'pointer',
                          opacity: followLoading ? 0.6 : 1, letterSpacing: '0.06em',
                        }}
                      >
                        {isFollowing ? '✓ フォロー中' : '＋ フォロー'}
                      </button>
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            const url = `${window.location.origin}/profile/${user.handle}`
                            if (navigator.share) {
                              await navigator.share({ title: `${user.name ?? user.handle} のプロフ`, url })
                            } else {
                              await navigator.clipboard.writeText(url).catch(() => {})
                              setShareCopied(true)
                              setTimeout(() => setShareCopied(false), 2500)
                            }
                          }}
                          style={{
                            ...STYLE, flex: 1, fontSize: 10,
                            color: shareCopied ? '#38ff78' : '#ffd700',
                            background: 'rgba(8,6,20,0.92)',
                            border: `1px solid ${shareCopied ? 'rgba(56,255,120,0.50)' : 'rgba(255,215,0,0.45)'}`,
                            padding: '5px 0', cursor: 'pointer', letterSpacing: '0.06em',
                          }}
                        >
                          {shareCopied ? '✓ コピー完了' : '🔗 プロフをシェア'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── あなたとの関係 ── */}
                <div style={{ padding: '12px 12px 0' }}>
                  <div style={{
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
                </div>

                {/* ── Bio ── */}
                {user.bio && (
                  <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(64,232,255,0.15)' }}>
                    <h3 className="text-xs font-bold mb-2" style={{ ...STYLE, color: '#40e8ff', letterSpacing: '0.08em', textShadow: '0 0 6px rgba(64,232,255,0.60)' }}>
                      ■ じこしょうかい
                    </h3>
                    <p className="text-xs whitespace-pre-line" style={{ ...STYLE, color: '#b0a8d0', lineHeight: '2.1' }}>
                      {user.bio}
                    </p>
                  </div>
                )}

                {/* ── Q&A ── */}
                {user.qaItems?.length > 0 && (
                  <div style={{ borderTop: '1px solid rgba(64,232,255,0.15)' }}>
                    <div style={{
                      background: 'rgba(4,10,22,0.85)',
                      borderTop: '1px solid rgba(64,232,255,0.38)',
                      borderBottom: '1px solid rgba(64,232,255,0.38)',
                    }}>
                      <div style={{ ...STYLE, fontSize: 10, color: '#40e8ff', letterSpacing: '0.06em', padding: '6px 12px', textShadow: '0 0 6px rgba(64,232,255,0.60)' }}>
                        ■ Q&amp;A
                      </div>
                    </div>
                    {user.qaItems.filter(i => i.a.trim() !== '').map((item, idx) => (
                      <QARow key={idx} idx={idx} item={item} />
                    ))}
                  </div>
                )}

                {/* ── 質問を送る ── */}
                {!user.isSelf && (
                  <div className="px-4 py-4" style={{ borderTop: '1px solid rgba(255,64,192,0.10)' }}>
                    {!showQuestion ? (
                      <button
                        onClick={() => setShowQuestion(true)}
                        style={{
                          ...STYLE, width: '100%', fontSize: 10, color: '#ff40c0',
                          background: 'rgba(8,6,20,0.92)',
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
                          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); sendQuestion() } }}
                          placeholder="質問を入力..."
                          maxLength={100}
                          style={{
                            ...STYLE, fontSize: 11, color: '#d0c8f0',
                            background: 'rgba(4,2,12,0.80)', border: '1px solid rgba(208,200,240,0.30)',
                            padding: '5px 8px', outline: 'none',
                          }}
                        />
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            onClick={sendQuestion}
                            disabled={qSending || !questionText.trim()}
                            style={{
                              ...STYLE, flex: 1, fontSize: 10, color: '#ff40c0',
                              background: 'rgba(4,2,12,0.90)', border: '1px solid rgba(255,64,192,0.50)',
                              padding: '5px 0', cursor: 'pointer', opacity: qSending ? 0.5 : 1,
                            }}
                          >
                            {qSending ? '送信中...' : '送信'}
                          </button>
                          <button
                            onClick={() => { setShowQuestion(false); setQuestionText('') }}
                            style={{
                              ...STYLE, fontSize: 10, color: '#504870',
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
                )}

                {/* ── 紹介文を書く ── */}
                {!user.isSelf && (
                  <div className="px-4 py-4" style={{ borderTop: '1px solid rgba(64,232,255,0.10)' }}>
                    {!showIntro ? (
                      <button
                        onClick={() => setShowIntro(true)}
                        style={{
                          ...STYLE, width: '100%', fontSize: 10, color: '#40e8ff',
                          background: 'rgba(8,6,20,0.92)',
                          border: '1px solid rgba(64,232,255,0.40)',
                          boxShadow: '0 0 8px rgba(64,232,255,0.10)',
                          padding: '8px 0', cursor: 'pointer', letterSpacing: '0.08em',
                        }}
                      >
                        ✎ この人の紹介文を書く
                      </button>
                    ) : introSent ? (
                      <div style={{ ...STYLE, fontSize: 11, color: '#38ff78', textAlign: 'center', padding: '8px 0', textShadow: '0 0 8px rgba(56,255,120,0.60)' }}>
                        ✓ 紹介文を送りました！
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, background: 'rgba(8,6,20,0.90)', border: '1px solid rgba(64,232,255,0.35)', padding: 10 }}>
                        <span style={{ ...STYLE, fontSize: 9, color: '#40e8ff', letterSpacing: '0.08em' }}>✎ この人の紹介文を書く</span>
                        <textarea
                          value={introText}
                          onChange={e => setIntroText(e.target.value)}
                          placeholder={`${user.name ?? user.handle} さんの紹介文を書いてあげよう`}
                          maxLength={200}
                          rows={3}
                          style={{
                            ...STYLE, fontSize: 11, color: '#d0c8f0',
                            background: 'rgba(4,2,12,0.80)', border: '1px solid rgba(64,232,255,0.30)',
                            padding: '5px 8px', outline: 'none', resize: 'none', lineHeight: 1.8,
                          }}
                        />
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            onClick={sendIntro}
                            disabled={introSending || !introText.trim()}
                            style={{
                              ...STYLE, flex: 1, fontSize: 10, color: '#40e8ff',
                              background: 'rgba(4,2,12,0.90)', border: '1px solid rgba(64,232,255,0.45)',
                              padding: '5px 0', cursor: 'pointer', opacity: introSending ? 0.5 : 1,
                            }}
                          >
                            {introSending ? '送信中...' : '送信'}
                          </button>
                          <button
                            onClick={() => { setShowIntro(false); setIntroText('') }}
                            style={{
                              ...STYLE, fontSize: 10, color: '#504870',
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
                )}

              </div>
            ) : null}

            {/* ── Status bar ── */}
            <div className="pixel-statusbar">
              ★ 2P PROF v1.0 ★ ともだちと紹介しあおう！
            </div>
          </div>

        </div>
      </main>

      {/* ── Modals ── */}
      {followListType && user?.handle && (
        <FollowListModal
          handle={user.handle}
          type={followListType}
          onClose={() => setFollowListType(null)}
        />
      )}
    </div>
  )
}

function QARow({ idx, item }: { idx: number; item: { q: string; a: string } }) {
  const rowBg = idx % 2 === 0 ? 'rgba(8,6,20,0.70)' : 'rgba(12,8,28,0.70)'
  return (
    <div style={{
      borderBottom: '1px solid rgba(64,232,255,0.10)',
      borderLeft: '3px solid #38ff78',
      background: rowBg,
      padding: '8px 12px 10px',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 5 }}>
        <span style={{ fontSize: 10, color: '#40e8ff', minWidth: 22, flexShrink: 0, paddingTop: 1 }}>
          {String(idx + 1).padStart(2, '0')}
        </span>
        <p style={{ fontFamily: 'var(--font-pixel, monospace)', fontSize: 11, color: '#9888b8', margin: 0, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
          {item.q}
        </p>
      </div>
      <div style={{ paddingLeft: 30 }}>
        <p style={{ fontFamily: 'var(--font-pixel, monospace)', fontSize: 11, color: '#38ff78', lineHeight: 1.9, whiteSpace: 'pre-wrap', margin: 0 }}>
          <span style={{ color: '#38ff7888' }}>{'> '}</span>{item.a}
        </p>
      </div>
    </div>
  )
}
