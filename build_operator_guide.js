// HairSalonLink 営業員向け LINE 初回設定代行マニュアル.pptx
const pptxgen = require('pptxgenjs');

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.title = 'HairSalonLink LINE初回設定代行マニュアル（営業員向け）';
pres.author = 'HairSalonLink';

// ── Brand palette ──
const BG_DARK = '0c0a09';
const BG_ALT = '120e0c';
const PAPER = 'faf7f2';
const PAPER_ALT = 'f1ece3';
const BORDER = 'd9d1bf';
const INK = '1c1917';
const INK_MUTED = '6b5f52';
const BRAND = 'c9a96e';
const BRAND_DEEP = '9c7a4a';
const LINE_GREEN = '06c755';
const ACCENT_RED = 'b85042';
const SUCCESS = '166534';
const WARN = 'b45309';

const FONT_JP_SERIF = 'Yu Mincho';
const FONT_JP = 'Yu Gothic';
const FONT_JP_B = 'Yu Gothic';

const TOTAL_SLIDES = 11;

const makeShadow = () => ({
  type: 'outer', blur: 10, offset: 2, angle: 135, color: '000000', opacity: 0.12,
});

function addHeader(slide, section, no) {
  slide.addText(section, {
    x: 0.6, y: 0.28, w: 7, h: 0.3, fontSize: 10, color: BRAND,
    fontFace: FONT_JP_B, charSpacing: 6, bold: true, margin: 0,
  });
  slide.addText(`${no} / ${TOTAL_SLIDES}`, {
    x: 8.6, y: 0.28, w: 0.8, h: 0.3, fontSize: 9, color: INK_MUTED,
    fontFace: FONT_JP, align: 'right', margin: 0,
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 0.6, w: 8.8, h: 0.012, fill: { color: BORDER }, line: { color: BORDER, width: 0 },
  });
}
function addFooter(slide) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 5.35, w: 8.8, h: 0.012, fill: { color: BORDER }, line: { color: BORDER, width: 0 },
  });
  slide.addText('HairSalonLink — LINE 初回設定代行マニュアル（社内限定）', {
    x: 0.6, y: 5.42, w: 6, h: 0.2, fontSize: 9, color: INK_MUTED,
    fontFace: FONT_JP, margin: 0,
  });
  slide.addText('v1.0 / 営業員用', {
    x: 6.6, y: 5.42, w: 2.8, h: 0.2, fontSize: 9, color: INK_MUTED,
    fontFace: FONT_JP, align: 'right', margin: 0,
  });
}
function numBadge(slide, x, y, num, color = BRAND, size = 0.36) {
  slide.addShape(pres.shapes.OVAL, {
    x, y, w: size, h: size,
    fill: { color }, line: { color, width: 0 },
  });
  slide.addText(String(num), {
    x, y, w: size, h: size, fontSize: 13, bold: true,
    color: BG_DARK, align: 'center', valign: 'middle',
    fontFace: FONT_JP_B, margin: 0,
  });
}

// ====================================================================
// Slide 1 — Cover
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: BG_DARK };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 0.7, w: 0.04, h: 0.9,
    fill: { color: BRAND }, line: { color: BRAND, width: 0 },
  });
  s.addText('HAIR SALON LINK — INTERNAL', {
    x: 1.0, y: 0.7, w: 6, h: 0.35, fontSize: 11, color: BRAND,
    charSpacing: 14, bold: true, fontFace: FONT_JP_B, margin: 0,
  });
  s.addText('for Sales Staff Only', {
    x: 1.0, y: 1.05, w: 6, h: 0.35, fontSize: 10, color: 'a89988',
    charSpacing: 6, fontFace: FONT_JP, italic: true, margin: 0,
  });

  s.addText('LINE 初回設定', {
    x: 0.8, y: 1.85, w: 8.4, h: 1.0, fontSize: 50, bold: true,
    color: 'ebe1cf', fontFace: FONT_JP_SERIF, margin: 0,
  });
  s.addText('代行マニュアル', {
    x: 0.8, y: 2.7, w: 8.4, h: 0.9, fontSize: 48, bold: true,
    color: BRAND, fontFace: FONT_JP_SERIF, margin: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 3.85, w: 3.5, h: 0.015,
    fill: { color: BRAND }, line: { color: BRAND, width: 0 },
  });

  s.addText([
    { text: '商談先オーナーが PC を持たない前提で、', options: { breakLine: true, color: 'ebe1cf' } },
    { text: '営業員が事前に LINE 初回設定を代行するための手順書。', options: { color: 'a89988' } },
  ], {
    x: 0.8, y: 4.0, w: 8.4, h: 0.8, fontSize: 14,
    fontFace: FONT_JP, lineSpacingMultiple: 1.4, margin: 0,
  });

  s.addText('⚠ 本資料は社外持ち出し禁止。顧客に配布しない。', {
    x: 0.8, y: 4.95, w: 8.4, h: 0.25, fontSize: 10,
    color: ACCENT_RED, fontFace: FONT_JP, italic: true, margin: 0,
  });
}

