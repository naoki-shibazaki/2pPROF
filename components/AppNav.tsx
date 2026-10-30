'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PixelTabBar, { type Tab, type NotifCounts } from './PixelTabBar'

// ホーム以外のページの下に出すタブ。押すとホームのそのタブへ移る。未読数のバッジも出す
export default function AppNav() {
  const router = useRouter()
  const [counts, setCounts] = useState<NotifCounts>({ hitokoto: 0, friends: 0, others: 0 })
  useEffect(() => {
    fetch('/api/notifications')
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (d) setCounts({ hitokoto: d.hitokoto ?? 0, friends: d.friends ?? 0, others: d.others ?? 0 }) })
      .catch(() => {})
  }, [])
  const go = (tab: Tab) => router.push(tab === 'my' ? '/' : `/?tab=${tab}`)
  return <PixelTabBar activeTab={null} onTabChange={go} notifCounts={counts} />
}
