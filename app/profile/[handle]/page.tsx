'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AvatarSVG from '@/components/AvatarSVG'
import FollowListModal from '@/components/FollowListModal'
import PixelBackground from '@/components/PixelBackground'
import { getProximityTitle, PROXIMITY_TITLES } from '@/lib/proximity'
import { qaHash } from '@/lib/qa-hash'

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

type QAItem = { q: string; a: string }
type IntroItem = { id: string; body: string; met_year: number | null; met_month: number | null; author_name: string | null; author_handle: string | null }
type FriendItem = { id: string; name: string | null; handle: string | null; image: string | null; proximity_count: number }
type TabType = 'profile' | 'friends' | 'intro'

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
  const [activeTab, setActiveTab] = useState<TabType>('profile')

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

  // Friends list
  const [friends, setFriends] = useState<FriendItem[]>([])
  useEffect(() => {
    if (!handle) return
    fetch(`/api/friends?handle=${handle}`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setFriends(data) })
      .catch(() => {})
  }, [handle])

  // Introductions list
  const [intros, setIntros] = useState<IntroItem[]>([])

  // Introduction write
  const [showIntro, setShowIntro] = useState(false)
  const [introText, setIntroText] = useState('')
  const [introSending, setIntroSending] = useState(false)
  const [introSent, setIntroSent] = useState(false)
  const [metYear, setMetYear] = useState(() => String(new Date().getFullYear()))
  const [metMonth, setMetMonth] = useState('')

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
    if (!handle) return
    fetch(`/api/introductions?handle=${handle}`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setIntros(data) })
      .catch(() => {})
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
      body: JSON.stringify({ handle, body: introText, metYear: metYear || null, metMonth: metMonth || null }),
    })
    if (res.ok) {
      const newIntro: IntroItem = { id: Date.now().toString(), body: introText, met_year: metYear ? Number(metYear) : null, met_month: metMonth ? Number(metMonth) : null, author_name: null, author_handle: null }
      setIntros(prev => [newIntro, ...prev.filter(i => i.author_handle !== null || i.id !== newIntro.id)])
      setIntroSent(true)
      setTimeout(() => { setIntroSent(false); setShowIntro(false); setIntroText(''); setMetYear(String(new Date().getFullYear())); setMetMonth('') }, 2000)
    }
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

  const titleText = loading ? 'プロフィール' : notFound ? 'プロフィール' : user?.handle ? `@${user.handle}` : 'プロフィール'

  const tabs: { id: TabType; label: string; badge?: number }[] = [
    { id: 'profile', label: 'マイページ' },
    { id: 'friends', label: '友達', badge: friends.length || undefined },
    { id: 'intro', label: '他己紹介', badge: intros.length || undefined },
  ]

  return (
    <div className="relative min-h-dvh">
      <PixelBackground />
      <main className="relative z-10 flex justify-center items-start min-h-dvh px-3 py-10" role="main">
        <div className="w-full" style={{ maxWidth: 360 }}>

          {/* ── Title bar ── */}
          <div className="pixel-titlebar" style={{ justifyContent: 'space-between' }}>
            <button
              onClick={() => router.back()}
              style={{ ...STYLE, fontSize: 11, color: '#ff40c0', background: 'none', border: 'none', cursor: 'pointer', textShadow: '0 0 6px rgba(255,64,192,0.60)', padding: '0 4px' }}
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
              <>
                {/* ── Header (always visible) ── */}
                <div
                  className="flex flex-col items-center py-5 px-4 gap-3"
                  style={{ borderBottom: '1px solid rgba(255,64,192,0.30)', background: 'rgba(14,6,32,0.60)' }}
                >
                  <div style={{ width: 140, height: 140, overflow: 'hidden' }}>
                    {user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.image} alt={user.name ?? ''} width={140} height={140}
                        style={{ objectFit: 'cover', imageRendering: 'pixelated', display: 'block' }} />
                    ) : (
                      <AvatarSVG size={140} />
                    )}
                  </div>

                  <span className="text-xl font-bold" style={{ ...STYLE, color: '#d0c8f0', letterSpacing: '0.15em', textShadow: '0 0 10px rgba(208,200,240,0.35)' }}>
                    {user.name ?? user.handle ?? '???'}
                  </span>
                  <p className="text-xs -mt-2" style={{ ...STYLE, color: '#604878' }}>@{user.handle}</p>

                  <div style={{ display: 'flex', gap: 20, marginTop: 2 }}>
                    <button onClick={() => setFollowListType('following')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, padding: 0 }}>
                      <span style={{ ...STYLE, fontSize: 16, color: '#d0c8f0', lineHeight: 1 }}>{user.followingCount ?? 0}</span>
                      <span style={{ ...STYLE, fontSize: 8, color: '#604878' }}>フォロー</span>
                    </button>
                    <button onClick={() => setFollowListType('followers')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, padding: 0 }}>
                      <span style={{ ...STYLE, fontSize: 16, color: '#d0c8f0', lineHeight: 1 }}>{user.followersCount ?? 0}</span>
                      <span style={{ ...STYLE, fontSize: 8, color: '#604878' }}>フォロワー</span>
                    </button>
                  </div>

                  {!user.isSelf && (
                    <div className="w-full flex flex-col gap-2 mt-1">
                      <button onClick={toggleFollow} disabled={followLoading} style={{ ...STYLE, width: '100%', fontSize: 10, color: isFollowing ? '#38ff78' : '#ff40c0', background: 'rgba(8,6,20,0.92)', border: `1px solid ${isFollowing ? 'rgba(56,255,120,0.50)' : 'rgba(255,64,192,0.45)'}`, padding: '5px 0', cursor: followLoading ? 'default' : 'pointer', opacity: followLoading ? 0.6 : 1, letterSpacing: '0.06em' }}>
                        {isFollowing ? '✓ フォロー中' : '＋ フォロー'}
                      </button>
                      <button
                        onClick={async () => {
                          const url = `${window.location.origin}/profile/${user.handle}`
                          if (navigator.share) { await navigator.share({ title: `${user.name ?? user.handle} のプロフ`, url }) }
                          else { await navigator.clipboard.writeText(url).catch(() => {}); setShareCopied(true); setTimeout(() => setShareCopied(false), 2500) }
                        }}
                        style={{ ...STYLE, width: '100%', fontSize: 10, color: shareCopied ? '#38ff78' : '#ffd700', background: 'rgba(8,6,20,0.92)', border: `1px solid ${shareCopied ? 'rgba(56,255,120,0.50)' : 'rgba(255,215,0,0.45)'}`, padding: '5px 0', cursor: 'pointer', letterSpacing: '0.06em' }}
                      >
                        {shareCopied ? '✓ コピー完了' : '🔗 プロフをシェア'}
                      </button>
                    </div>
                  )}
                </div>

                {/* ── Tab bar ── */}
                <div style={{ background: 'rgba(4,10,22,0.85)', borderBottom: '2px solid #40e8ff', display: 'flex' }}>
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      style={{
                        ...STYLE, flex: 1, fontSize: 10, padding: '7px 4px',
                        cursor: 'pointer', letterSpacing: '0.05em',
                        color: activeTab === tab.id ? '#40e8ff' : '#504870',
                        background: activeTab === tab.id ? 'rgba(64,232,255,0.08)' : 'transparent',
                        border: 'none',
                        borderBottom: activeTab === tab.id ? '2px solid #40e8ff' : '2px solid transparent',
                        textShadow: activeTab === tab.id ? '0 0 6px rgba(64,232,255,0.60)' : 'none',
                        position: 'relative',
                      }}
                    >
                      {tab.label}
                      {tab.badge ? (
                        <span style={{ marginLeft: 3, ...STYLE, fontSize: 8, color: activeTab === tab.id ? '#40e8ff' : '#504870' }}>
                          ({tab.badge})
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>

                {/* ── Tab content ── */}
                <div className="overflow-y-auto" style={{ maxHeight: 'calc(100dvh - 280px)' }}>

                  {/* マイページ tab */}
                  {activeTab === 'profile' && (
                    <div>
                      {/* あなたとの関係 */}
                      <div style={{ padding: '12px 12px 0' }}>
                        <div style={{ background: 'rgba(4,2,12,0.70)', border: `2px solid ${pt.color}55`, boxShadow: `0 0 12px ${pt.color}22` }}>
                          <div style={{ ...STYLE, fontSize: 10, color: pt.color, background: `${pt.color}14`, borderBottom: `1px solid ${pt.color}33`, padding: '4px 10px', letterSpacing: '0.08em' }}>
                            ■ あなたとの関係
                          </div>
                          <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                              <div style={{ ...STYLE, fontSize: 11, color: pt.color, textShadow: `0 0 8px ${pt.color}99`, letterSpacing: '0.12em' }}>⚔️ {pt.title}</div>
                              {next && <div style={{ ...STYLE, fontSize: 8, color: '#504870', marginTop: 3 }}>次: {next.min - user.proximityCount}回で「{next.title}」</div>}
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ ...STYLE, fontSize: 26, color: '#ffd700', textShadow: '0 0 10px rgba(255,215,0,0.60)', lineHeight: 1 }}>{user.proximityCount}</div>
                              <div style={{ ...STYLE, fontSize: 8, color: '#504870' }}>近くにいた回数</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bio */}
                      {user.bio && (
                        <div className="px-4 py-3" style={{ marginTop: 8, borderTop: '1px solid rgba(64,232,255,0.15)' }}>
                          <h3 className="text-xs font-bold mb-2" style={{ ...STYLE, color: '#40e8ff', letterSpacing: '0.08em', textShadow: '0 0 6px rgba(64,232,255,0.60)' }}>■ じこしょうかい</h3>
                          <p className="text-xs whitespace-pre-line" style={{ ...STYLE, color: '#b0a8d0', lineHeight: '2.1' }}>{user.bio}</p>
                        </div>
                      )}

                      {/* Q&A */}
                      {user.qaItems?.filter(i => i.a.trim()).length > 0 && (
                        <div style={{ borderTop: '1px solid rgba(64,232,255,0.15)' }}>
                          <div style={{ background: 'rgba(4,10,22,0.85)', borderBottom: '1px solid rgba(64,232,255,0.38)', padding: '6px 12px', ...STYLE, fontSize: 10, color: '#40e8ff', letterSpacing: '0.06em', textShadow: '0 0 6px rgba(64,232,255,0.60)' }}>
                            ■ Q&amp;A
                          </div>
                          {user.qaItems.filter(i => i.a.trim()).map((item, idx) => (
                            <QARow key={idx} idx={idx} item={item} handle={user.handle ?? ''} isSelf={user.isSelf} />
                          ))}
                        </div>
                      )}

                      {/* 質問を送る */}
                      {!user.isSelf && (
                        <div className="px-4 py-4" style={{ borderTop: '1px solid rgba(255,64,192,0.10)' }}>
                          {!showQuestion ? (
                            <button onClick={() => setShowQuestion(true)} style={{ ...STYLE, width: '100%', fontSize: 10, color: '#ff40c0', background: 'rgba(8,6,20,0.92)', border: '1px solid rgba(255,64,192,0.45)', padding: '8px 0', cursor: 'pointer', letterSpacing: '0.08em' }}>
                              💬 質問を送る
                            </button>
                          ) : qSent ? (
                            <div style={{ ...STYLE, fontSize: 11, color: '#38ff78', textAlign: 'center', padding: '8px 0' }}>✓ 質問を送りました！</div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, background: 'rgba(8,6,20,0.90)', border: '1px solid rgba(255,64,192,0.35)', padding: 10 }}>
                              <span style={{ ...STYLE, fontSize: 9, color: '#ff40c0' }}>💬 質問を送る</span>
                              <input ref={qInputRef} type="text" value={questionText} onChange={e => setQuestionText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); sendQuestion() } }} placeholder="質問を入力..." maxLength={100}
                                style={{ ...STYLE, fontSize: 11, color: '#d0c8f0', background: 'rgba(4,2,12,0.80)', border: '1px solid rgba(208,200,240,0.30)', padding: '5px 8px', outline: 'none' }} />
                              <div style={{ display: 'flex', gap: 6 }}>
                                <button onClick={sendQuestion} disabled={qSending || !questionText.trim()} style={{ ...STYLE, flex: 1, fontSize: 10, color: '#ff40c0', background: 'rgba(4,2,12,0.90)', border: '1px solid rgba(255,64,192,0.50)', padding: '5px 0', cursor: 'pointer', opacity: qSending ? 0.5 : 1 }}>
                                  {qSending ? '送信中...' : '送信'}
                                </button>
                                <button onClick={() => { setShowQuestion(false); setQuestionText('') }} style={{ ...STYLE, fontSize: 10, color: '#504870', background: 'transparent', border: '1px solid rgba(80,72,112,0.30)', padding: '5px 12px', cursor: 'pointer' }}>
                                  キャンセル
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* その人の友達 tab */}
                  {activeTab === 'friends' && (
                    <div>
                      {friends.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 py-10">
                          <span style={{ fontSize: 28 }}>👥</span>
                          <p style={{ ...STYLE, fontSize: 10, color: '#504870', textAlign: 'center', lineHeight: 2 }}>まだ友達がいません</p>
                        </div>
                      ) : (
                        friends.map(f => (
                          <button
                            key={f.id}
                            onClick={() => f.handle && router.push(`/profile/${f.handle}`)}
                            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'none', border: 'none', borderBottom: '1px solid rgba(64,232,255,0.10)', cursor: 'pointer', textAlign: 'left' }}
                          >
                            <div style={{ width: 40, height: 40, flexShrink: 0, overflow: 'hidden' }}>
                              {f.image
                                // eslint-disable-next-line @next/next/no-img-element
                                ? <img src={f.image} alt={f.name ?? ''} width={40} height={40} style={{ objectFit: 'cover', imageRendering: 'pixelated', display: 'block' }} />
                                : <AvatarSVG size={40} />
                              }
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ ...STYLE, fontSize: 11, color: '#d0c8f0', letterSpacing: '0.08em' }}>{f.name ?? f.handle ?? '???'}</div>
                              <div style={{ ...STYLE, fontSize: 8, color: '#604878' }}>@{f.handle}</div>
                            </div>
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                              <div style={{ ...STYLE, fontSize: 14, color: '#ffd700' }}>{f.proximity_count}</div>
                              <div style={{ ...STYLE, fontSize: 7, color: '#504870' }}>近くにいた</div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}

                  {/* 他己紹介 tab */}
                  {activeTab === 'intro' && (
                    <div>
                      {intros.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 py-10">
                          <span style={{ fontSize: 28 }}>📝</span>
                          <p style={{ ...STYLE, fontSize: 10, color: '#504870', textAlign: 'center', lineHeight: 2 }}>まだ紹介文がありません</p>
                        </div>
                      ) : (
                        intros.map((intro, idx) => {
                          const rowBg = idx % 2 === 0 ? 'rgba(8,6,20,0.70)' : 'rgba(12,8,28,0.70)'
                          return (
                            <div key={intro.id} style={{ borderBottom: '1px solid rgba(64,232,255,0.10)', borderLeft: '3px solid #40e8ff', background: rowBg, padding: '10px 12px' }}>
                              <p style={{ ...STYLE, fontSize: 11, color: '#d0c8f0', lineHeight: 1.9, whiteSpace: 'pre-wrap', margin: 0 }}>{intro.body}</p>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                                <span style={{ ...STYLE, fontSize: 8, color: '#504870' }}>from @{intro.author_handle ?? '?'}{intro.author_name ? ` (${intro.author_name})` : ''}</span>
                                {(intro.met_year || intro.met_month) && (
                                  <span style={{ ...STYLE, fontSize: 8, color: '#504870' }}>{intro.met_year ?? ''}{intro.met_year ? '年' : ''}{intro.met_month ? `${intro.met_month}月` : ''}〜</span>
                                )}
                              </div>
                            </div>
                          )
                        })
                      )}

                      {/* 紹介文を書く */}
                      {!user.isSelf && (
                        <div className="px-4 py-4" style={{ borderTop: '1px solid rgba(64,232,255,0.10)' }}>
                          {!showIntro ? (
                            <button onClick={() => setShowIntro(true)} style={{ ...STYLE, width: '100%', fontSize: 10, color: '#40e8ff', background: 'rgba(8,6,20,0.92)', border: '1px solid rgba(64,232,255,0.40)', padding: '8px 0', cursor: 'pointer', letterSpacing: '0.08em' }}>
                              ✎ この人の紹介文を書く
                            </button>
                          ) : introSent ? (
                            <div style={{ ...STYLE, fontSize: 11, color: '#38ff78', textAlign: 'center', padding: '8px 0' }}>✓ 紹介文を送りました！</div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, background: 'rgba(8,6,20,0.90)', border: '1px solid rgba(64,232,255,0.35)', padding: 10 }}>
                              <span style={{ ...STYLE, fontSize: 9, color: '#40e8ff' }}>✎ この人の紹介文を書く</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ ...STYLE, fontSize: 9, color: '#604878', whiteSpace: 'nowrap' }}>出会った頃</span>
                                <input type="number" value={metYear} onChange={e => setMetYear(e.target.value)} placeholder="2024" min={1900} max={2099}
                                  style={{ ...STYLE, fontSize: 11, color: '#d0c8f0', width: 70, textAlign: 'center', background: 'rgba(4,2,12,0.80)', border: '1px solid rgba(64,232,255,0.30)', padding: '4px 6px', outline: 'none' }} />
                                <span style={{ ...STYLE, fontSize: 9, color: '#604878' }}>年</span>
                                <select value={metMonth} onChange={e => setMetMonth(e.target.value)}
                                  style={{ ...STYLE, fontSize: 11, color: '#d0c8f0', width: 52, background: 'rgba(4,2,12,0.80)', border: '1px solid rgba(64,232,255,0.30)', padding: '4px 4px', outline: 'none' }}>
                                  <option value="">--</option>
                                  {Array.from({ length: 12 }, (_, i) => i + 1).map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                                <span style={{ ...STYLE, fontSize: 9, color: '#604878' }}>月</span>
                              </div>
                              <textarea value={introText} onChange={e => setIntroText(e.target.value)} placeholder={`${user.name ?? user.handle} さんの紹介文を書いてあげよう`} maxLength={200} rows={3}
                                style={{ ...STYLE, fontSize: 11, color: '#d0c8f0', background: 'rgba(4,2,12,0.80)', border: '1px solid rgba(64,232,255,0.30)', padding: '5px 8px', outline: 'none', resize: 'none', lineHeight: 1.8 }} />
                              <div style={{ display: 'flex', gap: 6 }}>
                                <button onClick={sendIntro} disabled={introSending || !introText.trim()} style={{ ...STYLE, flex: 1, fontSize: 10, color: '#40e8ff', background: 'rgba(4,2,12,0.90)', border: '1px solid rgba(64,232,255,0.45)', padding: '5px 0', cursor: 'pointer', opacity: introSending ? 0.5 : 1 }}>
                                  {introSending ? '送信中...' : '送信'}
                                </button>
                                <button onClick={() => { setShowIntro(false); setIntroText(''); setMetYear(String(new Date().getFullYear())); setMetMonth('') }} style={{ ...STYLE, fontSize: 10, color: '#504870', background: 'transparent', border: '1px solid rgba(80,72,112,0.30)', padding: '5px 12px', cursor: 'pointer' }}>
                                  キャンセル
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </>
            ) : null}

            {/* ── Status bar ── */}
            <div className="pixel-statusbar">友達と紹介しあおう！</div>
          </div>

        </div>
      </main>

      {followListType && user?.handle && (
        <FollowListModal handle={user.handle} type={followListType} onClose={() => setFollowListType(null)} />
      )}
    </div>
  )
}

