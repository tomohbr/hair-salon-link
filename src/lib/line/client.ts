// LINE Messaging API クライアント
//
// マルチテナント対応。`creds` に店舗固有の accessToken / channelSecret を渡す。
// 渡されなかった場合は環境変数にフォールバック（開発/シングルテナント検証用）。
// どちらも無ければモック動作（ログのみ）して ok: true を返す。

const API_BASE = 'https://api.line.me/v2/bot';

export interface LineCreds {
  accessToken?: string | null;
  channelSecret?: string | null;
}

function resolveToken(creds?: LineCreds): string {
  return (creds?.accessToken || process.env.LINE_CHANNEL_ACCESS_TOKEN || '').trim();
}
function resolveSecret(creds?: LineCreds): string {
  return (creds?.channelSecret || process.env.LINE_CHANNEL_SECRET || '').trim();
}

async function lineFetch(path: string, body: unknown, creds?: LineCreds) {
  const token = resolveToken(creds);
  if (!token) {
    console.log('[LINE Mock]', path, JSON.stringify(body).slice(0, 200));
    return { ok: true, mock: true } as const;
  }
  const res = await fetch(API_BASE + path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const responseBody = await res.text();
  if (!res.ok) {
    console.error('[LINE API error]', path, res.status, responseBody);
  }
  return { ok: res.ok, status: res.status, body: responseBody } as const;
}

export async function pushText(userId: string, text: string, creds?: LineCreds) {
  return lineFetch('/message/push', {
    to: userId,
    messages: [{ type: 'text', text }],
  }, creds);
}

export async function replyText(replyToken: string, text: string, creds?: LineCreds) {
  return lineFetch('/message/reply', {
    replyToken,
    messages: [{ type: 'text', text }],
  }, creds);
}

export async function broadcastText(text: string, creds?: LineCreds) {
  return lineFetch('/message/broadcast', {
    messages: [{ type: 'text', text }],
  }, creds);
}

export async function multicastText(userIds: string[], text: string, creds?: LineCreds) {
  if (userIds.length === 0) return { ok: true } as const;
  const batches: string[][] = [];
  for (let i = 0; i < userIds.length; i += 500) batches.push(userIds.slice(i, i + 500));
  const results = [];
  for (const batch of batches) {
    results.push(
      await lineFetch('/message/multicast', {
        to: batch,
        messages: [{ type: 'text', text }],
      }, creds)
    );
  }
  return { ok: true, batches: results.length } as const;
}

export async function pushFlexCoupon(
  userId: string, title: string, description: string, discount: string, bookUri?: string,
  creds?: LineCreds,
) {
  return lineFetch('/message/push', {
    to: userId,
    messages: [
      {
        type: 'flex',
        altText: `${title} - ${discount}`,
        contents: {
          type: 'bubble',
          hero: {
            type: 'box',
            layout: 'vertical',
            contents: [
              { type: 'text', text: '🎫 特別クーポン', size: 'sm', color: '#c9a96e', weight: 'bold' },
            ],
            paddingAll: 'lg',
            backgroundColor: '#1f1812',
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              { type: 'text', text: title, weight: 'bold', size: 'lg', wrap: true },
              { type: 'text', text: discount, size: 'xxl', weight: 'bold', color: '#c9a96e', margin: 'md' },
              { type: 'text', text: description, size: 'sm', color: '#78716C', wrap: true, margin: 'md' },
            ],
          },
          footer: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'button',
                style: 'primary',
                color: '#c9a96e',
                action: { type: 'uri', label: '予約する', uri: bookUri || 'https://example.com/book' },
              },
            ],
          },
        },
      },
    ],
  }, creds);
}

/** Webhook 署名検証。secret が渡されない場合は環境変数を参照、それもなければバイパス（開発時）。 */
export function verifySignature(body: string, signature: string, creds?: LineCreds): boolean {
  const secret = resolveSecret(creds);
  if (!secret) return true;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const crypto = require('crypto') as typeof import('crypto');
    const hash = crypto.createHmac('SHA256', secret).update(body).digest('base64');
    return hash === signature;
  } catch {
    return false;
  }
}

/** 接続テスト：LINE Messaging API の /v2/bot/info を叩いて認証が通るか確認 */
export async function testConnection(creds: LineCreds): Promise<{ ok: boolean; status?: number; body?: string; message?: string }> {
  const token = resolveToken(creds);
  if (!token) return { ok: false, message: 'アクセストークンが未設定です' };
  try {
    const res = await fetch(API_BASE + '/info', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.text();
    if (!res.ok) return { ok: false, status: res.status, body, message: `LINE API エラー (${res.status})` };
    return { ok: true, status: res.status, body };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : String(err) };
  }
}
