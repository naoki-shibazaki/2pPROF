'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AppScreen, { BackButton } from '@/components/AppScreen'
import AvatarSVG from '@/components/AvatarSVG'
import { hasInAppHistory } from '@/components/NavTracker'

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

type Tab = 'following' | 'followers'
type UserRow = {
  id: string
  name: string | null
  handle: string | null
  image: string | null
  isFollowing?: boolean
  isSelf?: boolean
}

// フォロー中 / フォロワーの一覧（画面の上から見られるよう、シートではなく 1 画面で出す）
export default function FollowsPage() {
  const { handle } = useParams<{ handle: string }>()
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('following')
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('tab') === 'followers') setTab('followers')
  }, [])
  const [lists, setLists] = useState<Record<Tab, UserRow[] | null>>({ following: null, followers: null })
  const [followStates, setFollowStates] = useState<Record<string, boolean>>({})

  useEffect(() => {
    for (const t of ['following', 'followers'] as Tab[]) {
      fetch(`/api/follows/list?handle=${encodeURIComponent(handle)}&type=${t}`)
        .then(r => r.json())
        .then(data => {
          const list: UserRow[] = Array.isArray(data) ? data : []
          setLists(prev => ({ ...prev, [t]: list }))
          setFollowStates(prev => {
            const next = { ...prev }
            for (const u of list) if (!(u.id in next)) next[u.id] = !!u.isFollowing
            return next
          })
        })
        .catch(() => setLists(prev => ({ ...prev, [t]: [] })))
    }
  }, [handle])

  function switchTab(t: Tab) {
    setTab(t)
    router.replace(`/profile/${handle}/follows?tab=${t}`, { scroll: false })
  }

  function goBack() {
    // リンクから直接開いたときは戻る先がないので、その人のプロフィールへ
    if (hasInAppHistory()) router.back()
    else router.push(`/profile/${handle}`)
  }

  async function toggleFollow(u: UserRow) {
    if (u.isSelf || !u.handle) return
    const cur = followStates[u.id]
    setFollowStates(prev => ({ ...prev, [u.id]: !cur }))
    const res = cur
      ? await fetch(`/api/follows/${u.id}`, { method: 'DELETE' }).catch(() => null)
      : await fetch('/api/follows', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ handle: u.handle }),
        }).catch(() => null)
    if (!res?.ok) setFollowStates(prev => ({ ...prev, [u.id]: cur }))
  }

  const users = lists[tab]

  return (
    <AppScreen left={<BackButton onClick={goBack} />} title={`@${handle}`} scroll={false} nav>
            {/* Tabs */}
            <div role="tablist" style={{ display: 'flex', background: 'rgba(4,10,22,0.85)', borderBottom: '1px solid rgba(64,232,255,0.38)', flexShrink: 0 }}>
              {(['following', 'followers'] as Tab[]).map(t => {
                const active = tab === t
                const count = lists[t]?.length
                return (
                  <button
                    key={t}
                    role="tab"
                    aria-selected={active}
                    onClick={() => switchTab(t)}
                    style={{
                      ...STYLE, flex: 1, fontSize: 14, minHeight: 48, cursor: 'pointer', letterSpacing: '0.06em',
                      color: active ? '#40e8ff' : '#7a70a0',
                      background: active ? 'rgba(64,232,255,0.08)' : 'transparent',
                      border: 'none', borderBottom: active ? '2px solid #40e8ff' : '2px solid transparent',
                      textShadow: active ? '0 0 6px rgba(64,232,255,0.60)' : 'none',
                    }}
                  >
                    {t === 'following' ? 'フォロー中' : 'フォロワー'}
                    {count !== undefined && <span style={{ marginLeft: 6, color: active ? '#d0c8f0' : '#7a70a0' }}>{count}</span>}
                  </button>
                )
              })}
            </div>

            {/* List */}
            <div className="overflow-y-auto pixel-screen-scroll">
              {users === null ? (
                <p style={{ ...STYLE, fontSize: 13, color: '#40e8ff', textAlign: 'center', padding: 32 }}>読み込み中...</p>
              ) : users.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '48px 16px' }}>
                  <span style={{ fontSize: 28 }}>👥</span>
                  <p style={{ ...STYLE, fontSize: 13, color: '#8a80b0' }}>
                    {tab === 'following' ? 'まだ誰もフォローしていません' : 'まだフォロワーはいません'}
                  </p>
                </div>
              ) : (
                <ul>
                  {users.map(u => (
                    <li
                      key={u.id}
                      onClick={() => { if (u.handle) router.push(`/profile/${u.handle}`) }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                        borderBottom: '1px solid rgba(64,232,255,0.08)', cursor: u.handle ? 'pointer' : 'default',
                      }}
                    >
                      <div style={{ width: 44, height: 44, overflow: 'hidden', flexShrink: 0 }}>
                        {u.image
                          // eslint-disable-next-line @next/next/no-img-element
                          ? <img src={u.image} alt="" width={44} height={44} style={{ objectFit: 'cover', imageRendering: 'pixelated', display: 'block' }} />
                          : <AvatarSVG size={44} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ ...STYLE, fontSize: 15, color: '#d0c8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {u.name ?? u.handle ?? '???'}
                        </p>
                        <p style={{ ...STYLE, fontSize: 12, color: '#8a80b0', marginTop: 2 }}>@{u.handle ?? '-'}</p>
                      </div>
                      {!u.isSelf && (
                        <button
                          onClick={e => { e.stopPropagation(); void toggleFollow(u) }}
                          aria-label={`@${u.handle} を${followStates[u.id] ? 'フォロー解除' : 'フォロー'}`}
                          style={{
                            ...STYLE, fontSize: 12, flexShrink: 0, minHeight: 36, padding: '0 12px', cursor: 'pointer',
                            color: followStates[u.id] ? '#38ff78' : '#ff40c0',
                            background: 'rgba(4,2,12,0.80)',
                            border: `1px solid ${followStates[u.id] ? 'rgba(56,255,120,0.45)' : 'rgba(255,64,192,0.45)'}`,
                          }}
                        >
                          {followStates[u.id] ? 'フォロー中' : 'フォロー'}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
    </AppScreen>
  )
}
