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
import EncounterPrompt from '@/components/EncounterPrompt'
import HowToModal from '@/components/HowToModal'
import PixelIcon from '@/components/PixelIcon'
import type { Me, UnreadCounts } from '@/lib/me'


export default function HomeClient({ demo, initialMe, initialCounts, initialTab }: { demo?: boolean; initialMe?: Me; initialCounts?: UnreadCounts; initialTab?: Tab }) {
  const [activeTab, setActiveTab] = useState<Tab>('my')
  const [notifCounts, setNotifCounts] = useState<NotifCounts>(initialCounts ?? { hitokoto: 0, friends: 0, others: 0 })
  // ヘッダーのドロップダウンは同時に1つだけ開く
  const [openPanel, setOpenPanel] = useState<'notif' | 'share' | 'settings' | null>(null)
  const togglePanel = (p: 'notif' | 'share' | 'settings') => setOpenPanel(cur => (cur === p ? null : p))
  const closePanel = () => setOpenPanel(null)
  // 使い方: 初めてホームを開いたときに自動で出す。設定からも開ける
  const [howToOpen, setHowToOpen] = useState(!demo && initialMe?.howto_seen === false)
  const closeHowTo = () => {
    setHowToOpen(false)
    if (!demo) fetch('/api/user/howto', { method: 'POST' }).catch(() => {})
  }

  const totalUnread = notifCounts.hitokoto + notifCounts.friends + notifCounts.others

  // 未読数はアプリを開いている間も取り直す（アプリはバックグラウンドで開いたままになるので、
  // 最初の 1 回だけだと後から来た通知に気づけない）。復帰したとき＋表示中は 30 秒ごと
  const loadCounts = useCallback(() => {
    fetch('/api/notifications')
      .then(r => r.json())
      .then(data => setNotifCounts({
        hitokoto: data?.hitokoto ?? 0,
        friends:  data?.friends  ?? 0,
        others:   data?.others   ?? 0,
      }))
      .catch(() => {})
  }, [])
  useEffect(() => {
    if (demo) return
    if (!initialCounts) loadCounts()
    const onVisible = () => { if (document.visibilityState === 'visible') loadCounts() }
    document.addEventListener('visibilitychange', onVisible)
    const id = setInterval(() => { if (document.visibilityState === 'visible') loadCounts() }, 30_000)
    return () => { document.removeEventListener('visibilitychange', onVisible); clearInterval(id) }
  }, [demo, loadCounts])

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

  // ほかのページの下のタブから来たときは、そのタブを開く（未読も既読にする）
  useEffect(() => {
    if (initialTab && initialTab !== 'my') handleTabChange(initialTab)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // タップしやすいよう 40×40 にし、上下は負のマージンでタイトルバーの高さを変えない
  const iconButton = (active: boolean) => ({
    background: 'none', border: 'none', cursor: 'pointer',
    width: 40, height: 40, margin: '-8px 0', padding: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    opacity: active ? 1 : 0.85,
  })

  const headerButtons = (
    <div style={{ display: 'flex', alignItems: 'center', marginRight: -6 }}>
      <div style={{ position: 'relative' }}>
        <button
          aria-label={totalUnread > 0 ? '通知（未読あり）' : '通知'}
          onClick={() => togglePanel('notif')}
          style={iconButton(openPanel === 'notif')}
        >
          <span className={totalUnread > 0 && openPanel !== 'notif' ? 'bell-ring' : undefined} style={{ display: 'block' }}>
            <PixelIcon name="bell" color="#ffd700" size={20} />
          </span>
        </button>
        {totalUnread > 0 && openPanel !== 'notif' && (
          // 小さな点だと気づけないので、件数入りのバッジにする
          <span aria-hidden style={{
            position: 'absolute', top: -6, right: 0,
            minWidth: 18, height: 18, padding: '0 4px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-pixel, monospace)', fontSize: 12, lineHeight: 1, color: '#fff',
            background: '#ff3040', border: '1px solid #04020c',
            boxShadow: '0 0 6px rgba(255,48,64,0.9)',
            pointerEvents: 'none',
          }}>
            {totalUnread > 9 ? '9+' : totalUnread}
          </span>
        )}
      </div>
      <button
        aria-label="シェア"
        onClick={() => togglePanel('share')}
        style={iconButton(openPanel === 'share')}
      >
        <PixelIcon name="share" color="#40e8ff" size={20} />
      </button>
      <button
        aria-label="設定"
        onClick={() => togglePanel('settings')}
        style={iconButton(openPanel === 'settings')}
      >
        <PixelIcon name="gear" color="#ff40c0" size={20} />
      </button>
    </div>
  )

  return (
    <div className="relative min-h-dvh">
      <PixelBackground />
      <main role="main">
        <PixelWindow rightSlot={headerButtons} fullscreen>
          <div style={{ position: 'relative', zIndex: 20 }}>
            <NotifPanel
              open={openPanel === 'notif'}
              onClose={closePanel}
              hasUnread={totalUnread > 0}
              onMarkAllRead={() => setNotifCounts({ hitokoto: 0, friends: 0, others: 0 })}
              onTabChange={tab => { closePanel(); handleTabChange(tab) }}
              onRead={loadCounts}
            />
            <SharePanel open={openPanel === 'share'} onClose={closePanel} demo={demo} />
            <SettingsPanel open={openPanel === 'settings'} onClose={closePanel} demo={demo} onShowHowTo={() => { closePanel(); setHowToOpen(true) }} />
          </div>
          {/* 上のタイトルと下のタブのあいだを全部使う。各タブはこの中でスクロールする */}
          <div className="home-content">
            {activeTab === 'my' ? <MyProfile demo={demo} initialUser={initialMe} /> : activeTab === 'hitokoto' ? <HitokotoTab hasNotif={notifCounts.hitokoto > 0} demo={demo} /> : activeTab === 'friends' ? <FriendsTab onCountChange={() => {}} hasNotif={notifCounts.friends > 0} demo={demo} /> : <OthersTab hasNotif={notifCounts.others > 0} demo={demo} />}
          </div>
          <PixelTabBar activeTab={activeTab} onTabChange={handleTabChange} notifCounts={notifCounts} />
        </PixelWindow>
      </main>
      {!demo && <EncounterPrompt />}
      <HowToModal open={howToOpen} onClose={closeHowTo} />
    </div>
  )
}
