/**
 * Ponto de entrada: carrega config, cria app e inicia o servidor.
 */

import { createApp } from './app';
import { config } from './config';
import { printBanner } from './banner';

const app = createApp();
const { port } = config;

app.listen(port, () => {
  printBanner();
  console.log(`Servidor rodando em http://localhost:${port}`);
});
