import { auth } from '@/auth'
import { createReport, REPORT_CONTENT_TYPES, REPORT_REASONS, resolveContent, type ReportContentType, type ReportReason } from '@/lib/moderation'

// POST: 不適切なコンテンツ・ユーザーを通報する
export async function POST(req: Request) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const myId = (session?.user as any)?.id
  if (!myId) return Response.json({ ok: false }, { status: 401 })

  try {
    const { contentType, contentId, handle, reason, detail } = await req.json()
    if (!REPORT_CONTENT_TYPES.includes(contentType) || !(reason in REPORT_REASONS) || reason === 'block') {
      return Response.json({ ok: false }, { status: 400 })
    }
    const content = await resolveContent(contentType as ReportContentType, contentId ?? null, handle ?? null)
    if (!content) return Response.json({ ok: false }, { status: 404 })
    if (content.authorId === myId) return Response.json({ ok: false, error: '自分の投稿は通報できません' }, { status: 400 })

    await createReport({
      reporterId: myId,
      targetUserId: content.authorId,
      contentType,
      contentId: contentId ?? null,
      body: content.body,
      reason: reason as ReportReason,
      detail: typeof detail === 'string' ? detail.slice(0, 500) : null,
    })
    return Response.json({ ok: true })
  } catch (e) {
    console.error('[POST /api/reports]', e)
    return Response.json({ ok: false, error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
