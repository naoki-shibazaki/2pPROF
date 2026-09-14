'use client'

import { useState, useEffect, useRef } from 'react'
import AvatarUploader from './AvatarUploader'
import QASection from './QASection'
import HexStatus from './HexStatus'
import LevelBadge from './LevelBadge'
import PersonalityBadges from './PersonalityBadges'
import { profileData } from '@/data/profileData'

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const
const STATUS_KEY = '2pprof_status'

function StatBar({ label, color, fill, current, max }: {
  label: string; color: string; fill: number; current: number; max: number
}) {
  return (
    <div className="flex items-center gap-2">
      <span style={{ ...STYLE, fontSize: 10, color, minWidth: 30, textShadow: `0 0 5px ${color}`, letterSpacing: '0.05em' }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', border: `1px solid ${color}44` }}>
        <div style={{ width: `${fill * 100}%`, height: '100%', background: color, boxShadow: `0 0 6px ${color}` }} />
      </div>
      <span style={{ ...STYLE, fontSize: 9, color, minWidth: 60, textAlign: 'right', opacity: 0.85 }}>
        {current} / {max}
      </span>
    </div>
  )
}

export default function MyProfile() {
  const [status, setStatus] = useState(profileData.status)
  const [editingStatus, setEditingStatus] = useState(false)
  const [draft, setDraft] = useState(profileData.status)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem(STATUS_KEY)
    if (saved) { setStatus(saved); setDraft(saved) }
  }, [])

  useEffect(() => {
    if (editingStatus) inputRef.current?.focus()
  }, [editingStatus])

  function startEdit() {
    setDraft(status)
    setEditingStatus(true)
  }

  function commit() {
    const trimmed = draft.trim() || profileData.status
    setStatus(trimmed)
    localStorage.setItem(STATUS_KEY, trimmed)
    setEditingStatus(false)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') commit()
    if (e.key === 'Escape') setEditingStatus(false)
  }

  return (
    <div className="overflow-y-auto" style={{ background: 'transparent', maxHeight: 'calc(100dvh - 180px)' }}>
      {/* ── Header ── */}
      <div
        className="flex flex-col items-center py-5 px-4 gap-3"
        style={{ borderBottom: '1px solid rgba(255,64,192,0.30)', background: 'rgba(14,6,32,0.60)' }}
      >
        <AvatarUploader />
        <LevelBadge />

        <h1 className="text-xl font-bold" style={{ ...STYLE, color: '#d0c8f0', letterSpacing: '0.15em', textShadow: '0 0 10px rgba(208,200,240,0.35)' }}>
          {profileData.name}
        </h1>
        <p className="text-xs -mt-2" style={{ ...STYLE, color: '#604878' }}>
          @{profileData.handle}
        </p>

        {/* Personality badges */}
        <PersonalityBadges />

        {/* HP bar */}
        <div className="w-full flex flex-col gap-1.5 mt-1">
          <StatBar label="HP" color="#ff40c0" fill={1} current={profileData.level * 10} max={profileData.level * 10} />
        </div>

        {/* Status message – タップで編集 */}
        {editingStatus ? (
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={onKeyDown}
            maxLength={60}
            className="text-xs px-4 py-2 text-center w-full"
            style={{
              ...STYLE,
              color: '#38ff78',
              background: 'rgba(4,2,12,0.90)',
              border: '1px solid #38ff78',
              boxShadow: '0 0 8px rgba(56,255,120,0.35)',
              lineHeight: '1.9',
              outline: 'none',
            }}
          />
        ) : (
          <button
            onClick={startEdit}
            className="text-xs px-4 py-2 text-center w-full"
            style={{
              ...STYLE,
              color: '#38ff78',
              background: 'rgba(4,2,12,0.75)',
              border: '1px solid rgba(56,255,120,0.28)',
              lineHeight: '1.9',
              textShadow: '0 0 7px rgba(56,255,120,0.55)',
              cursor: 'text',
            }}
          >
            ▶ {status}
          </button>
        )}
      </div>

      {/* ── Bio ── */}
      <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(64,232,255,0.15)' }}>
        <h3 className="text-xs font-bold mb-2" style={{ ...STYLE, color: '#40e8ff', letterSpacing: '0.08em', textShadow: '0 0 6px rgba(64,232,255,0.60)' }}>
          ■ じこしょうかい
        </h3>
        <p className="text-xs whitespace-pre-line" style={{ ...STYLE, color: '#b0a8d0', lineHeight: '2.1' }}>
          {profileData.bio}
        </p>
      </div>

      {/* ── Stats ── */}
      <div className="flex justify-around px-4 py-3" style={{ background: 'rgba(4,2,12,0.55)', borderBottom: '1px solid rgba(255,64,192,0.18)' }}>
        {profileData.stats.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-0.5">
            <span className="text-base font-bold" style={{ ...STYLE, color: '#ffd700', textShadow: '0 0 8px rgba(255,215,0,0.55)' }}>
              {s.value}
            </span>
            <span className="text-xs" style={{ ...STYLE, color: '#504470', fontSize: 10 }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Hex Status ── */}
      <HexStatus />

      {/* ── Q&A ── */}
      <QASection items={profileData.qa} />
    </div>
  )
}
