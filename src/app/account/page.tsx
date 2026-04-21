// アカウント設定ページ (全ロール対応)
// パスワード変更とアカウント情報の確認ができる。

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import ChangePasswordForm from './ChangePasswordForm';
import { EmailEditor, NameEditor } from './ProfileForms';

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { salon: true },
  });
  if (!user) redirect('/login');

  const roleLabel = user.role === 'superadmin' ? 'SaaS運営者' : user.role === 'admin' ? '店舗管理者' : 'スタッフ';
  const backHref = user.role === 'superadmin' ? '/superadmin' : '/dashboard';

  return (
    <div className="app-light min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href={backHref} className="text-sm text-stone-600 hover:text-stone-900">
            ← {user.role === 'superadmin' ? 'SuperAdmin' : 'ダッシュボード'} へ戻る
          </Link>
          <form action="/api/auth/logout" method="POST" className="inline">
            <button type="submit" className="text-xs text-stone-500 hover:text-stone-900">
              ログアウト
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">アカウント設定</h1>
          <p className="text-sm text-stone-500 mt-1">プロフィールとパスワードの管理</p>
        </div>

        <section className="card-box">
          <h2 className="font-semibold text-stone-900 mb-4">プロフィール</h2>
          <dl className="space-y-3 text-sm">
            <div className="border-b border-stone-100 pb-3">
              <dt className="text-stone-500 mb-1">名前</dt>
              <dd><NameEditor currentName={user.name} /></dd>
            </div>
            <div className="border-b border-stone-100 pb-3">
              <dt className="text-stone-500 mb-1">メールアドレス</dt>
              <dd><EmailEditor currentEmail={user.email} /></dd>
            </div>
            <div className="flex justify-between border-b border-stone-100 pb-2">
              <dt className="text-stone-500">ロール</dt>
              <dd className="font-medium text-stone-900">
                <span className="badge badge-brand">{roleLabel}</span>
              </dd>
            </div>
            {user.salon && (
              <div className="flex justify-between border-b border-stone-100 pb-2">
                <dt className="text-stone-500">所属店舗</dt>
                <dd className="font-medium text-stone-900">{user.salon.name}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-stone-500">登録日</dt>
              <dd className="font-medium text-stone-900">{new Date(user.createdAt).toLocaleDateString('ja-JP')}</dd>
            </div>
          </dl>
        </section>

        <section className="card-box">
          <h2 className="font-semibold text-stone-900 mb-1">パスワード変更</h2>
          <p className="text-xs text-stone-500 mb-4">変更後は次回のログインから新しいパスワードが必要になります。</p>
          <ChangePasswordForm />
        </section>
      </main>
    </div>
  );
}
