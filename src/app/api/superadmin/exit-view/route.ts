// SuperAdmin: ビューモード解除
// GET /api/superadmin/exit-view → cookie を削除して /superadmin にリダイレクト

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { buildRedirectUrl } from '@/lib/baseUrl';
import { getSession } from '@/lib/auth';
import { audit } from '@/lib/audit';

const VIEW_COOKIE = 'hsl_superadmin_view_salon';

export async function GET(req: NextRequest) {
  // Best-effort audit for VIEW_AS exit
  try {
    const session = await getSession();
    const cookieStore = await cookies();
    const viewing = cookieStore.get(VIEW_COOKIE)?.value;
    if (session?.role === 'superadmin' && viewing) {
      await audit({
        salonId: viewing,
        actorId: session.userId,
        actorName: session.email,
        action: 'superadmin.view_as.exit',
        targetType: 'Salon',
        targetId: viewing,
      });
    }
  } catch {
    // never block logout/exit on audit failure
  }

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
