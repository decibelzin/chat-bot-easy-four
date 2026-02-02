/**
 * Handlers de eventos do webhook Meta (Instagram / Page).
 * Despacha mensagens, postbacks e quick_replies para o bot e envia respostas via messenger.
 */

import type {
  WebhookBody,
  InstagramMessagingEvent,
  InstagramWebhookEntry,
  PageWebhookEntry,
} from '../types/webhook';
import { getReply, getSuggestedQuestions } from '../bot';
import type { SendMessageResponse } from '../services/messenger';

export interface MessengerActions {
  sendMessage(recipientId: string, text: string): Promise<SendMessageResponse>;
  sendMessageWithQuickReplies(
    recipientId: string,
    text: string,
    quickReplies: Array<{ title: string; payload: string }>
  ): Promise<SendMessageResponse>;
}

function logSendError(err: unknown): void {
  const msg =
    err && typeof err === 'object' && 'response' in err
      ? (err as { response?: { data?: unknown } }).response?.data
      : err instanceof Error
        ? err.message
        : String(err);
  console.error('Erro ao enviar mensagem:', msg);
}

function handleInstagramEvent(
  event: InstagramMessagingEvent,
  _igAccountId: string,
  messenger: MessengerActions
): void {
  const senderId = event.sender?.id;
  if (!senderId) return;

  if (event.message && !event.message.is_echo) {
    const text = event.message.quick_reply
      ? event.message.quick_reply.payload
      : (event.message.text ?? '');
    const reply = getReply(text);
    // Sempre envia com Quick Replies para o usuário poder trocar de opção a qualquer momento
    messenger
      .sendMessageWithQuickReplies(senderId, reply, getSuggestedQuestions())
      .catch(logSendError);
    return;
  }

  if (event.postback) {
    const payload = event.postback.payload;
    const reply = getReply(payload);
    // Sempre envia com Quick Replies para o usuário poder voltar a outra opção
    messenger
      .sendMessageWithQuickReplies(senderId, reply, getSuggestedQuestions())
      .catch(logSendError);
  }
}

function handlePageEvent(
  event: InstagramMessagingEvent,
  messenger: MessengerActions
): void {
  const senderId = event.sender?.id;
  if (!senderId) return;
  if (event.message && !event.message.is_echo) {
    const text = event.message.quick_reply
      ? event.message.quick_reply.payload
      : (event.message.text ?? '');
    const reply = getReply(text);
    messenger
      .sendMessageWithQuickReplies(senderId, reply, getSuggestedQuestions())
      .catch(logSendError);
  }
}

export function processWebhookBody(
  body: WebhookBody,
  messenger: MessengerActions
): void {
  if (body.object === 'instagram') {
    for (const entry of body.entry as InstagramWebhookEntry[]) {
      for (const event of entry.messaging ?? []) {
        handleInstagramEvent(event, entry.id, messenger);
      }
    }
  }

  if (body.object === 'page') {
    for (const entry of body.entry as PageWebhookEntry[]) {
      for (const event of entry.messaging ?? []) {
        handlePageEvent(event, messenger);
      }
    }
  }
}
