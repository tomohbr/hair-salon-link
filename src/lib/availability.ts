// 空き枠エンジン - HPB・LINE・自社HPすべてが参照する単一の空き枠計算ロジック
//
// すべての予約は source に関係なく同じ `reservations` テーブルに格納され、
// この関数がその全予約を参照して空き枠を算出する。
// → HPB で埋まった枠は LINE / 自社HP でも「予約不可」と表示される。

import { prisma } from './db';

/**
 * 1日ごとの営業設定
 * - is_closed: 定休日フラグ
 * - break_start / break_end: 昼休み等の施術不可時間帯
 */
export interface DayHours {
  open: string;
  close: string;
  is_closed: boolean;
  break_start?: string;
  break_end?: string;
}

/**
 * 営業時間設定オブジェクト全体
 * - mon〜sun: 曜日別の営業時間
 * - _holidays: 臨時休業日（YYYY-MM-DD の配列）
 * - _slot_interval: 予約枠の刻み幅（分）
 * - _buffer_minutes: 予約と予約の間に挟むバッファ時間（分）
 */
export interface BusinessHoursMap {
  mon?: DayHours;
  tue?: DayHours;
  wed?: DayHours;
  thu?: DayHours;
  fri?: DayHours;
  sat?: DayHours;
  sun?: DayHours;
  _holidays?: string[];
  _slot_interval?: number;
  _buffer_minutes?: number;
}

const DEFAULT_HOURS: BusinessHoursMap = {
  mon: { open: '10:00', close: '20:00', is_closed: false },
  tue: { open: '10:00', close: '20:00', is_closed: false },
  wed: { open: '10:00', close: '20:00', is_closed: true },
  thu: { open: '10:00', close: '20:00', is_closed: false },
  fri: { open: '10:00', close: '20:00', is_closed: false },
  sat: { open: '09:00', close: '19:00', is_closed: false },
  sun: { open: '09:00', close: '19:00', is_closed: false },
  _holidays: [],
  _slot_interval: 30,
  _buffer_minutes: 0,
};

const DOW_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;
export type DowKey = typeof DOW_KEYS[number];

export interface Slot {
  time: string; // "HH:MM"
  available: boolean;
  reason?: 'booked' | 'closed' | 'past' | 'holiday' | 'break';
  bookedBy?: { source: string; customerName: string | null };
}

