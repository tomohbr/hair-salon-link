'use client';

import { useActionState, useState, useEffect } from 'react';
import { X, Plus, TrendingUp, TrendingDown, Package, AlertTriangle, RotateCcw } from 'lucide-react';
import {
  createProductAction,
  stockInAction,
  stockSellAction,
  stockUseAction,
  stockAdjustAction,
  deleteProductAction,
} from './inventory-actions';

type Product = {
  id: string;
  name: string;
  category: string | null;
  sku: string | null;
  stock: number;
  minStock: number;
  unitCost: number;
  retailPrice: number | null;
  supplier: string | null;
  unit: string;
  isActive: boolean;
};

type TxType = 'in' | 'sell' | 'use' | 'adjust';

export default function InventoryClient({ products }: { products: Product[] }) {
  const [newOpen, setNewOpen] = useState(false);
  const [txOpen, setTxOpen] = useState<{ kind: TxType; product: Product } | null>(null);

  const lowStock = products.filter((p) => p.stock <= p.minStock && p.minStock > 0);

  return (
    <>
      <div className="space-y-6">
        {/* ヘッダ */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-stone-900">在庫管理</h1>
            <p className="text-xs md:text-sm text-stone-500 mt-1">
              商品 {products.length} 品目 / 要発注 {lowStock.length} 品目
            </p>
          </div>
          <button
            type="button"
            onClick={() => setNewOpen(true)}
            className="btn-brand text-xs px-3 py-1.5 inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />商品を追加
          </button>
        </div>

        {/* 要発注アラート */}
        {lowStock.length > 0 && (
          <div className="card-box bg-amber-50 border-amber-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-sm text-amber-900">要発注アラート</div>
                <div className="text-xs text-amber-800 mt-1">
                  最低在庫数を下回っている商品: {lowStock.map((p) => `${p.name} (${p.stock}${p.unit})`).join(' / ')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 商品リスト */}
        {products.length === 0 ? (
          <div className="card-box text-center py-10">
            <Package className="w-10 h-10 mx-auto text-stone-300 mb-3" />
            <p className="text-sm text-stone-500">商品がまだ登録されていません。</p>
          </div>
        ) : (
          <div className="card-box">
            <div className="overflow-x-auto -mx-5 px-5">
              <table className="w-full text-sm min-w-[680px]">
                <thead>
                  <tr className="text-left text-xs text-stone-500 border-b border-stone-200">
                    <th className="py-3 px-2">商品名</th>
                    <th className="py-3 px-2">カテゴリ</th>
                    <th className="py-3 px-2 text-right">在庫</th>
                    <th className="py-3 px-2 text-right">単価 / 販売価格</th>
                    <th className="py-3 px-2 text-center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const low = p.minStock > 0 && p.stock <= p.minStock;
                    return (
                      <tr key={p.id} className="border-b border-stone-100 hover:bg-stone-50">
                        <td className="py-3 px-2">
                          <div className="font-medium text-stone-900">{p.name}</div>
                          {p.sku && <div className="text-[10px] text-stone-400">{p.sku}</div>}
                        </td>
                        <td className="py-3 px-2 text-stone-600 text-xs">{p.category || '—'}</td>
                        <td className="py-3 px-2 text-right">
                          <span className={`font-bold ${low ? 'text-amber-600' : 'text-stone-900'}`}>
                            {p.stock}
                          </span>
                          <span className="text-xs text-stone-500 ml-0.5">{p.unit}</span>
                          {p.minStock > 0 && (
                            <div className="text-[10px] text-stone-400 mt-0.5">
                              最低 {p.minStock}{p.unit}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-2 text-right text-xs">
                          <div className="text-stone-600">仕入 ¥{p.unitCost.toLocaleString()}</div>
                          {p.retailPrice != null && p.retailPrice > 0 && (
                            <div className="brand-text font-medium">販売 ¥{p.retailPrice.toLocaleString()}</div>
                          )}
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center justify-center gap-1 flex-wrap">
                            <button
                              onClick={() => setTxOpen({ kind: 'in', product: p })}
                              className="text-[11px] px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              title="仕入"
                            >
                              +仕入
                            </button>
                            {p.retailPrice != null && p.retailPrice > 0 && (
                              <button
                                onClick={() => setTxOpen({ kind: 'sell', product: p })}
                                className="text-[11px] px-2 py-1 rounded bg-brand-50 brand-text border brand-border hover:opacity-80"
                                style={{ backgroundColor: '#fdf9f0', borderColor: '#c9a96e', color: '#9c7a4a' }}
                                title="店販"
                              >
                                店販
                              </button>
                            )}
                            <button
                              onClick={() => setTxOpen({ kind: 'use', product: p })}
                              className="text-[11px] px-2 py-1 rounded bg-stone-50 text-stone-700 border border-stone-200 hover:bg-stone-100"
                              title="施術使用"
                            >
                              使用
                            </button>
                            <button
                              onClick={() => setTxOpen({ kind: 'adjust', product: p })}
                              className="text-[11px] px-2 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                              title="棚卸"
                            >
                              棚卸
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {newOpen && <NewProductModal onClose={() => setNewOpen(false)} />}
      {txOpen && <TransactionModal tx={txOpen} onClose={() => setTxOpen(null)} />}
    </>
  );
}

/* ─────────────────────────────────────────────── */
function NewProductModal({ onClose }: { onClose: () => void }) {
  const [state, action, pending] = useActionState(createProductAction, null);

  useEffect(() => {
    if (state?.ok) {
      const t = setTimeout(onClose, 900);
      return () => clearTimeout(t);
    }
  }, [state, onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div className="bg-white rounded-xl p-5 w-full max-w-md max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-stone-900">商品を追加</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700"><X className="w-5 h-5" /></button>
        </div>

        {state?.error && <div className="mb-3 p-2 rounded text-xs bg-red-50 border border-red-200 text-red-700">{state.error}</div>}
        {state?.ok && <div className="mb-3 p-2 rounded text-xs bg-emerald-50 border border-emerald-200 text-emerald-800">{state.message}</div>}

        <form action={action} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">商品名 *</label>
            <input name="name" required className="input" placeholder="オッジィオット シャンプー" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">カテゴリ</label>
              <input name="category" list="product-cats" className="input" placeholder="シャンプー" />
              <datalist id="product-cats">
                <option value="シャンプー" />
                <option value="トリートメント" />
                <option value="スタイリング剤" />
                <option value="カラー剤" />
                <option value="パーマ剤" />
                <option value="店販" />
                <option value="消耗品" />
              </datalist>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">単位</label>
              <input name="unit" defaultValue="個" className="input" placeholder="本 / 個 / g" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">SKU / 商品コード</label>
            <input name="sku" className="input" placeholder="OGS-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">初期在庫数</label>
              <input name="stock" type="number" inputMode="numeric" defaultValue={0} min={0} className="input" />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">最低在庫数</label>
              <input name="minStock" type="number" inputMode="numeric" defaultValue={0} min={0} className="input" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">仕入単価 (円)</label>
              <input name="unitCost" type="number" inputMode="numeric" min={0} defaultValue={0} className="input" />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">販売価格 (円)</label>
              <input name="retailPrice" type="number" inputMode="numeric" min={0} className="input" placeholder="店販しない場合は空欄" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">仕入先</label>
            <input name="supplier" className="input" placeholder="美容ディーラー○○" />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="btn-ghost border border-stone-300 text-xs px-3 py-2">キャンセル</button>
            <button type="submit" disabled={pending} className="btn-brand text-xs px-4 py-2">
              {pending ? '登録中...' : '登録'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────── */
function TransactionModal({ tx, onClose }: { tx: { kind: TxType; product: Product }; onClose: () => void }) {
  const { kind, product } = tx;
  const actionFn = kind === 'in' ? stockInAction
    : kind === 'sell' ? stockSellAction
    : kind === 'use' ? stockUseAction
    : stockAdjustAction;
  const [state, action, pending] = useActionState(actionFn, null);

  useEffect(() => {
    if (state?.ok) { const t = setTimeout(onClose, 900); return () => clearTimeout(t); }
  }, [state, onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const titles: Record<TxType, string> = {
    in: '仕入を記録',
    sell: '店販を記録',
    use: '使用を記録',
    adjust: '棚卸 / 在庫調整',
  };
  const icons: Record<TxType, React.ReactNode> = {
    in: <TrendingUp className="w-4 h-4 text-emerald-600" />,
    sell: <span className="text-sm">💰</span>,
    use: <TrendingDown className="w-4 h-4 text-stone-600" />,
    adjust: <RotateCcw className="w-4 h-4 text-amber-600" />,
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div className="modal-sheet bg-white rounded-xl p-5 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-stone-900 inline-flex items-center gap-2">
            {icons[kind]}
            {titles[kind]}
          </h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700"><X className="w-5 h-5" /></button>
        </div>
        <div className="mb-3 p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-sm">
          <div className="font-medium text-stone-900">{product.name}</div>
          <div className="text-xs text-stone-500 mt-0.5">
            現在在庫: <b className="text-stone-900">{product.stock}</b>{product.unit}
            {product.retailPrice != null && kind === 'sell' && (
              <span className="ml-3">販売価格: ¥{product.retailPrice.toLocaleString()}</span>
            )}
          </div>
        </div>

        {state?.error && <div className="mb-3 p-2 rounded text-xs bg-red-50 border border-red-200 text-red-700">{state.error}</div>}
        {state?.ok && <div className="mb-3 p-2 rounded text-xs bg-emerald-50 border border-emerald-200 text-emerald-800">{state.message}</div>}

        <form action={action} className="space-y-3">
          <input type="hidden" name="productId" value={product.id} />

          {kind === 'adjust' ? (
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">在庫数 (棚卸結果) *</label>
              <input name="target" type="number" inputMode="numeric" required min={0} defaultValue={product.stock} className="input" />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                {kind === 'in' ? '入荷数' : kind === 'sell' ? '販売数' : '使用数'} *
              </label>
              <input name="quantity" type="number" inputMode="numeric" required min={1} defaultValue={1} className="input" />
            </div>
          )}

          {kind === 'in' && (
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">仕入単価 (任意)</label>
              <input name="unitCost" type="number" inputMode="numeric" min={0} defaultValue={product.unitCost} className="input" />
              <p className="text-[10px] text-stone-500 mt-1">入力すると単価も更新されます</p>
            </div>
          )}

          {kind === 'sell' && (
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">販売単価 (任意)</label>
              <input
                name="unitPrice" type="number" inputMode="numeric" min={0}
                defaultValue={product.retailPrice || 0}
                className="input"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">メモ</label>
            <input name="notes" className="input" placeholder={kind === 'in' ? '仕入先、ロット番号など' : ''} />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="btn-ghost border border-stone-300 text-xs px-3 py-2">キャンセル</button>
            <button type="submit" disabled={pending} className="btn-brand text-xs px-4 py-2">
              {pending ? '記録中...' : '記録する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
