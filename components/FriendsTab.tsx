'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import AvatarSVG from './AvatarSVG'
import { getProximityTitle, PROXIMITY_TITLES } from '@/lib/proximity'

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

type Friend = {
  id: string
  name: string | null
  handle: string | null
  image: string | null
  proximity_count: number
  isMock?: boolean
}

const MOCK_FRIENDS: Friend[] = [
  { id: 'mock-1', name: 'ひろ',   handle: 'hiro_pixel',  image: null, proximity_count: 47, isMock: true },
  { id: 'mock-2', name: 'さくら', handle: 'sakura_2p',   image: null, proximity_count: 12, isMock: true },
  { id: 'mock-3', name: 'りょう', handle: 'ryo_cyber',   image: null, proximity_count: 3,  isMock: true },
  { id: 'mock-4', name: 'ゆい',   handle: 'yui_retro',   image: null, proximity_count: 0,  isMock: true },
]

export default function FriendsTab({ onCountChange }: { onCountChange?: (n: number) => void }) {
  const router = useRouter()
  const [friends, setFriends] = useState<Friend[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [handleInput, setHandleInput] = useState('')
  const [addError, setAddError] = useState<string | null>(null)
  const [addLoading, setAddLoading] = useState(false)

  // Count visibility
  const [hideAll, setHideAll] = useState(false)
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set())

  // Question sending
  const [questionOpenId, setQuestionOpenId] = useState<string | null>(null)
  const [questionText, setQuestionText] = useState('')
  const [qSending, setQSending] = useState(false)
  const [qSentId, setQSentId] = useState<string | null>(null)

  function toggleCount(id: string) {
    setHiddenIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const load = useCallback(() => {
    setLoading(true)
    const ac = new AbortController()
    const timer = setTimeout(() => ac.abort(), 8000)
    fetch('/api/friends', { signal: ac.signal })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(data => {
        clearTimeout(timer)
        const real = Array.isArray(data) ? data : []
        const displayed = real.length > 0 ? real : MOCK_FRIENDS
        setFriends(displayed)
        onCountChange?.(displayed.length)
        setLoading(false)
      })
      .catch(() => { clearTimeout(timer); setFriends(MOCK_FRIENDS); setLoading(false) })
  }, [onCountChange])

  useEffect(() => { load() }, [load])

  async function handleAdd() {
    const h = handleInput.trim()
    if (!h) return
    setAddLoading(true)
    setAddError(null)
    const res = await fetch('/api/follows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ handle: h }),
    })
    const data = await res.json()
    if (!res.ok) {
      setAddError(data.error ?? 'エラー')
    } else {
      setHandleInput('')
      setAdding(false)
      load()
    }
    setAddLoading(false)
  }

  async function handleUnfollow(e: React.MouseEvent, friendId: string, isMock?: boolean) {
    e.stopPropagation()
    if (isMock) return
    await fetch(`/api/follows/${friendId}`, { method: 'DELETE' })
    setFriends(prev => prev.filter(f => f.id !== friendId))
  }

  function goToProfile(handle: string | null, isMock?: boolean) {
    if (!handle || isMock) return
    router.push(`/profile/${handle}`)
  }

  async function sendQuestion(handle: string | null) {
    if (!handle || !questionText.trim()) return
    setQSending(true)
    const res = await fetch('/api/qa/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ handle, question: questionText }),
    })
    if (res.ok) {
      setQSentId(questionOpenId)
      setQuestionText('')
      setTimeout(() => { setQSentId(null); setQuestionOpenId(null) }, 2000)
    }
    setQSending(false)
  }

  return (
    <div className="overflow-y-auto" style={{ background: 'transparent', maxHeight: 'calc(100dvh - 180px)' }}>
      {/* Header */}
      <div className="px-3 py-2 flex items-center justify-between" style={{
        background: 'rgba(4,10,22,0.85)',
        borderBottom: '1px solid rgba(255,64,192,0.30)',
      }}>
        <span style={{ ...STYLE, fontSize: 12, color: '#ff40c0', letterSpacing: '0.06em', textShadow: '0 0 7px rgba(255,64,192,0.60)' }}>
          ♡ ともだちリスト
        </span>
        <button
          onClick={() => { setAdding(v => !v); setAddError(null) }}
          style={{
            ...STYLE, fontSize: 10, color: '#ffd700',
            background: 'rgba(8,6,20,0.92)',
            border: '1px solid rgba(255,215,0,0.50)',
            padding: '3px 10px', cursor: 'pointer',
          }}
        >
          {adding ? '✕ キャンセル' : '＋ 追加'}
        </button>
      </div>

      {/* Global hide toggle */}
      {!loading && friends.length > 0 && (
        <div className="px-3 py-2 flex items-center justify-end" style={{
          background: 'rgba(4,2,12,0.60)',
          borderBottom: '1px solid rgba(64,232,255,0.10)',
        }}>
          <button
            onClick={() => { setHideAll(v => !v); setHiddenIds(new Set()) }}
            style={{
              ...STYLE, fontSize: 9,
              color: hideAll ? '#38ff78' : '#504870',
              background: 'transparent', border: 'none', cursor: 'pointer',
              letterSpacing: '0.06em',
            }}
          >
            {hideAll ? '👁 回数をすべて表示' : '🙈 回数をすべて非表示'}
          </button>
        </div>
      )}

      {/* Add friend input */}
      {adding && (
        <div className="px-3 py-3 flex flex-col gap-2" style={{ borderBottom: '1px solid rgba(255,215,0,0.20)', background: 'rgba(8,6,20,0.80)' }}>
          <span style={{ ...STYLE, fontSize: 10, color: '#ffd700', letterSpacing: '0.06em' }}>ハンドルで検索</span>
          <div className="flex gap-2">
            <input
              type="text"
              value={handleInput}
              onChange={e => setHandleInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="@handle"
              style={{
                ...STYLE, flex: 1, fontSize: 12, color: '#d0c8f0',
                background: 'rgba(4,2,12,0.90)',
                border: '1px solid rgba(208,200,240,0.40)',
                padding: '5px 8px', outline: 'none',
              }}
            />
            <button
              onClick={handleAdd}
              disabled={addLoading}
              style={{
                ...STYLE, fontSize: 10, color: '#38ff78',
                background: 'rgba(4,2,12,0.90)',
                border: '1px solid rgba(56,255,120,0.50)',
                padding: '5px 12px', cursor: 'pointer',
                opacity: addLoading ? 0.5 : 1,
              }}
            >
              {addLoading ? '...' : 'フォロー'}
            </button>
          </div>
          {addError && (
            <p style={{ ...STYLE, fontSize: 9, color: '#ff4060' }}>⚠ {addError}</p>
          )}
        </div>
      )}

      {/* Friends list */}
      {loading ? (
        <div className="flex justify-center py-8">
          <span style={{ ...STYLE, fontSize: 10, color: '#40e8ff' }}>読み込み中...</span>
        </div>
      ) : friends.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-10">
          <span style={{ fontSize: 32 }}>👥</span>
          <p style={{ ...STYLE, fontSize: 10, color: '#504870', textAlign: 'center', lineHeight: 2 }}>
            まだフォローしていません<br />「＋ 追加」でともだちを登録しよう
          </p>
        </div>
      ) : (
        <div className="flex flex-col">
          {friends.map((f) => {
            const isCountHidden = hideAll || hiddenIds.has(f.id)
            const pt = getProximityTitle(f.proximity_count)
            const next = PROXIMITY_TITLES.slice().reverse().find(t => t.min > f.proximity_count)
            return (
              <div
                key={f.id}
                style={{ borderBottom: '1px solid rgba(64,232,255,0.10)', background: 'rgba(4,2,12,0.40)' }}
              >
                {/* Main row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px 6px' }}>
                  {/* Avatar — tap → profile */}
                  <button
                    onClick={() => goToProfile(f.handle, f.isMock)}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: f.isMock ? 'default' : 'pointer', flexShrink: 0 }}
                  >
                    <div style={{ width: 44, height: 44, overflow: 'hidden' }}>
                      {f.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={f.image} alt={f.name ?? ''} width={44} height={44}
                          style={{ objectFit: 'cover', imageRendering: 'pixelated', display: 'block' }} />
                      ) : <AvatarSVG size={44} />}
                    </div>
                  </button>

                  {/* Name + handle */}
                  <div className="flex flex-col flex-1 min-w-0">
                    <span style={{ ...STYLE, fontSize: 12, color: '#d0c8f0', letterSpacing: '0.06em' }} className="truncate">
                      {f.name ?? f.handle ?? '???'}
                    </span>
                    <span style={{ ...STYLE, fontSize: 9, color: '#504870' }}>@{f.handle ?? '-'}</span>
                  </div>

                  {/* Proximity count — tap to toggle */}
                  <button
                    onClick={() => toggleCount(f.id)}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', background: 'none', border: 'none', cursor: 'pointer', padding: 4, flexShrink: 0 }}
                  >
                    {isCountHidden
                      ? <span style={{ ...STYLE, fontSize: 18, color: '#403860', lineHeight: 1 }}>—</span>
                      : <span style={{ ...STYLE, fontSize: 18, color: '#ffd700', textShadow: '0 0 8px rgba(255,215,0,0.55)', lineHeight: 1 }}>{f.proximity_count}</span>
                    }
                    <span style={{ ...STYLE, fontSize: 8, color: '#504870' }}>回</span>
                  </button>
                </div>

                {/* 称号 + action buttons */}
                <div className="px-3 pb-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span style={{ ...STYLE, fontSize: 10, color: pt.color, textShadow: `0 0 6px ${pt.color}88`, letterSpacing: '0.08em', flexShrink: 0 }}>
                      ⚔️ {isCountHidden ? '???' : pt.title}
                    </span>
                    {!isCountHidden && next && (
                      <span style={{ ...STYLE, fontSize: 8, color: '#504870' }} className="truncate">
                        次: {next.min - f.proximity_count}回で「{next.title}」
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!f.isMock && (
                      <>
                        <button
                          onClick={() => { setQuestionOpenId(questionOpenId === f.id ? null : f.id); setQuestionText('') }}
                          style={{ ...STYLE, fontSize: 9, color: '#ff40c0', background: 'rgba(4,2,12,0.80)', border: '1px solid rgba(255,64,192,0.40)', padding: '2px 8px', cursor: 'pointer' }}
                        >
                          💬
                        </button>
                        <button
                          onClick={() => goToProfile(f.handle)}
                          style={{ ...STYLE, fontSize: 9, color: '#40e8ff', background: 'rgba(4,2,12,0.80)', border: '1px solid rgba(64,232,255,0.35)', padding: '2px 8px', cursor: 'pointer' }}
                        >
                          プロフィール
                        </button>
                        <button
                          onClick={(e) => handleUnfollow(e, f.id)}
                          style={{ ...STYLE, fontSize: 8, color: '#403860', background: 'transparent', border: 'none', cursor: 'pointer' }}
                        >
                          解除
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Inline question input */}
                {!f.isMock && questionOpenId === f.id && (
                  <div style={{ margin: '0 12px 10px', background: 'rgba(8,6,20,0.90)', border: '1px solid rgba(255,64,192,0.35)', padding: 8 }}>
                    {qSentId === f.id ? (
                      <p style={{ ...STYLE, fontSize: 10, color: '#38ff78', textAlign: 'center', padding: '4px 0' }}>✓ 質問を送りました！</p>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={questionText}
                          autoFocus
                          onChange={e => setQuestionText(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && sendQuestion(f.handle)}
                          placeholder="質問を入力..."
                          maxLength={100}
                          style={{ ...STYLE, flex: 1, fontSize: 11, color: '#d0c8f0', background: 'rgba(4,2,12,0.80)', border: '1px solid rgba(255,64,192,0.30)', padding: '4px 8px', outline: 'none' }}
                        />
                        <button
                          onClick={() => sendQuestion(f.handle)}
                          disabled={qSending || !questionText.trim()}
                          style={{ ...STYLE, fontSize: 9, color: '#ff40c0', background: 'rgba(4,2,12,0.90)', border: '1px solid rgba(255,64,192,0.50)', padding: '4px 10px', cursor: 'pointer', opacity: qSending ? 0.5 : 1, flexShrink: 0 }}
                        >
                          送信
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
