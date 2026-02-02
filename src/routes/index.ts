/**
 * Montagem de todas as rotas da aplicação.
 */

import type { Express } from 'express';
import type { Config } from '../config';
import { createWebhookRoutes } from './webhook';
import { health } from './health';
import { createValidateSignature } from '../middleware/validateSignature';
import { createMessengerService } from '../services/messenger';

export function registerRoutes(app: Express, config: Config): void {
  const validateSignature = createValidateSignature(config.appSecret);
  const messenger = createMessengerService({
    pageAccessToken: config.pageAccessToken,
    pageId: config.pageId,
    instagramAccountId: config.instagramAccountId,
  });

  const webhook = createWebhookRoutes(config, validateSignature, messenger);

  app.get('/webhook', webhook.get);
  app.post('/webhook', webhook.post);
  app.get('/', health);
}
