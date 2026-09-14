export default function PixelBackground() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/bg.png"
      alt=""
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: -10,
        objectFit: 'cover',
        imageRendering: 'pixelated',
      }}
    />
  )
}

// ════════════════════════════════════════════════════════════════
//  HELPERS
// ════════════════════════════════════════════════════════════════

type Ctx = CanvasRenderingContext2D

function px(ctx: Ctx, x: number, y: number, w: number, h: number, c: string, a = 1) {
  if (a !== 1) ctx.globalAlpha = a
  ctx.fillStyle = c
  ctx.fillRect(~~x, ~~y, Math.max(1, ~~w), Math.max(1, ~~h))
  if (a !== 1) ctx.globalAlpha = 1
}

/** Deterministic pseudo-random number generator (LCG). */
function lcg(seed: number) {
  let s = seed | 0
  return () => {
    s = Math.imul(1664525, s) + 1013904223
    return (s >>> 0) / 4294967296
  }
}

// ════════════════════════════════════════════════════════════════
//  SCENE
// ════════════════════════════════════════════════════════════════

function draw(ctx: Ctx) {
  // Fill base (in case anything peeks through)
  px(ctx, 0, 0, CW, CH, '#080614')

  drawSky(ctx)
  drawStars(ctx)
  drawHorizonGlow(ctx)
  drawBgSkyline(ctx)
  drawMidBuildings(ctx)
  drawGround(ctx)
  drawFgBuildings(ctx)
  drawNeonSigns(ctx)
  drawLampPosts(ctx)
  drawPuddleReflections(ctx)
}

// ════════════════════════════════════════════════════════════════
//  1. NIGHT SKY  — 14 dark-purple gradient bands
// ════════════════════════════════════════════════════════════════

const SKY_BANDS: [number, number, string][] = [
  [  0, 12, '#090515'],
  [ 12, 10, '#0b0719'],
  [ 22, 10, '#0d091e'],
  [ 32, 10, '#0f0b23'],
  [ 42, 10, '#110d28'],
  [ 52, 10, '#130f2d'],
  [ 62, 10, '#161132'],
  [ 72, 10, '#181337'],
  [ 82,  8, '#1b163c'],
  [ 90,  6, '#1e1841'],
  [ 96,  5, '#211b48'],
  [101,  5, '#251e50'],
  [106,  5, '#2a2158'],
  [111,  6, '#301e58'],  // pink starts to contaminate
]

function drawSky(ctx: Ctx) {
  for (const [y, h, c] of SKY_BANDS) px(ctx, 0, y, CW, h, c)
}

// ════════════════════════════════════════════════════════════════
//  2. STARS
// ════════════════════════════════════════════════════════════════

function drawStars(ctx: Ctx) {
  const rand = lcg(137)
  const COUNT = 95

  for (let i = 0; i < COUNT; i++) {
    const x  = rand() * CW
    const y  = rand() * 108           // confined to upper sky
    const b  = rand()                  // brightness 0–1

    if (b > 0.91) {
      // Cross-shaped bright star ✦
      px(ctx, x,     y - 1, 1, 3, '#ffffff', .90)
      px(ctx, x - 1, y,     3, 1, '#ffffff', .90)
      px(ctx, x,     y,     1, 1, '#ffffff')       // centre bright
    } else if (b > 0.76) {
      // Small 2×1 or 1×2 star
      px(ctx, x, y, rand() > .5 ? 2 : 1, rand() > .5 ? 1 : 2, '#e8e0ff', .78)
    } else if (b > 0.50) {
      px(ctx, x, y, 1, 1, '#c0b8e8', .55)
    } else {
      px(ctx, x, y, 1, 1, '#9088b8', .30 + b * .25)
    }

    // Occasional tinted stars
    if (i % 18 === 0) px(ctx, x + 2, y - 1, 1, 1, '#ffb0d0', .45)
    if (i % 25 === 0) px(ctx, x - 1, y + 1, 1, 1, '#b0d8ff', .45)
  }
}

// ════════════════════════════════════════════════════════════════
//  3. HORIZON GLOW  — synthwave pink stripes
// ════════════════════════════════════════════════════════════════

