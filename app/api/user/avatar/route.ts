import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { put, del } from '@vercel/blob'

export async function PUT(req: Request) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return Response.json({ error: 'No file' }, { status: 400 })

  // 5MB 制限
  if (file.size > 5 * 1024 * 1024) {
    return Response.json({ error: 'ファイルサイズは5MB以下にしてください' }, { status: 400 })
  }

  const blob = await put(`avatars/${userId}`, file, {
    access: 'public',
    addRandomSuffix: true,
  })

  await sql`UPDATE users SET image = ${blob.url} WHERE id = ${userId}::uuid`

  return Response.json({ url: blob.url })
}

export async function DELETE(req: Request) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const rows = await sql`SELECT image FROM users WHERE id = ${userId}::uuid`
  const current = rows[0]?.image as string | null

  if (current?.includes('vercel-storage.com') || current?.includes('blob.vercel-storage.com')) {
    await del(current).catch(() => {})
  }

  await sql`UPDATE users SET image = NULL WHERE id = ${userId}::uuid`

  return Response.json({ ok: true })
}
