import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.twopprof.app',
  appName: '2P PROF',
  // Capacitor はローカルビルドの代わりに Vercel URL を読み込む
  // → 既存の Next.js / API / 認証がそのまま動く
  webDir: 'out',
  server: {
    // デプロイ後の本番 URL に変更してください
    url: 'https://2pprof.vercel.app',
    cleartext: false,
  },
  ios: {
    contentInset: 'always',
    backgroundColor: '#08061400', // 透明（アプリ側で背景を制御）
  },
  plugins: {
    // RevenueCat は JS 側で設定
  },
}

export default config
