'use client'

import dynamic from 'next/dynamic'

// Leaflet は SSR 非対応のため dynamic import で囲む
const MapView = dynamic(() => import('./MapView'), { ssr: false, loading: () => (
  <div style={{ height: 'calc(100dvh - 220px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <p style={{ fontFamily: 'var(--font-pixel,monospace)', fontSize: 9, color: '#604878' }}>マップ読み込み中...</p>
  </div>
) })

export default function MapTab() {
  return <MapView />
}
