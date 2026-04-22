/**
 * シンプルなインメモリ・レート制限
 * プロセス単位で動くので単一インスタンスデプロイ向け (Railway 1 instance)
 * 将来的に Redis ベース (Upstash) への拡張余地あり。
 */

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit: number, windowMs: number): {
  allowed: boolean;
  remaining: number;
  resetIn: number;
} {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetIn: windowMs };
  }
  if (b.count >= limit) {
    return { allowed: false, remaining: 0, resetIn: b.resetAt - now };
  }
  b.count++;
  return { allowed: true, remaining: limit - b.count, resetIn: b.resetAt - now };
}

/** Clean old buckets to prevent memory bloat (call periodically from a cron) */
export function cleanupRateLimit() {
  const now = Date.now();
  for (const [k, v] of buckets.entries()) {
    if (v.resetAt < now - 60_000) buckets.delete(k);
  }
}

/** 代表的なプリセット */
export const RATE_LIMITS = {
  // ログイン: 10 回/分 per IP
  login: { limit: 10, window: 60_000 },
  // 登録: 5 回/時間 per IP
  register: { limit: 5, window: 3_600_000 },
  // Webhook: 60 回/分 per token
  inbound: { limit: 60, window: 60_000 },
  // 一般API: 200 回/分 per salon
  api: { limit: 200, window: 60_000 },
};

export function getClientIp(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') ||
    'unknown'
  );
}
