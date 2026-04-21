'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Download, X, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ImportExportBar({
  label,
  importUrl,
  exportUrl,
  templateHeaders,
  templateFilename,
}: {
  label: string; // 例: '顧客'
  importUrl: string; // 例: '/api/customers/import'
  exportUrl: string; // 例: '/api/customers/export'
  templateHeaders: string[]; // CSV ヘッダー行のサンプル
  templateFilename: string; // 例: 'customers_template.csv'
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<
    | { ok: true; total: number; created: number; updated: number; skipped: number }
    | { ok: false; error: string }
    | null
  >(null);

  const handleFile = async (f: File) => {
    const buf = await f.arrayBuffer();
    // Shift-JIS / UTF-8 両対応：BOM付きならそのまま、なければ SJIS として解釈を試みる
    let text = '';
    try {
      // まず UTF-8 で読む
      text = new TextDecoder('utf-8', { fatal: false }).decode(buf);
      // 文字化けっぽい場合（�が多い）は SJIS で再解釈
      if ((text.match(/\uFFFD/g) || []).length > 5) {
        text = new TextDecoder('shift_jis', { fatal: false }).decode(buf);
      }
    } catch {
      text = new TextDecoder('shift_jis').decode(buf);
    }
    setCsvText(text);
  };

  const submit = async () => {
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch(importUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csv: csvText }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setResult({ ok: false, error: data.error || `エラー ${res.status}` });
      } else {
        setResult({
          ok: true,
          total: data.total, created: data.created,
          updated: data.updated, skipped: data.skipped,
        });
        router.refresh();
      }
    } catch (e) {
      setResult({ ok: false, error: e instanceof Error ? e.message : String(e) });
    } finally {
      setBusy(false);
    }
  };

  const downloadTemplate = () => {
    const csv = '\uFEFF' + templateHeaders.join(',') + '\n';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = templateFilename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => { setOpen(true); setResult(null); setCsvText(''); }}
          className="btn-ghost text-xs border border-stone-300 inline-flex items-center gap-1 px-3 py-1.5"
        >
          <Upload className="w-3.5 h-3.5" />
          CSV取込
        </button>
        <a
          href={exportUrl}
          className="btn-ghost text-xs border border-stone-300 inline-flex items-center gap-1 px-3 py-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          CSV出力
        </a>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-xl p-5 w-full max-w-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-stone-900">{label} を CSV から取込</h2>
              <button onClick={() => setOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!result ? (
              <>
                <p className="text-xs text-stone-500 mb-3 leading-relaxed">
                  ホットペッパービューティー／サロンボードから出力した CSV をそのまま読めます。<br />
                  ヘッダー名（日本語）で自動マッチングするので、列の順番や追加列は気にしなくて大丈夫です。
                </p>

                <div className="mb-3">
                  <button
                    type="button"
                    onClick={downloadTemplate}
                    className="text-xs brand-text underline flex items-center gap-1"
                  >
                    <FileSpreadsheet className="w-3 h-3" />
                    テンプレート CSV をダウンロード
                  </button>
                </div>

                <label className="block">
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFile(f);
                    }}
                    className="block w-full text-xs text-stone-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-medium file:brand-bg file:text-[#0c0a09] hover:file:opacity-90 cursor-pointer"
                  />
                </label>

                {csvText && (
                  <div className="mt-3">
                    <div className="text-[10px] text-stone-500 mb-1">プレビュー（先頭200字）</div>
                    <textarea
                      readOnly
                      value={csvText.slice(0, 200) + (csvText.length > 200 ? '...' : '')}
                      className="w-full text-[10px] font-mono p-2 border border-stone-200 rounded bg-stone-50"
                      rows={4}
                    />
                  </div>
                )}

                <div className="mt-4 flex gap-2 justify-end">
                  <button
                    onClick={() => setOpen(false)}
                    className="btn-ghost border border-stone-300 text-xs px-3 py-1.5"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={submit}
                    disabled={!csvText || busy}
                    className="btn-brand text-xs px-4 py-1.5"
                  >
                    {busy ? '取込中...' : '取込を実行'}
                  </button>
                </div>
              </>
            ) : result.ok ? (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-900">
                    <div className="font-semibold">取込完了</div>
                    <div className="mt-1">合計 {result.total}件 処理しました</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-3 bg-emerald-50 rounded-lg">
                    <div className="text-[10px] text-stone-500">新規</div>
                    <div className="text-lg font-bold text-emerald-700">{result.created}</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-[10px] text-stone-500">更新</div>
                    <div className="text-lg font-bold text-blue-700">{result.updated}</div>
                  </div>
                  <div className="p-3 bg-stone-100 rounded-lg">
                    <div className="text-[10px] text-stone-500">スキップ</div>
                    <div className="text-lg font-bold text-stone-500">{result.skipped}</div>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-full btn-ghost border border-stone-300 text-xs py-2"
                >
                  閉じる
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-red-900">
                    <div className="font-semibold">取込失敗</div>
                    <div className="mt-1">{result.error}</div>
                  </div>
                </div>
                <button
                  onClick={() => setResult(null)}
                  className="w-full btn-ghost border border-stone-300 text-xs py-2"
                >
                  もう一度試す
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
