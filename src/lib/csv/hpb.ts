// ホットペッパービューティー (HPB) ほか CSV の取込／書出ユーティリティ
//
// HPB・SalonBoard・独自システムによってフォーマットが違うので、
// ヘッダー名の日本語/英語エイリアスで柔軟に認識する。
//
// 対応エンティティ: customers（顧客）, menus（メニュー）, coupons（クーポン）

import { parseCSV } from '@/lib/csvImport';

/** ─────────────────────────────────────────────
 * ヘッダーエイリアス定義
 * ─────────────────────────────────────────────*/

const CUSTOMER_ALIASES: Record<string, string[]> = {
  name: ['顧客名', 'お客様名', '氏名', '名前', 'name', 'customer_name', 'お名前'],
  nameKana: ['フリガナ', 'カナ', 'よみがな', 'kana', 'furigana', '顧客名カナ'],
  phone: ['電話番号', '電話', 'TEL', 'tel', 'phone', '携帯番号', 'モバイル'],
  email: ['メール', 'メールアドレス', 'Email', 'email', 'mail'],
  birthday: ['誕生日', '生年月日', 'birthday', '誕生月日'],
  gender: ['性別', 'gender', 'sex'],
  firstVisitDate: ['初回来店日', '初回来店', '初来店日', 'first_visit'],
  lastVisitDate: ['最終来店日', '前回来店日', '最終来店', 'last_visit'],
  visitCount: ['来店回数', '累計来店数', '来店数', 'visit_count', 'visits'],
  totalSpent: ['累計金額', '累計売上', '総額', 'total_spent', '合計金額'],
  notes: ['メモ', '備考', 'notes', 'memo', 'コメント'],
};

const MENU_ALIASES: Record<string, string[]> = {
  name: ['メニュー名', 'メニュー', 'name', '施術名', '商品名', 'item', 'menu_name'],
  category: ['カテゴリ', 'カテゴリー', 'category', '分類', '種別'],
  price: ['料金', '金額', '価格', 'price', '税込金額', '税抜金額'],
  durationMinutes: ['所要時間', '施術時間', 'duration', 'duration_minutes', '時間(分)', '分'],
  description: ['説明', '詳細', 'description', 'desc', 'メニュー説明'],
  isActive: ['公開', '有効', 'active', 'is_active', '表示'],
};

const COUPON_ALIASES: Record<string, string[]> = {
  title: ['クーポン名', 'タイトル', '名称', 'title', 'coupon_name'],
  description: ['説明', '内容', '詳細', 'description', 'コメント'],
  discountType: ['割引種別', '種別', 'type', 'discount_type'],
  discountValue: ['割引額', '値引額', '金額', 'discount', 'discount_value', '割引'],
  minPurchase: ['最低金額', '最低利用', 'min', 'min_purchase', '対象金額'],
  maxUses: ['利用上限', '上限', 'max_uses', '回数制限'],
  validUntil: ['有効期限', '期限', 'valid_until', 'expires', '期間終了日'],
};

/** ヘッダー名から正規化された値を取り出す */
function pick(row: Record<string, string>, aliases: string[]): string {
  for (const key of Object.keys(row)) {
    const k = key.trim().toLowerCase();
    for (const a of aliases) {
      if (k === a.trim().toLowerCase()) return (row[key] ?? '').trim();
    }
  }
  return '';
}

/** 数値に変換。空/不正は 0 を返す */
function toInt(s: string): number {
  if (!s) return 0;
  const n = parseInt(s.replace(/[^\d-]/g, ''), 10);
  return isNaN(n) ? 0 : n;
}

