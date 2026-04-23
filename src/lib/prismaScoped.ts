/**
 * Prisma salon-scoped client extension.
 *
 * Wraps the global `prisma` with a `$extends` that injects
 *   where: { salonId }
 * into every read/write on salon-scoped models, and forces
 *   data: { salonId }
 * on create/createMany.
 *
 * This is a defense-in-depth layer on top of manual `where: { salonId }`
 * so that a forgotten filter cannot leak another tenant's data.
 *
 * USAGE (dashboard / server action):
 *   import { prismaForSalon } from '@/lib/prismaScoped';
 *   const db = prismaForSalon(salon.id);
 *   const customers = await db.customer.findMany();   // auto-scoped
 *
 * Use the raw `prisma` client only for:
 *   - SuperAdmin cross-tenant queries (list all salons, etc.)
 *   - Auth flows where salonId is unknown (login, register)
 *   - Public booking (scoped by slug → salonId manually)
 */

import { Prisma } from '@prisma/client';
import { prisma } from './db';

/** Models that carry a required `salonId` column. */
const SCOPED_MODELS: ReadonlySet<string> = new Set([
  'Staff',
  'Customer',
  'Menu',
  'Reservation',
  'Product',
  'StockTransaction',
  'TreatmentRecord',
  'Coupon',
  'Message',
  'HairStyle',
  'AuditLog',
]);

type AnyArgs = Record<string, unknown>;

function injectWhere(args: AnyArgs | undefined, salonId: string): AnyArgs {
  const next: AnyArgs = { ...(args ?? {}) };
  const existing = (next.where as AnyArgs | undefined) ?? {};
  next.where = { ...existing, salonId };
  return next;
}

function injectData(args: AnyArgs | undefined, salonId: string): AnyArgs {
  const next: AnyArgs = { ...(args ?? {}) };
  const data = next.data;
  if (Array.isArray(data)) {
    next.data = data.map((d) => ({ ...(d as AnyArgs), salonId }));
  } else if (data && typeof data === 'object') {
    next.data = { ...(data as AnyArgs), salonId };
  } else {
    next.data = { salonId };
  }
  return next;
}

export function prismaForSalon(salonId: string) {
  if (!salonId) {
    throw new Error('[prismaForSalon] salonId is required');
  }

  return prisma.$extends({
    name: 'salonScope',
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          if (!model || !SCOPED_MODELS.has(model)) {
            return query(args);
          }

          switch (operation) {
            // Reads — inject where.salonId
            case 'findMany':
            case 'findFirst':
            case 'findFirstOrThrow':
            case 'findUnique':
            case 'findUniqueOrThrow':
            case 'count':
            case 'aggregate':
            case 'groupBy':
              return query(injectWhere(args as AnyArgs, salonId));

            // Writes by filter — inject where.salonId
            case 'update':
            case 'updateMany':
            case 'delete':
            case 'deleteMany':
              return query(injectWhere(args as AnyArgs, salonId));

            // Upserts — scope both where AND create.salonId
            case 'upsert': {
              const a = { ...((args as AnyArgs) ?? {}) };
              a.where = { ...((a.where as AnyArgs) ?? {}), salonId };
              if (a.create && typeof a.create === 'object') {
                a.create = { ...(a.create as AnyArgs), salonId };
              }
              return query(a);
            }

            // Creates — force data.salonId
            case 'create':
            case 'createMany':
            case 'createManyAndReturn':
              return query(injectData(args as AnyArgs, salonId));

            default:
              return query(args);
          }
        },
      },
    },
  });
}

export type ScopedPrisma = ReturnType<typeof prismaForSalon>;

/**
 * Wraps RLS session variable for opt-in Postgres Row-Level Security.
 * Requires prisma/sql/rls.sql to have been applied.
 *
 * Usage:
 *   await withSalonRls(salonId, async (tx) => {
 *     return tx.customer.findMany();
 *   });
 */
export async function withSalonRls<T>(
  salonId: string,
  fn: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    // set_config is transaction-local; respects RLS policies on scoped tables
    await tx.$executeRaw`SELECT set_config('app.current_salon_id', ${salonId}, true)`;
    return fn(tx);
  });
}
