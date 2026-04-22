'use client';

import { useActionState, useState, useEffect } from 'react';
import { Send, X } from 'lucide-react';
import { sendBroadcastAction } from './message-actions';

export default function NewBroadcastButton({
  label = '+ 新規配信',
  className = 'btn-brand',
  preset,
}: {
  label?: string;
  className?: string;
  preset?: { title?: string; content?: string; type?: 'broadcast' | 'segment'; segment?: string };
}) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<'broadcast' | 'segment'>(preset?.type || 'broadcast');
  const [state, formAction, pending] = useActionState(sendBroadcastAction, null);

  useEffect(() => {
    if (state?.ok) {
      const t = setTimeout(() => setOpen(false), 1500);
      return () => clearTimeout(t);
    }
  }, [state]);

  useEffect(() => {
    if (open) { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = ''; }; }
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        <Send className="w-4 h-4" />{label}
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 modal-sheet-bg" onClick={() => setOpen(false)}>
          <div className="modal-sheet bg-white rounded-xl p-5 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-stone-900">LINE メッセージ配信</h2>
              <button onClick={() => setOpen(false)} className="text-stone-400 hover:text-stone-700"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-xs text-stone-500 mb-3">
              ⚠ 無料枠（200通/月）を消費します。月末近くは注意。
            </p>

            {state?.error && <div className="mb-3 p-2 rounded text-xs bg-red-50 border border-red-200 text-red-700">{state.error}</div>}
            {state?.ok && <div className="mb-3 p-2 rounded text-xs bg-emerald-50 border border-emerald-200 text-emerald-800">{state.message}</div>}

            <form action={formAction} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">配信タイプ</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className={`p-2 rounded-lg border-2 cursor-pointer text-center text-xs ${type === 'broadcast' ? 'brand-border brand-light-bg' : 'border-stone-200'}`}>
                    <input type="radio" name="type" value="broadcast" className="sr-only"
                      checked={type === 'broadcast'} onChange={() => setType('broadcast')} />
                    一斉（全員）
                  </label>
                  <label className={`p-2 rounded-lg border-2 cursor-pointer text-center text-xs ${type === 'segment' ? 'brand-border brand-light-bg' : 'border-stone-200'}`}>
                    <input type="radio" name="type" value="segment" className="sr-only"
                      checked={type === 'segment'} onChange={() => setType('segment')} />
                    セグメント
                  </label>
                </div>
              </div>

              {type === 'segment' && (
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">対象セグメント</label>
                  <select name="targetSegment" className="input" defaultValue={preset?.segment || 'dormant'}>
                    <option value="dormant">休眠顧客（90日以上来店なし）</option>
                    <option value="new">新規顧客（初回のみ）</option>
                    <option value="vip">VIP顧客（タグ:vip）</option>
                    <option value="all">LINE友だち全員</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">タイトル（管理用）*</label>
                <input name="title" required className="input" defaultValue={preset?.title} placeholder="秋の新作キャンペーン" />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">本文 *</label>
                <textarea name="content" required rows={6} className="input"
                  defaultValue={preset?.content}
                  placeholder="秋の新作スタイルが入荷しました🍂 ご予約はLINEの予約ボタンからどうぞ！" />
              </div>

              <div className="flex gap-2 justify-end pt-1">
                <button type="button" onClick={() => setOpen(false)} className="btn-ghost border border-stone-300 text-xs px-3 py-2">キャンセル</button>
                <button type="submit" disabled={pending} className="btn-brand text-xs px-4 py-2">
                  {pending ? '配信中...' : '配信する'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
