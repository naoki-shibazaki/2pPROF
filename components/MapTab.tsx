'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const
const MAP_SIZE = 260
const ZOOMS = [300, 1500, 8000] // meters (radius)

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

// lat/lng → px offset from map center
function toPixel(myLat: number, myLng: number, lat: number, lng: number, radius: number) {
  const scale = (MAP_SIZE / 2) / radius
  const dLat = (lat - myLat) * (Math.PI / 180) * 6371000
  const dLng = (lng - myLng) * (Math.PI / 180) * 6371000 * Math.cos(myLat * Math.PI / 180)
  return {
    x: MAP_SIZE / 2 + dLng * scale,
    y: MAP_SIZE / 2 - dLat * scale,
  }
}

function distM(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export default function MapTab() {
  const router = useRouter()
  const [myPos, setMyPos] = useState<{ lat: number; lng: number } | null>(null)
  const [geoError, setGeoError] = useState(false)
  const [friends, setFriends] = useState<FriendLoc[]>([])
  const [zoom, setZoom] = useState(0)
  const [tick, setTick] = useState(0)
  const [sharing, setSharing] = useState(true)

  // 自分の位置を取得 (watchPosition)
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

  // ブリンクアニメーション
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 700)
    return () => clearInterval(id)
  }, [])

  // 共有 ON/OFF トグル
  function toggleSharing() {
    const next = !sharing
    setSharing(next)
    fetch('/api/user/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proximity_mode: next ? 'on' : 'off' }),
    }).catch(() => {})
  }

  const radius = ZOOMS[zoom]

  return (
    <div className="overflow-y-auto" style={{ maxHeight: 'calc(100dvh - 180px)', background: 'transparent' }}>
      {/* レーダー */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 12px 8px' }}>
        <div style={{
          position: 'relative', width: MAP_SIZE, height: MAP_SIZE,
          border: '1px solid rgba(64,232,255,0.35)',
          background: 'rgba(2,6,18,0.97)',
          flexShrink: 0,
        }}>
          {/* 走査線エフェクト */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(64,232,255,0.02) 3px, rgba(64,232,255,0.02) 4px)`,
          }} />

          {/* 距離リング */}
          {[0.25, 0.5, 1.0].map(r => (
            <div key={r} style={{
              position: 'absolute',
              left: MAP_SIZE / 2 - (MAP_SIZE / 2) * r,
              top:  MAP_SIZE / 2 - (MAP_SIZE / 2) * r,
              width: MAP_SIZE * r, height: MAP_SIZE * r,
              borderRadius: '50%',
              border: '1px solid rgba(64,232,255,0.12)',
              pointerEvents: 'none',
            }} />
          ))}

          {/* 十字線 */}
          <div style={{ position: 'absolute', left: MAP_SIZE / 2, top: 0, bottom: 0, width: 1, background: 'rgba(64,232,255,0.08)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: MAP_SIZE / 2, left: 0, right: 0, height: 1, background: 'rgba(64,232,255,0.08)', pointerEvents: 'none' }} />

          {/* 距離ラベル */}
          {[0.25, 0.5].map(r => (
            <span key={r} style={{
              position: 'absolute',
              left: MAP_SIZE / 2 + (MAP_SIZE / 2) * r + 3,
              top: MAP_SIZE / 2 + 2,
              ...STYLE, fontSize: 7, color: 'rgba(64,232,255,0.30)', pointerEvents: 'none',
            }}>
              {Math.round(radius * r) >= 1000 ? `${(radius * r / 1000).toFixed(1)}km` : `${Math.round(radius * r)}m`}
            </span>
          ))}

          {/* 自分 */}
          {myPos && (
            <div style={{
              position: 'absolute',
              left: MAP_SIZE / 2 - 7, top: MAP_SIZE / 2 - 7,
              width: 14, height: 14, borderRadius: '50%',
              background: tick % 2 ? '#ff40c0' : '#ff80da',
              boxShadow: '0 0 10px rgba(255,64,192,0.90)',
              zIndex: 10,
              border: '1px solid rgba(255,255,255,0.5)',
            }} />
          )}

          {/* 友達マーカー */}
          {myPos && friends.map(f => {
            const px = toPixel(myPos.lat, myPos.lng, f.lat, f.lng, radius)
            const inBounds = px.x > 8 && px.x < MAP_SIZE - 8 && px.y > 8 && px.y < MAP_SIZE - 8
            const cx = Math.max(10, Math.min(MAP_SIZE - 10, px.x))
            const cy = Math.max(10, Math.min(MAP_SIZE - 10, px.y))
            return (
              <div
                key={f.handle}
                onClick={() => router.push(`/profile/${f.handle}`)}
                style={{ position: 'absolute', left: cx - 6, top: cy - 6, zIndex: 5, cursor: 'pointer' }}
              >
                <div style={{
                  width: 12, height: 12, borderRadius: '50%',
                  background: inBounds ? (tick % 2 ? '#40e8ff' : '#80f0ff') : '#384050',
                  boxShadow: inBounds ? '0 0 7px rgba(64,232,255,0.85)' : 'none',
                  border: '1px solid rgba(255,255,255,0.3)',
                }} />
                <span style={{
                  position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)',
                  whiteSpace: 'nowrap', ...STYLE, fontSize: 7,
                  color: inBounds ? '#40e8ff' : '#384050',
                  textShadow: inBounds ? '0 0 4px rgba(64,232,255,0.70)' : 'none',
                }}>
                  {f.handle}
                </span>
              </div>
            )
          })}

          {/* 位置情報なし */}
          {!myPos && !geoError && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ ...STYLE, fontSize: 9, color: '#604878', textAlign: 'center', lineHeight: 2 }}>
                取得中...
              </p>
            </div>
          )}
          {geoError && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
              <p style={{ ...STYLE, fontSize: 9, color: '#604878', textAlign: 'center', lineHeight: 2 }}>
                位置情報を<br />許可してください
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ズーム + 凡例 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '0 12px 8px' }}>
        {ZOOMS.map((z, i) => (
          <button key={z} onClick={() => setZoom(i)} style={{
            ...STYLE, fontSize: 8,
            color: zoom === i ? '#40e8ff' : '#403860',
            background: 'transparent',
            border: `1px solid ${zoom === i ? 'rgba(64,232,255,0.50)' : 'rgba(64,56,96,0.30)'}`,
            padding: '3px 8px', cursor: 'pointer',
          }}>
            {z < 1000 ? `${z}m` : `${z / 1000}km`}
          </button>
        ))}
      </div>

      {/* 自分の共有トグル */}
      <div style={{ padding: '6px 12px 8px', borderTop: '1px solid rgba(64,232,255,0.10)' }}>
        <button onClick={toggleSharing} style={{
          ...STYLE, width: '100%', fontSize: 9,
          color: sharing ? '#38ff78' : '#604878',
          background: sharing ? 'rgba(0,40,10,0.70)' : 'rgba(6,4,14,0.70)',
          border: `1px solid ${sharing ? 'rgba(56,255,120,0.40)' : 'rgba(64,56,96,0.30)'}`,
          padding: '7px 0', cursor: 'pointer', letterSpacing: '0.06em',
        }}>
          {sharing ? '📍 自分の位置を共有中' : '📍 位置を非表示にする'}
        </button>
      </div>

      {/* 友達リスト */}
      {friends.length > 0 && (
        <div style={{ padding: '0 12px 12px' }}>
          <p style={{ ...STYLE, fontSize: 8, color: '#40e8ff', marginBottom: 6, letterSpacing: '0.06em' }}>
            ■ 近くにいる友達
          </p>
          {friends.map(f => (
            <div
              key={f.handle}
              onClick={() => router.push(`/profile/${f.handle}`)}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '5px 0',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                cursor: 'pointer',
              }}
            >
              <span style={{ ...STYLE, fontSize: 9, color: '#c8a8e8' }}>
                @{f.handle}
              </span>
              <span style={{ ...STYLE, fontSize: 8, color: '#504870' }}>
                {myPos ? `${Math.round(distM(myPos.lat, myPos.lng, f.lat, f.lng))}m · ` : ''}{timeAgo(f.updated_at)}
              </span>
            </div>
          ))}
        </div>
      )}

      {myPos && friends.length === 0 && (
        <p style={{ ...STYLE, fontSize: 9, color: '#403060', textAlign: 'center', padding: '12px 0 16px' }}>
          近くに友達はいません
        </p>
      )}
    </div>
  )
}
