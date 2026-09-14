'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = '2pprof_hex_stats'
const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

const SZ = 90
const CX = 45, CY = 45, R = 38

const DEFAULT_STATS = [
  { name: '体力',  value: 8 },
  { name: '知力',  value: 7 },
  { name: 'センス', value: 5 },
  { name: '行動力', value: 9 },
  { name: 'コミュ', value: 6 },
  { name: '運',   value: 6 },
]

type Stat = { name: string; value: number }

function hexPt(r: number, i: number): [number, number] {
  const a = (Math.PI / 3) * i - Math.PI / 2
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)]
}

function hexPath(r: number) {
  return Array.from({ length: 6 }, (_, i) => hexPt(r, i).join(',')).join(' ')
}

function dataPath(stats: Stat[]) {
  return stats.map((s, i) => hexPt(R * (s.value / 10), i).join(',')).join(' ')
}

function HexChart({ stats }: { stats: Stat[] }) {
  return (
    <svg
      width={SZ}
      height={SZ}
      viewBox={`0 0 ${SZ} ${SZ}`}
      style={{ flexShrink: 0 }}
    >
      {/* Grid rings */}
      {[0.33, 0.66, 1.0].map((lvl) => (
        <polygon
          key={lvl}
          points={hexPath(R * lvl)}
          fill="none"
          stroke="#40e8ff"
          strokeWidth={lvl === 1.0 ? 1 : 0.7}
          strokeOpacity={lvl === 1.0 ? 0.45 : 0.20}
        />
      ))}

      {/* Axis lines */}
      {Array.from({ length: 6 }, (_, i) => {
        const [px, py] = hexPt(R, i)
        return (
          <line
            key={i}
            x1={CX} y1={CY} x2={px} y2={py}
            stroke="#40e8ff" strokeWidth="0.6" strokeOpacity="0.22"
          />
        )
      })}

      {/* Data fill */}
      <polygon
        points={dataPath(stats)}
        fill="#40e8ff"
        fillOpacity="0.18"
        stroke="#40e8ff"
        strokeWidth="1.5"
        strokeOpacity="0.85"
        style={{ filter: 'drop-shadow(0 0 3px #40e8ff)' }}
      />

      {/* Data dots */}
      {stats.map((s, i) => {
        const [px, py] = hexPt(R * (s.value / 10), i)
        return (
          <circle
            key={i} cx={px} cy={py} r="2"
            fill="#40e8ff"
            style={{ filter: 'drop-shadow(0 0 2px #40e8ff)' }}
          />
        )
      })}
    </svg>
  )
}

