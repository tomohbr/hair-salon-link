'use client';

import { useActionState, useState, useEffect } from 'react';
import { X, Wallet, CreditCard, Smartphone, Check, AlertCircle } from 'lucide-react';
import { recordPaymentAction } from './payment-actions';

type Method = 'cash' | 'credit' | 'qr' | 'coin' | 'point' | 'other';

const METHODS: { value: Method; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'cash', label: '現金', icon: Wallet },
  { value: 'credit', label: 'クレジットカード', icon: CreditCard },
  { value: 'qr', label: 'QR決済', icon: Smartphone },
  { value: 'coin', label: 'COIN+', icon: Smartphone },
  { value: 'point', label: 'HPBポイント', icon: Wallet },
  { value: 'other', label: 'その他', icon: Wallet },
];

export default function PaymentButton({
  reservationId, customerName, menuName, menuPrice, status, paymentMethod,
}: {
  reservationId: string;
  customerName: string | null;
  menuName: string | null;
  menuPrice: number | null;
  status: string;
  paymentMethod: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState<Method>((paymentMethod as Method) || 'cash');
  const [state, formAction, pending] = useActionState(recordPaymentAction, null);

  useEffect(() => {
    if (state?.ok) {
      const t = setTimeout(() => setOpen(false), 1200);
      return () => clearTimeout(t);
    }
  }, [state]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  const completed = status === 'completed';

  return (
    <>
      {completed ? (
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium"
          style={{
            background: 'var(--success-surface)',
            color: 'var(--success-text)',
            border: '1px solid #bbf7d0',
          }}
        >
          <Check className="w-3 h-3" />
          {paymentMethod
            ? METHODS.find((m) => m.value === paymentMethod)?.label || paymentMethod
            : '完了'}
        </span>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border transition-colors"
          style={{ background: '#fafaf9', borderColor: '#e7e5e4', color: '#44403c' }}
        >
          <Wallet className="w-3 h-3" />
          支払いを記録
        </button>
      )}

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 modal-sheet-bg" onClick={() => setOpen(false)}>
          <div
            className="modal-sheet bg-white rounded-xl p-5 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-stone-900">お会計を記録</h2>
              <button onClick={() => setOpen(false)} className="text-stone-400 hover:text-stone-700"><X className="w-5 h-5" /></button>
            </div>

            <div className="mb-4 p-3 rounded-lg bg-stone-50 border border-stone-200">
              <div className="text-[11px] text-stone-500 mb-0.5">お客様</div>
              <div className="font-medium text-stone-900">{customerName || '—'}</div>
              <div className="text-[12px] text-stone-600 mt-1">{menuName} {menuPrice != null ? `(¥${menuPrice.toLocaleString()})` : ''}</div>
            </div>

            {state?.error && (
              <div className="mb-3 p-2 rounded text-xs bg-red-50 border border-red-200 text-red-700 flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                {state.error}
              </div>
            )}
            {state?.ok && (
              <div className="mb-3 p-2 rounded text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                {state.message}
              </div>
            )}

            <form action={formAction} className="space-y-4">
              <input type="hidden" name="id" value={reservationId} />

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-2">支払方法 *</label>
                <div className="grid grid-cols-3 gap-2">
                  {METHODS.map((m) => {
                    const Icon = m.icon;
                    const active = method === m.value;
                    return (
                      <label
                        key={m.value}
                        className={`cursor-pointer p-3 rounded-lg border text-center transition-all ${
                          active ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-stone-200 text-stone-700 hover:border-stone-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={m.value}
                          checked={active}
                          onChange={() => setMethod(m.value)}
                          className="sr-only"
                        />
                        <Icon className="w-4 h-4 mx-auto mb-1" />
                        <span className="text-[11px]">{m.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">施術代金 (円)</label>
                <input
                  type="number"
                  name="paidAmount"
                  inputMode="numeric"
                  defaultValue={menuPrice ?? 0}
                  min={0}
                  className="input"
                />
                <p className="text-[10px] text-stone-500 mt-1">
                  クーポン割引等で変わった場合は実金額に書き換えてください
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">店販 (円)</label>
                  <input
                    type="number"
                    name="retailAmount"
                    inputMode="numeric"
                    defaultValue={0}
                    min={0}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">チップ (円)</label>
                  <input
                    type="number"
                    name="tip"
                    inputMode="numeric"
                    defaultValue={0}
                    min={0}
                    className="input"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setOpen(false)} className="btn-ghost border border-stone-300 text-xs px-3 py-2">キャンセル</button>
                <button type="submit" disabled={pending} className="btn-brand">
                  {pending ? '記録中...' : 'お会計完了'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
