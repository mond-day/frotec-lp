# Segurança — Frotec

## Como relatar uma vulnerabilidade

Não abra issue pública. Relate em privado aos mantenedores pelo GitHub (Security → Report a vulnerability) ou pelo canal interno da Sonder Corp, com passos para reproduzir e o impacto esperado. Nunca inclua segredos ou dados pessoais reais no relato.

## Regras do repositório

- Segredos só por variável de ambiente ou secret do Swarm/Portainer. `.env`, certificados (`*.pem`, `*.p12`, `*.pfx`) e dados reais de clientes não entram no Git.
- Produção não aceita segredo ausente nem valor de exemplo.
- Logs no padrão Sonder Corp: sem senhas, tokens, cookies, query string, corpo de requisição ou dados pessoais.
- Dependências: acompanhar advisories (Next.js, React, sharp) e manter o lockfile atualizado.
