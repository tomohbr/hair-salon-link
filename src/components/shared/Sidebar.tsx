'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, CalendarDays, Users, ListOrdered, Ticket, MessageSquare,
  Image as ImageIcon, BarChart3, Settings, Scissors, LogOut, Lock, Menu, X,
} from 'lucide-react';

const allNav = [
  { href: '/dashboard', label: 'ダッシュボード', icon: LayoutDashboard, roles: ['admin', 'staff'], plans: ['free', 'standard', 'pro'] },
  { href: '/reservations', label: '予約', icon: CalendarDays, roles: ['admin', 'staff'], plans: ['free', 'standard', 'pro'] },
  { href: '/customers', label: '顧客', icon: Users, roles: ['admin', 'staff'], plans: ['free', 'standard', 'pro'] },
  { href: '/menus', label: 'メニュー', icon: ListOrdered, roles: ['admin', 'staff'], plans: ['free', 'standard', 'pro'] },
  { href: '/coupons', label: 'クーポン', icon: Ticket, roles: ['admin'], plans: ['standard', 'pro'] },
  { href: '/messages', label: 'メッセージ配信', icon: MessageSquare, roles: ['admin'], plans: ['standard', 'pro'] },
  { href: '/designs', label: 'スタイルギャラリー', icon: ImageIcon, roles: ['admin'], plans: ['pro'] },
  { href: '/analytics', label: '分析', icon: BarChart3, roles: ['admin'], plans: ['standard', 'pro'] },
  { href: '/settings', label: '設定', icon: Settings, roles: ['admin'], plans: ['free', 'standard', 'pro'] },
];

export default function Sidebar({
  userName, userRole, salonName, plan,
}: { userName: string; userRole: string; salonName: string; plan: string }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  // ページ遷移時にドロワーを閉じる
  useEffect(() => { setOpen(false); }, [path]);

  // ドロワー表示中は背景スクロール禁止
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  const nav = allNav.filter(n => n.roles.includes(userRole));

  return (
    <>
      {/* モバイル用ヘッダ（md 未満のみ表示） */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between bg-white border-b border-stone-200 px-4 h-14">
        <Link href="/dashboard" className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg brand-bg flex items-center justify-center flex-shrink-0">
            <Scissors className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-stone-900 text-[13px] leading-tight">HairSalonLink</div>
            <div className="text-[10px] text-stone-500 truncate">{salonName}</div>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="メニューを開く"
          className="p-2 -mr-2 text-stone-700 hover:bg-stone-100 rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* モバイルドロワーの背景 */}
      {open && (
        <button
          type="button"
          aria-label="メニューを閉じる"
          onClick={() => setOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* サイドバー本体 — モバイルではドロワー、デスクトップでは sticky */}
      <aside
        className={`
          bg-white border-r border-stone-200 flex flex-col
          fixed md:sticky top-0 left-0 z-50 md:z-auto
          w-64 md:w-60 h-screen
          transition-transform duration-200 ease-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        {/* モバイル専用クローズボタン */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="メニューを閉じる"
          className="md:hidden absolute top-3 right-3 p-1.5 text-stone-500 hover:bg-stone-100 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-5 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg brand-bg flex items-center justify-center">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-stone-900 truncate">HairSalonLink</div>
              <div className="text-[10px] text-stone-500 truncate">{salonName}</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {nav.map((item) => {
            const active = path === item.href || (item.href !== '/dashboard' && path?.startsWith(item.href));
            const Icon = item.icon;
            const locked = !item.plans.includes(plan);

            if (locked) {
              return (
                <div
                  key={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-400 cursor-not-allowed"
                  title={`${plan}プランではご利用いただけません`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="flex-1">{item.label}</span>
                  <Lock className="w-3 h-3 text-stone-300" />
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active ? 'brand-light-bg brand-text' : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-stone-200 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full brand-light-bg flex items-center justify-center brand-text text-xs font-bold flex-shrink-0">
              {userName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate text-stone-900">{userName}</div>
              <div className="text-[10px] text-stone-500">{userRole === 'admin' ? '管理者' : 'スタッフ'}</div>
            </div>
          </div>
          <div className="text-[10px] text-stone-500 flex items-center justify-between">
            <span>プラン</span>
            <span className="badge badge-brand">{plan}</span>
          </div>
          <Link href="/account" className="w-full btn-ghost text-xs justify-center hover:text-stone-900">
            アカウント設定
          </Link>
          <form action="/api/auth/logout" method="POST" className="w-full">
            <button type="submit" className="w-full btn-ghost text-xs justify-center">
              <LogOut className="w-3 h-3" />ログアウト
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
