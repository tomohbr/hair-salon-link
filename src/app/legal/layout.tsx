import Link from 'next/link';
import { Scissors, ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#14100c] text-[#efe3c8]">
      <header className="border-b border-[#302519] sticky top-0 bg-[#14100c]/90 backdrop-blur z-50">
        <div className="max-w-3xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm brand-bg flex items-center justify-center">
              <Scissors className="w-4 h-4 text-[#14100c]" strokeWidth={2} />
            </div>
            <div className="leading-tight">
              <div className="font-semibold tracking-tight text-[15px]">HairSalonLink</div>
            </div>
          </Link>
          <Link
            href="/"
            className="text-[12px] text-[#a89778] hover:text-[#efe3c8] transition inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            トップに戻る
          </Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-5 md:px-8 py-16 md:py-24">
        {children}
      </main>
      <footer className="border-t border-[#302519] py-10 mt-16">
        <div className="max-w-3xl mx-auto px-5 md:px-8 flex flex-wrap items-center justify-between gap-4 text-[11px] text-[#7a6850]">
          <div>© 2026 HairSalonLink. All rights reserved.</div>
          <div className="flex gap-4">
            <Link href="/legal/terms" className="hover:text-[#c9a675]">利用規約</Link>
            <Link href="/legal/privacy" className="hover:text-[#c9a675]">プライバシーポリシー</Link>
            <Link href="/legal/tokushoho" className="hover:text-[#c9a675]">特商法表記</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
