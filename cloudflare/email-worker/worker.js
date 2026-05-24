/**
 * HairSalonLink — HPB Inbound Email Worker
 * ─────────────────────────────────────────────────────────
 *
 *  受信ドメイン: hpb.hair-salon-link.app (例)
 *  受信アドレス: {slug}@hpb.hair-salon-link.app
 *
 *  挙動:
 *   1. Email Routing で catch-all → このワーカーに着信
 *   2. From が HPB の正規送信元 (hairmore@hotpepper.jp 等) か検証
 *   3. To から slug を抽出
 *   4. HairSalonLink API (`/api/inbound/hpb/by-slug/{slug}`) に本文を POST
 *   5. 失敗時はメールを reject (送信元に bounce を返す)
 *
 *  必要な環境変数 (Cloudflare Workers ダッシュボードで設定):
 *   - APP_BASE_URL  : "https://hair-salon-link-production.up.railway.app"
 *   - SHARED_SECRET : ランダムな長い文字列 (本番 API 側にも同じ値)
 *
 *  デプロイ:
 *   1. Cloudflare ダッシュボード → Email → Email Routing → Email Workers
 *   2. "Create" → コード貼り付け → Save
 *   3. Email Routing → Routing rules で catch-all を本ワーカーに振る
 */

// 許可する HPB 系送信ドメイン
const ALLOWED_FROM_DOMAINS = [
  'hotpepper.jp',
  'recruit.co.jp', // SalonBoard 関連
];

// 件名キーワード (HPB の予約確定メール識別)
const ACCEPTED_SUBJECT_KEYWORDS = [
  '予約',
  '【予約',
  '受付',
  'キャンセル',
];

export default {
  /**
   * Email Workers entrypoint
   * @param {ForwardableEmailMessage} message
   * @param {Env} env
   * @param {ExecutionContext} ctx
   */
  async email(message, env, ctx) {
    const to = (message.to || '').toLowerCase();
    const from = (message.from || '').toLowerCase();
    const subject = message.headers.get('subject') || '';

    // ── 1. 宛先から slug を抽出 ─────────────────────────────
    const slugMatch = /^([a-z0-9\-_]+)@/.exec(to);
    if (!slugMatch) {
      message.setReject('Invalid recipient format');
      return;
    }
    const slug = slugMatch[1];

    // ── 2. 送信元ドメインの検証 ──────────────────────────
    const fromDomainMatch = /@([^\s>]+)$/.exec(from);
    const fromDomain = fromDomainMatch ? fromDomainMatch[1].toLowerCase() : '';
    const fromAllowed = ALLOWED_FROM_DOMAINS.some((d) =>
      fromDomain === d || fromDomain.endsWith('.' + d)
    );

    if (!fromAllowed) {
      // HPB 以外からの送信は拒否 (なりすまし・スパム防止)
      console.log(`[hpb-worker] rejected from non-HPB domain: ${from}`);
      message.setReject('Sender not allowed');
      return;
    }

    // ── 3. 件名キーワード (緩いチェック、空でも通す) ──
    if (subject && !ACCEPTED_SUBJECT_KEYWORDS.some((k) => subject.includes(k))) {
      console.log(`[hpb-worker] subject did not match, forwarding anyway: ${subject}`);
      // ただし弾かない (HPB は仕様変更があり得る)
    }

    // ── 4. 本文を抽出 ─────────────────────────────────
    const rawText = await streamToString(message.raw);
    const body = extractTextFromMime(rawText);

    if (!body || body.length < 30) {
      console.log('[hpb-worker] body too short, skipping');
      message.setReject('Empty body');
      return;
    }

    // ── 5. HairSalonLink API へ POST ───────────────────
    const url = `${env.APP_BASE_URL}/api/inbound/hpb/by-slug/${encodeURIComponent(slug)}`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Inbound-Secret': env.SHARED_SECRET,
        },
        body: JSON.stringify({
          body,
          subject,
          from,
          to,
          received_at: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.log(`[hpb-worker] API failed ${res.status}: ${text}`);
        // 一時エラーなら再試行のため defer する手もあるが、
        // ここでは reject せず素通り (運営ログで気づくこと優先)
      } else {
        console.log(`[hpb-worker] OK ${slug} -> ${res.status}`);
      }
    } catch (e) {
      console.log(`[hpb-worker] fetch error: ${e}`);
    }
  },
};

/* ─────────────────────────────────────────────────────────
 * Helpers
 * ───────────────────────────────────────────────────────── */

async function streamToString(stream) {
  const reader = stream.getReader();
  const chunks = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    total += value.length;
    if (total > 1024 * 1024) break; // 1MB 上限 (安全弁)
  }
  const merged = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) { merged.set(c, offset); offset += c.length; }
  return new TextDecoder('utf-8').decode(merged);
}

/**
 * MIME メールから text/plain 部分を抽出。
 * HTML しかない場合はタグを除去したテキストを返す。
 */
function extractTextFromMime(raw) {
  // 単純な multipart パーサ
  const boundaryMatch = /boundary="?([^";\r\n]+)"?/i.exec(raw);
  if (boundaryMatch) {
    const boundary = boundaryMatch[1];
    const parts = raw.split('--' + boundary);
    let textBody = '';
    let htmlBody = '';
    for (const part of parts) {
      if (/Content-Type:\s*text\/plain/i.test(part)) {
        textBody = decodePart(part);
      } else if (/Content-Type:\s*text\/html/i.test(part)) {
        htmlBody = decodePart(part);
      }
    }
    if (textBody) return textBody;
    if (htmlBody) return stripHtml(htmlBody);
  }
  // 非 multipart
  const split = raw.split(/\r?\n\r?\n/);
  return split.slice(1).join('\n\n');
}

function decodePart(part) {
  // 本文は CRLF CRLF より後
  const idx = part.search(/\r?\n\r?\n/);
  if (idx < 0) return '';
  let body = part.slice(idx).trim();
  // Quoted-printable / Base64 デコードは簡易対応 (HPB はほぼ Plain で来る)
  if (/Content-Transfer-Encoding:\s*base64/i.test(part)) {
    try { body = atob(body.replace(/\s/g, '')); } catch { /* noop */ }
  } else if (/Content-Transfer-Encoding:\s*quoted-printable/i.test(part)) {
    body = body
      .replace(/=\r?\n/g, '')
      .replace(/=([0-9A-Fa-f]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
  }
  return body;
}

function stripHtml(s) {
  return s
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}
