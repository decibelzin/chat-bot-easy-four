/**
 * Rotas do webhook Meta: verificação (GET) e eventos (POST).
 */

import type { Request, Response } from 'express';
import { processWebhookBody } from '../handlers';
import type { Config } from '../config';
import type { createValidateSignature } from '../middleware/validateSignature';
import type { createMessengerService } from '../services/messenger';
import type { WebhookBody } from '../types/webhook';

export function createWebhookRoutes(
  config: Config,
  validateSignature: ReturnType<typeof createValidateSignature>,
  messenger: ReturnType<typeof createMessengerService>
) {
  const messengerActions = {
    sendMessage: messenger.sendMessage.bind(messenger),
    sendMessageWithQuickReplies: messenger.sendMessageWithQuickReplies.bind(messenger),
  };

  return {
    get(req: Request, res: Response): void {
      const mode = req.query['hub.mode'] as string | undefined;
      const token = req.query['hub.verify_token'] as string | undefined;
      const challenge = req.query['hub.challenge'] as string | undefined;

      if (mode === 'subscribe' && token === config.verifyToken && challenge !== undefined) {
        console.log('Webhook verificado com sucesso.');
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    },

    post(req: Request, res: Response): void {
      const skipSig = config.skipWebhookSignature;
      if (!skipSig && config.appSecret && !validateSignature(req)) {
        console.warn('Assinatura do webhook inválida.');
        res.sendStatus(401);
        return;
      }

      res.status(200).send('EVENT_RECEIVED');

      const body = req.body as WebhookBody;
      processWebhookBody(body, messengerActions);
    },
  };
}
