// middleware.js
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { verifyToken } from './lib/jwt';


export async function middleware(request) {
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedRoutes = ['/profile', '/admin', '/webadmin'];
  const adminRoutes = ['/admin'];
  const webadminRoutes = ['/webadmin'];

  // Check if route is protected
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    try {
      // Verify token 
      const decoded = verifyToken(token);

      // Check admin routes
      if (adminRoutes.some(route => pathname.startsWith(route)) && decoded.role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }

      // Check webadmin routes
      if (webadminRoutes.some(route => pathname.startsWith(route)) && decoded.role !== 'webadmin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }

      // Add user to request headers
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', decoded.userId);
      requestHeaders.set('x-user-role', decoded.role);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

    } catch (error) {
      console.error('Token verification failed:', error.message);
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth-token');
      return response;
    }
  }

  return NextResponse.next();
}