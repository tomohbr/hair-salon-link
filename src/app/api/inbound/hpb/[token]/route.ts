// HPB 予約メールの自動取込 Webhook
//
// 運用:
//   Gmail 等のメールサービスで HPB 予約メールを Zapier / IFTTT / Make / Cloudflare Workers 等で
//   ここに転送させる。メール本文を body か body_plain か text のいずれかの JSON フィールド
//   または Content-Type: text/plain 生テキスト、あるいは x-www-form-urlencoded の body フィールドで受信。
//
// POST /api/inbound/hpb/<token>
//   Body: JSON {body|text|content|emailBody|body_plain: "..."}  または plain text または form-urlencoded
//
// セキュリティ: URL 末尾のトークンで店舗を特定。トークンが漏れたら rotate する。

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { parseHpbEmail } from '@/lib/hpb/emailParser';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;
    if (!token || token.length < 16) {
      return NextResponse.json({ error: 'invalid token' }, { status: 400 });
    }

    const salon = await prisma.salon.findFirst({
      where: { hpbInboundToken: token },
    });
    if (!salon) {
      return NextResponse.json({ error: 'salon not found' }, { status: 404 });
    }

    // Content-Type ごとに本文を取り出す
    const contentType = (req.headers.get('content-type') || '').toLowerCase();
    let emailBody = '';
    if (contentType.includes('application/json')) {
      const payload = await req.json().catch(() => ({}));
      emailBody =
        payload.body ||
        payload.text ||
        payload.content ||
        payload.emailBody ||
        payload.body_plain ||
        payload.plain ||
        payload.message ||
        '';
    } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const form = await req.formData();
      emailBody = String(
        form.get('body') ||
        form.get('text') ||
        form.get('content') ||
        form.get('emailBody') ||
        form.get('body_plain') ||
        form.get('plain') ||
        form.get('message') ||
        ''
      );
    } else {
      // plain text
      emailBody = await req.text();
    }

    if (!emailBody) {
      return NextResponse.json({ error: 'email body is empty' }, { status: 400 });
    }

    const bookings = parseHpbEmail(emailBody);
    if (bookings.length === 0) {
      // パースは失敗したが webhook 自体は 200 で返す（Zapier 側で retry されないように）
      return NextResponse.json({
        ok: true,
        parsed: 0,
        note: 'no booking extracted from this email',
      });
    }

    let created = 0;
    let updated = 0;
    let cancelled = 0;
    let skipped = 0;
    const messages: string[] = [];

    for (const bk of bookings) {
      let existing = null;
      if (bk.externalId) {
        existing = await prisma.reservation.findFirst({
          where: { salonId: salon.id, externalId: bk.externalId },
        });
      }
      if (!existing) {
        existing = await prisma.reservation.findFirst({
          where: {
            salonId: salon.id,
            date: bk.date,
            startTime: bk.startTime,
            customer: { name: bk.customerName },
          },
          include: { customer: true },
        });
      }

      if (bk.kind === 'cancel') {
        if (existing) {
          await prisma.reservation.update({
            where: { id: existing.id },
            data: { status: 'cancelled' },
          });
          cancelled++;
          messages.push(`cancelled: ${bk.date} ${bk.startTime} ${bk.customerName}`);
        } else {
          skipped++;
        }
        continue;
      }

      // 顧客確保
      let customer = bk.customerPhone
        ? await prisma.customer.findFirst({ where: { salonId: salon.id, phone: bk.customerPhone } })
        : null;
      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            salonId: salon.id,
            name: bk.customerName,
            nameKana: bk.customerNameKana,
            phone: bk.customerPhone,
            email: bk.customerEmail,
            source: 'hotpepper',
          },
        });
      }

      if (bk.kind === 'change' && existing) {
        await prisma.reservation.update({
          where: { id: existing.id },
          data: {
            date: bk.date,
            startTime: bk.startTime,
            endTime: bk.endTime,
            menuName: bk.menuName,
            menuPrice: bk.menuPrice,
            notes: bk.notes,
            status: 'confirmed',
          },
        });
        updated++;
        messages.push(`updated: ${bk.date} ${bk.startTime} ${bk.customerName}`);
        continue;
      }

      if (existing) { skipped++; continue; }

      // 衝突チェック
      const conflict = await prisma.reservation.findFirst({
        where: {
          salonId: salon.id,
          date: bk.date,
          status: { in: ['pending', 'confirmed', 'completed'] },
          AND: [
            { startTime: { lt: bk.endTime } },
            { endTime: { gt: bk.startTime } },
          ],
        },
        include: { customer: true },
      });
      if (conflict && conflict.customerId !== customer.id) {
        messages.push(
          `conflict: ${bk.date} ${bk.startTime}-${bk.endTime} vs ${conflict.customer?.name} (${conflict.source})`,
        );
        skipped++;
        continue;
      }

      await prisma.reservation.create({
        data: {
          salonId: salon.id,
          customerId: customer.id,
          menuName: bk.menuName,
          menuPrice: bk.menuPrice,
          date: bk.date,
          startTime: bk.startTime,
          endTime: bk.endTime,
          source: 'hotpepper',
          status: 'confirmed',
          notes: bk.notes,
          externalId: bk.externalId,
        },
      });
      created++;
      messages.push(`created: ${bk.date} ${bk.startTime} ${bk.customerName}`);
    }

    return NextResponse.json({
      ok: true,
      parsed: bookings.length,
      created, updated, cancelled, skipped,
      messages,
    });
  } catch (err) {
    console.error('[inbound hpb]', err);
    return NextResponse.json({
      error: err instanceof Error ? err.message : 'server error',
    }, { status: 500 });
  }
}

// 疎通確認用
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const salon = await prisma.salon.findFirst({
    where: { hpbInboundToken: token },
    select: { id: true, name: true, slug: true },
  });
  if (!salon) return NextResponse.json({ ok: false, error: 'invalid token' }, { status: 404 });
  return NextResponse.json({ ok: true, salon: salon.name });
}
