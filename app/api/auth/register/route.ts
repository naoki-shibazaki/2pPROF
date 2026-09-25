import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const { email, password, name } = await req.json()
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
  }

  const existing = await sql`SELECT id FROM users WHERE email = ${email}`
  if (existing.length > 0) {
    return NextResponse.json({ error: 'このメールアドレスは既に登録されています' }, { status: 409 })
  }

  const hashed_password = await bcrypt.hash(password as string, 12)

  const newUser = await sql`
    INSERT INTO users (email, name)
    VALUES (${email}, ${name || null})
    RETURNING id
  `
  const userId = newUser[0].id

  await sql`
    INSERT INTO accounts ("userId", type, provider, "providerAccountId", hashed_password)
    VALUES (${userId}, 'credentials', 'email-password', ${email as string}, ${hashed_password})
  `

  return NextResponse.json({ ok: true })
}