const GLOW_BANDS: [number, number, string, number][] = [
  // [y, h, color, alpha]
  [ 98, 2, '#3c1245', .55],
  [100, 2, '#541650', .62],
  [102, 2, '#6e1c5e', .68],
  [104, 2, '#8a2268', .73],
  [106, 2, '#a62e74', .79],
  [108, 2, '#c23880', .84],
  [110, 2, '#d8428a', .88],
  [112, 2, '#eb4e92', .92],
  [114, 3, '#f85898', .96],  // ← peak brightness
  [117, 2, '#f24e8e', .92],
  [119, 2, '#e24082', .87],
  [121, 2, '#ce3274', .81],
  [123, 2, '#b82464', .73],
  [125, 2, '#9e1854', .63],
  [127, 2, '#820e42', .52],
  [129, 2, '#660830', .42],
  [131, 2, '#4c041e', .30],
  [133, 2, '#340210', .18],
]

function drawHorizonGlow(ctx: Ctx) {
  for (const [y, h, c, a] of GLOW_BANDS) px(ctx, 0, y, CW, h, c, a)
}

// ════════════════════════════════════════════════════════════════
//  4. BACKGROUND SKYLINE  — tall dark silhouettes, tiny windows
// ════════════════════════════════════════════════════════════════

// [x, topY, width, spireExtraH]   — bottom always at BG_BOT
const BG_BOT = 126

const BG_BLDG: [number, number, number, number][] = [
  [  0,  74, 12, 0],
  [  8,  60, 16, 8],
  [ 20,  70,  9, 0],
  [ 25,  48, 18,12],
  [ 40,  68, 10, 0],
  [ 46,  54, 22, 6],
  [ 64,  72, 14, 0],
  [ 74,  46, 20,14],
  [ 90,  58, 14, 0],
  [ 98,  66, 10, 0],
  [103,  44, 24,16],
  [123,  52, 16, 8],
  [134,  70, 10, 0],
  [140,  44, 26,14],
  [162,  54, 18, 0],
  [174,  62, 12, 0],
  [180,  48, 22, 8],
]

const BG_BODY = '#0c0a1e'

function drawBgSkyline(ctx: Ctx) {
  const rand = lcg(71)

  for (const [bx, ty, bw, spH] of BG_BLDG) {
    px(ctx, bx, ty, bw, BG_BOT - ty, BG_BODY)

    // Spire
    if (spH > 0) {
      const sw = Math.max(2, ~~(bw * .24))
      const sx = bx + ~~((bw - sw) / 2)
      px(ctx, sx, ty - spH, sw, spH + 1, BG_BODY)
      // Beacon light at tip
      px(ctx, sx + ~~(sw / 2), ty - spH - 1, 1, 1, '#ff2020', .85)
    }

    // Tiny windows (1×2 px)
    const cols = Math.max(2, ~~((bw - 4) / 3))
    for (let row = 0; row * 4 + ty + 4 < BG_BOT - 2; row++) {
      for (let col = 0; col < cols; col++) {
        if (rand() > .32) continue
        const wx = bx + 2 + col * 3
        const wy = ty + 4 + row * 4
        const wc = rand() > .82 ? '#80b8ff'
          : rand() > .55 ? '#ffcc60' : '#ff9030'
        px(ctx, wx, wy, 1, 2, wc, .80)
      }
    }
  }
}

// ════════════════════════════════════════════════════════════════
//  5. MIDGROUND BUILDINGS
// ════════════════════════════════════════════════════════════════

// [x, topY, width, bottomY]
const MID_BLDG: [number, number, number, number][] = [
  [  0, 130, 24, 218],
  [ 18, 122, 18, 218],
  [ 32, 116, 30, 218],
  [ 58, 128, 22, 218],
  [ 76, 118, 26, 218],
  [ 98, 124, 20, 218],
  [112, 110, 38, 218],
  [144, 120, 24, 218],
  [164, 116, 28, 218],
  [186, 124, 18, 218],
]

const MID_BODY  = ['#11102a', '#13102c', '#16102e', '#140e2c', '#120e28']
const MID_WIN   = ['#ffaa28','#ff9010','#ffc840','#4888ff','#ff4848','#ffdd60']

function drawMidBuildings(ctx: Ctx) {
  const rand = lcg(89)
  for (const [bx, ty, bw, by] of MID_BLDG) {
    const bc = MID_BODY[~~(rand() * MID_BODY.length)]
    px(ctx, bx, ty, bw, by - ty, bc)

    // Floor divider lines
    for (let fy = ty + 12; fy < by - 4; fy += 12) {
      px(ctx, bx, fy, bw, 1, '#0a0818', .45)
    }

    // Windows 2×3
    for (let wy = ty + 5; wy < by - 4; wy += 6) {
      for (let wx = bx + 3; wx < bx + bw - 3; wx += 5) {
        if (rand() > .40) continue
        const c = MID_WIN[~~(rand() * MID_WIN.length)]
        px(ctx, wx, wy, 2, 3, c, .88)
        px(ctx, wx - 1, wy - 1, 4, 5, c, .12)  // glow
      }
    }
  }
}

