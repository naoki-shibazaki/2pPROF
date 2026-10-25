'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

// アプリ内で画面を移動したかを覚えておく（「もどる」で戻れる画面があるかの判定に使う）
// 読み込み直すとリセットされる
let inAppNavigations = 0
export const hasInAppHistory = () => inAppNavigations > 0

export default function NavTracker() {
  const pathname = usePathname()
  const last = useRef(pathname)
  useEffect(() => {
    if (last.current === pathname) return
    last.current = pathname
    inAppNavigations++
  }, [pathname])
  return null
}