// ====================================================================
// Slide 2 — Overall flow
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  addHeader(s, 'OVERVIEW — 全体フロー', 2);
  addFooter(s);

  s.addText('商談 3 フェーズの役割分担', {
    x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 28, bold: true,
    color: INK, fontFace: FONT_JP_SERIF, margin: 0,
  });

  const phases = [
    {
      label: '事前（商談前日まで）',
      who: '営業員（あなた）',
      place: '自宅 / オフィスの PC',
      tasks: ['LINE公式アカウント開設', 'Messaging APIチャネル作成', 'Channel Secret / Token 取得', 'Webhook URL を LINE に登録'],
      color: BRAND,
    },
    {
      label: '当日（商談中）',
      who: 'オーナー + 営業員',
      place: '商談先 / スマホ',
      tasks: ['HairSalonLink 新規登録（Free）', '設定画面に 3 つの値を貼付け', '接続テスト → 緑✅確認', '友だち追加して動作確認'],
      color: LINE_GREEN,
    },
    {
      label: '事後（契約後）',
      who: 'オーナー',
      place: 'スマホのみ',
      tasks: ['日常の予約・顧客管理', 'LINE配信・クーポン発行', '応答メッセージ運用', '追加設定は全てスマホで'],
      color: BRAND_DEEP,
    },
  ];

  const cardY = 1.6;
  const cardH = 3.55;
  const cardW = 2.8;
  phases.forEach((p, i) => {
    const x = 0.6 + i * 2.95;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: cardY, w: cardW, h: cardH,
      fill: { color: 'ffffff' }, line: { color: BORDER, width: 0.5 },
      shadow: makeShadow(),
    });
    // top bar
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: cardY, w: cardW, h: 0.45,
      fill: { color: p.color }, line: { color: p.color, width: 0 },
    });
    s.addText(p.label, {
      x: x + 0.2, y: cardY + 0.08, w: cardW - 0.4, h: 0.3, fontSize: 13, bold: true,
      color: BG_DARK, fontFace: FONT_JP_B, margin: 0,
    });
    s.addText([
      { text: '担当  ', options: { color: INK_MUTED, fontFace: FONT_JP, fontSize: 9 } },
      { text: p.who, options: { color: INK, fontFace: FONT_JP_B, fontSize: 11, bold: true, breakLine: true } },
      { text: '場所  ', options: { color: INK_MUTED, fontFace: FONT_JP, fontSize: 9 } },
      { text: p.place, options: { color: INK, fontFace: FONT_JP_B, fontSize: 11, bold: true } },
    ], {
      x: x + 0.2, y: cardY + 0.55, w: cardW - 0.4, h: 0.7,
      lineSpacingMultiple: 1.5, margin: 0,
    });
    // tasks
    const tasksText = p.tasks.map((t, idx) => ({
      text: `・${t}`,
      options: {
        fontSize: 10.5, color: INK, fontFace: FONT_JP,
        breakLine: idx < p.tasks.length - 1,
      },
    }));
    s.addText(tasksText, {
      x: x + 0.2, y: cardY + 1.4, w: cardW - 0.4, h: cardH - 1.55,
      lineSpacingMultiple: 1.5, margin: 0,
    });
  });
}

