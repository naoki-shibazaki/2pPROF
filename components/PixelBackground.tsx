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
