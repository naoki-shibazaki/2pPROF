'use client'

import { useState } from 'react'
import PixelBackground from '@/components/PixelBackground'
import PixelWindow from '@/components/PixelWindow'
import PixelTabBar, { type Tab } from '@/components/PixelTabBar'
import MyProfile from '@/components/MyProfile'
import OthersTab from '@/components/OthersTab'

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('my')

  return (
    <div className="relative min-h-dvh">
      {/* Pixel art scene fills the entire background */}
      <PixelBackground />

      {/* Centered window card – sits on top of the scene */}
      <main
        className="relative z-10 flex justify-center items-start min-h-dvh px-3 py-10"
        role="main"
      >
        <PixelWindow>
          {/* Tab navigation */}
          <PixelTabBar activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Tab content */}
          {activeTab === 'my' ? <MyProfile /> : <OthersTab />}

          {/* Status bar */}
          <div className="pixel-statusbar">
            ★ 2P PROF v1.0 ★ ともだちと紹介しあおう！
          </div>
        </PixelWindow>
      </main>
    </div>
  )
}
