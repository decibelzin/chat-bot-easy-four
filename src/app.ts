/**
 * Aplicação Express: middleware e rotas.
 * Não inicia o servidor (responsabilidade do index).
 */

import 'dotenv/config';
import express from 'express';
import { rawBodyMiddleware } from './middleware';
import { registerRoutes } from './routes';
import { config } from './config';

export function createApp(): express.Express {
  const app = express();

  app.use(express.json({ verify: rawBodyMiddleware }));
  registerRoutes(app, config);

  return app;
}
