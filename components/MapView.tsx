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

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60)    return `${Math.floor(diff)}秒前`
  if (diff < 3600)  return `${Math.floor(diff / 60)}分前`
  return `${Math.floor(diff / 3600)}時間前`
}

// ピクセル風カスタムアイコン
function makeIcon(color: string, label: string) {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        font-family:var(--font-pixel,monospace);
        display:flex;flex-direction:column;align-items:center;
        pointer-events:none;
      ">
        <div style="
          width:14px;height:14px;border-radius:50%;
          background:${color};
          border:2px solid rgba(255,255,255,0.8);
          box-shadow:0 0 8px ${color};
        "></div>
        <span style="
          margin-top:2px;white-space:nowrap;
          font-size:9px;color:${color};
          text-shadow:0 0 6px rgba(0,0,0,0.9),0 0 3px rgba(0,0,0,0.9);
          background:rgba(4,2,12,0.75);padding:1px 3px;
        ">${label}</span>
      </div>`,
    iconSize: [60, 36],
    iconAnchor: [30, 7],
    popupAnchor: [0, -10],
  })
}

const myIcon   = makeIcon('#ff40c0', 'あなた')
const friendIcon = makeIcon('#40e8ff', '')

// マップを自分位置に追従させるコンポーネント
function Recenter({ lat, lng, once }: { lat: number; lng: number; once: boolean }) {
  const map = useMap()
  const moved = useRef(false)
  useEffect(() => {
    if (once && moved.current) return
    map.setView([lat, lng])
    moved.current = true
  }, [lat, lng, map, once])
  return null
}

export default function MapView() {
  const router = useRouter()
  const [myPos, setMyPos] = useState<{ lat: number; lng: number } | null>(null)
  const [geoError, setGeoError] = useState(false)
  const [friends, setFriends] = useState<FriendLoc[]>([])
  const [sharing, setSharing] = useState(true)

  // 自分の位置
  useEffect(() => {
    if (!navigator.geolocation) { setGeoError(true); return }
    const id = navigator.geolocation.watchPosition(
      pos => setMyPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setGeoError(true),
      { enableHighAccuracy: true, timeout: 10000 }
    )
    return () => navigator.geolocation.clearWatch(id)
  }, [])

  // 友達の位置を 30 秒ごとに取得
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

  function toggleSharing() {
    const next = !sharing
    setSharing(next)
    fetch('/api/user/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proximity_mode: next ? 'on' : 'off' }),
    }).catch(() => {})
  }

  // 位置情報エラー or 未取得
  if (geoError) {
    return (
      <div style={{ padding: '40px 24px', textAlign: 'center' }}>
        <p style={{ ...STYLE, fontSize: 10, color: '#604878', lineHeight: 2 }}>
          位置情報が許可されていません。<br />
          ブラウザの設定から許可してください。
        </p>
      </div>
    )
  }

  if (!myPos) {
    return (
      <div style={{ padding: '40px 24px', textAlign: 'center' }}>
        <p style={{ ...STYLE, fontSize: 10, color: '#604878' }}>位置情報を取得中...</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100dvh - 180px)' }}>
      {/* 地図 */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <MapContainer
          center={[myPos.lat, myPos.lng]}
          zoom={16}
          style={{ width: '100%', height: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {/* 初回だけ自分位置に移動 */}
          <Recenter lat={myPos.lat} lng={myPos.lng} once={true} />

          {/* 自分のマーカー */}
          <Marker position={[myPos.lat, myPos.lng]} icon={myIcon}>
            <Popup>
              <span style={{ ...STYLE, fontSize: 9 }}>あなたの現在地</span>
            </Popup>
          </Marker>

          {/* 友達マーカー */}
          {friends.map(f => (
            <Marker
              key={f.handle}
              position={[f.lat, f.lng]}
              icon={makeIcon('#40e8ff', `@${f.handle}`)}
            >
              <Popup>
                <div style={{ ...STYLE, fontSize: 9, lineHeight: 1.8 }}>
                  <strong>@{f.handle}</strong><br />
                  {f.name && <>{f.name}<br /></>}
                  {timeAgo(f.updated_at)}<br />
                  <button
                    onClick={() => router.push(`/profile/${f.handle}`)}
                    style={{ ...STYLE, fontSize: 8, marginTop: 4, cursor: 'pointer', color: '#40e8ff', background: 'none', border: 'none', padding: 0 }}
                  >
                    プロフィールを見る →
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* 共有トグル */}
      <div style={{ padding: '8px 12px', background: 'rgba(6,4,18,0.96)', borderTop: '1px solid rgba(255,64,192,0.20)', flexShrink: 0 }}>
        <button onClick={toggleSharing} style={{
          ...STYLE, width: '100%', fontSize: 9,
          color: sharing ? '#38ff78' : '#604878',
          background: sharing ? 'rgba(0,40,10,0.70)' : 'rgba(6,4,14,0.70)',
          border: `1px solid ${sharing ? 'rgba(56,255,120,0.40)' : 'rgba(64,56,96,0.30)'}`,
          padding: '7px 0', cursor: 'pointer', letterSpacing: '0.06em',
        }}>
          {sharing ? '📍 自分の位置を友達に共有中' : '📍 位置を非表示にする'}
        </button>
        {friends.length > 0 && (
          <p style={{ ...STYLE, fontSize: 8, color: '#504878', marginTop: 5, textAlign: 'center' }}>
            {friends.length}人の友達が近くにいます
          </p>
        )}
      </div>
    </div>
  )
}
