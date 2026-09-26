const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

export default function OthersTab() {
  return (
    <div
      className="overflow-y-auto"
      style={{ background: 'transparent', maxHeight: 'calc(100dvh - 180px)' }}
    >
      {/* Sub-header */}
      <div
        className="px-3 py-2 text-center"
        style={{
          ...STYLE,
          background: 'rgba(4, 10, 22, 0.85)',
          borderBottom: '1px solid rgba(64,232,255,0.30)',
          color: '#40e8ff',
          fontSize: 12,
          letterSpacing: '0.06em',
          textShadow: '0 0 7px rgba(64,232,255,0.60)',
        }}
      >
        ♡ ともだちからの紹介文 ♡
      </div>

      <div className="flex flex-col items-center gap-3 py-12">
        <span style={{ fontSize: 36 }}>📝</span>
        <p style={{ ...STYLE, fontSize: 10, color: '#504870', textAlign: 'center', lineHeight: 2.2 }}>
          まだ紹介文がありません<br />ともだちに紹介してもらおう
        </p>
      </div>
    </div>
  )
}
