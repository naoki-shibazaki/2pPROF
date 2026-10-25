'use client'

import { useEffect } from 'react'

// スクロールできる要素（リスト・入力欄など）の中で、その方向にまだ動けるか
function canScroll(el: Element, dx: number, dy: number) {
  const st = getComputedStyle(el)
  if (Math.abs(dy) >= Math.abs(dx)) {
    if (!/(auto|scroll)/.test(st.overflowY) || el.scrollHeight <= el.clientHeight + 1) return null
    return dy > 0 ? el.scrollTop > 0 : el.scrollTop + el.clientHeight < el.scrollHeight - 1
  }
  if (!/(auto|scroll)/.test(st.overflowX) || el.scrollWidth <= el.clientWidth + 1) return null
  return dx > 0 ? el.scrollLeft > 0 : el.scrollLeft + el.clientWidth < el.scrollWidth - 1
}

// iPhone で画面全体が上にずれるのを防ぐ
// 1. スクロールしない場所をなぞったときは、画面全体を動かさない（リストの端に来たときも全体に連鎖させない）
// 2. キーボードを閉じたあとなどに、画面に収まるページがずれたまま残ったら戻す
// どちらも、中身が画面より長いページ（プロフィール・規約など）はそのまま
export default function ViewportFix() {
  useEffect(() => {
    let lastX = 0, lastY = 0
    const onTouchStart = (e: TouchEvent) => { lastX = e.touches[0].clientX; lastY = e.touches[0].clientY }
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1 || !e.cancelable) return
      const t = e.touches[0]
      const dx = t.clientX - lastX, dy = t.clientY - lastY
      lastX = t.clientX; lastY = t.clientY
      for (let el = e.target as Element | null; el && el !== document.body && el !== document.documentElement; el = el.parentElement) {
        const ok = canScroll(el, dx, dy)
        if (ok === null) continue
        if (!ok) e.preventDefault()
        return
      }
      if ((document.scrollingElement?.scrollHeight ?? 0) > window.innerHeight + 1) return
      e.preventDefault()
    }
    document.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('touchmove', onTouchMove, { passive: false })

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
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('touchmove', onTouchMove)
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
