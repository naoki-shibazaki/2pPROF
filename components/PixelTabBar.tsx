'use client'

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
      position: 'absolute', top: 1, right: 1,
      minWidth: 14, height: 14,
      background: '#ff3040', borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 8, fontFamily: 'var(--font-pixel, monospace)',
      color: '#fff', zIndex: 10,
      boxShadow: '0 0 5px rgba(255,48,64,0.90)',
      lineHeight: 1, padding: '0 2px',
    }}>
      {count > 99 ? '99+' : count}
    </span>
  )
}

export default function PixelTabBar({ activeTab, onTabChange, notifCounts }: PixelTabBarProps) {
  const tabs: { id: Tab; label: string }[] = [
    { id: 'my',       label: 'マイページ' },
    { id: 'hitokoto', label: 'ひとこと' },
    { id: 'friends',  label: '友達' },
    { id: 'others',   label: '他己紹介' },
  ]

  const badgeFor: Record<Tab, number> = {
    my:       0,
    hitokoto: notifCounts?.hitokoto ?? 0,
    friends:  notifCounts?.friends  ?? 0,
    others:   notifCounts?.others   ?? 0,
  }

  return (
    <div className="pixel-tabbar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`pixel-tab ${activeTab === tab.id ? 'pixel-tab--active' : 'pixel-tab--inactive'}`}
          aria-selected={activeTab === tab.id}
          role="tab"
          style={{ position: 'relative' }}
        >
          {tab.label}
          <Badge count={badgeFor[tab.id]} />
        </button>
      ))}
    </div>
  )
}
