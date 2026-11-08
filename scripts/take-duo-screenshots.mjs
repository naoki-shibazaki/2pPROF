/**
 * iPhone Duo スクリーンショット
 * 内側の画面: 669×951 @3x = 2007×2853
 * 外側の画面: 466×678 @3x = 1398×2034
 */
import { chromium } from 'playwright'
import { mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { execSync } from 'child_process'

const BASE_URL = 'https://2p-profile.info'
const OUT_DIR = '/Users/n.shibazaki/Downloads/2pprof-screenshots'
const DEVICE_SCALE = 3
const DISPLAYS = [
  { name: 'duo_inner', viewport: { width: 669, height: 951 } },
  { name: 'duo_outer', viewport: { width: 466, height: 678 } },
]

async function wait(ms) { return new Promise(r => setTimeout(r, ms)) }

async function shoot(browser, { name, viewport }) {
  const ctx = await browser.newContext({
    viewport,
    deviceScaleFactor: DEVICE_SCALE,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 27_2 like Mac OS X) AppleWebKit/605.1.15',
    locale: 'ja-JP',
  })
  const page = await ctx.newPage()

  async function clickTab(label) {
    const buttons = await page.locator('button').all()
    for (const btn of buttons) {
      const text = await btn.textContent().catch(() => '')
      if (text?.includes(label)) {
        await btn.click({ force: true })
        await wait(1500)
        return
      }
    }
  }

  const files = []
  const snap = async (file) => {
    const path = `${OUT_DIR}/${name}_${file}.png`
    await page.screenshot({ path })
    files.push(path)
  }

  console.log(`📸 ${name} ログイン...`)
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' })
  await wait(1500)
  await snap('01_login')

  await page.goto(`${BASE_URL}/?demo=1`, { waitUntil: 'networkidle' })
  await wait(2500)
  console.log(`📸 ${name} プロフィール...`)
  await snap('02_profile')

  console.log(`📸 ${name} ひとこと...`)
  await clickTab('ひとこと')
  await snap('03_hitokoto')

  console.log(`📸 ${name} 友達...`)
  await clickTab('友達')
  await snap('04_friends')

  console.log(`📸 ${name} 他己紹介...`)
  await clickTab('他己紹介')
  await snap('05_introductions')

  await ctx.close()
  return files
}

async function main() {
  if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true })
  const browser = await chromium.launch({ headless: true })
  const files = []
  for (const d of DISPLAYS) files.push(...await shoot(browser, d))
  await browser.close()

  console.log('\n✅ 完了！')
  for (const f of files) {
    const info = execSync(`sips -g pixelWidth -g pixelHeight "${f}"`).toString()
    const w = info.match(/pixelWidth: (\d+)/)?.[1]
    const h = info.match(/pixelHeight: (\d+)/)?.[1]
    console.log(`  ${f.split('/').pop()}: ${w}×${h}`)
  }
  console.log(`\n📁 ${OUT_DIR}`)
}

main().catch(console.error)
