'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { yen, fmtDate, sourceLabel } from '@/lib/utils/format';

export interface CustomerRow {
  id: string;
  name: string;
  nameKana: string | null;
  phone: string | null;
  email: string | null;
  source: string;
  isLineFriend: boolean;
  visitCount: number;
  totalSpent: number;
  lastVisitDate: string | null;
}

export default function CustomersTable({ customers }: { customers: CustomerRow[] }) {
  const [query, setQuery] = useState('');
  const [source, setSource] = useState('all');

  const sources = useMemo(
    () => Array.from(new Set(customers.map((c) => c.source))).sort(),
    [customers],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customers.filter((c) => {
      if (source !== 'all' && c.source !== source) return false;
      if (!q) return true;
      return [c.name, c.nameKana, c.phone, c.email]
        .some((v) => (v || '').toLowerCase().includes(q));
    });
  }, [customers, query, source]);

  return (
    <div className="card-box">
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            className="input pl-9 w-full"
            placeholder="名前・電話番号・メールで検索..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className="input max-w-xs"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        >
          <option value="all">すべての流入元</option>
          {sources.map((s) => (
            <option key={s} value={s}>{sourceLabel(s)}</option>
          ))}
        </select>
      </div>

      {customers.length === 0 ? (
        <p className="text-sm text-stone-500 py-8 text-center">
          顧客がまだ登録されていません。最初の顧客を追加しましょう。
        </p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-stone-500 py-8 text-center">
          検索条件に一致する顧客が見つかりません。
        </p>
      ) : (
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-xs text-stone-500 border-b border-stone-200">
                <th className="py-3 px-2">顧客名</th>
                <th className="py-3 px-2">流入元</th>
                <th className="py-3 px-2">LINE</th>
                <th className="py-3 px-2">来店回数</th>
                <th className="py-3 px-2">累計売上</th>
                <th className="py-3 px-2">最終来店</th>
                <th className="py-3 px-2"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-stone-100 hover:bg-stone-50">
                  <td className="py-3 px-2">
                    <div className="font-medium text-stone-900">{c.name}</div>
                    <div className="text-xs text-stone-500">{c.nameKana}</div>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`badge ${c.source === 'hotpepper' ? 'badge-yellow' : c.source === 'line' ? 'badge-green' : 'badge-gray'}`}>
                      {sourceLabel(c.source)}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    {c.isLineFriend ? <span className="badge badge-green">登録済</span> : <span className="badge badge-gray">未登録</span>}
                  </td>
                  <td className="py-3 px-2 font-medium">{c.visitCount}回</td>
                  <td className="py-3 px-2 font-medium">{yen(c.totalSpent)}</td>
                  <td className="py-3 px-2 text-stone-600">{c.lastVisitDate ? fmtDate(c.lastVisitDate) : '—'}</td>
                  <td className="py-3 px-2">
                    <Link href={`/customers/${c.id}`} className="brand-text text-xs font-medium">詳細 →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(query || source !== 'all') && (
            <p className="text-xs text-stone-400 mt-3">
              {filtered.length} / {customers.length} 名を表示
            </p>
          )}
        </div>
      )}
    </div>
  );
}
