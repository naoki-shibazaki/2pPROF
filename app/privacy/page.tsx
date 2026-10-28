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
      <a href="/" style={{ display: 'inline-block', fontSize: 14, color: '#40e8ff', marginBottom: 24 }}>
        ◀ もどる
      </a>
      <h1 style={{ fontSize: 20, color: '#ff40c0', letterSpacing: '0.1em', marginBottom: 8, textShadow: '0 0 12px rgba(255,64,192,0.5)' }}>
        プライバシーポリシー
      </h1>
      <p style={{ fontSize: 13, color: '#8a7aa8', marginBottom: 32 }}>最終更新日：2026年10月</p>

      <Section title="1. はじめに">
        2P PROF（以下「本アプリ」）は、ユーザーのプライバシーを尊重し、個人情報の適切な取り扱いに努めます。本ポリシーは、本アプリが収集する情報とその利用方法について説明します。
      </Section>

      <Section title="2. 収集する情報">
        <Item>メールアドレス（アカウント登録時）</Item>
        <Item>表示名・ハンドル名・プロフィール画像</Item>
        <Item>自己紹介文・Q&A・ひとこと投稿などのプロフィール情報</Item>
        <Item>Apple / Google / LINE アカウント情報（外部サービスでログインした場合。Apple の「メールを非公開」を選んだ場合は中継用アドレスのみ）</Item>
        <Item>プロフィール写真（カメラ撮影または写真ライブラリから選択した場合のみ）</Item>
        <Item>位置情報（友達タブの「近くの友達をさがす」を押したときのみ。バックグラウンドでは取得しません）</Item>
        <Item>友達と会った記録（「会った？」に答えた日時と相手）</Item>
        <Item>アプリの利用状況（アプリを開いた日と回数、エラーログ等。利用者数の集計とサービス改善に使います）</Item>
      </Section>

      <Section title="3. 情報の利用目的">
        <Item>アカウントの作成・認証</Item>
        <Item>プロフィールの表示・共有機能の提供</Item>
        <Item>友達・フォロー機能の提供</Item>
        <Item>近くにいる友達の表示と、友達と会った回数の記録（位置情報は近くにいるかどうかの判定にのみ使い、相手には距離だけを表示します。位置情報は最後に取得したもの1件だけを保存し、1時間以内に削除します。会った回数は会った本人どうしにだけ表示し、ほかのユーザーには表示しません）</Item>
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
        <Item>Sign in with Apple / Google OAuth / LINE Login（認証）</Item>
        <Item>RevenueCat（有料プランの購入管理）</Item>
      </Section>

      <Section title="6. データの保管・セキュリティ">
        データはSSL/TLS暗号化通信により送受信されます。パスワードはbcryptでハッシュ化して保存します。不正アクセス防止のための適切な技術的措置を講じています。
      </Section>

      <Section title="7. アカウント削除">
        アプリ右上の歯車アイコン（設定）→「アカウントを削除」からいつでも削除できます。削除すると、プロフィール・写真・投稿・Q&A・フォロー関係など関連するすべてのデータを直ちに消去します。アプリを利用できない場合は下記メールアドレスまでご連絡ください。
      </Section>

      <Section title="8. お問い合わせ">
        プライバシーに関するお問い合わせは以下までご連絡ください。<br />
        <span style={{ color: '#40e8ff' }}>support@2p-profile.info</span>
      </Section>

      <Section title="9. ポリシーの変更">
        本ポリシーは必要に応じて更新することがあります。重要な変更がある場合はアプリ内でお知らせします。
      </Section>

      <div style={{ marginTop: 48, paddingTop: 16, borderTop: '1px solid rgba(255,64,192,0.15)', fontSize: 12, color: '#6a6090' }}>
        © 2024 2P PROF
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 14, color: '#40e8ff', letterSpacing: '0.08em', marginBottom: 10, textShadow: '0 0 6px rgba(64,232,255,0.4)' }}>
        ■ {title}
      </h2>
      <div style={{ fontSize: 13, lineHeight: 2.2, color: '#b0a8d0', paddingLeft: 8 }}>
        {children}
      </div>
    </section>
  )
}

function Item({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 2 }}>
      <span style={{ color: '#8a7aa8', flexShrink: 0 }}>·</span>
      <span>{children}</span>
    </div>
  )
}
