import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const authRoutes =  [
        "/login", 
        "/register", 
        "/verify-email",
        "/request-password-reset",
        "/reset-password",
        "/api/auth/signup",
        "/api/auth/login", 
        "/api/auth/verify", 
        "/api/auth/request-password-reset", 
        "/api/auth/reset-password"
    ];

    const token = request.cookies.get("jwtToken")?.value;
    if(!authRoutes.includes(request.nextUrl.pathname) && !token) {
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