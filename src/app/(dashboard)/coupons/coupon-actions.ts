'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { getCurrentSalon } from '@/lib/salonData';

type State = { ok?: boolean; error?: string; message?: string } | null;

export async function createCouponAction(_prev: State, formData: FormData): Promise<State> {
  try {
    const { salon } = await getCurrentSalon();
    const title = String(formData.get('title') || '').trim();
    const description = String(formData.get('description') || '').trim();
    const discountType = (String(formData.get('discountType') || 'yen') === 'percent' ? 'percent' : 'yen') as 'percent' | 'yen';
    const discountValue = parseInt(String(formData.get('discountValue') || '0').replace(/[^\d-]/g, ''), 10) || 0;
    const minPurchase = parseInt(String(formData.get('minPurchase') || '0').replace(/[^\d-]/g, ''), 10) || 0;
    const maxUses = parseInt(String(formData.get('maxUses') || '0').replace(/[^\d-]/g, ''), 10) || 0;
    const validUntil = String(formData.get('validUntil') || '').trim() || null;
    const targetSegment = String(formData.get('targetSegment') || 'all').trim();

    if (!title) return { error: 'クーポン名は必須です' };
    if (discountValue <= 0) return { error: '割引額は 1 以上で入力してください' };
    if (discountType === 'percent' && discountValue > 100) return { error: '%割引は 100 以下にしてください' };

    await prisma.coupon.create({
      data: {
        salonId: salon.id,
        title,
        description: description || '',
        discountType,
        discountValue,
        minPurchase,
        maxUses,
        validUntil,
        targetSegment,
        isActive: true,
      },
    });
    revalidatePath('/coupons');
    return { ok: true, message: `「${title}」を作成しました` };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'エラーが発生しました' };
  }
}
