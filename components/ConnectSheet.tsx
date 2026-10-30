'use client'

import { useEffect, useState } from 'react'
import AvatarSVG from './AvatarSVG'

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const
const MAX = 100

type Friend = { id: string; name: string | null; handle: string | null; image: string | null }
type Common = { answers: { q: string; word: string }[]; mutual: Friend[] }

// 「この 2 人、合いそう」と、自分の友達どうしを紹介する画面
// 1. 紹介する相手を選ぶ  2. 2 人の共通点を見ながら一言を書く  3. 送ると 2 人に通知が届く
export default function ConnectSheet({ target, onClose }: { target: { handle: string; name: string | null }; onClose: () => void }) {
  const [friends, setFriends] = useState<Friend[] | null>(null)
  const [query, setQuery] = useState('')
  const [picked, setPicked] = useState<Friend | null>(null)
  const [common, setCommon] = useState<Common | null>(null)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const targetName = target.name ?? `@${target.handle}`

  useEffect(() => {
    fetch('/api/friends')
      .then(r => r.json())
      .then((list: Friend[]) => setFriends((Array.isArray(list) ? list : []).filter(f => f.handle && f.handle !== target.handle)))
      .catch(() => setFriends([]))
  }, [target.handle])

  useEffect(() => {
    if (!picked?.handle) return
    setCommon(null)
    fetch(`/api/common?handle=${encodeURIComponent(target.handle)}&with=${encodeURIComponent(picked.handle)}`)
      .then(r => (r.ok ? r.json() : null))
      .then(d => setCommon(d))
      .catch(() => {})
  }, [picked, target.handle])

  const pickedName = picked ? picked.name ?? `@${picked.handle}` : ''
  // 一言の候補（2 人の共通点から）
  // 「出身地はどこ？」→「出身地が2人とも「千葉」」。「犬派？猫派？」のような質問は「2人とも「犬」」
  const suggestions = (common?.answers ?? []).slice(0, 4).map(a => {
    const topic = a.q.replace(/(はどこ|は)?[？?]$/, '')
    return /[？?]/.test(topic) ? `2人とも「${a.word}」` : `${topic}が2人とも「${a.word}」`
  })

  async function send() {
    if (!picked?.handle || !message.trim()) return
    setSending(true)
    setError('')
    const res = await fetch('/api/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ a: target.handle, b: picked.handle, message }),
    }).catch(() => null)
    const d = await res?.json().catch(() => null)
    setSending(false)
    if (!res?.ok) { setError(d?.error || '送れませんでした。もう一度お試しください'); return }
    setSent(true)
  }

  const shown = (friends ?? []).filter(f => !query || `${f.name ?? ''} ${f.handle ?? ''}`.toLowerCase().includes(query.toLowerCase()))

  return (
    <div role="dialog" aria-modal="true" aria-label="友達に紹介する" style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: 'rgba(8,6,20,0.99)', borderTop: '2px solid #ffd700', boxShadow: '0 -4px 24px rgba(255,215,0,0.25)', maxHeight: '88%', display: 'flex', flexDirection: 'column', paddingBottom: 'env(safe-area-inset-bottom, 0px)', width: '100%', maxWidth: 560, margin: '0 auto' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid rgba(255,215,0,0.25)' }}>
          <span style={{ ...STYLE, fontSize: 15, color: '#ffd700' }}>🤝 {targetName} を友達に紹介</span>
          <button onClick={onClose} aria-label="閉じる" style={{ ...STYLE, fontSize: 18, color: '#8a80b0', background: 'none', border: 'none', cursor: 'pointer', minWidth: 40, minHeight: 40 }}>✕</button>
        </div>

        <div className="overflow-y-auto" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '24px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p style={{ ...STYLE, fontSize: 18, color: '#38ff78' }}>✓ 紹介しました</p>
              <p style={{ ...STYLE, fontSize: 13, color: '#b0a8d0', lineHeight: 2 }}>{targetName} と {pickedName} に通知が届きました</p>
              <button onClick={onClose} className="pixel-action-btn justify-center py-2" style={{ fontSize: 15 }}>とじる</button>
            </div>
          ) : !picked ? (
            <>
              <p style={{ ...STYLE, fontSize: 13, color: '#b0a8d0', lineHeight: 1.9 }}>{targetName} と気が合いそうな友達を選んでください</p>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="名前で探す"
                aria-label="友達を名前で探す"
                className="bg-transparent outline-none"
                style={{ ...STYLE, fontSize: 14, color: '#c0f0ff', border: '1px solid rgba(64,232,255,0.35)', padding: '8px 10px', minHeight: 44 }}
              />
              {friends === null ? (
                <p style={{ ...STYLE, fontSize: 13, color: '#40e8ff' }}>読み込み中...</p>
              ) : shown.length === 0 ? (
                <p style={{ ...STYLE, fontSize: 13, color: '#8a80b0', lineHeight: 1.9 }}>紹介できる友達がいません。フォローしている友達どうしを紹介できます</p>
              ) : (
                <ul>
                  {shown.map(f => (
                    <li key={f.id}>
                      <button
                        onClick={() => setPicked(f)}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '8px 4px', background: 'none', border: 'none', borderBottom: '1px solid rgba(64,232,255,0.08)', cursor: 'pointer', textAlign: 'left', minHeight: 52 }}
                      >
                        <span style={{ width: 36, height: 36, overflow: 'hidden', flexShrink: 0 }}>
                          {f.image
                            // eslint-disable-next-line @next/next/no-img-element
                            ? <img src={f.image} alt="" width={36} height={36} style={{ objectFit: 'cover', imageRendering: 'pixelated', display: 'block' }} />
                            : <AvatarSVG size={36} />}
                        </span>
                        <span style={{ ...STYLE, fontSize: 14, color: '#d0c8f0' }}>
                          {f.name ?? f.handle}
                          <span style={{ display: 'block', fontSize: 12, color: '#8a80b0' }}>@{f.handle}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <>
              <button onClick={() => { setPicked(null); setMessage(''); setError('') }} style={{ ...STYLE, alignSelf: 'flex-start', fontSize: 13, color: '#ff40c0', background: 'none', border: 'none', cursor: 'pointer', minHeight: 36 }}>
                ‹ 選びなおす
              </button>
              <p style={{ ...STYLE, fontSize: 15, color: '#d0c8f0' }}>{targetName} × {pickedName}</p>

              {common && (common.answers.length > 0 || common.mutual.length > 0) && (
                <div style={{ border: '1px solid rgba(56,255,120,0.3)', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ ...STYLE, fontSize: 12, color: '#38ff78' }}>2人の共通点（タップで一言に入れる）</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {suggestions.map(s => (
                      <button
                        key={s}
                        onClick={() => setMessage(m => (m ? `${m} ${s}` : s).slice(0, MAX))}
                        style={{ ...STYLE, fontSize: 12, color: '#c0f0ff', background: 'rgba(56,255,120,0.08)', border: '1px solid rgba(56,255,120,0.35)', padding: '6px 8px', cursor: 'pointer', minHeight: 36 }}
                      >
                        {s}
                      </button>
                    ))}
                    {common.mutual.length > 0 && (
                      <span style={{ ...STYLE, fontSize: 12, color: '#8a80b0', alignSelf: 'center' }}>共通の友達 {common.mutual.length}人</span>
                    )}
                  </div>
                </div>
              )}

              <label htmlFor="connect-message" style={{ ...STYLE, fontSize: 13, color: '#40e8ff' }}>2人に送る一言</label>
              <textarea
                id="connect-message"
                value={message}
                onChange={e => setMessage(e.target.value.slice(0, MAX))}
                rows={3}
                placeholder="例: 2人ともキャンプ好きだから、絶対話が合うと思う！"
                className="bg-transparent outline-none resize-none"
                style={{ ...STYLE, fontSize: 14, color: '#c0f0ff', border: '1px solid rgba(64,232,255,0.35)', padding: '8px 10px', lineHeight: 1.8 }}
              />
              <span style={{ ...STYLE, fontSize: 12, color: '#7a70a0', textAlign: 'right' }}>{message.length}/{MAX}</span>
              {error && <p role="alert" style={{ ...STYLE, fontSize: 13, color: '#ff8090' }}>⚠ {error}</p>}
              <button onClick={send} disabled={sending || !message.trim()} className="pixel-action-btn justify-center py-3" style={{ fontSize: 16 }}>
                {sending ? '送信中...' : '2人に紹介する ▶'}
              </button>
              <p style={{ ...STYLE, fontSize: 12, color: '#7a70a0', lineHeight: 1.8 }}>2人に通知が届きます。一言は、2人がお互いのプロフィールを開いたときに見られます</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
