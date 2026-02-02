#!/usr/bin/env node
/**
 * Inicia ngrok, obtém a URL pela API local, exibe o webhook URL e sobe o app.
 * Uso: node scripts/tunnel.js   ou   npm run tunnel
 */

const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const PORT = process.env.PORT || 3000;
const NGROK_API = 'http://127.0.0.1:4040';

function getTunnelUrl() {
  return new Promise((resolve, reject) => {
    const req = http.get(`${NGROK_API}/api/tunnels`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const tunnel = (json.tunnels || []).find((t) => t.public_url?.startsWith('https://'));
          resolve(tunnel ? tunnel.public_url : null);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(3000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function waitForNgrok(maxAttempts = 20) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      try {
        const url = await getTunnelUrl();
        if (url) {
          clearInterval(interval);
          resolve(url);
          return;
        }
      } catch (_) {}
      if (attempts >= maxAttempts) {
        clearInterval(interval);
        reject(new Error('ngrok API não respondeu a tempo'));
      }
    }, 500);
  });
}

function printBanner(webhookUrl) {
  const line = '─'.repeat(56);
  console.log('\n' + line);
  // console.log('  WEBHOOK URL (cole no painel do Meta):');
  console.log('  ' + webhookUrl);
  console.log(line + '\n');
}

const root = path.resolve(__dirname, '..');
const isWindows = process.platform === 'win32';

const ngrok = spawn('ngrok', ['http', String(PORT)], {
  cwd: root,
  stdio: 'ignore',
});

setTimeout(async () => {
  try {
    const url = await waitForNgrok();
    const webhookUrl = url + '/webhook';
    printBanner(webhookUrl);
  } catch (e) {
    console.error('[tunnel] Não foi possível obter a URL do ngrok:', e.message);
  }

  // Executar ts-node diretamente (evita spawn de npm no Windows que dá EINVAL)
const tsNodeBin = require.resolve('ts-node/dist/bin.js', { paths: [root] });
const app = spawn(process.execPath, [tsNodeBin, path.join(root, 'src', 'index.ts')], {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
  });

  function killAll() {
    try {
      ngrok.kill('SIGTERM');
    } catch (_) {}
    try {
      app.kill('SIGTERM');
    } catch (_) {}
    process.exit(0);
  }

  process.on('SIGINT', killAll);
  process.on('SIGTERM', killAll);

  app.on('exit', (code) => {
    try {
      ngrok.kill('SIGTERM');
    } catch (_) {}
    process.exit(code ?? 0);
  });
}, 1500);
