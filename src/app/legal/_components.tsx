import type { ReactNode } from 'react';

export function LegalHeading({ title, lastUpdated }: { title: string; lastUpdated: string }) {
  return (
    <div className="mb-12 pb-6 border-b border-[#302519]">
      <h1 className="display-serif text-[28px] md:text-[36px] text-[#efe3c8] leading-tight">{title}</h1>
      <p className="text-[11px] text-[#7a6850] mt-3 tracking-wider uppercase">最終更新日: {lastUpdated}</p>
    </div>
  );
}

export function Section({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-[15px] md:text-[16px] font-semibold text-[#efe3c8] mb-4 flex items-baseline gap-3">
        <span className="display-serif text-[#c9a675] text-[14px] tabular-nums">{n}</span>
        <span>{title}</span>
      </h2>
      <div className="space-y-3 text-[13.5px] leading-[2.05] text-[#bdaa88]">
        {children}
      </div>
    </section>
  );
}

export function Definition({ term, def }: { term: string; def: ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 md:gap-6 py-3 border-b border-[#302519]/50">
      <dt className="text-[12px] tracking-wider text-[#a89778]">{term}</dt>
      <dd className="text-[13.5px] text-[#bdaa88] leading-[1.9]">{def}</dd>
    </div>
  );
}
