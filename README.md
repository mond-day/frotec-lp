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
- Gerador de propostas em `/propostas` (login unico + PDF via Puppeteer)
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
| `PROPOSTAS_USER` | sim (para `/propostas`) | Usuario unico da area logada |
| `PROPOSTAS_PASSWORD` | sim | Senha da area logada |
| `PROPOSTAS_SESSION_SECRET` | sim | Chave HMAC do cookie de sessao |

Todas sao lidas **em runtime** pela rota `/api/lead` e pela area `/propostas`. Isso e proposital: podem ser definidas
como variaveis do servico na stack do Swarm sem rebuildar a imagem. Uma variavel `NEXT_PUBLIC_*`
seria congelada no momento do `next build`, ficaria visivel no navegador e nao serviria para
credencial.

Provedores com 2FA (Google Workspace, Microsoft 365) recusam a senha normal de login no SMTP:
e preciso gerar uma senha de aplicativo especifica e usa-la em `SMTP_PASS`.

## Gerador de propostas

URL interna (sem link no site publico): `/propostas`. Login unico via `PROPOSTAS_USER` /
`PROPOSTAS_PASSWORD`. O PDF e gerado na hora (`puppeteer-core` + `@sparticuz/chromium`) e
nao e gravado.

No Windows local, o gerador usa o Microsoft Edge se existir; no container de producao usa o
Chromium empacotado. O stage **runner** da imagem e `node:22-slim` (Debian/glibc): o binario
do `@sparticuz/chromium` nao e musl, e nesta maquina nao havia Docker para validar Alpine.

Sem as tres variaveis `PROPOSTAS_*` o login responde 503.

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
  propostas/          gerador de PDF (area logada)
  api/propostas/      login, logout e gerar-pdf
components/           uma secao por arquivo
lib/
  cobertura.ts        waypoints do corredor no mapa
  cnpj.ts             mascara e validacao de CNPJ
  lead.ts             tipos, opcoes de rota e validacao compartilhada
  email.ts            config de SMTP e montagem do e-mail do lead
  auth.ts             cookie HMAC da area /propostas
  proposta.ts         validacao do formulario de proposta
