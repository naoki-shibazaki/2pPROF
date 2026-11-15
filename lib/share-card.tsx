import { ImageResponse } from 'next/og'
import { PALETTE, SPRITE } from '@/components/AvatarSVG'

// Instagram などのストーリー用画像（1080×1920）
//   intro: 友達が書いた紹介文を 1 件のせる
//   ask: 「どんな人？」と紹介文を募集する
// 上下はストーリーの UI（名前・返信欄）に隠れるので、大事な文字は中央寄りに置く

const W = 1080
const H = 1920
const BG = '#080614'
const CYAN = '#40e8ff'
const PINK = '#ff40c0'
const GREEN = '#38ff78'
const TEXT = '#f0ecff'
const SUB = '#b0a8d0'
export const SHARE_HOST = '2p-profile.info'
// 紹介文はこれより長いと切って「続きはアプリで」にする
const INTRO_MAX = 80

export type ShareCardUser = { name: string; handle: string; image: string | null; introCount: number }
export type ShareCardIntro = { body: string; metYear: number | null; author: string | null }

// 使う文字だけを含む DotGothic16 を Google Fonts から取る（全部入りは数 MB あるため）
async function loadFont(text: string): Promise<ArrayBuffer> {
  const css = await fetch(`https://fonts.googleapis.com/css2?family=DotGothic16&text=${encodeURIComponent(text)}`).then(r => r.text())
  const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1]
  if (!url) throw new Error('font url not found')
  return fetch(url).then(r => r.arrayBuffer())
}

function Avatar({ image, size }: { image: string | null; size: number }) {
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} width={size} height={size} style={{ objectFit: 'cover', border: `6px solid ${CYAN}` }} />
  }
  // 1 ドットを整数 px にしないと、ドットの間に細い線が出る
  const px = Math.floor((size - 12) / 16)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: px * 16 + 12, height: px * 16 + 12, background: '#120c2c', border: `6px solid ${CYAN}` }}>
      {SPRITE.map((row, y) => (
        <div key={y} style={{ display: 'flex' }}>
          {row.map((c, x) => <div key={x} style={{ width: px, height: px, background: c ? PALETTE[c] : 'transparent' }} />)}
        </div>
      ))}
    </div>
  )
}

const BRAND_TEXT = '2P PROF招待制のプロフィールアプリ'

function Brand() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ width: 18, height: 18, background: '#ff4060' }} />
        <div style={{ width: 18, height: 18, background: '#ffaa28' }} />
        <div style={{ width: 18, height: 18, background: GREEN }} />
      </div>
      <div style={{ fontSize: 44, color: '#ffd700', letterSpacing: 4 }}>2P PROF</div>
      <div style={{ fontSize: 30, color: SUB }}>招待制のプロフィールアプリ</div>
    </div>
  )
}

function Cta({ title, url }: { title: string; url: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '36px 40px', border: `4px solid ${PINK}`, background: 'rgba(255,64,192,0.10)' }}>
      <div style={{ fontSize: 42, color: TEXT }}>{title}</div>
      <div style={{ fontSize: 36, color: CYAN }}>{url}</div>
    </div>
  )
}

function introCard(user: ShareCardUser, intro: ShareCardIntro, url: string) {
  const full = intro.body.replace(/\s+/g, ' ').trim()
  const cut = full.length > INTRO_MAX
  const quote = cut ? full.slice(0, INTRO_MAX) + '…' : full
  const heading = `${intro.author || '友達'} から見た ${user.name}`
  const years = intro.metYear ? new Date().getFullYear() - intro.metYear : null
  const since = years && years > 0 ? `知り合って ${years} 年` : intro.metYear ? `${intro.metYear} 年に知り合った` : ''
  const label = '友達が書いた紹介文'
  const more = '続きはアプリで'
  const cta = 'あなたの紹介も、友達に書いてもらおう'

  const element = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36, width: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 34, color: PINK }}>
          <div style={{ width: 16, height: 16, background: PINK }} />
          {label}
        </div>
        <div style={{ fontSize: 68, color: TEXT, lineHeight: 1.3 }}>{heading}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28, padding: '52px 56px', border: `4px solid ${CYAN}`, background: 'rgba(64,232,255,0.07)', boxShadow: '0 0 40px rgba(64,232,255,0.25)' }}>
        <div style={{ fontSize: 48, color: TEXT, lineHeight: 1.6 }}>{`「${quote}」`}</div>
        {(since || cut) && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 32, color: SUB }}>
            <div>{since}</div>
            <div style={{ color: CYAN }}>{cut ? more : ''}</div>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <Avatar image={user.image} size={150} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 56, color: TEXT }}>{user.name}</div>
          <div style={{ fontSize: 34, color: SUB }}>{`@${user.handle}`}</div>
        </div>
      </div>
      <Cta title={cta} url={url} />
    </div>
  )
  return { element, text: [heading, quote, since, label, more, cta, user.name, user.handle].join('') }
}

function askCard(user: ShareCardUser, url: string) {
  const line1 = `${user.name} って`
  const line2 = 'どんな人？'
  const ask = '知っている人は、紹介文を書いてください'
  const count = user.introCount > 0 ? `これまでに ${user.introCount} 人が書いてくれました` : ''
  const cta = '招待制。このリンクから参加できます'

  const element = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 48, width: '100%' }}>
      <Avatar image={user.image} size={340} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <div style={{ fontSize: 96, color: TEXT, lineHeight: 1.25 }}>{line1}</div>
        <div style={{ fontSize: 120, color: CYAN, lineHeight: 1.25, textShadow: '0 0 30px rgba(64,232,255,0.6)' }}>{line2}</div>
        <div style={{ fontSize: 34, color: SUB, marginTop: 12 }}>{`@${user.handle}`}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ fontSize: 44, color: TEXT }}>{ask}</div>
        {count && <div style={{ fontSize: 34, color: GREEN }}>{count}</div>}
      </div>
      <Cta title={cta} url={url} />
    </div>
  )
  return { element, text: [line1, line2, ask, count, cta, user.handle].join('') }
}

export async function renderShareCard(user: ShareCardUser, intro: ShareCardIntro | null) {
  const url = `${SHARE_HOST}/s/${user.handle}`
  const { element, text } = intro ? introCard(user, intro, url) : askCard(user, url)
  const font = await loadFont(text + BRAND_TEXT + url + '「」…@0123456789')

  return new ImageResponse(
    (
      <div style={{
        // 上 240px・下 300px はストーリーの UI と重なるので空けておく
        width: W, height: H, display: 'flex', flexDirection: 'column',
        padding: '240px 72px 300px', fontFamily: 'DotGothic16',
        backgroundColor: BG, backgroundImage: `linear-gradient(180deg, #18042e 0%, ${BG} 30%, ${BG} 70%, #0a1a2e 100%)`,
      }}>
        <Brand />
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', paddingTop: 40 }}>{element}</div>
      </div>
    ),
    {
      width: W,
      height: H,
      fonts: [{ name: 'DotGothic16', data: font, weight: 400, style: 'normal' }],
      headers: { 'Cache-Control': 'private, no-store' },
    },
  )
}
