export const metadata = {
  title: 'プライバシーポリシー | 2P PROF',
}

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

export default function PrivacyPage() {
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
      <h1 style={{ fontSize: 18, color: '#ff40c0', letterSpacing: '0.1em', marginBottom: 8, textShadow: '0 0 12px rgba(255,64,192,0.5)' }}>
        プライバシーポリシー
      </h1>
      <p style={{ fontSize: 10, color: '#604878', marginBottom: 32 }}>最終更新日：2024年10月</p>

      <Section title="1. はじめに">
        2P PROF（以下「本アプリ」）は、ユーザーのプライバシーを尊重し、個人情報の適切な取り扱いに努めます。本ポリシーは、本アプリが収集する情報とその利用方法について説明します。
      </Section>

      <Section title="2. 収集する情報">
        <Item>メールアドレス（アカウント登録時）</Item>
        <Item>表示名・ハンドル名・プロフィール画像</Item>
        <Item>自己紹介文・Q&A・ひとこと投稿などのプロフィール情報</Item>
        <Item>Google / LINE アカウント情報（OAuth認証を使用した場合）</Item>
        <Item>アプリの利用状況（エラーログ等）</Item>
      </Section>

      <Section title="3. 情報の利用目的">
        <Item>アカウントの作成・認証</Item>
        <Item>プロフィールの表示・共有機能の提供</Item>
        <Item>友達・フォロー機能の提供</Item>
        <Item>サービスの改善・不具合対応</Item>
      </Section>

      <Section title="4. 第三者への提供">
        収集した個人情報は、以下の場合を除き第三者に提供しません。
        <Item>ユーザー本人の同意がある場合</Item>
        <Item>法令に基づく場合</Item>
        <Item>サービス運営に必要な業務委託先への提供（守秘義務契約あり）</Item>
      </Section>

      <Section title="5. 使用する外部サービス">
        <Item>Vercel（ホスティング・サーバーレス関数）</Item>
        <Item>Neon（データベース）</Item>
        <Item>Vercel Blob（画像ストレージ）</Item>
        <Item>Google OAuth / LINE Login（認証）</Item>
      </Section>

      <Section title="6. データの保管・セキュリティ">
        データはSSL/TLS暗号化通信により送受信されます。パスワードはbcryptでハッシュ化して保存します。不正アクセス防止のための適切な技術的措置を講じています。
      </Section>

      <Section title="7. アカウント削除">
        アカウントの削除を希望する場合は、アプリ内の問い合わせ窓口または下記メールアドレスまでご連絡ください。削除後、関連するすべてのデータを消去します。
      </Section>

      <Section title="8. お問い合わせ">
        プライバシーに関するお問い合わせは以下までご連絡ください。<br />
        <span style={{ color: '#40e8ff' }}>support@2pprof.com</span>
      </Section>

      <Section title="9. ポリシーの変更">
        本ポリシーは必要に応じて更新することがあります。重要な変更がある場合はアプリ内でお知らせします。
      </Section>

      <div style={{ marginTop: 48, paddingTop: 16, borderTop: '1px solid rgba(255,64,192,0.15)', fontSize: 9, color: '#302448' }}>
        © 2024 2P PROF
      </div>
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

function Item({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 2 }}>
      <span style={{ color: '#604878', flexShrink: 0 }}>·</span>
      <span>{children}</span>
    </div>
  )
}
