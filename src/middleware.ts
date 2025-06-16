import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

// Define API routes that don't require authentication
const publicApiRoutes = ['/api/auth/login', '/api/auth/register', '/api/auth/verify-email'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is public
  const isPublicRoute = publicRoutes.includes(pathname);
  const isPublicApiRoute = publicApiRoutes.includes(pathname);

  // Get the token from the cookies
  const token = request.cookies.get('token')?.value;

  // Handle API routes
  if (pathname.startsWith('/api/')) {
    if (isPublicApiRoute) {
      return NextResponse.next();
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    return NextResponse.next();
  }

  // Handle page routes
  if (isPublicRoute) {
    if (token) {
      // If user is authenticated and tries to access public route, redirect to home
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Protected routes
  if (!token) {
    // Redirect to login if no token is present
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /_next (Next.js internals)
     * 2. /_static (static files)
     * 3. /_vercel (Vercel internals)
     * 4. /favicon.ico, /sitemap.xml (static files)
     * 5. /api/auth/* (auth API routes)
     */
    '/((?!_next|_static|_vercel|favicon.ico|sitemap.xml).*)',
  ],
}; 