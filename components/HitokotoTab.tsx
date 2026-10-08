'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import NotifBanner from './NotifBanner'
import { demoPosts } from '@/data/profileData'

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const
const MAX_LEN = 100

type Post = {
  id: string
  body: string
  created_at: string
  user_id: string
  name: string | null
  handle: string | null
  image: string | null
}

type PostComment = {
  id: string
  body: string
  created_at: string
  author_name: string | null
  author_handle: string | null
}

type PendingComment = {
  id: string
  post_id: string
  body: string
  created_at: string
  author_name: string | null
  author_handle: string | null
}

function timeAgo(dateStr: string) {
  const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000)
  if (mins < 1) return 'たった今'
  if (mins < 60) return `${mins}分前`
  if (mins < 1440) return `${Math.floor(mins / 60)}時間前`
  return `${Math.floor(mins / 1440)}日前`
}

// ── コメントセクション（ネスト形式） ───────────────────────────
function PostCommentSection({ postId, isMine, meHandle, pendingComments, onPendingAction }: {
  postId: string
  isMine: boolean
  meHandle: string | null
  pendingComments: PendingComment[]
  onPendingAction: (id: string) => void
}) {
  const [comments, setComments] = useState<PostComment[]>([])
  const [myPending, setMyPending] = useState<{ id: string; body: string } | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitFlagged, setSubmitFlagged] = useState(false)
  const [editingPending, setEditingPending] = useState(false)
  const [editText, setEditText] = useState('')
  const [editSaving, setEditSaving] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  const myPostPending = pendingComments.filter(c => c.post_id === postId)

  // マウント時に自動ロード
  useEffect(() => {
    Promise.all([
      fetch(`/api/post-comments?postId=${postId}`).then(r => r.json()).catch(() => []),
      fetch(`/api/post-comments/my?postId=${postId}`).then(r => r.json()).catch(() => null),
    ]).then(([commData, myData]) => {
      if (Array.isArray(commData)) setComments(commData)
      if (myData?.id) setMyPending(myData)
    })
  }, [postId])

  async function submit() {
    if (!commentText.trim() || submitting) return
    setSubmitting(true)
    const r = await fetch('/api/post-comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, body: commentText }),
    })
    const data = await r.json()
    if (data.ok && !data.flagged && data.id) {
      if (isMine) {
        // 自分の投稿→即承認済みとしてリストに追加
        setComments(prev => [...prev, { id: data.id, body: commentText, created_at: new Date().toISOString(), author_name: null, author_handle: meHandle }])
      } else {
        setMyPending({ id: data.id, body: commentText })
      }
      setCommentText('')
      setShowForm(false)
    } else if (data.flagged) {
      setSubmitFlagged(true)
    }
    setSubmitting(false)
  }

  async function saveEdit() {
    if (!myPending || !editText.trim() || editSaving) return
    setEditSaving(true)
    setEditError(null)
    const r = await fetch(`/api/post-comments/${myPending.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: editText }),
    })
    const data = await r.json()
    if (data.ok) { setMyPending({ ...myPending, body: editText }); setEditingPending(false) }
    else setEditError(data.flagged ? '⚠ このコメントは送信できませんでした' : '保存に失敗しました')
    setEditSaving(false)
  }

  async function handlePendingAction(id: string, status: 'approved' | 'rejected') {
    const r = await fetch(`/api/post-comments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if ((await r.json()).ok) onPendingAction(id)
  }

  const totalCount = comments.length + (isMine ? myPostPending.length : (myPending ? 1 : 0))

  return (
    <div style={{ borderTop: '1px solid rgba(64,232,255,0.10)' }}>

      {/* 承認済みコメント（ネスト表示） */}
      {comments.map(c => (
        <div key={c.id} style={{ display: 'flex', gap: 6, padding: '5px 12px 0' }}>
          <span style={{ ...STYLE, fontSize: 9, color: 'rgba(64,232,255,0.35)', flexShrink: 0, paddingTop: 2 }}>└</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ ...STYLE, fontSize: 8, color: '#6050a0' }}>@{c.author_handle ?? '?'} </span>
            <span style={{ ...STYLE, fontSize: 10, color: '#c0b8e0', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{c.body}</span>
          </div>
        </div>
      ))}

      {/* オーナー：承認待ちコメント */}
      {isMine && myPostPending.map(c => (
        <div key={c.id} style={{ padding: '5px 12px 0' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ ...STYLE, fontSize: 9, color: 'rgba(255,136,48,0.55)', flexShrink: 0, paddingTop: 2 }}>└</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ ...STYLE, fontSize: 8, color: '#ff8830' }}>@{c.author_handle ?? '?'} </span>
              <span style={{ ...STYLE, fontSize: 10, color: '#c0b8e0', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{c.body}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, paddingLeft: 20, marginTop: 4 }}>
            <button onClick={() => handlePendingAction(c.id, 'approved')} style={{ ...STYLE, fontSize: 9, color: '#38ff78', background: 'rgba(4,2,12,0.90)', border: '1px solid rgba(56,255,120,0.40)', padding: '2px 8px', cursor: 'pointer' }}>✓ 承認</button>
            <button onClick={() => handlePendingAction(c.id, 'rejected')} style={{ ...STYLE, fontSize: 9, color: '#ff4060', background: 'rgba(4,2,12,0.90)', border: '1px solid rgba(255,64,96,0.40)', padding: '2px 8px', cursor: 'pointer' }}>✕ 却下</button>
          </div>
        </div>
      ))}

      {/* 非オーナー：自分のpendingコメント */}
      {!isMine && myPending && (
        <div style={{ padding: '5px 12px 0' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ ...STYLE, fontSize: 9, color: 'rgba(255,136,48,0.55)', flexShrink: 0, paddingTop: 2 }}>└</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              {editingPending ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <textarea value={editText} onChange={e => setEditText(e.target.value)} maxLength={200} rows={2}
                    style={{ ...STYLE, fontSize: 10, color: '#d0c8f0', background: 'rgba(4,2,12,0.80)', border: '1px solid rgba(255,136,48,0.40)', padding: '3px 6px', outline: 'none', resize: 'none', lineHeight: 1.7, width: '100%' }} />
                  {editError && <p style={{ ...STYLE, fontSize: 9, color: '#ff4060', margin: 0 }}>{editError}</p>}
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={saveEdit} disabled={editSaving || !editText.trim()} style={{ ...STYLE, fontSize: 9, color: '#40e8ff', background: 'rgba(4,2,12,0.90)', border: '1px solid rgba(64,232,255,0.40)', padding: '2px 8px', cursor: 'pointer', opacity: editSaving ? 0.5 : 1 }}>{editSaving ? '保存中...' : '保存'}</button>
                    <button onClick={() => { setEditingPending(false); setEditError(null) }} style={{ ...STYLE, fontSize: 9, color: '#8070a8', background: 'transparent', border: '1px solid rgba(80,72,112,0.40)', padding: '2px 8px', cursor: 'pointer' }}>キャンセル</button>
                  </div>
                </div>
              ) : (
                <div>
                  <span style={{ ...STYLE, fontSize: 10, color: '#c0b8e0', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{myPending.body}</span>
                  <span style={{ ...STYLE, fontSize: 8, color: '#ff8830', marginLeft: 6 }}>承認待ち</span>
                  <button onClick={() => { setEditText(myPending.body); setEditingPending(true) }} style={{ ...STYLE, fontSize: 8, color: '#ff8830', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 0 6px' }}>[編集]</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* フッター行：常に表示 */}
      <div style={{ padding: '5px 12px 7px', display: 'flex', alignItems: 'center', gap: 8 }}>
        {totalCount > 0 && (
          <span style={{ ...STYLE, fontSize: 8, color: '#6050a0' }}>💬 {totalCount}件</span>
        )}
        {!myPending && (
          submitFlagged ? (
            <span style={{ ...STYLE, fontSize: 9, color: '#ff4060' }}>⚠ 送信できませんでした</span>
          ) : showForm ? null : (
            <button
              onClick={() => setShowForm(true)}
              style={{ ...STYLE, fontSize: 9, color: '#8868c8', background: 'none', border: '1px solid rgba(136,104,200,0.35)', padding: '2px 10px', cursor: 'pointer' }}
            >
              💬 コメントする
            </button>
          )
        )}
      </div>

      {/* コメント入力フォーム */}
      {showForm && (
        <div style={{ padding: '0 12px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <textarea value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="コメントを入力..." maxLength={200} rows={2}
            style={{ ...STYLE, fontSize: 10, color: '#d0c8f0', background: 'rgba(4,2,12,0.80)', border: '1px solid rgba(136,104,200,0.40)', padding: '4px 8px', outline: 'none', resize: 'none', lineHeight: 1.7, width: '100%' }} />
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={submit} disabled={submitting || !commentText.trim()} style={{ ...STYLE, fontSize: 9, color: '#40e8ff', background: 'rgba(4,2,12,0.90)', border: '1px solid rgba(64,232,255,0.40)', padding: '3px 12px', cursor: submitting ? 'default' : 'pointer', opacity: submitting ? 0.5 : 1 }}>
              {submitting ? '送信中...' : '送信'}
            </button>
            <button onClick={() => { setShowForm(false); setCommentText('') }} style={{ ...STYLE, fontSize: 9, color: '#8070a8', background: 'transparent', border: '1px solid rgba(80,72,112,0.40)', padding: '3px 8px', cursor: 'pointer' }}>キャンセル</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── メインコンポーネント ───────────────────────────────────────
export default function HitokotoTab({ hasNotif, demo }: { hasNotif?: boolean; demo?: boolean }) {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [me, setMe] = useState<{ id: string; handle: string | null } | null>(null)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pendingComments, setPendingComments] = useState<PendingComment[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (demo) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setPosts(demoPosts.map(p => ({ id: p.id, body: p.body, created_at: p.created_at, user_id: 'demo', name: p.author_name, handle: p.author_handle, image: p.author_image })) as any)
      setLoading(false)
      return
    }

    fetch('/api/user/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.id) setMe(data) })
      .catch(() => {})

    fetch('/api/posts')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setPosts(data) })
      .catch(() => {})
      .finally(() => setLoading(false))

    fetch('/api/post-comments/pending')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setPendingComments(data) })
      .catch(() => {})
  }, [demo])

  async function submit() {
    if (!text.trim() || sending) return
    setSending(true)
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: text }),
    })
    const data = await res.json()
    if (data.ok && data.post) {
      const newPost: Post = { ...data.post, user_id: me?.id ?? '', name: null, handle: null, image: null }
      setPosts(prev => [newPost, ...prev])
      setText('')
    }
    setSending(false)
  }

  async function deletePost(id: string) {
    await fetch(`/api/posts/${id}`, { method: 'DELETE' })
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  const remaining = MAX_LEN - text.length

  return (
    <div>
      <NotifBanner tab="hitokoto" show={!!hasNotif} />
      {/* Compose box */}
      <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(64,232,255,0.20)', background: 'rgba(4,10,22,0.70)' }}>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit() }}
          placeholder="いまどうしてる？"
          maxLength={MAX_LEN}
          rows={2}
          style={{ ...STYLE, fontSize: 11, color: '#d0c8f0', background: 'rgba(4,2,12,0.80)', border: '1px solid rgba(64,232,255,0.30)', padding: '6px 8px', outline: 'none', resize: 'none', lineHeight: 1.8, width: '100%', display: 'block' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
          <span style={{ ...STYLE, fontSize: 8, color: remaining <= 20 ? '#ff4060' : '#504870' }}>{remaining}</span>
          <button onClick={submit} disabled={sending || !text.trim()} style={{ ...STYLE, fontSize: 10, color: '#40e8ff', background: 'rgba(4,2,12,0.90)', border: '1px solid rgba(64,232,255,0.45)', padding: '4px 16px', cursor: sending || !text.trim() ? 'default' : 'pointer', opacity: sending || !text.trim() ? 0.45 : 1 }}>
            {sending ? '送信中...' : 'つぶやく'}
          </button>
        </div>
      </div>

      {/* Feed */}
      {loading ? (
        <div style={{ padding: '20px 12px', textAlign: 'center' }}>
          <span style={{ ...STYLE, fontSize: 9, color: '#504870' }}>読み込み中...</span>
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-10">
          <span style={{ fontSize: 28 }}>💬</span>
          <p style={{ ...STYLE, fontSize: 10, color: '#504870', textAlign: 'center', lineHeight: 2 }}>
            まだつぶやきがありません<br />最初のひとことを投稿しよう
          </p>
        </div>
      ) : (
        posts.map(post => {
          const isMine = !!me && post.user_id === me.id
          return (
            <div key={post.id} style={{ borderBottom: '1px solid rgba(64,232,255,0.10)', background: 'rgba(4,2,12,0.40)' }}>
              {/* Post body */}
              <div style={{ padding: '9px 12px 6px' }}>
                <button onClick={() => post.handle && router.push(`/profile/${post.handle}`)} style={{ ...STYLE, fontSize: 9, color: '#504870', background: 'none', border: 'none', cursor: post.handle ? 'pointer' : 'default', padding: 0, marginBottom: 3 }}>
                  @{post.handle}
                </button>
                <p style={{ ...STYLE, fontSize: 11, color: '#b0a8d0', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{post.body}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 3 }}>
                  <span style={{ ...STYLE, fontSize: 8, color: '#403860' }}>{timeAgo(post.created_at)}</span>
                  {isMine && (
                    <button onClick={() => deletePost(post.id)} style={{ ...STYLE, fontSize: 8, color: '#403860', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>削除</button>
                  )}
                </div>
              </div>

              {/* Comment section */}
              <PostCommentSection
                postId={post.id}
                isMine={isMine}
                meHandle={me?.handle ?? null}
                pendingComments={pendingComments}
                onPendingAction={id => setPendingComments(prev => prev.filter(c => c.id !== id))}
              />
            </div>
          )
        })
      )}
    </div>
  )
}
