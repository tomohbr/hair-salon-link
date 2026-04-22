'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { getCurrentSalon } from '@/lib/salonData';

type State = { ok?: boolean; error?: string; message?: string } | null;

function parseInt0(v: FormDataEntryValue | null): number {
  const n = parseInt(String(v || '0').replace(/[^\d-]/g, ''), 10);
  return isNaN(n) ? 0 : n;
}

export async function createProductAction(_prev: State, fd: FormData): Promise<State> {
  try {
    const { salon } = await getCurrentSalon();
    const name = String(fd.get('name') || '').trim();
    if (!name) return { error: '商品名は必須です' };

    const category = String(fd.get('category') || '').trim() || null;
    const sku = String(fd.get('sku') || '').trim() || null;
    const stock = parseInt0(fd.get('stock'));
    const minStock = parseInt0(fd.get('minStock'));
    const unitCost = parseInt0(fd.get('unitCost'));
    const retailPriceRaw = String(fd.get('retailPrice') || '').trim();
    const retailPrice = retailPriceRaw ? parseInt0(retailPriceRaw) : null;
    const supplier = String(fd.get('supplier') || '').trim() || null;
    const unit = String(fd.get('unit') || '個').trim() || '個';

    const product = await prisma.product.create({
      data: {
        salonId: salon.id,
        name, category, sku,
        stock, minStock, unitCost,
        retailPrice: retailPrice === 0 ? null : retailPrice,
        supplier, unit,
      },
    });

    // 初期在庫が 0 でなければ取引履歴を残す
    if (stock > 0) {
      await prisma.stockTransaction.create({
        data: {
          salonId: salon.id,
          productId: product.id,
          kind: 'in',
          quantity: stock,
          amount: unitCost * stock,
          notes: '初期登録',
        },
      });
    }
    revalidatePath('/inventory');
    return { ok: true, message: `「${name}」を登録しました` };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'エラーが発生しました' };
  }
}

/** 仕入 (+stock) */
export async function stockInAction(_prev: State, fd: FormData): Promise<State> {
  try {
    const { salon } = await getCurrentSalon();
    const productId = String(fd.get('productId') || '');
    const quantity = parseInt0(fd.get('quantity'));
    const unitCost = parseInt0(fd.get('unitCost'));
    const notes = String(fd.get('notes') || '').trim() || null;
    if (!productId || quantity <= 0) return { error: '商品と数量を入力してください' };

    const product = await prisma.product.findFirst({ where: { id: productId, salonId: salon.id } });
    if (!product) return { error: '商品が見つかりません' };

    await prisma.$transaction([
      prisma.product.update({
        where: { id: productId },
        data: {
          stock: { increment: quantity },
          unitCost: unitCost > 0 ? unitCost : undefined,
        },
      }),
      prisma.stockTransaction.create({
        data: {
          salonId: salon.id, productId,
          kind: 'in', quantity,
          amount: (unitCost || product.unitCost) * quantity,
          notes,
        },
      }),
    ]);
    revalidatePath('/inventory');
    return { ok: true, message: `${product.name} を ${quantity} ${product.unit}入荷しました` };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'エラーが発生しました' };
  }
}

/** 店販 (-stock, 売上発生) */
export async function stockSellAction(_prev: State, fd: FormData): Promise<State> {
  try {
    const { salon } = await getCurrentSalon();
    const productId = String(fd.get('productId') || '');
    const quantity = parseInt0(fd.get('quantity'));
    const unitPriceRaw = fd.get('unitPrice');
    const notes = String(fd.get('notes') || '').trim() || null;
    if (!productId || quantity <= 0) return { error: '商品と数量を入力してください' };

    const product = await prisma.product.findFirst({ where: { id: productId, salonId: salon.id } });
    if (!product) return { error: '商品が見つかりません' };
    if (product.stock < quantity) return { error: `在庫不足 (現在 ${product.stock}${product.unit})` };

    const unitPrice = unitPriceRaw ? parseInt0(unitPriceRaw) : (product.retailPrice ?? 0);
    if (unitPrice <= 0) return { error: '販売単価が 0 です。商品の販売価格を設定してください' };

    await prisma.$transaction([
      prisma.product.update({
        where: { id: productId },
        data: { stock: { decrement: quantity } },
      }),
      prisma.stockTransaction.create({
        data: {
          salonId: salon.id, productId,
          kind: 'sell', quantity: -quantity,
          amount: unitPrice * quantity,
          notes,
        },
      }),
    ]);
    revalidatePath('/inventory');
    return { ok: true, message: `店販 ${product.name} × ${quantity} を記録しました（¥${(unitPrice * quantity).toLocaleString()}）` };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'エラーが発生しました' };
  }
}

/** 施術使用 (-stock, 売上なし) */
export async function stockUseAction(_prev: State, fd: FormData): Promise<State> {
  try {
    const { salon } = await getCurrentSalon();
    const productId = String(fd.get('productId') || '');
    const quantity = parseInt0(fd.get('quantity'));
    const notes = String(fd.get('notes') || '').trim() || null;
    if (!productId || quantity <= 0) return { error: '商品と数量を入力してください' };

    const product = await prisma.product.findFirst({ where: { id: productId, salonId: salon.id } });
    if (!product) return { error: '商品が見つかりません' };
    if (product.stock < quantity) return { error: `在庫不足 (現在 ${product.stock}${product.unit})` };

    await prisma.$transaction([
      prisma.product.update({
        where: { id: productId },
        data: { stock: { decrement: quantity } },
      }),
      prisma.stockTransaction.create({
        data: {
          salonId: salon.id, productId,
          kind: 'use', quantity: -quantity,
          notes,
        },
      }),
    ]);
    revalidatePath('/inventory');
    return { ok: true, message: `${product.name} を ${quantity}${product.unit}使用として記録しました` };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'エラーが発生しました' };
  }
}

/** 棚卸調整 (絶対数に設定) */
export async function stockAdjustAction(_prev: State, fd: FormData): Promise<State> {
  try {
    const { salon } = await getCurrentSalon();
    const productId = String(fd.get('productId') || '');
    const target = parseInt0(fd.get('target'));
    const notes = String(fd.get('notes') || '').trim() || null;
    if (!productId) return { error: '商品が指定されていません' };
    if (target < 0) return { error: '在庫数は 0 以上にしてください' };

    const product = await prisma.product.findFirst({ where: { id: productId, salonId: salon.id } });
    if (!product) return { error: '商品が見つかりません' };
    const delta = target - product.stock;

    await prisma.$transaction([
      prisma.product.update({
        where: { id: productId },
        data: { stock: target },
      }),
      prisma.stockTransaction.create({
        data: {
          salonId: salon.id, productId,
          kind: 'adjust', quantity: delta,
          notes: notes || `棚卸: ${product.stock} → ${target}`,
        },
      }),
    ]);
    revalidatePath('/inventory');
    return { ok: true, message: `在庫を ${target}${product.unit} に調整しました` };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'エラーが発生しました' };
  }
}

export async function deleteProductAction(_prev: State, fd: FormData): Promise<State> {
  try {
    const { salon } = await getCurrentSalon();
    const id = String(fd.get('id') || '');
    if (!id) return { error: 'ID が指定されていません' };
    const product = await prisma.product.findFirst({ where: { id, salonId: salon.id } });
    if (!product) return { error: '商品が見つかりません' };
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
    revalidatePath('/inventory');
    return { ok: true, message: `「${product.name}」を非表示にしました` };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'エラーが発生しました' };
  }
}
