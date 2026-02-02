/**
 * Middleware que guarda o body bruto para validação de assinatura do webhook.
 */

import type { Request, Response } from 'express';

let rawBodyBuffer: Buffer | undefined;

export function getRawBody(): Buffer | undefined {
  return rawBodyBuffer;
}

export function rawBodyMiddleware(
  _req: Request,
  _res: Response,
  buf: Buffer
): void {
  rawBodyBuffer = buf;
}
