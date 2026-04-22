'use client';

import { useActionState, useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { sendLineMessageAction } from '../customer-actions';

export default function SendLineButton({ customerId, customerName }: { customerId: string; customerName: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(sendLineMessageAction, null);

  useEffect(() => {
    if (state?.ok) {
      const t = setTimeout(() => setOpen(false), 1200);
      return () => clearTimeout(t);
    }
  }, [state]);

  useEffect(() => {
    if (open) { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = ''; }; }
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="w-full btn-brand justify-center">
        <MessageCircle className="w-4 h-4" />LINEメッセージ送信
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 modal-sheet-bg" onClick={() => setOpen(false)}>
          <div className="modal-sheet bg-white rounded-xl p-5 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-stone-900">LINE メッセージ送信</h2>
              <button onClick={() => setOpen(false)} className="text-stone-400 hover:text-stone-700"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-xs text-stone-500 mb-3">{customerName}様 に個別メッセージを送信します。無料枠 200通にはカウントされません。</p>

            {state?.error && <div className="mb-3 p-2 rounded text-xs bg-red-50 border border-red-200 text-red-700">{state.error}</div>}
            {state?.ok && <div className="mb-3 p-2 rounded text-xs bg-emerald-50 border border-emerald-200 text-emerald-800">{state.message}</div>}

            <form action={formAction} className="space-y-3">
              <input type="hidden" name="customerId" value={customerId} />
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">メッセージ</label>
                <textarea name="text" required rows={5} className="input" placeholder="例：ご予約ありがとうございます。当日お待ちしております。" />
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setOpen(false)} className="btn-ghost border border-stone-300 text-xs px-3 py-2">キャンセル</button>
                <button type="submit" disabled={pending} className="btn-brand text-xs px-4 py-2">
                  {pending ? '送信中...' : '送信'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
