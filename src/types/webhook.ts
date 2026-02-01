/**
 * Tipos para o webhook do Meta (Instagram Messaging / Messenger Platform)
 */

export interface WebhookSender {
  id: string;
}

export interface WebhookRecipient {
  id: string;
}

export interface WebhookMessage {
  mid: string;
  text?: string;
  is_echo?: boolean;
  is_deleted?: boolean;
  is_unsupported?: boolean;
  attachments?: Array<{ type: string; payload?: { url?: string } }>;
}

export interface WebhookPostback {
  payload: string;
  title?: string;
  mid?: string;
}

export interface InstagramMessagingEvent {
  sender: WebhookSender;
  recipient: WebhookRecipient;
  timestamp: number;
  message?: WebhookMessage;
  postback?: WebhookPostback;
}

export interface InstagramWebhookEntry {
  id: string;
  time: number;
  messaging: InstagramMessagingEvent[];
}

export interface PageWebhookEntry {
  id: string;
  time: number;
  messaging: InstagramMessagingEvent[];
}

export interface InstagramWebhookBody {
  object: 'instagram';
  entry: InstagramWebhookEntry[];
}

export interface PageWebhookBody {
  object: 'page';
  entry: PageWebhookEntry[];
}

export type WebhookBody = InstagramWebhookBody | PageWebhookBody;
