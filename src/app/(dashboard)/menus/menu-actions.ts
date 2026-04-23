'use server';

import { revalidatePath } from 'next/cache';
import { prismaForSalon } from '@/lib/prismaScoped';
import { getCurrentSalon } from '@/lib/salonData';
import { audit } from '@/lib/audit';

type State = { ok?: boolean; error?: string; message?: string } | null;

export async function createMenuAction(_prev: State, formData: FormData): Promise<State> {
  try {
    const { salon, session } = await getCurrentSalon();
    const db = prismaForSalon(salon.id);
    const name = String(formData.get('name') || '').trim();
    const category = String(formData.get('category') || 'その他').trim() || 'その他';
    const price = parseInt(String(formData.get('price') || '0').replace(/[^\d-]/g, ''), 10) || 0;
    const durationMinutes = parseInt(String(formData.get('durationMinutes') || '60').replace(/[^\d-]/g, ''), 10) || 60;
    const description = String(formData.get('description') || '').trim() || null;
    const isActive = formData.get('isActive') === 'on';

    if (!name) return { error: 'メニュー名は必須です' };
    if (price < 0) return { error: '料金は 0 以上で入力してください' };
    if (durationMinutes <= 0) return { error: '所要時間は 1 分以上で入力してください' };

    const existingCount = await db.menu.count();
    const sortOrder = (existingCount + 1) * 10;

    const created = await db.menu.create({
      data: { salonId: salon.id, name, category, price, durationMinutes, description, isActive, sortOrder },
    });
    await audit({
      salonId: salon.id,
      actorId: session.userId,
      actorName: session.email,
      action: 'menu.create',
      targetType: 'Menu',
      targetId: created.id,
    });
    revalidatePath('/menus');
    return { ok: true, message: `「${name}」を追加しました` };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'エラーが発生しました' };
  }
}

export async function deleteMenuAction(_prev: State, formData: FormData): Promise<State> {
  try {
    const { salon, session } = await getCurrentSalon();
    const db = prismaForSalon(salon.id);
    const id = String(formData.get('id') || '');
    if (!id) return { error: 'ID が指定されていません' };
    // 拡張クライアントが salonId を自動注入するので、他店の id では見つからない
    const menu = await db.menu.findFirst({ where: { id } });
    if (!menu) return { error: 'メニューが見つかりません' };
    await db.menu.delete({ where: { id } });
    await audit({
      salonId: salon.id,
      actorId: session.userId,
      actorName: session.email,
      action: 'menu.delete',
      targetType: 'Menu',
      targetId: id,
      diff: { name: menu.name },
    });
    revalidatePath('/menus');
    return { ok: true, message: 'メニューを削除しました' };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'エラーが発生しました' };
  }
}
