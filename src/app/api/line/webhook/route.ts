import { NextRequest, NextResponse } from 'next/server';
import { verifySignature, replyText } from '@/lib/line/client';
import { prisma } from '@/lib/db';

interface LineEvent {
  type: string;
  replyToken?: string;
  source?: { userId?: string; type: string };
  message?: { type: string; text?: string };
}

interface LineWebhookPayload {
  destination: string; // LINE 公式アカウント側の bot userId (U...)
  events: LineEvent[];
}

/**
 * /api/line/webhook
 *
 * LINE プラットフォームからの Webhook。
 * マルチテナント：destination を Salon.lineBotUserId で逆引きして
 * 該当店舗の channelSecret で署名検証し、該当店舗の accessToken で返信する。
 * マッピングが無い場合は channelSecret を総当たりして署名一致する店舗を探す。
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('x-line-signature') || '';

  let payload: LineWebhookPayload;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const dest = payload.destination;
  let salon = dest
    ? await prisma.salon.findFirst({ where: { lineBotUserId: dest } })
    : null;

  if (!salon) {
    const candidates = await prisma.salon.findMany({
      where: { lineChannelSecret: { not: null } },
    });
    for (const c of candidates) {
      if (c.lineChannelSecret && verifySignature(body, signature, { channelSecret: c.lineChannelSecret })) {
        salon = c;
        if (dest && salon.lineBotUserId !== dest) {
          await prisma.salon.update({ where: { id: salon.id }, data: { lineBotUserId: dest } });
        }
        break;
      }
    }
  } else {
    if (!verifySignature(body, signature, { channelSecret: salon.lineChannelSecret })) {
      return NextResponse.json({ error: 'invalid signature' }, { status: 401 });
    }
  }

  // 店舗を特定できない Webhook は、署名検証も成立しない＝正規の店舗に
  // 紐付かないイベント。別店舗の顧客として誤登録しないよう、ここで安全に終了する。
  // （200 を返して LINE 側の不要なリトライを防ぐ）
  if (!salon) {
    return NextResponse.json({ ok: true, salonId: null });
  }

  const creds = {
    accessToken: salon.lineAccessToken,
    channelSecret: salon.lineChannelSecret,
  };

  const salonName = salon?.name || 'HairSalonLink';
  const slug = salon?.slug || 'demo';
  const bookUrl = `${(process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/$/, '')}/book/${slug}`;

  for (const event of payload.events || []) {
    if (event.type === 'follow' && event.replyToken) {
      await replyText(
        event.replyToken,
        `${salonName} を追加いただきありがとうございます🌸\nご予約・クーポン情報はこちらから。\nまずは「予約」とメッセージください。`,
        creds,
      );
      if (event.source?.userId && salon) {
        try {
          await prisma.customer.upsert({
            where: { salonId_lineUserId: { salonId: salon.id, lineUserId: event.source.userId } },
            create: {
              salonId: salon.id,
              lineUserId: event.source.userId,
              name: 'LINE友だち',
              source: 'line',
              isLineFriend: true,
            },
            update: { isLineFriend: true },
          });
        } catch (e) {
          console.error('[line webhook] upsert failed', e);
        }
      }
      continue;
    }

    if (event.type === 'message' && event.message?.type === 'text' && event.replyToken) {
      const text = (event.message.text || '').trim();
      if (/予約/.test(text)) {
        await replyText(event.replyToken, `ご予約はこちらから🌸\n${bookUrl}`, creds);
      } else if (/クーポン/.test(text)) {
        await replyText(event.replyToken, '配信中のクーポンは定期的にお届けしておりますのでお楽しみに✨', creds);
      } else if (/営業|時間|定休|アクセス/.test(text)) {
        await replyText(event.replyToken, `${salonName} の営業時間・アクセス情報はこちら\n${bookUrl}`, creds);
      } else {
        await replyText(
          event.replyToken,
          `こんにちは！${salonName}です🌸\n「予約」「クーポン」「営業時間」などと送ると詳細をお伝えします。`,
          creds,
        );
      }
    }
  }

  return NextResponse.json({ ok: true, salonId: salon?.id ?? null });
}

// ブラウザから開いた時のステータス確認用
export async function GET() {
  return NextResponse.json({
    ok: true,
    message: 'LINE webhook endpoint. POST from LINE platform only.',
  });
}
