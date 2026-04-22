'use client';

import { useActionState, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { createCustomerAction } from './customer-actions';

export default function NewCustomerButton() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(createCustomerAction, null);

  useEffect(() => {
    if (state?.ok) {
      const t = setTimeout(() => setOpen(false), 900);
      return () => clearTimeout(t);
    }
  }, [state]);

  useEffect(() => {
    if (open) { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = ''; }; }
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="btn-brand">+ 新規顧客</button>
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 modal-sheet-bg" onClick={() => setOpen(false)}>
          <div className="modal-sheet bg-white rounded-xl p-5 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-stone-900">顧客を追加</h2>
              <button onClick={() => setOpen(false)} className="text-stone-400 hover:text-stone-700"><X className="w-5 h-5" /></button>
            </div>
            {state?.error && <div className="mb-3 p-2 rounded text-xs bg-red-50 border border-red-200 text-red-700">{state.error}</div>}
            {state?.ok && <div className="mb-3 p-2 rounded text-xs bg-emerald-50 border border-emerald-200 text-emerald-800">{state.message}</div>}

            <form action={formAction} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">お名前 *</label>
                <input name="name" required className="input" placeholder="佐藤 ゆかり" />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">フリガナ</label>
                <input name="nameKana" className="input" placeholder="サトウ ユカリ" />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">電話番号</label>
                <input name="phone" type="tel" className="input" placeholder="090-1234-5678" />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">メール</label>
                <input name="email" type="email" className="input" placeholder="yukari@example.com" />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">流入元</label>
                <select name="source" className="input" defaultValue="other">
                  <option value="hotpepper">ホットペッパー</option>
                  <option value="line">LINE</option>
                  <option value="web">自社HP</option>
                  <option value="phone">電話</option>
                  <option value="referral">紹介</option>
                  <option value="walk-in">ウォークイン</option>
                  <option value="other">その他</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">メモ</label>
                <textarea name="notes" rows={2} className="input" placeholder="アレルギー、要望など" />
              </div>

              <div className="flex gap-2 justify-end pt-1">
                <button type="button" onClick={() => setOpen(false)} className="btn-ghost border border-stone-300 text-xs px-3 py-2">キャンセル</button>
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