```

Componentes de secao sao Server Components. Sao Client Components apenas: `Header`,
`Faq`, `LeadForm`, `CoverageMap`, `RevealObserver`, `LenisProvider`, `HeroBackground` e
`MotionReveal`.

## Deploy (Portainer Swarm + Traefik)

Pacote de producao ja neste repositorio — nao precisa de arquivo extra:

| Arquivo | Papel |
| --- | --- |
| `Dockerfile` | Imagem Node 22 Alpine com saida `standalone` do Next |
| `stack.yml` | Stack Swarm (`ghcr.io/mond-day/frotec-lp:latest`, 2 replicas) + labels Traefik |
| `.env.example` | Variaveis SMTP (lidas em runtime, sem rebuild) |
| `.github/workflows/ci.yml` | Lint, tipos, build e publicacao da imagem no GHCR |
| `scripts/build-image.ps1` | Atalho Windows para um `docker build` local (opcional) |

Fluxo: **push na `main`** → GitHub Actions valida o site, constroi a imagem e publica em
`ghcr.io/mond-day/frotec-lp` (`:latest` e `:<sha do commit>`) → o Portainer faz **pull**
dessa imagem. Nao e preciso construir nem fazer push na maquina local.

O repositorio e **privado**, entao o pacote no GitHub Container Registry tambem e privado.
Sem um registry cadastrado no Portainer (PAT com `read:packages`), os nos do swarm nao
conseguem puxar a imagem. A rede overlay `traefik-public` com o Traefik ja precisa existir
— este repo nao cria o Traefik. O dominio nas labels e `www.frotec.com.br`.

`latest` e mutavel: cada push na `main` a substitui. Para pin, use a tag SHA no `stack.yml`
(`ghcr.io/mond-day/frotec-lp:<sha>`).

### 1. Publicar a imagem (automatico)

Merge ou push na `main`. O job `imagem` do workflow faz login no GHCR com `GITHUB_TOKEN`
e publica. Acompanhe em Actions. Pull requests so constroem a imagem, sem push.

Build local (opcional, para testar o Dockerfile):

```bash
docker build -t ghcr.io/mond-day/frotec-lp:latest .
```

No Windows PowerShell:

```powershell
.\scripts\build-image.ps1 -Tag ghcr.io/mond-day/frotec-lp:latest
```

### 2. Cadastrar o GHCR no Portainer

O repositorio `mond-day/frotec-lp` e privado: o Portainer precisa de um **Docker Registry**
do tipo GitHub para autenticar o pull.

1. Portainer > **Registries** > **Add registry**
2. Tipo: **GitHub** (ou Custom / Docker Registry, se a versao nao tiver o preset)
3. **Registry URL:** `ghcr.io`
4. **Username:** seu usuario GitHub (nao o nome da organizacao)
5. **Password:** um Personal Access Token (classic) com:
   - `read:packages` — obrigatorio para puxar a imagem
   - `repo` — necessario em token classico quando o pacote esta ligado a este
     repositorio privado
6. Salve. A stack precisa usar esse registry no deploy (na maioria das versoes do
   Portainer isso e automatico quando a URL da imagem e `ghcr.io/...`).

O token nao vai para o `stack.yml` nem para este README. Gere em GitHub >
Settings > Developer settings > Personal access tokens. Se a org `mond-day` tiver SSO,
autorize o PAT para a organizacao.

Quem nao usa Portainer para o pull: `echo SEU_PAT | docker login ghcr.io -u USUARIO --password-stdin`
em cada no do swarm.

### 3. Colar a stack no Portainer

1. Portainer > **Stacks** > **Add stack**
2. Nome sugerido: `frotec-lp`
3. Cole o conteudo de `stack.yml` (Web editor) — ou aponte o Git deste repo se o Portainer
   ja clona o projeto
4. Confirme que `image:` aponta para `ghcr.io/mond-day/frotec-lp:latest` (ja vem assim)
5. Confira o dominio `www.frotec.com.br` nas labels do Traefik
6. Em **Environment variables** da stack, preencha SMTP e `PROPOSTAS_*` (passo 4)
7. Deploy. Depois de cada push na `main`, faca **Update the stack** (Pull and
   redeploy) para os nos puxarem o novo `latest`.

A rede `traefik-public` precisa existir (overlay/attachable, conforme o Traefik da casa).
Se o deploy falhar com "network traefik-public not found", a stack do Traefik ainda nao
esta no swarm — isso nao se resolve neste repositorio.

### 4. Preencher SMTP e propostas no Portainer

Copie os nomes de `.env.example`. Nao coloque senha no `stack.yml` versionado.

Os `${SMTP_HOST}` etc. do YAML sao interpolados com as Environment variables da stack
no momento do deploy.

| Variavel | Obrigatoria | Descricao |
| --- | --- | --- |
| `SMTP_HOST` | sim | Servidor de saida do e-mail institucional |
| `SMTP_PORT` | nao (padrao 587) | 587 com STARTTLS ou 465 com TLS direto |
| `SMTP_SECURE` | nao | `true` forca TLS direto. Vazio = `true` so na porta 465 |
| `SMTP_USER` | sim | Caixa que autentica no servidor |
| `SMTP_PASS` | sim | Senha da caixa. Com 2FA, use senha de aplicativo |
| `LEAD_EMAIL_TO` | sim | Quem recebe os leads. Aceita varios, separados por virgula |
| `LEAD_EMAIL_FROM` | nao | Remetente. Vazio = o proprio `SMTP_USER` |
| `PROPOSTAS_USER` | sim (para `/propostas`) | Usuario unico da area logada |
| `PROPOSTAS_PASSWORD` | sim | Senha da area logada |
| `PROPOSTAS_SESSION_SECRET` | sim | Chave HMAC do cookie de sessao |

Trocar SMTP ou o login de propostas depois do go-live: edite as variaveis no Portainer e faca **Update the stack**.
Nao precisa rebuildar a imagem.

Atencao: `SMTP_PASS`, `PROPOSTAS_PASSWORD` e `PROPOSTAS_SESSION_SECRET` ficam visiveis em texto
para quem abre a stack no Portainer. Sem Docker secret nesta fase.

A area `/propostas` nao tem link no site publico. Sem as tres variaveis, o login responde 503.

### 5. Conferir depois do deploy

- O Traefik deve emitir certificado Let's Encrypt para `www.frotec.com.br`
- Abra o site e envie um lead de teste
- Sem SMTP preenchido o site abre, mas o formulario responde 503
- Se o SMTP estiver errado, a rota responde 502 e o lead vai para o log do container
  (`[lead] Conteudo do lead perdido: {...}`)

## Pendencias de conteudo

Os itens abaixo estao com placeholder no site e precisam de dados reais antes de publicar:

- Telefone e e-mail de contato (`lib/contato.ts`). O e-mail institucional ainda esta sendo
  criado — quando sair, ele vale tanto para `lib/contato.ts` quanto para as variaveis
  `SMTP_USER` / `LEAD_EMAIL_TO`
- **Logo**: `public/frotec-logo.png` foi extraido do HTML de referencia e a arte escreve
  "Frotec**+**". Os textos do site usam a marca "Frotec". Ou o logo e trocado por uma versao
  sem o "+", ou a marca volta a ser "Frotec+" em `lib/contato.ts` e nos textos.
- Razao social e CNPJ da Frotec no rodape (registro em andamento, ~35-40 dias)
