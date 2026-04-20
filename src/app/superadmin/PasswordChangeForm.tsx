'use client';

import { useActionState } from 'react';
import { changePasswordAction } from './password-action';

export default function PasswordChangeForm() {
  const [state, formAction, isPending] = useActionState(changePasswordAction, null);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="p-3 rounded-lg text-sm bg-red-50 border border-red-200 text-red-700">
          {state.error}
        </div>
      )}
      {state?.ok && (
        <div className="p-3 rounded-lg text-sm bg-emerald-50 border border-emerald-200 text-emerald-800">
          {state.message}
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-stone-700 mb-1">現在のパスワード</label>
        <input
          type="password"
          name="currentPassword"
          required
          autoComplete="current-password"
          className="input"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-stone-700 mb-1">新しいパスワード (8文字以上)</label>
        <input
          type="password"
          name="newPassword"
          required
          minLength={8}
          autoComplete="new-password"
          className="input"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-stone-700 mb-1">新しいパスワード (確認)</label>
        <input
          type="password"
          name="confirmPassword"
          required
          minLength={8}
          autoComplete="new-password"
          className="input"
        />
      </div>

      <button type="submit" disabled={isPending} className="btn-brand w-full justify-center py-2.5">
        {isPending ? '変更中...' : 'パスワードを変更する'}
      </button>

      <p className="text-[11px] text-stone-500">
        ※ 変更後のパスワードはデータベースに保存され、再デプロイされても保持されます。
      </p>
    </form>
  );
}
