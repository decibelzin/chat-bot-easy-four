# Como testar o bot no Instagram

## 1. Conferir o `.env`

Copie `.env.example` para `.env` e preencha:

| Variável | Obrigatório | Descrição |
|----------|-------------|-----------|
| `VERIFY_TOKEN` | Sim | String que você cola no Meta ao configurar o webhook |
| `PAGE_ACCESS_TOKEN` | Sim | Token IGAA ou EAA (ver abaixo) |
| `APP_SECRET` | Não | Chave secreta do app (Configurações → Básico). Se vazio, assinatura não é validada |
| `PORT` | Não | Default 3000 |
| `SKIP_WEBHOOK_SIGNATURE` | Não | `1` em dev para ignorar assinatura |
| `INSTAGRAM_ACCOUNT_ID` | Se IGAA | ID da conta (painel “Gerar tokens de acesso”, ex.: 17841401836261698) |
| `PAGE_ID` | Se EAA | ID da Página do Facebook ligada ao Instagram |

### Token IGAA (recomendado se a conta não está ligada a uma Página)

1. Meta for Developers → seu app → **Casos de uso** → **Gerenciar mensagens e conteúdo no Instagram** → **Personalizar**.
2. **Configuração da API com login do Instagram** → **2. Gerar tokens de acesso**.
3. Na linha da conta (ex.: oliviamalvolio), clique em **Gerar token**. Copie o token (começa com **IGAA**).
4. No `.env`: `PAGE_ACCESS_TOKEN=` esse token e `INSTAGRAM_ACCOUNT_ID=` ID da conta (o número que aparece na mesma linha, ex.: `17841401836261698`).
5. O servidor usa **graph.instagram.com** e envia com esse token.

### Token EAA (quando a conta está ligada a uma Página do Facebook)

1. [Graph API Explorer](https://developers.facebook.com/tools/explorer/) → selecione seu app.
2. **Gerar token de acesso** → marque: `pages_show_list`, `pages_manage_metadata`, `pages_messaging`, `instagram_basic`, `instagram_manage_messages`, `business_management`.
3. Autorize e **marque a Página** ligada ao Instagram. Copie o **User access token**.
4. Requisição GET: **`me/accounts`**. Na resposta, em `data`, pegue o **`access_token`** da Página (começa com **EAA**).
5. No `.env`: `PAGE_ACCESS_TOKEN=` esse valor e, se quiser, `PAGE_ID=` ID da Página.
6. Se `me/accounts` vier vazio: use GET `https://graph.facebook.com/v21.0/SEU_PAGE_ID?fields=access_token&access_token=SEU_USER_TOKEN` (substitua SEU_PAGE_ID e SEU_USER_TOKEN).

### Erro (#3) "Application does not have the capability"

Ocorre quando o **Page token (EAA)** foi gerado com um User token **sem** `instagram_manage_messages`. Gere um **novo** User token no Graph API Explorer **com** `instagram_manage_messages` e `instagram_basic`, chame de novo `me/accounts` e use o novo `access_token` da Página no `.env`.

---

## 2. Subir o app + túnel (ngrok)

O Meta só chama URLs públicas HTTPS.

**Um comando (app + ngrok):**

```powershell
npm run tunnel
```

**Dois terminais:** Terminal 1: `npm run dev` · Terminal 2: `ngrok http 3000`.

Anote a URL HTTPS (ex.: `https://abc123.ngrok-free.app`).

---

## 3. Configurar o webhook no Meta

1. Meta for Developers → seu app → **Casos de uso** → **Gerenciar mensagens e conteúdo no Instagram** → **Personalizar**.
2. **Configurar webhooks**: URL de callback `https://SUA_URL_NGROK/webhook`, Verify token = valor de `VERIFY_TOKEN` no `.env`.
3. **Verificar e salvar**. Assine o campo **messages** (e outros se quiser).

---

## 4. Testar no Instagram

1. Com o app e o ngrok rodando, envie uma **DM** para a conta de negócios/criador configurada no app.
2. O bot responde conforme `getReply()` em `src/server.ts`.

**Modo desenvolvimento:** quem envia a DM precisa ser **testador** do app (Funções → Testadores → Adicionar testadores).

---

## 5. Se o bot não responder

- **Nada no terminal ao enviar DM:** URL do webhook errada, ngrok parado ou webhook não configurado para Instagram.
- **`Erro ao enviar mensagem:`** Token ou permissões incorretas; confira `PAGE_ACCESS_TOKEN` e, se IGAA, `INSTAGRAM_ACCOUNT_ID`.

**Checklist:**

- [ ] Webhook em **Casos de uso → Gerenciar mensagens e conteúdo no Instagram** (não só Messenger/Página).
- [ ] Campo **messages** assinado.
- [ ] Em modo desenvolvimento, quem manda a DM é **testador** do app.
- [ ] `PAGE_ACCESS_TOKEN`: IGAA (com `INSTAGRAM_ACCOUNT_ID`) ou EAA (Page token da Página ligada ao Instagram).
- [ ] ngrok rodando e URL no Meta igual à do ngrok.

---

## Comandos úteis

| Ação | Comando |
|------|---------|
| Só o app | `npm run dev` |
| App + ngrok | `npm run tunnel` |
| Build | `npm run build` |
| Rodar build | `npm start` |
