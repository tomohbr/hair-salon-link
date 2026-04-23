// 売上サマリー — 期間別・支払方法別・客単価
import { prismaForSalon } from '@/lib/prismaScoped';
import { getCurrentSalon } from '@/lib/salonData';
import { yen } from '@/lib/utils/format';
import { TrendingUp, TrendingDown, Wallet, CreditCard, Smartphone, Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

type Row = {
  id: string; date: string; startTime: string;
  menuName: string | null; menuPrice: number | null;
  paidAmount: number | null; paymentMethod: string | null;
  retailAmount: number; tip: number; source: string;
  customer: { name: string } | null;
};

const PAYMENT_LABELS: Record<string, string> = {
  cash: '現金', credit: 'クレジットカード', qr: 'QR決済',
  coin: 'COIN+', point: 'ポイント', other: 'その他',
};

const PAYMENT_ICONS: Record<string, React.ReactNode> = {
  cash: <Wallet className="w-3.5 h-3.5" />,
  credit: <CreditCard className="w-3.5 h-3.5" />,
  qr: <Smartphone className="w-3.5 h-3.5" />,
  coin: <Smartphone className="w-3.5 h-3.5" />,
  point: <Users className="w-3.5 h-3.5" />,
  other: <Wallet className="w-3.5 h-3.5" />,
};

/**
 * JST (Asia/Tokyo) ベースで「今日・今月初日・前月初日・前月末日」を YYYY-MM-DD で返す。
 * Railway サーバが UTC で動いていても、日本のサロンの「営業日」は JST 基準で判定する。
 */
function getJstBounds() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now);
  const year = Number(parts.find((p) => p.type === 'year')?.value);
  const month = Number(parts.find((p) => p.type === 'month')?.value);
  const day = Number(parts.find((p) => p.type === 'day')?.value);

  const pad = (n: number) => String(n).padStart(2, '0');
  const todayStr = `${year}-${pad(month)}-${pad(day)}`;
  const monthStart = `${year}-${pad(month)}-01`;
  // 前月
  const pm = month === 1 ? { y: year - 1, m: 12 } : { y: year, m: month - 1 };
  const prevMonthStart = `${pm.y}-${pad(pm.m)}-01`;
  // 前月末日 = 今月初日の 1 日前
  const prevEndDate = new Date(Date.UTC(year, month - 1, 0)).getUTCDate();
  const prevMonthEnd = `${pm.y}-${pad(pm.m)}-${pad(prevEndDate)}`;
  return { today: todayStr, monthStart, prevMonthStart, prevMonthEnd, year, month };
}

