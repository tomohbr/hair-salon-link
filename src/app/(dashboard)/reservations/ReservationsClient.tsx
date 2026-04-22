'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, ChevronLeft, ChevronRight, Copy, Upload, FileSpreadsheet, MoreHorizontal, Link as LinkIcon } from 'lucide-react';
import HpbEmailImportButton from './HpbEmailImportButton';

type DayData = {
  date: string;
  dow: string;
  hours: { open: string; close: string; closed: boolean };
  reservations: Array<{ id: string; startTime: string; endTime: string; menuName: string | null; source: string; customerName: string | null }>;
};
type MenuOpt = { id: string; name: string; price: number; durationMinutes: number; category: string };

// 30分刻みで10:00〜20:00のタイムライン
const TIMELINE: string[] = [];
for (let h = 9; h <= 20; h++) {
  TIMELINE.push(`${String(h).padStart(2, '0')}:00`);
  TIMELINE.push(`${String(h).padStart(2, '0')}:30`);
}

function toMin(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function sourceColor(src: string) {
  if (src === 'hotpepper') return 'bg-amber-200 border-amber-400 text-amber-900';
  if (src === 'line') return 'bg-emerald-200 border-emerald-400 text-emerald-900';
  if (src === 'web') return 'bg-blue-200 border-blue-400 text-blue-900';
  return 'bg-stone-200 border-stone-400 text-stone-800';
}

function sourceIcon(src: string) {
  if (src === 'hotpepper') return '🔥';
  if (src === 'line') return '💬';
  if (src === 'web') return '🌐';
  return '📞';
}

export default function ReservationsClient({
  salonSlug,
  week,
  menus,
  weekStart,
}: {
  salonSlug: string;
  week: DayData[];
  menus: MenuOpt[];
  weekStart: string;
}) {
  const router = useRouter();
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showHpbEmail, setShowHpbEmail] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ created: number; duplicates: number; conflicts: number; errors: number; unparseable: number } | null>(null);
  const [addSource, setAddSource] = useState<'hotpepper' | 'manual' | 'phone'>('hotpepper');
  const [addMenu, setAddMenu] = useState(menus[0]?.id || '');
  const [addDate, setAddDate] = useState(week[0]?.date || '');
  const [addTime, setAddTime] = useState('10:00');
  const [addName, setAddName] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function changeWeek(offset: number) {
    const d = new Date(weekStart + 'T00:00:00');
    d.setDate(d.getDate() + offset * 7);
    router.push(`/reservations?week=${d.toISOString().slice(0, 10)}`);
  }

  async function submitAdd() {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/reservations/admin-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          menuId: addMenu,
          date: addDate,
          startTime: addTime,
          customerName: addName,
          phone: addPhone,
          source: addSource,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || '登録に失敗しました');
        setSubmitting(false);
        return;
      }
      setShowAdd(false);
      setAddName('');
      setAddPhone('');
      router.refresh();
    } catch {
      setError('通信エラー');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleFileUpload(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setCsvText(text);
    };
    // SalonBoardのCSVはShift-JISで出力されるため、デコード試行
    try {
      reader.readAsText(file, 'Shift_JIS');
    } catch {
      reader.readAsText(file, 'UTF-8');
    }
  }

  async function submitImport() {
    setImporting(true);
    setImportResult(null);
    try {
      const res = await fetch('/api/reservations/import-hpb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csv: csvText }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || '取込に失敗しました');
        return;
      }
      setImportResult(data.summary);
      router.refresh();
    } catch {
      alert('通信エラー');
    } finally {
      setImporting(false);
    }
  }

  function copyBookUrl(source: string) {
    const url = `${window.location.origin}/book/${salonSlug}${source ? `?source=${source}` : ''}`;
    navigator.clipboard.writeText(url);
    alert(`URLをコピーしました:\n${url}`);
  }

  return (
    <>
      <div className="card-box">
        {/* ツールバー: モバイルは縦2段構成 */}
        <div className="space-y-3 mb-4">
          {/* Row 1: 週ナビゲーション (常に1行) */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => changeWeek(-1)}
              aria-label="前の週"
              className="w-9 h-9 rounded-md hover:bg-stone-100 flex items-center justify-center text-stone-600 flex-shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex-1 text-center text-[13px] font-semibold text-stone-900 tabular-nums truncate">
              {week[0]?.date.slice(5).replace('-', '/')} 〜 {week[6]?.date.slice(5).replace('-', '/')}
            </div>
            <button
              onClick={() => changeWeek(1)}
              aria-label="次の週"
              className="w-9 h-9 rounded-md hover:bg-stone-100 flex items-center justify-center text-stone-600 flex-shrink-0"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => router.push('/reservations')}
              className="ml-1 px-3 h-9 text-[12px] rounded-md hover:bg-stone-100 text-stone-600 font-medium flex-shrink-0"
            >
              今週
            </button>
          </div>

          {/* Row 2: アクション (スマホ: primary + ⋯ メニュー / デスクトップ: 横並び) */}
          <div className="flex items-center gap-2">
            {/* 主要CTA = 予約を追加 (スマホではフル幅) */}
            <button
              onClick={() => setShowAdd(true)}
              className="btn-brand flex-1 sm:flex-none"
            >
              <Plus className="w-4 h-4" />
              予約を追加
            </button>

            {/* HPBメール取込 (スマホでは hidden → ⋯メニューから) */}
            <div className="hidden sm:block">
              <HpbEmailImportButton />
            </div>

            {/* ⋯ メニュー — 補助アクション全部ここに */}
            <MoreActionsMenu
              onShareWeb={() => copyBookUrl('')}
              onShareLine={() => copyBookUrl('line')}
              onOpenCsvImport={() => setShowImport(true)}
              onOpenHpbEmail={() => setShowHpbEmail(true)}
            />
          </div>

          {/* モバイル専用: ⋯から開くHPBメール取込モーダル */}
          <HpbEmailImportButton
            externalOpen={showHpbEmail}
            onExternalClose={() => setShowHpbEmail(false)}
            hideTrigger
          />
        </div>

        {/* 流入元凡例: モバイルで wrap */}
        <div className="text-[10px] text-stone-500 mb-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-200 border border-amber-400 rounded-sm"></span>ホットペッパー</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-200 border border-emerald-400 rounded-sm"></span>LINE</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-blue-200 border border-blue-400 rounded-sm"></span>自社HP</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-stone-200 border border-stone-400 rounded-sm"></span>電話/手動</span>
        </div>

        {/* 週カレンダー */}
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-px bg-stone-200 rounded-lg overflow-hidden">
              {/* ヘッダー */}
              <div className="bg-stone-50"></div>
              {week.map((d) => (
                <div key={d.date} className={`bg-stone-50 p-2 text-center ${d.dow === '日' ? 'text-red-500' : d.dow === '土' ? 'text-blue-500' : ''}`}>
                  <div className="text-[10px]">{d.dow}</div>
                  <div className="text-sm font-bold">{d.date.slice(8, 10)}</div>
                </div>
              ))}
              {/* タイムライン行 */}
              {TIMELINE.map((time) => (
                <div key={time} className="contents">
                  <div className="bg-white p-1 text-[10px] text-stone-400 text-right">{time}</div>
                  {week.map((d) => {
                    const slotMin = toMin(time);
                    if (d.hours.closed) {
                      return <div key={d.date + time} className="bg-stone-100"></div>;
                    }
                    const openMin = toMin(d.hours.open);
                    const closeMin = toMin(d.hours.close);
                    if (slotMin < openMin || slotMin >= closeMin) {
                      return <div key={d.date + time} className="bg-stone-100"></div>;
                    }
                    // この枠に開始する予約だけを表示（重複防止）
                    const res = d.reservations.find((r) => r.startTime === time);
                    if (res) {
                      const dur = toMin(res.endTime) - toMin(res.startTime);
                      const rows = Math.max(1, Math.ceil(dur / 30));
                      return (
                        <div
                          key={d.date + time}
                          className={`relative bg-white p-0.5 ${sourceColor(res.source)} border-l-2`}
                          style={{ gridRowEnd: `span ${rows}` }}
                          title={`${res.startTime}-${res.endTime} ${res.customerName} / ${res.menuName}`}
                        >
                          <div className="text-[9px] font-semibold truncate flex items-center gap-0.5">
                            {sourceIcon(res.source)}<span className="truncate">{res.customerName || '—'}</span>
                          </div>
                          <div className="text-[8px] opacity-80 truncate">{res.menuName}</div>
                        </div>
                      );
                    }
                    // 別の予約の継続セルかチェック
                    const continuing = d.reservations.find((r) => {
                      const rs = toMin(r.startTime);
                      const re = toMin(r.endTime);
                      return rs < slotMin && slotMin < re;
                    });
                    if (continuing) {
                      return <div key={d.date + time} className="hidden"></div>;
                    }
                    return <div key={d.date + time} className="bg-white hover:bg-pink-50 transition-colors"></div>;
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* HPB CSV取込モーダル */}
      {showImport && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowImport(false)}>
          <div className="bg-white rounded-xl p-6 max-w-xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-amber-600" />HPB予約をCSV取込
              </h2>
              <button onClick={() => { setShowImport(false); setImportResult(null); setCsvText(''); }}><X className="w-5 h-5 text-stone-400" /></button>
            </div>

            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-stone-700 space-y-2">
              <p className="font-semibold text-amber-900">📋 取込手順</p>
              <ol className="list-decimal list-inside space-y-1 ml-1">
                <li>SalonBoardにログイン</li>
                <li>「予約管理」→「CSVダウンロード」でCSV出力</li>
                <li>下のフォームからCSVファイルをアップロード</li>
              </ol>
              <p className="text-stone-500">
                ※ 同じ日時・顧客名の予約は自動的に重複としてスキップされます<br />
                ※ ホットペッパーAPIは非公開のため、CSV取込が最も安全な業界標準方式です
              </p>
            </div>

            {!importResult ? (
              <>
                <div className="mb-3">
                  <label className="block text-xs font-medium text-stone-700 mb-1">CSVファイルを選択</label>
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                    className="input"
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    またはCSVテキストを直接貼り付け
                  </label>
                  <textarea
                    className="input font-mono text-xs"
                    rows={6}
                    value={csvText}
                    onChange={(e) => setCsvText(e.target.value)}
                    placeholder={`日付,時間,顧客名,電話番号,メニュー,金額\n2026/04/20,14:00,山田花子,090-1234-5678,カット+カラー,13200\n2026/04/20,16:30,佐藤結衣,090-2345-6789,縮毛矯正,22000`}
                  />
                  <div className="text-[10px] text-stone-500 mt-1">
                    対応カラム: 日付 / 時間 / 顧客名 / 電話番号 / メニュー / 金額（順不同・別名OK）
                  </div>
                </div>

                <button
                  onClick={submitImport}
                  disabled={!csvText || importing}
                  className="w-full btn-brand justify-center py-2.5"
                >
                  <Upload className="w-4 h-4" />
                  {importing ? '取込中...' : 'CSVを取込'}
                </button>
              </>
            ) : (
              <div className="space-y-3">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
                  <div className="text-2xl">✅</div>
                  <div className="text-sm font-bold text-emerald-900 mt-1">取込完了</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <ResultStat label="新規作成" value={importResult.created} color="emerald" />
                  <ResultStat label="重複スキップ" value={importResult.duplicates} color="gray" />
                  <ResultStat label="枠競合" value={importResult.conflicts} color="amber" />
                  <ResultStat label="パースエラー" value={importResult.unparseable + importResult.errors} color="red" />
                </div>
                <button
                  onClick={() => { setShowImport(false); setImportResult(null); setCsvText(''); }}
                  className="w-full btn-ghost border border-stone-300 justify-center py-2"
                >
                  閉じる
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 予約追加モーダル */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">予約を追加</h2>
              <button onClick={() => setShowAdd(false)}><X className="w-5 h-5 text-stone-400" /></button>
            </div>
            <p className="text-xs text-stone-500 mb-4">
              HPB・電話・ウォークインなどの予約を手動で登録します。<br />
              登録された予約はLINE/自社HPからも「予約済み」として空き枠から除外されます。
            </p>
            {error && <div className="mb-3 p-2 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">{error}</div>}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">流入元 *</label>
                <div className="grid grid-cols-3 gap-2">
                  <SourceBtn label="🔥 HPB" active={addSource === 'hotpepper'} onClick={() => setAddSource('hotpepper')} />
                  <SourceBtn label="📞 電話" active={addSource === 'phone'} onClick={() => setAddSource('phone')} />
                  <SourceBtn label="✏️ 手動" active={addSource === 'manual'} onClick={() => setAddSource('manual')} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">メニュー *</label>
                <select className="input" value={addMenu} onChange={(e) => setAddMenu(e.target.value)}>
                  {menus.map((m) => (
                    <option key={m.id} value={m.id}>{m.name} ({m.durationMinutes}分 ¥{m.price.toLocaleString()})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">日付 *</label>
                  <select className="input" value={addDate} onChange={(e) => setAddDate(e.target.value)}>
                    {week.map((d) => (
                      <option key={d.date} value={d.date}>{d.date} ({d.dow})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">開始時刻 *</label>
                  <select className="input" value={addTime} onChange={(e) => setAddTime(e.target.value)}>
                    {TIMELINE.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">お客様名 *</label>
                <input className="input" value={addName} onChange={(e) => setAddName(e.target.value)} placeholder="山田 花子" />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">電話番号</label>
                <input className="input" value={addPhone} onChange={(e) => setAddPhone(e.target.value)} placeholder="090-0000-0000" />
              </div>
              <button onClick={submitAdd} disabled={!addName || submitting} className="w-full btn-brand justify-center py-2.5 mt-2">
                {submitting ? '登録中...' : 'この内容で予約を登録'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ResultStat({ label, value, color }: { label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    gray: 'bg-stone-50 text-stone-700 border-stone-200',
    amber: 'bg-amber-50 text-amber-900 border-amber-200',
    red: 'bg-red-50 text-red-900 border-red-200',
  };
  return (
    <div className={`p-3 rounded-lg border ${colors[color] || colors.gray}`}>
      <div className="text-xs">{label}</div>
      <div className="text-xl font-bold mt-1">{value}<span className="text-xs font-normal ml-1">件</span></div>
    </div>
  );
}

function SourceBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`py-2 rounded-lg text-sm font-semibold border-2 ${
        active ? 'brand-border brand-light-bg brand-text' : 'border-stone-200 text-stone-600'
      }`}
    >
      {label}
    </button>
  );
}

/** 補助アクションをまとめた「⋯」メニュー (モバイル = ボトムシート / デスクトップ = 左出しドロップダウン) */
function MoreActionsMenu({
  onShareWeb, onShareLine, onOpenCsvImport, onOpenHpbEmail,
}: {
  onShareWeb: () => void;
  onShareLine: () => void;
  onOpenCsvImport: () => void;
  onOpenHpbEmail?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    const click = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', esc);
    document.addEventListener('mousedown', click);
    return () => {
      document.removeEventListener('keydown', esc);
      document.removeEventListener('mousedown', click);
    };
  }, [open]);

  function pick(fn: () => void) { fn(); setOpen(false); }

  const menuItems = (
    <>
      <div className="px-3 py-2 text-[10px] font-semibold tracking-wider text-stone-400 uppercase">予約 URL</div>
      <button onClick={() => pick(onShareWeb)} className="w-full text-left px-3 py-3 text-[14px] text-stone-800 hover:bg-stone-50 flex items-center gap-2.5">
        <LinkIcon className="w-4 h-4 text-stone-400 flex-shrink-0" />
        自社HP 予約URL をコピー
      </button>
      <button onClick={() => pick(onShareLine)} className="w-full text-left px-3 py-3 text-[14px] text-stone-800 hover:bg-stone-50 flex items-center gap-2.5">
        <LinkIcon className="w-4 h-4 text-stone-400 flex-shrink-0" />
        LINE 用 URL をコピー
      </button>
      <div className="px-3 py-2 text-[10px] font-semibold tracking-wider text-stone-400 uppercase border-t border-stone-100">取込</div>
      {onOpenHpbEmail && (
        <button onClick={() => pick(onOpenHpbEmail)} className="w-full text-left px-3 py-3 text-[14px] text-stone-800 hover:bg-stone-50 flex items-center gap-2.5 sm:hidden">
          <FileSpreadsheet className="w-4 h-4 text-stone-400 flex-shrink-0" />
          HPB メール取込
        </button>
      )}
      <button onClick={() => pick(onOpenCsvImport)} className="w-full text-left px-3 py-3 text-[14px] text-stone-800 hover:bg-stone-50 flex items-center gap-2.5">
        <FileSpreadsheet className="w-4 h-4 text-stone-400 flex-shrink-0" />
        HPB CSV 取込
      </button>
    </>
  );

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="その他のアクション"
        aria-expanded={open}
        className="w-10 h-10 rounded-md border border-stone-200 bg-white hover:bg-stone-50 flex items-center justify-center text-stone-600 transition-colors flex-shrink-0"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {/* Desktop (sm+): 左側に開くドロップダウン */}
      {open && (
        <div
          role="menu"
          className="hidden sm:block absolute right-0 top-full mt-1.5 w-64 bg-white border border-stone-200 rounded-lg z-20 overflow-hidden"
          style={{ boxShadow: 'var(--shadow-lg)' }}
        >
          {menuItems}
        </div>
      )}

      {/* Mobile (<sm): ボトムシート */}
      {open && (
        <div
          className="sm:hidden fixed inset-0 z-50 flex items-end"
          style={{ background: 'rgba(12,10,9,0.45)' }}
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full bg-white rounded-t-2xl overflow-hidden"
            style={{
              paddingBottom: 'env(safe-area-inset-bottom)',
              animation: 'sheetUp 240ms var(--ease-out)',
              boxShadow: 'var(--shadow-xl)',
            }}
            onClick={(e) => e.stopPropagation()}
            role="menu"
          >
            <div className="py-2">
              {menuItems}
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full py-3.5 text-center text-[14px] text-stone-600 border-t border-stone-100"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
