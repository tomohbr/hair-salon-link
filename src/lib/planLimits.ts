// プラン別の制限定義と制限チェックユーティリティ

import { prisma } from './db';

export const PLAN_LIMITS = {
  free: {
    maxCustomers: 30,
    maxReservationsPerMonth: 50,
    features: ['dashboard', 'reservations', 'customers', 'menus', 'sales', 'settings'] as string[],
  },
  standard: {
    maxCustomers: 500,
    maxReservationsPerMonth: Infinity,
    features: ['dashboard', 'reservations', 'customers', 'menus', 'sales', 'inventory', 'coupons', 'messages', 'analytics', 'settings'] as string[],
  },
  pro: {
    maxCustomers: Infinity,
    maxReservationsPerMonth: Infinity,
    features: ['dashboard', 'reservations', 'customers', 'menus', 'sales', 'inventory', 'coupons', 'messages', 'designs', 'analytics', 'settings'] as string[],
  },
} as const;

export type PlanName = keyof typeof PLAN_LIMITS;

function getPlanLimits(plan: string) {
  return PLAN_LIMITS[plan as PlanName] ?? PLAN_LIMITS.free;
}

/** 顧客数の上限チェック。超過している場合はエラーメッセージを返す */
export async function checkCustomerLimit(salonId: string, plan: string, addCount = 1): Promise<string | null> {
  const limits = getPlanLimits(plan);
  if (limits.maxCustomers === Infinity) return null;

  const currentCount = await prisma.customer.count({ where: { salonId } });
  if (currentCount + addCount > limits.maxCustomers) {
    return `${plan}プランの顧客上限（${limits.maxCustomers}名）に達しています。プランをアップグレードしてください。`;
  }
  return null;
}

/** 月間予約数の上限チェック */
export async function checkReservationLimit(salonId: string, plan: string, addCount = 1): Promise<string | null> {
  const limits = getPlanLimits(plan);
  if (limits.maxReservationsPerMonth === Infinity) return null;

  const now = new Date();
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const monthEnd = nextMonth.toISOString().slice(0, 10);

  const currentCount = await prisma.reservation.count({
    where: {
      salonId,
      date: { gte: monthStart, lt: monthEnd },
    },
  });

  if (currentCount + addCount > limits.maxReservationsPerMonth) {
    return `${plan}プランの月間予約上限（${limits.maxReservationsPerMonth}件）に達しています。プランをアップグレードしてください。`;
  }
  return null;
}

/** ページ/機能アクセスの許可チェック */
export function canAccessFeature(plan: string, feature: string): boolean {
  const limits = getPlanLimits(plan);
  return limits.features.includes(feature);
}

/** サイドバー用: アクセス可能なナビ項目のフィルター */
export function getAccessibleFeatures(plan: string): string[] {
  return getPlanLimits(plan).features;
}
