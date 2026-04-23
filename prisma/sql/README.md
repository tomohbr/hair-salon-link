# Row-Level Security (RLS) 適用ガイド

## 1. 前提

本アプリは二重のテナント分離を備えています。

| 層 | 防御内容 | 状態 |
|---|---|---|
| **アプリ層** | `prismaForSalon(salonId)` Prisma extension が `where` と `data` に自動で `salonId` を注入 | ✅ 導入済み |
| **DB 層** | Postgres Row-Level Security で `salonId = current_setting('app.current_salon_id')` に一致する行のみ可視 | ⏳ Opt-in (本ファイル適用待ち) |

RLS を有効化すると **「アプリ層の bug で他テナントにクエリが漏れても DB が拒否する」** という最終防御線になります。

## 2. 適用前の確認: 意図してクロステナント操作しているクエリ

RLS を単純適用すると以下が **壊れる可能性** があります。
適用前に必ず `BYPASSRLS` 付きの Postgres ロールで接続させるか、
`withSalonRls()` 経由で scoping するよう書き換えてください。

| ファイル | 用途 | 対応 |
|---|---|---|
| `src/app/api/superadmin/**` | 運営側の全テナント閲覧 | Prisma 接続ロールに `BYPASSRLS` を付与 |
| `src/app/api/cron/reminders/route.ts` | 全店舗のリマインダー | ループ内で `withSalonRls(salon.id, ...)` に書き換え |
| `src/app/api/line/webhook/route.ts` | Channel ID で salon を逆引き | 逆引き後 `withSalonRls(salon.id, ...)` |
| `src/app/api/inbound/hpb/[token]/route.ts` | トークンで salon 特定 | 特定後 `withSalonRls(salon.id, ...)` |
| `src/app/api/book/reserve/route.ts` | 公開予約 (slug ベース) | slug → salon 後 `withSalonRls(salon.id, ...)` |
| `src/lib/planLimits.ts` | プラン制限チェック | サロン単位なので scope 可能 |
| 認証系 (`/api/auth/*`) | User テーブルアクセス (User は RLS 対象外) | 対応不要 |

## 3. 適用手順 (本番)

```bash
# 1) まずバックアップ (Railway ダッシュボードからスナップショット or pg_dump)
pg_dump "$DATABASE_URL" > backup_before_rls.sql

# 2) Prisma 接続ロールに BYPASSRLS を付与 (クロステナント API を壊さないため)
#    Railway Postgres は通常 postgres スーパーユーザで接続するため、下記は多くの場合不要だが念のため:
psql "$DATABASE_URL" -c "ALTER ROLE <your_role> WITH BYPASSRLS;"

# 3) RLS ポリシー適用
psql "$DATABASE_URL" -f prisma/sql/001_enable_rls.sql

# 4) スモークテスト
#    - ログインして自店のダッシュボードが開く
#    - 予約作成・お会計が通る
#    - SuperAdmin が全サロンを閲覧できる
#    - LINE webhook / HPB inbound が受信できる
```

## 4. ロールバック

```bash
# 001_enable_rls.sql ファイル末尾の DISABLE ブロックを実行
psql "$DATABASE_URL" <<'SQL'
DO $$
DECLARE t TEXT;
DECLARE tables TEXT[] := ARRAY['Staff','Customer','Menu','Reservation','Product','StockTransaction','TreatmentRecord','Coupon','Message','HairStyle','AuditLog'];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS tenant_isolation_rw ON %I', t);
    EXECUTE format('DROP POLICY IF EXISTS tenant_isolation_insert ON %I', t);
    EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY', t);
  END LOOP;
END $$;
SQL
```

## 5. アプリ側ヘルパ

`src/lib/prismaScoped.ts` に `withSalonRls(salonId, fn)` があります。
RLS 有効化後、scoped API ではこれを使って transaction-local に
`app.current_salon_id` をセットできます。

```ts
import { withSalonRls } from '@/lib/prismaScoped';

const customers = await withSalonRls(salon.id, (tx) =>
  tx.customer.findMany({ orderBy: { totalSpent: 'desc' } })
);
```

## 6. 有効化の判断基準

RLS 有効化は「クロステナント API をすべて `withSalonRls` に移行済み」 または
「接続ロールに `BYPASSRLS` を付与」してからにしてください。
途中で有効化すると LINE webhook / HPB inbound / SuperAdmin 画面が 500 になります。