// ====================================================================
// Slide 3 — Pre-meeting: things to prepare
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  addHeader(s, 'PREP — 事前に用意する情報', 3);
  addFooter(s);

  s.addText('商談前にオーナーから確認すべき情報', {
    x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 24, bold: true,
    color: INK, fontFace: FONT_JP_SERIF, margin: 0,
  });

  const fieldRows = [
    [
      { text: '項目', options: { bold: true, color: INK, fontFace: FONT_JP_B, fill: { color: PAPER_ALT } } },
      { text: '目的', options: { bold: true, color: INK, fontFace: FONT_JP_B, fill: { color: PAPER_ALT } } },
      { text: '取得タイミング', options: { bold: true, color: INK, fontFace: FONT_JP_B, fill: { color: PAPER_ALT } } },
    ],
    [
      { text: '店舗名（正式・屋号）', options: { color: INK, fontFace: FONT_JP_B } },
      { text: 'LINE公式アカウント名 / チャネル名に使用', options: { color: INK_MUTED, fontFace: FONT_JP } },
      { text: 'アポ取得時', options: { color: INK_MUTED, fontFace: FONT_JP } },
    ],
    [
      { text: 'オーナーのメールアドレス', options: { color: INK, fontFace: FONT_JP_B } },
      { text: 'LINE 公式アカウント / チャネル登録用', options: { color: INK_MUTED, fontFace: FONT_JP } },
      { text: 'アポ取得時', options: { color: INK_MUTED, fontFace: FONT_JP } },
    ],
    [
      { text: 'オーナー個人の LINE ID', options: { color: INK, fontFace: FONT_JP_B } },
      { text: 'OA 管理権限の譲渡先（事後）', options: { color: INK_MUTED, fontFace: FONT_JP } },
      { text: '商談当日', options: { color: INK_MUTED, fontFace: FONT_JP } },
    ],
    [
      { text: '業種（メンズ / レディース 等）', options: { color: INK, fontFace: FONT_JP_B } },
      { text: 'チャネル作成フォームで入力', options: { color: INK_MUTED, fontFace: FONT_JP } },
      { text: 'アポ取得時', options: { color: INK_MUTED, fontFace: FONT_JP } },
    ],
    [
      { text: 'ロゴ画像（任意）', options: { color: INK, fontFace: FONT_JP_B } },
      { text: '公式アカウントのプロフィール画像', options: { color: INK_MUTED, fontFace: FONT_JP } },
      { text: '事前に PNG/JPG で受領', options: { color: INK_MUTED, fontFace: FONT_JP, italic: true } },
    ],
  ];
  s.addTable(fieldRows, {
    x: 0.6, y: 1.65, w: 8.8, colW: [3.0, 3.8, 2.0],
    rowH: 0.45, fontSize: 11,
    border: { pt: 0.4, color: BORDER },
    fill: { color: 'ffffff' },
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 4.7, w: 8.8, h: 0.55,
    fill: { color: PAPER_ALT }, line: { color: BRAND, width: 0.3 },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 4.7, w: 0.08, h: 0.55,
    fill: { color: BRAND }, line: { color: BRAND, width: 0 },
  });
  s.addText('💡 営業員用の専用アドレス（例: line-setup@your-domain.com）で代理登録しておくと、後で権限移譲しやすい。', {
    x: 0.9, y: 4.75, w: 8.35, h: 0.45, fontSize: 11,
    color: INK, fontFace: FONT_JP, valign: 'middle', margin: 0,
  });
}

