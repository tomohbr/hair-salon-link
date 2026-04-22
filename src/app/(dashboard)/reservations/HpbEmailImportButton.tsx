'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, X, Check, AlertTriangle } from 'lucide-react';

type Result = {
  created: number; updated: number; cancelled: number; skipped: number; total: number;
  messages: string[];
};

export default function HpbEmailImportButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(''); setResult(null);
    try {
      const res = await fetch('/api/reservations/import-hpb-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || `エラー (HTTP ${res.status})`);
      } else {
        setResult(data);
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ネットワークエラー');
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setOpen(false);
    setText(''); setResult(null); setError('');
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 px-2.5 py-2 rounded-md text-[12px] font-medium border bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100 transition-colors flex-shrink-0"
        aria-label="HPBメール取込"
      >
        <Mail className="w-3.5 h-3.5" />
        <span className="hidden xs:inline">HPB</span>メール
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 modal-sheet-bg" onClick={reset}>
          <div
            className="modal-sheet bg-white rounded-xl p-5 w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-stone-900">HPB 予約メールを取込</h2>
                <p className="text-xs text-stone-500 mt-1">
                  HPB から届いた予約確定メールの本文を貼り付け → 取込ボタン。
                </p>
              </div>
              <button onClick={reset} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!result ? (
              <form onSubmit={submit} className="space-y-3">
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                  💡 <strong>使い方</strong>: HPB から届いた予約メール（新規／変更／キャンセル）を、件名と本文まるごとコピーして下に貼り付けてください。<br />
                  ・日付・時刻・お客様名・メニューを自動抽出して HairSalonLink に予約を追加します<br />
                  ・HPB の予約番号（含まれていれば）で重複チェックされるので、同じメールを何度取り込んでも安全です<br />
                  ・その時間帯に LINE ／ 自社予約 で既に埋まっている場合は警告が出ます
                </div>

                <textarea
                  required
                  rows={14}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="input font-mono text-[12px] leading-relaxed"
                  placeholder={[
                    '例（HPB 予約確定メール）:',
                    '━━━━━━━━━━━━━━━━━━',
                    '【予約確定】',
                    '',
                    '■予約日時',
                    '2026年4月25日(土) 14:00〜16:00',
                    '',
                    '■お名前',
                    '山田 花子 様',
                    '',
                    '■予約メニュー',
                    'ケアブリーチ + カラー',
                    '',
                    '■電話番号',
                    '090-1234-5678',
                    '',
                    '━━━━━━━━━━━━━━━━━━',
                    'の全文をコピペしてください',
                  ].join('\n')}
                />

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={reset}
                    className="btn-ghost border border-stone-300 text-xs px-3 py-2"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    disabled={busy || !text.trim()}
                    className="btn-brand text-xs px-4 py-2 inline-flex items-center gap-1"
                  >
                    {busy ? '取込中...' : '取込'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-900 flex items-start gap-2">
                  <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">取込完了</div>
                    <div className="text-xs mt-1">
                      新規 {result.created} 件 / 更新 {result.updated} 件 /
                      キャンセル {result.cancelled} 件 / スキップ {result.skipped} 件
                    </div>
                  </div>
                </div>

                {result.messages.length > 0 && (
                  <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-[11px] text-stone-700 space-y-1 max-h-56 overflow-y-auto font-mono">
                    {result.messages.map((m, i) => (
                      <div key={i}>{m}</div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={reset}
                  className="w-full btn-brand text-xs px-4 py-2.5"
                >
                  閉じる
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
