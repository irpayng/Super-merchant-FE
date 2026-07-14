import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  const publicPaths = [
    '/login',
    '/register',
    '/forgot-password',
    '/verify-otp',
    '/reset-password',
  ];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  if (!token && !isPublicPath) {
    // return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Exclude public static files and Next.js assets
export const config = {
  matcher: ['/((?!api|_next|.*\\.).*)'],
};
