'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { purchasePlan, restorePurchases, initPurchases } from '@/lib/purchases'

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

const PLANS = [
  {
    id: 'free' as const,
    name: '無料',
    price: 'Free',
    color: '#604878',
    border: 'rgba(96,72,120,0.40)',
    features: [
      '受け取った質問 5件まで',
      '受け取った他己紹介 3件まで',
      'プロフィール訪問者 ❌',
    ],
  },
  {
    id: 'lite' as const,
    name: 'ライト',
    price: '¥300 / 月',
    color: '#40e8ff',
    border: 'rgba(64,232,255,0.45)',
    features: [
      '受け取った質問 無制限',
      '受け取った他己紹介 無制限',
      'プロフィール訪問者（直近1時間）',
    ],
  },
  {
    id: 'premium' as const,
    name: 'プレミアム',
    price: '¥600 / 月',
    color: '#ff40c0',
    border: 'rgba(255,64,192,0.55)',
    features: [
      '受け取った質問 無制限',
      '受け取った他己紹介 無制限',
      'プロフィール訪問者（全履歴）',
    ],
  },
]

export default function PricingPage() {
  const router = useRouter()
  const [currentPlan, setCurrentPlan] = useState<string>('free')
  const [loading, setLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null)

  useEffect(() => {
    fetch('/api/user/me')
      .then(r => r.json())
      .then(u => {
        setCurrentPlan(u?.plan ?? 'free')
        if (u?.id) initPurchases(u.id)
      })
      .catch(() => {})
  }, [])

  async function handlePurchase(planId: 'lite' | 'premium') {
    setLoading(planId)
    setMessage(null)
    const result = await purchasePlan(planId)
    setLoading(null)

    if (result.ok) {
      setCurrentPlan(result.plan)
      setMessage({ text: `${planId === 'lite' ? 'ライト' : 'プレミアム'}プランになりました！`, ok: true })
      setTimeout(() => router.push('/'), 1500)
    } else if (!result.cancelled) {
      setMessage({ text: result.error, ok: false })
    }
  }

  async function handleRestore() {
    setLoading('restore')
    setMessage(null)
    const result = await restorePurchases()
    setLoading(null)

    if (result.ok) {
      setCurrentPlan(result.plan)
      setMessage({ text: '購入が復元されました！', ok: true })
    } else {
      setMessage({ text: result.error, ok: false })
    }
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'rgba(4,2,12,0.98)',
      padding: '24px 16px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>
      <button
        onClick={() => router.push('/')}
        style={{ ...STYLE, background: 'none', border: 'none', color: '#604878', fontSize: 9, cursor: 'pointer', alignSelf: 'flex-start', marginBottom: 16 }}
      >
        ← もどる
      </button>

      <h1 style={{ ...STYLE, fontSize: 13, color: '#ff40c0', letterSpacing: '0.15em', textShadow: '0 0 12px rgba(255,64,192,0.60)', marginBottom: 4 }}>
        ★ プラン選択 ★
      </h1>
      <p style={{ ...STYLE, fontSize: 8, color: '#604878', marginBottom: 20 }}>
        現在: {currentPlan === 'free' ? '無料' : currentPlan === 'lite' ? 'ライト' : 'プレミアム'} プラン
      </p>

      {message && (
        <div style={{
          ...STYLE, fontSize: 9, padding: '8px 14px', marginBottom: 16, width: '100%', maxWidth: 340,
          color: message.ok ? '#38ff78' : '#ff4040',
          border: `1px solid ${message.ok ? 'rgba(56,255,120,0.40)' : 'rgba(255,64,64,0.40)'}`,
          background: message.ok ? 'rgba(0,30,10,0.70)' : 'rgba(30,0,0,0.70)',
          textAlign: 'center',
        }}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 340 }}>
        {PLANS.map(plan => {
          const isCurrent = currentPlan === plan.id
          const isUpgrade = plan.id !== 'free' && !isCurrent

          return (
            <div key={plan.id} style={{
              border: `1px solid ${isCurrent ? plan.color : plan.border}`,
              background: isCurrent ? 'rgba(255,255,255,0.04)' : 'rgba(6,4,14,0.80)',
              padding: '14px 16px',
              position: 'relative',
            }}>
              {isCurrent && (
                <span style={{
                  position: 'absolute', top: -1, right: 10,
                  ...STYLE, fontSize: 7, color: plan.color,
                  background: 'rgba(4,2,12,0.98)', padding: '0 6px',
                }}>
                  現在のプラン
                </span>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                <span style={{ ...STYLE, fontSize: 12, color: plan.color, letterSpacing: '0.08em' }}>{plan.name}</span>
                <span style={{ ...STYLE, fontSize: 10, color: plan.color }}>{plan.price}</span>
              </div>
              {plan.features.map(f => (
                <p key={f} style={{ ...STYLE, fontSize: 8, color: '#604878', lineHeight: 2, margin: 0 }}>· {f}</p>
              ))}
              {isUpgrade && (
                <button
                  onClick={() => handlePurchase(plan.id as 'lite' | 'premium')}
                  disabled={!!loading}
                  style={{
                    ...STYLE, marginTop: 12, width: '100%', fontSize: 9,
                    color: plan.color, background: 'transparent',
                    border: `1px solid ${plan.border}`,
                    padding: '8px 0', cursor: loading ? 'default' : 'pointer',
                    opacity: loading ? 0.6 : 1, letterSpacing: '0.06em',
                  }}
                >
                  {loading === plan.id ? '処理中...' : `${plan.name}にアップグレード`}
                </button>
              )}
            </div>
          )
        })}
      </div>

      <button
        onClick={handleRestore}
        disabled={!!loading}
        style={{ ...STYLE, marginTop: 20, fontSize: 8, color: '#403060', background: 'none', border: 'none', cursor: 'pointer', opacity: loading ? 0.5 : 1 }}
      >
        {loading === 'restore' ? '確認中...' : '以前の購入を復元する'}
      </button>

      <p style={{ ...STYLE, fontSize: 7, color: '#302448', marginTop: 24, textAlign: 'center', lineHeight: 2.2, maxWidth: 300 }}>
        · サブスクリプションは App Store アカウントに請求されます<br />
        · 解約は 設定 → Apple ID → サブスクリプション から<br />
        · 更新日の24時間前までに解約しない限り自動更新されます
      </p>
    </div>
  )
}
