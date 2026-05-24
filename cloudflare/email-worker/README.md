# HPB Inbound Email — 運用セットアップ手順 (運営側 / 一度だけ)

サロン側ではなく **HairSalonLink 運営側** が一度だけ行う作業。
完了後は、サロンが各自の Gmail にフィルタ追加するだけで自動連携が始まります。

## 必要なもの

- Cloudflare アカウント (無料)
- 受信用ドメイン (例: `hair-salon-link.app` ・年¥3,000 程度で取得)
  - 既存ドメインのサブドメインを使う場合は不要
- 共有シークレット (ランダムな長文字列を 1 つ生成)

## ステップ 1 — ドメインを Cloudflare に登録

1. ドメインを取得 (お名前.com / Cloudflare Registrar 等)
2. Cloudflare ダッシュボード → 「Add a site」→ ドメイン入力 → Free プラン
3. Cloudflare が指定するネームサーバを、ドメイン取得元 (お名前.com 等) で設定

## ステップ 2 — Email Routing を有効化

1. Cloudflare ダッシュボード → 該当ドメイン → 左メニュー「**Email**」→「Email Routing」
2. 「Get started」を押して有効化 (MX レコードが自動追加される)
3. 「Routing rules」タブで **Catch-all address** を一旦「Drop」に設定 (後でワーカーに振る)

## ステップ 3 — Email Worker をデプロイ

### 方法 A. Cloudflare ダッシュボード上で貼り付け (簡単)

1. ダッシュボード → 該当ドメイン → 「Email」→「Email Workers」タブ
2. 「Create」→ 名前 `hpb-inbound` を付ける
3. `worker.js` の内容をコピペ → Save & Deploy

### 方法 B. Wrangler CLI でデプロイ (本格運用向け)

```bash
npm install -g wrangler
cd cloudflare/email-worker
wrangler login
wrangler deploy
```

`wrangler.toml`:
```toml
name = "hpb-inbound"
main = "worker.js"
compatibility_date = "2024-01-01"
```

## ステップ 4 — 環境変数を設定

ダッシュボードで Worker `hpb-inbound` を開く → Settings → Variables → 以下を追加:

| 変数名 | 値 | 用途 |
|---|---|---|
| `APP_BASE_URL` | `https://hair-salon-link-production.up.railway.app` | 本番 API のベース URL |
| `SHARED_SECRET` | (32文字以上のランダム英数字) | Worker と本番で共有 |

> `SHARED_SECRET` の生成: `openssl rand -hex 32` で生成可。または 1Password / Bitwarden 等で 32 文字ランダム。

## ステップ 5 — Catch-all を Worker に振る

1. ダッシュボード → 「Email」→「Email Routing」→「Routing rules」
2. **Catch-all address** の編集 → Action を「**Send to a Worker**」→ `hpb-inbound` を選択
3. Save

## ステップ 6 — Railway 側に環境変数を追加

Railway ダッシュボード → HairSalonLink プロジェクト → Variables:

| 変数名 | 値 |
|---|---|
| `HPB_INBOUND_SHARED_SECRET` | (ステップ 4 で生成したのと**同じ値**) |
| `NEXT_PUBLIC_HPB_EMAIL_DOMAIN` | `hpb.hair-salon-link.app` (サロン UI 表示用) |

設定後、Railway が自動再デプロイされる。

## ステップ 7 — 動作確認

### 7-1. 疎通確認 (GET)

```bash
curl https://hair-salon-link-production.up.railway.app/api/inbound/hpb/by-slug/salon-ad76iza2-q47p
# → {"ok":true,"salon":"marici","slug":"salon-ad76iza2-q47p"}
```

### 7-2. テスト送信

任意の Gmail から `salon-ad76iza2-q47p@hpb.hair-salon-link.app` 宛に、本物の HPB メール本文を貼り付けて送信。

ただし**送信元が `hairmore@hotpepper.jp` でないと Worker が reject する**ので、テストには:
- a) 本物の HPB メールを Gmail から転送する
- b) 一時的に `ALLOWED_FROM_DOMAINS` に `gmail.com` を追加してテスト → 後で削除

### 7-3. ログ確認

Cloudflare Worker のログ:
- ダッシュボード → Email Workers → `hpb-inbound` → Logs (リアルタイムでテール可)

本番 API のログ:
- Railway → Deployments → 最新の Deployment → Logs

## ステップ 8 — サロンに案内

サロンのダッシュボードの「設定 → HPB メール自動連携」セクションに、
**専用転送アドレスと設定手順が自動表示される**ので、その画面のスクショを送付するだけで OK。

---

## トラブルシューティング

| 症状 | 原因 | 対処 |
|---|---|---|
| メールが届いているのに予約が入らない | 送信元検証で reject | Worker のログを確認、`ALLOWED_FROM_DOMAINS` を見直す |
| Worker が動かない | 環境変数未設定 | `APP_BASE_URL` / `SHARED_SECRET` を確認 |
| `401 unauthorized` ログ | `SHARED_SECRET` が Worker と Railway で一致していない | 両方の値を見比べる |
| Gmail で「転送先承認コード」が来ない | Email Routing が有効化されていない | ステップ 2 を再確認 |
| Gmail フィルタの転送が動かない | フィルタの「次の条件に一致するメール」が間違っている | `from:hairmore@hotpepper.jp` で再設定 |

## アーキテクチャ全体図

```
[ お客様 ] → HPB で予約
              ↓
[ HPB ] → hairmore@hotpepper.jp から確定メール
              ↓ (即時)
[ サロンの Gmail ] → フィルタで自動転送
              ↓ (即時)
[ Cloudflare Email Routing ] → catch-all
              ↓
[ Email Worker: hpb-inbound ]
   ・送信元検証 (hotpepper.jp / recruit.co.jp のみ)
   ・宛先 LocalPart → slug 抽出
   ・本文を MIME パース → text 抽出
   ↓ POST + X-Inbound-Secret
[ /api/inbound/hpb/by-slug/{slug} ]
   ・共有シークレット検証
   ・slug → salon 逆引き
   ・既存の processHpbEmail() で予約 INSERT
              ↓
[ HairSalonLink ダッシュボード ] → 予約即時反映 ✅
```

## サロン側の手間 (一度きり)

設定 → HPB メール自動連携 セクションが自動で「あなた専用転送アドレス」と「Gmail での設定手順」を表示するので、それに従うだけ。

**所要時間: 2 分** (パターン A/B: Gmail/Yahoo/独自ドメインメール)
**所要時間: 10 分** (パターン C: キャリアメール / 新 Gmail 作成が必要)
