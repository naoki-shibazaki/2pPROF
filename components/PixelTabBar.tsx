'use client'

export type Tab = 'my' | 'others'

interface PixelTabBarProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'my',     label: '自分',  icon: '▶' },
  { id: 'others', label: '他人',  icon: '♡' },
]

/**
 * Pixel-art tab switcher.
 * Active tab: white background, no bottom border (visually "open" into the window).
 * Inactive tab: muted blue-grey, sits below the active tab.
 */
export default function PixelTabBar({ activeTab, onTabChange }: PixelTabBarProps) {
  return (
    <div className="pixel-tabbar">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`pixel-tab ${
            activeTab === tab.id ? 'pixel-tab--active' : 'pixel-tab--inactive'
          }`}
          aria-selected={activeTab === tab.id}
          role="tab"
        >
          {tab.icon} {tab.label}
        </button>
      ))}
    </div>
  )
}
