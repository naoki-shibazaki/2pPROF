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

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

export default function HomeClient() {
  const [activeTab, setActiveTab] = useState<Tab>('my')
  const [notifCounts, setNotifCounts] = useState<NotifCounts>({ hitokoto: 0, friends: 0, others: 0 })
  const [panelOpen, setPanelOpen] = useState(false)

  const totalUnread = notifCounts.hitokoto + notifCounts.friends + notifCounts.others

  useEffect(() => {
    fetch('/api/notifications')
      .then(r => r.json())
      .then(data => setNotifCounts({
        hitokoto: data?.hitokoto ?? 0,
        friends:  data?.friends  ?? 0,
        others:   data?.others   ?? 0,
      }))
      .catch(() => {})
  }, [])

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab)
    setPanelOpen(false)
    const tabsWithNotifs: Tab[] = ['hitokoto', 'friends', 'others']
    if (tabsWithNotifs.includes(tab)) {
      setNotifCounts(prev => ({ ...prev, [tab]: 0 }))
      fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tab }),
      }).catch(() => {})
    }
  }, [])

  const bellButton = (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setPanelOpen(v => !v)}
        style={{
          ...STYLE,
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 13, lineHeight: 1, padding: '2px 4px',
          opacity: panelOpen ? 1 : 0.75,
        }}
      >
        🔔
      </button>
      {totalUnread > 0 && !panelOpen && (
        <span style={{
          position: 'absolute', top: 0, right: 0,
          width: 7, height: 7, borderRadius: '50%',
          background: '#ff3040',
          boxShadow: '0 0 4px rgba(255,48,64,0.9)',
        }} />
      )}
    </div>
  )

  return (
    <div className="relative min-h-dvh">
      <PixelBackground />
      <main
        className="relative z-10 flex justify-center items-start min-h-dvh px-3 py-10"
        role="main"
      >
        <PixelWindow rightSlot={bellButton}>
          <div style={{ position: 'relative' }}>
            <PixelTabBar activeTab={activeTab} onTabChange={handleTabChange} notifCounts={notifCounts} />
            <NotifPanel
              open={panelOpen}
              onClose={() => setPanelOpen(false)}
              hasUnread={totalUnread > 0}
              onMarkAllRead={() => setNotifCounts({ hitokoto: 0, friends: 0, others: 0 })}
              onTabChange={tab => { setPanelOpen(false); handleTabChange(tab) }}
            />
          </div>
          {activeTab === 'my' ? <MyProfile /> : activeTab === 'hitokoto' ? <HitokotoTab hasNotif={notifCounts.hitokoto > 0} /> : activeTab === 'friends' ? <FriendsTab onCountChange={() => {}} hasNotif={notifCounts.friends > 0} /> : <OthersTab hasNotif={notifCounts.others > 0} />}
          <div className="pixel-statusbar">
            友達と紹介しあおう！
          </div>
        </PixelWindow>
      </main>
    </div>
  )
}
