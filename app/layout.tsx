import type { Metadata, Viewport } from 'next'
import { DotGothic16 } from 'next/font/google'
import './globals.css'

// DotGothic16: pixel font covering Latin + Japanese
const pixelFont = DotGothic16({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pixel',
  preload: false, // CJK fonts are large; let browser fetch lazily
})

export const metadata: Metadata = {
  title: '2P PROF',
  description: '自己紹介＋他者紹介のプロフィールSNS',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={pixelFont.variable}>
      <body className={`${pixelFont.className} min-h-screen overflow-x-hidden`}>
        {children}
      </body>
    </html>
  )
}
