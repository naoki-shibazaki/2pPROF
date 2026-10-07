'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (isSignUp) {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error || 'アカウント作成に失敗しました')
        setLoading(false)
        return
      }
    }

    const result = await signIn('email-password', { email, password, redirect: false })
    if (result?.error) {
      setError('メールアドレスまたはパスワードが正しくありません')
    } else {
      router.push('/')
    }
    setLoading(false)
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
            {isSignUp ? '▶ NEW ACCOUNT ◀' : '▶ USER LOGIN ◀'}
          </div>
        </div>

        {/* Window */}
        <div className="pixel-window">
          <div className="pixel-titlebar">
            <span className="pixel-btn-chrome" />
            <span className="pixel-btn-chrome" />
            <span className="pixel-btn-chrome" />
            <span className="ml-2">{isSignUp ? 'REGISTER.EXE' : 'LOGIN.EXE'}</span>
          </div>

          <div className="p-5 space-y-4">
            {error && (
              <div
                className="px-3 py-2 font-pixel text-xs border"
                style={{ borderColor: '#ff4060', background: 'rgba(255,64,96,0.12)', color: '#ff8090' }}
              >
                ⚠ {error}
              </div>
            )}

            {/* Email form */}
            <form onSubmit={handleEmailAuth} className="space-y-3">
              {isSignUp && (
                <div>
                  <label className="block font-pixel text-xs mb-1" style={{ color: '#40e8ff80' }}>▶ NAME</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-transparent font-pixel text-sm px-3 py-2 outline-none"
                    style={{ border: '1px solid rgba(64,232,255,0.35)', color: '#c0f0ff' }}
                    placeholder="your name"
                  />
                </div>
              )}
              <div>
                <label className="block font-pixel text-xs mb-1" style={{ color: '#40e8ff80' }}>▶ EMAIL</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full bg-transparent font-pixel text-sm px-3 py-2 outline-none"
                  style={{ border: '1px solid rgba(64,232,255,0.35)', color: '#c0f0ff' }}
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label className="block font-pixel text-xs mb-1" style={{ color: '#40e8ff80' }}>▶ PASSWORD</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full bg-transparent font-pixel text-sm px-3 py-2 outline-none"
                  style={{ border: '1px solid rgba(64,232,255,0.35)', color: '#c0f0ff' }}
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="pixel-action-btn w-full justify-center py-3"
                style={{ fontSize: '13px' }}
              >
                {loading ? '...' : isSignUp ? '▶ アカウントを作成' : '▶ ログイン'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div style={{ flex: 1, height: 1, background: 'rgba(64,232,255,0.20)' }} />
              <span className="font-pixel text-xs" style={{ color: '#40e8ff40' }}>または</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(64,232,255,0.20)' }} />
            </div>

            {/* OAuth buttons */}
            <div className="space-y-2">
              <button
                onClick={() => signIn('google', { callbackUrl: '/' })}
                className="w-full flex items-center justify-center gap-3 py-3 font-pixel text-sm border-2 transition-none"
                style={{ background: 'white', borderColor: '#40e8ff', color: '#111', boxShadow: '0 0 10px rgba(64,232,255,0.3)' }}
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google で{isSignUp ? '新規登録' : 'ログイン'}
              </button>
              <button
                onClick={() => signIn('line', { callbackUrl: '/' })}
                className="w-full flex items-center justify-center gap-3 py-3 font-pixel text-sm border-2 transition-none"
                style={{ background: '#06C755', borderColor: '#40e8ff', color: 'white', boxShadow: '0 0 10px rgba(64,232,255,0.3)' }}
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 32 32" fill="white">
                  <path d="M16 2C8.28 2 2 7.58 2 14.4c0 5.88 4.62 10.8 10.82 12.06.42.1 1 .28 1.14.64.14.32.1.82.04 1.14l-.18 1.08c-.06.32-.28 1.26 1.1.68 1.38-.58 7.44-4.38 10.16-7.5C27.22 20.12 30 17.44 30 14.4 30 7.58 23.72 2 16 2z" />
                </svg>
                LINE で{isSignUp ? '新規登録' : 'ログイン'}
              </button>
            </div>

            {/* Sign up / Login toggle */}
            <div className="text-center pt-1">
              <button
                onClick={() => { setIsSignUp(v => !v); setError('') }}
                className="font-pixel text-xs"
                style={{ color: '#ff40c0', background: 'none', border: 'none', cursor: 'pointer', textShadow: '0 0 6px rgba(255,64,192,0.50)' }}
              >
                {isSignUp ? 'ログインはこちら →' : '新規登録はこちら →'}
              </button>
            </div>
          </div>

          <div className="pixel-statusbar">★ 2P PROF — ともだちと紹介しあおう！ ★</div>
        </div>
      </div>
    </div>
  )
}