type QAComment = { id: string; body: string; created_at: string; author_name: string | null; author_handle: string | null }

function QARow({ idx, item, handle, isSelf }: { idx: number; item: { q: string; a: string }; handle: string; isSelf: boolean }) {
  const rowBg = idx % 2 === 0 ? 'rgba(8,6,20,0.70)' : 'rgba(12,8,28,0.70)'
  const [expanded, setExpanded] = useState(false)
  const [comments, setComments] = useState<QAComment[]>([])
  const [commentsLoaded, setCommentsLoaded] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [flagged, setFlagged] = useState(false)

  const qhash = qaHash(item.q)

  async function loadComments() {
    try {
      const r = await fetch(`/api/qa-comments?handle=${encodeURIComponent(handle)}&qhash=${qhash}`)
      const data = await r.json()
      if (Array.isArray(data)) setComments(data)
    } catch { /* silent */ }
    setCommentsLoaded(true)
  }

  function toggleExpand() {
    if (!expanded && !commentsLoaded) loadComments()
    setExpanded(e => !e)
  }

  async function submitComment() {
    if (!commentText.trim() || submitting) return
    setSubmitting(true)
    try {
      const r = await fetch('/api/qa-comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle, qhash, body: commentText }),
      })
      const data = await r.json()
      if (data.ok) {
        setSubmitted(true)
        setFlagged(data.flagged ?? false)
        setCommentText('')
      }
    } catch { /* silent */ }
    setSubmitting(false)
  }

  return (
    <div style={{ borderBottom: '1px solid rgba(64,232,255,0.10)', borderLeft: '3px solid #38ff78', background: rowBg }}>
      {/* Q&A body */}
      <div style={{ padding: '8px 12px 10px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 5 }}>
          <span style={{ fontSize: 10, color: '#40e8ff', minWidth: 22, flexShrink: 0, paddingTop: 1 }}>{String(idx + 1).padStart(2, '0')}</span>
          <p style={{ fontFamily: 'var(--font-pixel, monospace)', fontSize: 11, color: '#9888b8', margin: 0, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{item.q}</p>
        </div>
        <div style={{ paddingLeft: 30 }}>
          <p style={{ fontFamily: 'var(--font-pixel, monospace)', fontSize: 11, color: '#38ff78', lineHeight: 1.9, whiteSpace: 'pre-wrap', margin: 0 }}>
            <span style={{ color: '#38ff7888' }}>{'> '}</span>{item.a}
          </p>
        </div>
        {/* Comment toggle */}
        <button
          onClick={toggleExpand}
          style={{ ...STYLE, fontSize: 9, color: '#604878', background: 'none', border: 'none', cursor: 'pointer', marginTop: 6, paddingLeft: 30 }}
        >
          💬 コメント{comments.length > 0 ? ` (${comments.length})` : ''}
          <span style={{ marginLeft: 4, fontSize: 8 }}>{expanded ? '▲' : '▼'}</span>
        </button>
      </div>

      {/* Comment section */}
      {expanded && (
        <div style={{ borderTop: '1px solid rgba(64,232,255,0.08)', background: 'rgba(4,2,12,0.50)', padding: '8px 12px 10px' }}>
          {!commentsLoaded ? (
            <p style={{ ...STYLE, fontSize: 9, color: '#504870' }}>読み込み中...</p>
          ) : comments.length === 0 ? (
            <p style={{ ...STYLE, fontSize: 9, color: '#504870', marginBottom: 6 }}>まだコメントはありません</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
              {comments.map(c => (
                <div key={c.id} style={{ borderLeft: '2px solid rgba(64,232,255,0.25)', paddingLeft: 8 }}>
                  <p style={{ ...STYLE, fontSize: 10, color: '#d0c8f0', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>{c.body}</p>
                  <p style={{ ...STYLE, fontSize: 8, color: '#504870', marginTop: 2 }}>@{c.author_handle ?? '?'}{c.author_name ? ` (${c.author_name})` : ''}</p>
                </div>
              ))}
            </div>
          )}

          {/* Comment form (non-self only) */}
          {!isSelf && (
            submitted ? (
              <p style={{ ...STYLE, fontSize: 9, color: flagged ? '#ff4060' : '#38ff78' }}>
                {flagged ? '⚠ このコメントは送信できませんでした' : '✓ コメントを送りました（承認後に表示されます）'}
              </p>
            ) : (
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  type="text"
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); submitComment() } }}
                  placeholder="コメントを入力..."
                  maxLength={200}
                  style={{ ...STYLE, flex: 1, fontSize: 10, color: '#d0c8f0', background: 'rgba(4,2,12,0.80)', border: '1px solid rgba(64,232,255,0.30)', padding: '4px 8px', outline: 'none' }}
                />
                <button
                  onClick={submitComment}
                  disabled={submitting || !commentText.trim()}
                  style={{ ...STYLE, fontSize: 9, color: '#40e8ff', background: 'rgba(4,2,12,0.90)', border: '1px solid rgba(64,232,255,0.40)', padding: '4px 10px', cursor: submitting ? 'default' : 'pointer', opacity: submitting ? 0.5 : 1, flexShrink: 0 }}
                >
                  送信
                </button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}
