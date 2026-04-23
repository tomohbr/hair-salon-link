import { getCurrentSalon, computeSalonKpis } from '@/lib/salonData';
import { prismaForSalon } from '@/lib/prismaScoped';
import { yen, pct, sourceLabel, fmtDate } from '@/lib/utils/format';
import {
  TrendingUp, TrendingDown, Users, Calendar, AlertTriangle, MessageCircle,
  Wallet, ArrowUpRight, Sparkles,
} from 'lucide-react';
import Sparkline from '@/components/shared/Sparkline';
import Link from 'next/link';

export default async function DashboardPage() {
  const { salon } = await getCurrentSalon();
  const db = prismaForSalon(salon.id);
  const kpi = await computeSalonKpis(salon.id);
  const todayStr = new Date().toISOString().slice(0, 10);

  const upcomingRes = await db.reservation.findMany({
    where: {
      status: { in: ['confirmed', 'pending'] },
      date: { gte: todayStr },
    },
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    take: 6,
    include: { customer: true },
  });

  const weekday = ['日', '月', '火', '水', '木', '金', '土'][new Date().getDay()];

  // 日別売上のスパークライン用データ
  const revSparkData = kpi.daily.map((d) => d.revenue);

  const sourceTotal = Object.values(kpi.sourceRevenue).reduce((a: number, b: number) => a + b, 0);

  return (
    <div className="space-y-8">
      {/* ─── Page header ─── */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1
            className="text-2xl md:text-[28px] font-semibold text-stone-900"
            style={{ letterSpacing: '-0.02em' }}
          >
            ダッシュボード
          </h1>
          <p className="text-[13px] text-stone-500 mt-1">
            {salon.name} · 本日 {new Date().toLocaleDateString('ja-JP')} ({weekday})
          </p>
        </div>
        <Link
          href="/reservations"
          className="inline-flex items-center gap-1.5 text-[12.5px] text-stone-600 hover:text-stone-900 transition-colors"
        >
          予約を見る
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* ─── KPIs ─── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <KpiCard
          label="今月の売上"
          value={yen(kpi.revenueThis)}
          delta={kpi.revenueDelta}
          sub={`${kpi.completedCount} 件の施術`}
          spark={revSparkData}
          icon={<Wallet className="w-4 h-4" />}
        />
        <KpiCard
          label="顧客数"
          value={`${kpi.totalCustomers}`}
          subUnit="名"
          sub={`LINE 登録 ${kpi.lineCustomers} 名 · ${pct(kpi.lineRate)}`}
          icon={<Users className="w-4 h-4" />}
        />
        <KpiCard
          label="HPB→自社 移行率"
          value={pct(kpi.hpbMigrationRate)}
          sub={`HPB 流入 ${kpi.hpbCustomers} 名中`}
          icon={<ArrowUpRight className="w-4 h-4" />}
          highlight
        />
        <KpiCard
          label="リピート率"
          value={pct(kpi.repeatRate)}
          sub={`予約残 ${kpi.upcomingRes} 件`}
          icon={<Calendar className="w-4 h-4" />}
        />
      </section>

      {/* ─── Alerts ─── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AlertCard
          tone="warning"
          icon={<AlertTriangle className="w-4 h-4" />}
          title="離反リスクアラート"
          count={kpi.dormantRisk}
          countLabel="名"
          body="90 日以上ご来店のないお客様がいます"
          action={{ label: '休眠復帰クーポンを送る', href: '/messages' }}
        />
        <AlertCard
          tone="info"
          icon={<MessageCircle className="w-4 h-4" />}
          title="LINE 配信タイミング"
          count={kpi.lineCustomers}
          countLabel="名"
          body="LINE 友だちへ新作・再来促進メッセージを送る好機です"
          action={{ label: 'メッセージを作成', href: '/messages' }}
        />
      </section>

      {/* ─── 売上構成 + 今後の予約 ─── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue by source */}
        <div className="card-box lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-stone-900">流入元別 売上構成</h3>
              <p className="text-[11px] text-stone-500 mt-0.5">直近 30 日</p>
            </div>
            <span className="badge badge-gray text-[10px]">{yen(sourceTotal)}</span>
          </div>
          <div className="space-y-3.5">
            {Object.entries(kpi.sourceRevenue).sort((a, b) => (b[1] as number) - (a[1] as number)).map(([src, amount]) => {
              const amt = amount as number;
              const ratio = sourceTotal > 0 ? amt / sourceTotal : 0;
              const accent = src === 'line' ? '#22c55e' : src === 'hotpepper' ? '#f97316' : src === 'web' ? '#3b82f6' : '#c9a96e';
              return (
                <div key={src}>
                  <div className="flex items-center justify-between text-[13px] mb-1.5">
                    <span className="flex items-center gap-1.5 text-stone-700 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
                      {sourceLabel(src)}
                    </span>
                    <span className="tabular-nums text-stone-600">
                      {yen(amt)}
                      <span className="text-[11px] text-stone-400 ml-2">{pct(ratio)}</span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-[width] duration-500 ease-out"
                      style={{ width: `${ratio * 100}%`, background: accent }}
                    />
                  </div>
                </div>
              );
            })}
            {Object.keys(kpi.sourceRevenue).length === 0 && (
              <div className="py-10 text-center">
                <Sparkles className="w-5 h-5 mx-auto text-stone-300 mb-2" />
                <p className="text-[13px] text-stone-400">完了予約がまだありません</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming reservations */}
        <div className="card-box">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-stone-900">次の予約</h3>
            <Link href="/reservations" className="text-[11px] text-stone-500 hover:text-stone-900">
              全て →
            </Link>
          </div>
          {upcomingRes.length === 0 ? (
            <div className="py-10 text-center">
              <Calendar className="w-5 h-5 mx-auto text-stone-300 mb-2" />
              <p className="text-[13px] text-stone-400">予約はありません</p>
            </div>
          ) : (
            <div className="space-y-0.5 -mx-2">
              {upcomingRes.map((r) => {
                const srcDot = r.source === 'line' ? '#22c55e' : r.source === 'hotpepper' ? '#f97316' : r.source === 'web' ? '#3b82f6' : '#a8a29e';
                return (
                  <div key={r.id} className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-stone-50 transition-colors">
                    <div className="flex flex-col items-center w-10 flex-shrink-0">
                      <div className="text-[10px] text-stone-400">{fmtDate(new Date(r.date)).slice(5, 10)}</div>
                      <div className="text-[13px] font-semibold text-stone-900 tabular-nums">{r.startTime}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-stone-900 truncate">{r.customer?.name || '—'}</div>
                      <div className="text-[11px] text-stone-500 truncate">{r.menuName}</div>
                    </div>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: srcDot }} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/* ────────── KPI Card ────────── */
function KpiCard({
  label, value, delta, sub, subUnit, spark, icon, highlight,
}: {
  label: string; value: string; delta?: number; sub?: string;
  subUnit?: string; spark?: number[]; icon?: React.ReactNode; highlight?: boolean;
}) {
  const deltaPos = (delta ?? 0) >= 0;
  return (
    <div
      className={`card-box hover-lift relative overflow-hidden ${highlight ? 'border-2' : ''}`}
      style={highlight ? { borderColor: 'var(--accent)' } : undefined}
    >
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[11px] text-stone-500 font-medium tracking-wide">{label}</span>
        <span className="text-stone-400 flex-shrink-0">{icon}</span>
      </div>

      <div className="flex items-baseline gap-1">
        <div
          className="text-[24px] md:text-[28px] font-semibold text-stone-900 tabular-nums"
          style={{ letterSpacing: '-0.025em', lineHeight: 1.1 }}
        >
          {value}
        </div>
        {subUnit && <span className="text-[13px] text-stone-500 font-medium">{subUnit}</span>}
      </div>

      {delta !== undefined && (
        <div
          className={`inline-flex items-center gap-0.5 text-[11px] font-medium mt-1.5 px-1.5 py-0.5 rounded-md ${
            deltaPos ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
          }`}
        >
          {deltaPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span className="tabular-nums">{deltaPos ? '+' : ''}{(delta * 100).toFixed(1)}%</span>
        </div>
      )}
      {sub && <div className="text-[11px] text-stone-500 mt-1.5">{sub}</div>}

      {spark && spark.length > 0 && (
        <div className="mt-3 -mx-2">
          <Sparkline data={spark} height={28} />
        </div>
      )}
    </div>
  );
}

/* ────────── Alert Card ────────── */
function AlertCard({
  tone, icon, title, count, countLabel, body, action,
}: {
  tone: 'warning' | 'info' | 'success';
  icon: React.ReactNode; title: string;
  count?: number; countLabel?: string;
  body: string; action?: { label: string; href: string };
}) {
  const palette = {
    warning: { border: '#fde68a', bg: '#fffbeb', iconBg: '#fef3c7', iconText: '#b45309', countText: '#92400e' },
    info: { border: '#bae6fd', bg: '#f0f9ff', iconBg: '#e0f2fe', iconText: '#0369a1', countText: '#075985' },
    success: { border: '#bbf7d0', bg: '#f0fdf4', iconBg: '#dcfce7', iconText: '#15803d', countText: '#166534' },
  }[tone];

  return (
    <div
      className="card-box relative overflow-hidden"
      style={{ borderColor: palette.border, background: palette.bg }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: palette.iconBg, color: palette.iconText }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-[13.5px] font-semibold text-stone-900">{title}</h4>
            {count !== undefined && (
              <span className="tabular-nums text-[13px] font-semibold" style={{ color: palette.countText }}>
                {count.toLocaleString()}{countLabel}
              </span>
            )}
          </div>
          <p className="text-[12px] text-stone-600 mt-1 leading-relaxed">{body}</p>
          {action && (
            <Link
              href={action.href}
              className="inline-flex items-center gap-1 text-[11.5px] font-medium mt-2.5 transition-colors hover:opacity-80"
              style={{ color: palette.iconText }}
            >
              {action.label}
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
