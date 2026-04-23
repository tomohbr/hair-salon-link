'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function StickyMobileCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-40 md:hidden transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="border-t border-[#2a2320] bg-[#0c0a09]/95 backdrop-blur px-4 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-[10px] tracking-[0.18em] uppercase text-[#8a7f6e]">初期費用 ¥0 / 30 秒で開設</div>
          <div className="text-[13px] text-[#ebe1cf] truncate">HairSalonLink を試してみる</div>
        </div>
        <Link
          href="/register"
          className="shrink-0 brand-bg text-[#0c0a09] text-[12px] font-semibold tracking-[0.1em] px-4 py-2.5"
        >
          無料で始める
        </Link>
      </div>
    </div>
  );
}