// ════════════════════════════════════════════════════════════════
//  6. GROUND / STREET
// ════════════════════════════════════════════════════════════════

function drawGround(ctx: Ctx) {
  px(ctx, 0, 312, CW, 28, '#090612')     // base asphalt
  px(ctx, 0, 315, CW,  2, '#14122a')    // pavement edge
  px(ctx, 0, 317, CW,  1, '#1c1840', .6)// kerb highlight
}

// ════════════════════════════════════════════════════════════════
//  7. FOREGROUND BUILDINGS
// ════════════════════════════════════════════════════════════════

// [x, topY, width, bottomY]
const FG_BLDG: [number, number, number, number][] = [
  [  0, 196, 40, 340],
  [ 36, 208, 18, 340],
  [ 50, 192, 34, 340],
  [ 80, 200, 22, 340],
  [ 98, 184, 36, 340],
  [130, 196, 24, 340],
  [150, 190, 54, 340],
]

const FG_BODY  = ['#1a1630','#1e1a38','#201c3a','#1c1832','#221e3e','#1a162e']
const FG_WIN   = ['#ffa820','#ff8810','#ffbe30','#60a0ff','#ff5050','#ffda50','#44cc60']

function drawFgBuildings(ctx: Ctx) {
  const rand = lcg(113)
  for (const [bx, ty, bw, by] of FG_BLDG) {
    const bc = FG_BODY[~~(rand() * FG_BODY.length)]
    px(ctx, bx, ty, bw, by - ty, bc)

    // Rooftop parapet
    px(ctx, bx - 1, ty - 2, bw + 2, 3, '#2a2550')

    // Floor lines
    for (let fy = ty + 14; fy < by; fy += 14) {
      px(ctx, bx, fy, bw, 1, '#100e22', .50)
    }

    // Windows 3×4
    for (let wy = ty + 7; wy < by - 4; wy += 7) {
      for (let wx = bx + 4; wx < bx + bw - 4; wx += 7) {
        if (rand() > .50) continue
        const c = FG_WIN[~~(rand() * FG_WIN.length)]
        px(ctx, wx, wy, 3, 4, c, .92)
        px(ctx, wx - 1, wy - 1, 5, 6, c, .16)  // glow
      }
    }
  }
}

// ════════════════════════════════════════════════════════════════
//  8. NEON SIGNS
// ════════════════════════════════════════════════════════════════

function drawNeonSigns(ctx: Ctx) {
  // ── Large pink horizontal sign (like "CRALERA") ──
  neonBox(ctx,  6, 252, 86, 24, '#ff40c0', '#880050')
  neonLetters(ctx, 10, 257, 78, 14, '#ff40c0', '#ffa0e8', '#880050', 4)

  // ── Cyan sign (like "B:T00") ──
  neonBox(ctx, 102, 270, 60, 26, '#40e8ff', '#006880')
  neonLetters(ctx, 106, 275, 52, 16, '#40e8ff', '#a0f8ff', '#006880', 5)

  // ── Orange vertical pillar sign ──
  neonBox(ctx, 152, 226, 22, 68, '#ff8830', '#804010')
  for (let y = 232; y < 286; y += 12) {
    px(ctx, 155, y,      16,  8, '#ff8830', .68)
    px(ctx, 156, y + 1,  14,  6, '#180c00')
    px(ctx, 157, y + 2,  10,  3, '#ff8830', .30)
  }

  // ── Green horizontal sign (like "1909LMG") ──
  neonBox(ctx,  2, 292, 82, 20, '#38ff78', '#006820')
  neonLetters(ctx, 6, 296, 74, 12, '#38ff78', '#a0ffc0', '#006820', 3)

  // ── Small red square sign (top-right zone) ──
  neonBox(ctx, 170, 236, 30, 30, '#ff2850', '#800018')
  px(ctx, 173, 239, 24, 24, '#120008')
  px(ctx, 174, 241, 10, 4, '#ff2850', .72)
  px(ctx, 175, 248,  8, 4, '#ff2850', .65)
  px(ctx, 176, 255,  6, 4, '#ff2850', .58)
  px(ctx, 173, 239, 24, 24, '#ff2850', .07)   // interior glow

  // ── Small cyan tag (mid-right) ──
  neonBox(ctx, 162, 210, 36, 18, '#40e8ff', '#006880')
  px(ctx, 164, 212, 32, 14, '#030c14')
  px(ctx, 165, 214, 12, 4, '#40e8ff', .60)
  px(ctx, 179, 214,  8, 4, '#40e8ff', .60)
  px(ctx, 165, 220, 30, 2, '#40e8ff', .40)
}

