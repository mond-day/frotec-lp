# Frotec — Site institucional (Fase A)

Site institucional da Frotec, operacao de gestao tecnica de frotas diesel (sistemas ARLA 32/SCR)
com rede de oficinas credenciadas, atuando no corredor da BR-163 (eixo Mato Grosso–Rondonia,
base em Sinop/MT).

Escopo desta fase: **apenas o site publico + captacao de lead**. O portal do cliente, o portal da
oficina e os modulos da plataforma sao da Fase B.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- CSS global proprio (`app/globals.css`), sem framework de CSS
- Framer Motion (animacoes de entrada) + Lenis (smooth scroll)
- Leaflet para o mapa de cobertura
- Nodemailer para enviar os leads por SMTP
- Build `standalone` para rodar em container Node

## Scripts de abertura rapida

Na pasta `scripts/` ha atalhos para subir o site localmente sem usar o terminal manualmente:

| Arquivo | Plataforma | Uso |
| --- | --- | --- |
| `abrir-site.command` | macOS | Duplo-clique (precisa de `chmod +x` uma vez) |
| `abrir-site.bat` | Windows | Duplo-clique no Explorer |
| `abrir-site.ps1` | Windows | `.\scripts\abrir-site.ps1` no PowerShell |

Todos fazem: `cd` na raiz do projeto, `npm install` se `node_modules` nao existir, `npm run dev` e abrem http://localhost:3000 no navegador.

No Windows, `.exe` nao foi gerado (exigiria compilador). O `.bat` funciona no duplo-clique; use o `.ps1` se preferir PowerShell.

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # e preencha as variaveis de SMTP
npm run dev
```

O site sobe em http://localhost:3000.

Sem as variaveis de SMTP preenchidas o site funciona normalmente, mas o envio do formulario
retorna erro 503 e o usuario ve a mensagem de indisponibilidade.

## Variaveis de ambiente

| Variavel | Obrigatoria | Descricao |
| --- | --- | --- |
| `SMTP_HOST` | sim | Servidor de saida do e-mail institucional |
| `SMTP_PORT` | nao (padrao 587) | 587 com STARTTLS ou 465 com TLS direto |
| `SMTP_SECURE` | nao | `true` forca TLS direto. Vazio = `true` so na porta 465 |
| `SMTP_USER` | sim | Caixa que autentica no servidor |
| `SMTP_PASS` | sim | Senha da caixa. Com 2FA, use senha de aplicativo |
| `LEAD_EMAIL_TO` | sim | Quem recebe os leads. Aceita varios, separados por virgula |
| `LEAD_EMAIL_FROM` | nao | Remetente. Vazio = o proprio `SMTP_USER` |

Todas sao lidas **em runtime** pela rota `/api/lead`. Isso e proposital: podem ser definidas
como variaveis do servico na stack do Swarm sem rebuildar a imagem. Uma variavel `NEXT_PUBLIC_*`
seria congelada no momento do `next build`, ficaria visivel no navegador e nao serviria para
credencial.

Provedores com 2FA (Google Workspace, Microsoft 365) recusam a senha normal de login no SMTP:
e preciso gerar uma senha de aplicativo especifica e usa-la em `SMTP_PASS`.

## Fluxo do formulario de lead

```
Navegador  --POST /api/lead-->  Route Handler  --SMTP-->  Caixa do comercial
```

O navegador nunca ve as credenciais. O route handler valida o payload de novo no servidor antes
de enviar, e o `Reply-To` da mensagem recebe o e-mail digitado pelo lead — o comercial responde
direto pelo "Responder" do cliente de e-mail.

Se o SMTP estiver fora, a rota responde 502 e grava o lead inteiro no log do container
(`[lead] Conteudo do lead perdido: {...}`), para o contato ainda ser recuperavel.

O formulario tem um campo isca escondido (`website`) que humano nao ve nem alcanca pelo Tab.
Se ele chegar preenchido, a rota responde `ok` e descarta o envio, sem gastar e-mail.

Conteudo da mensagem, montado em `lib/email.ts` a partir deste payload:

```json
{
  "nome": "Fulano de Tal",
  "empresa": "Transportadora Exemplo LTDA",
  "cnpj": "00000000000000",
  "whatsapp": "(66) 99999-0000",
  "email": "fulano@exemplo.com.br",
  "veiculos": 60,
  "rota": "br163-sinop",
  "rota_label": "BR-163 — Sinop e regiao (MT)",
  "fora_area": false,
  "mensagem": "",
  "origem": "site-frotec",
  "data_envio": "2026-08-26T19:00:00.000Z"
}
```

`fora_area` vem `true` quando o lead informa uma regiao fora do eixo BR-163 MT–RO. O envio nao e
bloqueado — o lead e registrado para expansao futura e o assunto do e-mail ganha o prefixo
`[FORA DE AREA]`, para o comercial triar sem abrir a mensagem.

### O que o site nao faz

Nao envia confirmacao automatica para o lead: so notifica o comercial. Nao grava lead em banco
nem em planilha — a caixa de e-mail e o unico destino nesta fase.

Os links `mailto:` do rodape e da secao de contato apenas abrem o cliente de e-mail do visitante
— nao passam pelo servidor nem usam o SMTP.

## Mapa de cobertura

O corredor desenhado no mapa fica em `lib/cobertura.ts` — waypoints da BR-163 (Cuiaba ->
Sinop -> Guaranta do Norte) e do ramal da BR-364 (Cuiaba -> Vilhena/RO). Para ajustar a
rota, edite so esse arquivo.

Os tiles vem do basemap **Esri Dark Gray**, que e aberto e nao exige API key. O
`dark_all` do CARTO, usado no HTML de referencia, passou a exigir chave e carimba
"API KEY REQ" sobre os tiles — por isso foi trocado. Se um dia houver conta CARTO ou
Stadia Maps, basta trocar a URL em `components/CoverageMap.tsx`.

## Estrutura

```
app/
  layout.tsx          fontes, metadata, RevealObserver
  page.tsx            ordem das secoes da landing
  globals.css         tokens de design + estilos das secoes
  api/lead/route.ts   recebe o form, valida e dispara o e-mail
