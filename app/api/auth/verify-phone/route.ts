import { NextResponse } from 'next/server'
import twilio from 'twilio'
import { sql } from '@/lib/db'
import { randomUUID } from 'crypto'

export async function POST(req: Request) {
  const { phone, code } = await req.json()
  if (!phone || !code) {
    return NextResponse.json({ error: 'Phone and code required' }, { status: 400 })
  }

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!,
  )

  try {
    const check = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID!)
      .verificationChecks.create({ to: phone, code })

    if (check.status !== 'approved') {
      return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 })
    }

    // Create user if not exists
    let rows = await sql`SELECT id FROM users WHERE phone = ${phone}`
    if (rows.length === 0) {
      rows = await sql`
        INSERT INTO users (phone) VALUES (${phone}) RETURNING id
      `
    }

    // Issue 5-minute phone_token
    const phone_token = randomUUID()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()
    await sql`
      INSERT INTO phone_otps (phone, phone_token, expires_at)
      VALUES (${phone}, ${phone_token}, ${expiresAt})
    `

    return NextResponse.json({ phone_token })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Verification failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