/** 日付文字列を YYYY-MM-DD 形式に正規化。解釈不能なら空 */
function normalizeDate(s: string): string {
  if (!s) return '';
  const v = s.trim().replace(/[/\.]/g, '-');
  const m = v.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) {
    return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`;
  }
  return '';
}

/** ─────────────────────────────────────────────
 * Customers
 * ─────────────────────────────────────────────*/

export interface CustomerRow {
  name: string;
  nameKana?: string;
  phone?: string;
  email?: string;
  birthday?: string;
  gender?: string;
  firstVisitDate?: string;
  lastVisitDate?: string;
  visitCount: number;
  totalSpent: number;
  notes?: string;
  _raw?: Record<string, string>;
  _errors?: string[];
}

export function parseCustomersCsv(text: string): {
  rows: CustomerRow[];
  totalLines: number;
  skipped: number;
  errors: string[];
} {
  const raw = parseCSV(text);
  const rows: CustomerRow[] = [];
  const errors: string[] = [];
  let skipped = 0;

  for (let i = 0; i < raw.length; i++) {
    const r = raw[i];
    const name = pick(r, CUSTOMER_ALIASES.name);
    if (!name) {
      skipped++;
      continue;
    }
    rows.push({
      name,
      nameKana: pick(r, CUSTOMER_ALIASES.nameKana) || undefined,
      phone: pick(r, CUSTOMER_ALIASES.phone) || undefined,
      email: pick(r, CUSTOMER_ALIASES.email) || undefined,
      birthday: pick(r, CUSTOMER_ALIASES.birthday) || undefined,
      gender: pick(r, CUSTOMER_ALIASES.gender) || undefined,
      firstVisitDate: normalizeDate(pick(r, CUSTOMER_ALIASES.firstVisitDate)) || undefined,
      lastVisitDate: normalizeDate(pick(r, CUSTOMER_ALIASES.lastVisitDate)) || undefined,
      visitCount: toInt(pick(r, CUSTOMER_ALIASES.visitCount)),
      totalSpent: toInt(pick(r, CUSTOMER_ALIASES.totalSpent)),
      notes: pick(r, CUSTOMER_ALIASES.notes) || undefined,
      _raw: r,
    });
  }
  return { rows, totalLines: raw.length, skipped, errors };
}

/** ─────────────────────────────────────────────
 * Menus
 * ─────────────────────────────────────────────*/

export interface MenuRow {
  name: string;
  category?: string;
  price: number;
  durationMinutes: number;
  description?: string;
  isActive: boolean;
}

export function parseMenusCsv(text: string): {
  rows: MenuRow[];
  skipped: number;
} {
  const raw = parseCSV(text);
  const rows: MenuRow[] = [];
  let skipped = 0;
  for (const r of raw) {
    const name = pick(r, MENU_ALIASES.name);
    if (!name) { skipped++; continue; }
    const activeStr = pick(r, MENU_ALIASES.isActive);
    const isActive = activeStr
      ? /^(1|true|yes|公開|表示|ON|有効|○)$/i.test(activeStr)
      : true;
    rows.push({
      name,
      category: pick(r, MENU_ALIASES.category) || 'その他',
      price: toInt(pick(r, MENU_ALIASES.price)),
      durationMinutes: toInt(pick(r, MENU_ALIASES.durationMinutes)) || 60,
      description: pick(r, MENU_ALIASES.description) || undefined,
      isActive,
    });
  }
  return { rows, skipped };
}

/** ─────────────────────────────────────────────
 * Coupons
 * ─────────────────────────────────────────────*/

export interface CouponRow {
  title: string;
  description?: string;
  discountType: 'percent' | 'yen';
  discountValue: number;
  minPurchase: number;
  maxUses: number;
  validUntil?: string;
}

export function parseCouponsCsv(text: string): {
  rows: CouponRow[];
  skipped: number;
} {
  const raw = parseCSV(text);
  const rows: CouponRow[] = [];
  let skipped = 0;
  for (const r of raw) {
    const title = pick(r, COUPON_ALIASES.title);
    if (!title) { skipped++; continue; }
    const rawType = pick(r, COUPON_ALIASES.discountType);
    const rawValue = pick(r, COUPON_ALIASES.discountValue);
    // 「1000円」「10%」など柔軟に判定
    let discountType: 'percent' | 'yen' = 'yen';
    if (/percent|%|パーセント|％/.test(rawType) || /%|％/.test(rawValue)) {
      discountType = 'percent';
    }
    rows.push({
      title,
      description: pick(r, COUPON_ALIASES.description) || undefined,
      discountType,
      discountValue: toInt(rawValue),
      minPurchase: toInt(pick(r, COUPON_ALIASES.minPurchase)),
      maxUses: toInt(pick(r, COUPON_ALIASES.maxUses)),
      validUntil: normalizeDate(pick(r, COUPON_ALIASES.validUntil)) || undefined,
    });
  }
  return { rows, skipped };
}

/** ─────────────────────────────────────────────
 * Export (CSV 書出)
 * BOM 付き UTF-8 で Excel 互換
 * ─────────────────────────────────────────────*/

function escapeCsv(v: string | number | null | undefined): string {
  if (v === null || v === undefined) return '';
  const s = String(v);
  if (/[",\n\r]/.test(s)) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

export function toCsv(headers: string[], rows: (string | number | null | undefined)[][]): string {
  const head = headers.join(',');
  const body = rows.map((r) => r.map(escapeCsv).join(',')).join('\n');
  return '\uFEFF' + head + '\n' + body + '\n';
}
