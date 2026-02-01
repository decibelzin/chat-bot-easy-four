# Política de Privacidade (GitHub Pages)

Esta pasta contém a **Política de Privacidade** do app, usada como URL obrigatória no painel da Meta (Publicar app).

## Publicar no GitHub Pages

1. Suba o repositório no GitHub (incluindo a pasta `privacy/`).
2. **Settings** → **Pages** → **Build and deployment** → **Source**: **GitHub Actions** (o workflow `.github/workflows/pages.yml` publica esta pasta).
3. Após o push em `main`, a URL será:
   ```text
   https://decibelzin.github.io/chat-bot-easy-four/
   ```
4. No painel da Meta: **Configurações do app** → **URL da Política de Privacidade** → cole essa URL.

O conteúdo da política está em **index.md** (e em **index.html** para a página publicada).
