'use client'

import { useState, useEffect, useCallback } from 'react'
import PixelBackground from '@/components/PixelBackground'
import PixelWindow from '@/components/PixelWindow'
import PixelTabBar, { type Tab } from '@/components/PixelTabBar'
import MyProfile from '@/components/MyProfile'
import FriendsTab from '@/components/FriendsTab'
import OthersTab from '@/components/OthersTab'

export default function HomeClient() {
  const [activeTab, setActiveTab] = useState<Tab>('my')
  const [friendCount, setFriendCount] = useState<number | undefined>(undefined)
  const [notifCount, setNotifCount] = useState(0)

  useEffect(() => {
    fetch('/api/friends')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setFriendCount(data.length) })
      .catch(() => setFriendCount(0))

    fetch('/api/notifications')
      .then(r => r.json())
      .then(data => setNotifCount(data?.count ?? 0))
      .catch(() => {})
  }, [])

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab)
    if (tab === 'others' && notifCount > 0) {
      setNotifCount(0)
      fetch('/api/notifications', { method: 'POST' }).catch(() => {})
    }
  }, [notifCount])

  return (
    <div className="relative min-h-dvh">
      <PixelBackground />
      <main
        className="relative z-10 flex justify-center items-start min-h-dvh px-3 py-10"
        role="main"
      >
        <PixelWindow>
          <PixelTabBar activeTab={activeTab} onTabChange={handleTabChange} friendCount={friendCount} notifCount={notifCount} />
          {activeTab === 'my' ? <MyProfile /> : activeTab === 'friends' ? <FriendsTab onCountChange={setFriendCount} /> : <OthersTab />}
          <div className="pixel-statusbar">
            ★ 2P PROF v1.0 ★ ともだちと紹介しあおう！
          </div>
        </PixelWindow>
      </main>
    </div>
  )
}
