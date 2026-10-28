# AGENTS.md — Frotec

Site institucional da Frotec e área interna de propostas/contratos em PDF.

## Stack e comandos

- Next.js 16 (App Router, standalone), npm. Node 22 (`.nvmrc`).
- `npm run dev` · `npm run lint` · `npm test` · `npm run build`

## Regras

- Diff focado; não refatore o que não foi pedido. Responda e escreva UI em português.
- Logs: padrão global Sonder Corp (arte do S uma vez por processo, `LOG_FORMAT=json|human`, `X-Request-ID`, sem dados sensíveis). Use o logger existente, não `console.log` solto.
- Login de propostas: conta única via env (`PROPOSTAS_*`), limite de 5 falhas por IP em 15 min.
- Conteúdo de propostas e contratos não vai para o log.
- Commits: mensagem curta terminando com a versão do `package.json`, ex.: `Corrige X (v1.2.3)`. Nunca commitar `.env` ou segredos.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
