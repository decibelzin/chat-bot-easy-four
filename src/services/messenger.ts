/**
 * Cliente da API Meta (Instagram Messaging / Messenger Platform).
 * Envio de mensagens via graph.instagram.com ou graph.facebook.com.
 */

export interface SendMessageResponse {
  recipient_id: string;
  message_id: string;
}

export interface MessengerConfig {
  pageAccessToken: string;
  pageId?: string;
  instagramAccountId?: string;
}

/** Quick Reply: título até 20 caracteres (truncado pela Meta); payload livre. */
export interface QuickReplyOption {
  title: string;
  payload: string;
}

function isInstagramToken(token: string): boolean {
  return token.startsWith('IGAA');
}

function buildMessagePayload(
  text: string,
  quickReplies?: QuickReplyOption[]
): { text: string; quick_replies?: Array<{ content_type: string; title: string; payload: string }> } {
  const message: { text: string; quick_replies?: Array<{ content_type: string; title: string; payload: string }> } = { text };
  if (quickReplies?.length) {
    message.quick_replies = quickReplies.map((q) => ({
      content_type: 'text',
      title: q.title.slice(0, 20),
      payload: q.payload,
    }));
  }
  return message;
}

export function createMessengerService(config: MessengerConfig) {
  const { pageAccessToken, pageId, instagramAccountId } = config;
  const token = pageAccessToken;

  async function doSend(
    recipientId: string,
    message: { text: string; quick_replies?: Array<{ content_type: string; title: string; payload: string }> }
  ): Promise<SendMessageResponse> {
    const isIG = isInstagramToken(token);
    const baseUrl = isIG
      ? 'https://graph.instagram.com/v21.0'
      : 'https://graph.facebook.com/v21.0';
    const pathId = isIG
      ? (instagramAccountId || 'me')
      : (instagramAccountId || pageId || 'me');
    const url = isIG
      ? `${baseUrl}/${pathId}/messages`
      : `${baseUrl}/${pathId}/messages?access_token=${encodeURIComponent(token)}`;

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (isIG) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        recipient: { id: recipientId },
        message,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(JSON.stringify(err));
    }

    return res.json() as Promise<SendMessageResponse>;
  }

  async function sendMessage(
    recipientId: string,
    text: string
  ): Promise<SendMessageResponse> {
    return doSend(recipientId, buildMessagePayload(text));
  }

  async function sendMessageWithQuickReplies(
    recipientId: string,
    text: string,
    quickReplies: QuickReplyOption[]
  ): Promise<SendMessageResponse> {
    return doSend(recipientId, buildMessagePayload(text, quickReplies));
  }

  return { sendMessage, sendMessageWithQuickReplies };
}
