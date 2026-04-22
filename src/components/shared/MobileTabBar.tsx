'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, CalendarDays, Users, ListOrdered, Ticket, MessageSquare,
  Image as ImageIcon, BarChart3, Settings, LogOut, Lock, MoreHorizontal, X,
  ChevronRight, UserRound, Package, Wallet,
} from 'lucide-react';

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
  plans: string[];
};

const mainTabs: NavItem[] = [
  { href: '/dashboard', label: 'ホーム', icon: LayoutDashboard, roles: ['admin', 'staff'], plans: ['free', 'standard', 'pro'] },
  { href: '/reservations', label: '予約', icon: CalendarDays, roles: ['admin', 'staff'], plans: ['free', 'standard', 'pro'] },
  { href: '/customers', label: '顧客', icon: Users, roles: ['admin', 'staff'], plans: ['free', 'standard', 'pro'] },
  { href: '/sales', label: '売上', icon: Wallet, roles: ['admin'], plans: ['free', 'standard', 'pro'] },
];

const moreItems: NavItem[] = [
  { href: '/menus', label: 'メニュー', icon: ListOrdered, roles: ['admin', 'staff'], plans: ['free', 'standard', 'pro'] },
  { href: '/inventory', label: '在庫', icon: Package, roles: ['admin', 'staff'], plans: ['standard', 'pro'] },
  { href: '/coupons', label: 'クーポン', icon: Ticket, roles: ['admin'], plans: ['standard', 'pro'] },
  { href: '/messages', label: 'メッセージ配信', icon: MessageSquare, roles: ['admin'], plans: ['standard', 'pro'] },
  { href: '/designs', label: 'スタイルギャラリー', icon: ImageIcon, roles: ['admin'], plans: ['pro'] },
  { href: '/analytics', label: '分析', icon: BarChart3, roles: ['admin'], plans: ['standard', 'pro'] },
  { href: '/settings', label: '設定', icon: Settings, roles: ['admin'], plans: ['free', 'standard', 'pro'] },
];

export default function MobileTabBar({
  userName, userRole, salonName, plan,
}: { userName: string; userRole: string; salonName: string; plan: string }) {
  const path = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => { setMoreOpen(false); }, [path]);

  useEffect(() => {
    if (moreOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [moreOpen]);

  const filteredTabs = mainTabs.filter(n => n.roles.includes(userRole));
  const filteredMore = moreItems.filter(n => n.roles.includes(userRole));
  const morePathActive = filteredMore.some(m => path === m.href || path?.startsWith(m.href)) || path === '/account';

  return (
    <>
      {/* 下部タブバー（md 未満のみ表示） */}
      <nav
        aria-label="メインナビゲーション"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-stone-200"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="grid grid-cols-5 h-14">
          {filteredTabs.map((item) => {
            const active = path === item.href || (item.href !== '/dashboard' && path?.startsWith(item.href));
            const Icon = item.icon;
            const locked = !item.plans.includes(plan);

            if (locked) {
              return (
                <div
                  key={item.href}
                  className="flex flex-col items-center justify-center gap-0.5 text-stone-300"
                  aria-disabled="true"
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px]">{item.label}</span>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
                  active ? 'brand-text' : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
              morePathActive ? 'brand-text' : 'text-stone-500 hover:text-stone-700'
            }`}
            aria-label="もっと"
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] font-medium">もっと</span>
          </button>
        </div>
      </nav>

      {/* 「もっと」シート */}
      {moreOpen && (
        <>
          <button
            type="button"
            aria-label="閉じる"
            onClick={() => setMoreOpen(false)}
            className="md:hidden fixed inset-0 bg-black/50 z-40"
          />
          <div
            className="md:hidden fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            <div className="sticky top-0 bg-white border-b border-stone-100 px-4 py-3 flex items-center justify-between">
              <div className="min-w-0">
                <div className="font-bold text-stone-900 truncate">{salonName}</div>
                <div className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                  <UserRound className="w-3 h-3" />
                  {userName}
                  <span className="mx-0.5">·</span>
                  <span className="badge badge-brand text-[9px] px-1.5 py-0">{plan}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                aria-label="閉じる"
                className="p-2 -mr-2 text-stone-500 hover:bg-stone-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-2">
              {filteredMore.map((item) => {
                const active = path === item.href || path?.startsWith(item.href);
                const Icon = item.icon;
                const locked = !item.plans.includes(plan);

                if (locked) {
                  return (
                    <div
                      key={item.href}
                      className="flex items-center gap-3 px-3 py-3.5 rounded-lg text-stone-400"
                    >
                      <Icon className="w-5 h-5" />
                      <span className="flex-1 text-sm">{item.label}</span>
                      <span className="text-[10px] flex items-center gap-1 text-stone-400">
                        <Lock className="w-3 h-3" />
                        {plan === 'free' ? 'Standard以上' : 'Pro限定'}
                      </span>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-3.5 rounded-lg ${
                      active ? 'brand-light-bg brand-text' : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="flex-1 text-sm font-medium">{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </Link>
                );
              })}
            </div>

            <div className="px-2 pb-3 border-t border-stone-100 pt-2 space-y-1">
              <Link
                href="/account"
                className="flex items-center gap-3 px-3 py-3.5 rounded-lg text-stone-700 hover:bg-stone-50"
              >
                <UserRound className="w-5 h-5 flex-shrink-0" />
                <span className="flex-1 text-sm font-medium">アカウント設定</span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </Link>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="w-full flex items-center gap-3 px-3 py-3.5 rounded-lg text-stone-700 hover:bg-stone-50"
                >
                  <LogOut className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-sm font-medium text-left">ログアウト</span>
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}