/** Glowing neon rectangle border */
function neonBox(
  ctx: Ctx, x: number, y: number, w: number, h: number,
  mainC: string, glowC: string,
) {
  // Outer glow layers
  px(ctx, x - 4, y - 4, w + 8, h + 8, glowC, .08)
  px(ctx, x - 3, y - 3, w + 6, h + 6, glowC, .14)
  px(ctx, x - 2, y - 2, w + 4, h + 4, glowC, .24)
  px(ctx, x - 1, y - 1, w + 2, h + 2, glowC, .40)
  // Frame
  px(ctx, x,       y,       w,  2, mainC)
  px(ctx, x,       y + h-2, w,  2, mainC)
  px(ctx, x,       y,       2,  h, mainC)
  px(ctx, x + w-2, y,       2,  h, mainC)
  // Dark interior + ambient glow
  px(ctx, x + 2, y + 2, w - 4, h - 4, '#040210')
  px(ctx, x + 2, y + 2, w - 4, h - 4, glowC, .08)
  // Inner bright edge
  px(ctx, x + 1, y + 1, w - 2, 1, mainC, .50)
  px(ctx, x + 1, y + 1, 1, h - 2, mainC, .40)
}

/** Pseudo-letter columns that read as neon text */
function neonLetters(
  ctx: Ctx, x: number, y: number, w: number, h: number,
  mainC: string, brightC: string, glowC: string, seed: number,
) {
  const rand = lcg((x * 7 + y * 3 + seed) | 0)
  const CW_L  = 7   // letter cell width
  const GAP   = 2   // gap between letters
  let cx = x

  while (cx + CW_L <= x + w) {
    // Glow under entire letter
    px(ctx, cx - 1, y - 1, CW_L + 2, h + 2, glowC, .25)

    // Top bar (always)
    px(ctx, cx, y,      CW_L, 2, brightC, .95)
    // Bottom bar (always)
    px(ctx, cx, y+h-2,  CW_L, 2, mainC,   .85)
    // Left vertical (always)
    px(ctx, cx, y,      2,    h, mainC,   .85)
    // Middle bar (random → different letter shapes)
    if (rand() > .40) px(ctx, cx, y + ~~(h / 2), CW_L, 1, mainC, .80)
    // Right vertical (random)
    if (rand() > .35) px(ctx, cx + CW_L - 2, y, 2, h, mainC, .75)
    // Colon dot (rare, for "B:T00" style)
    if (rand() > .85) {
      px(ctx, cx + CW_L + 1, y + 2,      2, 2, brightC)
      px(ctx, cx + CW_L + 1, y + h - 5,  2, 2, brightC)
    }

    cx += CW_L + GAP
  }
}

// ════════════════════════════════════════════════════════════════
//  9. LAMP POSTS
// ════════════════════════════════════════════════════════════════

function drawLampPosts(ctx: Ctx) {
  for (const lx of [28, 84, 148] as const) {
    lampPost(ctx, lx, 290)
  }
}

function lampPost(ctx: Ctx, x: number, y: number) {
  px(ctx, x,     y,      2, 48, '#28243e')  // shaft
  px(ctx, x - 4, y + 2, 10,  2, '#28243e')  // arm
  px(ctx, x - 5, y - 1,  6,  4, '#d8a840')  // lamp housing
  // Lamp glow
  px(ctx, x - 7, y - 4, 10, 10, '#d8a840', .18)
  px(ctx, x - 4, y - 2,  4,  6, '#ffe898', .40)
}

// ════════════════════════════════════════════════════════════════
//  10. PUDDLE / WET-STREET REFLECTIONS
// ════════════════════════════════════════════════════════════════

function drawPuddleReflections(ctx: Ctx) {
  // Faint neon streaks on the dark asphalt
  px(ctx,  6, 320, 82,  3, '#ff40c0', .12)
  px(ctx, 98, 322, 58,  4, '#40e8ff', .10)
  px(ctx,  2, 326, 78,  3, '#38ff78', .08)
  px(ctx,148, 318, 28,  4, '#ff8830', .09)
  // Lamp reflections
  for (const lx of [28, 84, 148]) {
    px(ctx, lx - 3, 324, 8, 6, '#ffe898', .12)
  }
}
