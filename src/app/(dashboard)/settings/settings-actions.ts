'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { getCurrentSalon } from '@/lib/salonData';

/** 店舗の基本情報を更新 */
export async function saveSalonInfoAction(
  _prev: { ok?: boolean; error?: string; message?: string } | null,
  formData: FormData
): Promise<{ ok?: boolean; error?: string; message?: string }> {
  try {
    const { salon } = await getCurrentSalon();
    const name = String(formData.get('name') || '').trim();
    const address = String(formData.get('address') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const description = String(formData.get('description') || '').trim();
    if (!name) return { error: '店舗名は必須です' };

    await prisma.salon.update({
      where: { id: salon.id },
      data: {
        name,
        address: address || null,
        phone: phone || null,
        description: description || null,
      },
    });
    revalidatePath('/settings');
    return { ok: true, message: '店舗情報を保存しました' };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'エラーが発生しました' };
  }
}

/** LINE 連携情報を更新 */
export async function saveLineSettingsAction(
  _prev: { ok?: boolean; error?: string; message?: string } | null,
  formData: FormData
): Promise<{ ok?: boolean; error?: string; message?: string }> {
  try {
    const { salon } = await getCurrentSalon();
    const channelId = String(formData.get('channelId') || '').trim();
    const channelSecret = String(formData.get('channelSecret') || '').trim();
    const accessToken = String(formData.get('accessToken') || '').trim();
    const liffId = String(formData.get('liffId') || '').trim();

    await prisma.salon.update({
      where: { id: salon.id },
      data: {
        lineChannelId: channelId || null,
        lineChannelSecret: channelSecret || null,
        lineAccessToken: accessToken || null,
        lineLiffId: liffId || null,
      },
    });
    revalidatePath('/settings');
    return { ok: true, message: 'LINE 連携設定を保存しました' };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'エラーが発生しました' };
  }
}
