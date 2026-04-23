import Link from 'next/link';
import { Scissors, ArrowRight, Check, Shield, Zap, Users, TrendingUp, Clock, Database, Sparkles, Quote, Star } from 'lucide-react';
import RoiCalculator from './_landing/RoiCalculator';
import StickyMobileCta from './_landing/StickyMobileCta';
import Reveal from './_landing/Reveal';
import CountUp from './_landing/CountUp';

export const metadata = {
  title: 'HairSalonLink — 広告に頼らない経営へ。美容室専用の顧客管理ツール',
  description: 'HPB・LINE・自社HPの予約をひとつに。薬剤カルテ、指名料、HPB→自社転換率までを一画面で。初期費用¥0、月額¥4,980から。',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#14100c] text-[#efe3c8]">
      <Header />
      <TrustBar />
      <Hero />
      <SocialProof />
      <About />
      <Tour />
      <Features />
      <Comparison />
      <Roi />
      <CaseStudy />
      <Gallery />
      <Why />
      <Pricing />
      <HomepageOption />
      <Security />
      <FounderNote />
      <Faq />
      <FinalCta />
      <Footer />
      <StickyMobileCta />
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Header                                                    */
/* ────────────────────────────────────────────────────────── */

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#302519]/80 bg-[#14100c]/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm brand-bg flex items-center justify-center">
            <Scissors className="w-4 h-4 text-[#14100c]" strokeWidth={2} />
          </div>
          <div className="leading-tight">
            <div className="font-semibold tracking-tight text-[15px]">HairSalonLink</div>
            <div className="text-[9px] text-[#a89778] tracking-[0.18em] uppercase">for Hair Salons</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-[13px] text-[#a89778]">
          <Link href="#features" className="nav-link hover:text-[#efe3c8] transition">機能</Link>
          <Link href="#tour" className="nav-link hover:text-[#efe3c8] transition">画面ツアー</Link>
          <Link href="#compare" className="nav-link hover:text-[#efe3c8] transition">比較</Link>
          <Link href="#roi" className="nav-link hover:text-[#efe3c8] transition">試算</Link>
          <Link href="#pricing" className="nav-link hover:text-[#efe3c8] transition">料金</Link>
          <Link href="#faq" className="nav-link hover:text-[#efe3c8] transition">FAQ</Link>
          <Link href="/login" className="nav-link hover:text-[#efe3c8] transition">ログイン</Link>
        </nav>
        <Link
          href="/register"
          className="hidden sm:inline-flex items-center gap-1.5 text-[12px] font-medium tracking-wider px-4 py-2 brand-bg text-[#14100c] hover:opacity-90 transition"
        >
          無料ではじめる
        </Link>
      </div>
    </header>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Trust Bar — immediately under header                      */
/* ────────────────────────────────────────────────────────── */

function TrustBar() {
  const items = [
    { icon: Zap, label: '導入 30 分で開始' },
    { icon: Shield, label: '初期費用 ¥0 / 縛りなし' },
    { icon: Database, label: 'HPB CSV をそのまま取込' },
    { icon: Users, label: '美容室特化設計' },
  ];
  return (
    <div className="border-b border-[#302519] bg-[#1a1511]">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-3 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[11px] text-[#a89778] tracking-wide">
        <span className="inline-flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#c9a675] opacity-60 pulse-brass" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#c9a675]" />
          </span>
          <span>全国でご導入中</span>
        </span>
        <span className="hidden sm:inline text-[#48382a]">·</span>
        {items.map((i) => {
          const Icon = i.icon;
          return (
            <div key={i.label} className="inline-flex items-center gap-1.5">
              <Icon className="w-3.5 h-3.5 brand-text" strokeWidth={2} />
              <span>{i.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Hero                                                      */
/* ────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative hero-bg overflow-hidden">
      {/* animated brass aurora */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full animate-aurora"
        style={{
          background:
            'radial-gradient(closest-side, rgba(201,166,117,0.20), rgba(122,46,43,0.06) 55%, transparent 75%)',
          filter: 'blur(30px)',
        }}
      />
      <div className="relative max-w-5xl mx-auto px-5 md:px-8 pt-20 pb-20 md:pt-32 md:pb-28 text-center fade-up">
        <Reveal variant="fade" delay={0}>
          <div className="text-[10px] tracking-[0.32em] uppercase text-[#a89778] mb-8">
            HAIR SALON &nbsp;×&nbsp; LINE &nbsp;×&nbsp; HOT PEPPER
          </div>
        </Reveal>

        <Reveal variant="up" delay={80}>
          <h1 className="display-serif text-[38px] md:text-[72px] leading-[1.35] md:leading-[1.22] text-[#efe3c8]">
            広告に<span className="text-brass-sheen">依存しない店</span>へ、<br />
            静かに切り替えていく。
          </h1>
        </Reveal>

        <Reveal variant="up" delay={180}>
          <p className="mt-10 text-[14px] md:text-[16px] text-[#bdaa88] leading-[2.1] max-w-2xl mx-auto">
            ホットペッパーの広告費、紙カルテ、個人LINEでの返信——
            <br className="hidden md:block" />
            <span className="text-[#efe3c8]">毎月削られている経営の裏側を、一本の地図にまとめる。</span>
          </p>
        </Reveal>

        <Reveal variant="up" delay={280}>
          <div className="mt-12 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link href="/register" className="btn-cta">
              無料で HairSalonLink を始める
            </Link>
            <Link href="#tour" className="btn-cta-ghost">
              画面ツアーを見る
            </Link>
          </div>

          <div className="mt-6 text-[11px] text-[#7a6850]">
            クレジットカード登録不要 ・ 30 秒で開設
          </div>
        </Reveal>

        {/* Hero stats row — editorial hairline */}
        <div className="divider-brass mt-16 md:mt-20 max-w-3xl mx-auto" />
        <Reveal variant="up" delay={100}>
          <div className="grid grid-cols-3 max-w-3xl mx-auto divide-x divide-[#302519]/70">
            <StatCell label="初期費用">
              <span className="display-serif text-[24px] md:text-[36px] text-[#efe3c8]" style={{ letterSpacing: '-0.015em' }}>¥0</span>
            </StatCell>
            <StatCell label="導入完了まで">
              <CountUp
                to={30}
                durationMs={1400}
                format={(n) => `${n}分`}
                className="display-serif text-[24px] md:text-[36px] text-[#efe3c8] tabular-nums"
              />
            </StatCell>
            <StatCell label="月額 (税別)">
              <CountUp
                to={4980}
                durationMs={1600}
                format={(n) => `¥${n.toLocaleString('ja-JP')}〜`}
                className="display-serif text-[24px] md:text-[36px] text-[#efe3c8] tabular-nums"
              />
            </StatCell>
          </div>
        </Reveal>
        <div className="divider-brass max-w-3xl mx-auto" />

        <div className="mt-10">
          <Link href="/book/hair-salon-demo" className="inline-flex items-center gap-1.5 text-xs text-[#a89778] hover:text-[#efe3c8] transition underline underline-offset-4 decoration-[#48382a]">
            サンプル店舗の予約ページを見る
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function StatCell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="py-7 md:py-9">
      <div>{children}</div>
      <div className="mt-2 text-[10px] md:text-[11px] tracking-[0.24em] uppercase text-[#a89778]">{label}</div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Social Proof — city/店名 marquee (illustrative only)       */
/* ────────────────────────────────────────────────────────── */

function SocialProof() {
  const cities = ['熊本', '表参道', '恵比寿', '博多', '京都', '札幌', '仙台', '横浜', '神戸', '名古屋', '金沢', '那覇'];
  return (
    <section aria-hidden className="border-y border-[#302519] bg-[#1a1511] overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-5 flex items-center gap-6">
        <div className="shrink-0 text-[10px] tracking-[0.28em] uppercase text-[#a89778]">
          Built for salons across Japan
        </div>
        <div className="relative flex-1 overflow-hidden mask-fade">
          <div className="flex gap-10 whitespace-nowrap animate-marquee">
            {[...cities, ...cities].map((c, i) => (
              <span key={i} className="display-serif text-[15px] md:text-[17px] text-[#6b5b44]">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  About                                                     */
/* ────────────────────────────────────────────────────────── */

function About() {
  return (
    <section id="about" className="bg-[#1b1510] border-b border-[#302519]">
      <div className="max-w-3xl mx-auto px-5 md:px-8 py-24 md:py-32 text-center">
        <div className="eyebrow mb-8">ABOUT</div>
        <h2 className="display-serif text-[28px] md:text-[44px] leading-[1.55] md:leading-[1.45] mb-14">
          技術だけでは、<br />
          店は回らない。
        </h2>

        <div className="space-y-7 text-[14px] md:text-[15px] leading-[2.1] text-[#bdaa88] text-left md:text-center">
          <p>
            技術は確かだ。お客さまも、覚えていてくれる。
            それでも、毎月の広告費と、紙のカルテと、オーナー個人のLINEの返信が、小さな店を少しずつ削っていく。
            広告への依存から、少しずつ離れていくための地図が要る。
          </p>
          <p>
            HairSalonLink は、その削られる部分だけを、静かに引き受けるためのツール。
            予約、薬剤カルテ、指名料、LINE配信、そしてHPB経由の新規客が自社リピートに変わった割合——
            経営の裏側だけを静かに整える、そういう設計にしています。
          </p>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Tour — screenshot-style previews                          */
/* ────────────────────────────────────────────────────────── */

function Tour() {
  const tabs = [
    {
      name: '予約カレンダー',
      desc: 'HPB・LINE・自社HPからの予約が、色分けされてひとつのカレンダーに並びます。ダブルブッキングは物理的に起こせません。',
      mock: <MockCalendar />,
    },
    {
      name: '顧客カルテ',
      desc: '来店履歴・カラー剤の配合比率・アレルギー・ダメージレベル・担当指名・累計売上——お客さまひとりを、1画面で。',
      mock: <MockCustomer />,
    },
    {
      name: '売上ダッシュボード',
      desc: '日次売上、支払方法別内訳、客単価、HPB→自社転換率。会計後に自動反映されるので、月末の集計作業は消えます。',
      mock: <MockDashboard />,
    },
  ];

  return (
    <section id="tour" className="bg-[#14100c] border-b border-[#302519]">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-24 md:py-32">
        <div className="text-center mb-14 md:mb-20">
          <div className="eyebrow mb-6">PRODUCT TOUR</div>
          <h2 className="display-serif text-[28px] md:text-[44px] leading-[1.5] md:leading-[1.4]">
            現場で毎日ひらく、<br />
            3つの画面。
          </h2>
        </div>

        <div className="space-y-24 md:space-y-32">
          {tabs.map((t, i) => (
            <div
              key={t.name}
              className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center ${i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''}`}
            >
              <Reveal variant={i % 2 === 0 ? 'left' : 'right'}>
                <div>
                  <div className="text-[10px] tracking-[0.28em] uppercase text-[#c9a675] mb-4">
                    0{i + 1} — Screen
                  </div>
                  <h3 className="display-serif text-[24px] md:text-[32px] leading-[1.4] mb-5">
                    {t.name}
                  </h3>
                  <p className="text-[14px] md:text-[15px] leading-[2.05] text-[#bdaa88]">
                    {t.desc}
                  </p>
                  <Link
                    href="/register"
                    className="group mt-6 inline-flex items-center gap-1.5 text-[12px] tracking-[0.1em] text-[#c9a675] hover:text-[#efe3c8] transition"
                  >
                    この画面を実際に試す
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </Reveal>
              <Reveal variant={i % 2 === 0 ? 'right' : 'left'} delay={100}>
                <div className="relative tilt-hover">
                  <div className="absolute -inset-6 bg-gradient-to-br from-[#c9a675]/10 to-transparent blur-2xl" />
                  <div className="relative rounded-lg overflow-hidden border border-[#302519] bg-[#1a1511] shadow-[0_32px_64px_-24px_rgba(0,0,0,0.8)]">
                  {/* chrome */}
                  <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[#302519] bg-[#100c08]">
                    <span className="w-2 h-2 rounded-full bg-[#48382a]" />
                    <span className="w-2 h-2 rounded-full bg-[#48382a]" />
                    <span className="w-2 h-2 rounded-full bg-[#48382a]" />
                    <span className="ml-3 text-[9px] text-[#6b5b44] tracking-wider">hairsalonlink.app</span>
                  </div>
                  {t.mock}
                </div>
              </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MockCalendar() {
  const cells = Array.from({ length: 42 });
  const bookings: Record<number, { t: string; c: string }[]> = {
    8: [{ t: '10:00', c: 'bg-[#c9a675]/80' }],
    9: [{ t: '11:30', c: 'bg-emerald-500/70' }],
    14: [{ t: '09:00', c: 'bg-sky-500/70' }, { t: '13:00', c: 'bg-[#c9a675]/80' }],
    17: [{ t: '15:00', c: 'bg-emerald-500/70' }],
    22: [{ t: '11:00', c: 'bg-[#c9a675]/80' }, { t: '16:30', c: 'bg-sky-500/70' }],
    25: [{ t: '10:00', c: 'bg-[#c9a675]/80' }],
  };
  return (
    <div className="p-4 md:p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[11px] text-[#bdaa88]">2026 年 4 月</div>
        <div className="flex gap-1.5">
          <span className="inline-flex items-center gap-1 text-[9px] text-[#a89778]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a675]" /> HPB
          </span>
          <span className="inline-flex items-center gap-1 text-[9px] text-[#a89778]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> LINE
          </span>
          <span className="inline-flex items-center gap-1 text-[9px] text-[#a89778]">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" /> 自社
          </span>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-[9px]">
        {['日','月','火','水','木','金','土'].map((d) => (
          <div key={d} className="text-center text-[#a89778] py-1">{d}</div>
        ))}
        {cells.map((_, i) => {
          const day = i - 2;
          const has = bookings[day];
          return (
            <div key={i} className={`aspect-square rounded-sm border p-1 ${day > 0 && day <= 30 ? 'border-[#302519]' : 'border-transparent'}`}>
              {day > 0 && day <= 30 && (
                <>
                  <div className="text-[#bdaa88]">{day}</div>
                  <div className="flex flex-col gap-[2px] mt-[2px]">
                    {has?.map((b, j) => (
                      <div key={j} className={`h-[3px] rounded-sm ${b.c}`} />
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MockCustomer() {
  return (
    <div className="p-4 md:p-5 text-[11px]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a675] to-[#7a6547] flex items-center justify-center text-[14px] display-serif text-[#14100c]">M</div>
        <div>
          <div className="text-[13px] text-[#efe3c8]">宮田 結花 様</div>
          <div className="text-[10px] text-[#a89778]">累計 17 回来店 ・ 担当 中西</div>
        </div>
        <div className="ml-auto px-2 py-0.5 rounded-full bg-[#c9a675]/15 text-[9px] brand-text border border-[#c9a675]/30">VIP</div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { l: '累計売上', v: '¥238,400' },
          { l: '最終来店', v: '38 日前' },
          { l: '平均周期', v: '42 日' },
        ].map((k) => (
          <div key={k.l} className="rounded border border-[#302519] p-2">
            <div className="text-[8px] tracking-wide text-[#a89778] uppercase">{k.l}</div>
            <div className="text-[12px] text-[#efe3c8] mt-1">{k.v}</div>
          </div>
        ))}
      </div>
      <div className="rounded border border-[#302519] p-2.5 mb-2">
        <div className="text-[9px] text-[#a89778] mb-1.5 tracking-wide uppercase">薬剤カルテ (直近)</div>
        <div className="space-y-1 text-[10px] text-[#bdaa88]">
          <div>イルミナ ヌード 8 : オキシ 6% = 1 : 1.5 ・ 35 分放置</div>
          <div>スロウ アッシュ 7 ・ 根元 20 分 / 毛先 10 分</div>
        </div>
      </div>
      <div className="rounded border border-[#302519] p-2.5">
        <div className="text-[9px] text-[#a89778] mb-1 tracking-wide uppercase">アレルギー</div>
        <div className="text-[10px] text-red-300">ジアミン陽性 — 要パッチテスト</div>
      </div>
    </div>
  );
}

function MockDashboard() {
  const bars = [22, 38, 18, 55, 42, 61, 34, 47, 70, 45, 62, 80, 52, 68];
  return (
    <div className="p-4 md:p-5">
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { l: '今月売上', v: '¥1,284K', d: '+18%' },
          { l: '客単価', v: '¥8,950', d: '+3%' },
          { l: '転換率', v: '42.1%', d: '+5.2pt' },
        ].map((k) => (
          <div key={k.l} className="rounded border border-[#302519] p-2">
            <div className="text-[8px] tracking-wide text-[#a89778] uppercase">{k.l}</div>
            <div className="text-[13px] text-[#efe3c8] mt-0.5 display-serif">{k.v}</div>
            <div className="text-[9px] text-emerald-400 mt-0.5">{k.d}</div>
          </div>
        ))}
      </div>
      <div className="rounded border border-[#302519] p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[10px] text-[#bdaa88]">日別売上</div>
          <div className="text-[9px] text-[#a89778]">4/1 — 4/23</div>
        </div>
        <div className="flex items-end gap-[3px] h-16">
          {bars.map((h, i) => (
            <div
              key={i}
              className={`flex-1 rounded-t-sm ${i === bars.length - 1 ? 'bg-[#c9a675]' : 'bg-[#48382a]'}`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Features                                                  */
/* ────────────────────────────────────────────────────────── */

function Features() {
  const features = [
    { n: '01', title: '予約は、LINEから。', body: 'LINE公式アカウントからそのまま予約を受ける。LIFF対応でアプリ不要。前日のリマインドは自動で流れる。' },
    { n: '02', title: 'カレンダーは、ひとつ。', body: 'HPB・LINE・自社ホームページからの予約を、同じカレンダーに集める。既存データはCSV取込で移行できる。' },
    { n: '03', title: 'HPBからの流れを、追う。', body: 'HPB経由で来店した新規客のうち、次回をLINEや自社で予約した割合を、独自KPIで可視化する。広告費の判断材料として残しておく。' },
    { n: '04', title: '薬剤と、指名を、残す。', body: 'カラー剤の銘柄・比率・日付、アレルギー、ダメージレベル1〜5。Director / Top / Stylist / Junior / Assistant の5階層と、指名料の自動計算にも対応する。' },
    { n: '05', title: '配信は、撃ちすぎない。', body: '「休眠90日超」「VIP」「初回来店」など、条件に合う顧客だけにLINE配信する。必要な人に、必要なタイミングだけ届く。' },
    { n: '06', title: 'スタイルは、そのまま予約に。', body: '撮影した作品を並べておくと、お客さまは気になったスタイルから、そのまま予約に進める。ギャラリーと予約が、地続きになっている。' },
  ];

  return (
    <section id="features" className="bg-[#1b1510] border-y border-[#302519]">
      <div className="max-w-5xl mx-auto px-5 md:px-8 py-24 md:py-32">
        <div className="text-center mb-16 md:mb-20">
          <div className="eyebrow mb-6">FEATURES</div>
          <h2 className="display-serif text-[28px] md:text-[44px] leading-[1.5] md:leading-[1.4]">
            HairSalonLink で、<br className="md:hidden" />できること。
          </h2>
        </div>

        <div className="space-y-16 md:space-y-20">
          {features.map((f, idx) => (
            <Reveal key={f.n} variant="up" delay={idx * 60}>
              <div className="grid md:grid-cols-12 gap-6 md:gap-10 items-start group">
                <div className="md:col-span-3">
                  <div className="display-serif text-[40px] md:text-[56px] leading-none text-[#c9a675]/55 transition-all duration-500 group-hover:text-[#c9a675] group-hover:translate-x-1">{f.n}</div>
                </div>
                <div className="md:col-span-9">
                  <h3 className="display-serif text-[20px] md:text-[26px] leading-[1.5] mb-4">{f.title}</h3>
                  <p className="text-[14px] md:text-[15px] leading-[2.05] text-[#bdaa88]">{f.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Comparison                                                */
/* ────────────────────────────────────────────────────────── */

function Comparison() {
  const rows = [
    { label: '月額料金',                hsl: '¥4,980〜',  sb: '¥0 (HPB必須)', m: '¥11,000〜', o: '¥8,000〜' },
    { label: '初期費用',                hsl: '¥0',        sb: '広告費',        m: '¥30,000',   o: '¥50,000' },
    { label: 'HPB CSV 取込',            hsl: true,        sb: '—',             m: false,       o: false },
    { label: 'LINE公式連携 (LIFF予約)',  hsl: true,        sb: false,           m: true,        o: '一部' },
    { label: 'HPB → 自社転換率の可視化', hsl: true,        sb: false,           m: false,       o: false },
    { label: '薬剤カルテ (比率記録)',     hsl: true,        sb: '—',             m: true,        o: '—' },
    { label: '指名料 5 階層自動計算',      hsl: true,        sb: false,           m: '—',         o: '—' },
    { label: '契約期間の縛り',           hsl: 'なし',       sb: 'HPB契約依存',    m: '年契約',     o: '1年' },
  ];

  const renderCell = (v: string | boolean) => {
    if (v === true) return <Check className="w-4 h-4 brand-text mx-auto" strokeWidth={2.5} />;
    if (v === false) return <span className="text-[#6b5b44]">—</span>;
    return <span className="text-[12px] text-[#bdaa88]">{v}</span>;
  };

  return (
    <section id="compare" className="bg-[#14100c] border-b border-[#302519]">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-24 md:py-32">
        <div className="text-center mb-12 md:mb-16">
          <div className="eyebrow mb-6">COMPARISON</div>
          <h2 className="display-serif text-[28px] md:text-[44px] leading-[1.5] md:leading-[1.4]">
            他の予約SaaSと、<br className="md:hidden" />
            どう違うのか。
          </h2>
          <p className="mt-6 text-[12px] text-[#7a6850] tracking-wide">
            各社の公開情報をもとに作成 ・ 2026年4月時点
          </p>
        </div>

        <div className="overflow-x-auto -mx-5 md:mx-0">
          <table className="w-full min-w-[720px] mx-5 md:mx-0 text-[13px]">
            <thead>
              <tr className="border-b border-[#302519]">
                <th className="text-left py-4 px-3 text-[11px] tracking-[0.18em] uppercase text-[#a89778] font-normal">比較項目</th>
                <th className="text-center py-4 px-3 bg-[#2a2119] border-x border-[#c9a675]/30">
                  <div className="display-serif text-[15px] text-[#efe3c8]">HairSalonLink</div>
                  <div className="text-[9px] brand-text mt-0.5 tracking-wider">OURS</div>
                </th>
                <th className="text-center py-4 px-3 text-[11px] text-[#a89778] font-normal">SALON BOARD</th>
                <th className="text-center py-4 px-3 text-[11px] text-[#a89778] font-normal">大手 SaaS A</th>
                <th className="text-center py-4 px-3 text-[11px] text-[#a89778] font-normal">大手 SaaS B</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-b border-[#302519]">
                  <td className="py-4 px-3 text-[#bdaa88]">{r.label}</td>
                  <td className="text-center py-4 px-3 bg-[#2a2119]/60 border-x border-[#c9a675]/20">{renderCell(r.hsl)}</td>
                  <td className="text-center py-4 px-3">{renderCell(r.sb)}</td>
                  <td className="text-center py-4 px-3">{renderCell(r.m)}</td>
                  <td className="text-center py-4 px-3">{renderCell(r.o)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  ROI Calculator                                            */
/* ────────────────────────────────────────────────────────── */

function Roi() {
  return (
    <section id="roi" className="bg-[#1b1510] border-b border-[#302519]">
      <div className="max-w-4xl mx-auto px-5 md:px-8 py-24 md:py-32">
        <div className="text-center mb-12 md:mb-16">
          <div className="eyebrow mb-6">ROI SIMULATOR</div>
          <h2 className="display-serif text-[28px] md:text-[44px] leading-[1.5] md:leading-[1.4]">
            あなたの店で、<br className="md:hidden" />
            いくら残るか。
          </h2>
          <p className="mt-6 text-[13px] text-[#a89778] tracking-wide leading-relaxed">
            HPB 広告費を一部「自社リピート」に置き換えたときの、年額の残り方を試算します。
          </p>
        </div>

        <RoiCalculator />
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Case Study — composite scenario, illustrative             */
/* ────────────────────────────────────────────────────────── */

function CaseStudy() {
  return (
    <section className="bg-[#14100c] border-b border-[#302519]">
      <div className="max-w-5xl mx-auto px-5 md:px-8 py-24 md:py-32">
        <div className="grid md:grid-cols-5 gap-10 md:gap-14">
          <div className="md:col-span-2">
            <div className="eyebrow mb-6">CASE</div>
            <h2 className="display-serif text-[26px] md:text-[38px] leading-[1.4] mb-6">
              2席のサロンで、<br />
              残りが変わった話。
            </h2>
            <p className="text-[13px] leading-[2] text-[#a89778]">
              ※ 導入検討中オーナー様と描いた試算シナリオです。数値は実店舗の公開 KPI レンジに基づく例示で、効果を保証するものではありません。
            </p>
          </div>
          <div className="md:col-span-3 bg-gradient-to-br from-[#1b1510] to-[#211a14] border border-[#302519] p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#7a2e2b] via-[#c9a675] to-transparent" aria-hidden />
            <Quote className="w-10 h-10 mb-6" strokeWidth={1.2} style={{ color: '#7a2e2b' }} />
            <p className="display-serif text-[17px] md:text-[19px] leading-[1.9] text-[#efe3c8] mb-8">
              「HPB の広告を、半分だけ LINE リピートに振り替えた。
              新規が減った分だけ不安だったけど、
              <span className="brand-text">常連の再来周期が 9 日縮まって、</span>
              年間で見ると残りが増えていた。」
            </p>
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#302519]">
              {[
                { v: '+¥43万', l: '年間の残り', d: '(試算)' },
                { v: '-12%', l: 'HPB広告費', d: '' },
                { v: '42日→33日', l: '再来周期', d: '(平均)' },
              ].map((k) => (
                <div key={k.l}>
                  <div className="display-serif text-[18px] md:text-[22px] brand-text">{k.v}</div>
                  <div className="text-[10px] text-[#a89778] mt-1 tracking-wide">{k.l}</div>
                  {k.d && <div className="text-[9px] text-[#6b5b44]">{k.d}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Gallery                                                   */
/* ────────────────────────────────────────────────────────── */

function Gallery() {
  const cards = [
    { label: 'CUT',   caption: '似合うを、かたちに。',       img: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=900&q=80&auto=format&fit=crop' },
    { label: 'COLOR', caption: '個性を、ひと押しで。',       img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=80&auto=format&fit=crop' },
    { label: 'PERM',  caption: '毎朝の手間を、引き算。',     img: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=900&q=80&auto=format&fit=crop' },
    { label: 'CARE',  caption: '髪は、時間をかけて。',       img: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=900&q=80&auto=format&fit=crop' },
  ];

  return (
    <section className="section-alt">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-24 md:py-32">
        <div className="text-center mb-16 md:mb-20">
          <div className="eyebrow mb-6">STYLE</div>
          <h2 className="display-serif text-[28px] md:text-[44px] leading-[1.5] md:leading-[1.4]">
            一人ひとりの髪に、<br />
            一人ひとりの施術を。
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {cards.map((c, idx) => (
            <Reveal key={c.label} variant="up" delay={idx * 90}>
              <div className="relative aspect-[3/4] overflow-hidden border border-[#302519] group cursor-pointer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.img}
                  alt={c.label}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover grayscale-[40%] brightness-75 group-hover:grayscale-0 group-hover:brightness-95 group-hover:scale-110 transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14100c] via-[#14100c]/55 to-[#14100c]/10 group-hover:from-[#14100c]/85 transition-all duration-700" />
                <div className="relative h-full p-5 md:p-6 flex flex-col justify-between">
                  <div className="text-[10px] tracking-[0.3em] text-[#c9a675] uppercase translate-y-0 group-hover:-translate-y-0.5 transition-transform duration-500">{c.label}</div>
                  <div className="overflow-hidden">
                    <p className="display-serif text-[15px] md:text-[17px] leading-[1.9] text-[#efe3c8] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] translate-y-0 group-hover:-translate-y-0.5 transition-transform duration-500">
                      {c.caption}
                    </p>
                    <div className="mt-2 w-0 group-hover:w-8 h-px bg-[#c9a675] transition-all duration-500" />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Why                                                       */
/* ────────────────────────────────────────────────────────── */

function Why() {
  const points = [
    { label: '初期費用 ¥0',       body: '契約金・導入支援費用は取らない。登録後すぐに使える。' },
    { label: '契約期間の縛りなし', body: '月単位で解約できる。解約時は顧客データをCSVでエクスポートできる。' },
    { label: '美容室特化の設計',   body: '指名料5階層・薬剤カルテ・HPB移行率追跡など、現場に合わせて作っている。' },
  ];

  return (
    <section className="bg-[#14100c] border-y border-[#302519]">
      <div className="max-w-4xl mx-auto px-5 md:px-8 py-24 md:py-32">
        <div className="text-center mb-14">
          <div className="eyebrow mb-6">THREE THINGS</div>
          <h2 className="display-serif text-[28px] md:text-[42px] leading-[1.5] md:leading-[1.4]">
            始めるときに、<br />
            ハードルを、下げる。
          </h2>
        </div>

        <div className="bg-[#1b1510] border border-[#302519] py-12 px-8 md:px-14">
          <div className="text-center mb-12">
            <div className="display-serif text-[48px] md:text-[72px] leading-none text-[#efe3c8]">¥4,980</div>
            <div className="text-[11px] tracking-[0.2em] uppercase text-[#a89778] mt-3">Standard Plan — 月額（税別）</div>
          </div>
          <div className="h-px bg-[#302519] mb-10" />
          <div className="grid md:grid-cols-3 gap-10 md:gap-8">
            {points.map((p) => (
              <div key={p.label} className="text-center md:text-left">
                <div className="display-serif text-[16px] md:text-[18px] mb-3 text-[#efe3c8]">{p.label}</div>
                <p className="text-[13px] leading-[2] text-[#a89778]">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Pricing                                                   */
/* ────────────────────────────────────────────────────────── */

function Pricing() {
  const plans = [
    { name: 'Free',     price: '¥0',     desc: 'まずは機能確認',     target: '個人オーナー / 試験導入', seats: '1席',   reservations: '月50件まで', features: ['顧客 30名まで', '基本カルテ', 'LINE予約URL'] },
    { name: 'Standard', price: '¥4,980', desc: '個人〜小規模サロン', target: 'オーナー + スタッフ1〜4名', seats: '1〜5席', reservations: '無制限',     features: ['顧客 500名', 'LINE連携・配信', '薬剤カルテ', '指名管理', 'HPB移行追跡', 'セグメント分析'], recommended: true },
    { name: 'Pro',      price: '¥9,980', desc: '複数スタッフ / 拠点', target: 'スタッフ5名以上の店舗',    seats: '4席〜',  reservations: '無制限',     features: ['顧客無制限', 'AI離反予測', 'スタイルギャラリー', '複数スタッフ管理', '初期設定サポート'] },
  ];

  return (
    <section id="pricing" className="bg-[#1b1510] border-y border-[#302519]">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-24 md:py-32">
        <div className="text-center mb-16 md:mb-20">
          <div className="eyebrow mb-6">PRICING</div>
          <h2 className="display-serif text-[28px] md:text-[44px] leading-[1.5] md:leading-[1.4]">
            席数で、<br />
            プランを選ぶ。
          </h2>
          <p className="mt-6 text-[13px] text-[#a89778] tracking-wide">
            初期費用 ¥0　/　いつでも解約可能　/　契約期間の縛りなし
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p, idx) => (
            <Reveal key={p.name} variant="up" delay={idx * 100}>
            <div className={`relative p-10 md:p-11 lift-hover ${p.recommended ? 'bg-[#2a2119] border border-[#c9a675]/70 shadow-[0_40px_80px_-24px_rgba(201,166,117,0.32),0_0_0_1px_rgba(201,166,117,0.18)]' : 'bg-[#1b1510] border border-[#302519] hover:border-[#48382a]'}`}>
              {p.recommended && (
                <div className="absolute top-0 left-0 right-0 -translate-y-1/2 flex justify-center">
                  <span className="brand-bg text-[#14100c] text-[10px] font-semibold tracking-[0.2em] uppercase px-4 py-1.5">Recommended</span>
                </div>
              )}
              <div className="text-center mb-6">
                <div className="display-serif text-[22px] text-[#efe3c8]">{p.name}</div>
                <p className="text-[11px] text-[#a89778] mt-1 tracking-wide">{p.desc}</p>
              </div>
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="display-serif text-[40px] text-[#efe3c8]">{p.price}</span>
                  <span className="text-[11px] text-[#a89778]">/月 (税別)</span>
                </div>
                <div className="mt-3 text-[11px] text-[#a89778]">
                  席数 <span className="text-[#efe3c8]">{p.seats}</span>
                  <span className="mx-2 text-[#48382a]">/</span>
                  予約 <span className="text-[#efe3c8]">{p.reservations}</span>
                </div>
              </div>
              <div className="h-px bg-[#302519] mb-6" />
              <div className="text-[11px] text-[#a89778] mb-5 text-center">対象: {p.target}</div>
              <ul className="space-y-3 mb-9">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[13px] text-[#bdaa88]">
                    <Check className="w-3.5 h-3.5 brand-text mt-1 flex-shrink-0" strokeWidth={2.5} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/register?plan=${p.name.toLowerCase()}`}
                className={`w-full inline-flex items-center justify-center gap-1.5 py-3.5 text-[12px] font-medium tracking-[0.1em] transition ${p.recommended ? 'brand-bg text-[#14100c] hover:opacity-90' : 'border border-[#48382a] text-[#efe3c8] hover:border-[#c9a675]/70'}`}
              >
                {p.name === 'Free' ? '無料で始める' : 'このプランで始める'}
              </Link>
            </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Homepage Creation Option                                  */
/* ────────────────────────────────────────────────────────── */

function HomepageOption() {
  const competitors = [
    { label: '地域の Web 制作会社', price: '¥300,000〜¥800,000' },
    { label: '個人フリーランス',     price: '¥100,000〜¥300,000' },
    { label: 'クラウドソーシング',   price: '¥30,000〜¥80,000' },
  ];
  const plans = [
    { name: 'シンプル HP',   price: '¥19,800', priceNote: '買い切り', desc: '最短で「ネットに出せる状態」をつくる',
      features: ['LP 1ページ構成', '店舗紹介 / メニュー / 料金表', '予約ボタン（HairSalonLink 連携）', 'Google Map / 営業時間埋め込み', 'スマホ完全対応'] },
    { name: 'スタンダード HP', price: '¥49,800', priceNote: '買い切り', desc: 'デザインと掲載量でしっかり集客',
      features: ['3ページ構成（トップ / スタイル集 / アクセス）', 'お問い合わせフォーム', 'スタッフ紹介ページ', '写真差し替え無制限', '細かいデザイン調整込み'], recommended: true },
  ];

  return (
    <section id="homepage" className="bg-[#14100c] border-b border-[#302519]">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-24 md:py-32">
        <div className="text-center mb-16 md:mb-20">
          <div className="eyebrow mb-6">OPTIONAL — HOMEPAGE</div>
          <h2 className="display-serif text-[28px] md:text-[44px] leading-[1.5] md:leading-[1.4]">
            ホームページも、<br />
            まとめてお任せください。
          </h2>
          <p className="mt-6 text-[13px] md:text-[14px] text-[#a89778] tracking-wide leading-relaxed">
            「HP がない / 古いまま放置」のオーナー様へ。<br />
            予約システムを自社開発しているからこそ出せる、圧倒的な価格で制作いたします。
          </p>
        </div>

        <div className="mb-16 md:mb-20">
          <div className="text-center mb-8"><div className="text-[11px] text-[#a89778] tracking-[0.2em] uppercase">他社で作ると</div></div>
          <div className="max-w-2xl mx-auto space-y-2">
            {competitors.map((c) => (
              <div key={c.label} className="flex items-center justify-between px-6 py-4 bg-[#1b1510] border border-[#302519]">
                <span className="text-[13px] text-[#bdaa88]">{c.label}</span>
                <span className="display-serif text-[16px] md:text-[18px] text-[#a89778]">{c.price}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-10"><div className="inline-block text-[#c9a675] text-[18px]">↓</div></div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {plans.map((p) => (
            <div key={p.name} className={`relative p-10 md:p-11 ${p.recommended ? 'bg-[#2a2119] border border-[#c9a675]/70 shadow-[0_40px_80px_-24px_rgba(201,166,117,0.32),0_0_0_1px_rgba(201,166,117,0.18)]' : 'bg-[#1b1510] border border-[#302519]'}`}>
              {p.recommended && (
                <div className="absolute top-0 left-0 right-0 -translate-y-1/2 flex justify-center">
                  <span className="brand-bg text-[#14100c] text-[10px] font-semibold tracking-[0.2em] uppercase px-4 py-1.5">Recommended</span>
                </div>
              )}
              <div className="text-center mb-6">
                <div className="display-serif text-[22px] text-[#efe3c8]">{p.name}</div>
                <p className="text-[11px] text-[#a89778] mt-1 tracking-wide">{p.desc}</p>
              </div>
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="display-serif text-[40px] text-[#efe3c8]">{p.price}</span>
                  <span className="text-[11px] text-[#a89778]">{p.priceNote}</span>
                </div>
              </div>
              <div className="h-px bg-[#302519] mb-6" />
              <ul className="space-y-3 mb-9">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[13px] text-[#bdaa88]">
                    <Check className="w-3.5 h-3.5 brand-text mt-1 flex-shrink-0" strokeWidth={2.5} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="mailto:shibahara.724@gmail.com?subject=HP制作の相談&body=HairSalonLink%20のHP制作について相談したいです。%0A%0A店舗名：%0Aご希望プラン：%0Aご希望内容：%0A"
                className={`w-full inline-flex items-center justify-center gap-1.5 py-3.5 text-[12px] font-medium tracking-[0.1em] transition ${p.recommended ? 'brand-bg text-[#14100c] hover:opacity-90' : 'border border-[#48382a] text-[#efe3c8] hover:border-[#c9a675]/70'}`}
              >
                このプランで相談する
              </a>
            </div>
          ))}
        </div>

        <div className="mt-16 md:mt-20 max-w-3xl mx-auto">
          <div className="text-center mb-8"><div className="eyebrow">なぜ、この価格で出せるのか</div></div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { t: '01', h: '予約システムと一体', d: '予約フォーム・LINE連携を自社開発しているため、外注先との連携コストがゼロ。' },
              { t: '02', h: '美容室専用テンプレ', d: '業種を絞ることで、制作工程をほぼ流し込み化。1時間で完成する基盤を持っています。' },
              { t: '03', h: '契約者様限定オプション', d: 'HairSalonLink ご契約オーナー様のみのため、新規営業コストがかからず価格に還元できます。' },
            ].map((i) => (
              <div key={i.t} className="p-6 bg-[#1b1510] border border-[#302519]">
                <div className="text-[#c9a675] text-[11px] tracking-[0.2em] mb-3">{i.t}</div>
                <div className="display-serif text-[16px] text-[#efe3c8] mb-2">{i.h}</div>
                <p className="text-[12px] text-[#a89778] leading-relaxed">{i.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-[11px] text-[#7a6850] tracking-wide leading-relaxed">
            ※ 独自ドメイン（例: your-salon.com）ご希望の場合は別途 ¥9,800 で取得・設定代行も承ります。<br />
            ※ 制作はご契約プラン内の特典ではなく、別途有料オプションとなります。
          </p>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Security                                                  */
/* ────────────────────────────────────────────────────────── */

function Security() {
  const items = [
    { icon: Shield,     t: '通信・保存ともに暗号化',     d: 'TLS 1.3 による通信暗号化と、AES-256 相当のサーバーサイド暗号化で顧客データを保護。' },
    { icon: Database,   t: '日次バックアップ',          d: '毎日のスナップショットを別リージョンに保管。万一の際も前日時点へ戻せます。' },
    { icon: Clock,      t: '稼働時間ログ / 監査ログ',    d: 'すべての変更操作を監査ログに記録。誰がいつ何を更新したかを追跡可能。' },
    { icon: TrendingUp, t: '段階リリース / 自動復旧',    d: '本番デプロイは段階適用。異常検知で自動ロールバック。サービス停止を最小化。' },
    { icon: Users,      t: '権限分離',                  d: 'オーナー / スタッフ / アシスタントで編集権限を分離。カルテの操作範囲を制御。' },
    { icon: Sparkles,   t: '個人情報保護法 準拠',        d: '日本の個人情報保護法・特定商取引法に対応した運用。データエクスポートは常時可能。' },
  ];
  return (
    <section className="section-paper border-y border-[#d4c39e]">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-24 md:py-32">
        <div className="text-center mb-14 md:mb-16">
          <div className="eyebrow mb-6">SECURITY &amp; TRUST</div>
          <h2 className="display-serif text-[28px] md:text-[44px] leading-[1.5] md:leading-[1.4]">
            顧客データは、<br className="md:hidden" />
            あなたの資産です。
          </h2>
          <p className="mt-6 text-[13px] text-[#6b5b44] tracking-wide">
            守り方も、渡し方も、取り出し方も——事業者側で塞がない設計にしています。
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          {items.map((i) => {
            const Icon = i.icon;
            return (
              <div key={i.t} className="p-6 md:p-7 bg-white/60 backdrop-blur border border-[#d4c39e] shadow-warm-sm lift-hover hover:bg-white/80 hover:border-[#c9a675]">
                <Icon className="w-5 h-5 mb-4" strokeWidth={1.8} style={{ color: '#8a5a2a' }} />
                <div className="display-serif text-[16px] text-[#1a120c] mb-2">{i.t}</div>
                <p className="text-[12px] leading-[1.9] text-[#5d4f3e]">{i.d}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Founder Note                                              */
/* ────────────────────────────────────────────────────────── */

function FounderNote() {
  return (
    <section className="bg-[#14100c] border-b border-[#302519]">
      <div className="max-w-3xl mx-auto px-5 md:px-8 py-24 md:py-32">
        <div className="text-center mb-10">
          <div className="eyebrow mb-6">FROM THE FOUNDER</div>
        </div>
        <div className="display-serif text-[18px] md:text-[22px] leading-[2] text-[#efe3c8] space-y-6">
          <p>
            個人で回している美容室ほど、
            予約・カルテ・LINE返信・広告費の判断が、
            すべてオーナーひとりに積み上がります。
          </p>
          <p>
            大手 SaaS は、確かに機能が豊富です。
            けれど、毎日開くのは 3 画面あれば足りる。
            <span className="brand-text">本当に必要な機能を、本当に必要な深さで</span>——
            この一点だけを、ずっと磨いています。
          </p>
          <p>
            ひとりの腕で、ひとりのお客さまを受けとめる場所を、
            広告に削られない形で続けていくために。
          </p>
        </div>
        <div className="mt-10 flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full brand-bg flex items-center justify-center">
            <Scissors className="w-4 h-4 text-[#14100c]" strokeWidth={2} />
          </div>
          <div className="text-left">
            <div className="text-[12px] text-[#efe3c8] display-serif">HairSalonLink 開発チーム</div>
            <div className="text-[10px] text-[#a89778] tracking-wider">Tokyo / Kumamoto</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  FAQ                                                       */
/* ────────────────────────────────────────────────────────── */

function Faq() {
  const faqs = [
    { q: '既存の顧客データは移行できますか？', a: 'はい。ホットペッパービューティーのCSVエクスポートを直接取り込めます。顧客情報と過去の予約履歴を自動で結合、電話番号の重複は名寄せして、数分で移行が完了します。' },
    { q: '最低契約期間はありますか？',         a: 'ありません。月単位で解約できます。解約後30日間は顧客データのCSVダウンロードにも対応します。縛りや違約金はありません。' },
    { q: 'スタッフ教育は大変ですか？',         a: '予約管理と顧客カルテを中心に、アイコンベースのシンプルな管理画面にしています。LINEを普段使っているスタッフであれば、特別な研修や専任担当者は必要ありません。' },
    { q: 'LINE 公式アカウントは別途必要ですか？', a: 'はい、LINE公式アカウント（Messaging API）が別途必要です。料金・無料配信通数はLINE for Businessの公式情報をご確認ください。接続は管理画面でChannel ID / Access Tokenを入力するだけで完了します。' },
    { q: 'HPB との併用はできますか？',         a: 'はい、HPB は「新規集客チャネル」として残したまま、LINE・自社 HP を「リピート基盤」として併走できます。HPB 経由客が自社リピートに変わった割合は専用 KPI で追跡可能です。' },
    { q: '導入までどれくらいかかりますか？',    a: '最短 30 分です。登録 → 店舗情報入力 → LINE/HPB 連携の 3 ステップで開業可能。CSV 取込を使えば、既存顧客もそのまま引き継げます。' },
    { q: 'サポート体制を教えてください',       a: 'メールで受け付けます（shibahara.724@gmail.com）。Proプランでは初期設定のサポートも含まれます。' },
    { q: 'お支払い方法は？',                  a: 'Stripe によるクレジットカードの月額決済です。初回登録時にカード情報を入力、以降は自動更新。領収書はメールで自動発行されます。' },
  ];

  return (
    <section id="faq" className="section-alt">
      <div className="max-w-3xl mx-auto px-5 md:px-8 py-24 md:py-32">
        <div className="text-center mb-14">
          <div className="eyebrow mb-6">FAQ</div>
          <h2 className="display-serif text-[28px] md:text-[42px] leading-[1.5] md:leading-[1.4]">よくあるご質問</h2>
        </div>
        <div>
          {faqs.map((f) => (
            <details key={f.q} className="faq-item">
              <summary>{f.q}</summary>
              <div className="faq-body">{f.a}</div>
            </details>
          ))}
        </div>
        <div className="mt-14 text-center text-[13px] text-[#a89778]">
          ほかにご不明な点は、{' '}
          <a href="mailto:shibahara.724@gmail.com" className="brand-text font-semibold underline underline-offset-4">
            shibahara.724@gmail.com
          </a>
          {' '} までどうぞ。
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Final CTA                                                 */
/* ────────────────────────────────────────────────────────── */

function FinalCta() {
  return (
    <section className="cta-dark relative">
      <div className="relative max-w-3xl mx-auto px-5 md:px-8 py-24 md:py-32 text-center">
        <div className="eyebrow mb-8">GET STARTED</div>
        <h2 className="display-serif text-[30px] md:text-[48px] leading-[1.5] md:leading-[1.4] text-[#efe3c8]">
          次の一人の常連を、<br />
          自分の手で。
        </h2>
        <p className="mt-8 text-[14px] md:text-[15px] leading-[2] text-[#a89778]">
          ホットペッパーは、今日もはたらいてくれる。<br className="hidden md:block" />
          けれど、次の常連を連れてくるのは、広告ではなく、あなたの店そのものだ。
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link href="/register" className="btn-cta-gold">HairSalonLink を始める</Link>
          <Link
            href="/book/hair-salon-demo"
            className="inline-flex items-center justify-center gap-2 px-7 py-[15px] text-[13px] font-medium tracking-[0.12em] text-[#efe3c8] border border-[#48382a] hover:border-[#c9a675] hover:text-[#c9a675] transition"
          >
            サンプル店舗を見る
          </Link>
        </div>

        <div className="mt-10 flex items-center justify-center gap-1 text-[#c9a675]">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-current" strokeWidth={0} />
          ))}
          <span className="ml-2 text-[11px] text-[#a89778]">美容室オーナー様の声をもとに設計</span>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Footer                                                    */
/* ────────────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="bg-[#100c08] text-[#a89778] text-sm">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-sm brand-bg flex items-center justify-center border border-white/10">
                <Scissors className="w-3.5 h-3.5 text-[#14100c]" strokeWidth={2} />
              </div>
              <div>
                <div className="font-semibold text-white tracking-tight text-[14px]">HairSalonLink</div>
                <div className="text-[9px] tracking-[0.18em] uppercase text-[#8a7a60]">for Hair Salons</div>
              </div>
            </div>
            <p className="text-[11px] leading-[1.9] text-[#8a7a60]">
              広告に頼らない経営のための、<br />
              美容室専用の管理ツール。
            </p>
          </div>
          <div>
            <div className="text-[10px] tracking-[0.28em] uppercase text-[#c9a675] mb-5">Product</div>
            <ul className="space-y-3 text-[12px]">
              <li><Link href="#features" className="hover:text-white transition">機能</Link></li>
              <li><Link href="#tour" className="hover:text-white transition">画面ツアー</Link></li>
              <li><Link href="#compare" className="hover:text-white transition">他社比較</Link></li>
              <li><Link href="#roi" className="hover:text-white transition">ROI 試算</Link></li>
              <li><Link href="#pricing" className="hover:text-white transition">料金</Link></li>
              <li><Link href="/book/hair-salon-demo" className="hover:text-white transition">サンプル店舗</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-[10px] tracking-[0.28em] uppercase text-[#c9a675] mb-5">Account</div>
            <ul className="space-y-3 text-[12px]">
              <li><Link href="/login" className="hover:text-white transition">ログイン</Link></li>
              <li><Link href="/register" className="hover:text-white transition">新規ご登録</Link></li>
              <li><a href="mailto:shibahara.724@gmail.com" className="hover:text-white transition">お問い合わせ</a></li>
            </ul>
          </div>
          <div>
            <div className="text-[10px] tracking-[0.28em] uppercase text-[#c9a675] mb-5">Legal</div>
            <ul className="space-y-3 text-[12px] text-[#6b5b44]">
              <li>利用規約</li>
              <li>プライバシーポリシー</li>
              <li>特定商取引法に基づく表記</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-[#332a1e] flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] text-[#6b5b44] tracking-wider">
          <div>© 2026 HairSalonLink. All rights reserved.</div>
          <div>Made for small hair salons in Japan.</div>
        </div>
      </div>
    </footer>
  );
}
