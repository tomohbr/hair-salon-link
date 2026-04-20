// ログインページ - Server Action を使わず、通常フォーム POST で /api/auth/login へ
import Link from 'next/link';
import { cookies, headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  const error = sp?.error;

  // 診断: 現在ブラウザが送ってくる cookie 名の一覧を表示
  const cookieStore = await cookies();
  const hdrs = await headers();
  const cookieNames = cookieStore.getAll().map((c) => c.name);
  const hasSession = cookieNames.includes('hairsalonlink_session');

  return (
    <div className="w-full max-w-md">
      <div className="mb-3 p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900 font-mono">
        <div><b>🔍 診断:</b> ブラウザが送信した cookie</div>
        <div>件数: <b>{cookieNames.length}</b></div>
        <div>名前: [{cookieNames.join(', ') || '(なし)'}]</div>
        <div>hairsalonlink_session: <b>{hasSession ? '✅ あり' : '❌ なし'}</b></div>
        <div className="mt-1 text-[10px] text-blue-700">
          Host: {hdrs.get('host')} / Proto: {hdrs.get('x-forwarded-proto')}
        </div>
      </div>
      <div className="card-box">
        <h1 className="text-2xl font-bold text-stone-900 mb-1">ログイン</h1>
        <p className="text-sm text-stone-500 mb-6">HairSalonLink にログインします</p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        <form action="/api/auth/login" method="POST" className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">メールアドレス</label>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              className="input"
              placeholder="owner@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">パスワード</label>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="input"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-brand w-full justify-center py-2.5">
            ログイン
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-stone-100 text-center text-sm text-stone-600">
          アカウントをお持ちでない方は{' '}
          <Link href="/register" className="brand-text font-semibold">新規登録</Link>
        </div>
      </div>

      <div className="mt-4 p-4 rounded-lg bg-stone-100 text-xs text-stone-600">
        <div className="font-semibold mb-2">💡 ロール別ログイン</div>
        <ul className="space-y-1">
          <li>・<b>管理者（店舗オーナー）</b>: 全機能にアクセス可</li>
          <li>・<b>スタッフ</b>: 予約・顧客・カルテ・メニューのみ</li>
          <li>・<b>SaaS運営者</b>: /superadmin で全店舗を管理</li>
        </ul>
      </div>
    </div>
  );
}
