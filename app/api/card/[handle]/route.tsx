import { ImageResponse } from '@vercel/og'
import { sql } from '@/lib/db'
import { getProximityTitle } from '@/lib/proximity'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params
  const { searchParams } = new URL(req.url)
  const style = searchParams.get('style') ?? 'twitter'
  const isStory = style === 'story'

  // フォント読み込み (Node.js runtime)
  const fontData = readFileSync(join(process.cwd(), 'public/fonts/PressStart2P.ttf'))

  // ユーザー情報 + Q&A 取得
  const rows = await sql`
    SELECT u.name, u.handle, u.bio, u.proximity_count,
           sq.items AS qa_items
    FROM users u
    LEFT JOIN self_qa sq ON sq.user_id = u.id
    WHERE u.handle = ${handle}
  `
  if (!rows[0]) return new Response('Not Found', { status: 404 })
  const user = rows[0]

  const pt = getProximityTitle(Number(user.proximity_count ?? 0))
  const qaItems = (Array.isArray(user.qa_items) ? user.qa_items : [])
    .filter((q: { a?: string }) => q.a?.trim())
    .slice(0, 2)

  const W = isStory ? 1080 : 1200
  const H = isStory ? 1920 : 630
  const pad = isStory ? 72 : 48
  const fs = (tw: number, st: number) => isStory ? st : tw

  return new ImageResponse(
    (
      <div
        style={{
          width: W, height: H,
          background: 'linear-gradient(160deg, #04020c 0%, #110630 50%, #04020c 100%)',
          display: 'flex',
          flexDirection: 'column',
          padding: pad,
          fontFamily: '"PressStart2P"',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 外枠ボーダー */}
        <div style={{
          position: 'absolute', inset: 10,
          border: '3px solid #ff40c0',
          boxShadow: '0 0 30px rgba(255,64,192,0.45), inset 0 0 30px rgba(255,64,192,0.07)',
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute', inset: 16,
          border: '1px solid rgba(255,64,192,0.30)',
          display: 'flex',
        }} />

        {/* スキャンライン風装飾 */}
        {[...Array(isStory ? 24 : 12)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: 0, right: 0,
            top: (H / (isStory ? 24 : 12)) * i,
            height: 1,
            background: 'rgba(255,64,192,0.04)',
            display: 'flex',
          }} />
        ))}

        {/* ヘッダー */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: fs(24, 48),
          borderBottom: '1px solid rgba(255,64,192,0.30)',
          paddingBottom: fs(14, 28),
        }}>
          <span style={{
            fontSize: fs(14, 26), color: '#ff40c0',
            textShadow: '0 0 12px rgba(255,64,192,0.9)',
            letterSpacing: '0.08em', display: 'flex',
          }}>
            ★ 2P PROF ★
          </span>
          <span style={{ fontSize: fs(10, 18), color: '#604878', display: 'flex' }}>
            @{user.handle}
          </span>
        </div>

        {/* 名前 */}
        <div style={{
          fontSize: fs(32, 60), color: '#d0c8f0',
          letterSpacing: '0.12em',
          textShadow: '0 0 14px rgba(208,200,240,0.5)',
          marginBottom: fs(16, 36),
          display: 'flex',
        }}>
          {(user.name ?? user.handle ?? '???').slice(0, 16)}
        </div>

        {/* 称号バッジ */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: fs(12, 24),
          marginBottom: fs(20, 40),
        }}>
          <div style={{
            display: 'flex',
            background: `${pt.color}1a`,
            border: `1px solid ${pt.color}55`,
            padding: `${fs(6, 12)}px ${fs(12, 24)}px`,
          }}>
            <span style={{
              fontSize: fs(11, 20), color: pt.color,
              textShadow: `0 0 8px ${pt.color}`,
              display: 'flex',
            }}>
              ⚔ {pt.title}
            </span>
          </div>
          <span style={{ fontSize: fs(10, 18), color: '#ffd700', display: 'flex' }}>
            {user.proximity_count ?? 0}回
          </span>
        </div>

        {/* Bio */}
        {user.bio && (
          <div style={{
            fontSize: fs(11, 20), color: '#b0a8d0', lineHeight: 1.9,
            background: 'rgba(64,232,255,0.05)',
            border: '1px solid rgba(64,232,255,0.20)',
            padding: `${fs(12, 24)}px ${fs(16, 28)}px`,
            marginBottom: fs(20, 40),
            display: 'flex',
            flexWrap: 'wrap',
          }}>
            {(user.bio as string).slice(0, isStory ? 100 : 70)}
            {(user.bio as string).length > (isStory ? 100 : 70) ? '…' : ''}
          </div>
        )}

        {/* Q&A */}
        {qaItems.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: fs(12, 24), flex: 1 }}>
            {qaItems.map((item: { q: string; a: string }, i: number) => (
              <div key={i} style={{
                display: 'flex', flexDirection: 'column', gap: fs(6, 12),
                borderLeft: `${fs(2, 4)}px solid #40e8ff`,
                paddingLeft: fs(12, 24),
              }}>
                <span style={{ fontSize: fs(9, 16), color: '#40e8ff', display: 'flex' }}>
                  Q. {item.q.slice(0, 30)}{item.q.length > 30 ? '…' : ''}
                </span>
                <span style={{ fontSize: fs(10, 18), color: '#38ff78', display: 'flex' }}>
                  {item.a.slice(0, isStory ? 50 : 40)}{item.a.length > (isStory ? 50 : 40) ? '…' : ''}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* フッター */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
          marginTop: 'auto', paddingTop: fs(12, 24),
          borderTop: '1px solid rgba(64,56,96,0.40)',
        }}>
          <span style={{ fontSize: fs(8, 14), color: '#302848', display: 'flex' }}>
            2pprof.vercel.app
          </span>
        </div>
      </div>
    ),
    {
      width: W,
      height: H,
      fonts: [{ name: 'PressStart2P', data: fontData, weight: 400, style: 'normal' }],
    }
  )
}
