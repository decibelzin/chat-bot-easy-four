# Instagram Chatbot

> Bot que responde às mensagens diretas (DMs) do Instagram via **Meta Messenger Platform** — webhook em Node.js + TypeScript, pronto para desenvolvimento e deploy.

[![CI](https://github.com/decibelzin/chat-bot-easy-four/actions/workflows/ci.yml/badge.svg)](https://github.com/decibelzin/chat-bot-easy-four/actions) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE) [![Node](https://img.shields.io/badge/node-%3E%3D18-green)](package.json)

---

## Conteúdo

- [Sobre](#sobre)
- [Demonstração](#demonstração)
- [Tecnologias](#tecnologias)
- [Estrutura do projeto](#estrutura-do-projeto)
- [O que você precisa](#o-que-você-precisa)
- [Instalação rápida](#instalação-rápida)
- [Configuração](#configuração)
- [Deploy (GitHub + VPS)](#deploy-github--vps)
- [Política de Privacidade](#política-de-privacidade-meta--publicar-app)
- [Segurança](#segurança)
- [Personalizar respostas](#personalizar-respostas)

---

## Sobre

Este projeto é um **webhook** que recebe mensagens do Instagram (DMs) pela API do Meta e envia respostas automáticas. Ideal para:

- Atendimento automático via Instagram Direct
- Respostas padrão ou personalizadas (incluindo integração com IA)
- Uso em desenvolvimento com ngrok ou em produção em VPS/servidor

Funciona com **Instagram Business ou Creator** vinculado a uma Página do Facebook e app configurado no [Meta for Developers](https://developers.facebook.com/).

## Demonstração

*Adicione aqui um screenshot ou GIF da conversa no Instagram para destacar o projeto (ex.: `![Conversa](assets/demo.png)`).*

## Tecnologias

- **Node.js** (≥ 18) · **TypeScript** · **Express**
- Webhook **GET** (verificação) e **POST** (eventos)
- Validação de assinatura (HMAC) e variáveis de ambiente (`.env`)

## Estrutura do projeto

```text
chat-bot-easy-four/
├── src/
│   ├── server.ts           # Servidor e rotas do webhook
│   └── types/
│       └── webhook.ts      # Tipos da API do Meta
├── privacy/
│   ├── index.md            # Política de Privacidade (GitHub Pages)
│   └── README.md           # Instruções GitHub Pages
├── scripts/
│   ├── tunnel.sh           # App + ngrok (Linux)
│   ├── tunnel.ps1 / .bat   # App + ngrok (Windows)
│   └── start.sh
├── .env.example            # Modelo de variáveis (nunca commite .env)
├── package.json
└── tsconfig.json
```

## O que você precisa

- **Node.js** 18+
- **Conta no Meta for Developers** com app criado
- **Instagram Business/Creator** vinculado a uma Página do Facebook
- **Page Access Token** (token gerado em "Adicionar conta" no Instagram)
- **URL pública HTTPS** para o webhook (Meta não aceita localhost na produção)

## Instalação rápida

```bash
git clone https://github.com/decibelzin/chat-bot-easy-four.git
cd chat-bot-easy-four
npm install
cp .env.example .env
# Edite .env com VERIFY_TOKEN, APP_SECRET, PAGE_ACCESS_TOKEN
npm run dev
```

Em outro terminal, use um túnel HTTPS (ex.: `ngrok http 3000`) e configure a URL no painel do Meta (veja [Configuração](#configuração)).

## Configuração

1. **Instale as dependências**

   ```bash
   npm install
   ```

2. **Crie o arquivo `.env`** (copie de `.env.example`):

   ```env
   VERIFY_TOKEN=escolha_uma_string_secreta_qualquer
   APP_SECRET=sua_chave_secreta_do_app
   PAGE_ACCESS_TOKEN=seu_page_access_token_instagram
   PORT=3000
   ```

   - **VERIFY_TOKEN**: qualquer texto que você quiser; você vai colar o mesmo valor no painel do Meta ao configurar o webhook.
   - **APP_SECRET**: em Configurações do app → Básico → Chave secreta.
   - **PAGE_ACCESS_TOKEN**: o token que você gerou em "Adicionar conta" no Instagram.

3. **Suba o servidor com URL pública (HTTPS)**

   Em desenvolvimento, o Meta precisa conseguir acessar sua URL. Use um túnel, por exemplo:

   - [ngrok](https://ngrok.com/): `ngrok http 3000`
   - Ou qualquer outro serviço que gere uma URL HTTPS.

   A URL do webhook será: `https://SUA-URL/publica/webhook`

4. **No painel do Meta**

   - **Casos de uso** → **Gerenciar mensagens e conteúdo no Instagram** → **Personalizar**
   - Em **Configurar webhooks**:
     - **URL de callback**: `https://SUA-URL/publica/webhook`
     - **Verify token**: o mesmo valor que você colocou em `VERIFY_TOKEN` no `.env`
   - Salve e assine o campo **messages** (e outros que quiser).

5. **Inicie o servidor** (escolha um)

   **Um comando (app + ngrok)** — ideal para testar ou VPS plug-and-play:

   - **Windows** (desenvolvimento agora; depois passa o projeto pro Linux):
     - Instale [ngrok](https://ngrok.com/download) e deixe no PATH.
     - Qualquer uma das opções:
       ```bat
       npm run tunnel
       ```
       ou, para respeitar a porta do `.env`:
       ```powershell
       .\scripts\tunnel.ps1
       ```
       ou clique/duplo clique (usa porta 3000):
       ```bat
       scripts\tunnel.bat
       ```
     - Use a URL que o ngrok mostrar + `/webhook` no painel da Meta.

   - **Linux (VPS):** só configurar o `.env`, depois:
     ```bash
     chmod +x scripts/tunnel.sh
     ./scripts/tunnel.sh
     ```
     Copie a URL HTTPS do ngrok e use como URL de callback no Meta.

   **Só o app** (ngrok em outro terminal):

   ```bash
   npm run dev
   ```
   Em outro terminal: `ngrok http 3000` (ou a porta do seu `.env`).

   **Produção (só o app, ex. com PM2):**

   ```bash
   npm run build
   npm start
   ```

Depois, envie uma DM para a conta do Instagram conectada ao app; o bot deve responder.

---

## Deploy (GitHub + VPS)

### Publicar no GitHub

1. Crie um repositório no GitHub (ex.: `chat-bot-easy-four`).
2. A URL do repositório está em `package.json` e nas badges do README.
3. Nunca commite o `.env` — ele já está no `.gitignore`. Em servidores, use variáveis de ambiente ou secrets.
4. Para **Política de Privacidade** no Meta, ative GitHub Pages na pasta `privacy/` (veja [Política de Privacidade](#política-de-privacidade-meta--publicar-app)).

### VPS Linux (plug and play)

1. Envie o projeto para a VPS (`git clone` ou upload).
2. Instale Node.js 18+ e [ngrok](https://ngrok.com/download) (ex.: `snap install ngrok` ou baixe do site).
3. Configure o `.env`:
   ```bash
   cp .env.example .env
   nano .env   # preencha VERIFY_TOKEN, APP_SECRET, PAGE_ACCESS_TOKEN
   ```
4. Rode o túnel (app + ngrok):
   ```bash
   npm install
   chmod +x scripts/tunnel.sh
   ./scripts/tunnel.sh
   ```
5. Copie a URL HTTPS do ngrok (ex.: `https://abc123.ngrok-free.app`) e no painel da Meta use **URL de callback**: `https://abc123.ngrok-free.app/webhook`.

Para rodar o app em background (ex. com PM2) e o ngrok em outro processo:
- Terminal 1: `npm run build && pm2 start dist/server.js --name instagram-bot`
- Terminal 2: `ngrok http 3000`

### Scripts por sistema (app + ngrok em um comando)

| Sistema  | Comando / arquivo     | Observação           |
|----------|------------------------|----------------------|
| Windows  | `npm run tunnel`       | Porta 3000           |
| Windows  | `scripts\tunnel.bat`   | Duplo clique         |
| Windows  | `.\scripts\tunnel.ps1` | Usa `PORT` do `.env` |
| Linux    | `./scripts/tunnel.sh`  | Usa `PORT` do `.env` |

## Política de Privacidade (Meta / Publicar app)

A pasta **`privacy/`** contém a Política de Privacidade em `privacy/index.md`. Para usar como URL no painel da Meta:

1. Suba o repositório no GitHub (com a pasta `privacy/`).
2. Ative **GitHub Pages**: Settings → Pages → em **Build and deployment**, em **Source** escolha **GitHub Actions** (o workflow `.github/workflows/pages.yml` publica a pasta `privacy/`).
3. A URL será: `https://decibelzin.github.io/chat-bot-easy-four/`
4. No painel da Meta: **Configurações do app** → **URL da Política de Privacidade** → cole essa URL.

Detalhes em `privacy/README.md`.

## Segurança

- **Nunca** commite o arquivo `.env` ou exponha o `PAGE_ACCESS_TOKEN`.
- Se o token vazou, gere um novo no painel do Meta e atualize o `.env`.

### Comandos (TypeScript)

| Comando        | Descrição                          |
|----------------|------------------------------------|
| `npm run dev`  | Desenvolvimento (ts-node)          |
| `npm run build`| Gera `dist/` com JavaScript        |
| `npm start`    | Executa o build em `dist/`         |

## Personalizar respostas

As respostas estão na função `getReply()` em `src/server.ts`. Você pode:

- Trocar as frases fixas
- Conectar a uma API de IA (OpenAI, etc.)
- Usar banco de dados para perguntas frequentes

### Endpoints

- **`GET /webhook`** — verificação da URL pelo Meta (hub.mode, hub.verify_token, hub.challenge).
- **`POST /webhook`** — recebe eventos (mensagens, postbacks, etc.) e envia a resposta via Graph API.
