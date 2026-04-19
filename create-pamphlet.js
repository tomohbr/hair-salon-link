// A4 Landscape pamphlet — print-optimized version of the pitch deck.
// Output: HairSalonLink_パンフレット_A4.pptx
//
// Differences from on-screen deck:
//   - A4 landscape (11.69 × 8.27 inch)
//   - Body font minimum 11pt (print legibility)
//   - Slightly lighter navy for cover/CTA (less ink-heavy)
//   - More generous margins (0.55 inch)
//   - Larger icons + stats
//   - Page number + brand on every page for handout context

const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaChartLine, FaCut, FaPaperPlane, FaUsers, FaCalendarCheck, FaImages,
  FaArrowRight, FaCheck, FaTimes,
} = require("react-icons/fa");

// ── Print-safe palette (slightly lighter than screen version) ──
const C = {
  white:  "FFFFFF",
  bg:     "F5F3EF",     // warmer off-white for print
  card:   "FFFFFF",
  bdr:    "D9D3CA",     // slightly darker border for print visibility
  bdrHi:  "B5AEA3",
  ink:    "1A1A1A",     // dark-gray instead of pure black (better print)
  body:   "3D3D3D",
  muted:  "6E6E6E",
  light:  "A5A5A5",
  blue:   "1F5F80",
  blueL:  "E5EDF2",
  blueD:  "164660",
  navy:   "163249",     // lighter navy (less ink-heavy for print)
  navyL:  "263C54",
  navyT:  "8FA3BA",     // readable on lighter navy
  navyT2: "C4CFDE",
  warm:   "B8924F",
  warmL:  "F5EBD5",
  green:  "1A7A5C",
  red:    "A53838",
  amber:  "C8822B",
  rose:   "B04A4A",
};
const FH = "Georgia";
const FB = "Calibri";

// ── A4 Landscape dimensions (in inches) ──
const SLIDE_W = 11.69;
const SLIDE_H = 8.27;
const MARGIN = 0.55;
const CONTENT_W = SLIDE_W - MARGIN * 2;

function svg(Ic, color, sz = 256) {
  const s = ReactDOMServer.renderToStaticMarkup(React.createElement(Ic, { color, size: String(sz) }));
  return sharp(Buffer.from(s)).png().toBuffer().then(b => "image/png;base64," + b.toString("base64"));
}

// ── Typography for A4 print ──
const T = {
  eyebrow: { fontSize: 11, fontFace: FB, color: C.blue, charSpacing: 6, bold: true, margin: 0 },
  h1:      { fontSize: 36, fontFace: FH, color: C.ink, margin: 0, lineSpacingMultiple: 1.25 },
  h2:      { fontSize: 28, fontFace: FH, color: C.ink, margin: 0, lineSpacingMultiple: 1.3 },
  lede:    { fontSize: 14, fontFace: FB, color: C.body, lineSpacingMultiple: 1.75, margin: 0 },
  body:    { fontSize: 12, fontFace: FB, color: C.body, lineSpacingMultiple: 1.7, margin: 0 },
  small:   { fontSize: 11, fontFace: FB, color: C.body, lineSpacingMultiple: 1.6, margin: 0 },
  tiny:    { fontSize: 9,  fontFace: FB, color: C.light, margin: 0 },
};

function eyebrow(s, text, y = 0.7) {
  s.addText(text, { x: MARGIN, y, w: CONTENT_W, h: 0.35, ...T.eyebrow });
}
function heading(s, text, y = 1.1) {
  const lines = text.split("\n").length;
  s.addText(text, { x: MARGIN, y, w: CONTENT_W, h: 0.65 + lines * 0.55, ...T.h2 });
}
function chrome(s, p, n, total) {
  // Thin divider + meta line
  s.addShape(p.shapes.LINE, { x: MARGIN, y: SLIDE_H - 0.65, w: CONTENT_W, h: 0, line: { color: C.bdr, width: 0.5 } });
  s.addText("HairSalonLink  —  美容室向け顧客管理 SaaS", {
    x: MARGIN, y: SLIDE_H - 0.5, w: 5, h: 0.3,
    fontSize: 10, fontFace: FH, color: C.blue, bold: true, margin: 0,
  });
  s.addText(`お問い合わせ: shibahara.724@gmail.com`, {
    x: SLIDE_W / 2 - 2.5, y: SLIDE_H - 0.5, w: 5, h: 0.3,
    fontSize: 9, fontFace: FB, color: C.muted, align: "center", margin: 0,
  });
  s.addText(`${String(n).padStart(2, "0")} / ${total}`, {
    x: SLIDE_W - MARGIN - 1, y: SLIDE_H - 0.5, w: 1, h: 0.3,
    fontSize: 9, fontFace: FB, color: C.light, align: "right", margin: 0,
  });
}
function cite(s, text, y = SLIDE_H - 0.95) {
  s.addText(text, {
    x: MARGIN, y, w: CONTENT_W, h: 0.25,
    fontSize: 9, fontFace: FB, color: C.light, margin: 0,
  });
}

