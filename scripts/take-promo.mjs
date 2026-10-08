/**
 * App Store プロモーション画像生成
 * 5244 × 2950px (1748×983 @3x)
 * 3840 × 1646px (1920×823 @2x)
 */
import { chromium } from 'playwright'
import { writeFileSync, readFileSync } from 'fs'

const OUT_DIR = '/Users/n.shibazaki/Downloads/2pprof-screenshots'

const HTML = (width, height) => `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=DotGothic16&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${width}px; height: ${height}px; overflow: hidden;
    background: #060412;
    background-image:
      linear-gradient(rgba(255,64,192,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,64,192,0.05) 1px, transparent 1px);
    background-size: 32px 32px;
    font-family: 'DotGothic16', monospace;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${Math.round(width * 0.06)}px;
  }

  /* 左: ブランディング */
  .brand {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: ${Math.round(height * 0.04)}px;
    flex-shrink: 0;
  }
  .logo {
    font-size: ${Math.round(height * 0.16)}px;
    color: #ff40c0;
    text-shadow: 0 0 40px rgba(255,64,192,0.9), 0 0 80px rgba(255,64,192,0.5);
    letter-spacing: 0.1em;
    line-height: 1;
  }
  .tagline {
    font-size: ${Math.round(height * 0.055)}px;
    color: #40e8ff;
    text-shadow: 0 0 20px rgba(64,232,255,0.8);
    letter-spacing: 0.08em;
  }
  .features {
    display: flex;
    flex-direction: column;
    gap: ${Math.round(height * 0.025)}px;
    margin-top: ${Math.round(height * 0.02)}px;
  }
  .feature {
    font-size: ${Math.round(height * 0.042)}px;
    color: #c0a8e0;
    letter-spacing: 0.05em;
  }
  .feature span {
    color: #ffd700;
    margin-right: 12px;
    text-shadow: 0 0 10px rgba(255,215,0,0.7);
  }

  /* 右: モックスクリーン */
  .phone {
    width: ${Math.round(height * 0.52)}px;
    height: ${Math.round(height * 0.88)}px;
    border: 3px solid rgba(255,64,192,0.6);
    border-radius: ${Math.round(height * 0.06)}px;
    background: #0a0620;
    box-shadow:
      0 0 40px rgba(255,64,192,0.4),
      0 0 80px rgba(255,64,192,0.2),
      inset 0 0 30px rgba(255,64,192,0.05);
    overflow: hidden;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
  }
  .phone-header {
    background: linear-gradient(90deg, #180430 0%, #2e0860 50%, #180430 100%);
    border-bottom: 2px solid rgba(255,64,192,0.4);
    padding: ${Math.round(height * 0.018)}px ${Math.round(height * 0.025)}px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .phone-dots span {
    display: inline-block;
    width: ${Math.round(height * 0.018)}px;
    height: ${Math.round(height * 0.018)}px;
    border-radius: 50%;
    background: rgba(255,64,192,0.6);
    margin-right: 6px;
  }
  .phone-title {
    font-size: ${Math.round(height * 0.032)}px;
    color: #ffd700;
    text-shadow: 0 0 8px rgba(255,215,0,0.7);
    letter-spacing: 0.1em;
  }
  .phone-body {
    flex: 1;
    padding: ${Math.round(height * 0.025)}px;
    display: flex;
    flex-direction: column;
    gap: ${Math.round(height * 0.02)}px;
  }
  .avatar-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${Math.round(height * 0.015)}px;
  }
  .avatar {
    width: ${Math.round(height * 0.13)}px;
    height: ${Math.round(height * 0.13)}px;
    border: 2px solid #ff40c0;
    border-radius: 4px;
    background: linear-gradient(135deg, #2a0848 0%, #0a2040 100%);
    box-shadow: 0 0 16px rgba(255,64,192,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${Math.round(height * 0.07)}px;
  }
  .user-name {
    font-size: ${Math.round(height * 0.036)}px;
    color: #d0c8f0;
    letter-spacing: 0.1em;
  }
  .user-handle {
    font-size: ${Math.round(height * 0.028)}px;
    color: #604878;
  }
  .card {
    background: rgba(255,64,192,0.06);
    border: 1px solid rgba(255,64,192,0.3);
    padding: ${Math.round(height * 0.018)}px;
    border-radius: 2px;
  }
  .card-label {
    font-size: ${Math.round(height * 0.026)}px;
    color: #40e8ff;
    margin-bottom: ${Math.round(height * 0.01)}px;
    letter-spacing: 0.06em;
  }
  .card-text {
    font-size: ${Math.round(height * 0.028)}px;
    color: #c0a8e0;
    line-height: 1.8;
  }
  .tabs {
    display: flex;
    gap: 4px;
    margin-top: auto;
  }
  .tab {
    flex: 1;
    padding: ${Math.round(height * 0.014)}px 0;
    text-align: center;
    font-size: ${Math.round(height * 0.024)}px;
    color: #604878;
    border: 1px solid rgba(64,56,96,0.4);
    background: transparent;
  }
  .tab.active {
    color: #40e8ff;
    border-color: rgba(64,232,255,0.5);
    background: rgba(64,232,255,0.08);
  }

  /* デコ */
  .glow-circle {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }
</style>
</head>
<body>
  <div class="brand">
    <div class="logo">2P PROF</div>
    <div class="tagline">▶ ともだちと紹介しあおう ◀</div>
    <div class="features">
      <div class="feature"><span>★</span>他己紹介でほんとうの自分を発信</div>
      <div class="feature"><span>★</span>質問＆ひとことで距離を縮める</div>
      <div class="feature"><span>★</span>位置情報で友達の居場所がわかる</div>
      <div class="feature"><span>★</span>プロフィール訪問者を確認できる</div>
    </div>
  </div>

  <div class="phone">
    <div class="phone-header">
      <div class="phone-dots"><span></span><span></span><span></span></div>
      <div class="phone-title">2P PROF</div>
      <div style="width:40px"></div>
    </div>
    <div class="phone-body">
      <div class="avatar-area">
        <div class="avatar">👾</div>
        <div class="user-name">なおき</div>
        <div class="user-handle">@naoki</div>
      </div>
      <div class="card">
        <div class="card-label">■ 他己紹介</div>
        <div class="card-text">· 明るくて話しやすい人<br/>· いつも面白いことを言う<br/>· 頼りになる存在です</div>
      </div>
      <div class="card">
        <div class="card-label">■ 受け取った質問</div>
        <div class="card-text">· 好きな食べ物は？<br/>· 最近ハマってること？</div>
      </div>
      <div class="tabs">
        <div class="tab">プロフ</div>
        <div class="tab active">友達</div>
        <div class="tab">他己紹介</div>
      </div>
    </div>
  </div>
</body>
</html>`

async function capture(width, height, scale, filename) {
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: scale,
  })
  const page = await ctx.newPage()
  await page.setContent(HTML(width, height), { waitUntil: 'networkidle' })
  await new Promise(r => setTimeout(r, 1000))
  const path = `${OUT_DIR}/${filename}`
  await page.screenshot({ path, fullPage: false })
  await browser.close()
  const { execSync } = await import('child_process')
  const info = execSync(`sips -g pixelWidth -g pixelHeight "${path}"`).toString()
  console.log(`✅ ${filename}: ${info.match(/pixelWidth: (\d+)/)?.[1]}×${info.match(/pixelHeight: (\d+)/)?.[1]}`)
}

async function main() {
  console.log('🎨 プロモーション画像を生成中...')
  // 5244 × 2950 (2622×1475 @2x)
  await capture(2622, 1475, 2, 'promo_5244x2950.png')
  // 3840 × 1646 (1920×823 @2x)
  await capture(1920, 823, 2, 'promo_3840x1646.png')
  console.log(`📁 保存先: ${OUT_DIR}`)
}

main().catch(console.error)
