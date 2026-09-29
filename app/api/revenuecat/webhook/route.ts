import { sql } from '@/lib/db'
import type { Plan } from '@/lib/plan'

// RevenueCat Webhook イベント → DB の plan を更新
// https://www.revenuecat.com/docs/webhooks

const SECRET = process.env.REVENUECAT_WEBHOOK_SECRET ?? ''

// エンタイトルメント名 → plan 名のマッピング
function planFromEntitlements(entitlements: string[]): Plan {
  if (entitlements.includes('premium')) return 'premium'
  if (entitlements.includes('lite'))    return 'lite'
  return 'free'
}

export async function POST(req: Request) {
  // 署名検証
  const auth = req.headers.get('authorization')
  if (SECRET && auth !== `Bearer ${SECRET}`) {
    return Response.json({ ok: false }, { status: 401 })
  }

  let body: Record<string, unknown>
  try { body = await req.json() } catch { return Response.json({ ok: false }, { status: 400 }) }

  const event = body.event as Record<string, unknown> | undefined
  if (!event) return Response.json({ ok: false }, { status: 400 })

  const type      = event.type as string
  const appUserId = event.app_user_id as string | undefined    // RevenueCat の appUserID = DB の user id
  const activeEntitlements = (event.entitlement_ids as string[] | undefined) ?? []

  if (!appUserId) return Response.json({ ok: true })

  // アクティブな購入イベント
  const activateEvents = [
    'INITIAL_PURCHASE',
    'RENEWAL',
    'PRODUCT_CHANGE',
    'UNCANCELLATION',
    'SUBSCRIPTION_EXTENDED',
  ]

  // 解約・期限切れイベント
  const deactivateEvents = [
    'CANCELLATION',
    'EXPIRATION',
    'BILLING_ISSUE',
  ]

  let newPlan: Plan | null = null

  if (activateEvents.includes(type)) {
    newPlan = planFromEntitlements(activeEntitlements)
  } else if (deactivateEvents.includes(type)) {
    newPlan = 'free'
  }

  if (newPlan) {
    await sql`
      UPDATE users SET plan = ${newPlan}
      WHERE id = ${appUserId}::uuid
    `.catch(() => {})
  }

  return Response.json({ ok: true })
}