export default function HexStatus() {
  const [stats, setStats] = useState<Stat[]>(DEFAULT_STATS)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Stat[]>(DEFAULT_STATS)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length === 6) setStats(parsed)
      }
    } catch { /* ignore */ }
  }, [])

  function openEdit() {
    setDraft(stats.map(s => ({ ...s })))
    setEditing(true)
  }

  function save() {
    setStats(draft)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
    setEditing(false)
  }

  function changeName(i: number, name: string) {
    setDraft(d => d.map((s, idx) => idx === i ? { ...s, name } : s))
  }

  function changeValue(i: number, delta: number) {
    setDraft(d => d.map((s, idx) =>
      idx === i ? { ...s, value: Math.max(1, Math.min(10, s.value + delta)) } : s
    ))
  }

  return (
    <>
      <section>
        {/* Header */}
        <div
          className="flex items-center justify-between px-3 py-1"
          style={{
            background: 'rgba(4, 10, 22, 0.85)',
            borderTop: '1px solid rgba(64,232,255,0.38)',
            borderBottom: '1px solid rgba(64,232,255,0.38)',
          }}
        >
          <h3 style={{
            ...STYLE, fontSize: 12, color: '#40e8ff',
            letterSpacing: '0.10em', textShadow: '0 0 8px rgba(64,232,255,0.75)',
          }}>
            ■ ステータス
          </h3>
          <button
            onClick={openEdit}
            style={{
              ...STYLE, fontSize: 10, color: '#ffd700',
              background: 'transparent', border: '1px solid rgba(255,215,0,0.40)',
              padding: '1px 8px', cursor: 'pointer',
              textShadow: '0 0 5px rgba(255,215,0,0.50)',
            }}
          >
            [編集]
          </button>
        </div>

        {/* Chart + stat list */}
        <div
          className="flex items-center gap-3 px-3 py-3"
          style={{ background: 'rgba(4, 2, 12, 0.50)' }}
        >
          <HexChart stats={stats} />

          <div className="flex-1 flex flex-col gap-2">
            {stats.map((s, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span style={{
                  ...STYLE, fontSize: 9, color: '#40e8ff',
                  minWidth: 38, letterSpacing: '0.02em',
                  textShadow: '0 0 4px rgba(64,232,255,0.50)',
                }}>
                  {s.name}
                </span>
                <div style={{
                  flex: 1, height: 5,
                  background: 'rgba(64,232,255,0.10)',
                  border: '1px solid rgba(64,232,255,0.22)',
                }}>
                  <div style={{
                    width: `${s.value * 10}%`, height: '100%',
                    background: '#40e8ff', boxShadow: '0 0 4px #40e8ff',
                  }} />
                </div>
                <span style={{
                  ...STYLE, fontSize: 9, color: '#40e8ff',
                  minWidth: 12, textAlign: 'right', opacity: 0.75,
                }}>
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Edit modal ── */}
      {editing && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(4, 2, 12, 0.88)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: '16px',
          }}
          onClick={(e) => e.target === e.currentTarget && setEditing(false)}
        >
          <div style={{
            background: 'rgba(8, 6, 20, 0.99)',
            border: '3px solid #40e8ff',
            boxShadow: '0 0 24px rgba(64,232,255,0.45)',
            width: '100%', maxWidth: 340,
          }}>
            {/* Modal title bar */}
            <div style={{
              ...STYLE,
              background: 'linear-gradient(90deg, #18042e 0%, #2e0860 50%, #18042e 100%)',
              borderBottom: '2px solid #40e8ff',
              color: '#40e8ff', fontSize: 13,
              padding: '5px 10px', letterSpacing: '0.10em',
              textShadow: '0 0 8px rgba(64,232,255,0.70)',
            }}>
              ■ ステータス編集
            </div>

            {/* Column labels */}
            <div
              className="flex items-center px-3 py-1"
              style={{ borderBottom: '1px solid rgba(64,232,255,0.15)' }}
            >
              <span style={{ ...STYLE, fontSize: 9, color: '#403860', width: 66 }}>名前</span>
              <span style={{ ...STYLE, fontSize: 9, color: '#403860', flex: 1, textAlign: 'center' }}>値 (1〜10)</span>
            </div>

            {/* Stat rows */}
            <div className="px-3 py-2 flex flex-col gap-2.5">
              {draft.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={s.name}
                    onChange={e => changeName(i, e.target.value)}
                    maxLength={5}
                    style={{
                      ...STYLE, fontSize: 11, color: '#d0c8f0',
                      background: 'rgba(4, 2, 12, 0.80)',
                      border: '1px solid rgba(64,232,255,0.35)',
                      padding: '2px 6px', width: 62, outline: 'none',
                    }}
                  />

                  <button
                    onClick={() => changeValue(i, -1)}
                    style={{
                      ...STYLE, fontSize: 14, color: '#40e8ff',
                      background: 'rgba(8, 6, 20, 0.90)',
                      border: '1px solid rgba(64,232,255,0.40)',
                      width: 24, height: 24, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    −
                  </button>

                  <span style={{
                    ...STYLE, fontSize: 13, color: '#ffd700',
                    textShadow: '0 0 6px rgba(255,215,0,0.55)',
                    minWidth: 18, textAlign: 'center',
                  }}>
                    {s.value}
                  </span>

                  <button
                    onClick={() => changeValue(i, +1)}
                    style={{
                      ...STYLE, fontSize: 14, color: '#40e8ff',
                      background: 'rgba(8, 6, 20, 0.90)',
                      border: '1px solid rgba(64,232,255,0.40)',
                      width: 24, height: 24, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    ＋
                  </button>

                  {/* Preview bar */}
                  <div style={{
                    flex: 1, height: 5,
                    background: 'rgba(64,232,255,0.10)',
                    border: '1px solid rgba(64,232,255,0.25)',
                  }}>
                    <div style={{
                      width: `${s.value * 10}%`, height: '100%',
                      background: '#40e8ff', boxShadow: '0 0 3px #40e8ff',
                    }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 px-3 pb-3">
              <button
                onClick={save}
                style={{
                  ...STYLE, flex: 1, fontSize: 11,
                  color: '#38ff78',
                  background: 'rgba(4, 2, 12, 0.90)',
                  border: '2px solid #38ff78',
                  boxShadow: '0 0 8px rgba(56,255,120,0.30)',
                  textShadow: '0 0 6px rgba(56,255,120,0.60)',
                  padding: '6px 0', cursor: 'pointer', letterSpacing: '0.08em',
                }}
              >
                ▶ 保存
              </button>
              <button
                onClick={() => setEditing(false)}
                style={{
                  ...STYLE, flex: 1, fontSize: 11, color: '#504870',
                  background: 'rgba(4, 2, 12, 0.90)',
                  border: '1px solid rgba(80,72,112,0.40)',
                  padding: '6px 0', cursor: 'pointer', letterSpacing: '0.08em',
                }}
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
