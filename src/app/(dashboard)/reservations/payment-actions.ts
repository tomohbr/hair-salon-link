'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { getCurrentSalon } from '@/lib/salonData';

type State = { ok?: boolean; error?: string; message?: string } | null;

function parseInt0(v: FormDataEntryValue | null): number {
  const n = parseInt(String(v || '0').replace(/[^\d-]/g, ''), 10);
  return isNaN(n) ? 0 : n;
}

/** 予約を「完了」にして支払方法と金額を記録 */
export async function recordPaymentAction(_prev: State, fd: FormData): Promise<State> {
  try {
    const { salon } = await getCurrentSalon();
    const id = String(fd.get('id') || '');
    const paymentMethod = String(fd.get('paymentMethod') || '');
    const paidAmount = parseInt0(fd.get('paidAmount'));
    const retailAmount = parseInt0(fd.get('retailAmount'));
    const tip = parseInt0(fd.get('tip'));

    if (!id) return { error: '予約 ID が指定されていません' };
    if (!paymentMethod) return { error: '支払方法を選択してください' };
    if (paidAmount < 0) return { error: '金額は 0 以上にしてください' };

    const r = await prisma.reservation.findFirst({ where: { id, salonId: salon.id } });
    if (!r) return { error: '予約が見つかりません' };

    await prisma.reservation.update({
      where: { id },
      data: {
        status: 'completed',
        paymentMethod,
        paidAmount: paidAmount || r.menuPrice || 0,
        retailAmount,
        tip,
        paidAt: new Date(),
      },
    });

    // 顧客の累計来店・売上を更新
    if (r.customerId) {
      const totalThisTime = paidAmount + retailAmount + tip;
      await prisma.customer.update({
        where: { id: r.customerId },
        data: {
          visitCount: { increment: 1 },
          totalSpent: { increment: totalThisTime },
          lastVisitDate: r.date,
        },
      });
    }

    revalidatePath('/reservations');
    revalidatePath('/sales');
    return { ok: true, message: '支払いを記録しました' };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'エラーが発生しました' };
  }
}
