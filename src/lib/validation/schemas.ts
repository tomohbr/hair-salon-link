// 全 Server Action / API で共有する Zod スキーマ
import { z } from 'zod';

/* ─────── primitives ─────── */
export const nonEmpty = z.string().trim().min(1);
export const optionalStr = z.string().trim().optional().transform((v) => v || undefined);
export const email = z.string().trim().toLowerCase().email('メールアドレスの形式が正しくありません');
export const phone = z.string().trim().regex(/^[\d\-\+\(\)\s]+$/, '電話番号の形式が正しくありません').optional().or(z.literal(''));
export const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日付形式: YYYY-MM-DD');
export const timeStr = z.string().regex(/^\d{2}:\d{2}$/, '時刻形式: HH:MM');
export const intStr = z.union([z.string(), z.number()]).transform((v) => {
  const n = parseInt(String(v).replace(/[^\d-]/g, ''), 10);
  return isNaN(n) ? 0 : n;
});
export const positiveInt = intStr.refine((n) => n >= 0, '0 以上で入力してください');

/* ─────── customer ─────── */
export const customerCreateSchema = z.object({
  name: nonEmpty.min(1).max(64),
  nameKana: z.string().trim().max(64).optional(),
  phone: z.string().trim().max(32).optional(),
  email: z.string().trim().email().optional().or(z.literal('')),
  source: z.enum(['hotpepper', 'line', 'web', 'phone', 'referral', 'walk-in', 'other']).default('other'),
  notes: z.string().trim().max(2000).optional(),
});

/* ─────── menu ─────── */
export const menuCreateSchema = z.object({
  name: nonEmpty.min(1).max(120),
  category: z.string().trim().max(64).default('その他'),
  price: positiveInt,
  durationMinutes: intStr.refine((n) => n > 0, '所要時間は 1 分以上で入力してください'),
  description: z.string().trim().max(500).optional(),
  isActive: z.boolean().default(true),
});

/* ─────── coupon ─────── */
export const couponCreateSchema = z.object({
  title: nonEmpty.min(1).max(80),
  description: z.string().trim().max(500).optional(),
  discountType: z.enum(['percent', 'yen']),
  discountValue: intStr.refine((n) => n > 0, '割引額は 1 以上で入力してください'),
  minPurchase: intStr.default(0),
  maxUses: intStr.default(0),
  validUntil: dateStr.optional().or(z.literal('')),
  targetSegment: z.string().trim().default('all'),
}).refine(
  (d) => d.discountType !== 'percent' || d.discountValue <= 100,
  { message: '%割引は 100 以下にしてください', path: ['discountValue'] },
);

/* ─────── product ─────── */
export const productCreateSchema = z.object({
  name: nonEmpty.min(1).max(120),
  category: z.string().trim().max(64).optional(),
  sku: z.string().trim().max(64).optional(),
  stock: positiveInt,
  minStock: positiveInt,
  unitCost: positiveInt,
  retailPrice: intStr.optional().or(z.literal('')),
  supplier: z.string().trim().max(120).optional(),
  unit: z.string().trim().max(16).default('個'),
});

/* ─────── business hours ─────── */
const dayHoursSchema = z.object({
  open: timeStr,
  close: timeStr,
  is_closed: z.boolean().default(false),
  break_start: timeStr.optional(),
  break_end: timeStr.optional(),
});
export const businessHoursSchema = z.object({
  mon: dayHoursSchema.optional(),
  tue: dayHoursSchema.optional(),
  wed: dayHoursSchema.optional(),
  thu: dayHoursSchema.optional(),
  fri: dayHoursSchema.optional(),
  sat: dayHoursSchema.optional(),
  sun: dayHoursSchema.optional(),
  _holidays: z.array(dateStr).default([]),
  _slot_interval: z.number().int().positive().default(30),
  _buffer_minutes: z.number().int().min(0).default(0),
});

/* ─────── payment ─────── */
export const paymentMethodEnum = z.enum(['cash', 'credit', 'qr', 'coin', 'point', 'other']);
export const paymentRecordSchema = z.object({
  id: nonEmpty,
  paymentMethod: paymentMethodEnum,
  paidAmount: positiveInt,
  retailAmount: positiveInt.default(0),
  tip: positiveInt.default(0),
});

/* ─────── reservation ─────── */
export const reservationSchema = z.object({
  date: dateStr,
  startTime: timeStr,
  endTime: timeStr,
  customerId: nonEmpty.optional(),
  menuId: nonEmpty.optional(),
  menuName: z.string().trim().max(120),
  menuPrice: positiveInt,
  source: z.enum(['web', 'line', 'hotpepper', 'phone', 'manual', 'walk-in', 'other']).default('web'),
  notes: z.string().trim().max(2000).optional(),
});

/* ─────── auth ─────── */
export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'パスワードを入力してください'),
});
export const registerSchema = z.object({
  salonName: nonEmpty.min(1).max(120),
  email,
  password: z.string().min(8, 'パスワードは 8 文字以上で入力してください'),
  name: nonEmpty.min(1).max(64),
  plan: z.enum(['free', 'standard', 'pro']).default('standard'),
});

/* ─────── helper ─────── */
export type FormDataLike = FormData | Record<string, FormDataEntryValue | null>;

export function zodParseFormData<T>(
  schema: z.ZodType<T>,
  fd: FormDataLike,
): { ok: true; data: T } | { ok: false; error: string; issues: z.ZodIssue[] } {
  const record: Record<string, string | number | boolean | undefined> = {};
  const iterable = fd instanceof FormData ? fd.entries() : Object.entries(fd);
  for (const [k, v] of iterable) {
    if (v === null || v === undefined) continue;
    if (v instanceof File) continue;
    const val = String(v);
    // checkbox: form-data has 'on' → true
    if (val === 'on') record[k] = true;
    else record[k] = val;
  }
  const parsed = schema.safeParse(record);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { ok: false, error: first?.message || '入力に誤りがあります', issues: parsed.error.issues };
  }
  return { ok: true, data: parsed.data };
}
