'use client'

import { useRef, useState, useEffect } from 'react'
import AvatarSVG from './AvatarSVG'

const STORAGE_KEY = '2pprof_avatar'
const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

export default function AvatarUploader() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setAvatarUrl(saved)
  }, [])

  async function handleFile(file: File) {
    setLoading(true)
    setError(null)

    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64 = e.target?.result as string
      try {
        const res = await fetch('/api/generate-avatar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64 }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? 'Failed')
        setAvatarUrl(data.imageBase64)
        localStorage.setItem(STORAGE_KEY, data.imageBase64)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました')
      } finally {
        setLoading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  function handleReset() {
    localStorage.removeItem(STORAGE_KEY)
    setAvatarUrl(null)
    setError(null)
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {/* アバター表示 */}
      <div className="pixel-portrait">
        {loading ? (
          <div
            className="flex items-center justify-center"
            style={{
              width: 80,
              height: 80,
              background: 'rgba(20, 8, 40, 0.90)',
            }}
          >
            <span
              style={{
                ...STYLE,
                fontSize: 10,
                color: '#40e8ff',
                textShadow: '0 0 6px rgba(64,232,255,0.70)',
                letterSpacing: '0.05em',
              }}
            >
              生成中...
            </span>
          </div>
        ) : avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt="avatar"
            width={80}
            height={80}
            style={{ imageRendering: 'pixelated', display: 'block' }}
          />
        ) : (
          <AvatarSVG size={80} />
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      {!loading && (
        <button
          onClick={() => inputRef.current?.click()}
          style={{
            ...STYLE,
            fontSize: 10,
            color: '#ffd700',
            background: 'rgba(8, 6, 20, 0.92)',
            border: '2px solid #ffd700',
            boxShadow: '0 0 8px rgba(255,215,0,0.35)',
            textShadow: '0 0 6px rgba(255,215,0,0.55)',
            padding: '3px 10px',
            cursor: 'pointer',
            letterSpacing: '0.08em',
          }}
        >
          {avatarUrl ? '▶ 写真を再変換' : '▶ 写真をドット絵に変換'}
        </button>
      )}

      {avatarUrl && !loading && (
        <button
          onClick={handleReset}
          style={{
            ...STYLE,
            fontSize: 9,
            color: '#403860',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            letterSpacing: '0.05em',
          }}
        >
          リセット
        </button>
      )}

      {error && (
        <p
          style={{
            ...STYLE,
            fontSize: 9,
            color: '#ff4060',
            textShadow: '0 0 5px rgba(255,64,96,0.60)',
            textAlign: 'center',
            maxWidth: 160,
          }}
        >
          ⚠ {error}
        </p>
      )}
    </div>
  )
}
