'use client'

import PixelIcon, { type PixelIconName } from './PixelIcon'

export type Tab = 'my' | 'friends' | 'others' | 'hitokoto'

export type NotifCounts = { hitokoto: number; friends: number; others: number }

interface PixelTabBarProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  notifCounts?: NotifCounts
}

function Badge({ count }: { count: number }) {
  if (!count) return null
  return (
    <span style={{
      position: 'absolute', top: -5, left: '50%', marginLeft: 6,
      minWidth: 16, height: 16,
      background: '#ff3040',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 11, fontFamily: 'var(--font-pixel, monospace)',
      color: '#fff', zIndex: 10,
      boxShadow: '0 0 5px rgba(255,48,64,0.90)',
      border: '1px solid #04020c',
      lineHeight: 1, padding: '0 3px',
    }}>
      {count > 99 ? '99+' : count}
    </span>
  )
}

// 画面の下に置くタブ（親指で押しやすい位置）。アイコン＋名前で、選んでいるタブは光らせる
export default function PixelTabBar({ activeTab, onTabChange, notifCounts }: PixelTabBarProps) {
  const tabs: { id: Tab; label: string; icon: PixelIconName }[] = [
    { id: 'my',       label: 'マイページ', icon: 'person' },
    { id: 'hitokoto', label: 'ひとこと',   icon: 'bubble' },
    { id: 'friends',  label: '友達',       icon: 'friends' },
    { id: 'others',   label: '他己紹介',   icon: 'letter' },
  ]

  const badgeFor: Record<Tab, number> = {
    my:       0,
    hitokoto: notifCounts?.hitokoto ?? 0,
    friends:  notifCounts?.friends  ?? 0,
    others:   notifCounts?.others   ?? 0,
  }

  return (
    <nav className="pixel-bottomnav" role="tablist">
      {tabs.map((tab) => {
        const active = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`pixel-navtab ${active ? 'pixel-navtab--active' : ''}`}
            aria-selected={active}
            role="tab"
          >
            <span style={{ position: 'relative', display: 'block' }}>
              <PixelIcon name={tab.icon} color={active ? '#40e8ff' : '#8a80b0'} size={22} glow={active} />
              <Badge count={badgeFor[tab.id]} />
            </span>
            <span>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