// ====================================================================
// Slide 4 — Step 1: Create LINE OA (PC)
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  addHeader(s, 'STEP 1 — LINE公式アカウント開設（PC）', 4);
  addFooter(s);

  s.addText('LINE 公式アカウントを開設する', {
    x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 24, bold: true,
    color: INK, fontFace: FONT_JP_SERIF, margin: 0,
  });

  // URL block
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 1.55, w: 8.8, h: 0.65,
    fill: { color: BG_DARK }, line: { color: BRAND, width: 0.5 },
  });
  s.addText('URL', {
    x: 0.85, y: 1.62, w: 0.6, h: 0.5, fontSize: 10, bold: true,
    color: BRAND, fontFace: FONT_JP_B, charSpacing: 4, valign: 'middle', margin: 0,
  });
  s.addText('https://www.linebiz.com/jp/entry/', {
    x: 1.4, y: 1.62, w: 7.9, h: 0.5, fontSize: 14,
    color: 'ebe1cf', fontFace: 'Consolas', valign: 'middle', margin: 0,
  });

  const steps = [
    { t: '1', d: 'PC のブラウザで URL を開き「アカウントを開設する（無料）」をクリック' },
    { t: '2', d: '自分の LINE アカウント（営業用）でログイン' },
    { t: '3', d: 'アカウント名：店舗の正式名称（後で変更可）' },
    { t: '4', d: 'メールアドレス：事前にオーナーから聞いた、または営業側の line-setup@～' },
    { t: '5', d: '業種：美容・ヘルスケア → 美容室' },
    { t: '6', d: '「完了」→ 公式アカウント完成' },
  ];
  steps.forEach((st, i) => {
    const y = 2.45 + i * 0.4;
    numBadge(s, 0.6, y + 0.02, st.t, BRAND, 0.32);
    s.addText(st.d, {
      x: 1.0, y, w: 8.4, h: 0.36, fontSize: 12,
      color: INK, fontFace: FONT_JP, valign: 'middle', margin: 0,
    });
  });

  // warning
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 4.95, w: 8.8, h: 0.32,
    fill: { color: 'fef2f2' }, line: { color: ACCENT_RED, width: 0.3 },
  });
  s.addText('⚠ ログインに使う LINE アカウントは、後でオーナーに譲渡する前提で設定。個人利用アカウント不可。', {
    x: 0.7, y: 4.97, w: 8.6, h: 0.28, fontSize: 10,
    color: ACCENT_RED, fontFace: FONT_JP, valign: 'middle', margin: 0,
  });
}

// ====================================================================
// Slide 5 — Step 2: Messaging API channel in Developers Console
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  addHeader(s, 'STEP 2 — Messaging API チャネル作成', 5);
  addFooter(s);

  s.addText('Developers Console でチャネル作成', {
    x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 24, bold: true,
    color: INK, fontFace: FONT_JP_SERIF, margin: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 1.55, w: 8.8, h: 0.65,
    fill: { color: BG_DARK }, line: { color: BRAND, width: 0.5 },
  });
  s.addText('URL', {
    x: 0.85, y: 1.62, w: 0.6, h: 0.5, fontSize: 10, bold: true,
    color: BRAND, fontFace: FONT_JP_B, charSpacing: 4, valign: 'middle', margin: 0,
  });
  s.addText('https://developers.line.biz/console/', {
    x: 1.4, y: 1.62, w: 7.9, h: 0.5, fontSize: 14,
    color: 'ebe1cf', fontFace: 'Consolas', valign: 'middle', margin: 0,
  });

  const steps = [
    { t: '1', d: 'STEP 1 と同じ LINE アカウントでログイン（初回は開発者登録）' },
    { t: '2', d: 'トップで「プロバイダー」横の「作成」 → 名前：店舗名（例：SALON XYZ）' },
    { t: '3', d: 'プロバイダー内で「Create a new channel」→「Messaging API」選択' },
    { t: '4', d: 'チャネル名：店舗名と同一 / 説明：予約受付・お知らせ' },
    { t: '5', d: '業種：生活関連サービス → 美容・理容' },
    { t: '6', d: 'プライバシー / 利用規約 URL は空欄可 → 同意 →「作成」' },
  ];
  steps.forEach((st, i) => {
    const y = 2.45 + i * 0.4;
    numBadge(s, 0.6, y + 0.02, st.t, BRAND, 0.32);
    s.addText(st.d, {
      x: 1.0, y, w: 8.4, h: 0.36, fontSize: 12,
      color: INK, fontFace: FONT_JP, valign: 'middle', margin: 0,
    });
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 4.95, w: 8.8, h: 0.32,
    fill: { color: PAPER_ALT }, line: { color: BRAND, width: 0.3 },
  });
  s.addText('💡 チャネル作成と同時に「Messaging API専用の公式アカウント」が1つ自動生成される。', {
    x: 0.7, y: 4.97, w: 8.6, h: 0.28, fontSize: 10,
    color: BRAND_DEEP, fontFace: FONT_JP, valign: 'middle', margin: 0,
  });
}

