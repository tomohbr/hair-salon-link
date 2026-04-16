'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarDays, Users, ListOrdered, Ticket, MessageSquare, Image as ImageIcon, BarChart3, Settings, Scissors, LogOut, Lock } from 'lucide-react';

// 各ナビ項目に必要なプランを定義
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

export default function Sidebar({ userName, userRole, salonName, plan }: { userName: string; userRole: string; salonName: string; plan: string }) {
  const path = usePathname();
  const nav = allNav.filter(n => n.roles.includes(userRole));

  return (
    <aside className="w-60 bg-white border-r border-stone-200 flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg brand-bg flex items-center justify-center">
            <Scissors className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-stone-900">HairSalonLink</div>
            <div className="text-[10px] text-stone-500">{salonName}</div>
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
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-stone-400 cursor-not-allowed"
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
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active ? 'brand-light-bg brand-text' : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-stone-200 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full brand-light-bg flex items-center justify-center brand-text text-xs font-bold">
            {userName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium truncate">{userName}</div>
            <div className="text-[10px] text-stone-500">{userRole === 'admin' ? '管理者' : 'スタッフ'}</div>
          </div>
        </div>
        <div className="text-[10px] text-stone-500 flex items-center justify-between">
          <span>プラン</span>
          <span className="badge badge-brand">{plan}</span>
        </div>
        <Link href="/api/auth/logout" className="w-full btn-ghost text-xs justify-center">
          <LogOut className="w-3 h-3" />ログアウト
        </Link>
      </div>
    </aside>
  );
}
