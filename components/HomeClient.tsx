'use client'

import { useState, useEffect, useCallback } from 'react'
import PixelBackground from '@/components/PixelBackground'
import PixelWindow from '@/components/PixelWindow'
import PixelTabBar, { type Tab, type NotifCounts } from '@/components/PixelTabBar'
import MyProfile from '@/components/MyProfile'
import FriendsTab from '@/components/FriendsTab'
import OthersTab from '@/components/OthersTab'
import HitokotoTab from '@/components/HitokotoTab'

export default function HomeClient() {
  const [activeTab, setActiveTab] = useState<Tab>('my')
  const [notifCounts, setNotifCounts] = useState<NotifCounts>({ hitokoto: 0, friends: 0, others: 0 })

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

  return (
    <div className="relative min-h-dvh">
      <PixelBackground />
      <main
        className="relative z-10 flex justify-center items-start min-h-dvh px-3 py-10"
        role="main"
      >
        <PixelWindow>
          <PixelTabBar activeTab={activeTab} onTabChange={handleTabChange} notifCounts={notifCounts} />
          {activeTab === 'my' ? <MyProfile /> : activeTab === 'hitokoto' ? <HitokotoTab hasNotif={notifCounts.hitokoto > 0} /> : activeTab === 'friends' ? <FriendsTab onCountChange={() => {}} hasNotif={notifCounts.friends > 0} /> : <OthersTab hasNotif={notifCounts.others > 0} />}
          <div className="pixel-statusbar">
            友達と紹介しあおう！
          </div>
        </PixelWindow>
      </main>
    </div>
  )
}
