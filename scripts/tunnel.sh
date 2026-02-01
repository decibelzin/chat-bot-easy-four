#!/usr/bin/env bash
# Sobe o app e o ngrok juntos. Uso: ./scripts/tunnel.sh
# Na VPS: só configurar o .env e rodar este script.

set -e
cd "$(dirname "$0")/.."

# Carrega .env (PORT, etc.)
if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

PORT="${PORT:-3000}"

echo ">>> Build..."
npm run build

echo ">>> Iniciando app na porta $PORT (background)..."
node dist/server.js &
NODE_PID=$!

cleanup() {
  echo ">>> Encerrando app (PID $NODE_PID)..."
  kill $NODE_PID 2>/dev/null || true
  exit 0
}
trap cleanup SIGINT SIGTERM

sleep 1
echo ">>> Iniciando ngrok (Ctrl+C para parar)..."
echo ">>> URL do webhook: https://SEU-SUBDOMINIO.ngrok-free.app/webhook"
ngrok http "$PORT"

cleanup