export function parseBusinessHours(raw: unknown): BusinessHoursMap {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_HOURS };
  const obj = raw as BusinessHoursMap;
  // 曜日キーが一つも無い場合はデフォルトを返す
  const hasAny = !!(obj.mon || obj.tue || obj.wed || obj.thu || obj.fri || obj.sat || obj.sun);
  if (!hasAny) return { ...DEFAULT_HOURS, ...obj };
  // 各曜日を補完（欠落曜日にデフォルト値を入れる）
  const out: BusinessHoursMap = {
    mon: obj.mon ?? DEFAULT_HOURS.mon,
    tue: obj.tue ?? DEFAULT_HOURS.tue,
    wed: obj.wed ?? DEFAULT_HOURS.wed,
    thu: obj.thu ?? DEFAULT_HOURS.thu,
    fri: obj.fri ?? DEFAULT_HOURS.fri,
    sat: obj.sat ?? DEFAULT_HOURS.sat,
    sun: obj.sun ?? DEFAULT_HOURS.sun,
    _holidays: Array.isArray(obj._holidays) ? obj._holidays : [],
    _slot_interval: obj._slot_interval && obj._slot_interval > 0 ? obj._slot_interval : 30,
    _buffer_minutes: typeof obj._buffer_minutes === 'number' ? obj._buffer_minutes : 0,
  };
  return out;
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}
function toHHMM(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * 指定日の空き枠を算出
 */
export async function getAvailableSlots(
  salonId: string,
  date: string,
  durationMin: number,
  slotInterval?: number,
): Promise<Slot[]> {
  const salon = await prisma.salon.findUnique({
    where: { id: salonId },
    select: { businessHours: true },
  });
  if (!salon) return [];

  const hours = parseBusinessHours(salon.businessHours);
  const d = new Date(date + 'T00:00:00');
  const dowKey = DOW_KEYS[d.getDay()];
  const dayHours = hours[dowKey];

  // 臨時休業日チェック
  if ((hours._holidays || []).includes(date)) {
    return [{ time: '--:--', available: false, reason: 'holiday' }];
  }
  // 定休日
  if (!dayHours || dayHours.is_closed) {
    return [{ time: '--:--', available: false, reason: 'closed' }];
  }

  // 実際に使う刻み幅とバッファ
  const interval = slotInterval ?? hours._slot_interval ?? 30;
  const buffer = hours._buffer_minutes ?? 0;

  // 予約取得
  const reservations = await prisma.reservation.findMany({
    where: { salonId, date, status: { in: ['pending', 'confirmed', 'completed'] } },
    include: { customer: { select: { name: true } } },
  });

  const openMin = toMinutes(dayHours.open);
  const closeMin = toMinutes(dayHours.close);
  const breakStart = dayHours.break_start ? toMinutes(dayHours.break_start) : -1;
  const breakEnd = dayHours.break_end ? toMinutes(dayHours.break_end) : -1;
  const nowMin = isToday(date) ? new Date().getHours() * 60 + new Date().getMinutes() : -1;

  const slots: Slot[] = [];
  for (let t = openMin; t + durationMin <= closeMin; t += interval) {
    const slotEnd = t + durationMin;
    const time = toHHMM(t);

    // 過去枠
    if (nowMin >= 0 && t < nowMin) {
      slots.push({ time, available: false, reason: 'past' });
      continue;
    }

    // 昼休みに重なる枠
    if (breakStart >= 0 && breakEnd > breakStart && t < breakEnd && slotEnd > breakStart) {
      slots.push({ time, available: false, reason: 'break' });
      continue;
    }

    // 既存予約との重複（バッファ含む）
    const conflict = reservations.find((r) => {
      const rs = toMinutes(r.startTime) - buffer;
      const re = toMinutes(r.endTime) + buffer;
      return t < re && slotEnd > rs;
    });

    if (conflict) {
      slots.push({
        time,
        available: false,
        reason: 'booked',
        bookedBy: {
          source: conflict.source,
          customerName: conflict.customer?.name ?? null,
        },
      });
    } else {
      slots.push({ time, available: true });
    }
  }

  return slots;
}

function isToday(date: string): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return date === today;
}

/**
 * 週の予約グリッド（管理画面の週カレンダー用）
 */
export async function getWeekCalendar(salonId: string, startDate: string) {
  const salon = await prisma.salon.findUnique({
    where: { id: salonId },
    select: { businessHours: true },
  });
  const hours = parseBusinessHours(salon?.businessHours);

  const start = new Date(startDate + 'T00:00:00');
  const days: {
    date: string;
    dow: string;
    hours: { open: string; close: string; closed: boolean; break_start?: string; break_end?: string };
    reservations: Array<{
      id: string; startTime: string; endTime: string;
      menuName: string | null; source: string; customerName: string | null;
    }>;
  }[] = [];

  const dateStrs: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dateStrs.push(d.toISOString().slice(0, 10));
  }

  const allRes = await prisma.reservation.findMany({
    where: { salonId, date: { in: dateStrs }, status: { in: ['pending', 'confirmed', 'completed'] } },
    include: { customer: { select: { name: true } } },
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
  });

  const holidays = new Set(hours._holidays || []);

  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    const dowKey = DOW_KEYS[d.getDay()];
    const dh = hours[dowKey];
    const isHoliday = holidays.has(dateStr);
    days.push({
      date: dateStr,
      dow: ['日', '月', '火', '水', '木', '金', '土'][d.getDay()],
      hours: {
        open: dh?.open ?? '10:00',
        close: dh?.close ?? '20:00',
        closed: isHoliday || (dh?.is_closed ?? false),
        break_start: dh?.break_start,
        break_end: dh?.break_end,
      },
      reservations: allRes
        .filter((r) => r.date === dateStr)
        .map((r) => ({
          id: r.id,
          startTime: r.startTime,
          endTime: r.endTime,
          menuName: r.menuName,
          source: r.source,
          customerName: r.customer?.name ?? null,
        })),
    });
  }
  return days;
}
