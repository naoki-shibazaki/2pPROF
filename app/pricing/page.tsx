'use client'

import { useRouter } from 'next/navigation'
import PixelBackground from '@/components/PixelBackground'

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

const plans = [
  {
    id: 'free',
    name: '無料',
    price: '¥0',
    color: '#504870',
    borderColor: 'rgba(80,72,112,0.45)',
    features: [
      { label: '受け取った質問', value: '5件まで' },
      { label: '受け取った他己紹介', value: '3件まで' },
      { label: 'プロフィール訪問者', value: '❌' },
      { label: '位置情報共有', value: '❌（後日）' },
      { label: '待ち合わせマップ', value: '❌（後日）' },
    ],
  },
  {
    id: 'lite',
    name: 'ライト',
    price: '¥300',
    period: '/月',
    color: '#40e8ff',
    borderColor: 'rgba(64,232,255,0.55)',
    highlight: true,
    features: [
      { label: '受け取った質問', value: '無制限' },
      { label: '受け取った他己紹介', value: '無制限' },
      { label: 'プロフィール訪問者', value: '直近6時間' },
      { label: '位置情報共有', value: '❌（後日）' },
      { label: '待ち合わせマップ', value: '❌（後日）' },
    ],
  },
  {
    id: 'premium',
    name: 'プレミアム',
    price: '¥600',
    period: '/月',
    color: '#ffd700',
    borderColor: 'rgba(255,215,0,0.55)',
    features: [
      { label: '受け取った質問', value: '無制限' },
      { label: '受け取った他己紹介', value: '無制限' },
      { label: 'プロフィール訪問者', value: '全履歴' },
      { label: '位置情報共有', value: '✅（後日）' },
      { label: '待ち合わせマップ', value: '✅（後日）' },
    ],
  },
]

export default function PricingPage() {
  const router = useRouter()

  return (
    <div className="relative min-h-dvh">
      <PixelBackground />
      <main className="relative z-10 flex justify-center items-start min-h-dvh px-3 py-10" role="main">
        <div className="w-full" style={{ maxWidth: 380 }}>

          {/* Title bar */}
          <div className="pixel-titlebar" style={{ justifyContent: 'space-between' }}>
            <button
              onClick={() => router.back()}
              style={{ ...STYLE, fontSize: 11, color: '#ff40c0', background: 'none', border: 'none', cursor: 'pointer', textShadow: '0 0 6px rgba(255,64,192,0.60)', padding: '0 4px' }}
            >
              ‹ もどる
            </button>
            <span style={{ ...STYLE, fontSize: 12, color: '#ffd700', letterSpacing: '0.10em', textShadow: '0 0 8px rgba(255,215,0,0.70)', flex: 1, textAlign: 'center' }}>
              プラン
            </span>
            <div style={{ width: 52 }} />
          </div>

          {/* Window */}
          <div className="pixel-window overflow-hidden">

            {/* Coming soon banner */}
            <div style={{ background: 'rgba(255,215,0,0.10)', border: '1px solid rgba(255,215,0,0.35)', margin: '12px 12px 0', padding: '8px 12px' }}>
              <p style={{ ...STYLE, fontSize: 9, color: '#ffd700', margin: 0, lineHeight: 1.8 }}>
                ⚠ 決済機能は近日実装予定です<br />
                現在は管理者によるプラン設定のみ対応しています
              </p>
            </div>

            {/* Plan cards */}
            <div style={{ padding: '12px 12px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {plans.map(plan => (
                <div
                  key={plan.id}
                  style={{
                    background: plan.highlight ? 'rgba(64,232,255,0.06)' : 'rgba(4,2,12,0.60)',
                    border: `2px solid ${plan.borderColor}`,
                    boxShadow: plan.highlight ? `0 0 16px rgba(64,232,255,0.15)` : 'none',
                  }}
                >
                  {/* Plan header */}
                  <div style={{ background: plan.highlight ? 'rgba(64,232,255,0.10)' : 'rgba(4,2,12,0.80)', borderBottom: `1px solid ${plan.borderColor}`, padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ ...STYLE, fontSize: 12, color: plan.color, letterSpacing: '0.10em', textShadow: `0 0 8px ${plan.color}88` }}>
                      {plan.highlight ? '★ ' : '■ '}{plan.name}
                    </span>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ ...STYLE, fontSize: 16, color: plan.color, textShadow: `0 0 8px ${plan.color}66` }}>{plan.price}</span>
                      {plan.period && <span style={{ ...STYLE, fontSize: 9, color: plan.color + '99' }}>{plan.period}</span>}
                    </div>
                  </div>

                  {/* Features */}
                  <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {plan.features.map(f => (
                      <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ ...STYLE, fontSize: 9, color: '#604878' }}>{f.label}</span>
                        <span style={{ ...STYLE, fontSize: 9, color: plan.color }}>{f.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="pixel-statusbar">決済機能は近日公開予定！</div>
          </div>

        </div>
      </main>
    </div>
  )
}
