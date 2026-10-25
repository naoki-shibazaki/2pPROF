'use client'

import { useState, useEffect, useRef } from 'react'
import { HP_MAX } from '@/lib/hp-max'
import FollowListModal from './FollowListModal'
import AvatarUploader from './AvatarUploader'
import QASection from './QASection'
import HexStatus from './HexStatus'
import LevelBadge from './LevelBadge'
import PersonalityBadges from './PersonalityBadges'
import { profileData } from '@/data/profileData'

type UserProfile = {
  id: string
  name: string | null
  email: string | null
  image: string | null
  handle: string | null
  bio: string | null
  onboarded: boolean
  hp: number | null
  proximity_count: number | null
  proximity_mode: string | null
  following_count: number
  followers_count: number
}

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

function StatBar({ label, color, fill, current, max }: {
  label: string; color: string; fill: number; current: number; max: number
}) {
  return (
    <div className="flex items-center gap-2">
      <span style={{ ...STYLE, fontSize: 13, color, minWidth: 30, textShadow: `0 0 5px ${color}`, letterSpacing: '0.05em' }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', border: `1px solid ${color}44` }}>
        <div style={{ width: `${fill * 100}%`, height: '100%', background: color, boxShadow: `0 0 6px ${color}` }} />
      </div>
      <span style={{ ...STYLE, fontSize: 12, color, minWidth: 60, textAlign: 'right', opacity: 0.85 }}>
        {current} / {max}
      </span>
    </div>
  )
}

export default function MyProfile({ demo }: { demo?: boolean }) {
  const [user, setUser] = useState<UserProfile | null>(null)


  const [name, setName] = useState<string | null>(null)
  const [editingName, setEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState('')
  const nameInputRef = useRef<HTMLInputElement>(null)

  const maxHP = HP_MAX
  const [currentHP, setCurrentHP] = useState(maxHP)

  const [followListType, setFollowListType] = useState<'following' | 'followers' | null>(null)


  useEffect(() => {
    if (demo) {
      setUser({
        id: 'demo',
        name: profileData.name,
        email: null,
        image: null,
        handle: profileData.handle,
        bio: profileData.bio,
        onboarded: true,
        hp: 7,
        proximity_count: 5,
        proximity_mode: 'all',
        following_count: 12,
        followers_count: 128,
      })
      setName(profileData.name)
      setNameDraft(profileData.name)
      setCurrentHP(7)
      return
    }

    fetch('/api/user/me')
      .then(r => r.json())
      .then((u: UserProfile) => {
        if (!u) return
        setUser(u)
        const dbName = u.name ?? null
        setName(dbName)
        setNameDraft(dbName ?? '')
        // HpGate の値と前後しても、1 日の中で HP は減るだけなので小さいほうを採る
        if (u.hp !== null && u.hp !== undefined) setCurrentHP(prev => Math.min(prev, u.hp as number))
      })


    // HP = 今日アプリを開ける残り回数。起動・復帰で減った値を HpGate から受け取る
    const onHp = (e: Event) => setCurrentHP((e as CustomEvent<number>).detail)
    window.addEventListener('hp-update', onHp)
    return () => window.removeEventListener('hp-update', onHp)
  }, [demo, maxHP])


  useEffect(() => {
    if (editingName) nameInputRef.current?.focus()
  }, [editingName])


  function commitName() {
    const trimmed = nameDraft.trim() || name || profileData.name
    setName(trimmed)
    setEditingName(false)
    // DBにも保存
    fetch('/api/user/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: trimmed }),
    })
  }

  function onNameKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') commitName()
    if (e.key === 'Escape') setEditingName(false)
  }


  return (
    <div className="overflow-y-auto" style={{ background: 'transparent', maxHeight: 'calc(100dvh - 205px)' }}>
      {/* ── Header ── */}
      <div
        className="flex flex-col items-center py-5 px-4 gap-3"
        style={{ borderBottom: '1px solid rgba(255,64,192,0.30)', background: 'rgba(14,6,32,0.60)' }}
      >
        <AvatarUploader currentImage={user?.image ?? null} />

        {name === null ? (
          <div style={{ height: 32 }} />
        ) : editingName ? (
          <input
            ref={nameInputRef}
            type="text"
            value={nameDraft}
            onChange={e => setNameDraft(e.target.value)}
            onBlur={commitName}
            onKeyDown={onNameKeyDown}
            maxLength={30}
            className="text-xl font-bold text-center px-2 py-0.5"
            style={{
              ...STYLE,
              color: '#d0c8f0',
              letterSpacing: '0.15em',
              background: 'rgba(4,2,12,0.90)',
              border: '1px solid #d0c8f0',
              boxShadow: '0 0 8px rgba(208,200,240,0.35)',
              outline: 'none',
              width: '100%',
              maxWidth: 240,
            }}
          />
        ) : (
          <button
            onClick={() => { setNameDraft(name); setEditingName(true) }}
            className="text-xl font-bold"
            style={{ ...STYLE, color: '#d0c8f0', letterSpacing: '0.15em', textShadow: '0 0 10px rgba(208,200,240,0.35)', background: 'transparent', border: 'none', cursor: 'text' }}
          >
            {name} ✎
          </button>
        )}
        <p className="text-sm -mt-2" style={{ ...STYLE, color: '#8a7aa8' }}>
          @{user?.handle ?? ''}
        </p>

        {/* フォロー / フォロワー */}
        {user?.handle && (
          <div style={{ display: 'flex', gap: 20, marginTop: 2 }}>
            <button
              onClick={() => setFollowListType('following')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, padding: 0 }}
            >
              <span style={{ ...STYLE, fontSize: 18, color: '#d0c8f0', lineHeight: 1 }}>{user.following_count ?? 0}</span>
              <span style={{ ...STYLE, fontSize: 11, color: '#8a7aa8' }}>フォロー</span>
            </button>
            <button
              onClick={() => setFollowListType('followers')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, padding: 0 }}
            >
              <span style={{ ...STYLE, fontSize: 18, color: '#d0c8f0', lineHeight: 1 }}>{user.followers_count ?? 0}</span>
              <span style={{ ...STYLE, fontSize: 11, color: '#8a7aa8' }}>フォロワー</span>
            </button>
          </div>
        )}

        {/* Personality badges */}
        <PersonalityBadges />

        {/* HP bar */}
        <div className="w-full mt-1">
          <StatBar
            label="HP"
            color="#ff40c0"
            fill={currentHP / maxHP}
            current={currentHP}
            max={maxHP}
          />
        </div>

      </div>

      {followListType && user?.handle && (
        <FollowListModal
          handle={user.handle}
          type={followListType}
          onClose={() => setFollowListType(null)}
        />
      )}

      {/* ── Bio ── */}
      {user?.bio && (
        <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(64,232,255,0.15)' }}>
          <h3 className="text-sm font-bold mb-2" style={{ ...STYLE, color: '#40e8ff', letterSpacing: '0.08em', textShadow: '0 0 6px rgba(64,232,255,0.60)' }}>
            ■ じこしょうかい
          </h3>
          <p className="text-sm whitespace-pre-line" style={{ ...STYLE, color: '#b0a8d0', lineHeight: '2.1' }}>
            {user.bio}
          </p>
        </div>
      )}



      {/* ── Hex Status ── */}
      <HexStatus />
      <LevelBadge />

      {/* ── Q&A ── */}
      <QASection items={demo ? profileData.qa : []} demo={demo} />

    </div>
  )
}
