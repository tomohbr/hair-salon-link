'use server';

import { revalidatePath } from 'next/cache';
import { prismaForSalon } from '@/lib/prismaScoped';
import { getCurrentSalon } from '@/lib/salonData';
import { audit } from '@/lib/audit';

type State = { ok?: boolean; error?: string; message?: string } | null;

function parseInt0(v: FormDataEntryValue | null): number {
  const n = parseInt(String(v || '0').replace(/[^\d-]/g, ''), 10);
  return isNaN(n) ? 0 : n;
}

/** 予約を「完了」にして支払方法と金額を記録 */
export async function recordPaymentAction(_prev: State, fd: FormData): Promise<State> {
  try {
    const { salon, session } = await getCurrentSalon();
    const db = prismaForSalon(salon.id);
    const id = String(fd.get('id') || '');
    const paymentMethod = String(fd.get('paymentMethod') || '');
    const paidAmount = parseInt0(fd.get('paidAmount'));
    const retailAmount = parseInt0(fd.get('retailAmount'));
    const tip = parseInt0(fd.get('tip'));

    if (!id) return { error: '予約 ID が指定されていません' };
    if (!paymentMethod) return { error: '支払方法を選択してください' };
    if (paidAmount < 0) return { error: '金額は 0 以上にしてください' };

    const r = await db.reservation.findFirst({ where: { id } });
    if (!r) return { error: '予約が見つかりません' };

    await db.reservation.update({
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
      await db.customer.update({
        where: { id: r.customerId },
        data: {
          visitCount: { increment: 1 },
          totalSpent: { increment: totalThisTime },
          lastVisitDate: r.date,
        },
      });
    }

    await audit({
      salonId: salon.id,
      actorId: session.userId,
      actorName: session.email,
      action: 'reservation.payment',
      targetType: 'Reservation',
      targetId: id,
      diff: { paymentMethod, paidAmount, retailAmount, tip },
    });

    revalidatePath('/reservations');
    revalidatePath('/sales');
    return { ok: true, message: '支払いを記録しました' };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'エラーが発生しました' };
  }
}
