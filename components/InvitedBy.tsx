'use client'

import { useRouter } from 'next/navigation'

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

// 「◯◯ の招待で参加」。押すと招待した人のプロフィールへ
export default function InvitedBy({ name, handle }: { name: string | null | undefined; handle: string | null | undefined }) {
  const router = useRouter()
  if (!handle) return null
  return (
    <button
      onClick={() => router.push(`/profile/${handle}`)}
      style={{ ...STYLE, fontSize: 12, color: '#ffd700', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', minHeight: 28, opacity: 0.9 }}
    >
      ✉ {name ?? `@${handle}`} の招待で参加
    </button>
  )
}
