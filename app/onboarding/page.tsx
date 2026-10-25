'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { SELF_QA_ANSWER_MAX, SELF_QA_QUESTIONS } from '@/lib/self-qa-questions'

export default function OnboardingPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [handle, setHandle] = useState('')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'form' | 'qa' | 'done'>('form')
  // 質問は 1 問ずつ聞く。答えはあとから [編集] で直せるので、とばしてもよい
  const [qIndex, setQIndex] = useState(0)
  const [answers, setAnswers] = useState<string[]>(() => SELF_QA_QUESTIONS.map(() => ''))
  const answerRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (step === 'qa') answerRef.current?.focus()
  }, [step, qIndex])

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

  // プロフィールを確かめてから質問へ進む（ハンドルの重複はここで分かる）
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/user/onboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, handle, bio, check: true }),
    }).catch(() => null)
    setLoading(false)

    if (!res?.ok) {
      const d = await res?.json().catch(() => null)
      setError(d?.error || '確認できませんでした。もう一度お試しください')
      return
    }
    setStep('qa')
  }

  async function finish() {
    setLoading(true)
    setError('')

    const res = await fetch('/api/user/onboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, handle, bio, qa: answers }),
    }).catch(() => null)

    if (!res?.ok) {
      const d = await res?.json().catch(() => null)
      setError(d?.error || '登録に失敗しました')
      setLoading(false)
      // ハンドルが先に取られた場合などはプロフィールに戻す（答えは残る）
      if (res && res.status !== 500) setStep('form')
      return
    }

    setStep('done')
    setTimeout(() => router.replace('/'), 1200)
  }

  function next() {
    if (qIndex < SELF_QA_QUESTIONS.length - 1) setQIndex(i => i + 1)
    else void finish()
  }

  const answeredCount = answers.filter(a => a.trim()).length
  const isLast = qIndex === SELF_QA_QUESTIONS.length - 1

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
            ) : step === 'qa' ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between font-pixel text-xs" style={{ color: '#40e8ff80' }}>
                    <span>STEP 2 / 2　じぶんのこと</span>
                    <span aria-live="polite">{String(qIndex + 1).padStart(2, '0')} / {SELF_QA_QUESTIONS.length}</span>
                  </div>
                  <div
                    role="progressbar"
                    aria-valuemin={1}
                    aria-valuemax={SELF_QA_QUESTIONS.length}
                    aria-valuenow={qIndex + 1}
                    aria-label="質問の進み具合"
                    style={{ height: 6, marginTop: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(56,255,120,0.30)' }}
                  >
                    <div style={{ width: `${((qIndex + 1) / SELF_QA_QUESTIONS.length) * 100}%`, height: '100%', background: '#38ff78', boxShadow: '0 0 6px #38ff78' }} />
                  </div>
                </div>

                <p className="font-pixel text-xs" style={{ color: '#40e8ff60', lineHeight: 1.8 }}>
                  答えはプロフィールの「自分の回答」に載ります。わからない質問はとばして、あとで [編集] から答えられます。
                </p>

                {error && (
                  <div role="alert" className="px-3 py-2 font-pixel text-xs border" style={{ borderColor: '#ff4060', background: 'rgba(255,64,96,0.12)', color: '#ff8090' }}>
                    ⚠ {error}
                  </div>
                )}

                <div>
                  <label htmlFor="qa-answer" className="block font-pixel text-sm mb-2" style={{ color: '#d0c8f0' }}>
                    <span style={{ color: '#40e8ff', marginRight: 8 }}>{String(qIndex + 1).padStart(2, '0')}</span>
                    {SELF_QA_QUESTIONS[qIndex]}
                  </label>
                  <textarea
                    id="qa-answer"
                    ref={answerRef}
                    value={answers[qIndex]}
                    onChange={e => setAnswers(a => a.map((v, i) => (i === qIndex ? e.target.value : v)))}
                    maxLength={SELF_QA_ANSWER_MAX}
                    rows={3}
                    className="w-full bg-transparent font-pixel text-sm px-3 py-2 outline-none resize-none"
                    style={{ border: '1px solid rgba(56,255,120,0.45)', color: '#38ff78', lineHeight: '1.8' }}
                    placeholder="回答を入力"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => (qIndex === 0 ? setStep('form') : setQIndex(i => i - 1))}
                    disabled={loading}
                    className="font-pixel text-xs"
                    style={{ minHeight: 44, padding: '0 14px', color: '#b0a8d0', background: 'transparent', border: '1px solid rgba(176,168,208,0.35)', cursor: 'pointer' }}
                  >
                    ◀ 戻る
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    disabled={loading}
                    className="pixel-action-btn flex-1 justify-center"
                    style={{ minHeight: 44, fontSize: '13px' }}
                  >
                    {loading ? '...' : isLast ? '▶ 登録してはじめる' : answers[qIndex].trim() ? '次へ ▶' : 'とばす ▶'}
                  </button>
                </div>

                {!isLast && (
                  <button
                    type="button"
                    onClick={() => void finish()}
                    disabled={loading}
                    className="w-full font-pixel text-xs"
                    style={{ minHeight: 40, color: '#605888', background: 'transparent', border: 'none', cursor: 'pointer' }}
                  >
                    残りはあとで答える（{answeredCount}問 回答済み）
                  </button>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="font-pixel text-xs" style={{ color: '#40e8ff60' }}>
                  STEP 1 / 2　はじめてのログインです。プロフィールを設定してください。
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
                  {loading ? '...' : '次へ ▶ 質問に答える'}
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
