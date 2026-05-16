import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { prisma } from '@/lib/db';
import { stripe } from '@/lib/stripe';

export default async function RegisterSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ salon?: string; demo?: string; free?: string; session_id?: string }>;
}) {
  const sp = await searchParams;
  let salonName = '';
  if (sp.salon) {
    const salon = await prisma.salon.findUnique({ where: { id: sp.salon } });
    salonName = salon?.name || '';

    // Webhook が遅延した場合のバックアップ activation。
    // session_id の「存在」では信用せず、必ず Stripe に問い合わせて
    // 決済完了かつ当該サロンのセッションであることを検証する。
    if (
      salon &&
      salon.status === 'pending_payment' &&
      sp.session_id &&
      stripe
    ) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sp.session_id);
        const paid =
          session.payment_status === 'paid' || session.status === 'complete';
        if (paid && session.metadata?.salonId === salon.id) {
          await prisma.salon.update({
            where: { id: salon.id },
            data: {
              status: 'active',
              stripeCustomerId:
                typeof session.customer === 'string' ? session.customer : null,
            },
          });
        }
      } catch (e) {
        console.error('[register/success] stripe verify failed', e);
      }
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="card-box text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-stone-900 mb-2">登録が完了しました 🎉</h1>
        {salonName && <p className="text-sm text-stone-600 mb-1">{salonName} 様</p>}
        <p className="text-sm text-stone-600 mb-6">
          {sp.demo
            ? 'デモモードで登録が完了しました'
            : sp.free
              ? 'Freeプランの登録が完了しました'
              : 'お支払いが完了し、ご利用いただけます'}
        </p>
        <Link href="/login" className="btn-brand w-full justify-center py-2.5">
          ログインして始める
        </Link>
      </div>
    </div>
  );
}
