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

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
