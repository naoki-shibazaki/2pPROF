'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Capacitor } from '@capacitor/core'
import { App } from '@capacitor/app'

// Universal Links（https://2p-profile.info/profile/... や /invite/...）でアプリが開いたら、その画面へ移動する
// 対応するパスは app/.well-known/apple-app-site-association と合わせる
const LINK_HOSTS = ['2p-profile.info', 'www.2p-profile.info']
const LINK_PATH = /^\/(profile|invite)\/[^/]+$/
const HANDLED_KEY = 'deeplink_handled'

function toPath(url: string) {
  try {
    const u = new URL(url)
    return LINK_HOSTS.includes(u.hostname) && LINK_PATH.test(u.pathname) ? u.pathname : null
  } catch {
    return null
  }
}

export default function DeepLinkHandler() {
  const router = useRouter()

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return
    const go = (url: string) => {
      const path = toPath(url)
      if (path && window.location.pathname !== path) router.push(path)
    }

    // アプリが閉じていた状態からリンクで起動した場合（同じ起動で 2 回は移動しない）
    App.getLaunchUrl()
      .then(r => {
        if (!r?.url) return
        try {
          if (sessionStorage.getItem(HANDLED_KEY) === r.url) return
          sessionStorage.setItem(HANDLED_KEY, r.url)
        } catch {}
        go(r.url)
      })
      .catch(() => {})

    // アプリが開いている（裏にいる）状態でリンクを開いた場合
    const sub = App.addListener('appUrlOpen', ({ url }) => go(url))
    return () => { void sub.then(h => h.remove()) }
  }, [router])

  return null
}
