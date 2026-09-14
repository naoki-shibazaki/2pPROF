import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

// テーブルが無ければ作成（初回のみ実行）
async function ensureTable() {
  await sql`
    create table if not exists reactions (
      id           bigserial primary key,
      friend_index int  not null,
      reaction     text not null,
      visitor_id   text not null,
      created_at   timestamptz default now(),
      unique (friend_index, reaction, visitor_id)
    )
  `
}

// GET /api/reactions?friendIndex=0&visitorId=xxx
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const friendIndex = Number(searchParams.get('friendIndex') ?? 0)
  const visitorId   = searchParams.get('visitorId') ?? ''

  await ensureTable()

  const rows = await sql`
    select reaction, visitor_id
    from reactions
    where friend_index = ${friendIndex}
  `

  const counts: Record<string, number> = {}
  const mine: string[] = []
  for (const row of rows) {
    counts[row.reaction] = (counts[row.reaction] ?? 0) + 1
    if (row.visitor_id === visitorId) mine.push(row.reaction)
  }

  return NextResponse.json({ counts, mine })
}

// POST /api/reactions  { friendIndex, reaction, visitorId }
export async function POST(req: NextRequest) {
  const { friendIndex, reaction, visitorId } = await req.json()
  if (!visitorId || !reaction) {
    return NextResponse.json({ error: 'missing fields' }, { status: 400 })
  }

  await ensureTable()

  const existing = await sql`
    select id from reactions
    where friend_index = ${friendIndex}
      and reaction     = ${reaction}
      and visitor_id   = ${visitorId}
    limit 1
  `

  if (existing.length > 0) {
    await sql`delete from reactions where id = ${existing[0].id}`
    return NextResponse.json({ action: 'removed' })
  } else {
    await sql`
      insert into reactions (friend_index, reaction, visitor_id)
      values (${friendIndex}, ${reaction}, ${visitorId})
    `
    return NextResponse.json({ action: 'added' })
  }
}
