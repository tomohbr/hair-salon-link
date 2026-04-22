import Link from 'next/link';
import {
  LayoutDashboard, CalendarDays, Users, ListOrdered, Ticket, MessageSquare,
  Image as ImageIcon, BarChart3, Settings, Scissors, LogOut, Lock,
  Package, Wallet,
} from 'lucide-react';
import SidebarLink from './SidebarLink';

const allNav = [
  { href: '/dashboard', label: 'ダッシュボード', icon: LayoutDashboard, roles: ['admin', 'staff'], plans: ['free', 'standard', 'pro'] },
  { href: '/reservations', label: '予約', icon: CalendarDays, roles: ['admin', 'staff'], plans: ['free', 'standard', 'pro'] },
  { href: '/customers', label: '顧客', icon: Users, roles: ['admin', 'staff'], plans: ['free', 'standard', 'pro'] },
  { href: '/menus', label: 'メニュー', icon: ListOrdered, roles: ['admin', 'staff'], plans: ['free', 'standard', 'pro'] },
  { href: '/sales', label: '売上', icon: Wallet, roles: ['admin'], plans: ['free', 'standard', 'pro'] },
  { href: '/inventory', label: '在庫', icon: Package, roles: ['admin', 'staff'], plans: ['standard', 'pro'] },
  { href: '/coupons', label: 'クーポン', icon: Ticket, roles: ['admin'], plans: ['standard', 'pro'] },
  { href: '/messages', label: 'メッセージ配信', icon: MessageSquare, roles: ['admin'], plans: ['standard', 'pro'] },
  { href: '/designs', label: 'スタイルギャラリー', icon: ImageIcon, roles: ['admin'], plans: ['pro'] },
  { href: '/analytics', label: '分析', icon: BarChart3, roles: ['admin'], plans: ['standard', 'pro'] },
  { href: '/settings', label: '設定', icon: Settings, roles: ['admin'], plans: ['free', 'standard', 'pro'] },
];

export default function Sidebar({
  userName, userRole, salonName, plan,
}: { userName: string; userRole: string; salonName: string; plan: string }) {
  const nav = allNav.filter(n => n.roles.includes(userRole));

  return (
    // デスクトップ(md+)のみ表示。モバイルは MobileTabBar を使う。
    <aside className="hidden md:flex w-60 bg-white border-r border-stone-200 flex-col h-screen sticky top-0">
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
            <SidebarLink key={item.href} href={item.href} icon={<Icon className="w-4 h-4" />} label={item.label} />
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
  );
}
