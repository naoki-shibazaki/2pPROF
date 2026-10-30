import { sql } from '@/lib/db'

type QA = { q: string; a: string }
export type CommonAnswer = { q: string; a: string; b: string; word: string }
export type MiniUser = { id: string; name: string | null; handle: string | null; image: string | null }

export const CONNECT_MESSAGE_MAX = 100

// 「旅行❣️料理❣️飲み行く‼️」のような答えを、比べやすい言葉に分ける（絵文字・記号・空白で区切る）
const SPLIT = new RegExp('[^\\p{L}\\p{N}]+', 'u')
const HAN = new RegExp('\\p{Script=Han}', 'u')
function words(answer: string) {
  return answer
    .normalize('NFKC')
    .toLowerCase()
    .split(SPLIT)
    .filter(w => w.length >= 2 || HAN.test(w))
}

// 同じ質問に、同じ言葉（片方がもう片方を含むものも）で答えているところ
export function commonAnswers(mine: QA[], theirs: QA[]): CommonAnswer[] {
  const byQ = new Map(theirs.filter(t => t.a?.trim()).map(t => [t.q, t.a]))
  const out: CommonAnswer[] = []
  for (const m of mine) {
    const b = byQ.get(m.q)
    if (!m.a?.trim() || !b) continue
    const wa = words(m.a), wb = words(b)
    // 2 文字以上なら含んでいれば同じ（千葉 / 千葉県）。1 文字の漢字は頭が同じときだけ（犬 / 犬派）
    const same = (x: string, y: string) => x === y
      || (Math.min(x.length, y.length) >= 2 ? x.includes(y) || y.includes(x) : x.startsWith(y) || y.startsWith(x))
    const hit = wa.find(x => wb.some(y => same(x, y)))
    if (hit) {
      const other = wb.find(y => same(hit, y)) ?? hit
      out.push({ q: m.q, a: m.a.trim(), b: b.trim(), word: hit.length <= other.length ? hit : other })
    }
  }
  return out
}

async function itemsOf(userId: string): Promise<QA[]> {
  const [r] = await sql`SELECT items FROM self_qa WHERE user_id = ${userId}::uuid`
  return Array.isArray(r?.items) ? (r.items as QA[]) : []
}

// 2 人の共通点（同じ答え・共通の友達）
export async function commonBetween(aId: string, bId: string) {
  const [qa, qb, mutual] = await Promise.all([
    itemsOf(aId),
    itemsOf(bId),
    sql`
      SELECT u.id, u.name, u.handle, u.image
      FROM follows fa
      JOIN follows fb ON fb.following_id = fa.following_id AND fb.follower_id = ${bId}::uuid
      JOIN users u ON u.id = fa.following_id
      WHERE fa.follower_id = ${aId}::uuid AND u.id <> ${aId}::uuid AND u.id <> ${bId}::uuid
      ORDER BY u.name NULLS LAST
      LIMIT 20
    `,
  ])
  return { answers: commonAnswers(qa, qb), mutual: mutual as MiniUser[] }
}

// 友達どうしの紹介（「この 2 人、合いそう」）
let ready: Promise<unknown> | null = null
export function ensureConnectionsTable() {
  ready ??= (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS connections (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        introducer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        a_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        b_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `
    // 同じ人が同じ 2 人を何度も紹介しない（a_id < b_id の順で保存する）
    await sql`CREATE UNIQUE INDEX IF NOT EXISTS connections_pair ON connections (introducer_id, a_id, b_id)`
    // 通知に「誰を紹介されたか」を持たせる
    await sql`ALTER TABLE notifications ADD COLUMN IF NOT EXISTS ref_user_id UUID REFERENCES users(id) ON DELETE CASCADE`
  })().catch(e => { ready = null; throw e })
  return ready
}

// a と b の間の紹介（誰が、どんな一言で）
export async function connectionsBetween(aId: string, bId: string) {
  await ensureConnectionsTable()
  const [lo, hi] = aId < bId ? [aId, bId] : [bId, aId]
  return sql`
    SELECT c.message, c.created_at, u.name AS introducer_name, u.handle AS introducer_handle
    FROM connections c JOIN users u ON u.id = c.introducer_id
    WHERE c.a_id = ${lo}::uuid AND c.b_id = ${hi}::uuid
    ORDER BY c.created_at DESC
    LIMIT 5
  ` as unknown as Promise<{ message: string; created_at: string; introducer_name: string | null; introducer_handle: string | null }[]>
}