// ====================================================================
// Slide 6 — Step 3: Get credentials + set webhook
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  addHeader(s, 'STEP 3 — 認証情報取得 + Webhook 登録', 6);
  addFooter(s);

  s.addText('3つの値を控え、Webhook URL を登録', {
    x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 24, bold: true,
    color: INK, fontFace: FONT_JP_SERIF, margin: 0,
  });

  // 3値カード（横並び）
  const creds = [
    { label: 'Channel ID', where: 'Basic settings', desc: '数字10桁', color: BRAND },
    { label: 'Channel Secret', where: 'Basic settings', desc: '英数字32桁', color: BRAND },
    { label: 'Access Token', where: 'Messaging API', desc: '発行ボタン押下', color: LINE_GREEN },
  ];
  creds.forEach((c, i) => {
    const x = 0.6 + i * 2.95;
    const y = 1.6;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 2.8, h: 1.35,
      fill: { color: 'ffffff' }, line: { color: BORDER, width: 0.5 },
      shadow: makeShadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 2.8, h: 0.08,
      fill: { color: c.color }, line: { color: c.color, width: 0 },
    });
    s.addText(c.label, {
      x: x + 0.2, y: y + 0.2, w: 2.4, h: 0.35, fontSize: 14, bold: true,
      color: INK, fontFace: FONT_JP_B, margin: 0,
    });
    s.addText(c.where + ' タブ', {
      x: x + 0.2, y: y + 0.55, w: 2.4, h: 0.3, fontSize: 10,
      color: BRAND_DEEP, fontFace: FONT_JP_B, charSpacing: 2, margin: 0,
    });
    s.addText(c.desc, {
      x: x + 0.2, y: y + 0.85, w: 2.4, h: 0.4, fontSize: 11,
      color: INK_MUTED, fontFace: FONT_JP, margin: 0,
    });
  });

  // Webhook URL block
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 3.15, w: 8.8, h: 0.75,
    fill: { color: BG_DARK }, line: { color: BRAND, width: 0.5 },
  });
  s.addText('Webhook URL', {
    x: 0.85, y: 3.25, w: 2, h: 0.3, fontSize: 10, bold: true,
    color: BRAND, fontFace: FONT_JP_B, charSpacing: 4, margin: 0,
  });
  s.addText('https://hair-salon-link-production.up.railway.app/api/line/webhook', {
    x: 0.85, y: 3.55, w: 8.3, h: 0.35, fontSize: 12,
    color: 'ebe1cf', fontFace: 'Consolas', margin: 0,
  });

  const steps = [
    { t: '1', d: 'チャネルの「Messaging API settings」タブ → Webhook URL に上記を貼付' },
    { t: '2', d: '「検証」→ Success を確認、「Webhookの利用」ON' },
    { t: '3', d: '同タブ下部「応答メッセージ」OFF、「あいさつメッセージ」ON' },
  ];
  steps.forEach((st, i) => {
    const y = 4.1 + i * 0.33;
    numBadge(s, 0.6, y + 0.02, st.t, BRAND, 0.28);
    s.addText(st.d, {
      x: 0.95, y, w: 8.45, h: 0.3, fontSize: 11,
      color: INK, fontFace: FONT_JP, valign: 'middle', margin: 0,
    });
  });

  s.addText('🔐 取得した3つは、後でオーナーに安全に伝達（パスワード保護 PDF / 1Password 共有リンク等）', {
    x: 0.6, y: 5.08, w: 8.8, h: 0.25, fontSize: 10,
    color: ACCENT_RED, fontFace: FONT_JP, italic: true, margin: 0,
  });
}

