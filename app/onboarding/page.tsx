'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function OnboardingPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [handle, setHandle] = useState('')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'form' | 'done'>('form')

  // Googleログイン時の名前を初期値に
  useEffect(() => {
    fetch('/api/user/me')
      .then(r => r.json())
      .then(user => {
        if (user?.name) setName(user.name)
        if (user?.onboarded) router.replace('/')
      })
  }, [router])

  // ハンドルを名前から自動生成
  function onNameChange(v: string) {
    setName(v)
    if (!handle) {
      const suggested = v.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '').slice(0, 20)
      setHandle(suggested)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/user/onboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, handle, bio }),
    })

    if (!res.ok) {
      const d = await res.json()
      setError(d.error || '登録に失敗しました')
      setLoading(false)
      return
    }

    setStep('done')
    setTimeout(() => router.replace('/'), 1200)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: '#080614',
        backgroundImage:
          'linear-gradient(rgba(255,64,192,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,64,192,0.04) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-6">
          <div
            className="font-pixel text-2xl tracking-widest mb-1"
            style={{ color: '#ff40c0', textShadow: '0 0 12px rgba(255,64,192,0.8)' }}
          >
            2P PROF
          </div>
          <div className="font-pixel text-xs tracking-widest" style={{ color: '#40e8ff80' }}>
            ▶ プロフィール設定 ◀
          </div>
        </div>

        <div className="pixel-window">
          <div className="pixel-titlebar">
            <span className="pixel-btn-chrome" />
            <span className="pixel-btn-chrome" />
            <span className="pixel-btn-chrome" />
            <span className="ml-2">SETUP.EXE</span>
          </div>

          <div className="p-5">
            {step === 'done' ? (
              <div className="text-center py-6 space-y-3">
                <div className="font-pixel text-2xl" style={{ color: '#38ff78', textShadow: '0 0 10px rgba(56,255,120,0.8)' }}>
                  ✓
                </div>
                <p className="font-pixel text-sm" style={{ color: '#38ff78' }}>登録完了！</p>
                <p className="font-pixel text-xs" style={{ color: '#40e8ff60' }}>プロフィールへ移動中...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="font-pixel text-xs" style={{ color: '#40e8ff60' }}>
                  はじめてのログインです。プロフィールを設定してください。
                </p>

                {error && (
                  <div
                    className="px-3 py-2 font-pixel text-xs border"
                    style={{ borderColor: '#ff4060', background: 'rgba(255,64,96,0.12)', color: '#ff8090' }}
                  >
                    ⚠ {error}
                  </div>
                )}

                {/* 名前 */}
                <div>
                  <label className="block font-pixel text-xs mb-1" style={{ color: '#40e8ff80' }}>
                    ▶ 表示名
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => onNameChange(e.target.value)}
                    required
                    maxLength={30}
                    className="w-full bg-transparent font-pixel text-sm px-3 py-2 outline-none"
                    style={{ border: '1px solid rgba(64,232,255,0.35)', color: '#c0f0ff' }}
                    placeholder="ひろ"
                  />
                </div>

                {/* ハンドル */}
                <div>
                  <label className="block font-pixel text-xs mb-1" style={{ color: '#40e8ff80' }}>
                    ▶ @ハンドル
                  </label>
                  <div className="flex items-center gap-1">
                    <span className="font-pixel text-sm" style={{ color: '#40e8ff60' }}>@</span>
                    <input
                      type="text"
                      value={handle}
                      onChange={e => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 20))}
                      required
                      className="flex-1 bg-transparent font-pixel text-sm px-3 py-2 outline-none"
                      style={{ border: '1px solid rgba(64,232,255,0.35)', color: '#c0f0ff' }}
                      placeholder="hiro_pixel"
                    />
                  </div>
                  <p className="font-pixel text-xs mt-1" style={{ color: '#40e8ff40' }}>
                    英数字・_のみ 3〜20文字（後から変更不可）
                  </p>
                </div>

                {/* 自己紹介 */}
                <div>
                  <label className="block font-pixel text-xs mb-1" style={{ color: '#40e8ff80' }}>
                    ▶ 自己紹介 <span style={{ color: '#40e8ff40' }}>(任意)</span>
                  </label>
                  <textarea
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    maxLength={200}
                    rows={3}
                    className="w-full bg-transparent font-pixel text-xs px-3 py-2 outline-none resize-none"
                    style={{ border: '1px solid rgba(64,232,255,0.35)', color: '#c0f0ff', lineHeight: '1.8' }}
                    placeholder="ゲームと漫画が大好きです..."
                  />
                  <p className="font-pixel text-right" style={{ fontSize: 9, color: '#40e8ff30' }}>
                    {bio.length}/200
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || handle.length < 3}
                  className="pixel-action-btn w-full justify-center py-3"
                  style={{ fontSize: '13px' }}
                >
                  {loading ? '...' : '▶ 登録してはじめる'}
                </button>
              </form>
            )}
          </div>

          <div className="pixel-statusbar">★ 2P PROF — ともだちと紹介しあおう！ ★</div>
        </div>
      </div>
    </div>
  )
}
