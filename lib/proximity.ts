export const PROXIMITY_TITLES: { min: number; title: string; color: string }[] = [
  { min: 100, title: '魂の同志', color: '#ff40c0' },
  { min: 50,  title: '相棒',    color: '#ffd700' },
  { min: 30,  title: '親友',    color: '#ff8830' },
  { min: 10,  title: '友人',    color: '#40e8ff' },
  { min: 5,   title: '知人',    color: '#a0d8ff' },
  { min: 1,   title: '顔見知り', color: '#b0a8d0' },
  { min: 0,   title: '赤の他人', color: '#504870' },
]

export function getProximityTitle(count: number) {
  return PROXIMITY_TITLES.find(t => count >= t.min) ?? PROXIMITY_TITLES[PROXIMITY_TITLES.length - 1]
}
