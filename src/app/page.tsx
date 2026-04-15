import Link from 'next/link';
import {
  Scissors,
  ArrowRight,
  Check,
  MessageCircle,
  TrendingDown,
  TrendingUp,
  BarChart3,
  Sparkles,
  AlertCircle,
  Users,
  FileText,
  Zap,
  Palette,
  UserCheck,
  Image as ImageIcon,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-stone-900">
      <Header />
      <Hero />
      <ProofBar />
      <Problem />
      <Solution />
      <Features />
      <ProductPreview />
      <Comparison />
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
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/85 backdrop-blur">
      <div className="max-w-6xl mx-auto px-5 md:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl brand-bg flex items-center justify-center shadow-sm">
            <Scissors className="w-4.5 h-4.5 text-white" strokeWidth={2.2} />
          </div>
          <div className="leading-tight">
            <div className="font-bold tracking-tight">HairSalonLink</div>
            <div className="text-[10px] text-stone-500 font-medium">for Hair Salons</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm text-stone-600">
          <Link href="#problem" className="hover:text-stone-900 transition">課題</Link>
          <Link href="#features" className="hover:text-stone-900 transition">機能</Link>
          <Link href="#pricing" className="hover:text-stone-900 transition">料金</Link>
          <Link href="#faq" className="hover:text-stone-900 transition">FAQ</Link>
          <Link href="/login" className="hover:text-stone-900 transition">ログイン</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/register"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg brand-bg text-white hover:opacity-90 transition"
          >
            無料で始める
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Hero                                                      */
/* ────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative hero-bg">
      <div className="absolute inset-0 hero-grid pointer-events-none overflow-hidden" aria-hidden />
      <div className="relative max-w-6xl mx-auto px-5 md:px-6 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left: copy */}
          <div className="lg:col-span-7 fade-up">
            <div className="eyebrow mb-5">美容室向け 顧客管理 SaaS</div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.15]">
              HPB依存から、<br />
              <span className="brand-text">LINE主導</span>の<br className="md:hidden" />経営へ。
            </h1>
            <p className="mt-6 text-base md:text-lg text-stone-600 leading-relaxed max-w-xl">
              ホットペッパー依存から抜け出したい個人〜小規模の美容室のための、
              LINE 連携・指名・薬剤カルテ・顧客分析がひとつになった管理ツール。
              <span className="text-stone-900 font-medium">月額 ¥4,980、初期費用 ¥0。</span>
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/register" className="btn-cta justify-center sm:justify-start">
                無料で始める
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/book/hair-salon-demo" className="btn-cta-ghost justify-center sm:justify-start">
                30秒でデモを触る
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-stone-500">
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" />クレカ登録不要で試せる</span>
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" />契約期間の縛りなし</span>
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" />デモ環境を公開中</span>
            </div>
          </div>

          {/* Right: product mock */}
          <div className="lg:col-span-5 fade-up fade-up-2">
            <HeroMock />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroMock() {
  return (
    <div className="relative">
      {/* Floating KPI badge */}
      <div className="absolute -top-4 -left-2 md:-left-6 z-10 bg-white rounded-xl shadow-lg border border-stone-200 px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg brand-light-bg brand-text flex items-center justify-center">
          <TrendingUp className="w-4.5 h-4.5" />
        </div>
        <div>
          <div className="text-[10px] text-stone-500 font-medium">独自指標</div>
          <div className="text-sm font-bold text-stone-900 metric">HPB→自社 移行率</div>
        </div>
      </div>

      {/* Main dashboard card */}
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 p-5 md:p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="text-[10px] text-stone-400 font-mono">dashboard.hairsalonlink.app</div>
        </div>

        {/* KPI tiles */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <MiniKpi label="今月売上" value="¥1.84M" trend="+18%" trendColor="text-emerald-600" />
          <MiniKpi label="新規→定着" value="64%" trend="+9pt" trendColor="text-emerald-600" />
          <MiniKpi label="予約数" value="286" trend="+42" trendColor="text-emerald-600" />
        </div>

        {/* Bar chart */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-stone-700">30日間 売上推移</span>
            <span className="text-[10px] text-stone-400">週次</span>
          </div>
          <div className="flex items-end gap-1.5 h-20">
            {[38, 52, 44, 61, 55, 72, 68, 80, 74, 88, 92, 85].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t brand-bg"
                style={{ height: `${h}%`, opacity: 0.35 + (i / 12) * 0.65 }}
              />
            ))}
          </div>
        </div>

        {/* Reservation row */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-stone-700 mb-1">本日の予約</div>
          {[
            { time: '10:30', name: '田中 まり', menu: 'カット + カラー', stylist: '佐藤' },
            { time: '13:00', name: '山田 花子', menu: '縮毛矯正', stylist: '田中' },
          ].map((r) => (
            <div key={r.time} className="flex items-center gap-3 py-1.5">
              <div className="text-[11px] font-mono text-stone-500 w-10">{r.time}</div>
              <div className="w-7 h-7 rounded-full brand-light-bg brand-text text-[11px] font-bold flex items-center justify-center">
                {r.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-stone-900 truncate">{r.name}</div>
                <div className="text-[10px] text-stone-500 truncate">{r.menu}</div>
              </div>
              <div className="text-[10px] badge badge-brand">{r.stylist}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating LINE badge */}
      <div className="absolute -bottom-4 -right-2 md:-right-6 z-10 bg-white rounded-xl shadow-lg border border-stone-200 px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <MessageCircle className="w-4.5 h-4.5" />
        </div>
        <div>
          <div className="text-[10px] text-stone-500 font-medium">LINE 友だち</div>
          <div className="text-sm font-bold text-stone-900 metric">412名 / +28 今週</div>
        </div>
      </div>
    </div>
  );
}

function MiniKpi({ label, value, trend, trendColor }: { label: string; value: string; trend: string; trendColor: string }) {
  return (
    <div className="rounded-lg bg-stone-50 border border-stone-100 p-2.5">
      <div className="text-[9px] text-stone-500 font-medium">{label}</div>
      <div className="text-sm font-bold text-stone-900 metric mt-0.5">{value}</div>
      <div className={`text-[9px] font-semibold ${trendColor} mt-0.5`}>{trend}</div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Proof Bar                                                 */
/* ────────────────────────────────────────────────────────── */

function ProofBar() {
  const items = [
    { k: '月額', v: '¥4,980〜', s: '税別' },
    { k: '初期費用', v: '¥0', s: '契約期間なし' },
    { k: 'HPBデータ', v: 'CSV取込', s: '既存データ移行' },
    { k: 'デモ環境', v: '公開中', s: '登録不要で閲覧可' },
  ];
  return (
    <section className="border-y border-stone-200 bg-white">
      <div className="max-w-6xl mx-auto px-5 md:px-6 py-6 md:py-7">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 md:gap-0">
          {items.map((it, i) => (
            <div key={it.k} className={`px-4 md:px-6 text-center md:text-left ${i !== 0 ? 'md:border-l md:border-stone-200' : ''}`}>
              <div className="text-[11px] text-stone-500 font-medium mb-1">{it.k}</div>
              <div className="text-xl md:text-2xl font-bold text-stone-900 metric">{it.v}</div>
              <div className="text-[11px] text-stone-500 mt-0.5">{it.s}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Problem                                                   */
/* ────────────────────────────────────────────────────────── */

function Problem() {
  const pains = [
    {
      icon: <TrendingDown className="w-5 h-5" />,
      title: 'HPB手数料が売上を圧迫',
      body: '掲載料に加え、ネット予約ごとの成果課金が積み重なる。一度LINEで繋がった常連客まで、HPB経由で予約されると紹介料が発生し続ける。',
      tag: '広告費',
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: 'LINE運用がオーナーの個人プレー',
      body: '個人LINEで予約対応してしまうと、スタッフ間で状況が共有できず、返信対応が属人化。休めない経営の原因になりがち。',
      tag: '運用',
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: 'カルテが紙とExcelのまま',
      body: '薬剤履歴はスタッフの頭の中。担当が変わると施術判断ができず、せっかくの指名客が離れていく。',
      tag: 'カルテ',
    },
  ];

  return (
    <section id="problem" className="section-alt py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 md:px-6">
        <div className="max-w-2xl mb-12 md:mb-14">
          <div className="eyebrow mb-4">現場でよく聞く話</div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
            こんなお悩み、<br className="md:hidden" />ありませんか？
          </h2>
          <p className="mt-5 text-stone-600 leading-relaxed">
            広告費、LINE対応、カルテ管理。サロン経営を圧迫する3つの「見えないコスト」を、HairSalonLink は同時に解決します。
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {pains.map((p) => (
            <div key={p.title} className="card-soft">
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                  {p.icon}
                </div>
                <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">{p.tag}</span>
              </div>
              <h3 className="font-bold text-lg text-stone-900 mb-2.5 leading-snug">{p.title}</h3>
              <p className="text-sm text-stone-600 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Solution                                                  */
/* ────────────────────────────────────────────────────────── */

function Solution() {
  const steps = [
    {
      n: '01',
      title: 'LINEで受ける',
      body: '予約URLをLINEで配るだけ。LIFFでアプリ不要、お客様は友だち追加と同時に予約可能。',
    },
    {
      n: '02',
      title: '顧客を育てる',
      body: '来店後に自動でセグメント化。休眠90日を超えた顧客には、自動でクーポン配信。',
    },
    {
      n: '03',
      title: '数字で判断する',
      body: 'HPB→自社移行率などの独自KPIで、広告費の最適化とスタッフ評価の判断材料に。',
    },
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-16">
          <div className="eyebrow justify-center mb-4">解決の仕組み</div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.25]">
            <span className="inline-block">たった3ステップで、</span>
            <span className="inline-block">自社集客へ。</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-8 left-[16.6%] right-[16.6%] h-px bg-stone-200" aria-hidden />

          {steps.map((s, i) => (
            <div key={s.n} className="relative text-center">
              <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border-2 brand-border mb-5">
                <span className="metric text-xl brand-text">{s.n}</span>
              </div>
              <h3 className="font-bold text-xl text-stone-900 mb-3">{s.title}</h3>
              <p className="text-sm text-stone-600 leading-relaxed max-w-xs mx-auto">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Features                                                  */
/* ────────────────────────────────────────────────────────── */

function Features() {
  const features = [
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: 'LINE予約・リマインド',
      body: 'LIFF対応でお客様はアプリ不要、友だち追加と同時に予約可能。前日のリマインドを自動送信します。',
      stat: 'LIFF対応',
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'HPB→自社 移行率追跡',
      body: 'HPB経由の新規客が、その後LINEや自社経由で再予約したかを自動で集計する独自KPIを搭載。',
      stat: '独自指標',
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: 'セグメント別 LINE配信',
      body: '「休眠90日超」「初回来店」「VIP」などのセグメントに該当する顧客へ、条件指定で配信できます。',
      stat: '条件指定配信',
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: '薬剤履歴カルテ',
      body: 'カラー剤のブランド・比率、アレルギー、ダメージレベル 1〜5 を記録。スタッフ間の引き継ぎに活用できます。',
      stat: '薬剤履歴管理',
    },
    {
      icon: <UserCheck className="w-5 h-5" />,
      title: '指名・スタイリスト階層',
      body: 'Director / Top / Stylist / Junior / Assistant の5階層と、指名料の設定・自動計算に対応します。',
      stat: '5階層対応',
    },
    {
      icon: <Palette className="w-5 h-5" />,
      title: 'スタイルギャラリー',
      body: 'ヘアスタイルの写真を公開予約ページに掲載。お客様が「このスタイルで予約」から直接来店予約できます。',
      stat: 'LINE直結',
    },
  ];

  return (
    <section id="features" className="section-alt py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 md:px-6">
        <div className="max-w-2xl mb-12 md:mb-14">
          <div className="eyebrow mb-4">Features</div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
            美容室の業務を、<br className="md:hidden" />1つに集約。
          </h2>
          <p className="mt-5 text-stone-600 leading-relaxed">
            予約管理・LINE配信・カルテ・指名計算・分析まで。バラバラのツールを行き来する必要はもうありません。
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="card-soft flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg brand-light-bg brand-text flex items-center justify-center">
                  {f.icon}
                </div>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {f.stat}
                </span>
              </div>
              <h3 className="font-bold text-base text-stone-900 mb-2">{f.title}</h3>
              <p className="text-sm text-stone-600 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Product Preview                                           */
/* ────────────────────────────────────────────────────────── */

function ProductPreview() {
  return (
    <section className="py-20 md:py-28 overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="eyebrow mb-4">Dashboard</div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.25]">
              売上・HPB移行率・離反リスクを、<br className="hidden md:block" />1画面に。
            </h2>
            <p className="mt-6 text-stone-600 leading-relaxed">
              経営の数字を、管理画面を開いたその場で確認できます。エクセル集計や手書き管理から離れるためのダッシュボードです。全機能をログイン不要で体験できるデモサロンも公開しています。
            </p>

            <ul className="mt-7 space-y-3">
              {[
                '30日間の売上・予約数の自動集計',
                'HPB→自社移行率の独自KPI',
                '休眠顧客の自動検知とLINE配信連携',
                '100名のサンプル顧客で動作を確認可能',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-sm text-stone-700">
                  <Check className="w-4 h-4 brand-text mt-0.5 flex-shrink-0" strokeWidth={3} />
                  <span>{t}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Link href="/book/hair-salon-demo" className="btn-cta-ghost">
                デモサロンの予約画面を見る
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 brand-light-bg rounded-3xl -rotate-1" aria-hidden />
            <div className="relative bg-white rounded-2xl shadow-xl border border-stone-200 p-5 md:p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-xs text-stone-500">ダッシュボード</div>
                  <div className="text-sm font-bold text-stone-900">Hair Salon NORTH TOKYO</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-[10px] text-stone-500">稼働中</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <PreviewKpi label="今月売上" value="¥1,842,500" trend="+18.2% vs 前月" />
                <PreviewKpi label="HPB→自社移行" value="57%" trend="+9pt 今月" />
                <PreviewKpi label="LINE友だち" value="412名" trend="+28 今週" />
                <PreviewKpi label="離反リスク" value="14名" trend="要フォロー" alert />
              </div>

              <div className="border border-stone-100 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-stone-700">売上 (直近30日)</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">+18.2%</span>
                </div>
                <div className="flex items-end gap-1 h-16">
                  {[42, 55, 48, 62, 58, 70, 65, 78, 72, 85, 80, 92, 88, 95].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t brand-bg" style={{ height: `${h}%`, opacity: 0.4 + (i / 14) * 0.6 }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PreviewKpi({ label, value, trend, alert }: { label: string; value: string; trend: string; alert?: boolean }) {
  return (
    <div className="rounded-lg border border-stone-100 bg-stone-50/60 p-3">
      <div className="text-[10px] text-stone-500 font-medium">{label}</div>
      <div className="text-base font-bold text-stone-900 metric mt-1">{value}</div>
      <div className={`text-[10px] font-semibold mt-0.5 ${alert ? 'text-amber-600' : 'text-emerald-600'}`}>{trend}</div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Comparison                                                */
/* ────────────────────────────────────────────────────────── */

function Comparison() {
  const points = [
    { title: '初期費用 ¥0', body: '契約金・導入支援費用はいただきません。登録後すぐにご利用開始いただけます。' },
    { title: '契約期間の縛りなし', body: '月単位で解約が可能です。解約時もCSVでの顧客データエクスポートに対応します。' },
    { title: '美容室特化の設計', body: '指名料の5階層・薬剤履歴カルテ・HPB→自社移行率追跡など、美容室の業務に最適化した機能を搭載。' },
  ];

  return (
    <section className="section-alt py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-5 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-14">
          <div className="eyebrow mb-4">Why HairSalonLink</div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.25]">
            <span className="inline-block">美容室管理SaaSの中で、</span>
            <span className="inline-block">はじめやすい位置に。</span>
          </h2>
          <p className="mt-4 text-stone-600 text-sm leading-relaxed">
            月額料金だけでなく、初期費用・契約期間・美容室特化機能の有無も、導入判断の大切な要素です。
          </p>
        </div>

        {/* Value prop card */}
        <div className="max-w-3xl mx-auto bg-white border border-stone-200 rounded-2xl p-7 md:p-10 shadow-[0_24px_48px_-24px_rgba(30,58,138,0.15)]">
          <div className="flex items-baseline gap-3 justify-center mb-2">
            <span className="text-5xl md:text-6xl font-bold brand-text metric">¥4,980</span>
            <span className="text-sm text-stone-500">/月 (税別)</span>
          </div>
          <div className="text-center text-xs text-stone-500 mb-8">Standardプラン / 初期費用¥0 / 契約期間の縛りなし</div>

          <div className="grid md:grid-cols-3 gap-5">
            {points.map((p) => (
              <div key={p.title} className="text-center">
                <div className="inline-flex w-10 h-10 rounded-full brand-light-bg brand-text items-center justify-center mb-3">
                  <Check className="w-4 h-4" strokeWidth={3} />
                </div>
                <div className="font-bold text-sm text-stone-900 mb-1.5">{p.title}</div>
                <p className="text-xs text-stone-600 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-8 text-center text-[11px] text-stone-400 leading-relaxed max-w-2xl mx-auto">
          ※ 他社サービスの料金・機能は各社公式サイトにてご確認ください。市場調査の結果は随時更新しています。
        </p>
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
      target: 'オーナー1名＋スタッフ1〜2名',
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
      features: ['顧客無制限', 'AI離反予測', 'スタイルギャラリー', '複数スタッフ管理', '優先サポート', '導入支援込み'],
    },
  ];

  return (
    <section id="pricing" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-14">
          <div className="eyebrow mb-4">Pricing</div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.25]">
            <span className="inline-block">席数で選ぶ、</span>
            <span className="inline-block">シンプルな3プラン</span>
          </h2>
          <p className="mt-4 text-stone-600">初期費用¥0 / いつでも解約可能 / 契約期間の縛りなし</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 md:gap-6">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-2xl p-7 ${
                p.recommended
                  ? 'bg-white border-2 brand-border shadow-[0_24px_48px_-20px_rgba(30,58,138,0.25)]'
                  : 'bg-white border border-stone-200'
              }`}
            >
              {p.recommended && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-block brand-bg text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full shadow-md whitespace-nowrap">
                    もっとも選ばれています
                  </span>
                </div>
              )}

              <div className="mb-5">
                <h3 className="text-xl font-bold text-stone-900">{p.name}</h3>
                <p className="text-xs text-stone-500 mt-1">{p.desc}</p>
              </div>

              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold text-stone-900 metric">{p.price}</span>
                <span className="text-xs text-stone-500">/月 (税別)</span>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-stone-500 mb-5 pb-5 border-b border-stone-100">
                <span>席数 <span className="text-stone-900 font-semibold">{p.seats}</span></span>
                <span>予約 <span className="text-stone-900 font-semibold">{p.reservations}</span></span>
              </div>
              <div className="text-[11px] text-stone-500 mb-4">対象: {p.target}</div>

              <ul className="space-y-2.5 mb-7">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-stone-700">
                    <Check className="w-4 h-4 brand-text mt-0.5 flex-shrink-0" strokeWidth={3} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={`w-full inline-flex items-center justify-center gap-1.5 py-3 rounded-lg font-semibold text-sm transition ${
                  p.recommended
                    ? 'brand-bg text-white hover:opacity-90'
                    : 'border border-stone-300 text-stone-900 hover:bg-stone-50'
                }`}
              >
                {p.name}で始める
                <ArrowRight className="w-3.5 h-3.5" />
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
      q: '既存のお客様データは移行できますか？',
      a: 'はい。HotPepper Beauty のCSVエクスポートをそのまま取り込めます。顧客情報と過去の予約履歴を自動で結合し、数分で移行が完了します。電話番号の重複も自動で名寄せされます。',
    },
    {
      q: '最低契約期間はありますか？',
      a: 'ありません。月単位での解約が可能で、解約後30日間はデータのCSVダウンロードに対応します。契約期間の縛りや違約金は一切ありません。',
    },
    {
      q: 'スタッフへの教育は大変ですか？',
      a: '予約管理とお客様カルテを中心に、アイコンベースのシンプルな管理画面です。LINEを普段お使いのスタッフの方であれば、特別な研修や専任担当者を置かずに運用を開始していただけます。',
    },
    {
      q: 'LINE公式アカウントは別途必要ですか？',
      a: 'はい、LINE公式アカウント（Messaging API）の作成が別途必要です。料金・無料配信通数は LINE 側の規定に準じますので、詳細は LINE for Business の公式情報をご確認ください。HairSalonLink 側は、設定画面で Channel ID / Access Token を入力するだけで接続完了します。',
    },
    {
      q: 'サポート体制を教えてください',
      a: 'メールでのお問い合わせを承ります（support@hairsalonlink.demo）。Proプランでは初期設定のサポートも含まれます。',
    },
    {
      q: '支払い方法は？',
      a: 'Stripe経由のクレジットカード月額決済です。初回登録時にカード情報を入力し、以降は自動更新。領収書はメールで自動発行されます。',
    },
  ];

  return (
    <section id="faq" className="section-alt py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-5 md:px-6">
        <div className="mb-10 md:mb-12">
          <div className="eyebrow mb-4">FAQ</div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">よくあるご質問</h2>
        </div>

        <div>
          {faqs.map((f) => (
            <details key={f.q} className="faq-item">
              <summary>{f.q}</summary>
              <div className="faq-body">{f.a}</div>
            </details>
          ))}
        </div>

        <div className="mt-10 text-center text-sm text-stone-600">
          他にご不明点がある方は <a href="mailto:support@hairsalonlink.demo" className="brand-text font-semibold underline">support@hairsalonlink.demo</a> までお気軽にどうぞ。
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
    <section className="cta-dark relative overflow-hidden">
      <div className="absolute inset-0 cta-dark-grid opacity-60" aria-hidden />
      <div className="relative max-w-4xl mx-auto px-5 md:px-6 py-20 md:py-28 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-3.5 py-1.5 text-[11px] font-semibold text-white/90 mb-6">
          <Sparkles className="w-3 h-3" />
          初期費用¥0 / 契約期間の縛りなし
        </div>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.2] text-white">
          広告費を削るのに、<br />
          明日を待つ理由はありません。
        </h2>
        <p className="mt-6 text-white/70 text-base leading-relaxed max-w-xl mx-auto">
          今日登録して、今日から顧客データを蓄積。ホットペッパーを続けるか、止めるかの判断材料は、数字で出せます。
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-3">
          <Link href="/register" className="btn-cta-light justify-center">
            無料で始める
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/book/hair-salon-demo"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white/90 border border-white/20 hover:bg-white/10 transition"
          >
            デモを触る
          </Link>
        </div>

        <div className="mt-8 text-xs text-white/50">
          クレジットカード登録なしで機能を確認できます
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
    <footer className="bg-stone-950 text-stone-400 text-sm">
      <div className="max-w-6xl mx-auto px-5 md:px-6 py-14">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl brand-bg flex items-center justify-center">
                <Scissors className="w-4 h-4 text-white" strokeWidth={2.2} />
              </div>
              <div>
                <div className="font-bold text-white tracking-tight">HairSalonLink</div>
                <div className="text-[10px] text-stone-500">for Hair Salons</div>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-stone-500">
              美容室の自社集客を、すべての個人店に。
            </p>
          </div>

          <div>
            <div className="text-xs font-semibold text-white mb-4">Product</div>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="#features" className="hover:text-white transition">機能</Link></li>
              <li><Link href="#pricing" className="hover:text-white transition">料金</Link></li>
              <li><Link href="/book/hair-salon-demo" className="hover:text-white transition">デモ画面</Link></li>
              <li><Link href="#faq" className="hover:text-white transition">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold text-white mb-4">Account</div>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/login" className="hover:text-white transition">ログイン</Link></li>
              <li><Link href="/register" className="hover:text-white transition">新規登録</Link></li>
              <li><a href="mailto:support@hairsalonlink.demo" className="hover:text-white transition">お問い合わせ</a></li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold text-white mb-4">Legal</div>
            <ul className="space-y-2.5 text-xs">
              <li><span className="text-stone-600">利用規約</span></li>
              <li><span className="text-stone-600">プライバシーポリシー</span></li>
              <li><span className="text-stone-600">特定商取引法に基づく表記</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-stone-500">
          <div>© 2026 HairSalonLink. All rights reserved.</div>
          <div>Made for small hair salons in Japan</div>
        </div>
      </div>
    </footer>
  );
}
