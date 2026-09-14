import { othersData } from '@/data/profileData'
import ReactionBar from './ReactionBar'

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

      <div className="p-3 flex flex-col gap-4">
        {othersData.map((person, idx) => (
          <article key={idx} className="pixel-friend-card">
            {/* ── Friend header ── */}
            <div className="pixel-friend-card-header">
              {/* Avatar emoji badge */}
              <div
                className="flex items-center justify-center w-9 h-9 shrink-0 text-base"
                style={{
                  background: person.color,
                  border: '2px solid rgba(255,255,255,0.25)',
                  color: '#ffffff',
                  fontFamily: 'monospace',
                  boxShadow: `0 0 8px ${person.color}88`,
                }}
              >
                {person.emoji}
              </div>

              <div className="min-w-0">
                <div
                  className="text-xs font-bold truncate"
                  style={{ ...STYLE, color: '#d0c8f0' }}
                >
                  {person.name}
                </div>
                <div
                  className="text-xs truncate"
                  style={{ ...STYLE, color: '#504870', fontSize: 10 }}
                >
                  @{person.handle}
                </div>
              </div>

              <div
                className="ml-auto text-xs shrink-0"
                style={{
                  ...STYLE,
                  color: '#ffd700',
                  fontSize: 10,
                  textShadow: '0 0 6px rgba(255,215,0,0.50)',
                }}
              >
                ★承認済み
              </div>
            </div>

            {/* ── Introduction text ── */}
            <div className="px-3 py-3">
              <p
                className="text-xs whitespace-pre-line"
                style={{ ...STYLE, color: '#b0a8d0', lineHeight: '2.0' }}
              >
                {person.intro}
              </p>
            </div>

            {/* ── Friend-perspective Q&A ── */}
            {person.qa.length > 0 && (
              <div style={{ borderTop: '1px solid rgba(64,232,255,0.18)' }}>
                <div
                  className="px-3 py-1"
                  style={{
                    ...STYLE,
                    background: 'rgba(4, 10, 22, 0.75)',
                    fontSize: 11,
                    color: '#40e8ff',
                    borderBottom: '1px solid rgba(64,232,255,0.18)',
                    textShadow: '0 0 6px rgba(64,232,255,0.55)',
                  }}
                >
                  ■ {person.name}から見た私
                </div>

                {person.qa.map((item, qIdx) => (
                  <div
                    key={qIdx}
                    className="px-3 py-2"
                    style={{
                      background:
                        qIdx % 2 === 0
                          ? 'rgba(8, 6, 20, 0.65)'
                          : 'rgba(12, 8, 28, 0.65)',
                      borderTop:
                        qIdx > 0 ? '1px solid rgba(64,232,255,0.08)' : undefined,
                    }}
                  >
                    <p
                      className="text-xs"
                      style={{ ...STYLE, color: '#40e8ff88', lineHeight: '1.7' }}
                    >
                      Q: {item.q}
                    </p>
                    <p
                      className="text-xs mt-1"
                      style={{ ...STYLE, color: '#b0a8d0', lineHeight: '1.9' }}
                    >
                      &gt; {item.a}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {/* ── Reactions ── */}
            <ReactionBar friendIndex={idx} />
          </article>
        ))}
      </div>
    </div>
  )
}
