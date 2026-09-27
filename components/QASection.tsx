'use client'

import { useState, useEffect } from 'react'
import { qaHash } from '@/lib/qa-hash'

export interface QAItem {
  q: string
  a: string
}

interface QASectionProps {
  items: QAItem[]
}

type FriendQuestion = {
  id: string
  question: string
  answer: string | null
  answered_at: string | null
  created_at: string
  anonymous: boolean
  sender_name: string | null
  sender_handle: string | null
}

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

type TabType = 'self' | 'friends'

type PendingComment = {
  id: string
  question_hash: string
  body: string
  created_at: string
  author_name: string | null
  author_handle: string | null
}

export default function QASection({ items: defaultItems }: QASectionProps) {
  const [activeTab, setActiveTab] = useState<TabType>('self')

  // Self Q&A
  const [items, setItems] = useState<QAItem[]>(defaultItems)
  const [qaLoaded, setQaLoaded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<QAItem[]>([])

  // Pending comments (承認待ち)
  const [pendingComments, setPendingComments] = useState<PendingComment[]>([])
  const [expandedHashes, setExpandedHashes] = useState<Set<string>>(new Set())

  // Friend Q&A
  const [friendQs, setFriendQs] = useState<FriendQuestion[]>([])
  const [answerDrafts, setAnswerDrafts] = useState<Record<string, string>>({})
  const [answering, setAnswering] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)

  // Load self Q&A from DB
  useEffect(() => {
    fetch('/api/qa/self')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (Array.isArray(data)) setItems(data)
        setQaLoaded(true)
      })
      .catch(() => setQaLoaded(true))
  }, [])

  // Load pending comments
  useEffect(() => {
    fetch('/api/qa-comments/pending')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setPendingComments(data) })
      .catch(() => {})
  }, [])

  async function handleCommentAction(id: string, status: 'approved' | 'rejected') {
    const res = await fetch(`/api/qa-comments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      setPendingComments(prev => prev.filter(c => c.id !== id))
    }
  }

  function toggleHashExpand(hash: string) {
    setExpandedHashes(prev => {
      const next = new Set(prev)
      if (next.has(hash)) next.delete(hash)
      else next.add(hash)
      return next
    })
  }

  useEffect(() => {
    fetch('/api/qa')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setFriendQs(data)
          setUnreadCount(data.filter((q: FriendQuestion) => !q.answer).length)
        }
      })
      .catch(() => {})
  }, [])

  function openEdit() { setDraft(items.map(i => ({ ...i }))); setEditing(true) }
  function save() {
    const filtered = draft.filter(i => i.q.trim())
    setItems(filtered)
    setEditing(false)
    fetch('/api/qa/self', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: filtered }),
    }).catch(() => {})
  }
  function changeQ(idx: number, q: string) { setDraft(d => d.map((item, i) => i === idx ? { ...item, q } : item)) }
  function changeA(idx: number, a: string) { setDraft(d => d.map((item, i) => i === idx ? { ...item, a } : item)) }
  function addItem() { setDraft(d => [...d, { q: '', a: '' }]) }
  function removeItem(idx: number) { setDraft(d => d.filter((_, i) => i !== idx)) }

  async function submitAnswer(id: string) {
    const answer = answerDrafts[id]?.trim()
    if (!answer) return
    setAnswering(id)
    const res = await fetch(`/api/qa/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer }),
    })
    if (res.ok) {
      setFriendQs(prev => prev.map(q => q.id === id ? { ...q, answer, answered_at: new Date().toISOString() } : q))
      setUnreadCount(n => Math.max(0, n - 1))
      setAnswerDrafts(d => { const nd = { ...d }; delete nd[id]; return nd })
    }
    setAnswering(null)
  }

  async function dismissQuestion(id: string) {
    await fetch(`/api/qa/${id}`, { method: 'DELETE' })
    setFriendQs(prev => {
      const q = prev.find(q => q.id === id)
      if (q && !q.answer) setUnreadCount(n => Math.max(0, n - 1))
      return prev.filter(q => q.id !== id)
    })
  }

  return (
    <>
      <section>
        {/* Tab header */}
        <div style={{
          background: 'rgba(4,10,22,0.85)',
          borderTop: '1px solid rgba(64,232,255,0.38)',
          borderBottom: '1px solid rgba(64,232,255,0.38)',
        }}>
          <div className="flex">
            {(['self', 'friends'] as TabType[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  ...STYLE, flex: 1, fontSize: 10,
                  padding: '6px 4px',
                  cursor: 'pointer',
                  letterSpacing: '0.06em',
                  color: activeTab === tab ? '#40e8ff' : '#504870',
                  background: activeTab === tab ? 'rgba(64,232,255,0.08)' : 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab ? '2px solid #40e8ff' : '2px solid transparent',
                  textShadow: activeTab === tab ? '0 0 6px rgba(64,232,255,0.60)' : 'none',
                }}
              >
                {tab === 'self'
                  ? `■ 自分の回答${pendingComments.length > 0 ? ` [${pendingComments.length}]` : ''}`
                  : `友達からの質問${unreadCount > 0 ? ` (${unreadCount})` : ''}`}
              </button>
            ))}
            {activeTab === 'self' && (
              <button
                onClick={openEdit}
                style={{
                  ...STYLE, fontSize: 10, color: '#ffd700',
                  background: 'transparent', border: 'none',
                  borderBottom: '2px solid transparent',
                  padding: '6px 10px', cursor: 'pointer',
                  textShadow: '0 0 5px rgba(255,215,0,0.50)',
                }}
              >
                [編集]
              </button>
            )}
          </div>
        </div>

        {/* Self Q&A list */}
        {activeTab === 'self' && (() => {
          const answered = items.filter(item => item.a.trim() !== '')
          return (
            <div>
              {answered.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-10">
                  <span style={{ fontSize: 28 }}>📝</span>
                  <p style={{ ...STYLE, fontSize: 10, color: '#504870', textAlign: 'center', lineHeight: 2 }}>
                    まだ回答がありません<br />[編集] から回答を入力しましょう
                  </p>
                </div>
              ) : (
                answered.map((item, idx) => {
                  const rowBg = idx % 2 === 0 ? 'rgba(8,6,20,0.70)' : 'rgba(12,8,28,0.70)'
                  const hash = qaHash(item.q)
                  const itemPending = pendingComments.filter(c => c.question_hash === hash)
                  const isExpanded = expandedHashes.has(hash)
                  return (
                    <div key={idx} style={{
                      borderBottom: '1px solid rgba(64,232,255,0.10)',
                      borderLeft: '3px solid #38ff78',
                      background: rowBg,
                    }}>
                      <div style={{ padding: '8px 12px 10px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 5 }}>
                          <span style={{ fontSize: 10, color: '#40e8ff', minWidth: 22, flexShrink: 0, paddingTop: 1 }}>
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <p style={{ ...STYLE, fontSize: 11, color: '#9888b8', margin: 0, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                            {item.q}
                          </p>
                        </div>
                        <div style={{ paddingLeft: 30 }}>
                          <p style={{ ...STYLE, fontSize: 11, color: '#38ff78', lineHeight: 1.9, whiteSpace: 'pre-wrap', margin: 0 }}>
                            <span style={{ color: '#38ff7888' }}>{'> '}</span>{item.a}
                          </p>
                        </div>
                        {/* Pending comments badge */}
                        {itemPending.length > 0 && (
                          <button
                            onClick={() => toggleHashExpand(hash)}
                            style={{ ...STYLE, fontSize: 9, color: '#ff8830', background: 'rgba(255,136,48,0.10)', border: '1px solid rgba(255,136,48,0.35)', padding: '2px 8px', cursor: 'pointer', marginTop: 6, marginLeft: 30 }}
                          >
                            💬 承認待ち {itemPending.length}件 {isExpanded ? '▲' : '▼'}
                          </button>
                        )}
                      </div>

                      {/* Pending approval panel */}
                      {isExpanded && itemPending.length > 0 && (
                        <div style={{ borderTop: '1px solid rgba(255,136,48,0.20)', background: 'rgba(4,2,12,0.60)', padding: '8px 12px' }}>
                          {itemPending.map(c => (
                            <div key={c.id} style={{ borderLeft: '2px solid rgba(255,136,48,0.35)', paddingLeft: 8, marginBottom: 8 }}>
                              <p style={{ ...STYLE, fontSize: 10, color: '#d0c8f0', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>{c.body}</p>
                              <p style={{ ...STYLE, fontSize: 8, color: '#504870', marginTop: 2 }}>from @{c.author_handle ?? '?'}{c.author_name ? ` (${c.author_name})` : ''}</p>
                              <div style={{ display: 'flex', gap: 6, marginTop: 5 }}>
                                <button
                                  onClick={() => handleCommentAction(c.id, 'approved')}
                                  style={{ ...STYLE, fontSize: 9, color: '#38ff78', background: 'rgba(4,2,12,0.90)', border: '1px solid rgba(56,255,120,0.40)', padding: '3px 10px', cursor: 'pointer' }}
                                >
                                  ✓ 承認
                                </button>
                                <button
                                  onClick={() => handleCommentAction(c.id, 'rejected')}
                                  style={{ ...STYLE, fontSize: 9, color: '#ff4060', background: 'rgba(4,2,12,0.90)', border: '1px solid rgba(255,64,96,0.40)', padding: '3px 10px', cursor: 'pointer' }}
                                >
                                  ✕ 却下
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          )
        })()}

        {/* Friend questions */}
        {activeTab === 'friends' && (
          <div className="flex flex-col">
            {friendQs.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-10">
                <span style={{ fontSize: 28 }}>💬</span>
                <p style={{ ...STYLE, fontSize: 10, color: '#504870', textAlign: 'center', lineHeight: 2 }}>
                  まだ質問が届いていません<br />友達のプロフィールから質問を送れます
                </p>
              </div>
            ) : (
              friendQs.map(fq => (
                <div key={fq.id} style={{
                  borderBottom: '1px solid rgba(255,64,192,0.12)',
                  background: fq.answer ? 'rgba(4,2,12,0.40)' : 'rgba(14,6,32,0.60)',
                  borderLeft: fq.answer ? '3px solid transparent' : '3px solid #ff40c0',
                }}>
                  <div className="px-3 pt-3 pb-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p style={{ ...STYLE, fontSize: 11, color: '#d0c8f0', lineHeight: 1.8 }}>{fq.question}</p>
                        <p style={{ ...STYLE, fontSize: 8, color: '#504870', marginTop: 2 }}>
                          {fq.anonymous
                            ? '👤 匿名'
                            : `from @${fq.sender_handle ?? '?'}${fq.sender_name ? ` (${fq.sender_name})` : ''}`}
                        </p>
                      </div>
                      <button
                        onClick={() => dismissQuestion(fq.id)}
                        style={{ ...STYLE, fontSize: 8, color: '#403860', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}
                      >
                        ✕
                      </button>
                    </div>

                    {fq.answer ? (
                      <p style={{ ...STYLE, fontSize: 11, color: '#38ff78', lineHeight: 1.9, marginTop: 6, paddingLeft: 8, borderLeft: '2px solid rgba(56,255,120,0.30)' }}>
                        {'> '}{fq.answer}
                      </p>
                    ) : (
                      <div className="flex gap-2 mt-2 mb-1">
                        <input
                          type="text"
                          value={answerDrafts[fq.id] ?? ''}
                          onChange={e => setAnswerDrafts(d => ({ ...d, [fq.id]: e.target.value }))}
                          onKeyDown={e => e.key === 'Enter' && submitAnswer(fq.id)}
                          placeholder="回答を入力..."
                          style={{ ...INPUT_STYLE, flex: 1, fontSize: 11 }}
                        />
                        <button
                          onClick={() => submitAnswer(fq.id)}
                          disabled={answering === fq.id}
                          style={{
                            ...STYLE, fontSize: 9, color: '#38ff78',
                            background: 'rgba(4,2,12,0.90)',
                            border: '1px solid rgba(56,255,120,0.50)',
                            padding: '4px 10px', cursor: 'pointer',
                            opacity: answering === fq.id ? 0.5 : 1,
                            flexShrink: 0,
                          }}
                        >
                          送信
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {/* Edit modal */}
      {editing && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(4,2,12,0.90)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', zIndex: 1000, padding: '16px', overflowY: 'auto' }}
          onClick={(e) => e.target === e.currentTarget && setEditing(false)}
        >
          <div style={{ background: 'rgba(8,6,20,0.99)', border: '3px solid #40e8ff', boxShadow: '0 0 24px rgba(64,232,255,0.45)', width: '100%', maxWidth: 340 }}>
            <div style={{ ...STYLE, background: 'linear-gradient(90deg,#18042e 0%,#2e0860 50%,#18042e 100%)', borderBottom: '2px solid #40e8ff', color: '#40e8ff', fontSize: 13, padding: '5px 10px', letterSpacing: '0.10em', textShadow: '0 0 8px rgba(64,232,255,0.70)' }}>
              ■ Q&A 編集
            </div>
            <div className="flex flex-col gap-3 p-3">
              {draft.map((item, idx) => (
                <div key={idx} style={{ borderLeft: '2px solid rgba(64,232,255,0.30)', paddingLeft: 8 }}>
                  <div className="flex items-center justify-between mb-1">
                    <span style={{ ...STYLE, fontSize: 10, color: '#40e8ff', textShadow: '0 0 4px rgba(64,232,255,0.50)' }}>{String(idx + 1).padStart(2, '0')}</span>
                    <button onClick={() => removeItem(idx)} style={{ ...STYLE, fontSize: 9, color: '#ff4060', background: 'transparent', border: 'none', cursor: 'pointer' }}>[削除]</button>
                  </div>
                  <input type="text" value={item.q} onChange={e => changeQ(idx, e.target.value)} placeholder="質問" style={{ ...INPUT_STYLE, marginBottom: 4 }} />
                  <textarea value={item.a} onChange={e => changeA(idx, e.target.value)} placeholder="回答" rows={2} style={INPUT_STYLE} />
                </div>
              ))}
              <button onClick={addItem} style={{ ...STYLE, fontSize: 11, color: '#40e8ff', background: 'rgba(4,2,12,0.80)', border: '1px dashed rgba(64,232,255,0.40)', padding: '6px 0', cursor: 'pointer', letterSpacing: '0.08em', textShadow: '0 0 5px rgba(64,232,255,0.40)' }}>
                ＋ 質問を追加
              </button>
            </div>
            <div className="flex gap-2 px-3 pb-3" style={{ borderTop: '1px solid rgba(64,232,255,0.20)', paddingTop: 12 }}>
              <button onClick={save} style={{ ...STYLE, flex: 1, fontSize: 11, color: '#38ff78', background: 'rgba(4,2,12,0.90)', border: '2px solid #38ff78', boxShadow: '0 0 8px rgba(56,255,120,0.30)', textShadow: '0 0 6px rgba(56,255,120,0.60)', padding: '6px 0', cursor: 'pointer', letterSpacing: '0.08em' }}>▶ 保存</button>
              <button onClick={() => setEditing(false)} style={{ ...STYLE, flex: 1, fontSize: 11, color: '#504870', background: 'rgba(4,2,12,0.90)', border: '1px solid rgba(80,72,112,0.40)', padding: '6px 0', cursor: 'pointer', letterSpacing: '0.08em' }}>キャンセル</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
