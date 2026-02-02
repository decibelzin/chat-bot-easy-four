/**
 * Messenger Profile API: Ice Breakers (sugestões no entry do chat).
 * Configura as perguntas que aparecem ao abrir o PV, antes de qualquer mensagem.
 */

import type { Config } from '../config';

export interface IceBreakerItem {
  question: string;
  payload: string;
}

const API_VERSION = 'v21.0';

function isInstagramToken(token: string): boolean {
  return token.startsWith('IGAA');
}

/**
 * Define as Ice Breakers (máx. 4) na conta/Página.
 * Rode uma vez (ex.: npm run setup-ice-breakers); a API tem limite de 10 chamadas / 10 min.
 */
export async function setIceBreakers(
  config: Config,
  items: IceBreakerItem[]
): Promise<{ success: boolean; error?: string }> {
  const token = config.pageAccessToken;
  const list = items.slice(0, 4);

  if (list.length === 0) {
    return { success: false, error: 'Nenhuma pergunta fornecida.' };
  }

  const body = {
    platform: 'instagram',
    ice_breakers: [
      {
        call_to_actions: list.map((q) => ({
          question: q.question,
          payload: q.payload,
        })),
        locale: 'default',
      },
    ],
  };

  let url: string;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (isInstagramToken(token)) {
    const pathId = config.instagramAccountId || 'me';
    url = `https://graph.instagram.com/${API_VERSION}/${pathId}/messenger_profile`;
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    url = `https://graph.facebook.com/${API_VERSION}/me/messenger_profile?platform=instagram&access_token=${encodeURIComponent(token)}`;
  }

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  const data = (await res.json().catch(() => ({}))) as { success?: boolean; error?: { message?: string } };
  if (!res.ok) {
    return { success: false, error: data.error?.message ?? JSON.stringify(data) };
  }
  return { success: data.success !== false };
}
