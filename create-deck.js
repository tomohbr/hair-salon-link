const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaChartLine, FaCut, FaPaperPlane, FaUsers, FaCalendarCheck, FaImages,
  FaStore, FaShieldAlt, FaArrowRight, FaCheck, FaTimes,
  FaClock, FaYenSign, FaLightbulb,
} = require("react-icons/fa");

// ─── Design System ───
const C = {
  white:  "FFFFFF",
  bg:     "F7F6F3",
  card:   "FFFFFF",
  bdr:    "E5E1DB",
  bdrHi:  "C9C2B8",
  ink:    "0F1419",
  body:   "3B3B3B",
  muted:  "7A7A7A",
  light:  "B0B0B0",
  blue:   "1F5F80",
  blueL:  "E8F0F5",
  blueD:  "164660",
  navy:   "0F1C2E",
  navyL:  "1A2D47",
  navyT:  "78909C",
  navyT2: "B0BEC5",  // brighter navy text
  warm:   "B8924F",
  warmL:  "FAF3E5",
  green:  "1A7A5C",
  greenL: "E6F4EE",
  red:    "B54343",
  redL:   "FCEAEA",
  amber:  "D68A2B",
  rose:   "C25656",
};
const FH = "Georgia";
const FB = "Calibri";

function svg(Ic, color, sz = 256) {
  const s = ReactDOMServer.renderToStaticMarkup(React.createElement(Ic, { color, size: String(sz) }));
  return sharp(Buffer.from(s)).png().toBuffer().then(b => "image/png;base64," + b.toString("base64"));
}

// ─── Layout Constants ───
const SLIDE_W = 10, SLIDE_H = 5.625;
const MARGIN = 0.6;
const CONTENT_W = SLIDE_W - MARGIN * 2;

function eyebrow(s, text, y = 0.5) {
  s.addText(text, {
    x: MARGIN, y, w: CONTENT_W, h: 0.28,
    fontSize: 9, fontFace: FB, color: C.blue, charSpacing: 5, bold: true, margin: 0,
  });
}

/** Heading with explicit line breaks (use \n for controlled wraps). */
function heading(s, text, y = 0.85, size = 26, lineHeight = 1.25) {
  // Count lines based on \n
  const lines = text.split("\n").length;
  s.addText(text, {
    x: MARGIN, y, w: CONTENT_W, h: 0.5 + lines * 0.45,
    fontSize: size, fontFace: FH, color: C.ink,
    lineSpacingMultiple: lineHeight, margin: 0,
  });
}

function lede(s, text, y, w = CONTENT_W, color = C.body) {
  s.addText(text, {
    x: MARGIN, y, w, h: 1.2,
    fontSize: 12.5, fontFace: FB, color, lineSpacingMultiple: 1.75, margin: 0,
  });
}

function chrome(s, p, n) {
  s.addShape(p.shapes.LINE, { x: MARGIN, y: SLIDE_H - 0.5, w: CONTENT_W, h: 0, line: { color: C.bdr, width: 0.4 } });
  s.addText("HairSalonLink", {
    x: MARGIN, y: SLIDE_H - 0.4, w: 2, h: 0.25,
    fontSize: 8, fontFace: FH, color: C.blue, bold: true, margin: 0,
  });
  s.addText(`${String(n).padStart(2, "0")} / 12`, {
    x: SLIDE_W - MARGIN - 1, y: SLIDE_H - 0.4, w: 1, h: 0.25,
    fontSize: 8, fontFace: FB, color: C.light, align: "right", margin: 0,
  });
}

function cite(s, text, y = SLIDE_H - 0.75) {
  s.addText(text, {
    x: MARGIN, y, w: CONTENT_W, h: 0.2,
    fontSize: 7.5, fontFace: FB, color: C.light, margin: 0,
  });
}

