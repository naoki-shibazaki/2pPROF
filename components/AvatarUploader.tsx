'use client'

import { useRef, useState } from 'react'
import AvatarSVG from './AvatarSVG'

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

type Props = {
  currentImage: string | null
}

export default function AvatarUploader({ currentImage }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<string | null>(currentImage)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File) {
    setLoading(true)
    setError(null)
    const form = new FormData()
    form.append('file', file)
    const res = await fetch('/api/user/avatar', { method: 'PUT', body: form })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      setError(data.error ?? 'アップロードに失敗しました')
    } else {
      setImage(data.url)
    }
  }

  async function handleDelete() {
    setLoading(true)
    setError(null)
    const res = await fetch('/api/user/avatar', { method: 'DELETE' })
    setLoading(false)
    if (res.ok) setImage(null)
    else setError('削除に失敗しました')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      {/* アバター画像 */}
      <button
        onClick={() => !loading && inputRef.current?.click()}
        className="pixel-portrait"
        style={{ cursor: loading ? 'default' : 'pointer', background: 'none', padding: 0, border: 'none', display: 'inline-flex', position: 'relative' }}
        title="タップして写真を変更"
      >
        {loading ? (
          <div style={{ width: 140, height: 140, background: 'rgba(20,8,40,0.90)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ ...STYLE, fontSize: 9, color: '#40e8ff' }}>処理中...</span>
          </div>
        ) : image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="avatar" width={140} height={140}
            style={{ imageRendering: 'pixelated', display: 'block', objectFit: 'cover' }} />
        ) : (
          <AvatarSVG size={140} />
        )}
      </button>

      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }} />

      {/* ボタン */}
      <div style={{ display: 'flex', gap: 6 }}>
        <button
          onClick={() => !loading && inputRef.current?.click()}
          disabled={loading}
          style={{ ...STYLE, fontSize: 8, color: '#40e8ff', background: 'transparent', border: '1px solid rgba(64,232,255,0.40)', padding: '4px 10px', cursor: 'pointer', opacity: loading ? 0.5 : 1 }}
        >
          📷 写真を変更
        </button>
        {image && (
          <button
            onClick={handleDelete}
            disabled={loading}
            style={{ ...STYLE, fontSize: 8, color: '#ff4060', background: 'transparent', border: '1px solid rgba(255,64,96,0.40)', padding: '4px 10px', cursor: 'pointer', opacity: loading ? 0.5 : 1 }}
          >
            🗑 削除
          </button>
        )}
      </div>

      {error && (
        <p style={{ ...STYLE, fontSize: 9, color: '#ff4060', textAlign: 'center', maxWidth: 160 }}>
          ⚠ {error}
        </p>
      )}
    </div>
  )
}
