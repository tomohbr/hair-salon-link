import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, ShieldCheck, AlertTriangle } from 'lucide-react';
import { getCurrentSalon } from '@/lib/salonData';
import { prismaForSalon } from '@/lib/prismaScoped';

export const dynamic = 'force-dynamic';

const ACTION_LABELS: Record<string, string> = {
  'customer.create': '顧客を追加',
  'customer.update': '顧客を更新',
  'customer.delete': '顧客を削除',
  'menu.create': 'メニューを追加',
  'menu.update': 'メニューを更新',
  'menu.delete': 'メニューを削除',
  'coupon.create': 'クーポンを作成',
  'coupon.update': 'クーポンを更新',
  'coupon.delete': 'クーポンを削除',
  'reservation.create': '予約を作成',
  'reservation.update': '予約を更新',
  'reservation.delete': '予約を削除',
  'reservation.payment': 'お会計を記録',
  'product.create': '商品を登録',
  'product.update': '商品を更新',
  'product.delete': '商品を削除',
  'message.broadcast': 'LINE一斉配信',
  'superadmin.view_as.enter': '【重要】運営がビューモードに入室',
  'superadmin.view_as.exit': '運営がビューモードから退出',
};

function labelFor(action: string) {
  return ACTION_LABELS[action] ?? action;
}

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).format(d);
}

function actionTone(action: string): 'neutral' | 'warn' | 'danger' | 'info' {
  if (action.startsWith('superadmin.')) return 'warn';
  if (action.endsWith('.delete')) return 'danger';
  if (action.endsWith('.create') || action.endsWith('.payment') || action.endsWith('.broadcast')) return 'info';
  return 'neutral';
}

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; filter?: string }>;
}) {
  const { salon, session } = await getCurrentSalon();
  // オーナー (admin) と SuperAdmin のみ閲覧可能
  if (session.role !== 'admin' && session.role !== 'superadmin') {
    notFound();
  }
  const db = prismaForSalon(salon.id);
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? '1', 10) || 1);
  const pageSize = 50;
  const filter = sp.filter ?? '';

  const where = filter === 'superadmin'
    ? { action: { startsWith: 'superadmin.' } }
    : filter === 'delete'
    ? { action: { endsWith: '.delete' } }
    : {};

  const [logs, total, saCount] = await Promise.all([
    db.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: pageSize,
      skip: (page - 1) * pageSize,
    }),
    db.auditLog.count({ where }),
    db.auditLog.count({ where: { action: { startsWith: 'superadmin.' } } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="mb-4">
        <Link href="/settings" className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800">
          <ChevronLeft className="w-4 h-4" /> 設定に戻る
        </Link>
      </div>

      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-stone-900 text-white flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-stone-900">監査ログ</h1>
          <p className="text-xs text-stone-500 mt-1">
            お店のデータに加えられた変更、およびサービス運営側のアクセス履歴。最新 {pageSize} 件 × {totalPages} ページ。
          </p>
        </div>
      </div>

      {/* SuperAdmin access alert */}
      {saCount > 0 && (
        <div className="mb-5 p-3 rounded-lg border border-amber-300 bg-amber-50 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <strong>サービス運営側の閲覧履歴が {saCount} 件記録されています。</strong>
            障害対応・サポート要請以外でのアクセスに心当たりがない場合は、
            <a href="mailto:shibahara.724@gmail.com" className="underline font-medium">運営へご連絡ください</a>。
          </div>
        </div>
      )}

      {/* Filter chips */}
      <div className="mb-4 flex flex-wrap gap-2 text-[11px]">
        <FilterChip label="すべて" href="/settings/audit" active={!filter} />
        <FilterChip label="運営アクセスのみ" href="/settings/audit?filter=superadmin" active={filter === 'superadmin'} />
        <FilterChip label="削除操作のみ" href="/settings/audit?filter=delete" active={filter === 'delete'} />
      </div>

      {/* Log list */}
      <div className="rounded-lg border border-stone-200 overflow-hidden bg-white">
        {logs.length === 0 ? (
          <div className="p-10 text-center text-sm text-stone-500">
            ログはまだありません。
          </div>
        ) : (
          <ul className="divide-y divide-stone-100">
            {logs.map((l) => {
              const tone = actionTone(l.action);
              return (
                <li key={l.id} className="p-4 flex items-start gap-3 hover:bg-stone-50/60 transition-colors">
                  <ToneDot tone={tone} />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span className="text-sm font-medium text-stone-900">
                        {labelFor(l.action)}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {l.action}
                      </span>
                    </div>
                    <div className="mt-1 text-[11px] text-stone-500 flex flex-wrap gap-x-3 gap-y-0.5">
                      <span>{fmtDate(l.createdAt)}</span>
                      {l.actorName && <span>操作者: <strong className="text-stone-700">{l.actorName}</strong></span>}
                      {l.targetType && <span>対象: {l.targetType}{l.targetId ? `(${l.targetId.slice(0, 8)}…)` : ''}</span>}
                      {l.ip && <span className="font-mono">{l.ip}</span>}
                    </div>
                    {l.diff != null && (
                      <details className="mt-2">
                        <summary className="text-[10px] text-stone-500 cursor-pointer hover:text-stone-800">詳細</summary>
                        <pre className="mt-1 text-[10px] p-2 bg-stone-50 border border-stone-200 rounded text-stone-700 overflow-x-auto font-mono">
                          {JSON.stringify(l.diff, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-xs text-stone-500">
          <div>{total.toLocaleString()} 件中 {((page - 1) * pageSize + 1).toLocaleString()}–{Math.min(page * pageSize, total).toLocaleString()} 件目</div>
          <div className="flex items-center gap-1">
            {page > 1 && (
              <Link
                href={`/settings/audit?page=${page - 1}${filter ? `&filter=${filter}` : ''}`}
                className="px-3 py-1.5 rounded border border-stone-200 hover:bg-stone-50"
              >
                前へ
              </Link>
            )}
            <span className="px-2 font-mono">{page} / {totalPages}</span>
            {page < totalPages && (
              <Link
                href={`/settings/audit?page=${page + 1}${filter ? `&filter=${filter}` : ''}`}
                className="px-3 py-1.5 rounded border border-stone-200 hover:bg-stone-50"
              >
                次へ
              </Link>
            )}
          </div>
        </div>
      )}

      <p className="mt-6 text-[10px] text-stone-400 leading-relaxed">
        ※ 監査ログは店舗データとは分離して保存されており、編集・削除できません (改ざん防止のため)。<br />
        ※ 表示には Asia/Tokyo (JST) タイムゾーンを使用しています。
      </p>
    </div>
  );
}

function ToneDot({ tone }: { tone: 'neutral' | 'warn' | 'danger' | 'info' }) {
  const cls =
    tone === 'warn'   ? 'bg-amber-500' :
    tone === 'danger' ? 'bg-rose-500' :
    tone === 'info'   ? 'bg-emerald-500' :
                        'bg-stone-300';
  return <span className={`mt-1.5 w-2 h-2 rounded-full ${cls} shrink-0`} />;
}

function FilterChip({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`px-2.5 py-1 rounded-full border transition-colors ${
        active
          ? 'bg-stone-900 text-white border-stone-900'
          : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
      }`}
    >
      {label}
    </Link>
  );
}
