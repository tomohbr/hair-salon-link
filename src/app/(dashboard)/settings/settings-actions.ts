'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { getCurrentSalon } from '@/lib/salonData';
import { testConnection } from '@/lib/line/client';

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

/**
 * 営業時間・臨時休業日・予約枠設定を保存する
 * クライアントが JSON.stringify した data を受け取る
 */
export async function saveBusinessHoursAction(
  _prev: { ok?: boolean; error?: string; message?: string } | null,
  formData: FormData,
): Promise<{ ok?: boolean; error?: string; message?: string }> {
  try {
    const { salon } = await getCurrentSalon();
    const raw = String(formData.get('data') || '{}');
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return { error: '営業時間データの読込に失敗しました' };
    }
    if (!parsed || typeof parsed !== 'object') {
      return { error: '営業時間データが不正です' };
    }
    await prisma.salon.update({
      where: { id: salon.id },
      data: { businessHours: parsed as object },
    });
    revalidatePath('/settings');
    revalidatePath('/reservations');
    return { ok: true, message: '営業時間を保存しました' };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'エラーが発生しました' };
  }
}

/**
 * HPB メール取込用 Webhook トークンを生成/再生成
 * 既存トークンは即無効になる
 */
export async function rotateHpbInboundTokenAction(
  _prev: { ok?: boolean; error?: string; message?: string; token?: string } | null,
  _formData: FormData,
): Promise<{ ok?: boolean; error?: string; message?: string; token?: string }> {
  try {
    const { salon } = await getCurrentSalon();
    // 32 文字の URL セーフなトークン
    const bytes = new Uint8Array(24);
    crypto.getRandomValues(bytes);
    const token = Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');

    await prisma.salon.update({
      where: { id: salon.id },
      data: { hpbInboundToken: token },
    });
    revalidatePath('/settings');
    return { ok: true, message: 'Webhook トークンを発行しました', token };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'エラーが発生しました' };
  }
}

/** URL 用スラグを ASCII 安全な値に再生成する */
function asciiSlug(s: string) {
  const ascii = s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
  return ascii || 'salon-' + Math.random().toString(36).slice(2, 10);
}

/**
 * 公開予約 URL の slug を ASCII 安全に再生成する。
 * 日本語などが含まれる壊れたスラグの救済用。実行後、新 URL をお客様に再共有する必要あり。
 */
export async function regenerateSlugAction(
  _prev: { ok?: boolean; error?: string; message?: string } | null,
  _formData: FormData,
): Promise<{ ok?: boolean; error?: string; message?: string }> {
  try {
    const { salon } = await getCurrentSalon();
    let candidate = asciiSlug(salon.name) + '-' + Math.random().toString(36).slice(2, 6);

    // 重複チェック & 競合時は再試行
    for (let i = 0; i < 5; i++) {
      const exists = await prisma.salon.findUnique({ where: { slug: candidate } });
      if (!exists) break;
      candidate = asciiSlug(salon.name) + '-' + Math.random().toString(36).slice(2, 6);
    }

    await prisma.salon.update({
      where: { id: salon.id },
      data: { slug: candidate },
    });
    revalidatePath('/settings');
    return { ok: true, message: `公開URLを更新しました: /book/${candidate}` };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'エラーが発生しました' };
  }
}

/** 保存された LINE 認証情報で実際に LINE API を叩いて接続確認する */
export async function testLineConnectionAction(
  _prev: { ok?: boolean; error?: string; message?: string } | null,
  _formData: FormData,
): Promise<{ ok?: boolean; error?: string; message?: string }> {
  try {
    const { salon } = await getCurrentSalon();
    if (!salon.lineAccessToken) {
      return { error: 'Channel Access Token が未保存です。先に保存してください。' };
    }
    const result = await testConnection({
      accessToken: salon.lineAccessToken,
      channelSecret: salon.lineChannelSecret,
    });
    if (!result.ok) {
      return { error: result.message || `エラー (status ${result.status})` };
    }
    // LINE の /bot/info は basicId・displayName などを返すのでメッセージに反映
    let label = '認証 OK';
    if (result.body) {
      try {
        const info = JSON.parse(result.body) as { displayName?: string; basicId?: string; userId?: string };
        label = `${info.displayName || '不明'} (${info.basicId || ''}) と接続できました`;
        // ついでに bot userId を保存しておくと webhook の逆引きが即成立
        if (info.userId && info.userId !== salon.lineBotUserId) {
          await prisma.salon.update({
            where: { id: salon.id },
            data: { lineBotUserId: info.userId },
          });
        }
      } catch { /* ignore */ }
    }
    return { ok: true, message: label };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'エラーが発生しました' };
  }
}
