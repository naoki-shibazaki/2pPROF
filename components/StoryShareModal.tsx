'use client'

import { useEffect, useState } from 'react'

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

type Intro = { id: string; body: string; author_name: string | null; author_handle: string | null }

type Props = { handle: string; onClose: () => void }

// ストーリー（Instagram など）にシェアする画像を選んで送る画面
// 画像は /api/share-card で作る。シェアのときにリンク（/s/<handle>）をコピーしておき、リンクスタンプに貼ってもらう
export default function StoryShareModal({ handle, onClose }: Props) {
  const [intros, setIntros] = useState<Intro[]>([])
  // null: 「どんな人？」カード。それ以外は紹介文の id
  const [selected, setSelected] = useState<string | null>(null)
  const [showAuthor, setShowAuthor] = useState(true)
  const [inviteLeft, setInviteLeft] = useState(0)
  const [withInvite, setWithInvite] = useState(true)
  const [inviteToken, setInviteToken] = useState<string | null>(null)
  const [image, setImage] = useState<{ key: string; blob: Blob; url: string } | null>(null)
  const [failed, setFailed] = useState(false)
  const [status, setStatus] = useState<'' | 'copied' | 'shared'>('')

  useEffect(() => {
    fetch('/api/introductions').then(r => r.json()).then(d => {
      const items: Intro[] = d?.items ?? []
      setIntros(items)
      // 紹介文があれば、いちばん新しいものから始める
      if (items[0]) setSelected(items[0].id)
    }).catch(() => {})
    fetch('/api/user/invite').then(r => (r.ok ? r.json() : null)).then(d => d && setInviteLeft(d.remaining)).catch(() => {})
  }, [])

  // 招待の枠が残っていれば、ストーリー用の招待リンクを作っておく（シェアの直前に作るとコピーが拒否されるため）
  useEffect(() => {
    if (inviteLeft <= 0 || inviteToken) return
    fetch('/api/invite', { method: 'POST' }).then(r => r.json()).then(d => d?.token && setInviteToken(d.token)).catch(() => {})
  }, [inviteLeft, inviteToken])

  const key = selected ? `intro=${selected}&author=${showAuthor ? 1 : 0}` : 'ask'

  // 画像はシェアの前に読み込んでおく（タップのあとに待つと、iOS でシェアが拒否される）
  useEffect(() => {
    let cancelled = false
    setFailed(false)
    const query = selected ? `?intro=${selected}&author=${showAuthor ? 1 : 0}` : ''
    fetch(`/api/share-card${query}`)
      .then(r => (r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))))
      .then(blob => {
        if (cancelled) return
        setImage(prev => {
          if (prev) URL.revokeObjectURL(prev.url)
          return { key, blob, url: URL.createObjectURL(blob) }
        })
      })
      .catch(() => { if (!cancelled) setFailed(true) })
    return () => { cancelled = true }
  }, [key, selected, showAuthor])

  const link = `${window.location.origin}/s/${handle}${withInvite && inviteToken ? `?inv=${inviteToken}` : ''}`
  const ready = image?.key === key
  const file = ready ? new File([image.blob], '2pprof-story.png', { type: 'image/png' }) : null
  // 画像つきのシェアができるか（iOS のアプリや Safari はできる。PC の Chrome などはできない）
  const [canShareFile] = useState(() =>
    typeof navigator.canShare === 'function' && navigator.canShare({ files: [new File([''], 'a.png', { type: 'image/png' })] }))

  function share() {
    if (!file) return
    // リンクはリンクスタンプに貼ってもらう。コピーはタップ直後でないと失敗するので、シェアより先に呼ぶ
    navigator.clipboard?.writeText(link).catch(() => {})
    navigator.share({ files: [file] })
      .then(() => setStatus('shared'))
      .catch(() => setStatus('copied'))
  }

  async function copyLink() {
    await navigator.clipboard?.writeText(link).catch(() => {})
    setStatus('copied')
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(8,6,20,0.99)', display: 'flex', flexDirection: 'column', paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderBottom: '1px solid rgba(255,64,192,0.35)' }}>
        <span style={{ ...STYLE, fontSize: 14, color: '#ff40c0', letterSpacing: '0.08em' }}>■ ストーリーでシェア</span>
        <button onClick={onClose} aria-label="閉じる" style={{ ...STYLE, minWidth: 44, minHeight: 44, fontSize: 18, color: '#d0c8f0', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain', padding: '12px 16px 16px', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
        {/* カードの種類 */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', width: '100%', paddingBottom: 4 }}>
          {intros.map(i => (
            <Chip key={i.id} active={selected === i.id} onClick={() => setSelected(i.id)}>
              {`${i.author_name || i.author_handle || '友達'} の紹介文`}
            </Chip>
          ))}
          <Chip active={selected === null} onClick={() => setSelected(null)}>どんな人？（募集）</Chip>
        </div>

        {/* プレビュー（9:16） */}
        <div style={{ height: 'min(52vh, 480px)', aspectRatio: '9 / 16', border: '1px solid rgba(64,232,255,0.35)', background: '#080614', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image.url} alt="ストーリー用の画像" style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: ready ? 1 : 0.4 }} />
          )}
          {!ready && (
            <span style={{ ...STYLE, position: 'absolute', fontSize: 13, color: failed ? '#ff4060' : '#40e8ff' }}>
              {failed ? '画像を作れませんでした' : 'つくっています...'}
            </span>
          )}
        </div>

        {/* オプション */}
        <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {selected && <Toggle checked={showAuthor} onChange={setShowAuthor}>書いた人の名前をのせる</Toggle>}
          {inviteLeft > 0 && (
            <Toggle checked={withInvite} onChange={setWithInvite}>{`リンクに招待をつける（あと ${inviteLeft} 人）`}</Toggle>
          )}
        </div>

        <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {canShareFile ? (
            <button onClick={share} disabled={!ready} style={{ ...primaryButton, opacity: ready ? 1 : 0.5 }}>シェアする</button>
          ) : (
            <p style={{ ...STYLE, fontSize: 13, color: '#b0a8d0', textAlign: 'center' }}>画像を長押しして保存してください</p>
          )}
          <button onClick={copyLink} style={secondaryButton}>リンクだけコピー</button>
          <p style={{ ...STYLE, fontSize: 12, color: status ? '#38ff78' : '#8a7aa8', lineHeight: 1.7, textAlign: 'center' }}>
            {status
              ? '✓ リンクをコピーしました。ストーリーの「リンク」スタンプに貼り付けてください'
              : 'シェアするとリンクもコピーされます。Instagram ではストーリーの「リンク」スタンプに貼り付けてください'}
          </p>
        </div>
      </div>
    </div>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      ...STYLE, flexShrink: 0, fontSize: 13, minHeight: 36, padding: '6px 12px', cursor: 'pointer', whiteSpace: 'nowrap',
      color: active ? '#080614' : '#c0f0ff', background: active ? '#40e8ff' : 'transparent',
      border: `1px solid ${active ? '#40e8ff' : 'rgba(64,232,255,0.45)'}`,
    }}>
      {children}
    </button>
  )
}

function Toggle({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <label style={{ ...STYLE, display: 'flex', alignItems: 'center', gap: 10, minHeight: 44, fontSize: 14, color: '#d0c8f0', cursor: 'pointer' }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ width: 18, height: 18, accentColor: '#40e8ff' }} />
      {children}
    </label>
  )
}

const primaryButton = {
  ...STYLE, width: '100%', minHeight: 48, fontSize: 16, color: '#080614', background: '#ff40c0', border: 'none',
  cursor: 'pointer', boxShadow: '0 0 16px rgba(255,64,192,0.45)',
} as const

const secondaryButton = {
  ...STYLE, width: '100%', minHeight: 44, fontSize: 14, color: '#40e8ff', background: 'transparent',
  border: '1px solid rgba(64,232,255,0.55)', cursor: 'pointer',
} as const
