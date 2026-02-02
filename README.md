# Instagram Chatbot

> Bot que responde às DMs do Instagram via **Meta** — webhook em Node.js + TypeScript, suporta API do Instagram com login (token IGAA) ou API com Página (token EAA).

[![CI](https://github.com/decibelzin/chat-bot-easy-four/actions/workflows/ci.yml/badge.svg)](https://github.com/decibelzin/chat-bot-easy-four/actions) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE) [![Node](https://img.shields.io/badge/node-%3E%3D18-green)](package.json)

---

## Conteúdo

- [Sobre](#sobre)
- [Tecnologias](#tecnologias)
- [Estrutura do projeto](#estrutura-do-projeto)
- [O que você precisa](#o-que-você-precisa)
- [Instalação rápida](#instalação-rápida)
- [Configuração](#configuração)
- [Deploy](#deploy)
- [Política de Privacidade](#política-de-privacidade)
- [Personalizar respostas](#personalizar-respostas)

---

## Sobre

Webhook que recebe mensagens do Instagram (DMs) pela API do Meta e envia respostas automáticas. Funciona de duas formas:

- **Token IGAA** (recomendado se a conta não está ligada a uma Página): token gerado em **Gerenciar mensagens e conteúdo no Instagram** → **Configuração da API com login do Instagram** → **Gerar tokens de acesso** → sua conta → **Gerar token**. O servidor usa `graph.instagram.com`.
- **Token EAA** (Página ligada ao Instagram): Page Access Token obtido por `me/accounts` no Graph API Explorer. O servidor usa `graph.facebook.com`.

Guia passo a passo: [TESTE-BOT.md](TESTE-BOT.md).

## Tecnologias

- **Node.js** ≥ 18 · **TypeScript** · **Express**
- Webhook GET (verificação) e POST (eventos)
- Validação de assinatura HMAC (opcional) e variáveis de ambiente (`.env`)

## Estrutura do projeto

```text
chat-bot-easy-four/
├── src/
│   ├── index.ts            # Entrada: bootstrap do servidor
│   ├── app.ts              # Express: middleware e montagem de rotas
│   ├── banner.ts           # Banner no start
│   ├── config/             # Configuração e validação de .env
│   ├── middleware/         # Body bruto e validação de assinatura
│   ├── routes/             # Rotas (webhook, health)
│   ├── handlers/           # Processamento de eventos do webhook
│   ├── services/           # Cliente da API Meta (messenger)
│   ├── bot/                # Lógica de resposta (getReply)
│   └── types/
│       └── webhook.ts      # Tipos da API do Meta
├── privacy/                # Política de Privacidade (GitHub Pages)
├── scripts/                # tunnel.js (app + ngrok), start.sh, etc.
├── .env.example
├── package.json
└── tsconfig.json
```

## O que você precisa

- **Node.js** 18+
- **App no Meta for Developers** (Casos de uso → Gerenciar mensagens e conteúdo no Instagram)
- **Conta Instagram Professional** (Business ou Creator) adicionada ao app
- **Token de acesso**: IGAA (painel “Gerar token”) ou EAA (Page token de `me/accounts`)
- **URL pública HTTPS** para o webhook (ex.: ngrok em desenvolvimento)

## Instalação rápida

```bash
git clone https://github.com/decibelzin/chat-bot-easy-four.git
cd chat-bot-easy-four
npm install
cp .env.example .env
# Edite .env: VERIFY_TOKEN, PAGE_ACCESS_TOKEN e, se IGAA, INSTAGRAM_ACCOUNT_ID
npm run dev
```

Em outro terminal: `ngrok http 3000` (ou use `npm run tunnel`). Configure a URL no painel do Meta (ver [Configuração](#configuração)).

## Configuração

1. **`.env`** (copie de `.env.example`):

   | Variável | Obrigatório | Descrição |
   |----------|-------------|-----------|
   | `VERIFY_TOKEN` | Sim | String que você cola no Meta ao configurar o webhook |
   | `PAGE_ACCESS_TOKEN` | Sim | Token IGAA (Gerar token no painel) ou EAA (me/accounts) |
   | `APP_SECRET` | Não | Chave secreta do app; se vazio, assinatura não é validada |
   | `PORT` | Não | Porta (default 3000) |
   | `SKIP_WEBHOOK_SIGNATURE` | Não | `1` em dev para ignorar assinatura |
   | `INSTAGRAM_ACCOUNT_ID` | Se IGAA | ID da conta (painel “Gerar tokens de acesso”) |
   | `PAGE_ID` | Se EAA | ID da Página do Facebook ligada ao Instagram |

2. **Webhook no Meta**  
   Casos de uso → Gerenciar mensagens e conteúdo no Instagram → Personalizar → Configurar webhooks:
   - URL de callback: `https://SUA_URL_NGROK/webhook`
   - Verify token: mesmo valor de `VERIFY_TOKEN`
   - Assine **messages** e **messaging_postbacks** (postbacks é necessário para Ice Breakers / sugestões no entry).

3. **Sugestões no entry (Ice Breakers)**  
   Para as sugestões aparecerem ao abrir o PV (antes de qualquer mensagem), rode uma vez:  
   `npm run setup-ice-breakers`  
   As perguntas vêm de `src/bot/replies.ts` (`getIceBreakerItems`). O webhook precisa estar inscrito em **messaging_postbacks** (item 2).

4. **Rodar**  
   - Desenvolvimento: `npm run dev` (ngrok em outro terminal) ou `npm run tunnel`.  
   - Produção: `npm run build && npm start`.

Detalhes e troubleshooting: [TESTE-BOT.md](TESTE-BOT.md).

## Deploy

- **GitHub**: envie o repositório; não commite `.env`. Em VPS/servidor use variáveis de ambiente.
- **VPS**: clone o projeto, configure `.env`, use `npm run build && npm start` e exponha a porta (ou use ngrok/PM2 conforme [TESTE-BOT.md](TESTE-BOT.md)).

**Túnel (app + ngrok):** `npm run tunnel` — inicia o ngrok, obtém a URL pela API local e exibe **Webhook URL** no terminal antes de subir o app. Use essa URL no painel do Meta (callback + `/webhook`). No Linux também pode usar `./scripts/tunnel.sh`.

## Política de Privacidade

A pasta `privacy/` contém a política para o painel da Meta. Para publicar no GitHub Pages: Settings → Pages → Source: **GitHub Actions** (workflow `.github/workflows/pages.yml`). URL: `https://decibelzin.github.io/chat-bot-easy-four/`. Instruções em `privacy/README.md`.

## Personalizar respostas

A lógica de resposta está em `src/bot/replies.ts` (`getReply()`). As sugestões no **entry** (Ice Breakers) e nas **mensagens** (Quick Replies) vêm do mesmo arquivo: edite `SUGGESTED_QUESTIONS` (e opcionalmente `entryQuestion` para o texto no entry). Depois de alterar as sugestões no entry, rode de novo `npm run setup-ice-breakers`.

**Endpoints:** `GET /webhook` (verificação) · `POST /webhook` (eventos e envio de mensagens).
