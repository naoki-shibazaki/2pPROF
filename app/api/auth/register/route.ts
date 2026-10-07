import { NextResponse } from 'next/server'
import { sql, pool } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const { email, password, name } = await req.json()
  if (!email || !password) {
    return NextResponse.json({ error: 'メールアドレスとパスワードを入力してください' }, { status: 400 })
  }
  if ((password as string).length < 8) {
    return NextResponse.json({ error: 'パスワードは8文字以上にしてください' }, { status: 400 })
  }

  const existing = await sql`SELECT id FROM users WHERE email = ${email}`
  if (existing.length > 0) {
    return NextResponse.json({ error: 'このメールアドレスは既に登録されています' }, { status: 409 })
  }

  const hashed_password = await bcrypt.hash(password as string, 12)

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const { rows } = await client.query(
      'INSERT INTO users (email, name) VALUES ($1, $2) RETURNING id',
      [email, name || null]
    )
    const userId = rows[0].id
    await client.query(
      'INSERT INTO accounts ("userId", type, provider, "providerAccountId", hashed_password) VALUES ($1, $2, $3, $4, $5)',
      [userId, 'credentials', 'email-password', email, hashed_password]
    )
    await client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK')
    console.error('register error', e)
    return NextResponse.json({ error: 'アカウント作成に失敗しました' }, { status: 500 })
  } finally {
    client.release()
  }

  return NextResponse.json({ ok: true })
}
