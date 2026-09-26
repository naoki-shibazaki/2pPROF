'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AvatarSVG from './AvatarSVG'

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

type UserRow = {
  id: string
  name: string | null
  handle: string | null
  image: string | null
  isFollowing?: boolean
  isSelf?: boolean
}

export default function FollowListModal({
  handle,
  type,
  onClose,
}: {
  handle: string
  type: 'following' | 'followers'
  onClose: () => void
}) {
  const router = useRouter()
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [followStates, setFollowStates] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetch(`/api/follows/list?handle=${handle}&type=${type}`)
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : []
        setUsers(list)
        const states: Record<string, boolean> = {}
        for (const u of list) states[u.id] = !!u.isFollowing
        setFollowStates(states)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [handle, type])

  async function toggleFollow(u: UserRow) {
    if (u.isSelf) return
    const cur = followStates[u.id]
    setFollowStates(prev => ({ ...prev, [u.id]: !cur }))
    if (cur) {
      await fetch(`/api/follows/${u.id}`, { method: 'DELETE' })
    } else {
      await fetch('/api/follows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle: u.handle }),
      })
    }
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(4,2,12,0.88)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 400,
          background: 'rgba(8,6,20,0.99)',
          border: '2px solid #ff40c0',
          borderBottom: 'none',
          boxShadow: '0 0 24px rgba(255,64,192,0.35)',
          maxHeight: '75dvh',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px',
          borderBottom: '1px solid rgba(255,64,192,0.30)',
        }}>
          <span style={{ ...STYLE, fontSize: 11, color: '#ff40c0', letterSpacing: '0.10em', textShadow: '0 0 6px rgba(255,64,192,0.60)' }}>
            ■ {type === 'following' ? 'フォロー中' : 'フォロワー'}
          </span>
          <button
            onClick={onClose}
            style={{ ...STYLE, fontSize: 10, color: '#504870', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {/* List */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
              <span style={{ ...STYLE, fontSize: 10, color: '#40e8ff' }}>読み込み中...</span>
            </div>
          ) : users.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: 32 }}>
              <span style={{ fontSize: 28 }}>👥</span>
              <p style={{ ...STYLE, fontSize: 10, color: '#504870' }}>まだいません</p>
            </div>
          ) : (
            users.map(u => (
              <div
                key={u.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px',
                  borderBottom: '1px solid rgba(64,232,255,0.08)',
                  cursor: u.handle ? 'pointer' : 'default',
                }}
                onClick={() => { if (u.handle) { onClose(); router.push(`/profile/${u.handle}`) } }}
              >
                {/* Avatar */}
                <div style={{ width: 38, height: 38, overflow: 'hidden', flexShrink: 0 }}>
                  {u.image
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={u.image} alt={u.name ?? ''} width={38} height={38} style={{ objectFit: 'cover', imageRendering: 'pixelated', display: 'block' }} />
                    : <AvatarSVG size={38} />}
                </div>

                {/* Name */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ ...STYLE, fontSize: 11, color: '#d0c8f0', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {u.name ?? u.handle ?? '???'}
                  </p>
                  <p style={{ ...STYLE, fontSize: 9, color: '#504870', margin: 0 }}>@{u.handle ?? '-'}</p>
                </div>

                {/* Follow button */}
                {!u.isSelf && (
                  <button
                    onClick={e => { e.stopPropagation(); toggleFollow(u) }}
                    style={{
                      ...STYLE, fontSize: 9,
                      color: followStates[u.id] ? '#38ff78' : '#ff40c0',
                      background: 'rgba(4,2,12,0.80)',
                      border: `1px solid ${followStates[u.id] ? 'rgba(56,255,120,0.45)' : 'rgba(255,64,192,0.45)'}`,
                      padding: '3px 10px', cursor: 'pointer', flexShrink: 0,
                    }}
                  >
                    {followStates[u.id] ? 'フォロー中' : 'フォロー'}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
