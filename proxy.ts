import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  const isDemo = req.nextUrl.searchParams.get('demo') === '1'

  const isPublic =
    pathname.startsWith('/login') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/privacy') ||
    pathname.startsWith('/support') ||
    pathname.startsWith('/terms') ||
    pathname.startsWith('/.well-known') ||
    (pathname === '/' && isDemo)

  if (!isLoggedIn && !isPublic) {
    const login = new URL('/login', req.url)
    // 友達のリンクから来た人は、ログイン後にそのページへ戻す
    if (/^\/(profile|invite)\/[^/]+$/.test(pathname)) login.searchParams.set('next', pathname)
    return NextResponse.redirect(login)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
