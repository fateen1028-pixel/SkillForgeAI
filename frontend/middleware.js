import { NextResponse } from 'next/server';

export function middleware(request) {
  // Cookie-based auth guard placeholder
  // In production, check for auth token in cookies
  const token = request.cookies.get('auth-token');
  
  // Protected routes
  const protectedPaths = ['/dashboard'];
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  // For now, allow all access (no backend yet)
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*']
};
