// middleware.js
import { NextResponse } from 'next/server';
import { verifyToken } from './lib/jwt';

export async function middleware(request) {
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  // Route definitions
  const protectedRoutes = ['/profile', '/admin', '/webadmin'];
  const adminRoutes = ['/admin'];
  const webadminRoutes = ['/webadmin'];

  // Check if current route is protected
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    try {
      // Verify token - make sure verifyToken returns the decoded payload
      const decoded = await verifyToken(token);
      
      if (!decoded) {
        throw new Error('Invalid token');
      }

      // Check admin access
      const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
      if (isAdminRoute && decoded.role !== 'admin') {
        return NextResponse.redirect(new URL('/main/unauthorized', request.url));
      }

      // Check webadmin access
      const isWebadminRoute = webadminRoutes.some(route => pathname.startsWith(route));
      if (isWebadminRoute && decoded.role !== 'webadmin') {
        return NextResponse.redirect(new URL('/main/unauthorized', request.url));
      }

      // Add user info to headers
      const headers = new Headers(request.headers);
      headers.set('x-user-id', decoded.userId);
      headers.set('x-user-email', decoded.email);
      headers.set('x-user-role', decoded.role);

      return NextResponse.next({
        request: { headers },
      });
      

    } catch (error) {
      console.error('Authentication error:', error);
      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.delete('auth-token');
      return response;
    }
  }

  return NextResponse.next();
}

// Config to specify which paths should use middleware
export const config = {
  matcher: [
    '/profile/:path*',
    '/admin/dashboard:path*',
    '/webadmin/dashboard:path*'
  ],
};