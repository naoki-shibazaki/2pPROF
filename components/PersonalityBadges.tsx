'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = '2pprof_personality'
const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

const MBTI_TYPES = [
  'INTJ','INTP','ENTJ','ENTP',
  'INFJ','INFP','ENFJ','ENFP',
  'ISTJ','ISFJ','ESTJ','ESFJ',
  'ISTP','ISFP','ESTP','ESFP',
]

const ANIMALS = [
  'こじか','ライオン','チーター','虎',
  '黒ひょう','象','たぬき','猿',
  'ペガサス','コアラ','狼','ひつじ',
]

const LOVE_TYPES = [
  'リード型','献身型','理想主義型','受け身型',
  '恋愛体質型','さっぱり型','ツンデレ型','情熱型',
]

type Config = { mbti: string; animal: string; love: string }
const DEFAULT: Config = { mbti: '', animal: '', love: '' }

function Badge({
  label, value, color, onClick,
}: {
  label: string; value: string; color: string; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        ...STYLE,
        fontSize: 9,
        color: value ? color : '#403060',
        background: 'rgba(4,2,12,0.80)',
        border: `1px solid ${value ? color + '88' : 'rgba(64,48,96,0.40)'}`,
        padding: '1px 7px',
        cursor: 'pointer',
        letterSpacing: '0.04em',
        textShadow: value ? `0 0 5px ${color}88` : 'none',
        whiteSpace: 'nowrap',
      }}
    >
      {value ? value : label}
    </button>
  )
}

type Section = 'mbti' | 'animal' | 'love' | null

export default function PersonalityBadges() {
  const [config, setConfig] = useState<Config>(DEFAULT)
  const [open, setOpen] = useState<Section>(null)
  const [draft, setDraft] = useState<Config>(DEFAULT)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setConfig(JSON.parse(saved))
    } catch { /* ignore */ }
  }, [])

  function openModal(section: Section) {
    setDraft({ ...config })
    setOpen(section)
  }

  function save() {
    setConfig(draft)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
    setOpen(null)
  }

  function select(field: keyof Config, value: string) {
    setDraft(d => ({ ...d, [field]: d[field] === value ? '' : value }))
  }

  return (
    <>
      {/* ── Badges row ── */}
      <div className="flex gap-1.5 flex-wrap justify-center">
        <Badge label="MBTI"   value={config.mbti}   color="#40e8ff" onClick={() => openModal('mbti')} />
        <Badge label="動物占い" value={config.animal} color="#ff8830" onClick={() => openModal('animal')} />
        <Badge label="恋愛診断" value={config.love}   color="#ff40c0" onClick={() => openModal('love')} />
      </div>

      {/* ── Modal ── */}
      {open && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(4,2,12,0.90)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: '16px',
          }}
          onClick={(e) => e.target === e.currentTarget && setOpen(null)}
        >
          <div style={{
            background: 'rgba(8,6,20,0.99)',
            border: `3px solid ${open === 'mbti' ? '#40e8ff' : open === 'animal' ? '#ff8830' : '#ff40c0'}`,
            boxShadow: `0 0 24px ${open === 'mbti' ? 'rgba(64,232,255,0.40)' : open === 'animal' ? 'rgba(255,136,48,0.40)' : 'rgba(255,64,192,0.40)'}`,
            width: '100%', maxWidth: 320,
          }}>
            {/* Title bar */}
            <div style={{
              ...STYLE,
              background: 'linear-gradient(90deg,#18042e 0%,#2e0860 50%,#18042e 100%)',
              borderBottom: `2px solid ${open === 'mbti' ? '#40e8ff' : open === 'animal' ? '#ff8830' : '#ff40c0'}`,
              color: open === 'mbti' ? '#40e8ff' : open === 'animal' ? '#ff8830' : '#ff40c0',
              fontSize: 13, padding: '5px 10px', letterSpacing: '0.10em',
            }}>
              ■ {open === 'mbti' ? 'MBTI タイプ' : open === 'animal' ? '動物占い' : '恋愛診断'}
            </div>

            <div className="p-3 flex flex-col gap-3">
              {/* MBTI: 4×4 grid */}
              {open === 'mbti' && (
                <div className="grid grid-cols-4 gap-1.5">
                  {MBTI_TYPES.map(t => (
                    <button
                      key={t}
                      onClick={() => select('mbti', t)}
                      style={{
                        ...STYLE, fontSize: 11, padding: '4px 0',
                        color: draft.mbti === t ? '#40e8ff' : '#504870',
                        background: draft.mbti === t ? 'rgba(64,232,255,0.12)' : 'rgba(4,2,12,0.80)',
                        border: `1px solid ${draft.mbti === t ? '#40e8ff' : 'rgba(64,232,255,0.20)'}`,
                        boxShadow: draft.mbti === t ? '0 0 6px rgba(64,232,255,0.30)' : 'none',
                        textShadow: draft.mbti === t ? '0 0 5px rgba(64,232,255,0.60)' : 'none',
                        cursor: 'pointer', textAlign: 'center',
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}

              {/* 動物占い: 3×4 grid */}
              {open === 'animal' && (
                <div className="grid grid-cols-3 gap-1.5">
                  {ANIMALS.map(a => (
                    <button
                      key={a}
                      onClick={() => select('animal', a)}
                      style={{
                        ...STYLE, fontSize: 11, padding: '5px 0',
                        color: draft.animal === a ? '#ff8830' : '#504870',
                        background: draft.animal === a ? 'rgba(255,136,48,0.12)' : 'rgba(4,2,12,0.80)',
                        border: `1px solid ${draft.animal === a ? '#ff8830' : 'rgba(255,136,48,0.20)'}`,
                        boxShadow: draft.animal === a ? '0 0 6px rgba(255,136,48,0.30)' : 'none',
                        textShadow: draft.animal === a ? '0 0 5px rgba(255,136,48,0.60)' : 'none',
                        cursor: 'pointer', textAlign: 'center',
                      }}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              )}

              {/* 恋愛診断: 2×4 grid */}
              {open === 'love' && (
                <div className="grid grid-cols-2 gap-1.5">
                  {LOVE_TYPES.map(l => (
                    <button
                      key={l}
                      onClick={() => select('love', l)}
                      style={{
                        ...STYLE, fontSize: 11, padding: '5px 0',
                        color: draft.love === l ? '#ff40c0' : '#504870',
                        background: draft.love === l ? 'rgba(255,64,192,0.12)' : 'rgba(4,2,12,0.80)',
                        border: `1px solid ${draft.love === l ? '#ff40c0' : 'rgba(255,64,192,0.20)'}`,
                        boxShadow: draft.love === l ? '0 0 6px rgba(255,64,192,0.30)' : 'none',
                        textShadow: draft.love === l ? '0 0 5px rgba(255,64,192,0.60)' : 'none',
                        cursor: 'pointer', textAlign: 'center',
                      }}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={save}
                  style={{
                    ...STYLE, flex: 1, fontSize: 11, color: '#38ff78',
                    background: 'rgba(4,2,12,0.90)',
                    border: '2px solid #38ff78',
                    boxShadow: '0 0 8px rgba(56,255,120,0.30)',
                    textShadow: '0 0 6px rgba(56,255,120,0.60)',
                    padding: '6px 0', cursor: 'pointer', letterSpacing: '0.08em',
                  }}
                >
                  ▶ 保存
                </button>
                <button
                  onClick={() => setOpen(null)}
                  style={{
                    ...STYLE, flex: 1, fontSize: 11, color: '#504870',
                    background: 'rgba(4,2,12,0.90)',
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
