/**
 * Configuração centralizada e validação de variáveis de ambiente.
 */

function getEnv(key: string): string | undefined {
  return process.env[key]?.trim();
}

function requireEnv(key: string): string {
  const value = getEnv(key);
  if (!value) {
    console.error(`Configure .env com ${key}.`);
    process.exit(1);
  }
  return value;
}

export const config = {
  port: Number(getEnv('PORT')) || 3000,
  verifyToken: requireEnv('VERIFY_TOKEN'),
  appSecret: getEnv('APP_SECRET'),
  pageAccessToken: requireEnv('PAGE_ACCESS_TOKEN'),
  pageId: getEnv('PAGE_ID'),
  instagramAccountId: getEnv('INSTAGRAM_ACCOUNT_ID'),
  skipWebhookSignature:
    getEnv('SKIP_WEBHOOK_SIGNATURE') === '1' ||
    getEnv('SKIP_WEBHOOK_SIGNATURE') === 'true',
} as const;

export type Config = typeof config;
