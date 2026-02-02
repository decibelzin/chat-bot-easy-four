/**
 * Rota de saúde / raiz do servidor.
 */

import type { Request, Response } from 'express';

export function health(_req: Request, res: Response): void {
  res.send('Instagram Chatbot – Webhook ativo. Use GET /webhook para verificação.');
}
