/**
 * AvatarSVG – 16×16 pixel art character sprite rendered as inline SVG.
 *
 * Color palette:
 *   1 = dark brown hair   (#3d1f00)
 *   2 = skin tone         (#f5c18a)
 *   3 = dark (eyes/brows) (#1a1a4e)
 *   4 = accent mouth      (#e05050)
 *   5 = shirt (blue)      (#4060cc)
 *   6 = pants (navy)      (#1a1a4e)
 *   7 = shoe              (#2a2a2a)
 */

const P = 3 // screen pixels per sprite pixel

const PALETTE: Record<number, string> = {
  1: '#3d1f00',
  2: '#f5c18a',
  3: '#1a1a4e',
  4: '#e05050',
  5: '#4060cc',
  6: '#1a2060',
  7: '#2a2a2a',
}

// 16 rows × 16 cols; 0 = transparent
const SPRITE: number[][] = [
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0], // 0 hair top
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0], // 1 hair
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0], // 2 hair full
  [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0], // 3 face
  [0, 0, 0, 2, 2, 3, 2, 2, 2, 2, 3, 2, 2, 0, 0, 0], // 4 eyes
  [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0], // 5 nose area
  [0, 0, 0, 2, 2, 4, 4, 4, 4, 4, 4, 2, 2, 0, 0, 0], // 6 mouth
  [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0], // 7 chin
  [0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0], // 8 shirt top
  [0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0], // 9 shirt + arms
  [0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0], // 10 shirt
  [0, 0, 0, 0, 6, 6, 6, 2, 2, 6, 6, 6, 0, 0, 0, 0], // 11 pants + hands
  [0, 0, 0, 0, 6, 6, 6, 0, 0, 6, 6, 6, 0, 0, 0, 0], // 12 pants gap
  [0, 0, 0, 0, 6, 6, 0, 0, 0, 0, 6, 6, 0, 0, 0, 0], // 13 lower pants
  [0, 0, 0, 7, 7, 6, 0, 0, 0, 0, 6, 7, 7, 0, 0, 0], // 14 shoes
  [0, 0, 0, 7, 7, 0, 0, 0, 0, 0, 0, 7, 7, 0, 0, 0], // 15 shoe bottom
]

interface AvatarSVGProps {
  size?: number // rendered px width/height (default 64)
}

export default function AvatarSVG({ size = 64 }: AvatarSVGProps) {
  const dim = 16 * P // viewBox dimension

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${dim} ${dim}`}
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      style={{ imageRendering: 'pixelated' }}
      aria-hidden="true"
    >
      {SPRITE.map((row, y) =>
        row.map((c, x) => {
          if (c === 0) return null
          return (
            <rect
              key={`${x}-${y}`}
              x={x * P}
              y={y * P}
              width={P}
              height={P}
              fill={PALETTE[c]}
            />
          )
        })
      )}
    </svg>
  )
}
