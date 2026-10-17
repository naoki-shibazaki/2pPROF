'use client'

import { useEffect, useRef, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import AvatarSVG from './AvatarSVG'

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

// カメラ写真（数MB）をそのまま送ると遅いので、アップロード前に正方形 512px の JPEG（数十KB）にする
const AVATAR_SIZE = 512

async function resizeForAvatar(file: Blob): Promise<Blob> {
  const url = URL.createObjectURL(file)
  try {
    // <img> は写真の向き（EXIF）を反映して描画される
    const img = new Image()
    img.src = url
    await img.decode()
    const side = Math.min(img.naturalWidth, img.naturalHeight)
    const size = Math.min(AVATAR_SIZE, side)
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    // 中央を正方形に切り抜く（表示も object-fit: cover の正方形）
    canvas.getContext('2d')!.drawImage(
      img,
      (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side,
      0, 0, size, size,
    )
    return await new Promise((resolve, reject) =>
      canvas.toBlob(b => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/jpeg', 0.85))
  } finally {
    URL.revokeObjectURL(url)
  }
}

// iOS アプリではネイティブのカメラ / 写真ライブラリを直接開く。キャンセル時は null
// 画面は https://2pprof.vercel.app から読み込んでいるため、webPath（capacitor://localhost/...）は fetch できない。
// 画像は data URL で受け取る
async function pickNative(source: 'camera' | 'library'): Promise<Blob | null> {
  try {
    const photo = await Camera.getPhoto({
      source: source === 'camera' ? CameraSource.Camera : CameraSource.Photos,
      resultType: CameraResultType.DataUrl,
      quality: 85,
      width: 1024,
      height: 1024,
      correctOrientation: true,
    })
    if (!photo.dataUrl) return null
    return await (await fetch(photo.dataUrl)).blob()
  } catch (e) {
    if (/cancel/i.test(String(e))) return null
    throw e
  }
}

type Props = {
  currentImage: string | null
}

export default function AvatarUploader({ currentImage }: Props) {
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const libraryInputRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<string | null>(currentImage)
  const [menuOpen, setMenuOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // プロフィールの読み込みが後から終わるので、届いた画像を反映する
  useEffect(() => { setImage(currentImage) }, [currentImage])

  async function upload(file: Blob) {
    setLoading(true)
    setError(null)
    const form = new FormData()
    form.append('file', await resizeForAvatar(file).catch(() => file), 'avatar.jpg')
    const res = await fetch('/api/user/avatar', { method: 'PUT', body: form })
    const data = await res.json().catch(() => ({}))
    setLoading(false)
    if (!res.ok) setError(data.error ?? 'アップロードに失敗しました')
    else setImage(data.url)
  }

  async function choose(source: 'camera' | 'library') {
    setMenuOpen(false)
    if (!Capacitor.isPluginAvailable('Camera')) {
      // ブラウザ / 古いビルド: ファイル選択で代用
      ;(source === 'camera' ? cameraInputRef : libraryInputRef).current?.click()
      return
    }
    let blob: Blob | null
    try {
      blob = await pickNative(source)
    } catch (e) {
      console.error('[avatar] pick failed', e)
      const reason = e instanceof Error ? e.message : String(e)
      setError(`${source === 'camera' ? 'カメラを開けませんでした' : '写真を読み込めませんでした'}（${reason}）`)
      return
    }
    if (!blob) return
    try {
      await upload(blob)
    } catch (e) {
      console.error('[avatar] upload failed', e)
      setLoading(false)
      setError('アップロードに失敗しました')
    }
  }

  async function handleDelete() {
    setMenuOpen(false)
    setLoading(true)
    setError(null)
    const res = await fetch('/api/user/avatar', { method: 'DELETE' })
    setLoading(false)
    if (res.ok) setImage(null)
    else setError('削除に失敗しました')
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) void upload(f)
    e.target.value = ''
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <button
        onClick={() => !loading && setMenuOpen(true)}
        className="pixel-portrait"
        aria-label="プロフィール写真を変更"
        style={{ cursor: loading ? 'default' : 'pointer', background: 'none', padding: 0, border: 'none', display: 'inline-flex' }}
      >
        {loading ? (
          <div style={{ width: 140, height: 140, background: 'rgba(20,8,40,0.90)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ ...STYLE, fontSize: 9, color: '#40e8ff' }}>処理中...</span>
          </div>
        ) : image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="avatar" width={140} height={140}
            style={{ imageRendering: 'pixelated', display: 'block', objectFit: 'cover' }} />
        ) : (
          <AvatarSVG size={140} />
        )}
      </button>

      <input ref={cameraInputRef} type="file" accept="image/*" capture="user" style={{ display: 'none' }} onChange={onInputChange} />
      <input ref={libraryInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onInputChange} />

      {error && (
        <p style={{ ...STYLE, fontSize: 9, color: '#ff4060', textAlign: 'center', maxWidth: 200 }}>
          ⚠ {error}
        </p>
      )}

      {menuOpen && (
        <PhotoMenu
          hasImage={!!image}
          onCamera={() => choose('camera')}
          onLibrary={() => choose('library')}
          onDelete={handleDelete}
          onClose={() => setMenuOpen(false)}
        />
      )}
    </div>
  )
}

function PhotoMenu({ hasImage, onCamera, onLibrary, onDelete, onClose }: {
  hasImage: boolean
  onCamera: () => void
  onLibrary: () => void
  onDelete: () => void
  onClose: () => void
}) {
  const item = (color: string) => ({
    ...STYLE, width: '100%', minHeight: 52, fontSize: 14, color, letterSpacing: '0.06em',
    background: 'transparent', border: 'none', borderBottom: '1px solid rgba(64,232,255,0.15)', cursor: 'pointer',
  })

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        role="menu"
        style={{
          width: '100%', maxWidth: 360, margin: '0 12px',
          marginBottom: 'calc(env(safe-area-inset-bottom) + 12px)',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}
      >
        <div style={{ background: 'rgba(6,4,18,0.98)', border: '1px solid rgba(64,232,255,0.45)' }}>
          <p style={{ ...STYLE, fontSize: 10, color: '#40e8ff80', textAlign: 'center', padding: '10px 0', borderBottom: '1px solid rgba(64,232,255,0.15)' }}>
            プロフィール写真
          </p>
          <button role="menuitem" onClick={onCamera} style={item('#c0f0ff')}>📷 写真を撮る</button>
          <button role="menuitem" onClick={onLibrary} style={item('#c0f0ff')}>🖼 ライブラリから選ぶ</button>
          {hasImage && (
            <button role="menuitem" onClick={onDelete} style={{ ...item('#ff4060'), borderBottom: 'none' }}>🗑 写真を削除</button>
          )}
        </div>
        <button onClick={onClose} style={{ ...item('#b0a8d0'), background: 'rgba(6,4,18,0.98)', border: '1px solid rgba(176,168,208,0.35)' }}>
          キャンセル
        </button>
      </div>
    </div>
  )
}