async function main() {
  const p = new pptxgen();
  p.layout = "LAYOUT_16x9";
  p.author = "HairSalonLink";
  p.title = "HairSalonLink — Pitch Deck";
  p.company = "HairSalonLink";

  const ic = {
    cal:   await svg(FaCalendarCheck, `#${C.blue}`),
    usr:   await svg(FaUsers, `#${C.blue}`),
    cht:   await svg(FaChartLine, `#${C.blue}`),
    cut:   await svg(FaCut, `#${C.blue}`),
    snd:   await svg(FaPaperPlane, `#${C.blue}`),
    img:   await svg(FaImages, `#${C.blue}`),
    store: await svg(FaStore, `#${C.blue}`),
    shield:await svg(FaShieldAlt, `#${C.blue}`),
    arrow: await svg(FaArrowRight, `#${C.muted}`),
    arrowB:await svg(FaArrowRight, `#${C.blue}`),
    arrowG:await svg(FaArrowRight, `#${C.green}`),
    check: await svg(FaCheck, `#${C.green}`),
    times: await svg(FaTimes, `#${C.red}`),
    clock: await svg(FaClock, `#${C.warm}`),
    yen:   await svg(FaYenSign, `#${C.red}`),
    lb:    await svg(FaLightbulb, `#${C.warm}`),
  };

  // ════════════════════════════════════════════════════
  //  01 — COVER
  // ════════════════════════════════════════════════════
  {
    const s = p.addSlide();
    s.background = { color: C.navy };
    s.addShape(p.shapes.RECTANGLE, { x: 0, y: 0, w: SLIDE_W, h: 0.05, fill: { color: C.blue } });
    s.addShape(p.shapes.RECTANGLE, { x: 0, y: SLIDE_H - 0.05, w: SLIDE_W, h: 0.05, fill: { color: C.blue } });

    s.addText("FOR SMALL HAIR SALONS   2026", {
      x: MARGIN, y: 0.95, w: CONTENT_W, h: 0.3,
      fontSize: 9, fontFace: FB, color: C.navyT, charSpacing: 5, align: "center", margin: 0,
    });

    s.addText("HairSalonLink", {
      x: MARGIN, y: 1.5, w: CONTENT_W, h: 0.95,
      fontSize: 52, fontFace: FH, color: C.white, align: "center",
    });

    s.addText("広告に頼り続ける経営から、降りる。", {
      x: MARGIN, y: 2.55, w: CONTENT_W, h: 0.5,
      fontSize: 17, fontFace: FB, color: C.navyT2, align: "center",
    });

    s.addText("小規模美容室のための、月額 ¥4,980 から始める顧客管理 SaaS。", {
      x: MARGIN, y: 3.05, w: CONTENT_W, h: 0.4,
      fontSize: 11, fontFace: FB, color: C.navyT, align: "center",
    });

    const cw = 2.4, gap = 0.3;
    const tw = cw * 3 + gap * 2;
    const sx = (SLIDE_W - tw) / 2;
    const kn = [
      { n: "¥0",          l: "初期費用" },
      { n: "¥4,980",      l: "月額 (税別)" },
      { n: "解約自由",    l: "契約縛りなし" },
    ];
    kn.forEach((k, i) => {
      const x = sx + i * (cw + gap);
      s.addShape(p.shapes.RECTANGLE, { x, y: 3.85, w: cw, h: 1.1, fill: { color: C.navyL } });
      s.addText(k.n, {
        x, y: 3.95, w: cw, h: 0.55,
        fontSize: 22, fontFace: FH, color: C.white, align: "center", bold: true, margin: 0,
      });
      s.addText(k.l, {
        x, y: 4.55, w: cw, h: 0.3,
        fontSize: 9, fontFace: FB, color: C.navyT2, align: "center", margin: 0, charSpacing: 1,
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
    heading(s, "小規模美容室のオーナーは、\n夜になっても店から離れられない。", 0.85, 26);

    s.addText(
      "5名以下のサロンでは、施術以外の業務がオーナーに集中する。\n" +
      "営業後の1〜2時間は、紙カルテの整理・LINEでの予約対応・HPB管理画面の更新・売上集計に費やされる。\n" +
      "それは、本来、自分や家族のための時間だったはずだ。",
      { x: MARGIN, y: 1.95, w: CONTENT_W, h: 1.3,
        fontSize: 12, fontFace: FB, color: C.body, lineSpacingMultiple: 1.85, margin: 0 }
    );

    // Timeline
    const tlY = 3.75;
    s.addShape(p.shapes.LINE, { x: MARGIN + 0.3, y: tlY, w: CONTENT_W - 0.6, h: 0, line: { color: C.bdr, width: 1 } });
    const events = [
      { t: "10:00", l: "開店",         c: C.muted, bold: false },
      { t: "13:00", l: "ランチ施術",   c: C.muted, bold: false },
      { t: "19:00", l: "営業終了",     c: C.muted, bold: false },
      { t: "19:30", l: "LINE返信開始", c: C.amber, bold: true },
      { t: "20:30", l: "カルテ整理",   c: C.rose, bold: true },
      { t: "21:30", l: "やっと帰宅",   c: C.red, bold: true },
    ];
    const lineStart = MARGIN + 0.3;
    const lineEnd = SLIDE_W - MARGIN - 0.3;
    const step = (lineEnd - lineStart) / (events.length - 1);
    events.forEach((e, i) => {
      const cx = lineStart + i * step;
      s.addShape(p.shapes.OVAL, { x: cx - 0.08, y: tlY - 0.08, w: 0.16, h: 0.16, fill: { color: e.c } });
      s.addText(e.t, {
        x: cx - 0.55, y: tlY + 0.2, w: 1.1, h: 0.25,
        fontSize: 9, fontFace: FH, color: e.c, align: "center", bold: true, margin: 0,
      });
      s.addText(e.l, {
        x: cx - 0.7, y: tlY + 0.45, w: 1.4, h: 0.28,
        fontSize: 9.5, fontFace: FB, color: e.bold ? C.ink : C.muted, align: "center", bold: e.bold, margin: 0,
      });
    });

    s.addText("終業後の 2時間半 を、事務作業が奪っている。", {
      x: MARGIN, y: 4.65, w: CONTENT_W, h: 0.3,
      fontSize: 10.5, fontFace: FB, color: C.red, bold: true, align: "center", margin: 0,
    });

    chrome(s, p, 2);
  }

  // ════════════════════════════════════════════════════
  //  03 — THE NUMBERS
  // ════════════════════════════════════════════════════
  {
    const s = p.addSlide();
    s.background = { color: C.white };
    eyebrow(s, "THE NUMBERS");
    heading(s, "ホットペッパーの広告費は、\n年間 40〜60万円 に達する。", 0.85, 26);

    // Left: cost breakdown (pushed down to clear heading)
    s.addText("広告費の構造", {
      x: MARGIN, y: 2.45, w: 4.4, h: 0.3,
      fontSize: 11, fontFace: FH, color: C.ink, bold: true, margin: 0,
    });

    const calc = [
      { l: "ライトプラン(最安)", v: "¥25,000 / 月" },
      { l: "× 12ヶ月",           v: "¥300,000 / 年" },
      { l: "ネット予約成果課金(推定)", v: "+ ¥10〜30万 / 年" },
    ];
    calc.forEach((c, i) => {
      const y = 2.85 + i * 0.38;
      s.addText(c.l, { x: MARGIN, y, w: 2.6, h: 0.3, fontSize: 10, fontFace: FB, color: C.body, margin: 0 });
      s.addText(c.v, { x: MARGIN + 2.6, y, w: 1.8, h: 0.3, fontSize: 11, fontFace: FH, color: C.ink, bold: true, align: "right", margin: 0 });
    });
    s.addShape(p.shapes.LINE, { x: MARGIN, y: 4.05, w: 4.4, h: 0, line: { color: C.bdr, width: 0.6 } });
    s.addText("合計 (年間 広告費)", {
      x: MARGIN, y: 4.15, w: 2.6, h: 0.4,
      fontSize: 11, fontFace: FB, color: C.body, bold: true, margin: 0,
    });
    s.addText("¥40〜60万", {
      x: MARGIN + 2.6, y: 4.13, w: 1.8, h: 0.45,
      fontSize: 19, fontFace: FH, color: C.red, bold: true, align: "right", margin: 0,
    });

    // Right: punchline (pushed down to clear heading)
    s.addShape(p.shapes.RECTANGLE, { x: 5.6, y: 2.45, w: 3.8, h: 2.3, fill: { color: C.warmL } });
    s.addShape(p.shapes.RECTANGLE, { x: 5.6, y: 2.45, w: 0.08, h: 2.3, fill: { color: C.warm } });
    s.addText("年商 1,000万円のサロンで、", {
      x: 5.85, y: 2.55, w: 3.4, h: 0.3,
      fontSize: 10, fontFace: FB, color: C.body, margin: 0,
    });
    s.addText("売上の 4〜6% を、", {
      x: 5.85, y: 2.87, w: 3.4, h: 0.4,
      fontSize: 16, fontFace: FH, color: C.ink, bold: true, margin: 0,
    });
    s.addText("HPB の広告費が占める。", {
      x: 5.85, y: 3.25, w: 3.4, h: 0.4,
      fontSize: 16, fontFace: FH, color: C.ink, bold: true, margin: 0,
    });
    s.addText(
      "しかも、LINEで繋がった常連客がHPB経由で予約しても、紹介手数料は発生し続ける。広告費は、新規だけのコストではない。",
      { x: 5.85, y: 3.75, w: 3.4, h: 1.0, fontSize: 9.5, fontFace: FB, color: C.body, lineSpacingMultiple: 1.6, margin: 0 }
    );

    cite(s, "出典: ホットペッパービューティー公開料金(ライトプラン¥25,000/月〜) / 業界ヒアリング");
    chrome(s, p, 3);
  }

  // ════════════════════════════════════════════════════
  //  04 — WHY IT'S BROKEN
  // ════════════════════════════════════════════════════
  {
    const s = p.addSlide();
    s.background = { color: C.bg };
    eyebrow(s, "WHY IT'S BROKEN");
    heading(s, "問題は「ツールがない」のではなく、\n「ツールが分散している」こと。", 0.85, 24);

    s.addText(
      "多くの小規模サロンは、HPB管理画面・個人LINE・紙カルテ・Excel・SNS の5つを行き来している。\n" +
      "1つにまとまっていないから、データが繋がらず、判断ができず、時間が消える。",
      { x: MARGIN, y: 2.05, w: CONTENT_W, h: 1.0,
        fontSize: 11.5, fontFace: FB, color: C.body, lineSpacingMultiple: 1.85, margin: 0 }
    );

    // 5 disconnected tool cards
    const tools = [
      { name: "HPB",       sub: "予約・広告" },
      { name: "LINE",      sub: "顧客対応" },
      { name: "紙カルテ",   sub: "薬剤履歴" },
      { name: "Excel",     sub: "売上管理" },
      { name: "SNS",       sub: "宣伝" },
    ];
    const tw = 1.5, tg = 0.18;
    const ttw = tw * 5 + tg * 4;
    const tsx = (SLIDE_W - ttw) / 2;
    tools.forEach((t, i) => {
      const x = tsx + i * (tw + tg);
      s.addShape(p.shapes.RECTANGLE, { x, y: 3.55, w: tw, h: 1.0, fill: { color: C.card }, line: { color: C.bdr, width: 0.5 } });
      s.addText(t.name, {
        x, y: 3.65, w: tw, h: 0.35,
        fontSize: 11, fontFace: FB, color: C.ink, align: "center", bold: true, margin: 0,
      });
      s.addText(t.sub, { x, y: 4.0, w: tw, h: 0.3, fontSize: 9, fontFace: FB, color: C.muted, align: "center", margin: 0 });
      if (i < tools.length - 1) {
        s.addText("×", {
          x: x + tw, y: 3.88, w: tg, h: 0.35,
          fontSize: 16, fontFace: FB, color: C.red, align: "center", bold: true, margin: 0,
        });
      }
    });

    s.addText("データが繋がらない → 同じ顧客が二重登録 → 判断材料にならない", {
      x: MARGIN, y: 4.7, w: CONTENT_W, h: 0.25,
      fontSize: 10.5, fontFace: FB, color: C.red, align: "center", bold: true, margin: 0,
    });

    chrome(s, p, 4);
  }

  // ════════════════════════════════════════════════════
  //  05 — SOLUTION
  // ════════════════════════════════════════════════════
  {
    const s = p.addSlide();
    s.background = { color: C.white };
    eyebrow(s, "SOLUTION");
    heading(s, "5つのツールを、1つの管理画面に。", 0.85, 28);

    s.addText(
      "HairSalonLink は、予約・カルテ・LINE配信・分析を1画面に統合する顧客管理SaaS。\n" +
      "月額 ¥4,980 で、複数ツールの契約を1本化し、データを連結して経営判断の材料に変えます。",
      { x: MARGIN, y: 1.65, w: CONTENT_W, h: 1.0,
        fontSize: 12, fontFace: FB, color: C.body, lineSpacingMultiple: 1.75, margin: 0 }
    );

    // Left side: 5 separate tool cards stacked cleanly
    const fromItems = ["HPB (予約・広告)", "LINE (顧客対応)", "紙カルテ (履歴)", "Excel (売上管理)", "SNS (宣伝)"];
    const fromX = MARGIN + 0.1;
    const fromTop = 3.0;
    fromItems.forEach((lbl, i) => {
      const y = fromTop + i * 0.35;
      s.addShape(p.shapes.RECTANGLE, { x: fromX, y, w: 2.7, h: 0.3, fill: { color: C.bg }, line: { color: C.bdr, width: 0.4 } });
      s.addText(lbl, { x: fromX + 0.15, y, w: 2.55, h: 0.3, fontSize: 9.5, fontFace: FB, color: C.body, bold: false, valign: "middle", margin: 0 });
    });

    // Center arrow with gradient-like effect
    s.addImage({ data: ic.arrowB, x: 3.95, y: 3.9, w: 0.5, h: 0.5 });

    // Right: converged box
    const toX = 5.2, toY = 2.95;
    s.addShape(p.shapes.RECTANGLE, { x: toX, y: toY, w: 4.2, h: 2.0, fill: { color: C.blueL }, line: { color: C.blue, width: 1.2 } });
    s.addShape(p.shapes.RECTANGLE, { x: toX, y: toY, w: 0.1, h: 2.0, fill: { color: C.blue } });
    s.addText("HairSalonLink", {
      x: toX + 0.3, y: toY + 0.2, w: 3.8, h: 0.45,
      fontSize: 18, fontFace: FH, color: C.blue, bold: true, margin: 0,
    });
    s.addText("1つの管理画面で、すべて完結。", {
      x: toX + 0.3, y: toY + 0.7, w: 3.8, h: 0.4,
      fontSize: 13, fontFace: FH, color: C.ink, bold: true, margin: 0,
    });
    s.addText(
      "予約 / カルテ / LINE配信 / 分析 を、\n同じ顧客データに紐づけて一元管理。",
      { x: toX + 0.3, y: toY + 1.15, w: 3.8, h: 0.7, fontSize: 10, fontFace: FB, color: C.body, lineSpacingMultiple: 1.7, margin: 0 }
    );

    chrome(s, p, 5);
  }

  // ════════════════════════════════════════════════════
  //  06 — THE INSIGHT (Unique KPI)
  // ════════════════════════════════════════════════════
  {
    const s = p.addSlide();
    s.background = { color: C.bg };
    eyebrow(s, "THE INSIGHT");
    heading(s, "他社にない指標 ── HPB→自社 移行率。", 0.85, 26);

    s.addText(
      "「HPBの広告を減らしても、お客様は戻ってきてくれるか？」\n" +
      "これは経営判断の核心の問いです。HairSalonLink は、その答えを数字で出します。",
      { x: MARGIN, y: 1.7, w: CONTENT_W, h: 1.0,
        fontSize: 12, fontFace: FB, color: C.body, lineSpacingMultiple: 1.75, margin: 0 }
    );

    const boxY = 2.95;
    s.addShape(p.shapes.RECTANGLE, { x: MARGIN, y: boxY, w: CONTENT_W, h: 1.85, fill: { color: C.card }, line: { color: C.bdr, width: 0.5 } });
    s.addShape(p.shapes.RECTANGLE, { x: MARGIN, y: boxY, w: 0.08, h: 1.85, fill: { color: C.blue } });

    // Big metric — cleaner framing
    s.addText("HPB → 自社 移行率", {
      x: MARGIN + 0.3, y: boxY + 0.2, w: 4, h: 0.3,
      fontSize: 10, fontFace: FB, color: C.muted, charSpacing: 2, bold: true, margin: 0,
    });
    s.addText([
      { text: "57", options: { fontSize: 60, fontFace: FH, color: C.blue, bold: true } },
      { text: "%", options: { fontSize: 28, fontFace: FH, color: C.blue, bold: true } },
    ], { x: MARGIN + 0.3, y: boxY + 0.5, w: 3.8, h: 1.1, margin: 0 });

    // Right: explanation
    const expX = MARGIN + 4.2;
    s.addText("この数字の読み方", {
      x: expX, y: boxY + 0.2, w: 4.6, h: 0.3,
      fontSize: 10, fontFace: FB, color: C.muted, charSpacing: 2, bold: true, margin: 0,
    });
    s.addText("HPB経由の新規客のうち 57% が、\n次回をLINEや自社で予約した。", {
      x: expX, y: boxY + 0.55, w: 4.6, h: 0.75,
      fontSize: 12.5, fontFace: FH, color: C.ink, bold: true, lineSpacingMultiple: 1.4, margin: 0,
    });
    s.addText(
      "→ HPB広告を月¥10,000減らせる根拠になる。\n→ 移行率が低ければ、LINE登録誘導の改善余地が見える。",
      { x: expX, y: boxY + 1.3, w: 4.6, h: 0.55, fontSize: 10, fontFace: FB, color: C.body, lineSpacingMultiple: 1.65, margin: 0 }
    );

    cite(s, "※ 画面内の数値はデモサロンの例です。実際の数値は店舗の運用により変動します。");
    chrome(s, p, 6);
  }

  // ════════════════════════════════════════════════════
  //  07 — PRODUCT
  // ════════════════════════════════════════════════════
  {
    const s = p.addSlide();
    s.background = { color: C.white };
    eyebrow(s, "PRODUCT");
    heading(s, "小規模の運用に必要な、6つの機能。", 0.85, 26);

    const feats = [
      { ic: ic.cal,   t: "LINE予約・リマインド",     d: "LIFF対応・自動受付・自動リマインド" },
      { ic: ic.usr,   t: "予約カレンダー統合",       d: "HPB / LINE / Web を1画面に集約" },
      { ic: ic.cht,   t: "HPB→自社 移行率追跡",       d: "独自KPIで広告判断の材料を可視化" },
      { ic: ic.cut,   t: "薬剤履歴カルテ",           d: "ブランド・比率・アレルギー・DL 1-5" },
      { ic: ic.snd,   t: "セグメント別LINE配信",     d: "休眠 / VIP / 初回 の条件指定で配信" },
      { ic: ic.img,   t: "スタイルギャラリー",       d: "撮影写真からそのまま予約に導線" },
    ];
    // Equal grid: 6 cards in 2×3, with consistent gaps
    const gridTop = 1.85;
    const cardW = 2.85, cardH = 1.35, gapX = 0.1, gapY = 0.2;
    feats.forEach((f, i) => {
      const col = i % 3, row = Math.floor(i / 3);
      const x = MARGIN + col * (cardW + gapX);
      const y = gridTop + row * (cardH + gapY);
      s.addShape(p.shapes.RECTANGLE, { x, y, w: cardW, h: cardH, fill: { color: C.bg }, line: { color: C.bdr, width: 0.5 } });
      s.addShape(p.shapes.OVAL, { x: x + 0.2, y: y + 0.2, w: 0.5, h: 0.5, fill: { color: C.blueL } });
      s.addImage({ data: f.ic, x: x + 0.29, y: y + 0.29, w: 0.32, h: 0.32 });
      s.addText(f.t, {
        x: x + 0.8, y: y + 0.23, w: cardW - 0.95, h: 0.4,
        fontSize: 11.5, fontFace: FH, color: C.ink, bold: true, margin: 0,
      });
      s.addText(f.d, {
        x: x + 0.2, y: y + 0.78, w: cardW - 0.4, h: 0.5,
        fontSize: 9.5, fontFace: FB, color: C.body, lineSpacingMultiple: 1.55, margin: 0,
      });
    });

    chrome(s, p, 7);
  }

  // ════════════════════════════════════════════════════
  //  08 — vs ALTERNATIVES
  // ════════════════════════════════════════════════════
  {
    const s = p.addSlide();
    s.background = { color: C.bg };
    eyebrow(s, "VS ALTERNATIVES");
    heading(s, "主要ツールとの比較で、優位性を示す。", 0.85, 26);

    const headers = ["項目", "Excel /\n紙カルテ", "汎用予約\nSaaS", "HairSalonLink"];
    const rows = [
      ["月額コスト",         "¥0",        "¥8,000〜¥21,000", "¥4,980"],
      ["初期費用",           "¥0",        "¥0〜¥100,000",    "¥0"],
      ["LINE連携",           "—",         "△",              "○"],
      ["薬剤履歴カルテ",     "△",         "△",              "○"],
      ["HPB→自社 移行率",    "—",         "—",              "○"],
      ["小規模特化UI",       "—",         "△",              "○"],
      ["契約縛り",           "—",         "年契約多い",      "なし"],
    ];

    const tx = MARGIN, ty = 2.0;
    // Widen the 4th column so "HairSalonLink" fits on one line
    const colW = [2.3, 1.85, 1.85, 2.8];

    // Header
    let cx = tx;
    headers.forEach((h, i) => {
      const isUs = i === 3;
      s.addShape(p.shapes.RECTANGLE, {
        x: cx, y: ty, w: colW[i], h: 0.55,
        fill: { color: isUs ? C.blue : "D6D0C5" },
      });
      s.addText(h, {
        x: cx + 0.1, y: ty, w: colW[i] - 0.2, h: 0.55,
        fontSize: i === 0 ? 10 : 10.5,
        fontFace: FB, color: isUs ? C.white : C.ink,
        align: i === 0 ? "left" : "center",
        bold: true, valign: "middle", margin: 0,
      });
      cx += colW[i];
    });

    // Body
    rows.forEach((r, ri) => {
      const ry = ty + 0.55 + ri * 0.35;
      let rx = tx;
      r.forEach((cell, ci) => {
        const isUs = ci === 3;
        s.addShape(p.shapes.RECTANGLE, {
          x: rx, y: ry, w: colW[ci], h: 0.35,
          fill: { color: isUs ? C.blueL : (ri % 2 === 0 ? C.card : C.bg) },
          line: { color: C.bdr, width: 0.3 },
        });
        let color = C.body, weight = false;
        if (cell === "○") { color = C.green; weight = true; }
        else if (cell === "△") { color = C.warm; weight = true; }
        else if (cell === "—") { color = C.light; }
        if (isUs) { color = C.blueD; weight = true; }
        s.addText(cell, {
          x: rx + 0.12, y: ry, w: colW[ci] - 0.24, h: 0.35,
          fontSize: 10, fontFace: FB, color, bold: weight,
          align: ci === 0 ? "left" : "center", valign: "middle", margin: 0,
        });
        rx += colW[ci];
      });
    });

    cite(s, "出典: 各社公開料金・公式情報より作成(2026年4月時点)。");
    chrome(s, p, 8);
  }

  // ════════════════════════════════════════════════════
  //  09 — ROI
  // ════════════════════════════════════════════════════
  {
    const s = p.addSlide();
    s.background = { color: C.white };
    eyebrow(s, "RETURN ON INVESTMENT");
    heading(s, "月額 ¥4,980 が、何で回収できるか。", 0.85, 26);

    s.addText(
      "費用対効果を、「広告費の削減」「事務時間の削減」「ペイバック期間」の3つで定量化します。",
      { x: MARGIN, y: 1.7, w: CONTENT_W, h: 0.5,
        fontSize: 11.5, fontFace: FB, color: C.body, lineSpacingMultiple: 1.7, margin: 0 }
    );

    // 3 cards — unified title color
    const cards = [
      {
        label: "広告費の削減",
        big: "¥10,000",
        unit: "/ 月",
        body: "HPB→自社移行率が 10pt 上がれば、HPB広告予算を月1万円減らせる試算。",
        stripe: C.red,
      },
      {
        label: "事務時間の削減",
        big: "20時間",
        unit: "/ 月",
        body: "営業後の予約対応・カルテ整理・売上集計を統合。1日40分 × 30営業日。",
        stripe: C.warm,
      },
      {
        label: "ペイバック期間",
        big: "0.5",
        unit: "ヶ月未満",
        body: "上記2項目だけで、Standard プランは月額の数倍の効果が見込める。",
        stripe: C.blue,
      },
    ];
    const cgap = 0.15;
    const cW = (CONTENT_W - cgap * 2) / 3;
    cards.forEach((c, i) => {
      const x = MARGIN + i * (cW + cgap);
      s.addShape(p.shapes.RECTANGLE, { x, y: 2.55, w: cW, h: 2.2, fill: { color: C.bg }, line: { color: C.bdr, width: 0.5 } });
      s.addShape(p.shapes.RECTANGLE, { x, y: 2.55, w: cW, h: 0.08, fill: { color: c.stripe } });
      // Unified label color (ink muted), stripe on top provides categorization
      s.addText(c.label, {
        x: x + 0.2, y: 2.73, w: cW - 0.4, h: 0.3,
        fontSize: 10, fontFace: FB, color: C.muted, bold: true, charSpacing: 2, margin: 0,
      });
      s.addText([
        { text: c.big, options: { fontSize: 28, fontFace: FH, color: C.ink, bold: true } },
        { text: " " + c.unit, options: { fontSize: 11, fontFace: FB, color: C.muted } },
      ], { x: x + 0.2, y: 3.1, w: cW - 0.4, h: 0.55, margin: 0 });
      s.addText(c.body, {
        x: x + 0.2, y: 3.75, w: cW - 0.4, h: 0.95,
        fontSize: 9.5, fontFace: FB, color: C.body, lineSpacingMultiple: 1.65, margin: 0,
      });
    });

    cite(s, "※ 効果は店舗の運用状況により変動します。試算は標準的な小規模サロンを想定。");
    chrome(s, p, 9);
  }

  // ════════════════════════════════════════════════════
  //  10 — PRICING
  // ════════════════════════════════════════════════════
  {
    const s = p.addSlide();
    s.background = { color: C.bg };
    eyebrow(s, "PRICING");
    heading(s, "まずは無料から。必要になったら月額へ。", 0.85, 26);

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

    const pgap = 0.2;
    const pW = (CONTENT_W - pgap * 2) / 3;
    plans.forEach((pl, i) => {
      const x = MARGIN + i * (pW + pgap);
      const bgC = pl.hl ? C.blue : C.card;
      const bdC = pl.hl ? C.blue : C.bdr;
      const tc  = pl.hl ? C.white : C.ink;
      const sc  = pl.hl ? C.navyT2 : C.muted;
      const bc  = pl.hl ? "E8F0F5" : C.body;

      s.addShape(p.shapes.RECTANGLE, { x, y: 1.85, w: pW, h: 3.15, fill: { color: bgC }, line: { color: bdC, width: pl.hl ? 0 : 0.5 } });

      if (pl.hl) {
        s.addShape(p.shapes.RECTANGLE, { x: x + (pW - 1.75) / 2, y: 1.7, w: 1.75, h: 0.28, fill: { color: C.warm } });
        s.addText("RECOMMENDED", {
          x: x + (pW - 1.75) / 2, y: 1.7, w: 1.75, h: 0.28,
          fontSize: 7, fontFace: FB, color: C.white, align: "center", bold: true, charSpacing: 2, margin: 0,
        });
      }

      s.addText(pl.name, { x: x + 0.25, y: 2.0, w: pW - 0.5, h: 0.4, fontSize: 18, fontFace: FH, color: tc, bold: true, margin: 0 });
      s.addText(pl.desc, { x: x + 0.25, y: 2.35, w: pW - 0.5, h: 0.25, fontSize: 9, fontFace: FB, color: sc, margin: 0 });
      s.addText([
        { text: pl.price, options: { fontSize: 28, fontFace: FH, color: tc, bold: true } },
        { text: pl.sub, options: { fontSize: 9, fontFace: FB, color: sc } },
      ], { x: x + 0.25, y: 2.65, w: pW - 0.5, h: 0.55, margin: 0 });

      s.addText(pl.outcome, {
        x: x + 0.25, y: 3.22, w: pW - 0.5, h: 0.3,
        fontSize: 9, fontFace: FB, color: sc, margin: 0,
      });

      s.addShape(p.shapes.LINE, { x: x + 0.25, y: 3.55, w: pW - 0.5, h: 0, line: { color: pl.hl ? "4A8FAB" : C.bdr, width: 0.4 } });

      const items = pl.items.map((item, j) => ({
        text: "  " + item,
        options: { fontSize: 9.5, fontFace: FB, color: bc, bullet: { code: "2713" }, breakLine: j < pl.items.length - 1, paraSpaceAfter: 3 },
      }));
      s.addText(items, { x: x + 0.25, y: 3.65, w: pW - 0.5, h: 1.3, margin: 0, valign: "top" });
    });

    chrome(s, p, 10);
  }

  // ════════════════════════════════════════════════════
  //  11 — RISK REVERSAL
  // ════════════════════════════════════════════════════
  {
    const s = p.addSlide();
    s.background = { color: C.white };
    eyebrow(s, "WHY IT'S SAFE TO TRY");
    heading(s, "もし合わなかったら、\nいつでも、何も失わずにやめられる。", 0.85, 24);

    const risks = [
      { q: "契約してから後悔したら？",   a: "月単位で解約できます。違約金はありません。" },
      { q: "データを失わない？",         a: "解約後30日間、顧客データをCSVでエクスポートできます。" },
      { q: "カード情報を渡したくない",   a: "Freeプランはクレジットカード登録不要です。" },
      { q: "使いこなせるか不安",         a: "LINEを使えるなら大丈夫。アイコン中心のシンプルUI。" },
      { q: "既存データの移行は？",       a: "HPBのCSVをそのまま取込。電話番号で自動名寄せ。" },
    ];

    // Grid: fixed Q column width, arrow column, A column
    const tableY = 2.05;
    const rowH = 0.52;
    const qW = 3.5, aW = CONTENT_W - qW - 0.2;
    risks.forEach((r, i) => {
      const y = tableY + i * rowH;
      // Row background (zebra)
      s.addShape(p.shapes.RECTANGLE, {
        x: MARGIN, y, w: CONTENT_W, h: rowH - 0.05,
        fill: { color: i % 2 === 0 ? C.bg : C.white },
        line: { color: C.bdr, width: 0.3 },
      });
      // Question
      s.addText(`「${r.q}」`, {
        x: MARGIN + 0.2, y, w: qW - 0.2, h: rowH - 0.05,
        fontSize: 10.5, fontFace: FH, color: C.ink, bold: true, valign: "middle", margin: 0,
      });
      // Arrow (fixed position)
      s.addImage({ data: ic.arrowG, x: MARGIN + qW, y: y + (rowH - 0.05) / 2 - 0.1, w: 0.2, h: 0.2 });
      // Answer
      s.addText(r.a, {
        x: MARGIN + qW + 0.25, y, w: aW - 0.2, h: rowH - 0.05,
        fontSize: 10.5, fontFace: FB, color: C.body, valign: "middle", margin: 0,
      });
    });

    chrome(s, p, 11);
  }

  // ════════════════════════════════════════════════════
  //  12 — CTA
  // ════════════════════════════════════════════════════
  {
    const s = p.addSlide();
    s.background = { color: C.navy };
    s.addShape(p.shapes.RECTANGLE, { x: 0, y: 0, w: SLIDE_W, h: 0.05, fill: { color: C.blue } });
    s.addShape(p.shapes.RECTANGLE, { x: 0, y: SLIDE_H - 0.05, w: SLIDE_W, h: 0.05, fill: { color: C.blue } });

    s.addText("NEXT STEP", {
      x: MARGIN, y: 0.75, w: CONTENT_W, h: 0.3,
      fontSize: 9, fontFace: FB, color: C.navyT2, charSpacing: 5, align: "center", bold: true, margin: 0,
    });
    s.addText("今日30分で、明日の経営判断が変わる。", {
      x: MARGIN, y: 1.2, w: CONTENT_W, h: 0.7,
      fontSize: 28, fontFace: FH, color: C.white, align: "center",
    });
    s.addText(
      "Freeプラン登録 → HPBのCSVをアップロード → LINE予約URLを発行。\n" +
      "これだけで、明日からの予約データが1画面に蓄積されはじめます。",
      { x: MARGIN, y: 2.0, w: CONTENT_W, h: 0.9,
        fontSize: 12, fontFace: FB, color: C.navyT2, align: "center", lineSpacingMultiple: 1.75, margin: 0 }
    );

    // Two action boxes — demo + contact
    const actY = 3.2;
    const actW = 4.2, actH = 1.3, actGap = 0.2;
    const actTotalW = actW * 2 + actGap;
    const actX = (SLIDE_W - actTotalW) / 2;

    // Demo box
    s.addShape(p.shapes.RECTANGLE, { x: actX, y: actY, w: actW, h: actH, fill: { color: C.navyL } });
    s.addText("ベータ版デモ", {
      x: actX, y: actY + 0.12, w: actW, h: 0.3,
      fontSize: 10, fontFace: FB, color: C.navyT2, align: "center", bold: true, charSpacing: 2, margin: 0,
    });
    s.addText("今すぐブラウザで試せます", {
      x: actX, y: actY + 0.45, w: actW, h: 0.35,
      fontSize: 13, fontFace: FH, color: C.white, align: "center", bold: true, margin: 0,
    });
    s.addText("hair-salon-link-production.up.railway.app", {
      x: actX, y: actY + 0.85, w: actW, h: 0.3,
      fontSize: 10, fontFace: FB, color: C.white, align: "center", margin: 0,
    });

    // Contact box
    const cX = actX + actW + actGap;
    s.addShape(p.shapes.RECTANGLE, { x: cX, y: actY, w: actW, h: actH, fill: { color: C.blue } });
    s.addText("お問い合わせ", {
      x: cX, y: actY + 0.12, w: actW, h: 0.3,
      fontSize: 10, fontFace: FB, color: C.navyT2, align: "center", bold: true, charSpacing: 2, margin: 0,
    });
    s.addText("直接ご相談も承ります", {
      x: cX, y: actY + 0.45, w: actW, h: 0.35,
      fontSize: 13, fontFace: FH, color: C.white, align: "center", bold: true, margin: 0,
    });
    s.addText("shibahara.724@gmail.com", {
      x: cX, y: actY + 0.85, w: actW, h: 0.3,
      fontSize: 10, fontFace: FB, color: C.white, align: "center", margin: 0,
    });

    s.addText("カード登録不要 / 登録から3分で利用開始 / 月額 ¥4,980〜", {
      x: MARGIN, y: 4.7, w: CONTENT_W, h: 0.3,
      fontSize: 10, fontFace: FB, color: C.navyT2, align: "center", margin: 0,
    });
  }

  // ─── Save ───
  const out = "C:\\Users\\shiba\\OneDrive\\Desktop\\サロン\\hair-salon-link\\HairSalonLink_営業資料.pptx";
  await p.writeFile({ fileName: out });
  console.log("SAVED: " + out);
}

main().catch(e => { console.error(e); process.exit(1); });
