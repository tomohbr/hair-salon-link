// 診断用ページ - 画面に cookie / session 状態を表示
import { cookies, headers } from 'next/headers';
import { jwtVerify } from 'jose';

export const dynamic = 'force-dynamic';

const COOKIE_NAME = 'hairsalonlink_session';
const VIEW_COOKIE = 'hsl_superadmin_view_salon';

function getSecret() {
  const secret = process.env.SESSION_SECRET || 'dev-secret-change-me-in-production-12345678';
  return new TextEncoder().encode(secret);
}

export default async function DebugPage() {
  const cookieStore = await cookies();
  const hdrs = await headers();
  const sessionCookie = cookieStore.get(COOKIE_NAME)?.value;
  const viewCookie = cookieStore.get(VIEW_COOKIE)?.value;
  const allCookies = cookieStore.getAll();

  let sessionPayload: Record<string, unknown> | null = null;
  let sessionError: string | null = null;
  if (sessionCookie) {
    try {
      const { payload } = await jwtVerify(sessionCookie, getSecret());
      sessionPayload = payload as Record<string, unknown>;
    } catch (e) {
      sessionError = e instanceof Error ? e.message : String(e);
    }
  }

  return (
    <div style={{ padding: 24, fontFamily: 'monospace', fontSize: 14, lineHeight: 1.7 }}>
      <h1 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>🔍 Session Debug</h1>
      <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
        <div><b>Host:</b> {hdrs.get('host')}</div>
        <div><b>X-Forwarded-Host:</b> {hdrs.get('x-forwarded-host')}</div>
        <div><b>X-Forwarded-Proto:</b> {hdrs.get('x-forwarded-proto')}</div>
        <hr style={{ margin: '12px 0' }} />
        <div><b>Cookie 数:</b> {allCookies.length}</div>
        <div><b>Cookie 名一覧:</b> [{allCookies.map(c => c.name).join(', ')}]</div>
        <div><b>hairsalonlink_session 有:</b> {sessionCookie ? `YES (len=${sessionCookie.length})` : 'NO ❌'}</div>
        <div><b>hsl_superadmin_view_salon 有:</b> {viewCookie ? `YES (${viewCookie})` : 'NO'}</div>
        <hr style={{ margin: '12px 0' }} />
        <div><b>JWT verify:</b> {sessionError ? `ERROR: ${sessionError}` : sessionPayload ? 'OK' : 'N/A'}</div>
        {sessionPayload && (
          <pre style={{ background: '#fff', padding: 12, marginTop: 8, borderRadius: 4 }}>
            {JSON.stringify(sessionPayload, null, 2)}
          </pre>
        )}
        <hr style={{ margin: '12px 0' }} />
        <div><b>NEXT_PUBLIC_APP_URL:</b> {process.env.NEXT_PUBLIC_APP_URL ?? '(未設定)'}</div>
        <div><b>SESSION_SECRET 設定:</b> {process.env.SESSION_SECRET ? 'YES' : 'NO ❌'}</div>
        <div><b>NODE_ENV:</b> {process.env.NODE_ENV}</div>
      </div>
      <div style={{ marginTop: 24 }}>
        <a href="/login" style={{ marginRight: 16 }}>→ /login</a>
        <a href="/superadmin" style={{ marginRight: 16 }}>→ /superadmin</a>
        <a href="/dashboard">→ /dashboard</a>
      </div>
    </div>
  );
}
