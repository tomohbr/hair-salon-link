'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, LayoutDashboard, CalendarDays, Users, ListOrdered, Wallet,
  Package, Ticket, MessageSquare, BarChart3, Settings, UserRound,
  Sparkles, Plus, ArrowRight, LogOut, Command,
} from 'lucide-react';

type CommandItem = {
  id: string;
  label: string;
  desc?: string;
  icon: React.ComponentType<{ className?: string }>;
  section: 'Navigate' | 'Create' | 'Account';
  href?: string;
  action?: () => void;
  keywords?: string;
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const items: CommandItem[] = useMemo(() => {
    const nav: CommandItem[] = [
      { id: 'dashboard', label: 'ダッシュボード', icon: LayoutDashboard, section: 'Navigate', href: '/dashboard', keywords: 'home top' },
      { id: 'reservations', label: '予約', icon: CalendarDays, section: 'Navigate', href: '/reservations', keywords: 'booking schedule' },
      { id: 'customers', label: '顧客', icon: Users, section: 'Navigate', href: '/customers', keywords: 'customer client' },
      { id: 'sales', label: '売上', icon: Wallet, section: 'Navigate', href: '/sales', keywords: 'revenue money payment' },
      { id: 'inventory', label: '在庫', icon: Package, section: 'Navigate', href: '/inventory', keywords: 'stock product' },
      { id: 'menus', label: 'メニュー', icon: ListOrdered, section: 'Navigate', href: '/menus', keywords: 'menu service' },
      { id: 'coupons', label: 'クーポン', icon: Ticket, section: 'Navigate', href: '/coupons', keywords: 'coupon discount' },
      { id: 'messages', label: 'メッセージ配信', icon: MessageSquare, section: 'Navigate', href: '/messages', keywords: 'broadcast line' },
      { id: 'analytics', label: '分析', icon: BarChart3, section: 'Navigate', href: '/analytics', keywords: 'analytics stats' },
      { id: 'settings', label: '設定', icon: Settings, section: 'Navigate', href: '/settings', keywords: 'settings config' },
    ];

    const createActions: CommandItem[] = [
      { id: 'new-reservation', label: '予約を追加', icon: Plus, section: 'Create', href: '/reservations?new=1', desc: '新しい予約を作成', keywords: 'add reservation booking new' },
      { id: 'new-customer', label: '顧客を追加', icon: Plus, section: 'Create', href: '/customers?new=1', desc: '新規顧客を登録', keywords: 'add customer new' },
      { id: 'new-menu', label: 'メニューを追加', icon: Plus, section: 'Create', href: '/menus?new=1', desc: '新しい施術メニュー', keywords: 'add menu new' },
      { id: 'new-product', label: '商品を追加', icon: Plus, section: 'Create', href: '/inventory?new=1', desc: '在庫に商品を登録', keywords: 'add product new inventory' },
      { id: 'new-coupon', label: 'クーポンを作成', icon: Plus, section: 'Create', href: '/coupons?new=1', desc: '新規クーポン発行', keywords: 'add coupon new' },
      { id: 'new-broadcast', label: 'LINE 配信', icon: Plus, section: 'Create', href: '/messages?new=1', desc: 'メッセージ配信', keywords: 'broadcast send line' },
    ];

    const account: CommandItem[] = [
      { id: 'account', label: 'アカウント設定', icon: UserRound, section: 'Account', href: '/account', keywords: 'account profile' },
      { id: 'logout', label: 'ログアウト', icon: LogOut, section: 'Account',
        action: () => {
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = '/api/auth/logout';
          document.body.appendChild(form);
          form.submit();
        },
        keywords: 'logout signout',
      },
    ];

    return [...nav, ...createActions, ...account];
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.trim().toLowerCase();
    return items.filter(
      (it) =>
        it.label.toLowerCase().includes(q) ||
        (it.desc || '').toLowerCase().includes(q) ||
        (it.keywords || '').toLowerCase().includes(q),
    );
  }, [items, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    filtered.forEach((it) => {
      if (!map.has(it.section)) map.set(it.section, []);
      map.get(it.section)!.push(it);
    });
    return Array.from(map.entries());
  }, [filtered]);

  // Global hotkey
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Focus input when open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 20);
      setQuery(''); setSelected(0);
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const target = filtered[selected];
        if (target) execute(target);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, filtered, selected]);

  useEffect(() => { setSelected(0); }, [query]);

  function execute(item: CommandItem) {
    setOpen(false);
    if (item.action) item.action();
    else if (item.href) router.push(item.href);
  }

  return (
    <>
      {/* Trigger pill (shown in nav) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-stone-200 hover:border-stone-300 bg-white text-xs text-stone-500 transition-colors"
        aria-label="Command palette"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="mr-4">検索...</span>
        <span className="kbd"><Command className="w-2.5 h-2.5" />K</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center pt-[14vh] px-4"
          style={{ background: 'rgba(12,10,9,0.45)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-[580px] bg-white rounded-2xl border border-stone-200 overflow-hidden"
            style={{ boxShadow: 'var(--shadow-xl)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 border-b border-stone-100">
              <Search className="w-4 h-4 text-stone-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ページ・アクションを検索…"
                className="flex-1 py-4 text-[15px] text-stone-900 placeholder-stone-400 outline-none bg-transparent"
              />
              <span className="kbd">ESC</span>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-2">
              {grouped.length === 0 ? (
                <div className="px-4 py-12 text-center text-sm text-stone-400">
                  <Sparkles className="w-5 h-5 mx-auto mb-2 opacity-60" />
                  一致するものがありません
                </div>
              ) : (
                grouped.map(([section, arr]) => (
                  <div key={section} className="px-2 mb-2">
                    <div className="px-2 py-1.5 text-[10px] font-semibold tracking-wider text-stone-400 uppercase">
                      {section === 'Navigate' ? 'ナビゲート' : section === 'Create' ? '作成' : 'アカウント'}
                    </div>
                    {arr.map((item) => {
                      const idx = filtered.indexOf(item);
                      const active = idx === selected;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => execute(item)}
                          onMouseEnter={() => setSelected(idx)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                            active ? 'bg-stone-100' : 'hover:bg-stone-50'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${
                            active ? 'bg-white border border-stone-200' : 'bg-stone-100'
                          }`}>
                            <Icon className="w-3.5 h-3.5 text-stone-700" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-stone-900">{item.label}</div>
                            {item.desc && <div className="text-[11px] text-stone-500 mt-0.5">{item.desc}</div>}
                          </div>
                          {active && <ArrowRight className="w-3.5 h-3.5 text-stone-400" />}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-stone-50 border-t border-stone-100 text-[10.5px] text-stone-500">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <span className="kbd">↑</span><span className="kbd">↓</span>
                  移動
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="kbd">↵</span>
                  実行
                </span>
              </div>
              <span>HairSalonLink</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating trigger on mobile */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="md:hidden fixed bottom-[76px] right-4 z-30 w-11 h-11 rounded-full bg-stone-900 text-white flex items-center justify-center border border-stone-800"
        style={{ boxShadow: 'var(--shadow-lg)' }}
        aria-label="Search"
      >
        <Search className="w-4 h-4" />
      </button>
    </>
  );
}