// ====================================================================
// Slide 7 — Step 4: Pre-test the whole pipeline on operator side
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  addHeader(s, 'STEP 4 — 事前テスト（営業員側）', 7);
  addFooter(s);

  s.addText('商談前に必ず動作確認する', {
    x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 24, bold: true,
    color: INK, fontFace: FONT_JP_SERIF, margin: 0,
  });

  s.addText('商談当日「あれ、動かない…」を防ぐため、前日までに自分の環境でダミー通しをする。', {
    x: 0.6, y: 1.5, w: 8.8, h: 0.35, fontSize: 11,
    color: INK_MUTED, fontFace: FONT_JP, italic: true, margin: 0,
  });

  const checklist = [
    'ダミーの HairSalonLink 店舗を Free プランで作成（メアドは使い捨てで OK）',
    '設定画面 → LINE 連携に、取得した Channel ID / Secret / Token を入力して保存',
    '「LINE 接続をテスト」ボタン → ✅緑表示 を確認（認証 OK）',
    '自分のスマホで公式アカウントを友だち追加（QRコードは LINE Official Account Manager の「友だちを増やす」タブ）',
    '友だち追加直後、ウェルカムメッセージが自分の LINE に届くか確認',
    '「予約」と送信 → 自動返信で予約ページ URL が届くか確認',
    'HairSalonLink ダッシュボード → 顧客一覧 に自分が「LINE友だち」として追加されているか確認',
  ];

  checklist.forEach((t, i) => {
    const y = 1.95 + i * 0.45;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: y + 0.06, w: 0.25, h: 0.25,
      fill: { color: 'ffffff' }, line: { color: BORDER, width: 1 },
    });
    // check icon manually ("✓")
    s.addText('☐', {
      x: 0.6, y: y + 0.02, w: 0.25, h: 0.3, fontSize: 16,
      color: BRAND, fontFace: FONT_JP, align: 'center', valign: 'middle', margin: 0,
    });
    s.addText(t, {
      x: 0.95, y, w: 8.45, h: 0.4, fontSize: 11.5,
      color: INK, fontFace: FONT_JP, valign: 'middle', margin: 0,
    });
  });
}

// ====================================================================
// Slide 8 — Step 5: On-site
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  addHeader(s, 'STEP 5 — 商談当日のオペレーション', 8);
  addFooter(s);

  s.addText('商談当日：オーナーのスマホで完了させる', {
    x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 24, bold: true,
    color: INK, fontFace: FONT_JP_SERIF, margin: 0,
  });

  const steps = [
    {
      n: '1', t: 'HairSalonLink 新規登録（オーナー本人）',
      d: 'オーナーのスマホで /register → Free プラン → 店舗名・メール・パスワード入力。',
    },
    {
      n: '2', t: 'ログイン → 設定画面へ',
      d: '下部タブ「もっと」→「設定」→ 「LINE 連携」カード。',
    },
    {
      n: '3', t: '3つの値を入力 →「保存」',
      d: '事前に用意した Channel ID / Secret / Access Token を読み上げて、オーナーが入力。',
    },
    {
      n: '4', t: '「LINE 接続をテスト」ボタン',
      d: '✅緑の「接続成功」表示 → オーナーに OA 名が一致していることを見せる。',
    },
    {
      n: '5', t: '公式アカウントを友だち追加',
      d: 'QRコード（Manager アプリ）をオーナーに読み込んでもらう。ウェルカムメッセージ着信で感動ポイント。',
    },
    {
      n: '6', t: '「予約」と送ってもらう',
      d: '予約ページ URL が自動返信。「これが24時間365日動くんです」と締める。',
    },
  ];

  steps.forEach((st, i) => {
    const y = 1.55 + i * 0.58;
    numBadge(s, 0.6, y + 0.05, st.n, BRAND, 0.36);
    s.addText(st.t, {
      x: 1.1, y, w: 8.2, h: 0.3, fontSize: 13, bold: true,
      color: INK, fontFace: FONT_JP_B, margin: 0,
    });
    s.addText(st.d, {
      x: 1.1, y: y + 0.25, w: 8.2, h: 0.35, fontSize: 10.5,
      color: INK_MUTED, fontFace: FONT_JP, margin: 0,
    });
  });
}

