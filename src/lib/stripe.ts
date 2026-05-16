import Stripe from 'stripe';

// Stripe client - テストキー対応
// 環境変数: STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET
// 開発環境で未設定時のみ "demo mode" となり、決済画面をスキップして自動で成功扱いにする

const key = process.env.STRIPE_SECRET_KEY || '';

export const stripe = key ? new Stripe(key) : null;

// 本番では Stripe 未設定でもデモモードに落とさない。
// 落とすと全ての新規登録が無償でアクティブ化され、製品をタダで配ることになる。
export const isDemoMode = !stripe && process.env.NODE_ENV !== 'production';

// プラン価格定義（美容室版 - ネイル版より ¥1,000 高）
export const PLANS = {
  standard: {
    name: 'Standard',
    price: 4980,
    features: ['顧客 500名', '予約無制限', 'LINE連携', '指名管理', 'カルテ', '分析'],
  },
  pro: {
    name: 'Pro',
    price: 9980,
    features: ['顧客無制限', 'AI分析', 'スタイルギャラリー', '複数スタッフ', '優先サポート'],
  },
} as const;

export type PlanId = keyof typeof PLANS;

export async function createCheckoutSession(params: {
  plan: PlanId;
  salonId: string;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
}) {
  if (!stripe) return null;
  const plan = PLANS[params.plan];
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: params.customerEmail,
    line_items: [
      {
        price_data: {
          currency: 'jpy',
          product_data: {
            name: `HairSalonLink ${plan.name}プラン`,
            description: plan.features.join(' / '),
          },
          unit_amount: plan.price,
          recurring: { interval: 'month' },
        },
        quantity: 1,
      },
    ],
    metadata: {
      salonId: params.salonId,
      plan: params.plan,
    },
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
  });
  return session;
}
