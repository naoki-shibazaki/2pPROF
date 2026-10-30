'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AvatarSVG from './AvatarSVG'

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

type Common = {
  answers: { q: string; a: string; b: string; word: string }[]
  mutual: { id: string; name: string | null; handle: string | null; image: string | null }[]
  connections: { message: string; introducer_name: string | null; introducer_handle: string | null }[]
}

// 人のプロフィールに出す「あなたとの共通点」。同じ答え・共通の友達・友達からの紹介
export default function CommonCard({ handle }: { handle: string }) {
  const router = useRouter()
  const [data, setData] = useState<Common | null>(null)

  useEffect(() => {
    fetch(`/api/common?handle=${encodeURIComponent(handle)}`)
      .then(r => (r.ok ? r.json() : null))
      .then(d => setData(d))
      .catch(() => {})
  }, [handle])

  if (!data || (!data.answers.length && !data.mutual.length && !data.connections.length)) return null

  return (
    <div style={{ padding: '12px 12px 0' }}>
      <div style={{ background: 'rgba(4,2,12,0.70)', border: '2px solid rgba(56,255,120,0.35)', boxShadow: '0 0 12px rgba(56,255,120,0.12)' }}>
        <div style={{ ...STYLE, fontSize: 13, color: '#38ff78', background: 'rgba(56,255,120,0.08)', borderBottom: '1px solid rgba(56,255,120,0.25)', padding: '4px 10px', letterSpacing: '0.08em' }}>
          ■ あなたとの共通点
        </div>
        <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {data.connections.map((c, i) => (
            <div key={i} style={{ ...STYLE, fontSize: 13, color: '#ffd700', lineHeight: 1.9 }}>
              🤝 {c.introducer_name ?? `@${c.introducer_handle}`} からの紹介
              <div style={{ color: '#d0c8f0' }}>「{c.message}」</div>
            </div>
          ))}

          {data.answers.length > 0 && (
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {data.answers.slice(0, 6).map(a => (
                <li key={a.q} style={{ ...STYLE, fontSize: 13, color: '#b0a8d0', lineHeight: 1.8 }}>
                  <span style={{ color: '#8a80b0' }}>{a.q}</span>
                  <br />
                  <span style={{ color: '#38ff78' }}>どちらも「{a.word}」</span>
                </li>
              ))}
            </ul>
          )}

          {data.mutual.length > 0 && (
            <div>
              <div style={{ ...STYLE, fontSize: 12, color: '#8a80b0', marginBottom: 6 }}>共通の友達 {data.mutual.length}人</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {data.mutual.slice(0, 8).map(u => (
                  <button
                    key={u.id}
                    onClick={() => u.handle && router.push(`/profile/${u.handle}`)}
                    aria-label={`${u.name ?? u.handle} のプロフィール`}
                    style={{ width: 36, height: 36, padding: 0, border: '1px solid rgba(64,232,255,0.3)', background: 'none', cursor: 'pointer', overflow: 'hidden' }}
                  >
                    {u.image
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={u.image} alt="" width={34} height={34} style={{ objectFit: 'cover', imageRendering: 'pixelated', display: 'block' }} />
                      : <AvatarSVG size={34} />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
