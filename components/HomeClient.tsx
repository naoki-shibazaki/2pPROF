'use client'

import { useState, useEffect, useCallback } from 'react'
import PixelBackground from '@/components/PixelBackground'
import PixelWindow from '@/components/PixelWindow'
import PixelTabBar, { type Tab, type NotifCounts } from '@/components/PixelTabBar'
import MyProfile from '@/components/MyProfile'
import FriendsTab from '@/components/FriendsTab'
import OthersTab from '@/components/OthersTab'
import HitokotoTab from '@/components/HitokotoTab'
import NotifPanel from '@/components/NotifPanel'
import SettingsPanel from '@/components/SettingsPanel'
import SharePanel from '@/components/SharePanel'

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

export default function HomeClient({ demo }: { demo?: boolean }) {
  const [activeTab, setActiveTab] = useState<Tab>('my')
  const [notifCounts, setNotifCounts] = useState<NotifCounts>({ hitokoto: 0, friends: 0, others: 0 })
  // ヘッダーのドロップダウンは同時に1つだけ開く
  const [openPanel, setOpenPanel] = useState<'notif' | 'share' | 'settings' | null>(null)
  const togglePanel = (p: 'notif' | 'share' | 'settings') => setOpenPanel(cur => (cur === p ? null : p))
  const closePanel = () => setOpenPanel(null)

  const totalUnread = notifCounts.hitokoto + notifCounts.friends + notifCounts.others

  useEffect(() => {
    if (demo) return
    fetch('/api/notifications')
      .then(r => r.json())
      .then(data => setNotifCounts({
        hitokoto: data?.hitokoto ?? 0,
        friends:  data?.friends  ?? 0,
        others:   data?.others   ?? 0,
      }))
      .catch(() => {})
  }, [demo])

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab)
    setOpenPanel(null)
    const tabsWithNotifs: Tab[] = ['hitokoto', 'friends', 'others']
    if (tabsWithNotifs.includes(tab)) {
      setNotifCounts(prev => ({ ...prev, [tab]: 0 }))
      if (demo) return
      fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tab }),
      }).catch(() => {})
    }
  }, [demo])

  const iconButton = (active: boolean) => ({
    ...STYLE,
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 13, lineHeight: 1, padding: '2px 4px',
    opacity: active ? 1 : 0.75,
  })

  const headerButtons = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <div style={{ position: 'relative' }}>
        <button
          aria-label="通知"
          onClick={() => togglePanel('notif')}
          style={iconButton(openPanel === 'notif')}
        >
          🔔
        </button>
        {totalUnread > 0 && openPanel !== 'notif' && (
          <span style={{
            position: 'absolute', top: 0, right: 0,
            width: 7, height: 7, borderRadius: '50%',
            background: '#ff3040',
            boxShadow: '0 0 4px rgba(255,48,64,0.9)',
          }} />
        )}
      </div>
      <button
        aria-label="シェア"
        onClick={() => togglePanel('share')}
        style={iconButton(openPanel === 'share')}
      >
        🔗
      </button>
      <button
        aria-label="設定"
        onClick={() => togglePanel('settings')}
        style={iconButton(openPanel === 'settings')}
      >
        ⚙️
      </button>
    </div>
  )

  return (
    <div className="relative min-h-dvh">
      <PixelBackground />
      <main
        className="relative z-10 flex justify-center items-start min-h-dvh px-3 py-10"
        role="main"
      >
        <PixelWindow rightSlot={headerButtons}>
          <div style={{ position: 'relative' }}>
            <PixelTabBar activeTab={activeTab} onTabChange={handleTabChange} notifCounts={notifCounts} />
            <NotifPanel
              open={openPanel === 'notif'}
              onClose={closePanel}
              hasUnread={totalUnread > 0}
              onMarkAllRead={() => setNotifCounts({ hitokoto: 0, friends: 0, others: 0 })}
              onTabChange={tab => { closePanel(); handleTabChange(tab) }}
            />
            <SharePanel open={openPanel === 'share'} onClose={closePanel} demo={demo} />
            <SettingsPanel open={openPanel === 'settings'} onClose={closePanel} demo={demo} />
          </div>
          {activeTab === 'my' ? <MyProfile demo={demo} /> : activeTab === 'hitokoto' ? <HitokotoTab hasNotif={notifCounts.hitokoto > 0} demo={demo} /> : activeTab === 'friends' ? <FriendsTab onCountChange={() => {}} hasNotif={notifCounts.friends > 0} demo={demo} /> : <OthersTab hasNotif={notifCounts.others > 0} demo={demo} />}
          <div className="pixel-statusbar">
            友達と紹介しあおう！
          </div>
        </PixelWindow>
      </main>
    </div>
  )
}
