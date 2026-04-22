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
    <aside
      className="hidden md:flex w-[236px] bg-white border-r border-stone-200 flex-col h-screen sticky top-0"
      style={{ letterSpacing: '-0.005em' }}
    >
      {/* Brand */}
      <div className="px-4 pt-5 pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #c9a96e 0%, #9c7a4a 100%)',
              boxShadow: '0 1px 2px rgba(201,169,110,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
            }}
          >
            <Scissors className="w-4 h-4 text-white" strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <div className="text-[13.5px] font-semibold text-stone-900 truncate leading-tight">
              HairSalonLink
            </div>
            <div className="text-[10.5px] text-stone-500 truncate mt-0.5">{salonName}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        <div className="px-2 pb-1.5 text-[10px] font-semibold tracking-[0.1em] text-stone-400 uppercase">
          Workspace
        </div>
        {nav.map((item) => {
          const Icon = item.icon;
          const locked = !item.plans.includes(plan);

          if (locked) {
            return (
              <div
                key={item.href}
                className="flex items-center gap-2.5 px-2.5 py-[7px] rounded-md text-[13px] font-medium text-stone-300 cursor-not-allowed"
                title={`${plan}プランではご利用いただけません`}
                style={{ letterSpacing: '-0.005em' }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 truncate">{item.label}</span>
                <Lock className="w-3 h-3 flex-shrink-0" />
              </div>
            );
          }

          return (
            <SidebarLink
              key={item.href}
              href={item.href}
              icon={<Icon className="w-4 h-4" />}
              label={item.label}
            />
          );
        })}
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-stone-100 space-y-2.5">
        <div className="flex items-center gap-2.5 px-1">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #c9a96e 0%, #9c7a4a 100%)' }}
          >
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12.5px] font-medium text-stone-900 truncate leading-tight">
              {userName}
            </div>
            <div className="text-[10px] text-stone-500 flex items-center gap-1 mt-0.5">
              <span>{userRole === 'admin' ? '管理者' : 'スタッフ'}</span>
              <span className="text-stone-300">·</span>
              <span className="uppercase tracking-wide font-medium text-stone-600">{plan}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Link
            href="/account"
            className="flex-1 text-center px-2 py-1.5 rounded-md text-[11.5px] font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors"
          >
            アカウント
          </Link>
          <form action="/api/auth/logout" method="POST" className="flex-1">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-[11.5px] font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors"
            >
              <LogOut className="w-3 h-3" />
              ログアウト
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
