'use client'

import { useEffect, useRef, useState } from 'react'
import jsQR from 'jsqr'

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

// 2P PROF の QR コード（プロフィール / 招待リンク）なら、アプリ内のパスを返す
// 旧ドメインや www 付きで作られた QR も受け付ける
const OWN_HOSTS = ['2p-profile.info', 'www.2p-profile.info', '2pprof.vercel.app']

export function appPathFromQR(text: string): string | null {
  try {
    const url = new URL(text)
    if (!OWN_HOSTS.includes(url.host) && url.host !== window.location.host) return null
    return /^\/(profile|invite)\/[^/]+\/?$/.test(url.pathname) ? url.pathname : null
  } catch {
    return null
  }
}

export default function QRScanner({ onClose }: { onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [unknown, setUnknown] = useState(false)

  useEffect(() => {
    let stream: MediaStream | null = null
    let frame = 0
    let stopped = false
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!

    const tick = () => {
      if (stopped) return
      const video = videoRef.current
      if (video && video.readyState >= video.HAVE_ENOUGH_DATA) {
        // 読み取りは縮小した画像で行う（端末の負荷を抑える）
        const scale = Math.min(1, 640 / video.videoWidth)
        canvas.width = video.videoWidth * scale
        canvas.height = video.videoHeight * scale
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const img = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const code = jsQR(img.data, img.width, img.height, { inversionAttempts: 'dontInvert' })
        if (code?.data) {
          const path = appPathFromQR(code.data)
          if (path) {
            stopped = true
            window.location.href = path
            return
          }
          setUnknown(true)
        }
      }
      frame = requestAnimationFrame(tick)
    }

    navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      .then(s => {
        if (stopped) { s.getTracks().forEach(t => t.stop()); return }
        stream = s
        const video = videoRef.current!
        video.srcObject = s
        return video.play().then(() => { frame = requestAnimationFrame(tick) })
      })
      .catch(e => {
        console.error('[qr] camera', e)
        setError('カメラを使えませんでした。iPhone の「設定」→「2P PROF」でカメラを許可してください')
      })
    if (!navigator.mediaDevices) setError('この端末ではカメラを使えません')

    return () => {
      stopped = true
      cancelAnimationFrame(frame)
      stream?.getTracks().forEach(t => t.stop())
    }
  }, [])

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(4,2,12,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'rgba(8,6,20,0.98)', border: '2px solid #40e8ff', boxShadow: '0 0 24px rgba(64,232,255,0.35)',
          padding: '18px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          width: '90%', maxWidth: 320,
        }}
      >
        <span style={{ ...STYLE, fontSize: 10, color: '#40e8ff', letterSpacing: '0.10em' }}>■ QRコードを読み込む</span>
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1', background: '#000', overflow: 'hidden' }}>
          <video ref={videoRef} playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          {/* 読み取り枠 */}
          <div style={{ position: 'absolute', inset: '15%', border: '2px solid rgba(64,232,255,0.8)', boxShadow: '0 0 0 999px rgba(0,0,0,0.35)' }} />
        </div>
        <span style={{ ...STYLE, fontSize: 9, color: error || unknown ? '#ff8090' : '#604878', textAlign: 'center', lineHeight: 1.8 }}>
          {error ?? (unknown ? '2P PROF の QR コードではありません' : 'ともだちの QR コードを枠に合わせてください')}
        </span>
        <button
          onClick={onClose}
          style={{ ...STYLE, fontSize: 10, color: '#b0a8d0', background: 'transparent', border: '1px solid rgba(176,168,208,0.35)', padding: '6px 20px', cursor: 'pointer' }}
        >
          とじる
        </button>
      </div>
    </div>
  )
}
