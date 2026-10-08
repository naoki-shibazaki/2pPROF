'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { signOut } from 'next-auth/react'
import QRModal from './QRModal'
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

export default function MyProfile({ demo }: { demo?: boolean }) {
  const [user, setUser] = useState<UserProfile | null>(null)


  const [name, setName] = useState<string | null>(null)
  const [editingName, setEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState('')
  const nameInputRef = useRef<HTMLInputElement>(null)

  const maxHP = 100
  const [currentHP, setCurrentHP] = useState(maxHP)

  const [showQR, setShowQR] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)
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
        hp: 72,
        proximity_count: 5,
        proximity_mode: 'all',
        following_count: 12,
        followers_count: 128,
      })
      setName(profileData.name)
      setNameDraft(profileData.name)
      setCurrentHP(72)
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
        if (u.hp !== null && u.hp !== undefined) setCurrentHP(Math.min(u.hp, 100))
      })


    // Geolocation polling every 30s
    let intervalId: ReturnType<typeof setInterval> | null = null

    function sendLocation(lat: number, lng: number) {
      fetch('/api/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng }),
      }).catch(() => {})
    }

    function startTracking() {
      navigator.geolocation.getCurrentPosition(
        pos => sendLocation(pos.coords.latitude, pos.coords.longitude),
        () => {},
        { enableHighAccuracy: true, timeout: 8000 }
      )
      intervalId = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          pos => sendLocation(pos.coords.latitude, pos.coords.longitude),
          () => {},
          { enableHighAccuracy: true, timeout: 8000 }
        )
      }, 30000)
    }

    if ('geolocation' in navigator) startTracking()

    // Battery → HP sync
    type BatteryManager = { level: number }
    if ('getBattery' in navigator) {
      ;(navigator as Navigator & { getBattery: () => Promise<BatteryManager> })
        .getBattery()
        .then(battery => {
          const hp = Math.round(battery.level * maxHP)
          setCurrentHP(hp)
          fetch('/api/user/profile', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ hp }),
          }).catch(() => {})
        })
        .catch(() => {})
    }

    return () => { if (intervalId) clearInterval(intervalId) }
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
    <div className="overflow-y-auto" style={{ background: 'transparent', maxHeight: 'calc(100dvh - 180px)' }}>
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
        <p className="text-xs -mt-2" style={{ ...STYLE, color: '#604878' }}>
          @{user?.handle ?? ''}
        </p>

        {/* フォロー / フォロワー */}
        {user?.handle && (
          <div style={{ display: 'flex', gap: 20, marginTop: 2 }}>
            <button
              onClick={() => setFollowListType('following')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, padding: 0 }}
            >
              <span style={{ ...STYLE, fontSize: 16, color: '#d0c8f0', lineHeight: 1 }}>{user.following_count ?? 0}</span>
              <span style={{ ...STYLE, fontSize: 8, color: '#604878' }}>フォロー</span>
            </button>
            <button
              onClick={() => setFollowListType('followers')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, padding: 0 }}
            >
              <span style={{ ...STYLE, fontSize: 16, color: '#d0c8f0', lineHeight: 1 }}>{user.followers_count ?? 0}</span>
              <span style={{ ...STYLE, fontSize: 8, color: '#604878' }}>フォロワー</span>
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

      {/* ── シェア系ボタン ── */}
      {user?.handle && (
        <div className="px-4 py-2 flex flex-col gap-2" style={{ borderBottom: '1px solid rgba(64,232,255,0.15)' }}>
          {/* 1行目: QR + シェア */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowQR(true)}
              style={{
                ...STYLE, flex: 1, fontSize: 10, color: '#ff40c0',
                background: 'rgba(8,6,20,0.92)',
                border: '1px solid rgba(255,64,192,0.45)',
                padding: '5px 0', cursor: 'pointer', letterSpacing: '0.06em',
              }}
            >
              📱 QRコード
            </button>
            <button
              onClick={async () => {
                const url = `${window.location.origin}/profile/${user.handle}`
                if (navigator.share) {
                  await navigator.share({ title: `${user.name ?? user.handle} のプロフ`, url })
                } else {
                  await navigator.clipboard.writeText(url).catch(() => {})
                  setShareCopied(true)
                  setTimeout(() => setShareCopied(false), 2500)
                }
              }}
              style={{
                ...STYLE, flex: 1, fontSize: 10,
                color: shareCopied ? '#38ff78' : '#ffd700',
                background: 'rgba(8,6,20,0.92)',
                border: `1px solid ${shareCopied ? 'rgba(56,255,120,0.50)' : 'rgba(255,215,0,0.45)'}`,
                padding: '5px 0', cursor: 'pointer', letterSpacing: '0.06em',
              }}
            >
              {shareCopied ? '✓ コピー完了' : '🔗 プロフをシェア'}
            </button>
          </div>
        </div>
      )}
      {showQR && user?.handle && (
        <QRModal
          url={`${typeof window !== 'undefined' ? window.location.origin : ''}/profile/${user.handle}`}
          name={user.name ?? user.handle}
          onClose={() => setShowQR(false)}
        />
      )}
      {followListType && user?.handle && (
        <FollowListModal
          handle={user.handle}
          type={followListType}
          onClose={() => setFollowListType(null)}
        />
      )}

      {/* ── 招待リンク ── */}
      <InviteButton />

      {/* ── Bio ── */}
      {user?.bio && (
        <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(64,232,255,0.15)' }}>
          <h3 className="text-xs font-bold mb-2" style={{ ...STYLE, color: '#40e8ff', letterSpacing: '0.08em', textShadow: '0 0 6px rgba(64,232,255,0.60)' }}>
            ■ じこしょうかい
          </h3>
          <p className="text-xs whitespace-pre-line" style={{ ...STYLE, color: '#b0a8d0', lineHeight: '2.1' }}>
            {user.bio}
          </p>
        </div>
      )}



      {/* ── Hex Status ── */}
      <HexStatus />
      <LevelBadge />

      {/* ── Q&A ── */}
      <QASection items={[]} />

      {/* ── ログアウト ── */}
      <div className="px-4 py-4 flex justify-center" style={{ borderTop: '1px solid rgba(255,64,192,0.10)' }}>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          style={{
            ...STYLE, fontSize: 9, color: '#403860',
            background: 'transparent',
            border: '1px solid rgba(64,56,96,0.35)',
            padding: '4px 16px', cursor: 'pointer', letterSpacing: '0.08em',
          }}
        >
          ログアウト
        </button>
      </div>
    </div>
  )
}

function InviteButton() {
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

  const generate = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/invite', { method: 'POST' })
    const data = await res.json()
    if (data.token) {
      const url = `${window.location.origin}/invite/${data.token}`
      await navigator.clipboard.writeText(url).catch(() => {})
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }
    setLoading(false)
  }, [])

  return (
    <div className="px-4 py-2 flex justify-center" style={{ borderBottom: '1px solid rgba(64,232,255,0.15)' }}>
      <button
        onClick={generate}
        disabled={loading}
        style={{
          ...STYLE, fontSize: 10,
          color: copied ? '#38ff78' : '#ffd700',
          background: 'rgba(8,6,20,0.92)',
          border: `1px solid ${copied ? 'rgba(56,255,120,0.50)' : 'rgba(255,215,0,0.50)'}`,
          padding: '5px 16px', cursor: loading ? 'default' : 'pointer',
          opacity: loading ? 0.6 : 1, letterSpacing: '0.08em',
        }}
      >
        {copied ? '✓ コピーしました！' : loading ? '生成中...' : '🔗 招待リンクを作成'}
      </button>
    </div>
  )
}
