import { getSalonData } from '@/lib/salonData';
import Link from 'next/link';
import { Store, MessageCircle, CreditCard, Users, Link as LinkIcon, Clock, Mail, ShieldCheck, ChevronRight } from 'lucide-react';
import SalonInfoForm from './SalonInfoForm';
import LineForm from './LineForm';
import SlugFixer from './SlugFixer';
import BusinessHoursForm from './BusinessHoursForm';
import HpbInboundForm from './HpbInboundForm';
import { parseBusinessHours } from '@/lib/availability';

export default async function SettingsPage() {
  const { salon, staff } = await getSalonData();
  const businessHours = parseBusinessHours(salon.businessHours);

  // 公開URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hair-salon-link-production.up.railway.app';
  const bookingUrl = `${baseUrl}/book/${salon.slug}`;
  const webhookUrl = `${baseUrl}/api/line/webhook`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">設定</h1>
        <p className="text-sm text-stone-500 mt-1">店舗情報・LINE連携・プラン管理</p>
      </div>

      {/* 公開URL情報 */}
      <div className="card-box brand-light-bg">
        <div className="flex items-center gap-2 mb-3">
          <LinkIcon className="w-5 h-5 brand-text" />
          <h2 className="font-semibold text-stone-900">公開予約URL</h2>
        </div>
        <p className="text-xs text-stone-600 mb-2">このURLをお客様にLINE・SNS・メールでご共有ください。</p>
        <div className="flex gap-2 items-center">
          <input readOnly value={bookingUrl} className="input flex-1 text-xs font-mono" />
          <a href={bookingUrl} target="_blank" rel="noopener" className="btn-brand text-xs whitespace-nowrap">
            プレビュー
          </a>
        </div>
        <SlugFixer currentSlug={salon.slug} />
      </div>

      {/* 営業時間 */}
      <div className="card-box">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-5 h-5 brand-text" />
          <h2 className="font-semibold text-stone-900">営業時間・定休日</h2>
        </div>
        <p className="text-xs text-stone-500 mb-4">
          ここで設定した時間だけ予約が入ります。HPB / LINE / 自社HP すべての予約枠に即座に反映されます。
        </p>
        <BusinessHoursForm initial={businessHours} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 店舗情報 (編集可能) */}
        <div className="card-box">
          <div className="flex items-center gap-2 mb-4">
            <Store className="w-5 h-5 brand-text" />
            <h2 className="font-semibold text-stone-900">店舗情報</h2>
          </div>
          <SalonInfoForm
            initialName={salon.name}
            initialAddress={salon.address || ''}
            initialPhone={salon.phone || ''}
            initialDescription={salon.description || ''}
          />
        </div>

        {/* LINE 連携 (編集可能) */}
        <div className="card-box">
          <div className="flex items-center gap-2 mb-1">
            <MessageCircle className="w-5 h-5 text-emerald-500" />
            <h2 className="font-semibold text-stone-900">LINE 連携</h2>
            <span className={`badge ${salon.lineChannelId ? 'badge-green' : 'badge-gray'} ml-auto`}>
              {salon.lineChannelId ? '接続済' : '未接続'}
            </span>
          </div>
          <LineForm
            channelId={salon.lineChannelId || ''}
            channelSecret={salon.lineChannelSecret || ''}
            accessToken={salon.lineAccessToken || ''}
            liffId={salon.lineLiffId || ''}
            webhookUrl={webhookUrl}
          />
        </div>

        {/* HPB メール自動連携 */}
        <div className="card-box">
          <div className="flex items-center gap-2 mb-1">
            <Mail className="w-5 h-5 text-amber-600" />
            <h2 className="font-semibold text-stone-900">HPB メール自動連携</h2>
            <span className={`badge ${salon.hpbInboundToken ? 'badge-green' : 'badge-gray'} ml-auto`}>
              {salon.hpbInboundToken ? '連携可能' : '未設定'}
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mb-3 leading-relaxed">
            HPB から届く予約メールを転送すると、自動でこちらの予約枠に反映されます。<br />
            ダブルブッキング防止・リアルタイム連携のための仕組みです。
          </p>
          <HpbInboundForm
            initialToken={salon.hpbInboundToken}
            baseUrl={baseUrl}
          />
        </div>

        {/* プラン */}
        <div className="card-box">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-blue-500" />
            <h2 className="font-semibold text-stone-900">プラン</h2>
          </div>
          <div className="space-y-3">
            <PlanCard name="Free" price="¥0" features={['顧客30名', '月予約50件']} active={salon.plan === 'free'} />
            <PlanCard name="Standard" price="¥4,980/月" features={['顧客500名', 'LINE連携', '指名管理', 'カルテ']} active={salon.plan === 'standard'} recommended />
            <PlanCard name="Pro" price="¥9,980/月" features={['顧客無制限', 'AI分析', 'スタイルギャラリー']} active={salon.plan === 'pro'} />
          </div>
        </div>

        {/* スタッフ */}
        <div className="card-box">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-purple-500" />
            <h2 className="font-semibold text-stone-900">スタッフ</h2>
          </div>
          <div className="space-y-2">
            {staff.length === 0 ? (
              <p className="text-sm text-stone-500 py-4 text-center">スタッフがまだ登録されていません</p>
            ) : (
              staff.map(s => (
                <div key={s.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-stone-50">
                  <div className="w-10 h-10 rounded-full brand-light-bg flex items-center justify-center brand-text font-bold">
                    {s.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{s.name}</div>
                    <div className="text-xs text-stone-500">{s.role} · {s.bio}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 監査ログへの導線 */}
      <Link
        href="/settings/audit"
        className="card-box flex items-center gap-3 hover:border-stone-400 transition-colors"
      >
        <div className="w-10 h-10 rounded-lg bg-stone-900 text-white flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-stone-900 text-sm">監査ログを確認</div>
          <div className="text-xs text-stone-500 mt-0.5">
            お店のデータへの変更履歴と、サービス運営側からのアクセス履歴が確認できます。
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-stone-400 shrink-0" />
      </Link>
    </div>
  );
}

function PlanCard({ name, price, features, active, recommended }: { name: string; price: string; features: string[]; active?: boolean; recommended?: boolean }) {
  return (
    <div className={`p-3 rounded-lg border-2 ${active ? 'brand-border brand-light-bg' : 'border-stone-200'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{name}</span>
          {recommended && <span className="badge badge-brand">おすすめ</span>}
          {active && <span className="badge badge-green">利用中</span>}
        </div>
        <span className="font-bold">{price}</span>
      </div>
      <div className="text-xs text-stone-500 mt-1">{features.join(' · ')}</div>
    </div>
  );
}
