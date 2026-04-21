'use client';

import { useActionState, useState } from 'react';
import { changeEmailAction, changeNameAction } from './profile-actions';
import { Pencil, X } from 'lucide-react';

export function EmailEditor({ currentEmail }: { currentEmail: string }) {
  const [state, formAction, pending] = useActionState(changeEmailAction, null);
  const [open, setOpen] = useState(false);

  // 成功したら自動で閉じる
  if (state?.ok && open) {
    setTimeout(() => setOpen(false), 1200);
  }

  return (
    <div className="space-y-2">
      {!open ? (
        <div className="flex items-center justify-between">
          <span className="font-medium text-stone-900">{currentEmail}</span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1"
          >
            <Pencil className="w-3 h-3" /> 変更
          </button>
        </div>
      ) : (
        <form action={formAction} className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500">メールアドレス変更</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-stone-400 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {state?.error && (
            <div className="p-2 rounded text-xs bg-red-50 border border-red-200 text-red-700">
              {state.error}
            </div>
          )}
          {state?.ok && (
            <div className="p-2 rounded text-xs bg-emerald-50 border border-emerald-200 text-emerald-800">
              {state.message}
            </div>
          )}
          <div>
            <label className="block text-[11px] text-stone-600 mb-1">新しいメールアドレス</label>
            <input
              type="email"
              name="newEmail"
              required
              defaultValue={currentEmail}
              className="input"
              placeholder="new@example.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-[11px] text-stone-600 mb-1">現在のパスワード（本人確認）</label>
            <input
              type="password"
              name="currentPassword"
              required
              className="input"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          <button type="submit" disabled={pending} className="btn-brand text-xs px-4 py-2">
            {pending ? '変更中...' : '変更を保存'}
          </button>
        </form>
      )}
    </div>
  );
}

export function NameEditor({ currentName }: { currentName: string }) {
  const [state, formAction, pending] = useActionState(changeNameAction, null);
  const [open, setOpen] = useState(false);

  if (state?.ok && open) {
    setTimeout(() => setOpen(false), 1200);
  }

  return (
    <div className="space-y-2">
      {!open ? (
        <div className="flex items-center justify-between">
          <span className="font-medium text-stone-900">{currentName}</span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1"
          >
            <Pencil className="w-3 h-3" /> 変更
          </button>
        </div>
      ) : (
        <form action={formAction} className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500">名前の変更</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-stone-400 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {state?.error && (
            <div className="p-2 rounded text-xs bg-red-50 border border-red-200 text-red-700">
              {state.error}
            </div>
          )}
          {state?.ok && (
            <div className="p-2 rounded text-xs bg-emerald-50 border border-emerald-200 text-emerald-800">
              {state.message}
            </div>
          )}
          <div>
            <label className="block text-[11px] text-stone-600 mb-1">新しい名前</label>
            <input
              type="text"
              name="newName"
              required
              defaultValue={currentName}
              className="input"
              placeholder="山田 太郎"
              autoComplete="name"
            />
          </div>
          <button type="submit" disabled={pending} className="btn-brand text-xs px-4 py-2">
            {pending ? '変更中...' : '変更を保存'}
          </button>
        </form>
      )}
    </div>
  );
}
