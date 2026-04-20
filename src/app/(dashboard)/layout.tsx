import Sidebar from '@/components/shared/Sidebar';
import MobileTabBar from '@/components/shared/MobileTabBar';
import { getCurrentSalon } from '@/lib/salonData';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { salon, session, isSuperadminView } = await getCurrentSalon();
  const userRole = isSuperadminView ? 'admin' : session.role;
  return (
    <div className="app-light md:flex min-h-screen bg-stone-50">
      <Sidebar
        userName={session.name}
        userRole={userRole}
        salonName={salon.name}
        plan={salon.plan}
      />
      <main className="flex-1 min-w-0 overflow-x-hidden pb-20 md:pb-0">
        {isSuperadminView && (
          <div className="bg-amber-100 border-b border-amber-300 px-4 md:px-6 py-2.5 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="text-xs text-amber-900">
              <span className="font-bold">SuperAdmin ビューモード</span>
              <span className="ml-2">店舗「{salon.name}」を閲覧中</span>
            </div>
            <a
              href="/api/superadmin/exit-view"
              className="text-xs text-amber-900 underline hover:opacity-70 font-medium self-start md:self-auto"
            >
              ビューモード解除 → SuperAdmin に戻る
            </a>
          </div>
        )}
        <div className="max-w-7xl mx-auto p-4 md:p-8">{children}</div>
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
