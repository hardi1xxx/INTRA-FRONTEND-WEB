import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { DataMenuAccessRequestType } from './lib/services/master/menuAccess'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  if (Date.now() > (Number(request.cookies.get('intra_auth_expires_in')?.value) * 1000)) {
    request.cookies.delete('intra_auth_token')
    request.cookies.delete('intra_auth_name')
    request.cookies.delete('intra_auth_expires_in')
    request.cookies.delete('intra_auth_role')
  }
  if (request.nextUrl.pathname.startsWith('/') && !request.nextUrl.pathname.includes('/login') && !request.cookies.has('intra_auth_token')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (request.nextUrl.pathname == '/' || (request.nextUrl.pathname.includes('/login') && request.cookies.has('intra_auth_token'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  const menuListFlast = [
    "dashboard",


    "setting/role-user",
    "setting/user",
    "setting/latest-feature",
    "log-activity",

    // example
    "pcx-library/colorway",

    // master
    "master/waste",
  ]

  if (
    !(menuListFlast).find((value) => request.nextUrl.pathname.includes(value))
    &&
    !(['/auth/change-password', '/dashboard', '/notfound', '/forbidden', '/login', '/profile', '/notifications'].find(value => request.nextUrl.pathname == value))
  ) {
    return NextResponse.redirect(new URL('/notfound', request.url))
  }

  const menu_access = JSON.parse(request.cookies.get('intra_auth_menu_access')?.value || '[]')
  if (
    !menu_access.find((value: DataMenuAccessRequestType) => '/' + value == request.nextUrl.pathname)
    &&
    !(['/auth/change-password', '/dashboard', '/notfound', '/forbidden', '/login', '/profile', '/notifications'].find(value => request.nextUrl.pathname == value))
  ) {
    return NextResponse.redirect(new URL('/forbidden', request.url))
  }
}



// See "Matching Paths" below to learn more
export const config = {
  matcher: '/((?!api|_next/static|_next/image|images|favicon.ico).*)',
}
