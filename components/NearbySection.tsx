'use client'

import { useEffect, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { App } from '@capacitor/app'
import AvatarSVG from './AvatarSVG'
import { NEARBY_RADIUS_M } from '@/lib/encounters-config'

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const
// 位置情報の許可（NSLocationWhenInUseUsageDescription）が入った最初のビルド
const FIRST_NATIVE_BUILD_WITH_LOCATION = 8

type Nearby = {
  id: string
  name: string | null
  handle: string | null
  image: string | null
  distance_m: number
  requested: boolean
  counted_today: boolean
}

type Status = 'idle' | 'locating' | 'done' | 'denied' | 'error'

// 友達タブの「近くにいる人」。ボタンを押したときだけ位置を取得する
export default function NearbySection() {
  const [status, setStatus] = useState<Status>('idle')
  const [items, setItems] = useState<Nearby[]>([])
  const [sending, setSending] = useState<string | null>(null)
  const [message, setMessage] = useState<{ handle: string; text: string; ok: boolean } | null>(null)
  // 古いアプリは位置情報を使えないので、アップデートを案内する
  const [needsUpdate, setNeedsUpdate] = useState(false)
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return
    App.getInfo()
      .then(info => setNeedsUpdate(Number(info.build) < FIRST_NATIVE_BUILD_WITH_LOCATION))
      .catch(() => {})
  }, [])

  if (needsUpdate) {
    return (
      <section aria-label="近くにいる人" style={{ borderBottom: '1px solid rgba(64,232,255,0.20)', background: 'rgba(4,10,22,0.70)', padding: '10px 12px' }}>
        <span style={{ ...STYLE, fontSize: 10, color: '#40e8ff', letterSpacing: '0.08em' }}>■ 近くにいる人</span>
        <p style={{ ...STYLE, fontSize: 9, color: '#605888', marginTop: 6, lineHeight: 1.8 }}>
          App Store でアプリを最新版にアップデートすると使えます。
        </p>
      </section>
    )
  }

  function search() {
    if (!('geolocation' in navigator)) { setStatus('error'); return }
    setStatus('locating')
    setMessage(null)
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const res = await fetch('/api/nearby', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        }).catch(() => null)
        if (!res?.ok) { setStatus('error'); return }
        const data = await res.json()
        setItems(data.items ?? [])
        setStatus('done')
      },
      err => setStatus(err.code === err.PERMISSION_DENIED ? 'denied' : 'error'),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    )
  }

  async function sendMet(f: Nearby) {
    if (!f.handle) return
    setSending(f.handle)
    const res = await fetch('/api/encounters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ handle: f.handle }),
    }).catch(() => null)
    const data = await res?.json().catch(() => ({}))
    setSending(null)
    if (res?.ok) {
      setItems(prev => prev.map(x => (x.id === f.id ? { ...x, requested: true } : x)))
      setMessage({ handle: f.handle, text: '送りました。相手が「会った」と答えると回数が増えます', ok: true })
    } else {
      setMessage({ handle: f.handle, text: data?.error ?? '送れませんでした', ok: false })
    }
  }

  return (
    <section aria-label="近くにいる人" style={{ borderBottom: '1px solid rgba(64,232,255,0.20)', background: 'rgba(4,10,22,0.70)', padding: '10px 12px' }}>
      <div className="flex items-center justify-between gap-2">
        <span style={{ ...STYLE, fontSize: 10, color: '#40e8ff', letterSpacing: '0.08em' }}>■ 近くにいる人</span>
        <button
          onClick={search}
          disabled={status === 'locating'}
          style={{
            ...STYLE, fontSize: 10, color: '#38ff78', background: 'rgba(4,2,12,0.90)',
            border: '1px solid rgba(56,255,120,0.50)', padding: '0 12px', minHeight: 36, cursor: 'pointer',
            opacity: status === 'locating' ? 0.5 : 1,
          }}
        >
          {status === 'locating' ? 'さがしています…' : status === 'done' ? '📍 もう一度さがす' : '📍 近くの友達をさがす'}
        </button>
      </div>

      {status === 'idle' && (
        <p style={{ ...STYLE, fontSize: 8, color: '#605888', marginTop: 6, lineHeight: 1.8 }}>
          一緒にいる友達も同じボタンを押すと、ここに表示されます。位置はボタンを押したときだけ使います。
        </p>
      )}
      {status === 'denied' && (
        <p role="alert" style={{ ...STYLE, fontSize: 9, color: '#ff8090', marginTop: 6, lineHeight: 1.8 }}>
          位置情報がオフになっています。iPhone の「設定」→「2P PROF」→「位置情報」で「使用中のみ」にしてください。
        </p>
      )}
      {status === 'error' && (
        <p role="alert" style={{ ...STYLE, fontSize: 9, color: '#ff8090', marginTop: 6 }}>
          位置を取得できませんでした。電波のよい場所でもう一度お試しください。
        </p>
      )}
      {status === 'done' && items.length === 0 && (
        <p style={{ ...STYLE, fontSize: 9, color: '#605888', marginTop: 6, lineHeight: 1.8 }}>
          {NEARBY_RADIUS_M}m 以内に友達は見つかりませんでした。相手にもこのボタンを押してもらってください。
        </p>
      )}

      {status === 'done' && items.length > 0 && (
        <ul className="flex flex-col" style={{ marginTop: 8 }}>
          {items.map(f => (
            <li key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
              <div style={{ width: 36, height: 36, overflow: 'hidden', flexShrink: 0 }}>
                {f.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.image} alt="" width={36} height={36} style={{ objectFit: 'cover', imageRendering: 'pixelated', display: 'block' }} />
                ) : <AvatarSVG size={36} />}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="truncate" style={{ ...STYLE, fontSize: 11, color: '#d0c8f0' }}>{f.name ?? f.handle}</span>
                <span style={{ ...STYLE, fontSize: 8, color: '#605888' }}>@{f.handle} ・ 約{Math.max(10, Math.round(f.distance_m / 10) * 10)}m</span>
                {message?.handle === f.handle && (
                  <span role="status" style={{ ...STYLE, fontSize: 8, color: message.ok ? '#38ff78' : '#ff8090', marginTop: 2 }}>{message.text}</span>
                )}
              </div>
              {f.counted_today ? (
                <span style={{ ...STYLE, fontSize: 9, color: '#ffd700', flexShrink: 0 }}>今日は会った！</span>
              ) : f.requested ? (
                <span style={{ ...STYLE, fontSize: 9, color: '#605888', flexShrink: 0 }}>返事待ち</span>
              ) : (
                <button
                  onClick={() => sendMet(f)}
                  disabled={sending === f.handle}
                  aria-label={`@${f.handle} に会ったことを送る`}
                  style={{
                    ...STYLE, fontSize: 10, color: '#ffd700', background: 'rgba(4,2,12,0.90)',
                    border: '1px solid rgba(255,215,0,0.55)', padding: '0 10px', minHeight: 36, cursor: 'pointer', flexShrink: 0,
                    opacity: sending === f.handle ? 0.5 : 1,
                  }}
                >
                  ⚔️ 会った！
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