export default async function SalesPage() {
  const { salon } = await getCurrentSalon();
  const db = prismaForSalon(salon.id);

  const { today: todayStr, monthStart, prevMonthStart, prevMonthEnd, year, month } = getJstBounds();

  const thisMonthReservations = await db.reservation.findMany({
    where: {
      date: { gte: monthStart },
      OR: [
        { status: 'completed' },
        { paidAt: { not: null } },
      ],
    },
    orderBy: { date: 'desc' },
    select: {
      id: true, date: true, startTime: true,
      menuName: true, menuPrice: true,
      paidAmount: true, paymentMethod: true,
      retailAmount: true, tip: true, source: true,
      status: true, paidAt: true,
      customer: { select: { name: true } },
    },
  });

  const prevMonthReservations = await db.reservation.findMany({
    where: {
      date: { gte: prevMonthStart, lte: prevMonthEnd },
      OR: [
        { status: 'completed' },
        { paidAt: { not: null } },
      ],
    },
    select: {
      paidAmount: true, menuPrice: true, retailAmount: true, tip: true,
    },
  });

  const sumAmount = (rs: { paidAmount: number | null; menuPrice: number | null; retailAmount?: number | null; tip?: number | null }[]) =>
    rs.reduce((a, r) => a + (r.paidAmount ?? r.menuPrice ?? 0) + (r.retailAmount ?? 0) + (r.tip ?? 0), 0);

  const thisMonthTotal = sumAmount(thisMonthReservations);
  const prevMonthTotal = sumAmount(prevMonthReservations);
  const monthDelta = prevMonthTotal > 0 ? (thisMonthTotal - prevMonthTotal) / prevMonthTotal : 0;

  const thisCount = thisMonthReservations.length;
  const prevCount = prevMonthReservations.length;
  const avg = thisCount > 0 ? Math.round(thisMonthTotal / thisCount) : 0;
  const prevAvg = prevCount > 0 ? Math.round(prevMonthTotal / prevCount) : 0;
  const avgDelta = prevAvg > 0 ? (avg - prevAvg) / prevAvg : 0;

  // 支払方法別
  const byPayment: Record<string, { count: number; amount: number }> = {};
  thisMonthReservations.forEach((r) => {
    const key = r.paymentMethod || 'unrecorded';
    byPayment[key] = byPayment[key] || { count: 0, amount: 0 };
    byPayment[key].count++;
    byPayment[key].amount += (r.paidAmount ?? r.menuPrice ?? 0) + (r.retailAmount ?? 0) + (r.tip ?? 0);
  });

  // 日別売上マップ (date → amount)
  const dailyMap: Record<string, number> = {};
  thisMonthReservations.forEach((r) => {
    dailyMap[r.date] = (dailyMap[r.date] || 0) + (r.paidAmount ?? r.menuPrice ?? 0) + (r.retailAmount ?? 0) + (r.tip ?? 0);
  });

  // 月初〜今日までの全日を埋めて (空日も含めて) グラフのギャップ/ズレを防止
  const allDaysThisMonth: { date: string; amount: number }[] = [];
  const todayDate = Number(todayStr.slice(8, 10));
  for (let d = 1; d <= todayDate; d++) {
    const pad = (n: number) => String(n).padStart(2, '0');
    const dateKey = `${year}-${pad(month)}-${pad(d)}`;
    allDaysThisMonth.push({ date: dateKey, amount: dailyMap[dateKey] || 0 });
  }
  const maxDaily = Math.max(1, ...allDaysThisMonth.map((d) => d.amount));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-stone-900">売上管理</h1>
        <p className="text-xs md:text-sm text-stone-500 mt-1">
          {year}年{month}月 · 決済済み予約を集計 (JST)
        </p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <KpiCard
          label="今月の売上"
          value={yen(thisMonthTotal)}
          delta={monthDelta}
          sub={`${thisCount} 件の施術`}
        />
        <KpiCard
          label="客単価"
          value={yen(avg)}
          delta={avgDelta}
          sub={prevAvg > 0 ? `前月 ${yen(prevAvg)}` : '—'}
          highlight
        />
        <KpiCard
          label="店販売上"
          value={yen(thisMonthReservations.reduce((a, r) => a + r.retailAmount, 0))}
          sub="メニュー外の物販"
        />
        <KpiCard
          label="前月の売上"
          value={yen(prevMonthTotal)}
          sub={`${prevCount} 件`}
        />
      </div>

      {/* 支払方法別 */}
      <div className="card-box">
        <h2 className="font-semibold text-stone-900 mb-4">支払方法別</h2>
        {Object.keys(byPayment).length === 0 ? (
          <p className="text-sm text-stone-500 text-center py-8">今月の売上データがありません。</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(byPayment)
              .sort(([, a], [, b]) => b.amount - a.amount)
              .map(([key, v]) => {
                const label = key === 'unrecorded' ? '未記録' : (PAYMENT_LABELS[key] || key);
                const ratio = thisMonthTotal > 0 ? v.amount / thisMonthTotal : 0;
                const icon = PAYMENT_ICONS[key] || <Wallet className="w-3.5 h-3.5" />;
                return (
                  <div key={key} className="p-3.5 rounded-lg border border-stone-200 bg-stone-50">
                    <div className="flex items-center gap-2 text-stone-600 text-xs mb-2">
                      {icon}
                      <span>{label}</span>
                      <span className="ml-auto text-[10px] text-stone-400">{v.count}件</span>
                    </div>
                    <div className="text-lg font-bold text-stone-900">{yen(v.amount)}</div>
                    <div className="text-[10px] text-stone-500 mt-1">構成比 {(ratio * 100).toFixed(1)}%</div>
                    <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden mt-1.5">
                      <div className="h-full brand-bg rounded-full" style={{ width: `${ratio * 100}%` }} />
                    </div>
                  </div>
                );
              })}
          </div>
        )}
        {byPayment.unrecorded && (
          <p className="text-[11px] text-amber-700 mt-3 leading-relaxed">
            💡 {byPayment.unrecorded.count} 件の予約で支払方法が未記録です。予約一覧から「支払い記録」ボタンで入力すると、支払方法別の集計に反映されます。
          </p>
        )}
      </div>

      {/* 日別売上チャート */}
      <div className="card-box">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-stone-900">日別売上（今月）</h2>
          <span className="text-[11px] text-stone-500">
            1日〜{todayDate}日 · 合計 {yen(allDaysThisMonth.reduce((a, d) => a + d.amount, 0))}
          </span>
        </div>
        {allDaysThisMonth.every((d) => d.amount === 0) ? (
          <p className="text-sm text-stone-500 text-center py-8">今月の売上データはまだありません。</p>
        ) : (
          <>
            <div className="flex items-end gap-0.5 sm:gap-1 h-32 md:h-40">
              {allDaysThisMonth.map((d) => {
                const isToday = d.date === todayStr;
                const h = d.amount > 0 ? (d.amount / maxDaily) * 100 : 0;
                return (
                  <div
                    key={d.date}
                    className="flex-1 flex flex-col justify-end items-center min-w-0"
                    title={`${d.date}: ${yen(d.amount)}`}
                  >
                    <div
                      className={`w-full rounded-t transition-all ${isToday ? '' : 'hover:opacity-80'}`}
                      style={{
                        height: d.amount > 0 ? `${h}%` : '3px',
                        minHeight: d.amount > 0 ? '4px' : '3px',
                        background: d.amount > 0
                          ? (isToday ? 'var(--accent)' : 'var(--accent-dark, var(--accent))')
                          : 'var(--gray-150, #efedeb)',
                      }}
                    />
                  </div>
                );
              })}
            </div>
            {/* 日付ラベル */}
            <div className="flex gap-0.5 sm:gap-1 mt-1.5">
              {allDaysThisMonth.map((d, i) => {
                const day = Number(d.date.slice(8, 10));
                // モバイルは 5 日ごと、デスクトップは毎日表示
                const showMobile = day === 1 || day === todayDate || day % 5 === 0;
                const showDesktop = true;
                return (
                  <div key={d.date} className="flex-1 text-center min-w-0">
                    <span
                      className={`text-[9px] tabular-nums ${
                        d.date === todayStr ? 'font-semibold' : 'text-stone-400'
                      } ${showMobile ? 'inline' : 'hidden'} sm:${showDesktop ? 'inline' : 'hidden'}`}
                      style={{ color: d.date === todayStr ? 'var(--accent)' : undefined }}
                    >
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* 凡例 */}
            <div className="flex items-center gap-4 mt-3 text-[10px] text-stone-500">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: 'var(--accent)' }} />
                本日
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: 'var(--accent-dark, var(--accent))' }} />
                売上あり
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: 'var(--gray-150, #efedeb)' }} />
                売上 0 円
              </span>
            </div>
          </>
        )}
      </div>

      {/* 完了予約一覧 */}
      <div className="card-box">
        <h2 className="font-semibold text-stone-900 mb-4">今月の完了予約</h2>
        {thisMonthReservations.length === 0 ? (
          <p className="text-sm text-stone-500 text-center py-8">完了予約はまだありません。</p>
        ) : (
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="text-left text-xs text-stone-500 border-b border-stone-200">
                  <th className="py-2 px-2">日付</th>
                  <th className="py-2 px-2">お客様</th>
                  <th className="py-2 px-2">メニュー</th>
                  <th className="py-2 px-2">流入元</th>
                  <th className="py-2 px-2">支払方法</th>
                  <th className="py-2 px-2 text-right">金額</th>
                </tr>
              </thead>
              <tbody>
                {thisMonthReservations.slice(0, 50).map((r: Row) => {
                  const total = (r.paidAmount ?? r.menuPrice ?? 0) + r.retailAmount + r.tip;
                  return (
                    <tr key={r.id} className="border-b border-stone-100 hover:bg-stone-50">
                      <td className="py-2.5 px-2 text-stone-600 text-xs whitespace-nowrap">{r.date.slice(5)} {r.startTime}</td>
                      <td className="py-2.5 px-2 font-medium">{r.customer?.name || '—'}</td>
                      <td className="py-2.5 px-2 text-stone-600 text-xs">{r.menuName || '—'}</td>
                      <td className="py-2.5 px-2"><span className="badge badge-gray text-[10px]">{r.source}</span></td>
                      <td className="py-2.5 px-2 text-xs">
                        {r.paymentMethod ? (
                          <span className="inline-flex items-center gap-1 text-stone-600">
                            {PAYMENT_ICONS[r.paymentMethod]} {PAYMENT_LABELS[r.paymentMethod] || r.paymentMethod}
                          </span>
                        ) : (
                          <span className="text-amber-600 text-[10px]">未記録</span>
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-right font-medium">{yen(total)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {thisMonthReservations.length > 50 && (
              <p className="text-[11px] text-stone-500 mt-3 text-center">最新 50 件を表示（全 {thisMonthReservations.length} 件）</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function KpiCard({ label, value, delta, sub, highlight }: {
  label: string; value: string; delta?: number; sub?: string; highlight?: boolean;
}) {
  return (
    <div className={`card-box ${highlight ? 'brand-border border-2' : ''}`}>
      <div className="text-xs text-stone-500 font-medium">{label}</div>
      <div className="text-xl md:text-2xl font-bold text-stone-900 mt-1">{value}</div>
      {delta !== undefined && (
        <div className={`text-xs mt-1 inline-flex items-center gap-1 ${delta >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          {delta >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          前月比 {delta >= 0 ? '+' : ''}{(delta * 100).toFixed(1)}%
        </div>
      )}
      {sub && <div className="text-[10px] text-stone-500 mt-1">{sub}</div>}
    </div>
  );
}
