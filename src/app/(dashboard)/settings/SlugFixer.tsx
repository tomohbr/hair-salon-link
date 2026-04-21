'use client';

import { useActionState } from 'react';
import { regenerateSlugAction } from './settings-actions';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export default function SlugFixer({ currentSlug }: { currentSlug: string }) {
  const [state, formAction, pending] = useActionState(regenerateSlugAction, null);

  // ASCII 安全な slug か判定
  const isBroken = !/^[a-z0-9-]+$/.test(currentSlug);

  if (!isBroken && !state) return null;

  return (
    <form action={formAction} className="mt-2">
      {isBroken && !state?.ok && (
        <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <div className="font-semibold">公開URLに日本語が含まれています</div>
            <div>
              スマートフォンによっては URL が開けない場合があります。下のボタンで ASCII 安全な URL に作り直せます。
              （お客様に共有済みの場合は、新しい URL を再共有してください）
            </div>
            <button
              type="submit"
              disabled={pending}
              className="mt-1 btn-brand text-xs px-3 py-1.5 inline-flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${pending ? 'animate-spin' : ''}`} />
              {pending ? '変更中...' : 'URL を作り直す'}
            </button>
          </div>
        </div>
      )}
      {state?.ok && (
        <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-xs text-emerald-800">
          ✅ {state.message}
        </div>
      )}
      {state?.error && (
        <div className="p-2.5 rounded-lg bg-red-50 border border-red-300 text-xs text-red-700">
          {state.error}
        </div>
      )}
    </form>
  );
}
