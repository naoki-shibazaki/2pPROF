import { ReactNode } from 'react'

interface PixelWindowProps {
  children: ReactNode
  title?: string
  rightSlot?: ReactNode
  /** 画面いっぱいに広げる（上のふちにタイトル、下のふちに中身の最後＝タブが付く） */
  fullscreen?: boolean
}

/**
 * Classic RPG / Windows-95 hybrid dialog window.
 *
 * Structure:
 *   ┌─────────────────────────────┐
 *   │ ◼ ◼ ◼   ★ 2P PROF ★      │  ← title bar (#000080)
 *   ├─────────────────────────────┤
 *   │   [tab bar]                 │
 *   │   [content]                 │
 *   │   [status bar]              │
 *   └─────────────────────────────┘
 *
 * Border: 4px #1a1a4e + inset 2px #6060cc glow + 4px offset drop shadow
 */
export default function PixelWindow({ children, title = '2P PROF', rightSlot, fullscreen }: PixelWindowProps) {
  if (fullscreen) {
    return (
      <div className="pixel-screen">
        <div className="pixel-titlebar pixel-titlebar--screen">
          <div className="flex gap-1">
            <div className="pixel-btn-chrome" />
            <div className="pixel-btn-chrome" />
            <div className="pixel-btn-chrome" />
          </div>
          <span className="flex-1 text-center text-pixel-shadow tracking-widest">
            {title}
          </span>
          {rightSlot && <div style={{ display: 'flex', alignItems: 'center' }}>{rightSlot}</div>}
        </div>
        <div className="pixel-screen-body scanlines">
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full" style={{ maxWidth: 360 }}>
      {/* ── Title bar ── */}
      <div className="pixel-titlebar">
        <div className="flex gap-1">
          <div className="pixel-btn-chrome" />
          <div className="pixel-btn-chrome" />
          <div className="pixel-btn-chrome" />
        </div>
        <span className="flex-1 text-center text-pixel-shadow tracking-widest">
          {title}
        </span>
        {rightSlot && <div style={{ display: 'flex', alignItems: 'center' }}>{rightSlot}</div>}
      </div>

      {/* ── Window body ── */}
      <div className="pixel-window overflow-hidden relative scanlines">
        {children}
      </div>
    </div>
  )
}
