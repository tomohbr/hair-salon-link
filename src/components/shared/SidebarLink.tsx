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
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active ? 'brand-light-bg brand-text' : 'text-stone-700 hover:bg-stone-50'
      }`}
    >
      {icon}
      <span className="truncate">{label}</span>
    </Link>
  );
}
