import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 393, height: 852 } })
await page.goto('https://2pprof.vercel.app/?demo=1', { waitUntil: 'networkidle' })
console.log('URL after load:', page.url())
const title = await page.title()
console.log('Title:', title)
const html = await page.content()
console.log('Has ひとこと tab:', html.includes('ひとこと'))
console.log('Has login form:', html.includes('LOGIN.EXE'))
await browser.close()
