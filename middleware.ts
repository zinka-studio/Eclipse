import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /admin routes (not /admin/login or /admin/api/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login' && pathname !== '/admin/api/login') {
    const token = request.cookies.get('admin_token')?.value
    const validToken = process.env.ADMIN_PASSWORD

    if (token !== validToken) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
