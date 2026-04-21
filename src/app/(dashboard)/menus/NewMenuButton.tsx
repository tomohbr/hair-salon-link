'use client';

import { useActionState, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { createMenuAction } from './menu-actions';

export default function NewMenuButton({ categories }: { categories: string[] }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(createMenuAction, null);

  useEffect(() => {
    if (state?.ok) {
      const t = setTimeout(() => setOpen(false), 900);
      return () => clearTimeout(t);
    }
  }, [state]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-brand text-xs px-3 py-1.5"
      >
        + 新規
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={() => setOpen(false)}>
          <div
            className="bg-white rounded-xl p-5 w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-stone-900">メニューを追加</h2>
              <button onClick={() => setOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {state?.error && (
              <div className="mb-3 p-2 rounded text-xs bg-red-50 border border-red-200 text-red-700">
                {state.error}
              </div>
            )}
            {state?.ok && (
              <div className="mb-3 p-2 rounded text-xs bg-emerald-50 border border-emerald-200 text-emerald-800">
                {state.message}
              </div>
            )}

            <form action={formAction} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">メニュー名 *</label>
                <input name="name" required className="input" placeholder="カット" />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">カテゴリ</label>
                <input
                  name="category"
                  list="menu-categories"
                  className="input"
                  defaultValue={categories[0] || 'カット'}
                  placeholder="カット / カラー / パーマ"
                />
                <datalist id="menu-categories">
                  {categories.map((c) => <option key={c} value={c} />)}
                  <option value="カット" />
                  <option value="カラー" />
                  <option value="パーマ" />
                  <option value="トリートメント" />
                  <option value="ヘッドスパ" />
                  <option value="セット" />
                </datalist>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">料金 (円) *</label>
                  <input
                    name="price"
                    type="number"
                    inputMode="numeric"
                    required
                    min={0}
                    className="input"
                    placeholder="5000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">所要時間 (分) *</label>
                  <input
                    name="durationMinutes"
                    type="number"
                    inputMode="numeric"
                    required
                    min={1}
                    defaultValue={60}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">説明（任意）</label>
                <textarea
                  name="description"
                  rows={2}
                  className="input"
                  placeholder="髪質に合わせたカットご提案"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-stone-700">
                <input type="checkbox" name="isActive" defaultChecked />
                <span>公開する（予約ページに表示）</span>
              </label>

              <div className="flex gap-2 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="btn-ghost border border-stone-300 text-xs px-3 py-2"
                >
                  キャンセル
                </button>
                <button type="submit" disabled={pending} className="btn-brand text-xs px-4 py-2">
                  {pending ? '追加中...' : '追加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
