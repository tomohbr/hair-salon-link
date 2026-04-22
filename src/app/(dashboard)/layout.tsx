import Sidebar from '@/components/shared/Sidebar';
import MobileTabBar from '@/components/shared/MobileTabBar';
import CommandPalette from '@/components/shared/CommandPalette';
import { getCurrentSalon } from '@/lib/salonData';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { salon, session, isSuperadminView } = await getCurrentSalon();
  const userRole = isSuperadminView ? 'admin' : session.role;
  return (
    <div className="app-light md:flex min-h-screen" style={{ background: 'var(--surface-muted)' }}>
      <Sidebar
        userName={session.name}
        userRole={userRole}
        salonName={salon.name}
        plan={salon.plan}
      />
      <main className="flex-1 min-w-0 overflow-x-hidden pb-20 md:pb-0 relative">
        {/* Top bar (desktop only) with command palette trigger */}
        <div className="hidden md:flex scroll-stick items-center justify-between px-6 py-3">
          <div className="flex-1" />
          <CommandPalette />
        </div>

        {isSuperadminView && (
          <div
            className="px-4 md:px-6 py-2.5 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
            style={{ background: 'var(--warning-surface)', borderBottom: '1px solid #fde68a' }}
          >
            <div className="text-[12px]" style={{ color: 'var(--warning-text)' }}>
              <span className="font-semibold">SuperAdmin ビューモード</span>
              <span className="ml-2">店舗「{salon.name}」を閲覧中</span>
            </div>
            <a
              href="/api/superadmin/exit-view"
              className="text-[12px] underline hover:opacity-70 font-medium self-start md:self-auto"
              style={{ color: 'var(--warning-text)' }}
            >
              ビューモード解除 → SuperAdmin に戻る
            </a>
          </div>
        )}
        <div className="max-w-7xl mx-auto p-4 md:px-8 md:py-6">{children}</div>
      </main>
      <MobileTabBar
        userName={session.name}
        userRole={userRole}
        salonName={salon.name}
        plan={salon.plan}
      />
    </div>
  );
}