components/           uma secao por arquivo
lib/
  cobertura.ts        waypoints do corredor no mapa
  cnpj.ts             mascara e validacao de CNPJ
  lead.ts             tipos, opcoes de rota e validacao compartilhada
  email.ts            config de SMTP e montagem do e-mail do lead
```

Componentes de secao sao Server Components. Sao Client Components apenas: `Header`,
`Faq`, `LeadForm`, `CoverageMap`, `RevealObserver`, `LenisProvider`, `HeroBackground` e
`MotionReveal`.

## Deploy (Portainer Swarm + Traefik)

```bash
docker build -t frotec-lp:latest .
```

`stack.yml` na raiz e um exemplo de stack para o Portainer. Ajuste o dominio nas labels do
Traefik e defina as variaveis de SMTP no ambiente do servico.

Atencao: `SMTP_PASS` fica visivel em texto para quem abre a stack no Portainer. Se isso for um
problema, o proximo passo e um Docker secret montado em arquivo, o que exige adaptar
`lerConfigSmtp` em `lib/email.ts` para ler o conteudo do arquivo apontado por `SMTP_PASS_FILE`.

## Pendencias de conteudo

Os itens abaixo estao com placeholder no site e precisam de dados reais antes de publicar:

- Telefone e e-mail de contato (`lib/contato.ts`). O e-mail institucional ainda esta sendo
  criado — quando sair, ele vale tanto para `lib/contato.ts` quanto para as variaveis
  `SMTP_USER` / `LEAD_EMAIL_TO`
- **Logo**: `public/frotec-logo.png` foi extraido do HTML de referencia e a arte escreve
  "Frotec**+**". Os textos do site usam a marca "Frotec". Ou o logo e trocado por uma versao
  sem o "+", ou a marca volta a ser "Frotec+" em `lib/contato.ts` e nos textos.
- Razao social e CNPJ da Frotec no rodape (registro em andamento, ~35-40 dias)
