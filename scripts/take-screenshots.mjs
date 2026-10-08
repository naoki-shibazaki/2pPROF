/**
 * App Store screenshot automation using ?demo=1
 * iPhone 中型ディスプレイ (393×852 @3x = 1179×2556)
 */
import { chromium } from 'playwright'
import { mkdir } from 'fs/promises'
import { existsSync } from 'fs'

const BASE_URL = 'https://2pprof.vercel.app'
const OUT_DIR = '/Users/n.shibazaki/Downloads/2pprof-screenshots'
const VIEWPORT = { width: 393, height: 852 }
const DEVICE_SCALE = 3

async function wait(ms) { return new Promise(r => setTimeout(r, ms)) }

async function main() {
  if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true })

  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: DEVICE_SCALE,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
    locale: 'ja-JP',
  })
  const page = await ctx.newPage()

  // ── 1. ログイン画面 ──
  console.log('📸 1/7 ログイン画面...')
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' })
  await wait(1500)
  await page.screenshot({ path: `${OUT_DIR}/01_login.png` })

  // ── 2. 新規登録画面 ──
  console.log('📸 2/7 新規登録画面...')
  await page.click('button:has-text("新規登録はこちら")')
  await wait(800)
  await page.screenshot({ path: `${OUT_DIR}/02_register.png` })

  // ── デモモードで各画面 ──
  await page.goto(`${BASE_URL}/?demo=1`, { waitUntil: 'networkidle' })
  await wait(2500)

  // ── 3. マイプロフィール ──
  console.log('📸 3/7 マイプロフィール...')
  await page.screenshot({ path: `${OUT_DIR}/03_profile.png` })

  // ── 4. ひとことタブ ──
  console.log('📸 4/7 ひとことタブ...')
  await page.locator('button').filter({ hasText: 'ひとこと' }).first().click()
  await wait(1500)
  await page.screenshot({ path: `${OUT_DIR}/04_hitokoto.png` })

  // ── 5. 友達タブ ──
  console.log('📸 5/7 友達タブ...')
  await page.locator('button').filter({ hasText: '友達' }).first().click()
  await wait(1500)
  await page.screenshot({ path: `${OUT_DIR}/05_friends.png` })

  // ── 6. 他己紹介タブ ──
  console.log('📸 6/7 他己紹介タブ...')
  await page.locator('button').filter({ hasText: '他己紹介' }).first().click()
  await wait(1500)
  await page.screenshot({ path: `${OUT_DIR}/06_introductions.png` })

  // ── 7. マップタブ ──
  console.log('📸 7/7 マップタブ...')
  await page.locator('button').filter({ hasText: 'マップ' }).first().click().catch(() => {})
  await wait(2000)
  await page.screenshot({ path: `${OUT_DIR}/07_map.png` })

  await browser.close()

  const { execSync } = await import('child_process')
  console.log('\n✅ 完了！')
  for (const f of ['01_login','02_register','03_profile','04_hitokoto','05_friends','06_introductions','07_map']) {
    const info = execSync(`sips -g pixelWidth -g pixelHeight "${OUT_DIR}/${f}.png"`).toString()
    const w = info.match(/pixelWidth: (\d+)/)?.[1]
    const h = info.match(/pixelHeight: (\d+)/)?.[1]
    console.log(`  ${f}.png: ${w}×${h}`)
  }
  console.log(`\n📁 ${OUT_DIR}`)
}

main().catch(console.error)
