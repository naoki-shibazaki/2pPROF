'use client'

import { useEffect } from 'react'

// iPhone でキーボードを閉じたあとなどに、画面に収まるページが上にずれたまま残るのを戻す
// - 中身が画面に収まるページだけ（長くてスクロールするページはそのまま）
// - キーボードが開いている間は動かさない（入力欄が隠れないように）
export default function ViewportFix() {
  useEffect(() => {
    const vv = window.visualViewport
    let timer: ReturnType<typeof setTimeout> | undefined

    const keyboardOpen = () => !!vv && vv.height < window.innerHeight - 80
    const fits = () => (document.scrollingElement?.scrollHeight ?? 0) <= window.innerHeight + 1

    const check = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        if (keyboardOpen() || !fits()) return
        if (window.scrollY !== 0 || (vv && vv.offsetTop !== 0)) window.scrollTo(0, 0)
      }, 120)
    }

    window.addEventListener('scroll', check, { passive: true })
    document.addEventListener('focusout', check)
    vv?.addEventListener('resize', check)
    vv?.addEventListener('scroll', check)
    window.addEventListener('orientationchange', check)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', check)
      document.removeEventListener('focusout', check)
      vv?.removeEventListener('resize', check)
      vv?.removeEventListener('scroll', check)
      window.removeEventListener('orientationchange', check)
    }
  }, [])
  return null
}
