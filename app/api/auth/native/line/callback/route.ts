import { completeLineLogin, findOrCreateLineUser } from '@/lib/line-native'
import { handoffPage, saveHandoffHash } from '@/lib/native-handoff'

// LINE ログイン後の戻り先。アプリ内ブラウザでも Safari でも開かれうる（lib/line-native.ts）
export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  if (!code || !state) {
    // キャンセル時は error=access_denied で戻ってくる
    return handoffPage(false)
  }

  try {
    const { identity, tokenHash } = await completeLineLogin(url.origin, code, state)
    const userId = await findOrCreateLineUser(identity)
    await saveHandoffHash(tokenHash, userId)
    return handoffPage(true)
  } catch (e) {
    console.error('[auth/native/line/callback]', e)
    return handoffPage(false)
  }
}
