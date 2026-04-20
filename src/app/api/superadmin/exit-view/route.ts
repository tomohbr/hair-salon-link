// SuperAdmin: ビューモード解除
// GET /api/superadmin/exit-view → cookie を削除して /superadmin にリダイレクト

import { NextRequest, NextResponse } from 'next/server';
import { buildRedirectUrl } from '@/lib/baseUrl';

const VIEW_COOKIE = 'hsl_superadmin_view_salon';

export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(buildRedirectUrl(req, '/superadmin'));
  res.cookies.set(VIEW_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  // Fastly/CDN が 307 リダイレクトをキャッシュしないよう明示
  res.headers.set('Cache-Control', 'private, no-cache, no-store, max-age=0, must-revalidate');
  res.headers.set('Pragma', 'no-cache');
  res.headers.set('Expires', '0');
  return res;
}
