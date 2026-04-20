// 診断用: 現在のブラウザが送ってくる cookie / session の状態を JSON で返す
// 認証不要・読み取り専用。問題切り分け後に削除可能。

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'hairsalonlink_session';
const VIEW_COOKIE = 'hsl_superadmin_view_salon';

function getSecret() {
  const secret = process.env.SESSION_SECRET || 'dev-secret-change-me-in-production-12345678';
  return new TextEncoder().encode(secret);
}

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get(COOKIE_NAME)?.value;
  const viewCookie = req.cookies.get(VIEW_COOKIE)?.value;
  const allCookieNames = req.cookies.getAll().map((c) => c.name);

  let sessionPayload: unknown = null;
  let sessionError: string | null = null;
  if (sessionCookie) {
    try {
      const { payload } = await jwtVerify(sessionCookie, getSecret());
      sessionPayload = payload;
    } catch (e) {
      sessionError = e instanceof Error ? e.message : String(e);
    }
  }

  const data = {
    now: new Date().toISOString(),
    url: req.url,
    host: req.headers.get('host'),
    xForwardedHost: req.headers.get('x-forwarded-host'),
    xForwardedProto: req.headers.get('x-forwarded-proto'),
    userAgent: req.headers.get('user-agent'),
    cookieNames: allCookieNames,
    hasSessionCookie: !!sessionCookie,
    sessionCookieLength: sessionCookie?.length ?? 0,
    hasViewCookie: !!viewCookie,
    viewCookieValue: viewCookie ?? null,
    sessionPayload,
    sessionError,
    envAppUrl: process.env.NEXT_PUBLIC_APP_URL ?? null,
    hasSessionSecret: !!process.env.SESSION_SECRET,
  };

  const res = NextResponse.json(data);
  res.headers.set('Cache-Control', 'private, no-cache, no-store, max-age=0, must-revalidate');
  return res;
}
