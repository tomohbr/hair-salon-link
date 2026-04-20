import Link from 'next/link';
import Sidebar from '@/components/shared/Sidebar';
import { getCurrentSalon } from '@/lib/salonData';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { salon, session, isSuperadminView } = await getCurrentSalon();
  return (
    <div className="flex min-h-screen bg-stone-50">
      <Sidebar
        userName={session.name}
        userRole={isSuperadminView ? 'admin' : session.role}
        salonName={salon.name}
        plan={salon.plan}
      />
      <main className="flex-1 overflow-x-hidden">
        {isSuperadminView && (
          <div className="bg-amber-100 border-b border-amber-300 px-6 py-2.5 flex items-center justify-between">
            <div className="text-xs text-amber-900">
              <span className="font-bold">SuperAdmin ビューモード</span>
              <span className="ml-2">店舗「{salon.name}」を閲覧中。実際のオーナーとして全機能をテストできます。</span>
            </div>
            <Link
              href="/api/superadmin/exit-view"
              className="text-xs text-amber-900 underline hover:opacity-70 font-medium"
            >
              ビューモード解除 → SuperAdmin に戻る
            </Link>
          </div>
        )}
        <div className="max-w-7xl mx-auto p-8">{children}</div>
      </main>
    </div>
  );
}
