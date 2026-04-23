-- ═══════════════════════════════════════════════════════════════
-- Row-Level Security — salon tenant isolation (opt-in)
-- ═══════════════════════════════════════════════════════════════
--
-- Applies RLS policies to every salon-scoped table.  Each policy
-- allows rows only when the DB role's session-local variable
--   app.current_salon_id
-- matches the row's salon_id column.
--
-- Enable via `withSalonRls(salonId, fn)` in src/lib/prismaScoped.ts,
-- which wraps each tenant request in a transaction and executes:
--   SELECT set_config('app.current_salon_id', $1, true);
--
-- BYPASSRLS — the Prisma connection role can read all rows for jobs
-- that intentionally cross tenants (SuperAdmin list, cron, etc.) as
-- long as the helper is NOT used.  To enforce everywhere, ALTER the
-- role to remove BYPASSRLS.
--
-- To apply:
--   psql "$DATABASE_URL" -f prisma/sql/001_enable_rls.sql
--
-- To roll back, see the DISABLE block at the bottom.
-- ═══════════════════════════════════════════════════════════════

-- Map Prisma model → underlying table name.  Prisma uses model casing
-- by default, quoted.  Adjust here if @@map directives differ.
DO $$
DECLARE
  t TEXT;
  tables TEXT[] := ARRAY[
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
    'AuditLog'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', t);

    -- SELECT / UPDATE / DELETE: row's salonId must match session var
    EXECUTE format($q$
      DROP POLICY IF EXISTS tenant_isolation_rw ON %1$I;
      CREATE POLICY tenant_isolation_rw ON %1$I
        USING ("salonId" = current_setting('app.current_salon_id', true));
    $q$, t);

    -- INSERT: new row's salonId must match session var
    EXECUTE format($q$
      DROP POLICY IF EXISTS tenant_isolation_insert ON %1$I;
      CREATE POLICY tenant_isolation_insert ON %1$I
        FOR INSERT
        WITH CHECK ("salonId" = current_setting('app.current_salon_id', true));
    $q$, t);
  END LOOP;
END $$;

-- ═══════════════════════════════════════════════════════════════
-- To DISABLE (rollback):
-- ═══════════════════════════════════════════════════════════════
-- DO $$
-- DECLARE t TEXT;
-- DECLARE tables TEXT[] := ARRAY['Staff','Customer','Menu','Reservation','Product','StockTransaction','TreatmentRecord','Coupon','Message','HairStyle','AuditLog'];
-- BEGIN
--   FOREACH t IN ARRAY tables LOOP
--     EXECUTE format('DROP POLICY IF EXISTS tenant_isolation_rw ON %I', t);
--     EXECUTE format('DROP POLICY IF EXISTS tenant_isolation_insert ON %I', t);
--     EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY', t);
--   END LOOP;
-- END $$;
