/**
 * HPB (Hot Pepper Beauty) 予約確定メール パーサ
 *
 * HPB から salon 宛に届く「予約が入りました / 予約確定 / 予約変更 / キャンセル」メールを
 * 取り込んで HairSalonLink の Reservation に変換する。
 *
 * HPB のメールフォーマットは複数パターンあるため、日本語ラベルをヒントに柔軟にマッチ。
 */

export type HpbEventKind = 'new' | 'change' | 'cancel';

export interface ParsedHpbBooking {
  kind: HpbEventKind;
  externalId?: string;    // HPB 予約番号 (あれば)
  date: string;           // YYYY-MM-DD
  startTime: string;      // HH:MM
  endTime: string;        // HH:MM
  menuName: string;
  menuPrice?: number;
  customerName: string;
  customerNameKana?: string;
  customerPhone?: string;
  customerEmail?: string;
  notes?: string;
  raw: string;
}

/** 全角数字を半角に */
function normalizeDigits(s: string): string {
  return s.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0));
}

/** "2026年4月25日" / "2026/04/25" / "2026-4-25" 等を YYYY-MM-DD に */
function parseDate(s: string): string | null {
  const t = normalizeDigits(s);
  const m = t.match(/(\d{4})[年\-/.](\d{1,2})[月\-/.](\d{1,2})/);
  if (!m) return null;
  return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`;
}

/** "14時30分" / "14:30" / "14時" 等を HH:MM に */
function parseTime(s: string): string | null {
  const t = normalizeDigits(s);
  const m = t.match(/(\d{1,2})[:時](\d{0,2})/);
  if (!m) return null;
  return `${m[1].padStart(2, '0')}:${(m[2] || '0').padStart(2, '0')}`;
}

/** 時間文字列に 分 を加算 */
function addMinutes(hhmm: string, minutes: number): string {
  const [h, m] = hhmm.split(':').map(Number);
  const total = h * 60 + m + minutes;
  const hh = Math.floor(total / 60) % 24;
  const mm = total % 60;
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

/** メール本文内から {ラベル}:値 形式を 1 件抜く */
function extractField(body: string, patterns: RegExp[]): string {
  for (const re of patterns) {
    const m = body.match(re);
    if (m && m[1]) return m[1].trim();
  }
  return '';
}

/** メール全体を走査して含まれる予約を全て抽出（1通に複数件あるケースも） */
export function parseHpbEmail(raw: string): ParsedHpbBooking[] {
  if (!raw || typeof raw !== 'string') return [];

  const body = raw.replace(/\r\n/g, '\n');

  // イベント種別を判定
  let kind: HpbEventKind = 'new';
  if (/キャンセル|取消|取り消し|cancel/i.test(body)) kind = 'cancel';
  else if (/変更|更新|修正|change|update/i.test(body)) kind = 'change';

  // 予約番号（HPB 特有の英数字ID）
  const externalId = extractField(body, [
    /予約番号[\s::]+([A-Za-z0-9\-]+)/,
    /ID[\s::]+([A-Za-z0-9\-]+)/,
    /予約ID[\s::]+([A-Za-z0-9\-]+)/,
  ]) || undefined;

  // 日付
  const dateRaw = extractField(body, [
    /(?:ご|ご?)予約日時?[\s::]*([^\n]+)/,
    /来店日時?[\s::]*([^\n]+)/,
    /日時[\s::]*([^\n]+)/,
  ]);
  const date = dateRaw ? parseDate(dateRaw) : null;

  // 時刻
  let startTime: string | null = null;
  let endTime: string | null = null;
  const timeMatch = dateRaw.match(/(\d{1,2}[:時]\d{0,2})\s*[〜~\-]\s*(\d{1,2}[:時]\d{0,2})/);
  if (timeMatch) {
    startTime = parseTime(timeMatch[1]);
    endTime = parseTime(timeMatch[2]);
  } else {
    const singleTime = extractField(body, [
      /開始(?:時刻|時間)[\s::]*([0-9:時分]+)/,
      /予約時間[\s::]*([0-9:時分]+)/,
    ]);
    if (singleTime) startTime = parseTime(singleTime);
    const endRaw = extractField(body, [
      /終了(?:時刻|時間)[\s::]*([0-9:時分]+)/,
    ]);
    if (endRaw) endTime = parseTime(endRaw);
  }
  if (!startTime) {
    // 日付セルに続く時間表記 "14:00〜16:00" を別ラインから探す
    const t2 = body.match(/(\d{1,2}:\d{2})\s*[〜~\-]\s*(\d{1,2}:\d{2})/);
    if (t2) { startTime = t2[1]; endTime = t2[2]; }
  }

  // メニュー
  const menuName = extractField(body, [
    /(?:ご)?予約メニュー[\s::]*([^\n]+)/,
    /施術(?:内容|メニュー)[\s::]*([^\n]+)/,
    /メニュー名?[\s::]*([^\n]+)/,
    /コース[\s::]*([^\n]+)/,
  ]);

  // 金額
  const priceRaw = extractField(body, [
    /(?:ご)?合計(?:金額)?[\s::]*¥?([\d,]+)/,
    /料金[\s::]*¥?([\d,]+)/,
    /金額[\s::]*¥?([\d,]+)/,
  ]);
  const menuPrice = priceRaw ? parseInt(priceRaw.replace(/[^\d]/g, ''), 10) : undefined;

  // 所要時間
  const durationRaw = extractField(body, [
    /所要時間[\s::]*([0-9]+)\s*分/,
    /施術時間[\s::]*([0-9]+)\s*分/,
  ]);
  const durationMinutes = durationRaw ? parseInt(durationRaw, 10) : undefined;

  // 開始のみで終了が無ければ 60 分 (or duration) を加算
  if (startTime && !endTime) {
    endTime = addMinutes(startTime, durationMinutes || 60);
  }

  // 顧客
  const customerName = extractField(body, [
    /(?:お)?名前[\s::]*([^\n様]+?)\s*様?/,
    /お客様(?:名)?[\s::]*([^\n様]+?)\s*様?/,
    /顧客名[\s::]*([^\n様]+?)\s*様?/,
  ]).replace(/様$/, '').trim();

  const customerNameKana = extractField(body, [
    /フリガナ[\s::]*([^\n]+)/,
    /カナ[\s::]*([^\n]+)/,
  ]) || undefined;

  const customerPhone = extractField(body, [
    /電話番号[\s::]*([0-9\-\(\)\s\+]+)/,
    /TEL[\s::]*([0-9\-\(\)\s\+]+)/,
    /携帯[\s::]*([0-9\-\(\)\s\+]+)/,
  ]).replace(/[^\d\-]/g, '') || undefined;

  const customerEmail = extractField(body, [
    /メール[\s::]*([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/,
    /e?-?mail[\s::]*([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/i,
  ]) || undefined;

  const notes = extractField(body, [
    /(?:お客様|ご)?(?:メモ|要望|備考|コメント)[\s::]*([^\n]+(?:\n(?!■|●|【)[^\n]+)*)/,
  ]) || undefined;

  // 最小限の情報が揃わなければ空返却
  if (!date || !startTime || !customerName || !menuName) return [];

  const booking: ParsedHpbBooking = {
    kind,
    externalId,
    date,
    startTime,
    endTime: endTime || addMinutes(startTime, 60),
    menuName: menuName.trim(),
    menuPrice,
    customerName,
    customerNameKana,
    customerPhone,
    customerEmail,
    notes,
    raw,
  };

  return [booking];
}
