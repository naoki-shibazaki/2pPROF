'use client'

import { useState, useEffect, useCallback } from 'react'

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const
const VISITOR_KEY = '2pprof_visitor_id'

const REACTIONS = [
  { key: '共感',    emoji: '😄' },
  { key: 'びっくり', emoji: '😲' },
  { key: '笑える',  emoji: '😂' },
  { key: 'いいね',  emoji: '👍' },
  { key: 'わかる',  emoji: '💯' },
]

function getVisitorId(): string {
  const existing = localStorage.getItem(VISITOR_KEY)
  if (existing) return existing
  const id = crypto.randomUUID()
  localStorage.setItem(VISITOR_KEY, id)
  return id
}

interface Props {
  friendIndex: number
}

export default function ReactionBar({ friendIndex }: Props) {
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [mine, setMine]     = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [visitorId, setVisitorId] = useState('')

  useEffect(() => {
    setVisitorId(getVisitorId())
  }, [])

  const fetchReactions = useCallback(async (vid: string) => {
    try {
      const res = await fetch(`/api/reactions?friendIndex=${friendIndex}&visitorId=${encodeURIComponent(vid)}`)
      const data = await res.json()
      setCounts(data.counts ?? {})
      setMine(data.mine ?? [])
    } catch { /* ignore */ } finally {
      setLoading(false)
    }
  }, [friendIndex])

  useEffect(() => {
    if (visitorId) fetchReactions(visitorId)
  }, [visitorId, fetchReactions])

  async function toggle(reaction: string) {
    if (!visitorId) return

    // optimistic update
    const isActive = mine.includes(reaction)
    setMine(prev => isActive ? prev.filter(r => r !== reaction) : [...prev, reaction])
    setCounts(prev => ({
      ...prev,
      [reaction]: Math.max(0, (prev[reaction] ?? 0) + (isActive ? -1 : 1)),
    }))

    try {
      await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendIndex, reaction, visitorId }),
      })
    } catch {
      // revert on error
      fetchReactions(visitorId)
    }
  }

  if (loading) return null

  return (
    <div
      className="flex flex-wrap gap-1.5 px-3 py-2"
      style={{ borderTop: '1px solid rgba(64,232,255,0.12)' }}
    >
      {REACTIONS.map(({ key, emoji }) => {
        const active = mine.includes(key)
        const count  = counts[key] ?? 0
        return (
          <button
            key={key}
            onClick={() => toggle(key)}
            style={{
              ...STYLE,
              fontSize: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              padding: '2px 8px',
              cursor: 'pointer',
              color:       active ? '#40e8ff' : '#403060',
              background:  active ? 'rgba(64,232,255,0.10)' : 'rgba(4,2,12,0.70)',
              border:      active
                ? '1px solid rgba(64,232,255,0.55)'
                : '1px solid rgba(64,232,255,0.15)',
              boxShadow:   active ? '0 0 6px rgba(64,232,255,0.25)' : 'none',
              textShadow:  active ? '0 0 5px rgba(64,232,255,0.55)' : 'none',
              letterSpacing: '0.02em',
            }}
          >
            <span style={{ fontSize: 12 }}>{emoji}</span>
            {key}
            {count > 0 && (
              <span style={{
                color: active ? '#ffd700' : '#504870',
                textShadow: active ? '0 0 4px rgba(255,215,0,0.50)' : 'none',
              }}>
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
