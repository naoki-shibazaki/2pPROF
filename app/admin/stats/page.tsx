'use client'

import { useEffect, useState } from 'react'

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

type Day = { day: string; signups: number; active: number; opens: number }
type Stats = {
  users: number; signups_today: number; signups_7d: number
  dau: number; wau: number; mau: number; tracking_since: string | null
  daily: Day[]
}

// 利用状況（ADMIN_EMAILS に登録したアカウントのみ）
export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [forbidden, setForbidden] = useState(false)

  useEffect(() => {
    fetch('/api/admin/stats').then(async r => {
      if (r.status === 403) { setForbidden(true); return }
      setStats(await r.json())
    })
  }, [])

  const card = (label: string, value: number | string, note?: string, color = '#40e8ff') => (
    <div style={{ flex: '1 1 140px', border: `1px solid ${color}55`, background: 'rgba(8,6,20,0.9)', padding: '14px 12px' }}>
      <div style={{ fontSize: 13, color: '#8a80b0' }}>{label}</div>
      <div style={{ fontSize: 30, color, marginTop: 4, textShadow: `0 0 8px ${color}88` }}>{value}</div>
      {note && <div style={{ fontSize: 12, color: '#7a70a0', marginTop: 2 }}>{note}</div>}
    </div>
  )

  const maxActive = Math.max(1, ...(stats?.daily.map(d => Math.max(d.active, d.signups)) ?? [1]))

  return (
    <div style={{ minHeight: '100dvh', background: '#04020c', color: '#b0a8d0', padding: '32px 16px', maxWidth: 720, margin: '0 auto', ...STYLE }}>
      <a href="/admin" style={{ fontSize: 14, color: '#40e8ff' }}>◀ 管理画面</a>
      <h1 style={{ fontSize: 20, color: '#ff40c0', margin: '16px 0 4px' }}>利用状況</h1>
      <p style={{ fontSize: 13, color: '#8a7aa8', marginBottom: 20 }}>
        日本時間で集計。審査用・テスト用アカウントは除外。ダウンロード数は App Store Connect の「アプリ分析」で見られます
      </p>

      {forbidden ? (
        <p style={{ fontSize: 14, color: '#ff4060' }}>このページを見る権限がありません</p>
      ) : !stats ? (
        <p style={{ fontSize: 14 }}>読み込み中...</p>
      ) : (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {card('登録ユーザー', stats.users, `今日 +${stats.signups_today} ／ 7日 +${stats.signups_7d}`, '#ffd700')}
            {card('DAU', stats.dau, '今日開いた人')}
            {card('WAU', stats.wau, '直近7日に開いた人')}
            {card('MAU', stats.mau, '直近30日に開いた人')}
            {card('MAU ÷ 登録', stats.users ? `${Math.round((stats.mau / stats.users) * 100)}%` : '-', 'アクティブ率', '#38ff78')}
          </div>
          {stats.tracking_since && (
            <p style={{ fontSize: 12, color: '#7a70a0', marginTop: 8 }}>
              アクティブの記録は {String(stats.tracking_since).slice(0, 10)} から（それ以前は最後に開いた日だけ）
            </p>
          )}

          <h2 style={{ fontSize: 16, color: '#40e8ff', margin: '28px 0 10px' }}>直近30日</h2>
          <div style={{ display: 'flex', gap: 16, fontSize: 12, marginBottom: 8 }}>
            <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#40e8ff', marginRight: 4 }} />アクティブ人数</span>
            <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#ffd700', marginRight: 4 }} />新規登録</span>
          </div>
          <div style={{ border: '1px solid rgba(64,232,255,0.25)' }}>
            {[...stats.daily].reverse().map(d => (
              <div key={d.day} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 10px', borderBottom: '1px solid rgba(64,232,255,0.08)', fontSize: 13 }}>
                <span style={{ width: 52, color: '#8a80b0', flexShrink: 0 }}>{d.day.slice(5).replace('-', '/')}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ height: 8, width: `${(d.active / maxActive) * 100}%`, background: '#40e8ff', minWidth: d.active ? 2 : 0 }} />
                  <div style={{ height: 5, marginTop: 2, width: `${(d.signups / maxActive) * 100}%`, background: '#ffd700', minWidth: d.signups ? 2 : 0 }} />
                </div>
                <span style={{ width: 92, textAlign: 'right', flexShrink: 0, color: '#d0c8f0' }}>
                  {d.active}人{d.signups ? <span style={{ color: '#ffd700' }}> +{d.signups}</span> : null}
                </span>
                <span style={{ width: 52, textAlign: 'right', flexShrink: 0, color: '#7a70a0' }}>{d.opens}回</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
