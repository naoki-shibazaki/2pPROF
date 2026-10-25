'use client'

import { useState } from 'react'

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

export type ModerationTarget = {
  contentType: 'post' | 'post_comment' | 'qa_comment' | 'introduction' | 'question' | 'profile'
  contentId?: string | null
  handle?: string | null
}

const REASONS = [
  ['spam', 'スパム・宣伝'],
  ['harassment', '嫌がらせ・いじめ'],
  ['inappropriate', '性的・暴力的など不適切な内容'],
  ['impersonation', 'なりすまし'],
  ['other', 'その他'],
] as const

type Step = 'menu' | 'reason' | 'confirmBlock' | 'done'

// 他人のコンテンツに付ける「⋯」メニュー。通報とブロック（Guideline 1.2）
// 通報・ブロックするとそのコンテンツは呼び出し元ですぐ非表示にする
export default function ModerationMenu({ target, onReported, onBlocked, demo, size = 12, label, labelStyle, reportOnly }: {
  target: ModerationTarget
  onReported?: () => void
  onBlocked?: () => void
  demo?: boolean
  size?: number
  // 指定すると「⋯」の代わりにこの文言のボタンにする
  label?: string
  labelStyle?: React.CSSProperties
  // ブロックは別のボタンで行う画面用
  reportOnly?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>('menu')
  const [doneText, setDoneText] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [after, setAfter] = useState<(() => void) | null>(null)

  const close = () => {
    setOpen(false)
    setStep('menu')
    setError('')
    // 非表示にするのはシートを閉じたあと（シートごと消えないように）
    after?.()
    setAfter(null)
  }

  async function send(url: string, body: object) {
    if (demo) return true
    setBusy(true)
    setError('')
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).catch(() => null)
    setBusy(false)
    if (!res?.ok) { setError('送信できませんでした。もう一度お試しください'); return false }
    return true
  }

  async function report(reason: string) {
    if (await send('/api/reports', { ...target, reason })) {
      setDoneText('通報しました。運営が24時間以内に確認し、規約違反があれば削除します。')
      setAfter(() => onReported ?? null)
      setStep('done')
    }
  }

  async function block() {
    if (await send('/api/blocks', target)) {
      setDoneText(`@${target.handle ?? 'このユーザー'} をブロックしました。このユーザーの投稿は表示されなくなります。`)
      setAfter(() => onBlocked ?? null)
      setStep('done')
    }
  }

  const item = (color = '#c0f0ff') => ({
    ...STYLE, width: '100%', minHeight: 48, fontSize: 15, color, background: 'transparent', border: 'none',
    borderBottom: '1px solid rgba(64,232,255,0.15)', cursor: 'pointer', textAlign: 'left' as const, padding: '0 16px',
  })

  return (
    <>
      <button
        aria-label="通報・ブロック"
        onClick={e => { e.stopPropagation(); setStep(reportOnly ? 'reason' : 'menu'); setOpen(true) }}
        style={label ? { ...STYLE, cursor: 'pointer', ...labelStyle } : { ...STYLE, fontSize: size + 4, lineHeight: 1, color: '#a898d8', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px' }}
      >
        {label ?? '⋯'}
      </button>

      {open && (
        <div onClick={close} style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} role="menu" style={{
            width: '100%', maxWidth: 400, margin: '0 12px', marginBottom: 'calc(env(safe-area-inset-bottom) + 12px)',
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <div style={{ background: 'rgba(6,4,18,0.98)', border: '1px solid rgba(64,232,255,0.45)' }}>
              {step === 'menu' && (
                <>
                  <button role="menuitem" onClick={() => setStep('reason')} style={item('#ff8090')}>🚩 通報する</button>
                  {(target.handle || target.contentType === 'question') && (
                    <button role="menuitem" onClick={() => setStep('confirmBlock')} style={{ ...item('#ff4060'), borderBottom: 'none' }}>
                      🚫 {target.handle ? `@${target.handle} をブロック` : 'この送信者をブロック'}
                    </button>
                  )}
                </>
              )}
              {step === 'reason' && (
                <>
                  <p style={{ ...STYLE, fontSize: 13, color: '#40e8ff80', padding: '10px 16px', borderBottom: '1px solid rgba(64,232,255,0.15)' }}>通報の理由を選んでください</p>
                  {REASONS.map(([key, label]) => (
                    <button key={key} disabled={busy} onClick={() => report(key)} style={item()}>{label}</button>
                  ))}
                </>
              )}
              {step === 'confirmBlock' && (
                <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <p style={{ ...STYLE, fontSize: 14, color: '#d0c8f0', lineHeight: 1.9 }}>
                    ブロックすると、お互いの投稿・コメント・紹介文が表示されなくなり、フォローも解除されます。運営にも報告されます。
                  </p>
                  <button disabled={busy} onClick={block} style={{ ...STYLE, fontSize: 15, color: '#fff', background: '#c02040', border: '1px solid #ff4060', padding: '12px', cursor: 'pointer' }}>
                    {busy ? '処理中...' : 'ブロックする'}
                  </button>
                </div>
              )}
              {step === 'done' && (
                <p style={{ ...STYLE, fontSize: 14, color: '#38ff78', padding: 16, lineHeight: 1.9 }}>✓ {doneText}</p>
              )}
              {error && <p style={{ ...STYLE, fontSize: 13, color: '#ff4060', padding: '8px 16px' }}>⚠ {error}</p>}
            </div>
            <button onClick={close} style={{ ...item('#b0a8d0'), textAlign: 'center', background: 'rgba(6,4,18,0.98)', border: '1px solid rgba(176,168,208,0.35)' }}>
              {step === 'done' ? 'とじる' : 'キャンセル'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
