import Link from 'next/link';
import { Scissors, ArrowRight, Check } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0c0a09] text-[#ebe1cf]">
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
    <header className="sticky top-0 z-50 border-b border-[#2a2320]/80 bg-[#0c0a09]/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm brand-bg flex items-center justify-center">
            <Scissors className="w-4 h-4 text-[#0c0a09]" strokeWidth={2} />
          </div>
          <div className="leading-tight">
            <div className="font-semibold tracking-tight text-[15px]">HairSalonLink</div>
            <div className="text-[9px] text-[#8a7f6e] tracking-[0.18em] uppercase">for Hair Salons</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-[13px] text-[#8a7f6e]">
          <Link href="#about" className="hover:text-[#ebe1cf] transition">サービスについて</Link>
          <Link href="#features" className="hover:text-[#ebe1cf] transition">できること</Link>
          <Link href="#pricing" className="hover:text-[#ebe1cf] transition">料金</Link>
          <Link href="#faq" className="hover:text-[#ebe1cf] transition">FAQ</Link>
          <Link href="/login" className="hover:text-[#ebe1cf] transition">ログイン</Link>
        </nav>
        <Link
          href="/register"
          className="hidden sm:inline-flex items-center gap-1.5 text-[12px] font-medium tracking-wider px-4 py-2 brand-bg text-[#0c0a09] hover:opacity-90 transition"
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
        <div className="text-[10px] tracking-[0.32em] uppercase text-[#8a7f6e] mb-8">
          HAIR SALON &nbsp;×&nbsp; LINE &nbsp;×&nbsp; HOT PEPPER
        </div>

        <h1 className="display-serif text-[36px] md:text-[64px] leading-[1.4] md:leading-[1.3] text-[#ebe1cf]">
          店をつづける、<br />
          ということ。
        </h1>

        <p className="mt-10 text-[14px] md:text-[15px] text-[#8a7f6e] leading-[2.1] max-w-xl mx-auto">
          ホットペッパーの広告が、いつか要らなくなる日まで。<br className="hidden md:block" />
          美容室の経営を、静かに支えるための顧客管理ツール。
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link href="/register" className="btn-cta">
            HairSalonLink を始める
          </Link>
          <Link href="/login" className="btn-cta-ghost">
            ログイン
          </Link>
        </div>

        <div className="mt-8">
          <Link href="/book/hair-salon-demo" className="inline-flex items-center gap-1.5 text-xs text-[#8a7f6e] hover:text-[#ebe1cf] transition underline underline-offset-4 decoration-[#3a302a]">
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
    <section id="about" className="bg-[#120e0c] border-y border-[#2a2320]">
      <div className="max-w-3xl mx-auto px-5 md:px-8 py-24 md:py-32 text-center">
        <div className="eyebrow mb-8">ABOUT</div>
        <h2 className="display-serif text-[28px] md:text-[44px] leading-[1.55] md:leading-[1.45] mb-14">
          技術だけでは、<br />
          店は回らない。
        </h2>

        <div className="space-y-7 text-[14px] md:text-[15px] leading-[2.1] text-[#b5a98f] text-left md:text-center">
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
/*  Gallery — poetic captions (no photos needed)              */
/* ────────────────────────────────────────────────────────── */

function Gallery() {
  const cards = [
    {
      label: 'CUT',
      caption: '似合うを、かたちに。',
      img: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=900&q=80&auto=format&fit=crop',
    },
    {
      label: 'COLOR',
      caption: '個性を、ひと押しで。',
      img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=80&auto=format&fit=crop',
    },
    {
      label: 'PERM',
      caption: '毎朝の手間を、引き算。',
      img: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=900&q=80&auto=format&fit=crop',
    },
    {
      label: 'CARE',
      caption: '髪は、時間をかけて。',
      img: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=900&q=80&auto=format&fit=crop',
    },
  ];

  return (
    <section className="section-alt">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-24 md:py-32">
        <div className="text-center mb-16 md:mb-20">
          <div className="eyebrow mb-6">AT THE CHAIR</div>
          <h2 className="display-serif text-[28px] md:text-[44px] leading-[1.5] md:leading-[1.4]">
            誰かの朝が、<br />
            変わる場所。
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {cards.map((c) => (
            <div
              key={c.label}
              className="relative aspect-[3/4] overflow-hidden border border-[#2a2320] group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.img}
                alt={c.label}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover grayscale-[40%] brightness-75 group-hover:grayscale-0 group-hover:brightness-90 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-[#0c0a09]/55 to-[#0c0a09]/10" />
              <div className="relative h-full p-5 md:p-6 flex flex-col justify-between">
                <div className="text-[10px] tracking-[0.3em] text-[#c9a96e] uppercase">
                  {c.label}
                </div>
                <p className="display-serif text-[15px] md:text-[17px] leading-[1.9] text-[#ebe1cf] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  {c.caption}
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
/*  Features — numbered rows, honorific tone                  */
/* ────────────────────────────────────────────────────────── */

function Features() {
  const features = [
    {
      n: '01',
      title: '予約は、LINEから。',
      body: 'LINE公式アカウントからそのまま予約を受ける。LIFF対応でアプリ不要。前日のリマインドは自動で流れる。',
    },
    {
      n: '02',
      title: 'カレンダーは、ひとつ。',
      body: 'HPB・LINE・自社ホームページからの予約を、同じカレンダーに集める。既存データはCSV取込で移行できる。',
    },
    {
      n: '03',
      title: 'HPBからの流れを、追う。',
      body: 'HPB経由で来店した新規客のうち、次回をLINEや自社で予約した割合を、独自KPIで可視化する。広告費の判断材料として残しておく。',
    },
    {
      n: '04',
      title: '薬剤と、指名を、残す。',
      body: 'カラー剤の銘柄・比率・日付、アレルギー、ダメージレベル1〜5。Director / Top / Stylist / Junior / Assistant の5階層と、指名料の自動計算にも対応する。',
    },
    {
      n: '05',
      title: '配信は、撃ちすぎない。',
      body: '「休眠90日超」「VIP」「初回来店」など、条件に合う顧客だけにLINE配信する。必要な人に、必要なタイミングだけ届く。',
    },
    {
      n: '06',
      title: 'スタイルは、そのまま予約に。',
      body: '撮影した作品を並べておくと、お客さまは気になったスタイルから、そのまま予約に進める。ギャラリーと予約が、地続きになっている。',
    },
  ];

  return (
    <section id="features" className="bg-[#120e0c]">
      <div className="max-w-5xl mx-auto px-5 md:px-8 py-24 md:py-32">
        <div className="text-center mb-16 md:mb-20">
          <div className="eyebrow mb-6">FEATURES</div>
          <h2 className="display-serif text-[28px] md:text-[44px] leading-[1.5] md:leading-[1.4]">
            HairSalonLink で、<br className="md:hidden" />できること。
          </h2>
        </div>

        <div className="space-y-16 md:space-y-20">
          {features.map((f) => (
            <div key={f.n} className="grid md:grid-cols-12 gap-6 md:gap-10 items-start">
              <div className="md:col-span-3">
                <div className="display-serif text-[40px] md:text-[56px] leading-none text-[#c9a96e]/55">
                  {f.n}
                </div>
              </div>
              <div className="md:col-span-9">
                <h3 className="display-serif text-[20px] md:text-[26px] leading-[1.5] mb-4">
                  {f.title}
                </h3>
                <p className="text-[14px] md:text-[15px] leading-[2.05] text-[#b5a98f]">
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
    { label: '初期費用 ¥0', body: '契約金・導入支援費用は取らない。登録後すぐに使える。' },
    { label: '契約期間の縛りなし', body: '月単位で解約できる。解約時は顧客データをCSVでエクスポートできる。' },
    { label: '美容室特化の設計', body: '指名料5階層・薬剤カルテ・HPB移行率追跡など、現場に合わせて作っている。' },
  ];

  return (
    <section className="section-alt">
      <div className="max-w-4xl mx-auto px-5 md:px-8 py-24 md:py-32">
        <div className="text-center mb-14">
          <div className="eyebrow mb-6">THREE THINGS</div>
          <h2 className="display-serif text-[28px] md:text-[42px] leading-[1.5] md:leading-[1.4]">
            始めるときに、<br />
            ハードルを、下げる。
          </h2>
        </div>

        <div className="bg-[#120e0c] border border-[#2a2320] py-12 px-8 md:px-14">
          <div className="text-center mb-12">
            <div className="display-serif text-[48px] md:text-[72px] leading-none text-[#ebe1cf]">
              ¥4,980
            </div>
            <div className="text-[11px] tracking-[0.2em] uppercase text-[#8a7f6e] mt-3">
              Standard Plan — 月額（税別）
            </div>
          </div>
          <div className="h-px bg-[#2a2320] mb-10" />
          <div className="grid md:grid-cols-3 gap-10 md:gap-8">
            {points.map((p) => (
              <div key={p.label} className="text-center md:text-left">
                <div className="display-serif text-[16px] md:text-[18px] mb-3 text-[#ebe1cf]">
                  {p.label}
                </div>
                <p className="text-[13px] leading-[2] text-[#8a7f6e]">{p.body}</p>
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
      target: '個人オーナー / 試験導入',
      seats: '1席',
      reservations: '月50件まで',
      features: ['顧客 30名まで', '基本カルテ', 'LINE予約URL'],
    },
    {
      name: 'Standard',
      price: '¥4,980',
      desc: '個人〜小規模サロン',
      target: 'オーナー + スタッフ1〜4名',
      seats: '1〜5席',
      reservations: '無制限',
      features: ['顧客 500名', 'LINE連携・配信', '薬剤カルテ', '指名管理', 'HPB移行追跡', 'セグメント分析'],
      recommended: true,
    },
    {
      name: 'Pro',
      price: '¥9,980',
      desc: '複数スタッフ / 拠点',
      target: 'スタッフ5名以上の店舗',
      seats: '4席〜',
      reservations: '無制限',
      features: ['顧客無制限', 'AI離反予測', 'スタイルギャラリー', '複数スタッフ管理', '初期設定サポート'],
    },
  ];

  return (
    <section id="pricing" className="bg-[#120e0c] border-y border-[#2a2320]">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-24 md:py-32">
        <div className="text-center mb-16 md:mb-20">
          <div className="eyebrow mb-6">PRICING</div>
          <h2 className="display-serif text-[28px] md:text-[44px] leading-[1.5] md:leading-[1.4]">
            席数で、<br />
            プランを選ぶ。
          </h2>
          <p className="mt-6 text-[13px] text-[#8a7f6e] tracking-wide">
            初期費用 ¥0　/　いつでも解約可能　/　契約期間の縛りなし
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative p-10 md:p-11 ${
                p.recommended
                  ? 'bg-[#1c1715] border border-[#c9a96e]/70 shadow-[0_32px_64px_-24px_rgba(201,169,110,0.15)]'
                  : 'bg-[#120e0c] border border-[#2a2320]'
              }`}
            >
              {p.recommended && (
                <div className="absolute top-0 left-0 right-0 -translate-y-1/2 flex justify-center">
                  <span className="brand-bg text-[#0c0a09] text-[10px] font-semibold tracking-[0.2em] uppercase px-4 py-1.5">
                    Recommended
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className="display-serif text-[22px] text-[#ebe1cf]">{p.name}</div>
                <p className="text-[11px] text-[#8a7f6e] mt-1 tracking-wide">{p.desc}</p>
              </div>

              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="display-serif text-[40px] text-[#ebe1cf]">{p.price}</span>
                  <span className="text-[11px] text-[#8a7f6e]">/月 (税別)</span>
                </div>
                <div className="mt-3 text-[11px] text-[#8a7f6e]">
                  席数 <span className="text-[#ebe1cf]">{p.seats}</span>
                  <span className="mx-2 text-[#3a302a]">/</span>
                  予約 <span className="text-[#ebe1cf]">{p.reservations}</span>
                </div>
              </div>

              <div className="h-px bg-[#2a2320] mb-6" />

              <div className="text-[11px] text-[#8a7f6e] mb-5 text-center">対象: {p.target}</div>

              <ul className="space-y-3 mb-9">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[13px] text-[#b5a98f]">
                    <Check className="w-3.5 h-3.5 brand-text mt-1 flex-shrink-0" strokeWidth={2.5} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={`w-full inline-flex items-center justify-center gap-1.5 py-3.5 text-[12px] font-medium tracking-[0.1em] transition ${
                  p.recommended
                    ? 'brand-bg text-[#0c0a09] hover:opacity-90'
                    : 'border border-[#3a302a] text-[#ebe1cf] hover:border-[#c9a96e]/70'
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
      q: '既存の顧客データは移行できますか？',
      a: 'はい。ホットペッパービューティーのCSVエクスポートを直接取り込めます。顧客情報と過去の予約履歴を自動で結合、電話番号の重複は名寄せして、数分で移行が完了します。',
    },
    {
      q: '最低契約期間はありますか？',
      a: 'ありません。月単位で解約できます。解約後30日間は顧客データのCSVダウンロードにも対応します。縛りや違約金はありません。',
    },
    {
      q: 'スタッフ教育は大変ですか？',
      a: '予約管理と顧客カルテを中心に、アイコンベースのシンプルな管理画面にしています。LINEを普段使っているスタッフであれば、特別な研修や専任担当者は必要ありません。',
    },
    {
      q: 'LINE 公式アカウントは別途必要ですか？',
      a: 'はい、LINE公式アカウント（Messaging API）が別途必要です。料金・無料配信通数はLINE for Businessの公式情報をご確認ください。接続は管理画面でChannel ID / Access Tokenを入力するだけで完了します。',
    },
    {
      q: 'サポート体制を教えてください',
      a: 'メールで受け付けます（support@hairsalonlink.demo）。Proプランでは初期設定のサポートも含まれます。',
    },
    {
      q: 'お支払い方法は？',
      a: 'Stripe によるクレジットカードの月額決済です。初回登録時にカード情報を入力、以降は自動更新。領収書はメールで自動発行されます。',
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

        <div className="mt-14 text-center text-[13px] text-[#8a7f6e]">
          ほかにご不明な点は、{' '}
          <a href="mailto:support@hairsalonlink.demo" className="brand-text font-semibold underline underline-offset-4">
            support@hairsalonlink.demo
          </a>
          {' '} までどうぞ。
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
    <section className="cta-dark relative">
      <div className="relative max-w-3xl mx-auto px-5 md:px-8 py-24 md:py-32 text-center">
        <div className="eyebrow mb-8">GET STARTED</div>
        <h2 className="display-serif text-[30px] md:text-[48px] leading-[1.5] md:leading-[1.4] text-[#ebe1cf]">
          次の一人の常連を、<br />
          自分の手で。
        </h2>
        <p className="mt-8 text-[14px] md:text-[15px] leading-[2] text-[#8a7f6e]">
          ホットペッパーは、今日もはたらいてくれる。<br className="hidden md:block" />
          けれど、次の常連を連れてくるのは、広告ではなく、あなたの店そのものだ。
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link href="/register" className="btn-cta-gold">
            HairSalonLink を始める
          </Link>
          <Link
            href="/book/hair-salon-demo"
            className="inline-flex items-center justify-center gap-2 px-7 py-[15px] text-[13px] font-medium tracking-[0.12em] text-[#ebe1cf] border border-[#3a302a] hover:border-[#c9a96e] hover:text-[#c9a96e] transition"
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
    <footer className="bg-[#0a0807] text-[#9b8d87] text-sm">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-sm brand-bg flex items-center justify-center border border-white/10">
                <Scissors className="w-3.5 h-3.5 text-[#0c0a09]" strokeWidth={2} />
              </div>
              <div>
                <div className="font-semibold text-white tracking-tight text-[14px]">HairSalonLink</div>
                <div className="text-[9px] tracking-[0.18em] uppercase text-[#7a6e68]">for Hair Salons</div>
              </div>
            </div>
            <p className="text-[11px] leading-[1.9] text-[#7a6e68]">
              広告に頼らない経営のための、<br />
              美容室専用の管理ツール。
            </p>
          </div>

          <div>
            <div className="text-[10px] tracking-[0.28em] uppercase text-[#c9a96e] mb-5">Product</div>
            <ul className="space-y-3 text-[12px]">
              <li><Link href="#about" className="hover:text-white transition">サービスについて</Link></li>
              <li><Link href="#features" className="hover:text-white transition">できること</Link></li>
              <li><Link href="#pricing" className="hover:text-white transition">料金</Link></li>
              <li><Link href="/book/hair-salon-demo" className="hover:text-white transition">サンプル店舗</Link></li>
              <li><Link href="#faq" className="hover:text-white transition">よくあるご質問</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-[10px] tracking-[0.28em] uppercase text-[#c9a96e] mb-5">Account</div>
            <ul className="space-y-3 text-[12px]">
              <li><Link href="/login" className="hover:text-white transition">ログイン</Link></li>
              <li><Link href="/register" className="hover:text-white transition">新規ご登録</Link></li>
              <li><a href="mailto:support@hairsalonlink.demo" className="hover:text-white transition">お問い合わせ</a></li>
            </ul>
          </div>

          <div>
            <div className="text-[10px] tracking-[0.28em] uppercase text-[#c9a96e] mb-5">Legal</div>
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
