'use client'

import { useState, useEffect } from 'react'

export interface QAItem {
  q: string
  a: string
}

interface QASectionProps {
  items: QAItem[]
}

const STORAGE_KEY = '2pprof_qa'
const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const
const INPUT_STYLE = {
  ...STYLE,
  fontSize: 11,
  color: '#d0c8f0',
  background: 'rgba(4, 2, 12, 0.80)',
  border: '1px solid rgba(64,232,255,0.35)',
  padding: '4px 8px',
  outline: 'none',
  width: '100%',
  resize: 'none' as const,
  lineHeight: '1.7',
}

export default function QASection({ items: defaultItems }: QASectionProps) {
  const [items, setItems] = useState<QAItem[]>(defaultItems)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<QAItem[]>([])

  // localStorageから読み込み
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) setItems(parsed)
      }
    } catch { /* ignore */ }
  }, [])

  function toggle(idx: number) {
    setExpanded((prev) => (prev === idx ? null : idx))
  }

  function openEdit() {
    setDraft(items.map(i => ({ ...i })))
    setEditing(true)
  }

  function save() {
    const filtered = draft.filter(i => i.q.trim())
    setItems(filtered)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    setExpanded(null)
    setEditing(false)
  }

  function changeQ(idx: number, q: string) {
    setDraft(d => d.map((item, i) => i === idx ? { ...item, q } : item))
  }

  function changeA(idx: number, a: string) {
    setDraft(d => d.map((item, i) => i === idx ? { ...item, a } : item))
  }

  function addItem() {
    setDraft(d => [...d, { q: '', a: '' }])
  }

  function removeItem(idx: number) {
    setDraft(d => d.filter((_, i) => i !== idx))
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
            ■ 100の質問 Q&amp;A
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

        {/* Q&A list */}
        <div>
          {items.map((item, idx) => {
            const isOpen = expanded === idx
            const rowBg = idx % 2 === 0 ? 'rgba(8,6,20,0.70)' : 'rgba(12,8,28,0.70)'
            return (
              <div
                key={idx}
                style={{
                  borderBottom: '1px solid rgba(64,232,255,0.10)',
                  borderLeft: isOpen ? '3px solid #38ff78' : '3px solid transparent',
                }}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left cursor-pointer"
                  style={{ ...STYLE, background: isOpen ? 'rgba(16,6,32,0.90)' : rowBg }}
                  aria-expanded={isOpen}
                >
                  <span style={{
                    fontSize: 10, color: '#40e8ff', minWidth: 22, flexShrink: 0,
                    textShadow: '0 0 5px rgba(64,232,255,0.60)', letterSpacing: '0.04em',
                  }}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1 text-xs truncate" style={{
                    color: isOpen ? '#d0c8f0' : '#9888b8', lineHeight: '1.8',
                  }}>
                    {item.q}
                  </span>
                  <span style={{
                    fontSize: 10, flexShrink: 0,
                    color: isOpen ? '#38ff78' : '#ff40c0',
                    textShadow: isOpen
                      ? '0 0 6px rgba(56,255,120,0.70)'
                      : '0 0 6px rgba(255,64,192,0.55)',
                  }}>
                    {isOpen ? '▼' : '▶'}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-3 py-2" style={{
                    background: 'rgba(6,18,8,0.85)',
                    borderTop: '1px solid rgba(56,255,120,0.20)',
                    ...STYLE,
                  }}>
                    <p className="text-xs whitespace-pre-wrap" style={{
                      color: '#38ff78', lineHeight: '1.9',
                      textShadow: '0 0 4px rgba(56,255,120,0.40)',
                      paddingLeft: 26,
                    }}>
                      <span style={{ color: '#38ff7888' }}>{'> '}</span>
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Edit modal ── */}
      {editing && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(4,2,12,0.90)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'flex-start',
            zIndex: 1000, padding: '16px',
            overflowY: 'auto',
          }}
          onClick={(e) => e.target === e.currentTarget && setEditing(false)}
        >
          <div style={{
            background: 'rgba(8,6,20,0.99)',
            border: '3px solid #40e8ff',
            boxShadow: '0 0 24px rgba(64,232,255,0.45)',
            width: '100%', maxWidth: 340,
          }}>
            {/* Title bar */}
            <div style={{
              ...STYLE,
              background: 'linear-gradient(90deg,#18042e 0%,#2e0860 50%,#18042e 100%)',
              borderBottom: '2px solid #40e8ff',
              color: '#40e8ff', fontSize: 13,
              padding: '5px 10px', letterSpacing: '0.10em',
              textShadow: '0 0 8px rgba(64,232,255,0.70)',
            }}>
              ■ Q&A 編集
            </div>

            {/* Item list */}
            <div className="flex flex-col gap-3 p-3">
              {draft.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    borderLeft: '2px solid rgba(64,232,255,0.30)',
                    paddingLeft: 8,
                  }}
                >
                  {/* Row number + delete */}
                  <div className="flex items-center justify-between mb-1">
                    <span style={{
                      ...STYLE, fontSize: 10, color: '#40e8ff',
                      textShadow: '0 0 4px rgba(64,232,255,0.50)',
                    }}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <button
                      onClick={() => removeItem(idx)}
                      style={{
                        ...STYLE, fontSize: 9, color: '#ff4060',
                        background: 'transparent', border: 'none',
                        cursor: 'pointer',
                        textShadow: '0 0 4px rgba(255,64,96,0.50)',
                      }}
                    >
                      [削除]
                    </button>
                  </div>

                  {/* Question input */}
                  <input
                    type="text"
                    value={item.q}
                    onChange={e => changeQ(idx, e.target.value)}
                    placeholder="質問"
                    style={{ ...INPUT_STYLE, marginBottom: 4 }}
                  />

                  {/* Answer textarea */}
                  <textarea
                    value={item.a}
                    onChange={e => changeA(idx, e.target.value)}
                    placeholder="回答"
                    rows={2}
                    style={INPUT_STYLE}
                  />
                </div>
              ))}

              {/* Add button */}
              <button
                onClick={addItem}
                style={{
                  ...STYLE, fontSize: 11, color: '#40e8ff',
                  background: 'rgba(4,2,12,0.80)',
                  border: '1px dashed rgba(64,232,255,0.40)',
                  padding: '6px 0', cursor: 'pointer',
                  letterSpacing: '0.08em',
                  textShadow: '0 0 5px rgba(64,232,255,0.40)',
                }}
              >
                ＋ 質問を追加
              </button>
            </div>

            {/* Action buttons – sticky bottom */}
            <div
              className="flex gap-2 px-3 pb-3"
              style={{ borderTop: '1px solid rgba(64,232,255,0.20)', paddingTop: 12 }}
            >
              <button
                onClick={save}
                style={{
                  ...STYLE, flex: 1, fontSize: 11,
                  color: '#38ff78',
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
                onClick={() => setEditing(false)}
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
      )}
    </>
  )
}
