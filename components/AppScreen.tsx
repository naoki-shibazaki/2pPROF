import { ReactNode } from 'react'
import PixelBackground from './PixelBackground'
import AppNav from './AppNav'

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

interface AppScreenProps {
  children: ReactNode
  title: ReactNode
  /** タイトルの左（もどるボタンなど）。なければウィンドウ風の 3 つの点 */
  left?: ReactNode
  /** タイトルの右（ボタンなど） */
  right?: ReactNode
  /** 下のふちに付けるもの（タブなど） */
  footer?: ReactNode
  /** true: 中身をこの画面がスクロールさせる。false: 中身が自分でスクロールを持つ */
  scroll?: boolean
  /** 下にホームのタブを出す（ログインしている人が見るページ） */
  nav?: boolean
}

/**
 * 画面いっぱいのレイアウト（LINE などのアプリと同じ形）。
 * 上のふちにタイトル、下のふちに footer、そのあいだで中身だけがスクロールする。ページ全体は動かない
 */
export default function AppScreen({ children, title, left, right, footer, scroll = true, nav }: AppScreenProps) {
  return (
    <div className="relative">
      <PixelBackground />
      <main role="main" className="pixel-screen">
        <div className="pixel-titlebar pixel-titlebar--screen">
          <div style={{ minWidth: 64, display: 'flex', alignItems: 'center' }}>
            {left ?? (
              <div className="flex gap-1">
                <div className="pixel-btn-chrome" />
                <div className="pixel-btn-chrome" />
                <div className="pixel-btn-chrome" />
              </div>
            )}
          </div>
          <span
            className="flex-1 text-center text-pixel-shadow tracking-widest"
            style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {title}
          </span>
          <div style={{ minWidth: 64, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>{right}</div>
        </div>
        <div className="pixel-screen-body scanlines">
          {scroll ? <div className="overflow-y-auto pixel-screen-scroll">{children}</div> : children}
          {footer ?? (nav ? <AppNav /> : null)}
        </div>
      </main>
    </div>
  )
}

/** タイトルの左に置く「‹ もどる」 */
export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{ ...STYLE, fontSize: 14, color: '#ff40c0', background: 'none', border: 'none', cursor: 'pointer', textShadow: '0 0 6px rgba(255,64,192,0.60)', padding: '0 4px', minHeight: 36 }}
    >
      ‹ もどる
    </button>
  )
}

/** タイトルの左に置く「‹ もどる」（リンク版。サーバーで描くページ用） */
export function BackLink({ href = '/' }: { href?: string }) {
  return (
    <a
      href={href}
      style={{ ...STYLE, fontSize: 14, color: '#ff40c0', textShadow: '0 0 6px rgba(255,64,192,0.60)', padding: '0 4px', minHeight: 36, display: 'flex', alignItems: 'center' }}
    >
      ‹ もどる
    </a>
  )
}
