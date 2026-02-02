/**
 * Validação da assinatura X-Hub-Signature-256 do webhook Meta.
 */

import crypto from 'crypto';
import type { Request } from 'express';
import { getRawBody } from './rawBody';

export function createValidateSignature(appSecret: string | undefined) {
  return function validateSignature(req: Request): boolean {
    if (!appSecret) return true;
    const signature = req.headers['x-hub-signature-256'];
    if (typeof signature !== 'string') return false;
    const rawBody = getRawBody();
    if (!rawBody) return false;
    const [, hash] = signature.split('=');
    const expected = crypto
      .createHmac('sha256', appSecret)
      .update(rawBody)
      .digest('hex');
    return hash === expected;
  };
}
