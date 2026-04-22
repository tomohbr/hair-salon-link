'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SidebarLink({
  href, icon, label,
}: { href: string; icon: React.ReactNode; label: string }) {
  const path = usePathname();
  const active = path === href || (href !== '/dashboard' && path?.startsWith(href));
  return (
    <Link
      href={href}
      className={`group relative flex items-center gap-2.5 px-2.5 py-[7px] rounded-md text-[13px] font-medium transition-colors ${
        active
          ? 'bg-stone-100 text-stone-900'
          : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
      }`}
      style={{ letterSpacing: '-0.005em' }}
    >
      {/* Active indicator bar */}
      {active && (
        <span
          aria-hidden="true"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[2.5px] h-5 rounded-r"
          style={{ background: 'var(--accent)' }}
        />
      )}
      <span className={`transition-colors ${active ? 'text-stone-900' : 'text-stone-500 group-hover:text-stone-700'}`}>
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </Link>
  );
}
