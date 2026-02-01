#!/usr/bin/env bash
# Só sobe o app (para rodar ngrok em outro terminal ou com PM2).
# Uso: ./scripts/start.sh

set -e
cd "$(dirname "$0")/.."

npm run build
echo ">>> App em http://localhost:${PORT:-3000}"
exec node dist/server.js
