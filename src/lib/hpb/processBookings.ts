/**
 * HPB 予約メールのパース結果を Reservation に反映する共通処理。
 * - token 経由 (/api/inbound/hpb/[token])
 * - slug 経由 (/api/inbound/hpb/by-slug/[slug])  ← Cloudflare Email Workers から
 * - サロン内手動取込 (/api/reservations/import-hpb-email)
 * のいずれからも呼ばれる。
 */

import { prismaForSalon } from '@/lib/prismaScoped';
import { parseHpbEmail, type ParsedHpbBooking } from './emailParser';

export type ProcessResult = {
  ok: true;
  parsed: number;
  created: number;
  updated: number;
  cancelled: number;
  skipped: number;
  messages: string[];
};

export async function processHpbEmail(
  salonId: string,
  emailBody: string,
): Promise<ProcessResult> {
  const bookings = parseHpbEmail(emailBody);

  let created = 0;
  let updated = 0;
  let cancelled = 0;
  let skipped = 0;
  const messages: string[] = [];

  if (bookings.length === 0) {
    return { ok: true, parsed: 0, created, updated, cancelled, skipped, messages };
  }

  const db = prismaForSalon(salonId);

  for (const bk of bookings) {
    let existing = null;
    if (bk.externalId) {
      existing = await db.reservation.findFirst({ where: { externalId: bk.externalId } });
    }
    if (!existing) {
      existing = await db.reservation.findFirst({
        where: {
          date: bk.date,
          startTime: bk.startTime,
          customer: { name: bk.customerName },
        },
        include: { customer: true },
      });
    }

    if (bk.kind === 'cancel') {
      if (existing) {
        await db.reservation.update({ where: { id: existing.id }, data: { status: 'cancelled' } });
        cancelled++;
        messages.push(`cancelled: ${bk.date} ${bk.startTime} ${bk.customerName}`);
      } else {
        skipped++;
      }
      continue;
    }

    // 顧客確保
    let customer = bk.customerPhone
      ? await db.customer.findFirst({ where: { phone: bk.customerPhone } })
      : null;
    if (!customer) {
      customer = await db.customer.create({
        data: {
          salonId,
          name: bk.customerName,
          nameKana: bk.customerNameKana,
          phone: bk.customerPhone,
          email: bk.customerEmail,
          source: 'hotpepper',
        },
      });
    }

    if (bk.kind === 'change' && existing) {
      await db.reservation.update({
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

    if (existing) {
      skipped++;
      continue;
    }

    // 衝突チェック
    const conflict = await db.reservation.findFirst({
      where: {
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

    await db.reservation.create({
      data: {
        salonId,
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

  return {
    ok: true,
    parsed: bookings.length,
    created, updated, cancelled, skipped, messages,
  };
}

export type { ParsedHpbBooking };
