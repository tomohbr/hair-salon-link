'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { getCurrentSalon } from '@/lib/salonData';
import { broadcastText, multicastText } from '@/lib/line/client';

type State = { ok?: boolean; error?: string; message?: string } | null;

export async function sendBroadcastAction(_prev: State, formData: FormData): Promise<State> {
  try {
    const { salon } = await getCurrentSalon();
    if (!salon.lineAccessToken) return { error: 'LINE 認証情報が未設定です。設定画面で先に保存してください。' };

    const title = String(formData.get('title') || '').trim();
    const content = String(formData.get('content') || '').trim();
    const type = String(formData.get('type') || 'broadcast'); // broadcast | segment
    const segment = String(formData.get('targetSegment') || 'all');

    if (!title) return { error: 'タイトルは必須です' };
    if (!content) return { error: '本文は必須です' };

    const creds = { accessToken: salon.lineAccessToken, channelSecret: salon.lineChannelSecret };

    let sentCount = 0;
    if (type === 'broadcast') {
      const result = await broadcastText(content, creds);
      if (!result.ok) return { error: 'LINE 配信に失敗しました' };
      // 友だち全員 → 正確な数は LINE API で別途取得する必要があるが、ここでは登録友だち数で代用
      sentCount = await prisma.customer.count({ where: { salonId: salon.id, isLineFriend: true } });
    } else {
      // セグメント配信
      const where: Record<string, unknown> = { salonId: salon.id, isLineFriend: true };
      if (segment === 'dormant') {
        const thresh = new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10);
        where.lastVisitDate = { lte: thresh };
      } else if (segment === 'new') {
        where.visitCount = { lte: 1 };
      } else if (segment === 'vip') {
        where.tags = { has: 'vip' };
      }
      const targets = await prisma.customer.findMany({ where, select: { lineUserId: true } });
      const userIds = targets.map((t) => t.lineUserId).filter((x): x is string => !!x);
      if (userIds.length === 0) return { error: '対象の友だちが 0 人です' };
      const result = await multicastText(userIds, content, creds);
      if (!result.ok) return { error: 'LINE 配信に失敗しました' };
      sentCount = userIds.length;
    }

    await prisma.message.create({
      data: {
        salonId: salon.id,
        type: type === 'broadcast' ? 'broadcast' : 'segment',
        title,
        content,
        targetSegment: type === 'segment' ? segment : undefined,
        sentCount,
        openedCount: 0,
        clickedCount: 0,
        status: 'sent',
        sentAt: new Date(),
      },
    });

    revalidatePath('/messages');
    return { ok: true, message: `${sentCount}名に配信しました` };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'エラーが発生しました' };
  }
}
