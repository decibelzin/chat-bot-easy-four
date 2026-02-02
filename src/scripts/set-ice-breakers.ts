/**
 * Configura Ice Breakers (sugestões no entry do chat) na conta Instagram.
 * Rode uma vez: npm run setup-ice-breakers
 *
 * Requisitos no painel Meta:
 * - Webhook Instagram inscrito em messaging_postbacks (para receber o toque nas sugestões).
 */

import 'dotenv/config';
import { config } from '../config';
import { getIceBreakerItems } from '../bot/replies';
import { setIceBreakers } from '../services/messengerProfile';

async function main(): Promise<void> {
  const items = getIceBreakerItems();
  console.log('Configurando Ice Breakers (entry):', items.map((q) => q.question));

  const result = await setIceBreakers(config, items);

  if (result.success) {
    console.log('Ice Breakers configurados. Abra o PV da conta no app e as sugestões devem aparecer no entry.');
  } else {
    console.error('Erro:', result.error);
    process.exit(1);
  }
}

main();
