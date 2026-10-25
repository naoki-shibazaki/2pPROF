'use client'

import { useEffect, useState } from 'react'
import AvatarSVG from './AvatarSVG'
import { getProximityTitle } from '@/lib/proximity'

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

type Request = { id: string; name: string | null; handle: string | null; image: string | null }

// 届いた「会った？」を、どのタブにいてもモーダルで聞く
// 開いたとき・アプリに戻ったとき・開いている間は 20 秒ごとに確認する
export default function EncounterPrompt() {
  const [queue, setQueue] = useState<Request[]>([])
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<{ name: string; count: number } | null>(null)

  useEffect(() => {
    const load = () => fetch('/api/encounters')
      .then(r => (r.ok ? r.json() : { items: [] }))
      .then(d => setQueue(d.items ?? []))
      .catch(() => {})
    void load()
    const onVisible = () => { if (document.visibilityState === 'visible') void load() }
    document.addEventListener('visibilitychange', onVisible)
    const id = setInterval(() => { if (document.visibilityState === 'visible') void load() }, 20_000)
    return () => { document.removeEventListener('visibilitychange', onVisible); clearInterval(id) }
  }, [])

  const current = queue[0]

  async function answer(met: boolean) {
    if (!current) return
    setBusy(true)
    const res = await fetch(`/api/encounters/${current.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ met }),
    }).catch(() => null)
    const data = await res?.json().catch(() => null)
    setBusy(false)
    // 同じ相手からの確認はまとめて片付く
    setQueue(q => q.filter(r => r.handle !== current.handle))
    if (met && data?.ok) {
      setResult({ name: current.name ?? `@${current.handle}`, count: data.count })
      window.dispatchEvent(new Event('encounter-updated'))
    }
  }

  if (!current && !result) return null

  const btn = { ...STYLE, flex: 1, minHeight: 48, fontSize: 15, cursor: 'pointer', letterSpacing: '0.08em' } as const

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="encounter-title" style={{
      position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div style={{
        width: '100%', maxWidth: 340, background: 'rgba(6,4,18,0.98)', border: '2px solid #ff40c0',
        boxShadow: '0 0 24px rgba(255,64,192,0.45)', padding: 20,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, textAlign: 'center',
      }}>
        {result ? (
          <>
            <p id="encounter-title" style={{ ...STYLE, fontSize: 18, color: '#ffd700', textShadow: '0 0 10px rgba(255,215,0,0.6)' }}>⚔️ ENCOUNT!</p>
            <p style={{ ...STYLE, fontSize: 14, color: '#d0c8f0', lineHeight: 2 }}>
              {result.name} と会った回数<br />
              <span style={{ fontSize: 28, color: '#ffd700' }}>{result.count}</span> 回
            </p>
            <p style={{ ...STYLE, fontSize: 14, color: getProximityTitle(result.count).color }}>
              「{getProximityTitle(result.count).title}」
            </p>
            <button onClick={() => setResult(null)} style={{ ...btn, width: '100%', color: '#c0f0ff', background: 'transparent', border: '1px solid rgba(64,232,255,0.5)' }}>
              とじる
            </button>
          </>
        ) : current && (
          <>
            <div style={{ width: 64, height: 64, overflow: 'hidden' }}>
              {current.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={current.image} alt="" width={64} height={64} style={{ objectFit: 'cover', imageRendering: 'pixelated', display: 'block' }} />
              ) : <AvatarSVG size={64} />}
            </div>
            <p id="encounter-title" style={{ ...STYLE, fontSize: 16, color: '#d0c8f0', lineHeight: 1.9 }}>
              {current.name ?? current.handle}<br />
              <span style={{ fontSize: 12, color: '#8a80b0' }}>@{current.handle}</span>
            </p>
            <p style={{ ...STYLE, fontSize: 16, color: '#ff40c0' }}>一緒に会いましたか？</p>
            <div style={{ display: 'flex', gap: 8, width: '100%' }}>
              <button onClick={() => answer(false)} disabled={busy} style={{ ...btn, color: '#b0a8d0', background: 'transparent', border: '1px solid rgba(176,168,208,0.4)', opacity: busy ? 0.5 : 1 }}>
                会ってない
              </button>
              <button onClick={() => answer(true)} disabled={busy} style={{ ...btn, color: '#04020c', background: '#ffd700', border: '1px solid #ffd700', opacity: busy ? 0.5 : 1 }}>
                会った！
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
