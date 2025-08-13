import { getSessionCookie } from 'better-auth/cookies';
import { type NextRequest, NextResponse } from 'next/server';

const privateRoutes: string[] = [];
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));
  if (!sessionCookie && isPrivateRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  if (sessionCookie && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
