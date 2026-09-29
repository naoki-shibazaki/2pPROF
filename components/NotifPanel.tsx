'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { type Tab } from './PixelTabBar'

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

type NotifItem = {
  id: string
  type: string
  read: boolean
  created_at: string
  from_name: string | null
  from_handle: string | null
}

function typeIcon(type: string) {
  switch (type) {
    case 'post_comment':  return '💬'
    case 'followed':      return '👤'
    case 'introduction':  return '✉'
    case 'question':      return '❓'
    case 'qa_comment':    return '💬'
    default:              return '🔔'
  }
}

function typeLabel(type: string, name: string | null, handle: string | null) {
  const who = name ?? (handle ? `@${handle}` : '誰か')
  switch (type) {
    case 'post_comment':  return `${who} がコメントしました`
    case 'followed':      return `${who} にフォローされました`
    case 'introduction':  return `${who} から他己紹介が届きました`
    case 'question':      return `${who} から質問が届きました`
    case 'qa_comment':    return `${who} がQAにコメントしました`
    default:              return `${who} から通知が届きました`
  }
}

// 通知タイプ → 遷移先
// followed → /profile/[handle]
// それ以外 → タブ切り替え
function getDestination(type: string, handle: string | null): { href: string } | { tab: Tab } {
  switch (type) {
    case 'followed':     return { href: handle ? `/profile/${handle}` : '/' }
    case 'post_comment': return { tab: 'hitokoto' }
    default:             return { tab: 'others' }
  }
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60)    return `${Math.floor(diff)}秒前`
  if (diff < 3600)  return `${Math.floor(diff / 60)}分前`
  if (diff < 86400) return `${Math.floor(diff / 3600)}時間前`
  return `${Math.floor(diff / 86400)}日前`
}

interface NotifPanelProps {
  open: boolean
  onClose: () => void
  hasUnread: boolean
  onMarkAllRead: () => void
  onTabChange: (tab: Tab) => void
}

export default function NotifPanel({ open, onClose, hasUnread, onMarkAllRead, onTabChange }: NotifPanelProps) {
  const router = useRouter()
  const [items, setItems] = useState<NotifItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    fetch('/api/notifications/all')
      .then(r => r.json())
      .then(data => setItems(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [open])

  function markAllRead() {
    fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tab: 'all' }),
    }).catch(() => {})
    setItems(prev => prev.map(n => ({ ...n, read: true })))
    onMarkAllRead()
  }

  function handleItemClick(n: NotifItem) {
    // 既読化（該当1件）
    setItems(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item))

    const dest = getDestination(n.type, n.from_handle)
    onClose()

    if ('href' in dest) {
      router.push(dest.href)
    } else {
      onTabChange(dest.tab)
    }
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 200 }} />

      {/* Panel */}
      <div style={{
        position: 'absolute', top: 42, left: 0, right: 0, zIndex: 201,
        background: 'rgba(6,4,18,0.98)',
        border: '1px solid rgba(255,64,192,0.40)',
        borderTop: 'none',
        maxHeight: 320,
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '6px 10px',
          borderBottom: '1px solid rgba(255,64,192,0.25)',
        }}>
          <span style={{ ...STYLE, fontSize: 9, color: '#ff40c0', letterSpacing: '0.08em' }}>
            🔔 通知
          </span>
          {hasUnread && (
            <button
              onClick={markAllRead}
              style={{ ...STYLE, fontSize: 8, color: '#604878', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              すべて既読
            </button>
          )}
        </div>

        {/* List */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {loading && (
            <p style={{ ...STYLE, fontSize: 9, color: '#604878', padding: '12px', textAlign: 'center' }}>読み込み中...</p>
          )}
          {!loading && items.length === 0 && (
            <p style={{ ...STYLE, fontSize: 9, color: '#403860', padding: '16px', textAlign: 'center' }}>通知はありません</p>
          )}
          {items.map(n => (
            <div
              key={n.id}
              onClick={() => handleItemClick(n)}
              style={{
                display: 'flex', gap: 8, alignItems: 'flex-start',
                padding: '8px 10px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                background: n.read ? 'transparent' : 'rgba(255,64,192,0.06)',
                cursor: 'pointer',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,64,192,0.12)')}
              onMouseLeave={e => (e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(255,64,192,0.06)')}
            >
              <span style={{ fontSize: 13, lineHeight: 1, marginTop: 1 }}>{typeIcon(n.type)}</span>
              <div style={{ flex: 1 }}>
                <p style={{ ...STYLE, fontSize: 9, color: n.read ? '#504870' : '#c8a8e8', lineHeight: 1.6 }}>
                  {typeLabel(n.type, n.from_name, n.from_handle)}
                </p>
                <p style={{ ...STYLE, fontSize: 8, color: '#403060', marginTop: 2 }}>
                  {timeAgo(n.created_at)}
                  {' · '}
                  <span style={{ color: '#604898' }}>
                    {n.type === 'followed' ? `@${n.from_handle} のプロフへ →` :
                     n.type === 'post_comment' ? 'ひとことへ →' : '他己紹介へ →'}
                  </span>
                </p>
              </div>
              {!n.read && (
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff40c0', marginTop: 4, flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
