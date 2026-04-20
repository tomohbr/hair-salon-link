// ログアウトは「ユーザーが明示的にクリックした時だけ」走るべき。
// GET だと Next.js の Link prefetch や画像リクエスト等で誤発火し、
// セッションが勝手に破壊される事故が起きたため GET 経路は廃止する。

import { NextRequest, NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth';
import { buildRedirectUrl } from '@/lib/baseUrl';

function withNoCache(res: NextResponse) {
  res.headers.set('Cache-Control', 'private, no-cache, no-store, max-age=0, must-revalidate');
  res.headers.set('Pragma', 'no-cache');
  res.headers.set('Expires', '0');
  return res;
}

export async function POST(req: NextRequest) {
  await destroySession();
  return withNoCache(NextResponse.redirect(buildRedirectUrl(req, '/login'), 303));
}

// prefetch / preload / 画像リクエスト等の副作用を避けるため、GET では何もしない。
export async function GET(req: NextRequest) {
  // セッションは消さず、ログアウト確認画面 (＝/login) に飛ばすだけ
  return withNoCache(NextResponse.redirect(buildRedirectUrl(req, '/login'), 303));
}
