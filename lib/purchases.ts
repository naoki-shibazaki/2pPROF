/**
 * RevenueCat 購入サービス
 * Capacitor (iOS/Android) 環境でのみ動作
 * ブラウザでは全メソッドが no-op になる
 */

import type { Plan } from './plan'

// RevenueCat の商品ID（App Store Connect で作成後に設定）
export const PRODUCT_IDS = {
  lite:    'twopprof_lite_monthly',     // ¥300/月
  premium: 'twopprof_premium_monthly',  // ¥600/月
} as const

export type PurchaseResult =
  | { ok: true;  plan: Plan }
  | { ok: false; error: string; cancelled?: boolean }

// Capacitor 環境かどうか
function isCapacitor(): boolean {
  return typeof window !== 'undefined' && !!(window as Window & { Capacitor?: { isNative?: boolean } }).Capacitor?.isNative
}

/** RevenueCat SDK を初期化（アプリ起動時に1回呼ぶ） */
export async function initPurchases(userId: string): Promise<void> {
  if (!isCapacitor()) return
  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor')
    await Purchases.configure({
      apiKey: process.env.NEXT_PUBLIC_REVENUECAT_API_KEY ?? '',
      appUserID: userId,
    })
  } catch { /* silent */ }
}

/** 利用可能なオファリング（商品一覧）を取得 */
export async function getOfferings() {
  if (!isCapacitor()) return null
  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor')
    const result = await Purchases.getOfferings()
    return result.current
  } catch { return null }
}

/** プラン購入 */
export async function purchasePlan(plan: 'lite' | 'premium'): Promise<PurchaseResult> {
  if (!isCapacitor()) return { ok: false, error: 'native環境が必要です' }

  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor')

    const offerings = await Purchases.getOfferings()
    const pkg = offerings.current?.availablePackages?.find(
      p => p.product.identifier === PRODUCT_IDS[plan]
    )
    if (!pkg) return { ok: false, error: '商品が見つかりません' }

    const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg })

    const active = customerInfo.entitlements.active
    const entitlement = active['premium'] ?? active['lite']
    if (entitlement) {
      return { ok: true, plan: active['premium'] ? 'premium' : 'lite' }
    }
    return { ok: false, error: 'エンタイトルメントが確認できませんでした' }

  } catch (e: unknown) {
    const err = e as { userCancelled?: boolean; message?: string }
    if (err.userCancelled) return { ok: false, error: 'キャンセルされました', cancelled: true }
    return { ok: false, error: err.message ?? '購入に失敗しました' }
  }
}

/** 購入の復元（機種変更時など） */
export async function restorePurchases(): Promise<PurchaseResult> {
  if (!isCapacitor()) return { ok: false, error: 'native環境が必要です' }

  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor')
    const { customerInfo } = await Purchases.restorePurchases()
    const active = customerInfo.entitlements.active

    if (active['premium']) return { ok: true, plan: 'premium' }
    if (active['lite'])    return { ok: true, plan: 'lite' }
    return { ok: false, error: '復元できる購入履歴がありません' }

  } catch (e: unknown) {
    const err = e as { message?: string }
    return { ok: false, error: err.message ?? '復元に失敗しました' }
  }
}
