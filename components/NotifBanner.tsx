'use client'

import { useEffect, useState } from 'react'

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

type NotifRow = {
  type: string
  from_name: string | null
  from_handle: string | null
  created_at: string
}

function label(type: string, name: string | null, handle: string | null) {
  const who = name ?? (handle ? `@${handle}` : '誰か')
  switch (type) {
    case 'post_comment':  return `${who} がコメントしました`
    case 'followed':      return `${who} にフォローされました`
    case 'introduction':  return `${who} から他己紹介が届きました`
    case 'question':      return `${who} から質問が届きました`
    case 'qa_comment':    return `${who} がコメントしました`
    default:              return `${who} から通知が届きました`
  }
}

export default function NotifBanner({ tab, show }: { tab: string; show: boolean }) {
  const [items, setItems] = useState<NotifRow[]>([])

  useEffect(() => {
    if (!show) { setItems([]); return }
    fetch(`/api/notifications/recent?tab=${tab}`)
      .then(r => r.json())
      .then(data => setItems(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [tab, show])

  if (!show || items.length === 0) return null

  return (
    <div style={{
      margin: '8px 12px 0',
      border: '1px solid rgba(255,208,64,0.45)',
      background: 'rgba(20,14,4,0.90)',
      padding: '6px 8px',
    }}>
      <p style={{ ...STYLE, fontSize: 8, color: '#ffd040', marginBottom: 4, letterSpacing: '0.06em' }}>
        ▶ 新着通知
      </p>
      {items.map((n, i) => (
        <p key={i} style={{ ...STYLE, fontSize: 9, color: '#c8b880', lineHeight: '1.7', letterSpacing: '0.03em' }}>
          · {label(n.type, n.from_name, n.from_handle)}
        </p>
      ))}
    </div>
  )
}
