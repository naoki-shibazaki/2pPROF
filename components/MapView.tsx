'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

type FriendLoc = {
  handle: string
  name: string | null
  lat: number
  lng: number
  updated_at: string
}

type ShareMode = 'all' | 'selected' | 'off'

type FriendItem = {
  id: string
  handle: string
  name: string | null
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60)    return `${Math.floor(diff)}秒前`
  if (diff < 3600)  return `${Math.floor(diff / 60)}分前`
  return `${Math.floor(diff / 3600)}時間前`
}

function makeIcon(color: string, label: string) {
  return L.divIcon({
    className: '',
    html: `
      <div style="font-family:var(--font-pixel,monospace);display:flex;flex-direction:column;align-items:center;pointer-events:none;">
        <div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,0.8);box-shadow:0 0 8px ${color};"></div>
        <span style="margin-top:2px;white-space:nowrap;font-size:9px;color:${color};text-shadow:0 0 6px rgba(0,0,0,0.9),0 0 3px rgba(0,0,0,0.9);background:rgba(4,2,12,0.75);padding:1px 3px;">${label}</span>
      </div>`,
    iconSize: [80, 36],
    iconAnchor: [40, 7],
    popupAnchor: [0, -10],
  })
}

const myIcon = makeIcon('#ff40c0', 'あなた')

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  const moved = useRef(false)
  useEffect(() => {
    if (moved.current) return
    map.setView([lat, lng])
    moved.current = true
  }, [lat, lng, map])
  return null
}

