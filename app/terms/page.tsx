export const metadata = {
  title: '利用規約 | 2P PROF',
}

const STYLE = { fontFamily: 'var(--font-pixel, monospace)' } as const

// 利用規約（EULA）。ログイン・登録の前に同意を求める（App Store Review Guideline 1.2）
export default function TermsPage() {
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
        利用規約
      </h1>
      <p style={{ fontSize: 13, color: '#8a7aa8', marginBottom: 32 }}>最終更新日：2026年10月</p>

      <Section title="1. はじめに">
        この利用規約（以下「本規約」）は、2P PROF（以下「本アプリ」）の利用条件を定めるものです。本アプリに登録・ログインした時点で、本規約と
        <a href="/privacy" style={{ color: '#40e8ff' }}>プライバシーポリシー</a>に同意したものとみなします。
      </Section>

      <Section title="2. 不適切なコンテンツ・迷惑行為は一切認めません">
        本アプリは、不適切なコンテンツや迷惑行為を一切容認しません（ゼロトレランス）。次の行為を禁止します。
        <Item>誹謗中傷、嫌がらせ、いじめ、脅迫、差別的な発言</Item>
        <Item>性的・暴力的・残虐な内容、その他公序良俗に反する内容の投稿</Item>
        <Item>他人へのなりすまし、他人の個人情報の無断掲載</Item>
        <Item>スパム、宣伝、勧誘、詐欺的な行為</Item>
        <Item>違法行為、またはそれを助長する行為</Item>
        <Item>その他、運営が不適切と判断する行為</Item>
      </Section>

      <Section title="3. 通報とブロック">
        <Item>不適切な投稿・コメント・紹介文・質問・ユーザーを見つけたら、各投稿の「⋯」またはプロフィールの「通報」から運営に通報できます。</Item>
        <Item>迷惑なユーザーは「ブロック」できます。ブロックすると、その相手の投稿はすぐに表示されなくなり、運営にも報告されます。</Item>
      </Section>

      <Section title="4. 運営による対応">
        <Item>運営は通報を受けてから24時間以内に内容を確認し、本規約に違反するコンテンツを削除します。</Item>
        <Item>違反したユーザーは、予告なくアカウントを削除（追放）することがあります。</Item>
        <Item>投稿されたコメントは、自動の判定や投稿先ユーザーの承認によって公開前に確認される場合があります。</Item>
      </Section>

      <Section title="5. ユーザーの責任">
        投稿したコンテンツの責任は投稿したユーザーにあります。他人の権利を侵害しない内容を投稿してください。
      </Section>

      <Section title="6. アカウントの削除">
        アプリ右上の歯車アイコン（設定）→「アカウントを削除」からいつでも削除できます。
      </Section>

      <Section title="7. 免責">
        運営は、本アプリの内容やユーザー間のやりとりについて、法令で認められる範囲で責任を負いません。本アプリは予告なく内容を変更・終了することがあります。
      </Section>

      <Section title="8. 規約の変更">
        本規約は必要に応じて変更することがあります。重要な変更はアプリ内でお知らせします。
      </Section>

      <Section title="9. お問い合わせ">
        <span style={{ color: '#40e8ff' }}>support@2p-profile.info</span>
      </Section>
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