// ====================================================================
// Slide 9 — Step 6: Handover (権限移譲)
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  addHeader(s, 'STEP 6 — 権限移譲（契約成立後）', 9);
  addFooter(s);

  s.addText('管理権限をオーナーに完全移譲する', {
    x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 24, bold: true,
    color: INK, fontFace: FONT_JP_SERIF, margin: 0,
  });

  s.addText('この工程をやらないと、営業員の LINE アカウントが消えた瞬間にお客様の LINE OA が使えなくなる。契約後7日以内に必ず実施。', {
    x: 0.6, y: 1.55, w: 8.8, h: 0.5, fontSize: 11, italic: true,
    color: ACCENT_RED, fontFace: FONT_JP, margin: 0,
  });
  s.addText('💡 ポイント：登録メールアドレスは変更可能。「設定 → アカウント → メールアドレス変更」から旧アドレス（営業員）→ 新アドレス（オーナー）に差し替える。', {
    x: 0.6, y: 1.83, w: 8.8, h: 0.3, fontSize: 10,
    color: BRAND_DEEP, fontFace: FONT_JP, margin: 0,
  });

  const tasks = [
    {
      title: 'LINE 公式アカウント側',
      items: [
        '① manager.line.biz → 設定 → アカウント → メールアドレス「変更」 → オーナー本人メールに差替え',
        '② 設定 → 権限 → オーナーの LINE ID を「管理者」で招待',
        '③ 承認後、営業員の権限を「担当者」→ 最終的に削除',
      ],
    },
    {
      title: 'LINE Developers Console 側',
      items: [
        '① プロバイダー → Admin タブ → Add → オーナーのメール',
        '② 招待メール承認後、営業員の権限を削除',
        '③ 開発者アカウント側のメアドも必要に応じて変更',
      ],
    },
    {
      title: 'HairSalonLink 側',
      items: [
        '① アカウント設定 → メールアドレス「変更」ボタンでオーナーメアドに差替え',
        '② 「パスワード変更」でオーナーに新パスワードを設定してもらう',
        '③ 管理者権限をオーナー単独に',
      ],
    },
  ];

  const cardY = 2.25;
  const cardH = 2.9;
  tasks.forEach((t, i) => {
    const x = 0.6 + i * 2.95;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: cardY, w: 2.8, h: cardH,
      fill: { color: 'ffffff' }, line: { color: BORDER, width: 0.5 },
      shadow: makeShadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: cardY, w: 2.8, h: 0.08,
      fill: { color: BRAND }, line: { color: BRAND, width: 0 },
    });
    s.addText(t.title, {
      x: x + 0.2, y: cardY + 0.2, w: 2.4, h: 0.4, fontSize: 13, bold: true,
      color: INK, fontFace: FONT_JP_B, margin: 0,
    });
    const itemsText = t.items.map((item, idx) => ({
      text: item,
      options: {
        fontSize: 9.5, color: INK_MUTED, fontFace: FONT_JP,
        breakLine: idx < t.items.length - 1,
      },
    }));
    s.addText(itemsText, {
      x: x + 0.2, y: cardY + 0.75, w: 2.4, h: cardH - 0.85,
      lineSpacingMultiple: 1.35, margin: 0,
    });
  });
}

// ====================================================================
// Slide 10 — Troubleshooting table
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  addHeader(s, 'TROUBLESHOOT — 困った時', 10);
  addFooter(s);

  s.addText('現場で止まった時の即解決表', {
    x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 24, bold: true,
    color: INK, fontFace: FONT_JP_SERIF, margin: 0,
  });

  const rows = [
    [
      { text: '症状', options: { bold: true, color: INK, fontFace: FONT_JP_B, fill: { color: PAPER_ALT } } },
      { text: '原因', options: { bold: true, color: INK, fontFace: FONT_JP_B, fill: { color: PAPER_ALT } } },
      { text: '即対応', options: { bold: true, color: INK, fontFace: FONT_JP_B, fill: { color: PAPER_ALT } } },
    ],
    [
      { text: '「LINE 接続をテスト」が失敗', options: { color: INK, fontFace: FONT_JP } },
      { text: 'Access Token が短命版 / コピペ時の空白混入', options: { color: INK_MUTED, fontFace: FONT_JP } },
      { text: 'Developers Console で長期版 Issue し直し、空白除去して再保存', options: { color: SUCCESS, fontFace: FONT_JP } },
    ],
    [
      { text: 'Webhook「検証」で Error', options: { color: INK, fontFace: FONT_JP } },
      { text: 'URL末尾 / の有無ズレ、Webhook OFF のまま', options: { color: INK_MUTED, fontFace: FONT_JP } },
      { text: 'URL を再貼付（末尾スラなし）、「Webhook利用」ON に', options: { color: SUCCESS, fontFace: FONT_JP } },
    ],
    [
      { text: '返信が来ない', options: { color: INK, fontFace: FONT_JP } },
      { text: '応答メッセージ ON のまま競合 / Webhook OFF', options: { color: INK_MUTED, fontFace: FONT_JP } },
      { text: 'Manager の応答設定を Bot 優先に変更', options: { color: SUCCESS, fontFace: FONT_JP } },
    ],
    [
      { text: 'スマホでアプリに飛んでしまう', options: { color: INK, fontFace: FONT_JP } },
      { text: 'Universal Link（iOS仕様）', options: { color: INK_MUTED, fontFace: FONT_JP } },
      { text: 'Safari「デスクトップ用Webサイト表示」で回避、最終的に PC で実施', options: { color: SUCCESS, fontFace: FONT_JP } },
    ],
    [
      { text: '無料枠 200通を超える', options: { color: INK, fontFace: FONT_JP } },
      { text: '一斉配信の連発', options: { color: INK_MUTED, fontFace: FONT_JP } },
      { text: 'セグメント配信に切替、月末前なら送信抑制 / ライトプラン昇格', options: { color: SUCCESS, fontFace: FONT_JP } },
    ],
  ];
  s.addTable(rows, {
    x: 0.6, y: 1.55, w: 8.8, colW: [2.3, 2.8, 3.7],
    rowH: 0.55, fontSize: 10.5,
    border: { pt: 0.4, color: BORDER },
    fill: { color: 'ffffff' },
  });
}

