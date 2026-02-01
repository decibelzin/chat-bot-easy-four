/**
 * Instagram Chatbot - Webhook server (TypeScript)
 * Recebe DMs do Instagram via Meta Messenger Platform e responde.
 */

import 'dotenv/config';
import express, { Request, Response } from 'express';
import crypto from 'crypto';
import type {
  WebhookBody,
  InstagramMessagingEvent,
  InstagramWebhookEntry,
  PageWebhookEntry,
} from './types/webhook';

const app = express();
const PORT = process.env.PORT || 3000;

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const APP_SECRET = process.env.APP_SECRET;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const SKIP_WEBHOOK_SIGNATURE = process.env.SKIP_WEBHOOK_SIGNATURE === '1' || process.env.SKIP_WEBHOOK_SIGNATURE === 'true';

if (!VERIFY_TOKEN || !PAGE_ACCESS_TOKEN) {
  console.error('Configure .env com VERIFY_TOKEN e PAGE_ACCESS_TOKEN.');
  process.exit(1);
}

let rawBodyBuffer: Buffer | undefined;

function rawBodyMiddleware(req: Request, _res: Response, buf: Buffer): void {
  rawBodyBuffer = buf;
}

// Body parser deve vir antes das rotas para o POST receber o body
app.use(express.json({ verify: rawBodyMiddleware }));

function validateSignature(req: Request): boolean {
  if (!APP_SECRET) return true;
  const signature = req.headers['x-hub-signature-256'];
  if (typeof signature !== 'string') return false;
  if (!rawBodyBuffer) return false;
  const [, hash] = signature.split('=');
  const expected = crypto
    .createHmac('sha256', APP_SECRET)
    .update(rawBodyBuffer)
    .digest('hex');
  return hash === expected;
}

// ----- Verificação do Webhook (GET) -----
app.get('/webhook', (req: Request, res: Response) => {
  const mode = req.query['hub.mode'] as string | undefined;
  const token = req.query['hub.verify_token'] as string | undefined;
  const challenge = req.query['hub.challenge'] as string | undefined;

  if (mode === 'subscribe' && token === VERIFY_TOKEN && challenge !== undefined) {
    console.log('Webhook verificado com sucesso.');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// ----- Eventos do Webhook (POST) -----
app.post('/webhook', (req: Request, res: Response) => {
  const skipSig = SKIP_WEBHOOK_SIGNATURE;
  if (!skipSig && APP_SECRET && !validateSignature(req)) {
    console.warn('Assinatura do webhook inválida.');
    return res.sendStatus(401);
  }
  if (skipSig) console.log('[dev] Assinatura do webhook ignorada (SKIP_WEBHOOK_SIGNATURE).');

  res.status(200).send('EVENT_RECEIVED');

  const body = req.body as WebhookBody;

  if (body.object === 'instagram') {
    for (const entry of body.entry as InstagramWebhookEntry[]) {
      for (const event of entry.messaging ?? []) {
        handleInstagramEvent(event, entry.id);
      }
    }
  }

  if (body.object === 'page') {
    for (const entry of body.entry as PageWebhookEntry[]) {
      for (const event of entry.messaging ?? []) {
        handlePageEvent(event);
      }
    }
  }
});

function handleInstagramEvent(event: InstagramMessagingEvent, _igAccountId: string): void {
  const senderId = event.sender?.id;
  if (!senderId) return;

  if (event.message && !event.message.is_echo) {
    const text = event.message.text ?? '';
    console.log(`[Instagram] Mensagem de ${senderId}: ${text}`);
    const reply = getReply(text);
    sendInstagramMessage(senderId, reply).catch((err: Error & { response?: { data?: unknown } }) => {
      console.error('Erro ao enviar mensagem:', err?.response?.data ?? err.message);
    });
    return;
  }

  if (event.postback) {
    const payload = event.postback.payload;
    console.log(`[Instagram] Postback de ${senderId}: ${payload}`);
    const reply = getReply(payload);
    sendInstagramMessage(senderId, reply).catch((err: Error & { response?: { data?: unknown } }) => {
      console.error('Erro ao enviar mensagem:', err?.response?.data ?? err.message);
    });
  }
}

function handlePageEvent(event: InstagramMessagingEvent): void {
  const senderId = event.sender?.id;
  if (!senderId) return;
  if (event.message && !event.message.is_echo) {
    const text = event.message.text ?? '';
    console.log(`[Page] Mensagem de ${senderId}: ${text}`);
    const reply = getReply(text);
    sendPageMessage(senderId, reply).catch((err: Error & { response?: { data?: unknown } }) => {
      console.error('Erro ao enviar mensagem:', err?.response?.data ?? err.message);
    });
  }
}

function getReply(userText: string): string {
  const t = (userText ?? '').trim().toLowerCase();
  if (t === 'oi' || t === 'olá' || t === 'ola') return 'Olá! Como posso ajudar?';
  if (t === 'ajuda') return 'Envie sua dúvida que eu te ajudo.';
  return `Você disse: "${userText}". Em breve podemos conectar uma IA ou mais respostas automáticas aqui.`;
}

interface SendMessageResponse {
  recipient_id: string;
  message_id: string;
}

async function sendInstagramMessage(
  recipientId: string,
  text: string
): Promise<SendMessageResponse> {
  const url = `https://graph.facebook.com/v21.0/me/messages?access_token=${encodeURIComponent(PAGE_ACCESS_TOKEN!)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipient: { id: recipientId },
      message: { text },
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(JSON.stringify(err));
  }
  return res.json() as Promise<SendMessageResponse>;
}

async function sendPageMessage(recipientId: string, text: string): Promise<SendMessageResponse> {
  return sendInstagramMessage(recipientId, text);
}

app.get('/', (_req: Request, res: Response) => {
  res.send('Instagram Chatbot – Webhook ativo. Use GET /webhook para verificação.');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log('Webhook: GET/POST /webhook');
});
