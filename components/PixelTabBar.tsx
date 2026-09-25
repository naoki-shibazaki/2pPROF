'use client'

export type Tab = 'my' | 'friends' | 'others'

interface PixelTabBarProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  friendCount?: number
}

export default function PixelTabBar({ activeTab, onTabChange, friendCount }: PixelTabBarProps) {
  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'my',      label: 'マイページ',                                    icon: '▶' },
    { id: 'friends', label: `友達${friendCount !== undefined ? `(${friendCount})` : ''}`, icon: '♡' },
    { id: 'others',  label: '他己紹介',                                      icon: '★' },
  ]

  return (
    <div className="pixel-tabbar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`pixel-tab ${
            activeTab === tab.id ? 'pixel-tab--active' : 'pixel-tab--inactive'
          }`}
          aria-selected={activeTab === tab.id}
          role="tab"
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
