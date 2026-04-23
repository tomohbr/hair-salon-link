// 顧客 CSV 取込 (HPB・SalonBoard 等)
// 電話番号が一致する既存顧客があれば上書き、なければ新規作成。

import { NextRequest, NextResponse } from 'next/server';
import { prismaForSalon } from '@/lib/prismaScoped';
import { getCurrentSalon } from '@/lib/salonData';
import { parseCustomersCsv } from '@/lib/csv/hpb';

export async function POST(req: NextRequest) {
  try {
    const { salon } = await getCurrentSalon();
    const db = prismaForSalon(salon.id);
    const { csv } = await req.json();
    if (!csv) return NextResponse.json({ error: 'CSV が空です' }, { status: 400 });

    const parsed = parseCustomersCsv(csv);

    let created = 0;
    let updated = 0;
    let skipped = parsed.skipped;

    for (const row of parsed.rows) {
      try {
        let existing = null;
        if (row.phone) {
          existing = await db.customer.findFirst({ where: { phone: row.phone } });
        }
        if (!existing && row.email) {
          existing = await db.customer.findFirst({ where: { email: row.email } });
        }
        if (existing) {
          await db.customer.update({
            where: { id: existing.id },
            data: {
              name: row.name,
              nameKana: row.nameKana ?? existing.nameKana,
              phone: row.phone ?? existing.phone,
              email: row.email ?? existing.email,
              birthday: row.birthday ?? existing.birthday,
              gender: row.gender ?? existing.gender,
              firstVisitDate: row.firstVisitDate ?? existing.firstVisitDate,
              lastVisitDate: row.lastVisitDate ?? existing.lastVisitDate,
              visitCount: Math.max(row.visitCount, existing.visitCount),
              totalSpent: Math.max(row.totalSpent, existing.totalSpent),
              notes: row.notes ?? existing.notes,
            },
          });
          updated++;
        } else {
          await db.customer.create({
            data: {
              salonId: salon.id,
              name: row.name,
              nameKana: row.nameKana,
              phone: row.phone,
              email: row.email,
              birthday: row.birthday,
              gender: row.gender,
              source: 'hotpepper', // HPB 由来とみなす
              firstVisitDate: row.firstVisitDate,
              lastVisitDate: row.lastVisitDate,
              visitCount: row.visitCount,
              totalSpent: row.totalSpent,
              notes: row.notes,
            },
          });
          created++;
        }
      } catch (e) {
        console.error('[customer import] row failed:', e);
        skipped++;
      }
    }

    return NextResponse.json({
      ok: true,
      total: parsed.rows.length + skipped,
      created,
      updated,
      skipped,
    });
  } catch (err) {
    console.error('[customer import] fatal:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'サーバーエラー' },
      { status: 500 },
    );
  }
}
