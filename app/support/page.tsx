export const metadata = {
  title: 'サポート | 2P PROF',
}

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

// App Store Connect の「サポート URL」に登録するページ。ログインなしで見られる（proxy.ts）
export default function SupportPage() {
  return (
    <div style={{
      minHeight: '100dvh',
      background: '#04020c',
      color: '#b0a8d0',
      padding: '40px 20px',
      maxWidth: 680,
      margin: '0 auto',
      ...STYLE,
    }}>
      <a href="/" style={{ display: 'inline-block', fontSize: 11, color: '#40e8ff', marginBottom: 24 }}>
        ◀ もどる
      </a>
      <h1 style={{ fontSize: 18, color: '#ff40c0', letterSpacing: '0.1em', marginBottom: 32, textShadow: '0 0 12px rgba(255,64,192,0.5)' }}>
        サポート
      </h1>

      <Section title="お問い合わせ">
        ご質問・不具合のご報告・ご要望は、以下のメールアドレスまでお送りください。<br />
        <span style={{ color: '#40e8ff', userSelect: 'all' }}>support@2p-profile.info</span>
        <br />
        不具合の場合は、お使いの機種・iOS のバージョン・起きたことをお書き添えいただけると助かります。
      </Section>

      <Section title="よくある質問">
        <Q q="ログアウトするには？">
          アプリ右上の歯車アイコン（設定）→「ログアウト」を押してください。
        </Q>
        <Q q="アカウントを削除するには？">
          アプリ右上の歯車アイコン（設定）→「アカウントを削除」→「完全に削除する」を押してください。プロフィール・写真・投稿・Q&amp;A・フォロー関係など、すべてのデータが削除されます。
        </Q>
        <Q q="プロフィール写真を変えるには？">
          マイページでプロフィール写真を押し、「写真を撮る」または「ライブラリから選ぶ」を選んでください。同じメニューから削除もできます。
        </Q>
        <Q q="有料プランを解約するには？">
          iPhone の「設定」→ Apple ID →「サブスクリプション」から解約できます。アカウントを削除しても自動では解約されません。
        </Q>
      </Section>

      <Section title="関連ページ">
        <a href="/privacy" style={{ color: '#40e8ff' }}>プライバシーポリシー</a>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 11, color: '#40e8ff', letterSpacing: '0.08em', marginBottom: 10, textShadow: '0 0 6px rgba(64,232,255,0.4)' }}>
        ■ {title}
      </h2>
      <div style={{ fontSize: 10, lineHeight: 2.2, color: '#b0a8d0', paddingLeft: 8 }}>
        {children}
      </div>
    </section>
  )
}

function Q({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ color: '#ffd700' }}>Q. {q}</div>
      <div>{children}</div>
    </div>
  )
}
