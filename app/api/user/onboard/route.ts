import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { SELF_QA_ANSWER_MAX, SELF_QA_QUESTIONS } from '@/lib/self-qa-questions'
import { connectWithInviter, inviteStatus } from '@/lib/invite'

// check: true のときは名前とハンドルを確かめるだけで保存しない（質問ステップに進む前に使う）
// qa: 初期登録の質問への答え。順番は SELF_QA_QUESTIONS と同じ
export async function POST(req: Request) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { name, handle, bio, qa, check } = await req.json()
    if (!name?.trim() || !handle?.trim()) {
      return Response.json({ error: '名前とハンドルは必須です' }, { status: 400 })
    }

    // handle は英数字とアンダースコアのみ
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(handle)) {
      return Response.json({ error: 'ハンドルは英数字・_のみ、3〜20文字で入力してください' }, { status: 400 })
    }

    // 重複チェック
    const dup = await sql`
      SELECT id FROM users WHERE handle = ${handle} AND id != ${userId}
    `
    if (dup.length > 0) {
      return Response.json({ error: 'このハンドルはすでに使われています' }, { status: 409 })
    }

    // 招待制: 誰かの招待リンクを使った人だけが登録を終えられる（すでに登録済みの人の作り直しは除く）
    const [cur] = await sql`SELECT onboarded FROM users WHERE id = ${userId}::uuid`
    if (!cur?.onboarded && !(await inviteStatus(userId)).inviter) {
      return Response.json({ error: '招待が必要です', code: 'invite_required' }, { status: 403 })
    }

    if (check) return Response.json({ ok: true })

    // 答えていない質問も残しておくと、あとで [編集] から答えられる
    const answers: unknown[] = Array.isArray(qa) ? qa : []
    const items = SELF_QA_QUESTIONS.map((q, i) => ({
      q,
      a: typeof answers[i] === 'string' ? (answers[i] as string).trim().slice(0, SELF_QA_ANSWER_MAX) : '',
    }))

    await sql`
      UPDATE users
      SET name = ${name.trim()}, handle = ${handle.trim()}, bio = ${bio?.trim() || null}, onboarded = TRUE
      WHERE id = ${userId}
    `
    // すでに自分の回答がある人（作り直しなど）は上書きしない
    await sql`
      INSERT INTO self_qa (user_id, items, updated_at)
      VALUES (${userId}::uuid, ${JSON.stringify(items)}, NOW())
      ON CONFLICT (user_id) DO NOTHING
    `
    // 招待してくれた友達とお互いにフォローした状態で始める
    if (!cur?.onboarded) await connectWithInviter(userId)

    return Response.json({ ok: true })
  } catch (e) {
    console.error('[POST /api/user/onboard]', e)
    return Response.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