// ── 共有設定パネル ──────────────────────────────────
function ShareSettingsPanel({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<ShareMode>('all')
  const [friends, setFriends] = useState<FriendItem[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/location/shares').then(r => r.json()),
      fetch('/api/friends').then(r => r.json()),
    ]).then(([shares, friendList]) => {
      setMode(shares.mode ?? 'all')
      setSelected(new Set((shares.selected ?? []).map((f: FriendItem) => f.id)))
      setFriends(Array.isArray(friendList) ? friendList : [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  function changeMode(m: ShareMode) {
    setMode(m)
    fetch('/api/location/shares', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: m }),
    }).catch(() => {})
  }

  function toggleFriend(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
    fetch('/api/location/shares', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toggleId: id }),
    }).catch(() => {})
  }

  const modeOptions: { value: ShareMode; label: string; desc: string }[] = [
    { value: 'all',      label: '全員の友達',       desc: '相互フォロー全員に共有' },
    { value: 'selected', label: '選んだ人だけ',      desc: '下のリストで選択' },
    { value: 'off',      label: '誰にも見せない',    desc: '地図上に表示されない' },
  ]

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 500,
      background: 'rgba(4,2,12,0.97)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* ヘッダー */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px',
        borderBottom: '1px solid rgba(255,64,192,0.25)',
      }}>
        <span style={{ ...STYLE, fontSize: 10, color: '#ff40c0', letterSpacing: '0.08em' }}>
          📍 位置共有の設定
        </span>
        <button onClick={onClose} style={{ ...STYLE, fontSize: 11, color: '#604878', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>
        {loading ? (
          <p style={{ ...STYLE, fontSize: 9, color: '#604878', textAlign: 'center', marginTop: 20 }}>読み込み中...</p>
        ) : (
          <>
            {/* モード選択 */}
            <p style={{ ...STYLE, fontSize: 8, color: '#40e8ff', marginBottom: 8, letterSpacing: '0.06em' }}>■ 共有範囲</p>
            {modeOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => changeMode(opt.value)}
                style={{
                  ...STYLE,
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', padding: '9px 10px', marginBottom: 6,
                  background: mode === opt.value ? 'rgba(255,64,192,0.12)' : 'rgba(6,4,14,0.70)',
                  border: `1px solid ${mode === opt.value ? 'rgba(255,64,192,0.50)' : 'rgba(64,56,96,0.30)'}`,
                  cursor: 'pointer', textAlign: 'left',
                }}
              >
                <span style={{ fontSize: 12, color: mode === opt.value ? '#ff40c0' : '#403060' }}>
                  {mode === opt.value ? '◉' : '○'}
                </span>
                <div>
                  <p style={{ fontSize: 9, color: mode === opt.value ? '#d0a8e8' : '#504870', margin: 0 }}>{opt.label}</p>
                  <p style={{ fontSize: 7, color: '#403060', margin: '2px 0 0' }}>{opt.desc}</p>
                </div>
              </button>
            ))}

            {/* 友達リスト（selected モード時） */}
            {mode === 'selected' && friends.length > 0 && (
              <>
                <p style={{ ...STYLE, fontSize: 8, color: '#40e8ff', margin: '16px 0 8px', letterSpacing: '0.06em' }}>■ 共有する友達を選ぶ</p>
                {friends.map(f => {
                  const on = selected.has(f.id)
                  return (
                    <button
                      key={f.id}
                      onClick={() => toggleFriend(f.id)}
                      style={{
                        ...STYLE,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        width: '100%', padding: '8px 10px', marginBottom: 4,
                        background: on ? 'rgba(64,232,255,0.08)' : 'transparent',
                        border: `1px solid ${on ? 'rgba(64,232,255,0.35)' : 'rgba(64,56,96,0.20)'}`,
                        cursor: 'pointer',
                      }}
                    >
                      <span style={{ fontSize: 9, color: on ? '#c8e8f8' : '#504870' }}>
                        @{f.handle}{f.name ? ` · ${f.name}` : ''}
                      </span>
                      <span style={{ fontSize: 10, color: on ? '#40e8ff' : '#403060' }}>
                        {on ? '✓' : '＋'}
                      </span>
                    </button>
                  )
                })}
                {friends.length === 0 && (
                  <p style={{ ...STYLE, fontSize: 9, color: '#403060', textAlign: 'center' }}>友達がいません</p>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ── メイン ─────────────────────────────────────────
export default function MapView() {
  const router = useRouter()
  const [myPos, setMyPos] = useState<{ lat: number; lng: number } | null>(null)
  const [geoError, setGeoError] = useState(false)
  const [friends, setFriends] = useState<FriendLoc[]>([])
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    if (!navigator.geolocation) { setGeoError(true); return }
    const id = navigator.geolocation.watchPosition(
      pos => setMyPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setGeoError(true),
      { enableHighAccuracy: true, timeout: 10000 }
    )
    return () => navigator.geolocation.clearWatch(id)
  }, [])

  const fetchFriends = useCallback(() => {
    fetch('/api/location/friends')
      .then(r => r.json())
      .then(data => Array.isArray(data) && setFriends(data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetchFriends()
    const id = setInterval(fetchFriends, 30000)
    return () => clearInterval(id)
  }, [fetchFriends])

  if (geoError) return (
    <div style={{ padding: '40px 24px', textAlign: 'center' }}>
      <p style={{ ...STYLE, fontSize: 10, color: '#604878', lineHeight: 2 }}>
        位置情報が許可されていません。<br />ブラウザの設定から許可してください。
      </p>
    </div>
  )

  if (!myPos) return (
    <div style={{ padding: '40px 24px', textAlign: 'center' }}>
      <p style={{ ...STYLE, fontSize: 10, color: '#604878' }}>位置情報を取得中...</p>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100dvh - 180px)', position: 'relative' }}>
      {/* 地図 */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <MapContainer center={[myPos.lat, myPos.lng]} zoom={16} style={{ width: '100%', height: '100%' }} zoomControl>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <Recenter lat={myPos.lat} lng={myPos.lng} />

          <Marker position={[myPos.lat, myPos.lng]} icon={myIcon}>
            <Popup><span style={{ ...STYLE, fontSize: 9 }}>あなたの現在地</span></Popup>
          </Marker>

          {friends.map(f => (
            <Marker key={f.handle} position={[f.lat, f.lng]} icon={makeIcon('#40e8ff', `@${f.handle}`)}>
              <Popup>
                <div style={{ ...STYLE, fontSize: 9, lineHeight: 1.8 }}>
                  <strong>@{f.handle}</strong><br />
                  {f.name && <>{f.name}<br /></>}
                  {timeAgo(f.updated_at)}<br />
                  <button onClick={() => router.push(`/profile/${f.handle}`)}
                    style={{ ...STYLE, fontSize: 8, marginTop: 4, cursor: 'pointer', color: '#40e8ff', background: 'none', border: 'none', padding: 0 }}>
                    プロフィールを見る →
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* ボトムバー */}
      <div style={{ padding: '8px 12px', background: 'rgba(6,4,18,0.96)', borderTop: '1px solid rgba(255,64,192,0.20)', flexShrink: 0, display: 'flex', gap: 8 }}>
        <button
          onClick={() => setShowSettings(true)}
          style={{
            ...STYLE, flex: 1, fontSize: 9,
            color: '#40e8ff',
            background: 'rgba(4,14,28,0.80)',
            border: '1px solid rgba(64,232,255,0.35)',
            padding: '7px 0', cursor: 'pointer', letterSpacing: '0.06em',
          }}
        >
          📍 共有設定
        </button>
        {friends.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', ...STYLE, fontSize: 8, color: '#504878', paddingRight: 4 }}>
            {friends.length}人が近くにいます
          </div>
        )}
      </div>

      {/* 共有設定パネル（フルオーバーレイ） */}
      {showSettings && <ShareSettingsPanel onClose={() => setShowSettings(false)} />}
    </div>
  )
}
