// ヘッダー用のドット絵アイコン。12×12 マスを SVG の四角で描く（画像を使わないので拡大してもくっきり）
// '#' = 塗り、'.' = 透明

const GRIDS = {
  bell: [
    '.....##.....',
    '....####....',
    '...######...',
    '..########..',
    '..##.#####..',
    '..##.#####..',
    '..########..',
    '.##########.',
    '############',
    '............',
    '....####....',
    '.....##.....',
  ],
  share: [
    '.........##.',
    '........####',
    '........####',
    '......##.##.',
    '.##.##......',
    '####........',
    '####........',
    '.##.##......',
    '......##.##.',
    '........####',
    '........####',
    '.........##.',
  ],
  gear: [
    '.....##.....',
    '..#.####.#..',
    '.##########.',
    '..###..###..',
    '.###....###.',
    '####....####',
    '####....####',
    '.###....###.',
    '..###..###..',
    '.##########.',
    '..#.####.#..',
    '.....##.....',
  ],
} as const

export type PixelIconName = keyof typeof GRIDS

// 横に続く '#' を 1 本の四角にまとめる
function toRects(grid: readonly string[]) {
  const rects: { x: number; y: number; w: number }[] = []
  grid.forEach((row, y) => {
    let x = 0
    while (x < row.length) {
      if (row[x] !== '#') { x++; continue }
      const start = x
      while (row[x] === '#') x++
      rects.push({ x: start, y, w: x - start })
    }
  })
  return rects
}

const RECTS = Object.fromEntries(
  Object.entries(GRIDS).map(([k, g]) => [k, toRects(g)]),
) as Record<PixelIconName, { x: number; y: number; w: number }[]>

export default function PixelIcon({ name, color, size = 24 }: { name: PixelIconName; color: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      shapeRendering="crispEdges"
      aria-hidden
      style={{ display: 'block', filter: `drop-shadow(0 0 3px ${color})` }}
    >
      {RECTS[name].map(r => <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={r.w} height={1} fill={color} />)}
    </svg>
  )
}