// ====================================================================
// Slide 11 — Closing / key metrics
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: BG_DARK };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 0.8, w: 0.04, h: 0.9,
    fill: { color: BRAND }, line: { color: BRAND, width: 0 },
  });
  s.addText('CHECKLIST — SUMMARY', {
    x: 1.0, y: 0.8, w: 6, h: 0.35, fontSize: 10, bold: true,
    color: BRAND, charSpacing: 8, fontFace: FONT_JP_B, margin: 0,
  });
  s.addText('導入を止めない', {
    x: 0.8, y: 1.65, w: 8.4, h: 1.0, fontSize: 44, bold: true,
    color: 'ebe1cf', fontFace: FONT_JP_SERIF, margin: 0,
  });

  // 3つの肝
  const highlights = [
    {
      num: '01',
      h: '事前準備で 90% 終わらせる',
      d: 'STEP 1〜4 を商談前日までに営業員 PC で完了。当日は「値を入れて保存」だけ。',
    },
    {
      num: '02',
      h: '3 つの値は安全に渡す',
      d: 'Channel Secret と Access Token は口頭読み上げか、暗号化メモで共有。メールやチャット直貼禁止。',
    },
    {
      num: '03',
      h: '権限移譲を契約後 7 日以内に',
      d: '営業員の LINE/Developers 権限を外し、オーナー本人に完全帰属させる。自動リマインダー設定推奨。',
    },
  ];

  highlights.forEach((h, i) => {
    const y = 2.85 + i * 0.75;
    s.addText(h.num, {
      x: 0.8, y: y + 0.02, w: 0.7, h: 0.4, fontSize: 20, bold: true,
      color: BRAND, fontFace: FONT_JP_SERIF, charSpacing: 2, margin: 0,
    });
    s.addText(h.h, {
      x: 1.55, y, w: 7.7, h: 0.3, fontSize: 14, bold: true,
      color: 'ebe1cf', fontFace: FONT_JP_B, margin: 0,
    });
    s.addText(h.d, {
      x: 1.55, y: y + 0.3, w: 7.7, h: 0.35, fontSize: 10.5,
      color: 'a89988', fontFace: FONT_JP, margin: 0,
    });
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 5.05, w: 8.4, h: 0.015,
    fill: { color: BRAND }, line: { color: BRAND, width: 0 },
  });
  s.addText('HairSalonLink  ·  社内マニュアル  ·  v1.0', {
    x: 0.8, y: 5.15, w: 8.4, h: 0.25, fontSize: 10,
    color: 'a89988', fontFace: FONT_JP, italic: true, align: 'center', margin: 0,
  });
}

// ── write ────────────────────────────────────────────────
pres.writeFile({ fileName: 'HairSalonLink_LINE初回設定代行マニュアル_営業員用.pptx' })
  .then(() => { console.log('✅ 営業員用マニュアル 完成'); })
  .catch((e) => { console.error(e); process.exit(1); });
