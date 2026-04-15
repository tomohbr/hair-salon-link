import Link from 'next/link';
import { Scissors, ArrowRight, Check } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fbf7f1] text-[#1f1b1e]">
      <Header />
      <Hero />
      <About />
      <Gallery />
      <Features />
      <Why />
      <Pricing />
      <Faq />
      <FinalCta />
      <Footer />
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Header                                                    */
/* ────────────────────────────────────────────────────────── */

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#ece3d7]/80 bg-[#fbf7f1]/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm brand-bg flex items-center justify-center">
            <Scissors className="w-4 h-4 text-white" strokeWidth={2} />
          </div>
          <div className="leading-tight">
            <div className="font-semibold tracking-tight text-[15px]">HairSalonLink</div>
            <div className="text-[9px] text-[#6b5d57] tracking-[0.18em] uppercase">for Hair Salons</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-[13px] text-[#6b5d57]">
          <Link href="#about" className="hover:text-[#1f1b1e] transition">サービスについて</Link>
          <Link href="#features" className="hover:text-[#1f1b1e] transition">できること</Link>
          <Link href="#pricing" className="hover:text-[#1f1b1e] transition">料金</Link>
          <Link href="#faq" className="hover:text-[#1f1b1e] transition">FAQ</Link>
          <Link href="/login" className="hover:text-[#1f1b1e] transition">ログイン</Link>
        </nav>
        <Link
          href="/register"
          className="hidden sm:inline-flex items-center gap-1.5 text-[12px] font-medium tracking-wider px-4 py-2 brand-bg text-white hover:opacity-90 transition"
        >
          新規ご登録
        </Link>
      </div>
    </header>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Hero — centered, serif, no mock                          */
/* ────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative hero-bg">
      <div className="relative max-w-4xl mx-auto px-5 md:px-8 pt-20 pb-24 md:pt-32 md:pb-36 text-center fade-up">
        <div className="text-[10px] tracking-[0.32em] uppercase text-[#6b5d57] mb-8">
          HAIR SALON &nbsp;×&nbsp; LINE &nbsp;×&nbsp; HOT PEPPER
        </div>

        <h1 className="display-serif text-[34px] md:text-[58px] leading-[1.45] md:leading-[1.35] text-[#1f1b1e]">
          はじめてのお客さまを、<br />
          ずっと通ってくださる方へ。
        </h1>

        <p className="mt-10 text-[15px] md:text-base text-[#6b5d57] leading-[2]">
          ホットペッパーでご来店いただいた新規のお客さまを、<br className="hidden md:block" />
          LINE のやさしいつながりで、自社の常連さまへ。
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link href="/register" className="btn-cta">
            新規ご登録（月額 ¥4,980）
          </Link>
          <Link href="/login" className="btn-cta-ghost">
            ログイン
          </Link>
        </div>

        <div className="mt-8">
          <Link href="/book/hair-salon-demo" className="inline-flex items-center gap-1.5 text-xs text-[#6b5d57] hover:text-[#1f1b1e] transition underline underline-offset-4 decoration-[#d8cec3]">
            サンプル店舗の予約ページを見る
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  About — prose narrative                                   */
/* ────────────────────────────────────────────────────────── */

function About() {
  return (
    <section id="about" className="bg-white border-y border-[#ece3d7]">
      <div className="max-w-3xl mx-auto px-5 md:px-8 py-24 md:py-32 text-center">
        <div className="eyebrow mb-8">ABOUT</div>
        <h2 className="display-serif text-[28px] md:text-[44px] leading-[1.55] md:leading-[1.45] mb-14">
          美容室のための、<br />
          やさしい集客のしくみ。
        </h2>

        <div className="space-y-7 text-[14px] md:text-[15px] leading-[2.1] text-[#4a3f3b] text-left md:text-center">
          <p>
            美容室のオーナーさまにとって、ホットペッパービューティーからの集客コストは、決して小さくない負担です。
            せっかくご来店いただいた新規のお客さまが、次はご自身のサロンへ直接来てくださるようになれば、
            広告に頼る経営から、一歩ずつ離れていくことができます。
          </p>
          <p>
            HairSalonLink は、そんな個人〜小規模のサロンさまのための、小さなサービスです。
            予約管理も、薬剤カルテも、指名料の計算も、LINE 配信も、むずかしい設定なしではじめていただけます。
            ホットペッパーからの新規のお客さまを、どれだけ自社にお迎えできたか。
            独自の指標で、数字でやさしく見守ります。
          </p>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Gallery — poetic captions (no photos needed)              */
/* ────────────────────────────────────────────────────────── */

function Gallery() {
  const quotes = [
    { label: 'CUT', caption: '似合うを、丁寧にかたちに。' },
    { label: 'COLOR', caption: 'お客さまの個性を、そっと引き立てて。' },
    { label: 'PERM', caption: '毎日のスタイリングを、やさしく。' },
    { label: 'CARE', caption: '髪のことは、ずっとおつきあい。' },
  ];

  return (
    <section className="section-alt">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-24 md:py-32">
        <div className="text-center mb-16 md:mb-20">
          <div className="eyebrow mb-6">OUR STANCE</div>
          <h2 className="display-serif text-[26px] md:text-[40px] leading-[1.6] md:leading-[1.5]">
            施術への想いも、<br />
            経営の数字と同じだけ、大切に。
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {quotes.map((q) => (
            <div
              key={q.label}
              className="aspect-[3/4] bg-white border border-[#ece3d7] p-5 md:p-6 flex flex-col justify-between hover:border-[#d8cec3] transition"
            >
              <div className="text-[10px] tracking-[0.28em] text-[#6b5d57] uppercase">
                {q.label}
              </div>
              <p className="display-serif text-[15px] md:text-[17px] leading-[1.9] text-[#1f1b1e]">
                {q.caption}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Features — numbered rows, honorific tone                  */
/* ────────────────────────────────────────────────────────── */

function Features() {
  const features = [
    {
      n: '01',
      title: 'LINE でつながる予約',
      body: 'LINE 公式アカウントからそのままご予約いただけます。LIFF 対応のため、お客さまはアプリのインストール不要。予約の前日には、リマインドも自動でお送りします。',
    },
    {
      n: '02',
      title: 'ひとつのカレンダーで、すべての予約を',
      body: 'ホットペッパー・LINE・自社ホームページからのご予約を、ひとつのカレンダーに集約します。CSV取込にも対応しているため、既存のお客さまデータを手間なく移行していただけます。',
    },
    {
      n: '03',
      title: 'ホットペッパーからの流れを、見える化',
      body: 'ホットペッパー経由でご来店いただいた新規のお客さまのうち、次回ご自身のサロンへ戻ってきてくださった割合を、独自の指標で可視化。他のサービスにはない視点で、じっくりと改善を重ねていけます。',
    },
    {
      n: '04',
      title: '薬剤履歴カルテと、指名の管理',
      body: 'カラー剤のブランド・比率・日付、アレルギー、ダメージレベルを一元管理。Director / Top / Stylist / Junior / Assistant の5階層と、指名料の設定にも対応します。',
    },
    {
      n: '05',
      title: 'セグメント別の、やさしい配信',
      body: '休眠されているお客さま、LINE のお友だち、初回ご来店のお客さま。セグメントに応じて、ちょうどよいタイミングで、ちょうどよい内容のご連絡をお届けできます。',
    },
    {
      n: '06',
      title: 'スタイルギャラリー',
      body: 'サロンさまが撮影された作品を、ひとつの場所に。お客さまは気になったスタイルから、そのままご予約いただけるように設計しています。',
    },
  ];

  return (
    <section id="features" className="bg-white">
      <div className="max-w-5xl mx-auto px-5 md:px-8 py-24 md:py-32">
        <div className="text-center mb-16 md:mb-20">
          <div className="eyebrow mb-6">FEATURES</div>
          <h2 className="display-serif text-[28px] md:text-[44px] leading-[1.5] md:leading-[1.4]">
            HairSalonLink で<br />
            できること。
          </h2>
        </div>

        <div className="space-y-16 md:space-y-20">
          {features.map((f) => (
            <div key={f.n} className="grid md:grid-cols-12 gap-6 md:gap-10 items-start">
              <div className="md:col-span-3">
                <div className="display-serif text-[40px] md:text-[56px] leading-none text-[#3d2b2e]/85">
                  {f.n}
                </div>
              </div>
              <div className="md:col-span-9">
                <h3 className="display-serif text-[20px] md:text-[26px] leading-[1.5] mb-4">
                  {f.title}
                </h3>
                <p className="text-[14px] md:text-[15px] leading-[2.05] text-[#4a3f3b]">
                  {f.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Why — simplified value proposition                        */
/* ────────────────────────────────────────────────────────── */

function Why() {
  const points = [
    { label: '初期費用 ¥0', body: '契約金・導入支援費用はいただきません。ご登録後、すぐにはじめていただけます。' },
    { label: '契約期間の縛りなし', body: '月単位で解約していただけます。解約時は顧客データを CSV でエクスポートできます。' },
    { label: '美容室特化の設計', body: '指名料の5階層、薬剤カルテ、HPB移行率追跡など、美容室の現場に合わせて設計しています。' },
  ];

  return (
    <section className="section-alt">
      <div className="max-w-4xl mx-auto px-5 md:px-8 py-24 md:py-32">
        <div className="text-center mb-14">
          <div className="eyebrow mb-6">WHY HAIRSALONLINK</div>
          <h2 className="display-serif text-[28px] md:text-[42px] leading-[1.5] md:leading-[1.4]">
            はじめやすさを、<br />
            いちばんに考えて。
          </h2>
        </div>

        <div className="bg-white border border-[#ece3d7] py-12 px-8 md:px-14">
          <div className="text-center mb-12">
            <div className="display-serif text-[48px] md:text-[72px] leading-none text-[#1f1b1e]">
              ¥4,980
            </div>
            <div className="text-[11px] tracking-[0.2em] uppercase text-[#6b5d57] mt-3">
              Standard Plan — 月額（税別）
            </div>
          </div>
          <div className="h-px bg-[#ece3d7] mb-10" />
          <div className="grid md:grid-cols-3 gap-10 md:gap-8">
            {points.map((p) => (
              <div key={p.label} className="text-center md:text-left">
                <div className="display-serif text-[16px] md:text-[18px] mb-3 text-[#1f1b1e]">
                  {p.label}
                </div>
                <p className="text-[13px] leading-[2] text-[#6b5d57]">{p.body}</p>
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
    {
      name: 'Free',
      price: '¥0',
      desc: 'まずは機能確認',
      target: '個人オーナーさま / お試し用',
      seats: '1席',
      reservations: '月50件まで',
      features: ['顧客 30名まで', '基本カルテ', 'LINE予約URL'],
    },
    {
      name: 'Standard',
      price: '¥4,980',
      desc: '個人〜小規模サロン',
      target: 'オーナー1名 + スタッフ1〜2名',
      seats: '1〜3席',
      reservations: '無制限',
      features: ['顧客 500名', 'LINE連携・配信', '薬剤カルテ', '指名管理', 'HPB移行追跡', 'セグメント分析'],
      recommended: true,
    },
    {
      name: 'Pro',
      price: '¥9,980',
      desc: '成長期 / 複数スタッフ',
      target: 'スタッフ5名以上の拠点',
      seats: '4席〜',
      reservations: '無制限',
      features: ['顧客無制限', 'AI離反予測', 'スタイルギャラリー', '複数スタッフ管理', '初期設定サポート'],
    },
  ];

  return (
    <section id="pricing" className="bg-white border-y border-[#ece3d7]">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-24 md:py-32">
        <div className="text-center mb-16 md:mb-20">
          <div className="eyebrow mb-6">PRICING</div>
          <h2 className="display-serif text-[28px] md:text-[44px] leading-[1.5] md:leading-[1.4]">
            席数で選ぶ、<br />
            シンプルな3プラン。
          </h2>
          <p className="mt-6 text-[13px] text-[#6b5d57] tracking-wide">
            初期費用 ¥0 / いつでも解約可能 / 契約期間の縛りなし
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative p-10 md:p-11 ${
                p.recommended
                  ? 'bg-[#fbf7f1] border border-[#3d2b2e]'
                  : 'bg-white border border-[#ece3d7]'
              }`}
            >
              {p.recommended && (
                <div className="absolute top-0 left-0 right-0 -translate-y-1/2 flex justify-center">
                  <span className="brand-bg text-white text-[10px] font-semibold tracking-[0.2em] uppercase px-4 py-1.5">
                    Recommended
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className="display-serif text-[22px] text-[#1f1b1e]">{p.name}</div>
                <p className="text-[11px] text-[#6b5d57] mt-1 tracking-wide">{p.desc}</p>
              </div>

              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="display-serif text-[40px] text-[#1f1b1e]">{p.price}</span>
                  <span className="text-[11px] text-[#6b5d57]">/月 (税別)</span>
                </div>
                <div className="mt-3 text-[11px] text-[#6b5d57]">
                  席数 <span className="text-[#1f1b1e]">{p.seats}</span>
                  <span className="mx-2 text-[#d8cec3]">/</span>
                  予約 <span className="text-[#1f1b1e]">{p.reservations}</span>
                </div>
              </div>

              <div className="h-px bg-[#ece3d7] mb-6" />

              <div className="text-[11px] text-[#6b5d57] mb-5 text-center">対象: {p.target}</div>

              <ul className="space-y-3 mb-9">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[13px] text-[#4a3f3b]">
                    <Check className="w-3.5 h-3.5 brand-text mt-1 flex-shrink-0" strokeWidth={2.5} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={`w-full inline-flex items-center justify-center gap-1.5 py-3.5 text-[12px] font-medium tracking-[0.1em] transition ${
                  p.recommended
                    ? 'brand-bg text-white hover:opacity-90'
                    : 'border border-[#d8cec3] text-[#1f1b1e] hover:border-[#3d2b2e]'
                }`}
              >
                このプランで始める
              </Link>
            </div>
          ))}
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
    {
      q: '既存のお客さまデータは移行できますか？',
      a: 'はい。ホットペッパービューティー の CSV エクスポートを、そのままお取り込みいただけます。顧客情報と過去のご予約履歴を自動で結合し、電話番号の重複も名寄せして、数分で移行を完了します。',
    },
    {
      q: '最低契約期間はありますか？',
      a: 'ありません。月単位で解約していただけます。解約時から 30日間は、顧客データの CSV ダウンロードにも対応します。契約期間の縛りや違約金はございません。',
    },
    {
      q: 'スタッフさまへの教育は大変ですか？',
      a: '予約管理とお客さまカルテを中心に、アイコンベースのシンプルな管理画面です。LINE を普段お使いのスタッフさまであれば、特別な研修や専任担当者を置かずに、運用をはじめていただけます。',
    },
    {
      q: 'LINE 公式アカウントは別途必要ですか？',
      a: 'はい、LINE 公式アカウント（Messaging API）のご用意が別途必要です。料金・無料配信通数の詳細は LINE for Business の公式情報をご確認ください。HairSalonLink 側は、設定画面で Channel ID / Access Token を入力いただくだけで接続完了します。',
    },
    {
      q: 'サポート体制を教えてください',
      a: 'メールでのお問い合わせを承ります（support@hairsalonlink.demo）。Pro プランでは、初期設定のサポートも含まれます。',
    },
    {
      q: 'お支払い方法は？',
      a: 'Stripe によるクレジットカードの月額決済です。初回ご登録時にカード情報をご入力いただき、以降は自動更新。領収書はメールで自動発行いたします。',
    },
  ];

  return (
    <section id="faq" className="section-alt">
      <div className="max-w-3xl mx-auto px-5 md:px-8 py-24 md:py-32">
        <div className="text-center mb-14">
          <div className="eyebrow mb-6">FAQ</div>
          <h2 className="display-serif text-[28px] md:text-[42px] leading-[1.5] md:leading-[1.4]">
            よくあるご質問
          </h2>
        </div>

        <div>
          {faqs.map((f) => (
            <details key={f.q} className="faq-item">
              <summary>{f.q}</summary>
              <div className="faq-body">{f.a}</div>
            </details>
          ))}
        </div>

        <div className="mt-14 text-center text-[13px] text-[#6b5d57]">
          ほかにご不明な点がございましたら、{' '}
          <a href="mailto:support@hairsalonlink.demo" className="brand-text font-semibold underline underline-offset-4">
            support@hairsalonlink.demo
          </a>
          {' '}までお気軽にお問い合わせください。
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Final CTA — warm espresso                                 */
/* ────────────────────────────────────────────────────────── */

function FinalCta() {
  return (
    <section className="cta-dark">
      <div className="max-w-3xl mx-auto px-5 md:px-8 py-24 md:py-32 text-center">
        <div className="text-[10px] tracking-[0.3em] uppercase text-white/60 mb-8">
          GET STARTED
        </div>
        <h2 className="display-serif text-[30px] md:text-[48px] leading-[1.5] md:leading-[1.4] text-white">
          サロンさまの毎日を、<br />
          もう少しだけ、やさしく。
        </h2>
        <p className="mt-8 text-[14px] md:text-[15px] leading-[2] text-white/75">
          はじめての方も、どうぞお気軽にご登録ください。<br className="hidden md:block" />
          ご登録は数分、契約期間の縛りもございません。
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link href="/register" className="btn-cta-light">
            新規ご登録（月額 ¥4,980）
          </Link>
          <Link
            href="/book/hair-salon-demo"
            className="inline-flex items-center justify-center gap-2 px-7 py-[15px] text-[14px] font-medium tracking-[0.08em] text-white/90 border border-white/25 hover:bg-white/5 transition"
          >
            サンプル店舗を見る
          </Link>
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
    <footer className="bg-[#1f1b1e] text-[#9b8d87] text-sm">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-sm brand-bg flex items-center justify-center border border-white/10">
                <Scissors className="w-3.5 h-3.5 text-white" strokeWidth={2} />
              </div>
              <div>
                <div className="font-semibold text-white tracking-tight text-[14px]">HairSalonLink</div>
                <div className="text-[9px] tracking-[0.18em] uppercase text-[#7a6e68]">for Hair Salons</div>
              </div>
            </div>
            <p className="text-[11px] leading-[1.9] text-[#7a6e68]">
              美容室のオーナーさまのための、<br />
              自社集客のためのサービスです。
            </p>
          </div>

          <div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-white mb-5">Product</div>
            <ul className="space-y-3 text-[12px]">
              <li><Link href="#about" className="hover:text-white transition">サービスについて</Link></li>
              <li><Link href="#features" className="hover:text-white transition">できること</Link></li>
              <li><Link href="#pricing" className="hover:text-white transition">料金</Link></li>
              <li><Link href="/book/hair-salon-demo" className="hover:text-white transition">サンプル店舗</Link></li>
              <li><Link href="#faq" className="hover:text-white transition">よくあるご質問</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-white mb-5">Account</div>
            <ul className="space-y-3 text-[12px]">
              <li><Link href="/login" className="hover:text-white transition">ログイン</Link></li>
              <li><Link href="/register" className="hover:text-white transition">新規ご登録</Link></li>
              <li><a href="mailto:support@hairsalonlink.demo" className="hover:text-white transition">お問い合わせ</a></li>
            </ul>
          </div>

          <div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-white mb-5">Legal</div>
            <ul className="space-y-3 text-[12px] text-[#5a514c]">
              <li>利用規約</li>
              <li>プライバシーポリシー</li>
              <li>特定商取引法に基づく表記</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-[#2e2629] flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] text-[#5a514c] tracking-wider">
          <div>© 2026 HairSalonLink. All rights reserved.</div>
          <div>Made for small hair salons in Japan.</div>
        </div>
      </div>
    </footer>
  );
}
