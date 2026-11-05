'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AvatarSVG from './AvatarSVG'

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

type Suggestion = { id: string; name: string | null; handle: string | null; image: string | null }

// 友達タブの上の「友達じゃないですか？」。横にスクロールするカードで、フォローか ✕ を選べる
export default function FriendSuggestions({ onFollowed }: { onFollowed?: () => void }) {
  const router = useRouter()
  const [list, setList] = useState<Suggestion[]>([])
  const [busy, setBusy] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/suggestions').then(r => (r.ok ? r.json() : [])).then(d => setList(Array.isArray(d) ? d : [])).catch(() => {})
  }, [])

  async function follow(s: Suggestion) {
    if (!s.handle) return
    setBusy(s.id)
    const res = await fetch('/api/follows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ handle: s.handle }),
    }).catch(() => null)
    setBusy(null)
    if (!res?.ok) return
    setList(l => l.filter(x => x.id !== s.id))
    onFollowed?.()
  }

  function dismiss(s: Suggestion) {
    setList(l => l.filter(x => x.id !== s.id))
    fetch('/api/suggestions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: s.id }) }).catch(() => {})
  }

  if (!list.length) return null

  return (
    <section aria-label="友達じゃないですか？" style={{ borderBottom: '1px solid rgba(64,232,255,0.15)', background: 'rgba(4,2,12,0.50)', padding: '10px 0 12px' }}>
      <h3 style={{ ...STYLE, fontSize: 13, color: '#40e8ff', padding: '0 12px 8px', letterSpacing: '0.06em', textShadow: '0 0 6px rgba(64,232,255,0.5)' }}>
        ■ 友達じゃないですか？
      </h3>
      <div className="overflow-x-auto" style={{ display: 'flex', gap: 8, padding: '0 12px', scrollSnapType: 'x mandatory' }}>
        {list.map(s => (
          <div
            key={s.id}
            style={{ position: 'relative', flex: '0 0 auto', width: 116, scrollSnapAlign: 'start', border: '1px solid rgba(64,232,255,0.30)', background: 'rgba(8,6,20,0.92)', padding: '12px 8px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
          >
            <button
              onClick={() => dismiss(s)}
              aria-label={`${s.name ?? s.handle} を候補から外す`}
              style={{ position: 'absolute', top: 0, right: 0, width: 32, height: 32, background: 'none', border: 'none', color: '#7a70a0', fontSize: 14, cursor: 'pointer' }}
            >
              ✕
            </button>
            <button
              onClick={() => s.handle && router.push(`/profile/${s.handle}`)}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, width: '100%' }}
            >
              <span style={{ width: 52, height: 52, overflow: 'hidden', display: 'block' }}>
                {s.image
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={s.image} alt="" width={52} height={52} style={{ objectFit: 'cover', imageRendering: 'pixelated', display: 'block' }} />
                  : <AvatarSVG size={52} />}
              </span>
              <span style={{ ...STYLE, fontSize: 13, color: '#d0c8f0', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name ?? s.handle}</span>
              <span style={{ ...STYLE, fontSize: 11, color: '#8a80b0', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>@{s.handle}</span>
            </button>
            <button
              onClick={() => follow(s)}
              disabled={busy === s.id}
              style={{ ...STYLE, width: '100%', fontSize: 12, color: '#ff40c0', background: 'rgba(4,2,12,0.9)', border: '1px solid rgba(255,64,192,0.5)', minHeight: 34, cursor: 'pointer', opacity: busy === s.id ? 0.6 : 1 }}
            >
              ＋ フォロー
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
