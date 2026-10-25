import { APP_BUNDLE_ID } from '@/lib/app-id'

// Universal Links: このパスのリンクは、アプリが入っていればアプリで開く
// iOS が取りに来る（ログインなし）ので proxy.ts で公開している
const APP_ID = `N223HKCVY4.${APP_BUNDLE_ID}`
const PATHS = ['/profile/*', '/invite/*']

export function GET() {
  return Response.json(
    {
      applinks: {
        details: [
          {
            appIDs: [APP_ID],
            components: PATHS.map(p => ({ '/': p })),
            // iOS 12 以前向け
            appID: APP_ID,
            paths: PATHS,
          },
        ],
      },
    },
    { headers: { 'Cache-Control': 'public, max-age=3600' } },
  )
}
