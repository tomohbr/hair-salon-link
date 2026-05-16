import { NextRequest, NextResponse } from 'next/server';
import { prismaForSalon } from '@/lib/prismaScoped';
import { getCurrentSalon } from '@/lib/salonData';
import { parseCouponsCsv } from '@/lib/csv/hpb';

export async function POST(req: NextRequest) {
  try {
    const { salon, session } = await getCurrentSalon();
    if (session.role === 'staff') {
      return NextResponse.json({ error: '権限がありません' }, { status: 403 });
    }
    const db = prismaForSalon(salon.id);
    const { csv } = await req.json();
    if (!csv) return NextResponse.json({ error: 'CSV が空です' }, { status: 400 });

    const parsed = parseCouponsCsv(csv);
    let created = 0;
    let updated = 0;
    let skipped = parsed.skipped;

    const existingAll = await db.coupon.findMany();
    const existingByTitle = new Map(existingAll.map((c) => [c.title.trim().toLowerCase(), c]));

    for (const row of parsed.rows) {
      try {
        const key = row.title.trim().toLowerCase();
        const existing = existingByTitle.get(key);
        if (existing) {
          await db.coupon.update({
            where: { id: existing.id },
            data: {
              description: row.description ?? existing.description,
              discountType: row.discountType,
              discountValue: row.discountValue,
              minPurchase: row.minPurchase,
              maxUses: row.maxUses,
              validUntil: row.validUntil ?? existing.validUntil,
              isActive: true,
            },
          });
          updated++;
        } else {
          await db.coupon.create({
            data: {
              salonId: salon.id,
              title: row.title,
              description: row.description ?? '',
              discountType: row.discountType,
              discountValue: row.discountValue,
              minPurchase: row.minPurchase,
              maxUses: row.maxUses,
              validUntil: row.validUntil,
              isActive: true,
            },
          });
          created++;
        }
      } catch (e) {
        console.error('[coupon import] row failed:', e);
        skipped++;
      }
    }

    return NextResponse.json({ ok: true, total: parsed.rows.length + skipped, created, updated, skipped });
  } catch (err) {
    console.error('[coupon import] fatal:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'サーバーエラー' },
      { status: 500 },
    );
  }
}
