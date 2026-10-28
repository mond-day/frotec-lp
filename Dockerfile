# Imagem do site institucional da Frotec.
# Usa a saida "standalone" do Next (definida em next.config.ts), que ja embute
# so as dependencias necessarias para rodar em producao.
#
# Build:  docker build -t ghcr.io/mond-day/frotec-lp:latest .
# Run:    docker run -p 3000:3000 --env-file .env.local ghcr.io/mond-day/frotec-lp:latest
# Em producao o CI publica essa imagem no GHCR a cada push na main.
#
# O build precisa de rede: o next/font baixa as fontes do Google e as embute
# como assets estaticos da propria imagem.
#
# Runner e node:22-slim (Debian/glibc), nao Alpine. @sparticuz/chromium e
# binario glibc; nesta maquina nao havia Docker para o teste isolado em musl,
# entao o runner segue a alternativa do plano (Debian) para o PDF nao falhar
# com ELF invalido. deps/builder permanecem Alpine.

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ca-certificates \
    fonts-liberation \
    libnss3 \
    libatk-bridge2.0-0 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
  && rm -rf /var/lib/apt/lists/*

RUN groupadd -g 1001 nodejs && useradd -u 1001 -g nodejs -m nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

COPY --from=builder --chown=nextjs:nodejs /app/scripts/boot-log.cjs /app/scripts/next-console-preload.cjs ./scripts/
# Linhas de abertura do Next já no padrão Sonder Corp (LOG_FORMAT=json|human)
CMD ["node", "-r", "./scripts/next-console-preload.cjs", "server.js"]