async function main() {
  const p = new pptxgen();
  p.defineLayout({ name: "A4_LANDSCAPE", width: SLIDE_W, height: SLIDE_H });
  p.layout = "A4_LANDSCAPE";
  p.author = "HairSalonLink";
  p.title = "HairSalonLink 営業パンフレット (A4)";
  p.company = "HairSalonLink";

  const TOTAL = 12;

  const ic = {
    cal:   await svg(FaCalendarCheck, `#${C.blue}`),
    usr:   await svg(FaUsers, `#${C.blue}`),
    cht:   await svg(FaChartLine, `#${C.blue}`),
    cut:   await svg(FaCut, `#${C.blue}`),
    snd:   await svg(FaPaperPlane, `#${C.blue}`),
    img:   await svg(FaImages, `#${C.blue}`),
    arrow: await svg(FaArrowRight, `#${C.blue}`),
    arrowG:await svg(FaArrowRight, `#${C.green}`),
    check: await svg(FaCheck, `#${C.green}`),
  };

  // ════════════════════════════════════════════════════
  //  01 — COVER
  // ════════════════════════════════════════════════════
  {
    const s = p.addSlide();
    s.background = { color: C.navy };
    s.addShape(p.shapes.RECTANGLE, { x: 0, y: 0, w: SLIDE_W, h: 0.08, fill: { color: C.blue } });
    s.addShape(p.shapes.RECTANGLE, { x: 0, y: SLIDE_H - 0.08, w: SLIDE_W, h: 0.08, fill: { color: C.blue } });

    s.addText("FOR SMALL HAIR SALONS   2026", {
      x: MARGIN, y: 1.6, w: CONTENT_W, h: 0.4,
      fontSize: 13, fontFace: FB, color: C.navyT, charSpacing: 6, align: "center", bold: true, margin: 0,
    });

    s.addText("HairSalonLink", {
      x: MARGIN, y: 2.35, w: CONTENT_W, h: 1.3,
      fontSize: 72, fontFace: FH, color: C.white, align: "center",
    });

    s.addText("広告に頼り続ける経営から、降りる。", {
      x: MARGIN, y: 3.9, w: CONTENT_W, h: 0.7,
      fontSize: 24, fontFace: FB, color: C.navyT2, align: "center",
    });

    s.addText("小規模美容室のための、月額 ¥4,980 から始める顧客管理 SaaS。", {
      x: MARGIN, y: 4.65, w: CONTENT_W, h: 0.5,
      fontSize: 15, fontFace: FB, color: C.navyT, align: "center",
    });

    // 3 callouts — bigger for A4
    const cw = 3.2, gap = 0.35;
    const tw = cw * 3 + gap * 2;
    const sx = (SLIDE_W - tw) / 2;
    const kn = [
      { n: "¥0",       l: "初期費用" },
      { n: "¥4,980",   l: "月額 (税別)" },
      { n: "解約自由", l: "契約縛りなし" },
    ];
    kn.forEach((k, i) => {
      const x = sx + i * (cw + gap);
      s.addShape(p.shapes.RECTANGLE, { x, y: 5.8, w: cw, h: 1.5, fill: { color: C.navyL } });
      s.addText(k.n, {
        x, y: 5.95, w: cw, h: 0.75,
        fontSize: 32, fontFace: FH, color: C.white, align: "center", bold: true, margin: 0,
      });
      s.addText(k.l, {
        x, y: 6.75, w: cw, h: 0.35,
        fontSize: 12, fontFace: FB, color: C.navyT2, align: "center", margin: 0, charSpacing: 2,
      });
    });
  }

  // ════════════════════════════════════════════════════
  //  02 — REALITY
  // ════════════════════════════════════════════════════
  {
    const s = p.addSlide();
    s.background = { color: C.bg };
    eyebrow(s, "REALITY");
    heading(s, "小規模美容室のオーナーは、\n夜になっても店から離れられない。", 1.1);

    s.addText(
      "5名以下のサロンでは、施術以外の業務がオーナーに集中する。\n" +
      "営業後の1〜2時間は、紙カルテの整理・LINEでの予約対応・HPB管理画面の更新・売上集計に費やされる。\n" +
      "それは、本来、自分や家族のための時間だったはずだ。",
      { x: MARGIN, y: 3.3, w: CONTENT_W, h: 1.8, ...T.lede }
    );

    // Timeline
    const tlY = 5.8;
    s.addShape(p.shapes.LINE, { x: MARGIN + 0.4, y: tlY, w: CONTENT_W - 0.8, h: 0, line: { color: C.bdr, width: 1.2 } });
    const events = [
      { t: "10:00", l: "開店",         c: C.muted, bold: false },
      { t: "13:00", l: "ランチ施術",   c: C.muted, bold: false },
      { t: "19:00", l: "営業終了",     c: C.muted, bold: false },
      { t: "19:30", l: "LINE返信開始", c: C.amber, bold: true },
      { t: "20:30", l: "カルテ整理",   c: C.rose, bold: true },
      { t: "21:30", l: "やっと帰宅",   c: C.red, bold: true },
    ];
    const lineStart = MARGIN + 0.4;
    const lineEnd = SLIDE_W - MARGIN - 0.4;
    const step = (lineEnd - lineStart) / (events.length - 1);
    events.forEach((e, i) => {
      const cx = lineStart + i * step;
      s.addShape(p.shapes.OVAL, { x: cx - 0.11, y: tlY - 0.11, w: 0.22, h: 0.22, fill: { color: e.c } });
      s.addText(e.t, {
        x: cx - 0.7, y: tlY + 0.3, w: 1.4, h: 0.3,
        fontSize: 12, fontFace: FH, color: e.c, align: "center", bold: true, margin: 0,
      });
      s.addText(e.l, {
        x: cx - 0.9, y: tlY + 0.65, w: 1.8, h: 0.3,
        fontSize: 12, fontFace: FB, color: e.bold ? C.ink : C.muted, align: "center", bold: e.bold, margin: 0,
      });
    });

    s.addText("終業後の 2時間半 を、事務作業が奪っている。", {
      x: MARGIN, y: 7.1, w: CONTENT_W, h: 0.35,
      fontSize: 14, fontFace: FB, color: C.red, bold: true, align: "center", margin: 0,
    });

    chrome(s, p, 2, TOTAL);
  }

  // ════════════════════════════════════════════════════
  //  03 — THE NUMBERS
  // ════════════════════════════════════════════════════
  {
    const s = p.addSlide();
    s.background = { color: C.white };
    eyebrow(s, "THE NUMBERS");
    heading(s, "ホットペッパーの広告費は、\n年間 40〜60万円 に達する。", 1.1);

    // Left cost breakdown
    s.addText("広告費の構造", {
      x: MARGIN, y: 3.4, w: 5.2, h: 0.4,
      fontSize: 14, fontFace: FH, color: C.ink, bold: true, margin: 0,
    });
    const calc = [
      { l: "ライトプラン(最安)",         v: "¥25,000 / 月" },
      { l: "× 12ヶ月",                    v: "¥300,000 / 年" },
      { l: "ネット予約成果課金(推定)",   v: "+ ¥10〜30万 / 年" },
    ];
    calc.forEach((c, i) => {
      const y = 3.95 + i * 0.55;
      s.addText(c.l, { x: MARGIN, y, w: 3.2, h: 0.4, fontSize: 12.5, fontFace: FB, color: C.body, margin: 0 });
      s.addText(c.v, { x: MARGIN + 3.2, y, w: 2.0, h: 0.4, fontSize: 13, fontFace: FH, color: C.ink, bold: true, align: "right", margin: 0 });
    });
    s.addShape(p.shapes.LINE, { x: MARGIN, y: 5.75, w: 5.2, h: 0, line: { color: C.bdr, width: 0.8 } });
    s.addText("合計 (年間 広告費)", {
      x: MARGIN, y: 5.9, w: 3.2, h: 0.5,
      fontSize: 13, fontFace: FB, color: C.body, bold: true, margin: 0,
    });
    s.addText("¥40〜60万", {
      x: MARGIN + 3.2, y: 5.85, w: 2.0, h: 0.6,
      fontSize: 26, fontFace: FH, color: C.red, bold: true, align: "right", margin: 0,
    });

    // Right punchline
    const rX = 6.5;
    s.addShape(p.shapes.RECTANGLE, { x: rX, y: 3.4, w: 4.6, h: 3.2, fill: { color: C.warmL } });
    s.addShape(p.shapes.RECTANGLE, { x: rX, y: 3.4, w: 0.12, h: 3.2, fill: { color: C.warm } });
    s.addText("年商 1,000万円のサロンで、", {
      x: rX + 0.35, y: 3.55, w: 4.0, h: 0.4,
      fontSize: 13, fontFace: FB, color: C.body, margin: 0,
    });
    s.addText("売上の 4〜6% を、", {
      x: rX + 0.35, y: 4.0, w: 4.0, h: 0.55,
      fontSize: 22, fontFace: FH, color: C.ink, bold: true, margin: 0,
    });
    s.addText("HPB の広告費が占める。", {
      x: rX + 0.35, y: 4.55, w: 4.0, h: 0.55,
      fontSize: 22, fontFace: FH, color: C.ink, bold: true, margin: 0,
    });
    s.addText(
      "しかも、LINEで繋がった常連客がHPB経由で予約しても、紹介手数料は発生し続ける。広告費は、新規だけのコストではない。",
      { x: rX + 0.35, y: 5.3, w: 4.0, h: 1.3, fontSize: 12, fontFace: FB, color: C.body, lineSpacingMultiple: 1.7, margin: 0 }
    );

    cite(s, "出典: ホットペッパービューティー公開料金 (ライトプラン ¥25,000/月〜) / 業界ヒアリング");
    chrome(s, p, 3, TOTAL);
  }

  // ════════════════════════════════════════════════════
  //  04 — WHY IT'S BROKEN
  // ════════════════════════════════════════════════════
  {
    const s = p.addSlide();
    s.background = { color: C.bg };
    eyebrow(s, "WHY IT'S BROKEN");
    heading(s, "問題は「ツールがない」のではなく、\n「ツールが分散している」こと。", 1.1);

    s.addText(
      "多くの小規模サロンは、HPB管理画面・個人LINE・紙カルテ・Excel・SNS の5つを行き来している。\n" +
      "1つにまとまっていないから、データが繋がらず、判断ができず、時間が消える。",
      { x: MARGIN, y: 3.4, w: CONTENT_W, h: 1.4, ...T.lede }
    );

    const tools = [
      { name: "HPB",     sub: "予約・広告" },
      { name: "LINE",    sub: "顧客対応" },
      { name: "紙カルテ", sub: "薬剤履歴" },
      { name: "Excel",   sub: "売上管理" },
      { name: "SNS",     sub: "宣伝" },
    ];
    const tw = 1.85, tg = 0.22;
    const ttw = tw * 5 + tg * 4;
    const tsx = (SLIDE_W - ttw) / 2;
    tools.forEach((t, i) => {
      const x = tsx + i * (tw + tg);
      s.addShape(p.shapes.RECTANGLE, { x, y: 5.2, w: tw, h: 1.4, fill: { color: C.card }, line: { color: C.bdr, width: 0.7 } });
      s.addText(t.name, {
        x, y: 5.35, w: tw, h: 0.5,
        fontSize: 15, fontFace: FB, color: C.ink, align: "center", bold: true, margin: 0,
      });
      s.addText(t.sub, { x, y: 5.9, w: tw, h: 0.4, fontSize: 12, fontFace: FB, color: C.muted, align: "center", margin: 0 });
      if (i < tools.length - 1) {
        s.addText("×", {
          x: x + tw, y: 5.65, w: tg, h: 0.5,
          fontSize: 22, fontFace: FB, color: C.red, align: "center", bold: true, margin: 0,
        });
      }
    });

    s.addText("データが繋がらない → 同じ顧客が二重登録 → 判断材料にならない", {
      x: MARGIN, y: 7.1, w: CONTENT_W, h: 0.35,
      fontSize: 14, fontFace: FB, color: C.red, align: "center", bold: true, margin: 0,
    });

    chrome(s, p, 4, TOTAL);
  }

  // ════════════════════════════════════════════════════
  //  05 — SOLUTION
  // ════════════════════════════════════════════════════
  {
    const s = p.addSlide();
    s.background = { color: C.white };
    eyebrow(s, "SOLUTION");
    heading(s, "5つのツールを、1つの管理画面に。", 1.1);

    s.addText(
      "HairSalonLink は、予約・カルテ・LINE配信・分析を1画面に統合する顧客管理SaaS。\n" +
      "月額 ¥4,980 で、複数ツールの契約を1本化し、データを連結して経営判断の材料に変えます。",
      { x: MARGIN, y: 2.55, w: CONTENT_W, h: 1.5, ...T.lede }
    );

    // Left stack
    const fromItems = ["HPB (予約・広告)", "LINE (顧客対応)", "紙カルテ (履歴)", "Excel (売上管理)", "SNS (宣伝)"];
    const fromX = MARGIN + 0.2;
    const fromTop = 4.4;
    fromItems.forEach((lbl, i) => {
      const y = fromTop + i * 0.5;
      s.addShape(p.shapes.RECTANGLE, { x: fromX, y, w: 3.5, h: 0.42, fill: { color: C.bg }, line: { color: C.bdr, width: 0.6 } });
      s.addText(lbl, { x: fromX + 0.2, y, w: 3.3, h: 0.42, fontSize: 12, fontFace: FB, color: C.body, valign: "middle", margin: 0 });
    });

    // Arrow
    s.addImage({ data: ic.arrow, x: 4.9, y: 5.75, w: 0.65, h: 0.65 });

    // Right result
    const toX = 6.4, toY = 4.4;
    s.addShape(p.shapes.RECTANGLE, { x: toX, y: toY, w: 4.85, h: 2.6, fill: { color: C.blueL }, line: { color: C.blue, width: 1.5 } });
    s.addShape(p.shapes.RECTANGLE, { x: toX, y: toY, w: 0.14, h: 2.6, fill: { color: C.blue } });
    s.addText("HairSalonLink", {
      x: toX + 0.4, y: toY + 0.25, w: 4.2, h: 0.55,
      fontSize: 24, fontFace: FH, color: C.blue, bold: true, margin: 0,
    });
    s.addText("1つの管理画面で、すべて完結。", {
      x: toX + 0.4, y: toY + 0.95, w: 4.2, h: 0.5,
      fontSize: 17, fontFace: FH, color: C.ink, bold: true, margin: 0,
    });
    s.addText(
      "予約 / カルテ / LINE配信 / 分析 を、\n同じ顧客データに紐づけて一元管理。",
      { x: toX + 0.4, y: toY + 1.55, w: 4.2, h: 0.95, fontSize: 13, fontFace: FB, color: C.body, lineSpacingMultiple: 1.7, margin: 0 }
    );

    chrome(s, p, 5, TOTAL);
  }

  // ════════════════════════════════════════════════════
  //  06 — THE INSIGHT
  // ════════════════════════════════════════════════════
  {
    const s = p.addSlide();
    s.background = { color: C.bg };
    eyebrow(s, "THE INSIGHT");
    heading(s, "他社にない指標 ── HPB→自社 移行率。", 1.1);

    s.addText(
      "「HPBの広告を減らしても、お客様は戻ってきてくれるか？」\n" +
      "これは経営判断の核心の問いです。HairSalonLink は、その答えを数字で出します。",
      { x: MARGIN, y: 2.5, w: CONTENT_W, h: 1.5, ...T.lede }
    );

    const boxY = 4.3;
    const boxH = 2.7;
    s.addShape(p.shapes.RECTANGLE, { x: MARGIN, y: boxY, w: CONTENT_W, h: boxH, fill: { color: C.card }, line: { color: C.bdr, width: 0.6 } });
    s.addShape(p.shapes.RECTANGLE, { x: MARGIN, y: boxY, w: 0.14, h: boxH, fill: { color: C.blue } });

    // Big KPI
    s.addText("HPB → 自社 移行率", {
      x: MARGIN + 0.45, y: boxY + 0.3, w: 4.5, h: 0.4,
      fontSize: 13, fontFace: FB, color: C.muted, charSpacing: 3, bold: true, margin: 0,
    });
    s.addText([
      { text: "57", options: { fontSize: 88, fontFace: FH, color: C.blue, bold: true } },
      { text: "%", options: { fontSize: 40, fontFace: FH, color: C.blue, bold: true } },
    ], { x: MARGIN + 0.45, y: boxY + 0.75, w: 4.5, h: 1.7, margin: 0 });

    // Right explanation
    const expX = MARGIN + 5.5;
    s.addText("この数字の読み方", {
      x: expX, y: boxY + 0.3, w: 5.2, h: 0.4,
      fontSize: 13, fontFace: FB, color: C.muted, charSpacing: 3, bold: true, margin: 0,
    });
    s.addText("HPB経由の新規客のうち 57% が、\n次回をLINEや自社で予約した。", {
      x: expX, y: boxY + 0.75, w: 5.2, h: 1.1,
      fontSize: 17, fontFace: FH, color: C.ink, bold: true, lineSpacingMultiple: 1.4, margin: 0,
    });
    s.addText(
      "→ HPB広告を月¥10,000 減らせる根拠になる。\n→ 移行率が低ければ、LINE登録誘導の改善余地が見える。",
      { x: expX, y: boxY + 1.85, w: 5.2, h: 0.8, fontSize: 12, fontFace: FB, color: C.body, lineSpacingMultiple: 1.65, margin: 0 }
    );

    cite(s, "※ 画面内の数値はデモサロンの例です。実際の数値は店舗の運用により変動します。");
    chrome(s, p, 6, TOTAL);
  }

  // ════════════════════════════════════════════════════
  //  07 — PRODUCT
  // ════════════════════════════════════════════════════
  {
    const s = p.addSlide();
    s.background = { color: C.white };
    eyebrow(s, "PRODUCT");
    heading(s, "小規模の運用に必要な、6つの機能。", 1.1);

    const feats = [
      { ic: ic.cal, t: "LINE予約・リマインド",   d: "LIFF対応・自動受付・自動リマインド" },
      { ic: ic.usr, t: "予約カレンダー統合",     d: "HPB / LINE / Web を1画面に集約" },
      { ic: ic.cht, t: "HPB→自社 移行率追跡",     d: "独自KPIで広告判断の材料を可視化" },
      { ic: ic.cut, t: "薬剤履歴カルテ",          d: "ブランド・比率・アレルギー・DL 1-5" },
      { ic: ic.snd, t: "セグメント別LINE配信",   d: "休眠 / VIP / 初回 の条件指定で配信" },
      { ic: ic.img, t: "スタイルギャラリー",      d: "撮影写真からそのまま予約に導線" },
    ];
    const gridTop = 2.6;
    const cardW = 3.4, cardH = 2.05, gapX = 0.2, gapY = 0.3;
    feats.forEach((f, i) => {
      const col = i % 3, row = Math.floor(i / 3);
      const x = MARGIN + col * (cardW + gapX);
      const y = gridTop + row * (cardH + gapY);
      s.addShape(p.shapes.RECTANGLE, { x, y, w: cardW, h: cardH, fill: { color: C.bg }, line: { color: C.bdr, width: 0.6 } });
      s.addShape(p.shapes.OVAL, { x: x + 0.3, y: y + 0.3, w: 0.75, h: 0.75, fill: { color: C.blueL } });
      s.addImage({ data: f.ic, x: x + 0.43, y: y + 0.43, w: 0.49, h: 0.49 });
      s.addText(f.t, {
        x: x + 1.2, y: y + 0.35, w: cardW - 1.4, h: 0.6,
        fontSize: 15, fontFace: FH, color: C.ink, bold: true, margin: 0,
      });
      s.addText(f.d, {
        x: x + 0.3, y: y + 1.2, w: cardW - 0.6, h: 0.75,
        fontSize: 12, fontFace: FB, color: C.body, lineSpacingMultiple: 1.6, margin: 0,
      });
    });

    chrome(s, p, 7, TOTAL);
  }

  // ════════════════════════════════════════════════════
  //  08 — VS ALTERNATIVES
  // ════════════════════════════════════════════════════
  {
    const s = p.addSlide();
    s.background = { color: C.bg };
    eyebrow(s, "VS ALTERNATIVES");
    heading(s, "主要ツールとの比較で、優位性を示す。", 1.1);

    const headers = ["項目", "Excel /\n紙カルテ", "汎用予約\nSaaS", "HairSalonLink"];
    const rows = [
      ["月額コスト",         "¥0",  "¥8,000〜¥21,000", "¥4,980"],
      ["初期費用",           "¥0",  "¥0〜¥100,000",    "¥0"],
      ["LINE連携",           "—",  "△",              "○"],
      ["薬剤履歴カルテ",     "△",  "△",              "○"],
      ["HPB→自社 移行率",    "—",  "—",              "○"],
      ["小規模特化UI",       "—",  "△",              "○"],
      ["契約縛り",           "—",  "年契約多い",      "なし"],
    ];

    const ty = 2.65;
    const colW = [2.8, 2.2, 2.2, 3.4];
    const rowH = 0.52;
    const headerH = 0.75;

    let cx = MARGIN;
    headers.forEach((h, i) => {
      const isUs = i === 3;
      s.addShape(p.shapes.RECTANGLE, {
        x: cx, y: ty, w: colW[i], h: headerH,
        fill: { color: isUs ? C.blue : "CAC4B9" },
      });
      s.addText(h, {
        x: cx + 0.15, y: ty, w: colW[i] - 0.3, h: headerH,
        fontSize: i === 0 ? 12 : 13,
        fontFace: FB, color: isUs ? C.white : C.ink,
        align: i === 0 ? "left" : "center",
        bold: true, valign: "middle", margin: 0,
      });
      cx += colW[i];
    });

    rows.forEach((r, ri) => {
      const ry = ty + headerH + ri * rowH;
      let rx = MARGIN;
      r.forEach((cell, ci) => {
        const isUs = ci === 3;
        s.addShape(p.shapes.RECTANGLE, {
          x: rx, y: ry, w: colW[ci], h: rowH,
          fill: { color: isUs ? C.blueL : (ri % 2 === 0 ? C.card : C.bg) },
          line: { color: C.bdr, width: 0.4 },
        });
        let color = C.body, weight = false;
        if (cell === "○") { color = C.green; weight = true; }
        else if (cell === "△") { color = C.warm; weight = true; }
        else if (cell === "—") { color = C.light; }
        if (isUs) { color = C.blueD; weight = true; }
        s.addText(cell, {
          x: rx + 0.18, y: ry, w: colW[ci] - 0.36, h: rowH,
          fontSize: 12.5, fontFace: FB, color, bold: weight,
          align: ci === 0 ? "left" : "center", valign: "middle", margin: 0,
        });
        rx += colW[ci];
      });
    });

    cite(s, "出典: 各社公開料金・公式情報より作成 (2026年4月時点)。");
    chrome(s, p, 8, TOTAL);
  }

  // ════════════════════════════════════════════════════
  //  09 — ROI
  // ════════════════════════════════════════════════════
  {
    const s = p.addSlide();
    s.background = { color: C.white };
    eyebrow(s, "RETURN ON INVESTMENT");
    heading(s, "月額 ¥4,980 が、何で回収できるか。", 1.1);

    s.addText(
      "費用対効果を、「広告費の削減」「事務時間の削減」「ペイバック期間」の3つで定量化します。",
      { x: MARGIN, y: 2.55, w: CONTENT_W, h: 0.6, ...T.lede }
    );

    const cards = [
      { label: "広告費の削減",   big: "¥10,000", unit: "/ 月",     body: "HPB→自社移行率が 10pt 上がれば、HPB広告予算を月1万円減らせる試算。",     stripe: C.red },
      { label: "事務時間の削減", big: "20時間",  unit: "/ 月",     body: "営業後の予約対応・カルテ整理・売上集計を統合。1日40分 × 30営業日。",   stripe: C.warm },
      { label: "ペイバック期間", big: "0.5",     unit: "ヶ月未満", body: "上記2項目だけで、Standard プランは月額の数倍の効果が見込める。",       stripe: C.blue },
    ];

    const cgap = 0.25;
    const cW = (CONTENT_W - cgap * 2) / 3;
    cards.forEach((c, i) => {
      const x = MARGIN + i * (cW + cgap);
      s.addShape(p.shapes.RECTANGLE, { x, y: 3.85, w: cW, h: 3.0, fill: { color: C.bg }, line: { color: C.bdr, width: 0.6 } });
      s.addShape(p.shapes.RECTANGLE, { x, y: 3.85, w: cW, h: 0.12, fill: { color: c.stripe } });
      s.addText(c.label, {
        x: x + 0.3, y: 4.1, w: cW - 0.6, h: 0.4,
        fontSize: 13, fontFace: FB, color: C.muted, bold: true, charSpacing: 3, margin: 0,
      });
      s.addText([
        { text: c.big, options: { fontSize: 38, fontFace: FH, color: C.ink, bold: true } },
        { text: " " + c.unit, options: { fontSize: 14, fontFace: FB, color: C.muted } },
      ], { x: x + 0.3, y: 4.55, w: cW - 0.6, h: 0.75, margin: 0 });
      s.addText(c.body, {
        x: x + 0.3, y: 5.4, w: cW - 0.6, h: 1.4,
        fontSize: 12, fontFace: FB, color: C.body, lineSpacingMultiple: 1.7, margin: 0,
      });
    });

    cite(s, "※ 効果は店舗の運用状況により変動します。試算は標準的な小規模サロンを想定。");
    chrome(s, p, 9, TOTAL);
  }

  // ════════════════════════════════════════════════════
  //  10 — PRICING
  // ════════════════════════════════════════════════════
  {
    const s = p.addSlide();
    s.background = { color: C.bg };
    eyebrow(s, "PRICING");
    heading(s, "まずは無料から。必要になったら月額へ。", 1.1);

    const plans = [
      {
        name: "Free", price: "¥0", sub: "/月", desc: "お試し / 1席",
        outcome: "まずは触ってみたい方へ",
        items: ["顧客 30名", "月50予約まで", "基本カルテ", "LINE予約URL", "CSV移行対応", "クレカ登録不要"],
        hl: false,
      },
      {
        name: "Standard", price: "¥4,980", sub: "/月(税別)", desc: "小規模 / 1〜5席",
        outcome: "HPB依存を本気で減らしたい方へ",
        items: ["顧客 500名", "予約無制限", "LINE配信", "薬剤カルテ", "指名管理", "HPB移行率KPI"],
        hl: true,
      },
      {
        name: "Pro", price: "¥9,980", sub: "/月(税別)", desc: "複数スタッフ / 5席〜",
        outcome: "成長フェーズに入った店舗へ",
        items: ["顧客無制限", "AI離反予測", "ギャラリー", "複数スタッフ", "初期設定サポート", "優先サポート"],
        hl: false,
      },
    ];

    const pgap = 0.3;
    const pW = (CONTENT_W - pgap * 2) / 3;
    plans.forEach((pl, i) => {
      const x = MARGIN + i * (pW + pgap);
      const bgC = pl.hl ? C.blue : C.card;
      const bdC = pl.hl ? C.blue : C.bdr;
      const tc  = pl.hl ? C.white : C.ink;
      const sc  = pl.hl ? C.navyT2 : C.muted;
      const bc  = pl.hl ? "D5E5EF" : C.body;

      s.addShape(p.shapes.RECTANGLE, { x, y: 2.7, w: pW, h: 4.25, fill: { color: bgC }, line: { color: bdC, width: pl.hl ? 0 : 0.6 } });

      if (pl.hl) {
        s.addShape(p.shapes.RECTANGLE, { x: x + (pW - 2.3) / 2, y: 2.5, w: 2.3, h: 0.38, fill: { color: C.warm } });
        s.addText("RECOMMENDED", {
          x: x + (pW - 2.3) / 2, y: 2.5, w: 2.3, h: 0.38,
          fontSize: 10, fontFace: FB, color: C.white, align: "center", bold: true, charSpacing: 3, margin: 0,
        });
      }

      s.addText(pl.name, { x: x + 0.35, y: 2.9, w: pW - 0.7, h: 0.55, fontSize: 24, fontFace: FH, color: tc, bold: true, margin: 0 });
      s.addText(pl.desc, { x: x + 0.35, y: 3.4, w: pW - 0.7, h: 0.35, fontSize: 12, fontFace: FB, color: sc, margin: 0 });
      s.addText([
        { text: pl.price, options: { fontSize: 36, fontFace: FH, color: tc, bold: true } },
        { text: pl.sub, options: { fontSize: 12, fontFace: FB, color: sc } },
      ], { x: x + 0.35, y: 3.8, w: pW - 0.7, h: 0.7, margin: 0 });

      s.addText(pl.outcome, {
        x: x + 0.35, y: 4.55, w: pW - 0.7, h: 0.4,
        fontSize: 11.5, fontFace: FB, color: sc, margin: 0,
      });

      s.addShape(p.shapes.LINE, { x: x + 0.35, y: 5.0, w: pW - 0.7, h: 0, line: { color: pl.hl ? "4A8FAB" : C.bdr, width: 0.5 } });

      const items = pl.items.map((item, j) => ({
        text: "  " + item,
        options: { fontSize: 12, fontFace: FB, color: bc, bullet: { code: "2713" }, breakLine: j < pl.items.length - 1, paraSpaceAfter: 5 },
      }));
      s.addText(items, { x: x + 0.35, y: 5.15, w: pW - 0.7, h: 1.7, margin: 0, valign: "top" });
    });

    chrome(s, p, 10, TOTAL);
  }

  // ════════════════════════════════════════════════════
  //  11 — RISK REVERSAL
  // ════════════════════════════════════════════════════
  {
    const s = p.addSlide();
    s.background = { color: C.white };
    eyebrow(s, "WHY IT'S SAFE TO TRY");
    heading(s, "もし合わなかったら、\nいつでも、何も失わずにやめられる。", 1.1);

    const risks = [
      { q: "契約してから後悔したら？", a: "月単位で解約できます。違約金はありません。" },
      { q: "データを失わない？",       a: "解約後30日間、顧客データをCSVでエクスポートできます。" },
      { q: "カード情報を渡したくない", a: "Freeプランはクレジットカード登録不要です。" },
      { q: "使いこなせるか不安",       a: "LINEを使えるなら大丈夫。アイコン中心のシンプルUI。" },
      { q: "既存データの移行は？",     a: "HPBのCSVをそのまま取込。電話番号で自動名寄せ。" },
    ];

    const tableY = 3.4;
    const rowH = 0.7;
    const qW = 4.3;
    risks.forEach((r, i) => {
      const y = tableY + i * rowH;
      s.addShape(p.shapes.RECTANGLE, {
        x: MARGIN, y, w: CONTENT_W, h: rowH - 0.08,
        fill: { color: i % 2 === 0 ? C.bg : C.white },
        line: { color: C.bdr, width: 0.4 },
      });
      s.addText(`「${r.q}」`, {
        x: MARGIN + 0.3, y, w: qW - 0.3, h: rowH - 0.08,
        fontSize: 13, fontFace: FH, color: C.ink, bold: true, valign: "middle", margin: 0,
      });
      s.addImage({ data: ic.arrowG, x: MARGIN + qW, y: y + (rowH - 0.08) / 2 - 0.15, w: 0.3, h: 0.3 });
      s.addText(r.a, {
        x: MARGIN + qW + 0.4, y, w: CONTENT_W - qW - 0.7, h: rowH - 0.08,
        fontSize: 13, fontFace: FB, color: C.body, valign: "middle", margin: 0,
      });
    });

    chrome(s, p, 11, TOTAL);
  }

  // ════════════════════════════════════════════════════
  //  12 — CTA
  // ════════════════════════════════════════════════════
  {
    const s = p.addSlide();
    s.background = { color: C.navy };
    s.addShape(p.shapes.RECTANGLE, { x: 0, y: 0, w: SLIDE_W, h: 0.08, fill: { color: C.blue } });
    s.addShape(p.shapes.RECTANGLE, { x: 0, y: SLIDE_H - 0.08, w: SLIDE_W, h: 0.08, fill: { color: C.blue } });

    s.addText("NEXT STEP", {
      x: MARGIN, y: 1.3, w: CONTENT_W, h: 0.4,
      fontSize: 13, fontFace: FB, color: C.navyT2, charSpacing: 6, align: "center", bold: true, margin: 0,
    });
    s.addText("今日30分で、明日の経営判断が変わる。", {
      x: MARGIN, y: 2.0, w: CONTENT_W, h: 0.85,
      fontSize: 38, fontFace: FH, color: C.white, align: "center",
    });
    s.addText(
      "Freeプラン登録 → HPBのCSVをアップロード → LINE予約URLを発行。\n" +
      "これだけで、明日からの予約データが1画面に蓄積されはじめます。",
      { x: MARGIN, y: 3.1, w: CONTENT_W, h: 1.0,
        fontSize: 15, fontFace: FB, color: C.navyT2, align: "center", lineSpacingMultiple: 1.8, margin: 0 }
    );

    const actY = 4.5;
    const actW = 4.8, actH = 1.8, actGap = 0.3;
    const actTotalW = actW * 2 + actGap;
    const actX = (SLIDE_W - actTotalW) / 2;

    // Demo box
    s.addShape(p.shapes.RECTANGLE, { x: actX, y: actY, w: actW, h: actH, fill: { color: C.navyL } });
    s.addText("ベータ版デモ", {
      x: actX, y: actY + 0.2, w: actW, h: 0.4,
      fontSize: 12, fontFace: FB, color: C.navyT2, align: "center", bold: true, charSpacing: 3, margin: 0,
    });
    s.addText("今すぐブラウザで試せます", {
      x: actX, y: actY + 0.62, w: actW, h: 0.45,
      fontSize: 17, fontFace: FH, color: C.white, align: "center", bold: true, margin: 0,
    });
    s.addText("hair-salon-link-production.up.railway.app", {
      x: actX, y: actY + 1.2, w: actW, h: 0.4,
      fontSize: 12, fontFace: FB, color: C.white, align: "center", margin: 0,
    });

    // Contact box
    const cX = actX + actW + actGap;
    s.addShape(p.shapes.RECTANGLE, { x: cX, y: actY, w: actW, h: actH, fill: { color: C.blue } });
    s.addText("お問い合わせ", {
      x: cX, y: actY + 0.2, w: actW, h: 0.4,
      fontSize: 12, fontFace: FB, color: C.navyT2, align: "center", bold: true, charSpacing: 3, margin: 0,
    });
    s.addText("直接ご相談も承ります", {
      x: cX, y: actY + 0.62, w: actW, h: 0.45,
      fontSize: 17, fontFace: FH, color: C.white, align: "center", bold: true, margin: 0,
    });
    s.addText("shibahara.724@gmail.com", {
      x: cX, y: actY + 1.2, w: actW, h: 0.4,
      fontSize: 13, fontFace: FB, color: C.white, align: "center", margin: 0,
    });

    s.addText("カード登録不要 / 登録から3分で利用開始 / 月額 ¥4,980〜", {
      x: MARGIN, y: 6.7, w: CONTENT_W, h: 0.35,
      fontSize: 12, fontFace: FB, color: C.navyT2, align: "center", margin: 0,
    });
  }

  // ─── Save ───
  const out = "C:\\Users\\shiba\\OneDrive\\Desktop\\サロン\\hair-salon-link\\HairSalonLink_パンフレット_A4.pptx";
  await p.writeFile({ fileName: out });
  console.log("SAVED: " + out);
}

main().catch(e => { console.error(e); process.exit(1); });
