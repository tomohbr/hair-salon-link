'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { getCurrentSalon } from '@/lib/salonData';
import { pushText } from '@/lib/line/client';

type State = { ok?: boolean; error?: string; message?: string } | null;

export async function createCustomerAction(_prev: State, formData: FormData): Promise<State> {
  try {
    const { salon } = await getCurrentSalon();
    const name = String(formData.get('name') || '').trim();
    const nameKana = String(formData.get('nameKana') || '').trim() || null;
    const phone = String(formData.get('phone') || '').trim() || null;
    const email = String(formData.get('email') || '').trim() || null;
    const source = String(formData.get('source') || 'other').trim();
    const notes = String(formData.get('notes') || '').trim() || null;

    if (!name) return { error: '名前は必須です' };

    // 電話 or メールが既存顧客と被る場合は警告
    if (phone) {
      const dup = await prisma.customer.findFirst({ where: { salonId: salon.id, phone } });
      if (dup) return { error: '同じ電話番号の顧客が既に登録されています' };
    }

    await prisma.customer.create({
      data: {
        salonId: salon.id,
        name, nameKana, phone, email, source,
        notes,
      },
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
    const customerId = String(formData.get('customerId') || '');
    const text = String(formData.get('text') || '').trim();
    if (!customerId) return { error: '顧客IDが指定されていません' };
    if (!text) return { error: 'メッセージ内容を入力してください' };

    const customer = await prisma.customer.findFirst({ where: { id: customerId, salonId: salon.id } });
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
