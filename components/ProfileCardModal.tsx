'use client'

import { useState } from 'react'

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

type CardStyle = 'twitter' | 'story'

export default function ProfileCardModal({
  handle,
  onClose,
}: {
  handle: string
  onClose: () => void
}) {
  const [cardStyle, setCardStyle] = useState<CardStyle>('twitter')
  const [downloading, setDownloading] = useState(false)

  const imgSrc = `/api/card/${handle}?style=${cardStyle}`

  async function download() {
    setDownloading(true)
    try {
      const res = await fetch(imgSrc)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `2pprof_${handle}_${cardStyle}.png`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(4,2,12,0.93)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: 16,
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: 'rgba(8,6,20,0.99)',
        border: '2px solid #ff40c0',
        boxShadow: '0 0 24px rgba(255,64,192,0.40)',
        width: '100%', maxWidth: 400,
        display: 'flex', flexDirection: 'column',
      }}>
        {/* ヘッダー */}
        <div style={{
          ...STYLE, fontSize: 11, color: '#ff40c0',
          background: 'rgba(255,64,192,0.08)',
          borderBottom: '1px solid rgba(255,64,192,0.30)',
          padding: '8px 12px', letterSpacing: '0.08em',
          textShadow: '0 0 6px rgba(255,64,192,0.6)',
        }}>
          ■ プロフカード生成
        </div>

        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* スタイル切替 */}
          <div style={{ display: 'flex', gap: 8 }}>
            {([
              { id: 'twitter', label: 'X / OG', desc: '1200×630' },
              { id: 'story',   label: 'Story',  desc: '1080×1920' },
            ] as const).map(s => (
              <button
                key={s.id}
                onClick={() => setCardStyle(s.id)}
                style={{
                  ...STYLE, flex: 1, fontSize: 9,
                  padding: '6px 4px', cursor: 'pointer',
                  color: cardStyle === s.id ? '#40e8ff' : '#504870',
                  background: cardStyle === s.id ? 'rgba(64,232,255,0.08)' : 'rgba(4,2,12,0.80)',
                  border: `1px solid ${cardStyle === s.id ? 'rgba(64,232,255,0.55)' : 'rgba(80,72,112,0.35)'}`,
                }}
              >
                {s.label}<br />
                <span style={{ fontSize: 7, opacity: 0.7 }}>{s.desc}</span>
              </button>
            ))}
          </div>

          {/* プレビュー */}
          <div style={{
            background: 'rgba(4,2,12,0.60)',
            border: '1px solid rgba(64,232,255,0.20)',
            padding: 8, display: 'flex', justifyContent: 'center',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={imgSrc}
              src={imgSrc}
              alt="profile card preview"
              style={{
                maxWidth: '100%',
                maxHeight: cardStyle === 'story' ? 280 : 160,
                objectFit: 'contain',
              }}
            />
          </div>

          {/* ボタン */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={download}
              disabled={downloading}
              style={{
                ...STYLE, flex: 1, fontSize: 10, color: '#38ff78',
                background: 'rgba(4,2,12,0.90)',
                border: '1px solid rgba(56,255,120,0.50)',
                padding: '7px 0', cursor: downloading ? 'default' : 'pointer',
                opacity: downloading ? 0.5 : 1, letterSpacing: '0.06em',
              }}
            >
              {downloading ? '生成中...' : '▼ 保存'}
            </button>
            <button
              onClick={onClose}
              style={{
                ...STYLE, fontSize: 10, color: '#504870',
                background: 'transparent',
                border: '1px solid rgba(80,72,112,0.35)',
                padding: '7px 16px', cursor: 'pointer',
              }}
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
