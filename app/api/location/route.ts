// マップ機能は現在非公開
export async function POST() {
  return Response.json({ ok: false }, { status: 503 })
}
