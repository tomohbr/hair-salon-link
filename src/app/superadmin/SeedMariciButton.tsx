'use client';

import { useState } from 'react';
import { Wand2, Check, AlertCircle, Loader2 } from 'lucide-react';

type Result = {
  ok: boolean;
  salon?: { name: string; slug: string };
  menus?: { created: number; updated: number; total: number };
  coupons?: { created: number; updated: number; total: number };
  bookingUrl?: string;
  error?: string;
};

export default function SeedMariciButton() {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  async function run() {
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch('/api/superadmin/seed-marici', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
      });
      const data: Result = await res.json().catch(() => ({ ok: false, error: `HTTP ${res.status}` }));
      if (!res.ok) data.ok = false;
      setResult(data);
    } catch (err) {
      setResult({ ok: false, error: err instanceof Error ? err.message : '通信エラー' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card-box border-2" style={{ borderColor: '#c9a96e' }}>
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: '#f9f3e8', color: '#9c7a4a' }}
        >
          <Wand2 className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[14px] font-semibold text-stone-900">
            marici（中西雄大） の HPB データ一括反映
          </h3>
          <p className="text-[12px] text-stone-500 mt-1 leading-relaxed">
            オーナー <code className="bg-stone-100 px-1 rounded">a@gmail.com</code> の店舗に、
            HPB 掲載の全 7 メニューと 6 クーポンを一括登録／更新します。何回押しても重複しません。
          </p>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={run}
              disabled={busy}
              className="btn-brand"
            >
              {busy ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  反映中...
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5" />
                  HPB データを反映する
                </>
              )}
            </button>
            {result?.bookingUrl && (
              <a
                href={result.bookingUrl}
                target="_blank"
                rel="noopener"
                className="btn-outline"
              >
                予約ページを開く
              </a>
            )}
          </div>

          {result && (
            <div
              className={`mt-3 p-3 rounded-lg border text-[12px] ${
                result.ok
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-red-50 border-red-200 text-red-900'
              }`}
            >
              {result.ok ? (
                <>
                  <div className="flex items-center gap-1.5 font-semibold mb-1.5">
                    <Check className="w-3.5 h-3.5" />
                    反映完了: {result.salon?.name}
                  </div>
                  <div>メニュー: 新規 {result.menus?.created} 件 / 更新 {result.menus?.updated} 件 (全 {result.menus?.total} 件)</div>
                  <div>クーポン: 新規 {result.coupons?.created} 件 / 更新 {result.coupons?.updated} 件 (全 {result.coupons?.total} 件)</div>
                </>
              ) : (
                <div className="flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <span>{result.error || '失敗しました'}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
