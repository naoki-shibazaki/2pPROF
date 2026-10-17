'use client'

import { App } from '@capacitor/app'
import { Browser } from '@capacitor/browser'
import { signIn } from 'next-auth/react'
import { APP_BUNDLE_ID } from '@/lib/app-id'

export type NativeOAuthResult = 'success' | 'error' | 'cancelled'

// iOS アプリ内ブラウザで Google / LINE の OAuth を行い、完了したらアプリ側にサインインする
// サーバー側の流れは lib/native-handoff.ts を参照
export async function nativeOAuthSignIn(provider: 'google' | 'line'): Promise<NativeOAuthResult> {
  const token = Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, '0')).join('')

  return new Promise(resolve => {
    let settled = false
    const listeners: Promise<{ remove: () => Promise<void> }>[] = []

    const finish = async (returnedFromAuth: boolean, authError = false) => {
      if (settled) return
      settled = true
      await Promise.all(listeners.map(l => l.then(h => h.remove())))
      if (authError) return resolve('error')

      const result = await signIn('native-handoff', { token, redirect: false })
      if (!result?.error) return resolve('success')
      // ブラウザを閉じただけ（ログイン未完了）の場合はキャンセル扱い
      resolve(returnedFromAuth ? 'error' : 'cancelled')
    }

    listeners.push(App.addListener('appUrlOpen', ({ url }) => {
      if (!url.startsWith(`${APP_BUNDLE_ID}://auth/`)) return
      Browser.close().catch(() => {})
      void finish(true, url.endsWith('/error'))
    }))
    listeners.push(Browser.addListener('browserFinished', () => { void finish(false) }))

    const startUrl = `${window.location.origin}/api/auth/native/start?provider=${provider}&token=${token}`
    Browser.open({ url: startUrl, presentationStyle: 'popover' }).catch(() => {
      settled = true
      resolve('error')
    })
  })
}
