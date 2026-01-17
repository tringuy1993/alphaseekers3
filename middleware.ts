import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Regex to match requests for static files (e.g., .js, .css, .png)
const PUBLIC_FILE = /\.(.*)$/;

/**
 * Redirects unauthenticated users to the login page
 * Preserves the original URL as a redirect parameter so users
 * can be sent back after successful login
 */
function redirectToLogin(request: NextRequest) {
  // Allow these public pages without redirect
  if (
    request.nextUrl.pathname === '/signin' ||
    request.nextUrl.pathname === '/music' ||
    request.nextUrl.pathname === '/about'
  ) {
    return NextResponse.next();
  }

  // Build redirect URL to login page with return path
  const url = request.nextUrl.clone();
  url.pathname = '/authentication/signin';
  url.search = `redirect=${request.nextUrl.pathname}${url.search}`;
  return NextResponse.redirect(url);
}

// CORS: Allowed origins for cross-origin requests
// Production: Only allow requests from the official domain
// Development: Allow localhost for local testing
const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? ['https://www.alpha-seekers.com', 'https://alpha-seekers.com']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'];

/**
 * Next.js Middleware - runs on every request before reaching the page
 *
 * Handles:
 * 1. Root redirect (/ -> /options-data)
 * 2. Bypassing middleware for static assets and API routes
 * 3. CORS origin validation
 */
export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // Redirect root path to main options data page
  if (url.pathname === '/') {
    url.pathname = '/options-data';
    return NextResponse.redirect(url);
  }

  const { pathname } = request.nextUrl;

  // Skip middleware for:
  // - Next.js internal routes (_next)
  // - API routes
  // - Static files
  // - Auth pages (signin, register)
  // - Public files (images, etc.)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/signin') ||
    pathname.startsWith('/register') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // CORS validation: Block requests from unauthorized origins
  // This provides an additional layer of security against cross-site attacks
  const origin = request.headers.get('Origin');
  if (origin && !allowedOrigins.includes(origin)) {
    return new NextResponse(null, {
      status: 400,
      statusText: 'Bad Request',
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }

  return NextResponse.next();
}

// Middleware matcher configuration
// Defines which routes the middleware should run on
export const config = {
  // Run on all routes except:
  // - _next/static (static files)
  // - favicon.ico
  // - logo.svg
  matcher: ['/', '/((?!_next/static|favicon.ico|logo.svg).*)'],
};
