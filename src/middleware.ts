import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'hairsalonlink_session';

function getSecret() {
  const secret = process.env.SESSION_SECRET || 'dev-secret-change-me-in-production-12345678';
  return new TextEncoder().encode(secret);
}

/**
 * Railway 等のリバースプロキシ環境では req.url が内部の localhost を指すため、
 * 外部から見える正しい URL でリダイレクトを構築する。
 */
function externalRedirect(req: NextRequest, path: string): NextResponse {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl) {
    return NextResponse.redirect(`${envUrl.replace(/\/$/, '')}${path}`);
  }
  const fwdHost = req.headers.get('x-forwarded-host');
  const fwdProto = req.headers.get('x-forwarded-proto') || 'https';
  if (fwdHost) {
    return NextResponse.redirect(`${fwdProto}://${fwdHost}${path}`);
  }
  const host = req.headers.get('host');
  if (host) {
    const proto = req.nextUrl.protocol.replace(':', '');
    return NextResponse.redirect(`${proto}://${host}${path}`);
  }
  return NextResponse.redirect(new URL(path, req.url));
}

const protectedPaths = [
  '/dashboard',
  '/reservations',
  '/customers',
  '/menus',
  '/coupons',
  '/messages',
  '/designs',
  '/analytics',
  '/settings',
  '/superadmin',
  '/account',
];

const staffAllowed = ['/dashboard', '/reservations', '/customers', '/menus', '/account'];
const superadminOnly = ['/superadmin'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return externalRedirect(req, '/login');
  }
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const role = payload.role as string;

    if (superadminOnly.some((p) => pathname.startsWith(p)) && role !== 'superadmin') {
      return externalRedirect(req, '/dashboard');
    }
    if (role === 'staff') {
      const allowed = staffAllowed.some((p) => pathname.startsWith(p));
      if (!allowed) {
        return externalRedirect(req, '/dashboard');
      }
    }
    return NextResponse.next();
  } catch {
    return externalRedirect(req, '/login');
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/reservations/:path*',
    '/customers/:path*',
    '/menus/:path*',
    '/coupons/:path*',
    '/messages/:path*',
    '/designs/:path*',
    '/analytics/:path*',
    '/settings/:path*',
    '/superadmin/:path*',
    '/account/:path*',
  ],
};
