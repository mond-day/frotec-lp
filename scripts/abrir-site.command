#!/bin/bash
# Abre o site Frotec+ em desenvolvimento local (macOS).
# Duplo-clique ou: ./scripts/abrir-site.command

set -e
cd "$(dirname "$0")/.."

if [ ! -d "node_modules" ]; then
  echo "Instalando dependências..."
  npm install
fi

echo "Iniciando servidor em http://localhost:3000 ..."
npm run dev &
DEV_PID=$!

trap 'kill $DEV_PID 2>/dev/null' EXIT INT TERM

for i in $(seq 1 30); do
  if curl -sf http://localhost:3000 >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

open "http://localhost:3000"
wait $DEV_PID
