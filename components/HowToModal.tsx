'use client'

import { useEffect, useState } from 'react'
import { HP_MAX } from '@/lib/hp-max'

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

type Page = { icon: string; title: string; lines: string[] }

// 1 ページ 1 テーマ。文は短く、何をすればいいかだけ書く
const PAGES: Page[] = [
  {
    icon: '👾',
    title: 'ようこそ 2P PROF へ',
    lines: [
      '自分で書くプロフィールと、友達が書いてくれる紹介文で「あなた」を伝えるアプリです。',
      '使い方を少しだけ説明します。',
    ],
  },
  {
    icon: '❤️',
    title: `HP は 1日${HP_MAX}回`,
    lines: [
      `アプリを開けるのは1日${HP_MAX}回までです。開くたびに HP が1減ります。`,
      'HP が0のときに開くと、翌日0:00まで使えません。',
      '30秒以内に戻ったときは数えません。残りはマイページの HP バーで確認できます。',
    ],
  },
  {
    icon: '✎',
    title: 'プロフィールを編集する',
    lines: [
      'アイコン画像：画像をタップ',
      '名前：名前の横の ✎ をタップ',
      '質問の回答：「自分の回答」の [編集]',
      'ステータス：「ステータス」の [編集]',
    ],
  },
  {
    icon: '👥',
    title: '友達とつながる',
    lines: [
      '「友達」タブの「＋ 追加」から @ハンドルで友達を登録できます。',
      '右上の 🔗 から、QR コードや招待リンクも使えます。',
      '一緒にいるときは「近くの友達をさがす」→「⚔️ 会った！」で、会った回数が増えます。',
    ],
  },
  {
    icon: '💬',
    title: 'ひとこと・他己紹介',
    lines: [
      'ひとこと：いまの気持ちを短く投稿できます。',
      '他己紹介：友達があなたのことを紹介してくれます。友達のページから、あなたも紹介を書けます。',
      'お知らせは右上の 🔔 に届きます。',
    ],
  },
]

// 初めてホームを開いたときに出す使い方。設定の「使い方」からいつでも見直せる
export default function HowToModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [page, setPage] = useState(0)
  useEffect(() => { if (open) setPage(0) }, [open])
  if (!open) return null

  const p = PAGES[page]
  const isLast = page === PAGES.length - 1
  const btn = { ...STYLE, minHeight: 48, fontSize: 16, cursor: 'pointer', letterSpacing: '0.06em' } as const

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="howto-title" style={{
      position: 'fixed', inset: 0, zIndex: 600, background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 'calc(env(safe-area-inset-top) + 16px) 16px calc(env(safe-area-inset-bottom) + 16px)',
    }}>
      <div style={{
        width: '100%', maxWidth: 360, maxHeight: '100%', overflowY: 'auto',
        background: 'rgba(6,4,18,0.98)', border: '2px solid #40e8ff',
        boxShadow: '0 0 24px rgba(64,232,255,0.40)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          ...STYLE, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 12px', borderBottom: '1px solid rgba(64,232,255,0.30)',
          background: 'linear-gradient(90deg,#18042e 0%,#2e0860 50%,#18042e 100%)',
        }}>
          <span style={{ fontSize: 14, color: '#40e8ff', letterSpacing: '0.08em' }}>HOW TO PLAY</span>
          <button onClick={onClose} style={{ ...STYLE, fontSize: 14, color: '#b0a8d0', background: 'none', border: 'none', cursor: 'pointer', minHeight: 36, padding: '0 4px' }}>
            スキップ
          </button>
        </div>

        <div style={{ padding: '20px 18px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <span aria-hidden style={{ fontSize: 40, lineHeight: 1 }}>{p.icon}</span>
          <h2 id="howto-title" style={{ ...STYLE, fontSize: 20, color: '#ff40c0', textAlign: 'center', letterSpacing: '0.04em' }}>
            {p.title}
          </h2>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', marginTop: 4 }}>
            {p.lines.map(l => (
              <li key={l} style={{ ...STYLE, fontSize: 15, color: '#d0c8f0', lineHeight: 1.7 }}>{l}</li>
            ))}
          </ul>
        </div>

        <div aria-label={`${page + 1} / ${PAGES.length}`} style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '12px 0' }}>
          {PAGES.map((_, i) => (
            <span key={i} style={{ width: 8, height: 8, background: i === page ? '#40e8ff' : 'rgba(64,232,255,0.25)' }} />
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, padding: '0 16px 16px' }}>
          {page > 0 && (
            <button onClick={() => setPage(n => n - 1)} style={{ ...btn, padding: '0 16px', color: '#b0a8d0', background: 'transparent', border: '1px solid rgba(176,168,208,0.40)' }}>
              ◀ 戻る
            </button>
          )}
          <button
            onClick={() => (isLast ? onClose() : setPage(n => n + 1))}
            style={{ ...btn, flex: 1, color: '#04020c', background: '#40e8ff', border: '1px solid #40e8ff' }}
          >
            {isLast ? 'はじめる ▶' : '次へ ▶'}
          </button>
        </div>
      </div>
    </div>
  )
}
