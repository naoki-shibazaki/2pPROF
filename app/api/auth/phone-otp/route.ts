import { NextResponse } from 'next/server'
import twilio from 'twilio'

export async function POST(req: Request) {
  const { phone } = await req.json()
  if (!phone) {
    return NextResponse.json({ error: 'Phone number required' }, { status: 400 })
  }

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!,
  )

  try {
    await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID!)
      .verifications.create({ to: phone, channel: 'sms' })

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to send SMS'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
