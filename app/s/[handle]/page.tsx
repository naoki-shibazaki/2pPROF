import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { INVITE_LIMIT, INVITE_TOKEN_RE, invitesUsed } from '@/lib/invite'
import AppScreen from '@/components/AppScreen'
import AvatarSVG from '@/components/AvatarSVG'

// ストーリーのリンクから来た人が最初に見るページ（ログインなしで見られる）
// 見せるのは名前・アイコン・紹介文の数だけ。紹介文そのものはログインしてから読む
// ?inv=<招待トークン> が付いていて、招待の枠が残っていれば、その招待でそのまま参加できる

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const
const APP_STORE_URL = 'https://apps.apple.com/app/id6818801467'

type Props = { params: Promise<{ handle: string }>; searchParams: Promise<{ inv?: string }> }

async function getUser(handle: string) {
  const [u] = await sql`
    SELECT u.id, u.name, u.handle, u.image, COALESCE(u.onboarded, FALSE) AS onboarded,
           (SELECT COUNT(*)::int FROM introductions WHERE target_id = u.id) AS intro_count
    FROM users u WHERE u.handle = ${handle}
  `.catch(() => [])
  return u?.onboarded ? u : null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const u = await getUser((await params).handle)
  if (!u) return { title: '2P PROF' }
  const name = u.name || u.handle
  return {
    title: `${name} (@${u.handle}) | 2P PROF`,
    description: `友達が書いた ${name} の紹介文が読めます。2P PROF は招待制のプロフィールアプリです。`,
  }
}

export default async function StoryLandingPage({ params, searchParams }: Props) {
  const { handle } = await params
  const { inv } = await searchParams
  const u = await getUser(handle)
  if (!u) notFound()
  const name: string = u.name || u.handle

  // 招待の枠が残っているときだけ、招待ボタンを出す
  let inviteLeft = 0
  if (inv && INVITE_TOKEN_RE.test(inv)) {
    const [t] = await sql`
      SELECT 1 FROM invite_tokens WHERE token = ${inv} AND creator_id = ${u.id}::uuid AND expires_at > NOW()
    `.catch(() => [])
    if (t) inviteLeft = Math.max(0, INVITE_LIMIT - (await invitesUsed(u.id)))
  }

  const session = await auth()
  const loggedIn = !!session?.user

  return (
    <AppScreen title="2P PROF">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '32px 16px 48px', maxWidth: 480, margin: '0 auto' }}>
        <div style={{ border: '3px solid #40e8ff', boxShadow: '0 0 16px rgba(64,232,255,0.35)', lineHeight: 0 }}>
          {u.image
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={u.image} alt="" width={112} height={112} style={{ objectFit: 'cover', display: 'block' }} />
            : <AvatarSVG size={112} />}
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ ...STYLE, fontSize: 24, color: '#f0ecff' }}>{name}</p>
          <p style={{ ...STYLE, fontSize: 14, color: '#8a7aa8', marginTop: 4 }}>@{u.handle}</p>
        </div>

        <div style={{ ...STYLE, width: '100%', padding: '16px', border: '1px solid rgba(64,232,255,0.35)', background: 'rgba(64,232,255,0.05)', textAlign: 'center' }}>
          {u.intro_count > 0 ? (
            <>
              <p style={{ fontSize: 16, color: '#f0ecff', lineHeight: 1.6 }}>友達が書いた紹介文が <span style={{ color: '#38ff78' }}>{u.intro_count} 件</span> あります</p>
              <p style={{ fontSize: 13, color: '#b0a8d0', marginTop: 6 }}>全文はアプリで読めます</p>
            </>
          ) : (
            <p style={{ fontSize: 16, color: '#f0ecff', lineHeight: 1.6 }}>{name} の紹介文を、最初に書けます</p>
          )}
        </div>

        {loggedIn ? (
          <a href={`/profile/${u.handle}`} style={primaryButton}>プロフィールを見る</a>
        ) : (
          <>
            <div style={{ ...STYLE, textAlign: 'center', fontSize: 14, color: '#d0c8f0', lineHeight: 1.7 }}>
              2P PROF は、友達どうしで紹介文を書き合う<br />招待制のプロフィールアプリです
            </div>
            {inviteLeft > 0 ? (
              <>
                <a href={`/invite/${inv}`} style={primaryButton}>{name} の招待で参加する</a>
                <p style={{ ...STYLE, fontSize: 13, color: '#ff40c0', marginTop: -12 }}>この招待で参加できるのは、あと {inviteLeft} 人</p>
              </>
            ) : (
              <p style={{ ...STYLE, fontSize: 13, color: '#b0a8d0', textAlign: 'center', lineHeight: 1.7 }}>
                参加するには招待が必要です。<br />{name} に招待リンクをもらってください
              </p>
            )}
            <a href={APP_STORE_URL} style={secondaryButton}>App Store で入手</a>
            <a href={`/login?next=/profile/${u.handle}`} style={{ ...STYLE, fontSize: 13, color: '#40e8ff' }}>もう使っている人はログイン</a>
          </>
        )}
      </div>
    </AppScreen>
  )
}

const primaryButton = {
  ...STYLE, display: 'block', width: '100%', textAlign: 'center', fontSize: 16, color: '#080614', background: '#40e8ff',
  padding: '14px 16px', textDecoration: 'none', boxShadow: '0 0 16px rgba(64,232,255,0.45)',
} as const

const secondaryButton = {
  ...STYLE, display: 'block', width: '100%', textAlign: 'center', fontSize: 15, color: '#40e8ff', background: 'transparent',
  padding: '12px 16px', textDecoration: 'none', border: '1px solid rgba(64,232,255,0.6)',
} as const
