'use client'

export type Tab = 'my' | 'friends' | 'others'

interface PixelTabBarProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  friendCount?: number
  notifCount?: number
}

export default function PixelTabBar({ activeTab, onTabChange, friendCount, notifCount }: PixelTabBarProps) {
  const tabs: { id: Tab; label: string }[] = [
    { id: 'my',      label: 'マイページ' },
    { id: 'friends', label: `友達${friendCount !== undefined ? `(${friendCount})` : ''}` },
    { id: 'others',  label: '他己紹介' },
  ]

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
          {tab.id === 'others' && notifCount && notifCount > 0 ? (
            <span style={{
              position: 'absolute', top: 3, right: 3,
              minWidth: 16, height: 16,
              background: '#ff3040', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, fontFamily: 'var(--font-pixel, monospace)',
              color: '#fff', boxShadow: '0 0 6px rgba(255,48,64,0.80)',
              lineHeight: 1, padding: '0 3px',
            }}>
              {notifCount > 99 ? '99+' : notifCount}
            </span>
          ) : null}
        </button>
      ))}
    </div>
  )
}
