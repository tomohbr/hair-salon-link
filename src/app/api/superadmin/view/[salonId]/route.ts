// SuperAdmin: 指定店舗のビューモードに入る
// GET /api/superadmin/view/[salonId] → cookie をセットして /dashboard にリダイレクト

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { buildRedirectUrl } from '@/lib/baseUrl';

const VIEW_COOKIE = 'hsl_superadmin_view_salon';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ salonId: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== 'superadmin') {
    return NextResponse.redirect(buildRedirectUrl(req, '/login'));
  }

  const { salonId } = await params;
  if (!salonId) {
    return NextResponse.redirect(buildRedirectUrl(req, '/superadmin'));
  }

  const res = NextResponse.redirect(buildRedirectUrl(req, '/dashboard'));
  res.cookies.set(VIEW_COOKIE, salonId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8,
    path: '/',
  });
  // CDN キャッシュ防止（認証セッションに紐づくリダイレクトのため）
  res.headers.set('Cache-Control', 'private, no-cache, no-store, max-age=0, must-revalidate');
  res.headers.set('Pragma', 'no-cache');
  res.headers.set('Expires', '0');
  return res;
}
