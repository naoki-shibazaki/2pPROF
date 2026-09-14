'use client'

import { useRef, useState, useEffect } from 'react'
import AvatarSVG from './AvatarSVG'

const STORAGE_KEY = '2pprof_avatar'
const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

type AvatarStyle = {
  id: string
  label: string
  desc: string
  free: boolean
  prompt?: string
}

const STYLES: AvatarStyle[] = [
  {
    id: 'raw',
    label: '📷 そのまま',
    desc: '無料',
    free: true,
  },
  {
    id: 'pixel',
    label: '👾 ドット絵',
    desc: '有料 ~¥8',
    free: false,
    prompt: 'Pixel art sprite, cute chibi character, 16-bit retro game style, full body portrait, {{desc}}. Thick black pixel outlines, flat shading, synthwave color palette, clean sprite style.',
  },
  {
    id: 'rpg',
    label: '⚔️ レトロRPG',
    desc: '有料 ~¥8',
    free: false,
    prompt: 'Classic JRPG character portrait, 16-bit Super Famicom art style, {{desc}}. Detailed pixel art, RPG status screen portrait, rich colors, fantasy RPG aesthetic.',
  },
  {
    id: 'anime',
    label: '✨ アニメ風',
    desc: '有料 ~¥8',
    free: false,
    prompt: 'Cute anime chibi character illustration, {{desc}}. Clean line art, vibrant anime colors, big eyes, kawaii style, white background.',
  },
  {
    id: 'cyber',
    label: '🌆 サイバーパンク',
    desc: '有料 ~¥8',
    free: false,
    prompt: 'Cyberpunk neon character portrait, {{desc}}. Synthwave aesthetic, neon magenta and cyan lighting, futuristic urban style, pixel art inspired.',
  },
]

export default function AvatarUploader() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [picking, setPicking] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState<AvatarStyle | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setAvatarUrl(saved)
  }, [])

  function openStylePicker() {
    setError(null)
    setPicking(true)
  }

  function onStyleChosen(s: AvatarStyle) {
    setSelectedStyle(s)
    setPicking(false)
    inputRef.current?.click()
  }

  async function handleFile(file: File) {
    if (!selectedStyle) return
    setLoading(true)
    setError(null)

    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64 = e.target?.result as string

      // 無料：そのまま保存
      if (selectedStyle.free) {
        setAvatarUrl(base64)
        localStorage.setItem(STORAGE_KEY, base64)
        setLoading(false)
        return
      }

      // 有料：API変換
      try {
        const res = await fetch('/api/generate-avatar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64, stylePrompt: selectedStyle.prompt }),
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
    <>
      <div className="flex flex-col items-center gap-2">
        {/* アバター表示 */}
        <div className="pixel-portrait">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-1"
              style={{ width: 80, height: 80, background: 'rgba(20,8,40,0.90)' }}>
              <span style={{ ...STYLE, fontSize: 9, color: '#40e8ff', textShadow: '0 0 6px rgba(64,232,255,0.70)' }}>
                変換中...
              </span>
            </div>
          ) : avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="avatar" width={80} height={80}
              style={{ imageRendering: 'pixelated', display: 'block', objectFit: 'cover' }} />
          ) : (
            <AvatarSVG size={80} />
          )}
        </div>

        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />

        {!loading && (
          <button onClick={openStylePicker} style={{
            ...STYLE, fontSize: 10, color: '#ffd700',
            background: 'rgba(8,6,20,0.92)',
            border: '2px solid #ffd700',
            boxShadow: '0 0 8px rgba(255,215,0,0.35)',
            textShadow: '0 0 6px rgba(255,215,0,0.55)',
            padding: '3px 10px', cursor: 'pointer', letterSpacing: '0.08em',
          }}>
            {avatarUrl ? '▶ スタイルを変更' : '▶ 写真をセット'}
          </button>
        )}

        {avatarUrl && !loading && (
          <button onClick={handleReset} style={{
            ...STYLE, fontSize: 9, color: '#403860',
            background: 'transparent', border: 'none', cursor: 'pointer',
          }}>
            リセット
          </button>
        )}

        {error && (
          <p style={{ ...STYLE, fontSize: 9, color: '#ff4060', textAlign: 'center', maxWidth: 160 }}>
            ⚠ {error}
          </p>
        )}
      </div>

      {/* ── スタイル選択モーダル ── */}
      {picking && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(4,2,12,0.90)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: '16px',
          }}
          onClick={(e) => e.target === e.currentTarget && setPicking(false)}
        >
          <div style={{
            background: 'rgba(8,6,20,0.99)',
            border: '3px solid #ffd700',
            boxShadow: '0 0 24px rgba(255,215,0,0.40)',
            width: '100%', maxWidth: 320,
          }}>
            {/* Title */}
            <div style={{
              ...STYLE,
              background: 'linear-gradient(90deg,#18042e 0%,#2e0860 50%,#18042e 100%)',
              borderBottom: '2px solid #ffd700',
              color: '#ffd700', fontSize: 13,
              padding: '5px 10px', letterSpacing: '0.10em',
              textShadow: '0 0 8px rgba(255,215,0,0.70)',
            }}>
              ■ スタイルを選択
            </div>

            <div className="flex flex-col p-3 gap-2">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onStyleChosen(s)}
                  style={{
                    ...STYLE,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 12px', cursor: 'pointer', textAlign: 'left',
                    color: s.free ? '#38ff78' : '#d0c8f0',
                    background: s.free ? 'rgba(56,255,120,0.06)' : 'rgba(4,2,12,0.80)',
                    border: s.free
                      ? '1px solid rgba(56,255,120,0.40)'
                      : '1px solid rgba(64,232,255,0.25)',
                    boxShadow: s.free ? '0 0 6px rgba(56,255,120,0.15)' : 'none',
                  }}
                >
                  <span style={{ fontSize: 12 }}>{s.label}</span>
                  <span style={{
                    fontSize: 9,
                    color: s.free ? '#38ff78' : '#ff8830',
                    textShadow: s.free
                      ? '0 0 5px rgba(56,255,120,0.60)'
                      : '0 0 5px rgba(255,136,48,0.60)',
                    letterSpacing: '0.04em',
                  }}>
                    {s.desc}
                  </span>
                </button>
              ))}

              <button
                onClick={() => setPicking(false)}
                style={{
                  ...STYLE, marginTop: 4, fontSize: 11, color: '#504870',
                  background: 'rgba(4,2,12,0.90)',
                  border: '1px solid rgba(80,72,112,0.40)',
                  padding: '6px 0', cursor: 'pointer',
                }}
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
