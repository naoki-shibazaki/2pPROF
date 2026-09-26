'use client'

import { QRCodeSVG } from 'qrcode.react'

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

export default function QRModal({ url, name, onClose }: { url: string; name: string; onClose: () => void }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(4,2,12,0.88)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'rgba(8,6,20,0.98)',
          border: '2px solid #ff40c0',
          boxShadow: '0 0 24px rgba(255,64,192,0.40)',
          padding: '20px 24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
          maxWidth: 280, width: '90%',
        }}
      >
        <span style={{ ...STYLE, fontSize: 10, color: '#ff40c0', letterSpacing: '0.10em', textShadow: '0 0 6px rgba(255,64,192,0.60)' }}>
          ■ QRコード
        </span>
        <div style={{ background: '#fff', padding: 10 }}>
          <QRCodeSVG value={url} size={160} />
        </div>
        <span style={{ ...STYLE, fontSize: 9, color: '#604878', textAlign: 'center', lineHeight: 1.8 }}>
          {name} のプロフィール<br />スキャンしてフォローしよう
        </span>
        <button
          onClick={onClose}
          style={{
            ...STYLE, fontSize: 10, color: '#504870',
            background: 'transparent', border: '1px solid rgba(80,72,112,0.40)',
            padding: '5px 20px', cursor: 'pointer',
          }}
        >
          とじる
        </button>
      </div>
    </div>
  )
}
