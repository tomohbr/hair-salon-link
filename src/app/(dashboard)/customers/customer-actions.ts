'use server';

import { revalidatePath } from 'next/cache';
import { prismaForSalon } from '@/lib/prismaScoped';
import { getCurrentSalon } from '@/lib/salonData';
import { pushText } from '@/lib/line/client';
import { audit } from '@/lib/audit';

type State = { ok?: boolean; error?: string; message?: string } | null;

export async function createCustomerAction(_prev: State, formData: FormData): Promise<State> {
  try {
    const { salon, session } = await getCurrentSalon();
    const db = prismaForSalon(salon.id);
    const name = String(formData.get('name') || '').trim();
    const nameKana = String(formData.get('nameKana') || '').trim() || null;
    const phone = String(formData.get('phone') || '').trim() || null;
    const email = String(formData.get('email') || '').trim() || null;
    const source = String(formData.get('source') || 'other').trim();
    const notes = String(formData.get('notes') || '').trim() || null;

    if (!name) return { error: '名前は必須です' };

    if (phone) {
      const dup = await db.customer.findFirst({ where: { phone } });
      if (dup) return { error: '同じ電話番号の顧客が既に登録されています' };
    }

    const created = await db.customer.create({
      data: { salonId: salon.id, name, nameKana, phone, email, source, notes },
    });
    await audit({
      salonId: salon.id,
      actorId: session.userId,
      actorName: session.email,
      action: 'customer.create',
      targetType: 'Customer',
      targetId: created.id,
    });
    revalidatePath('/customers');
    return { ok: true, message: `「${name}」を追加しました` };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'エラーが発生しました' };
  }
}

export async function sendLineMessageAction(_prev: State, formData: FormData): Promise<State> {
  try {
    const { salon } = await getCurrentSalon();
    const db = prismaForSalon(salon.id);
    const customerId = String(formData.get('customerId') || '');
    const text = String(formData.get('text') || '').trim();
    if (!customerId) return { error: '顧客IDが指定されていません' };
    if (!text) return { error: 'メッセージ内容を入力してください' };

    const customer = await db.customer.findFirst({ where: { id: customerId } });
    if (!customer) return { error: '顧客が見つかりません' };
    if (!customer.lineUserId) return { error: 'この顧客はまだLINE連携していません（友だち追加が必要）' };
    if (!salon.lineAccessToken) return { error: 'LINE連携情報が未設定です。設定画面で LINE 認証情報を保存してください' };

    const result = await pushText(customer.lineUserId, text, {
      accessToken: salon.lineAccessToken,
      channelSecret: salon.lineChannelSecret,
    });
    if (!result.ok) return { error: 'LINE 送信に失敗しました' };

    return { ok: true, message: `${customer.name}様に LINE を送信しました` };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'エラーが発生しました' };
  }
}
