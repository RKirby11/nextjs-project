import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const publicRoutes = ["/"];
    const authRoutes =  ["/login", "/signup", "/api/auth/signup", "/api/auth/login"];

    const token = request.cookies.get("jwtToken")?.value;
    const requiresAuth = !publicRoutes.includes(request.nextUrl.pathname) && !authRoutes.includes(request.nextUrl.pathname);

    if(requiresAuth && !token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
    else if(authRoutes.includes(request.nextUrl.pathname) && token) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    else {
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico (favicon file)
       */
      '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
  };