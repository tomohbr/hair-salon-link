import Link from 'next/link';
import { Scissors } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-light min-h-screen flex flex-col bg-stone-50">
      <header className="p-6">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-sm brand-bg flex items-center justify-center">
            <Scissors className="w-5 h-5 text-[#0c0a09]" strokeWidth={2} />
          </div>
          <div>
            <div className="font-bold text-stone-900">HairSalonLink</div>
            <div className="text-[10px] text-stone-500">for Hair Salons</div>
          </div>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>
    </div>
  );
}
