'use client'

import { useState, useEffect } from 'react'

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

type Intro = {
  id: string
  body: string
  met_year: number | null
  met_month: number | null
  author_name: string | null
  author_handle: string | null
  created_at: string
}

export default function OthersTab() {
  const [intros, setIntros] = useState<Intro[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/introductions')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setIntros(data) })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  return (
    <div
      className="overflow-y-auto"
      style={{ background: 'transparent', maxHeight: 'calc(100dvh - 180px)' }}
    >
      {/* Sub-header */}
      <div
        className="px-3 py-2 text-center"
        style={{
          ...STYLE,
          background: 'rgba(4, 10, 22, 0.85)',
          borderBottom: '1px solid rgba(64,232,255,0.30)',
          color: '#40e8ff',
          fontSize: 12,
          letterSpacing: '0.06em',
          textShadow: '0 0 7px rgba(64,232,255,0.60)',
        }}
      >
        ともだちからの紹介文
      </div>

      {!loaded ? (
        <div className="flex justify-center py-12">
          <span style={{ ...STYLE, fontSize: 10, color: '#40e8ff' }}>読み込み中...</span>
        </div>
      ) : intros.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12">
          <span style={{ fontSize: 36 }}>📝</span>
          <p style={{ ...STYLE, fontSize: 10, color: '#504870', textAlign: 'center', lineHeight: 2.2 }}>
            まだ紹介文がありません<br />ともだちに紹介してもらおう
          </p>
        </div>
      ) : (
        <div className="flex flex-col">
          {intros.map((intro, idx) => {
            const rowBg = idx % 2 === 0 ? 'rgba(8,6,20,0.70)' : 'rgba(12,8,28,0.70)'
            return (
              <div key={intro.id} style={{
                borderBottom: '1px solid rgba(64,232,255,0.10)',
                borderLeft: '3px solid #40e8ff',
                background: rowBg,
                padding: '10px 12px',
              }}>
                <p style={{ ...STYLE, fontSize: 11, color: '#d0c8f0', lineHeight: 1.9, whiteSpace: 'pre-wrap', margin: 0 }}>
                  {intro.body}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                  <p style={{ ...STYLE, fontSize: 8, color: '#504870', margin: 0 }}>
                    from @{intro.author_handle ?? '?'}{intro.author_name ? ` (${intro.author_name})` : ''}
                  </p>
                  {(intro.met_year || intro.met_month) && (
                    <p style={{ ...STYLE, fontSize: 8, color: '#504878', margin: 0 }}>
                      {intro.met_year ?? ''}{intro.met_year ? '年' : ''}{intro.met_month ? `${intro.met_month}月` : ''}〜
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
