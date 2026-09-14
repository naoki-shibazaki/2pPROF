'use client'

import { useState, useEffect } from 'react'
import { profileData } from '@/data/profileData'

const STORAGE_KEY = '2pprof_level_config'
const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

type Config = { birthDate: string; visible: boolean }
const DEFAULT: Config = { birthDate: '', visible: true }

function calcAge(dateStr: string): number {
  const today = new Date()
  const birth = new Date(dateStr)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

export default function LevelBadge() {
  const [config, setConfig] = useState<Config>(DEFAULT)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Config>(DEFAULT)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setConfig(JSON.parse(saved))
    } catch { /* ignore */ }
  }, [])

  const level = config.birthDate ? calcAge(config.birthDate) : profileData.level

  function openEdit() {
    setDraft({ ...config })
    setEditing(true)
  }

  function save() {
    setConfig(draft)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
    setEditing(false)
  }

  return (
    <>
      {/* ── Badge (always tappable) ── */}
      {config.visible ? (
        <button
          onClick={openEdit}
          className="text-xs px-3 py-1"
          style={{
            ...STYLE,
            background: 'rgba(8, 6, 20, 0.92)',
            color: '#ffd700',
            border: '2px solid #ffd700',
            boxShadow: '0 0 8px rgba(255,215,0,0.40)',
            textShadow: '0 0 7px rgba(255,215,0,0.65)',
            letterSpacing: '0.12em',
            cursor: 'pointer',
          }}
        >
          ★ Lv.{level} {profileData.class}
        </button>
      ) : (
        /* hidden state — tiny subtle button so user can re-enable */
        <button
          onClick={openEdit}
          style={{
            ...STYLE,
            fontSize: 9,
            color: '#302848',
            background: 'transparent',
            border: '1px solid rgba(48,40,72,0.40)',
            padding: '1px 8px',
            cursor: 'pointer',
            letterSpacing: '0.08em',
          }}
        >
          Lv 非表示
        </button>
      )}

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
            border: '3px solid #ffd700',
            boxShadow: '0 0 24px rgba(255,215,0,0.40)',
            width: '100%', maxWidth: 320,
          }}>
            {/* Title bar */}
            <div style={{
              ...STYLE,
              background: 'linear-gradient(90deg, #18042e 0%, #2e0860 50%, #18042e 100%)',
              borderBottom: '2px solid #ffd700',
              color: '#ffd700', fontSize: 13,
              padding: '5px 10px', letterSpacing: '0.10em',
              textShadow: '0 0 8px rgba(255,215,0,0.70)',
            }}>
              ■ Lv 設定
            </div>

            <div className="px-4 py-4 flex flex-col gap-4">
              {/* Birth date */}
              <div className="flex flex-col gap-2">
                <label style={{
                  ...STYLE, fontSize: 11, color: '#40e8ff',
                  textShadow: '0 0 6px rgba(64,232,255,0.55)',
                  letterSpacing: '0.08em',
                }}>
                  ■ 生年月日
                </label>
                <input
                  type="date"
                  value={draft.birthDate}
                  onChange={e => setDraft(d => ({ ...d, birthDate: e.target.value }))}
                  style={{
                    ...STYLE, fontSize: 12, color: '#d0c8f0',
                    background: 'rgba(4, 2, 12, 0.80)',
                    border: '1px solid rgba(64,232,255,0.40)',
                    padding: '5px 8px', outline: 'none',
                    colorScheme: 'dark',
                  }}
                />
                {draft.birthDate && (
                  <p style={{ ...STYLE, fontSize: 10, color: '#ffd700', letterSpacing: '0.05em' }}>
                    → Lv.{calcAge(draft.birthDate)} になります
                  </p>
                )}
                {!draft.birthDate && (
                  <p style={{ ...STYLE, fontSize: 10, color: '#403860', letterSpacing: '0.04em' }}>
                    未入力の場合 Lv.{profileData.level}（固定値）
                  </p>
                )}
              </div>

              {/* Visibility toggle */}
              <div className="flex flex-col gap-2">
                <span style={{
                  ...STYLE, fontSize: 11, color: '#40e8ff',
                  textShadow: '0 0 6px rgba(64,232,255,0.55)',
                  letterSpacing: '0.08em',
                }}>
                  ■ Lv の表示
                </span>
                <div className="flex gap-2">
                  {[true, false].map((v) => (
                    <button
                      key={String(v)}
                      onClick={() => setDraft(d => ({ ...d, visible: v }))}
                      style={{
                        ...STYLE, flex: 1, fontSize: 11,
                        padding: '5px 0', cursor: 'pointer',
                        letterSpacing: '0.06em',
                        color: draft.visible === v ? '#ffd700' : '#403860',
                        background: draft.visible === v
                          ? 'rgba(8, 6, 20, 0.95)'
                          : 'rgba(4, 2, 12, 0.70)',
                        border: draft.visible === v
                          ? '2px solid #ffd700'
                          : '1px solid rgba(64,40,80,0.40)',
                        boxShadow: draft.visible === v
                          ? '0 0 8px rgba(255,215,0,0.30)' : 'none',
                        textShadow: draft.visible === v
                          ? '0 0 6px rgba(255,215,0,0.55)' : 'none',
                      }}
                    >
                      {v ? '▶ 表示する' : '── 非表示'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
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
        </div>
      )}
    </>
  )
}
