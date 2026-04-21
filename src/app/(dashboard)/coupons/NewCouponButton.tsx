'use client';

import { useActionState, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { createCouponAction } from './coupon-actions';

export default function NewCouponButton() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(createCouponAction, null);

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
      <button type="button" onClick={() => setOpen(true)} className="btn-brand text-xs px-3 py-1.5">+ 新規</button>
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-xl p-5 w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-stone-900">クーポンを追加</h2>
              <button onClick={() => setOpen(false)} className="text-stone-400 hover:text-stone-700"><X className="w-5 h-5" /></button>
            </div>

            {state?.error && <div className="mb-3 p-2 rounded text-xs bg-red-50 border border-red-200 text-red-700">{state.error}</div>}
            {state?.ok && <div className="mb-3 p-2 rounded text-xs bg-emerald-50 border border-emerald-200 text-emerald-800">{state.message}</div>}

            <form action={formAction} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">クーポン名 *</label>
                <input name="title" required className="input" placeholder="初回限定 20%OFF" />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">説明</label>
                <textarea name="description" rows={2} className="input" placeholder="ご新規のお客様限定のクーポンです" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">割引種別 *</label>
                  <select name="discountType" className="input" defaultValue="yen">
                    <option value="yen">金額 (円)</option>
                    <option value="percent">割合 (%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">割引値 *</label>
                  <input name="discountValue" type="number" inputMode="numeric" required min={1} className="input" placeholder="1000 or 20" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">最低利用金額</label>
                  <input name="minPurchase" type="number" inputMode="numeric" min={0} defaultValue={0} className="input" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">利用上限回数 (0=無制限)</label>
                  <input name="maxUses" type="number" inputMode="numeric" min={0} defaultValue={0} className="input" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">有効期限</label>
                  <input name="validUntil" type="date" className="input" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">対象</label>
                  <select name="targetSegment" className="input" defaultValue="all">
                    <option value="all">全顧客</option>
                    <option value="new">新規顧客</option>
                    <option value="dormant">休眠顧客</option>
                    <option value="line_friend">LINE友だち</option>
                    <option value="vip">VIP顧客</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-1">
                <button type="button" onClick={() => setOpen(false)} className="btn-ghost border border-stone-300 text-xs px-3 py-2">キャンセル</button>
                <button type="submit" disabled={pending} className="btn-brand text-xs px-4 py-2">
                  {pending ? '作成中...' : '作成'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
