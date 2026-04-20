// Railway 等のリバースプロキシ環境では req.url が内部 localhost を返すため、
// 外部公開URLを正しく取得するヘルパー。
//
// 優先順位:
// 1. NEXT_PUBLIC_APP_URL 環境変数 (本番で必ず設定する)
// 2. x-forwarded-* ヘッダ (リバースプロキシが付与する)
// 3. host ヘッダ
// 4. req.nextUrl (最後の手段、内部 localhost を返す可能性あり)

import type { NextRequest } from 'next/server';

export function getBaseUrl(req: NextRequest): string {
  // 1. 環境変数優先
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl) return envUrl.replace(/\/$/, '');

  // 2. リバースプロキシヘッダから組み立て
  const forwardedHost = req.headers.get('x-forwarded-host');
  const forwardedProto = req.headers.get('x-forwarded-proto');
  if (forwardedHost) {
    const proto = forwardedProto || 'https';
    return `${proto}://${forwardedHost}`;
  }

  // 3. 通常の host ヘッダ
  const host = req.headers.get('host');
  if (host) {
    const proto = req.nextUrl.protocol.replace(':', '');
    return `${proto}://${host}`;
  }

  // 4. フォールバック
  return req.nextUrl.origin;
}

/** リダイレクト用の絶対URLを安全に作成 */
export function buildRedirectUrl(req: NextRequest, path: string): string {
  const base = getBaseUrl(req);
  return `${base}${path.startsWith('/') ? path : '/' + path}`;
}
