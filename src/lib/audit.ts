import { prisma } from './db';
import { headers } from 'next/headers';

export interface AuditEvent {
  salonId: string;
  actorId?: string | null;
  actorName?: string | null;
  action: string;          // 'customer.create' | 'reservation.delete' | ...
  targetType?: string;
  targetId?: string;
  diff?: Record<string, unknown>;
}

/** Server Action / API から呼ぶ監査ログ */
export async function audit(ev: AuditEvent) {
  try {
    let ip: string | null = null;
    let ua: string | null = null;
    try {
      const h = await headers();
      ip = h.get('x-forwarded-for')?.split(',')[0].trim() || h.get('x-real-ip') || null;
      ua = h.get('user-agent') || null;
    } catch {
      // headers() is not available in all contexts; swallow
    }

    await prisma.auditLog.create({
      data: {
        salonId: ev.salonId,
        actorId: ev.actorId ?? null,
        actorName: ev.actorName ?? null,
        action: ev.action,
        targetType: ev.targetType,
        targetId: ev.targetId,
        diff: ev.diff as object | undefined,
        ip, userAgent: ua,
      },
    });
  } catch (err) {
    // 監査ログ記録失敗が本フローを止めないようにする
    console.error('[audit]', err);
  }
}
