import { readFileSync } from "node:fs";
import { join } from "node:path";
import { EXTENSAO_APROXIMADA } from "./cobertura";
import { formatarDataBr, formatarMoeda, type DadosProposta } from "./proposta";

function escapar(valor: string): string {
  return valor
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pngDataUri(caminho: string): string {
  try {
    const bytes = readFileSync(caminho);
    return `data:image/png;base64,${bytes.toString("base64")}`;
  } catch {
    return "";
  }
}

function simNao(v: boolean): string {
  return v ? "Sim" : "Não";
}

function textoOuTraco(valor: string): string {
  const t = valor.trim();
  return t ? escapar(t).replace(/\n/g, "<br>") : "—";
}

function status(on: boolean, sim = "Incluído", nao = "Não incluso"): string {
  return `<span class="flag ${on ? "is-on" : "is-off"}">${on ? sim : nao}</span>`;
}

function cssProposta(): string {
  return `
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      background: #050608;
      color: #edf3f1;
      font-family: Manrope, "Segoe UI", Arial, sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .sheet {
      width: 210mm;
      height: 297mm;
      overflow: hidden;
      position: relative;
      page-break-after: always;
      break-after: page;
      background:
        radial-gradient(90% 42% at 100% 0%, rgba(16,225,177,.14), transparent 52%),
        radial-gradient(70% 36% at 0% 100%, rgba(45,140,255,.1), transparent 48%),
        #050608;
      color: #edf3f1;
    }
    .sheet:last-child { page-break-after: auto; break-after: auto; }
    .sheet::before {
      content: "";
      position: absolute;
      left: 0; top: 0; bottom: 0;
      width: 5px;
      background: #10e1b1;
    }
    .pad { padding: 16mm 18mm 20mm 20mm; height: 100%; display: flex; flex-direction: column; }
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(237,243,241,.12);
      padding-bottom: 10px;
      margin-bottom: 16px;
    }
    .top img.word { height: 22px; width: auto; }
    .kicker {
      font-family: "IBM Plex Mono", Consolas, monospace;
      font-size: 9px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: #10e1b1;
    }
    .muted { color: rgba(237,243,241,.58); }
    .dim { color: rgba(237,243,241,.38); }
    h1, h2, h3 {
      font-family: "Barlow Condensed", "Arial Narrow", Impact, sans-serif;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin: 0;
      text-transform: uppercase;
    }
    h2 { font-size: 28px; line-height: 0.95; margin-bottom: 8px; }
    h3 { font-size: 13px; letter-spacing: 0.14em; color: #10e1b1; margin-bottom: 10px; }
    p { margin: 0 0 10px; font-size: 11.5px; line-height: 1.5; color: rgba(237,243,241,.72); }
    .lead { font-size: 13px; line-height: 1.45; max-width: 150mm; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 16px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
    .card {
      background: rgba(255,255,255,.035);
      border: 1px solid rgba(237,243,241,.1);
      border-radius: 10px;
      padding: 12px 14px;
    }
    .card strong { display: block; font-size: 14px; color: #edf3f1; margin-top: 3px; }
    .label {
      font-family: "IBM Plex Mono", Consolas, monospace;
      font-size: 8px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: rgba(237,243,241,.42);
    }
    .stat {
      background: #0b0e14;
      border: 1px solid rgba(16,225,177,.28);
      border-radius: 12px;
      padding: 16px 18px;
    }
    .stat .num {
      font-family: "Barlow Condensed", "Arial Narrow", Impact, sans-serif;
      font-size: 54px;
      line-height: 0.9;
      color: #10e1b1;
    }
    .foot {
      margin-top: auto;
      padding-top: 12px;
      border-top: 1px solid rgba(237,243,241,.1);
      display: flex;
      justify-content: space-between;
      font-family: "IBM Plex Mono", Consolas, monospace;
      font-size: 8px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: rgba(237,243,241,.38);
    }
    .flag {
      display: inline-block;
      font-family: "IBM Plex Mono", Consolas, monospace;
      font-size: 8px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      padding: 4px 8px;
      border-radius: 999px;
      border: 1px solid rgba(237,243,241,.16);
    }
    .flag.is-on { color: #08211b; background: #10e1b1; border-color: #10e1b1; }
    .flag.is-off { color: rgba(237,243,241,.5); }
    .corridor {
      display: flex;
      align-items: center;
      gap: 0;
      margin-top: 8px;
    }
    .corridor .dot {
      width: 10px; height: 10px; border-radius: 50%;
      background: #10e1b1; flex: none;
    }
    .corridor .line { flex: 1; height: 1px; background: rgba(16,225,177,.45); }
    .corridor-labels {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
      font-size: 10px;
    }
    .corridor-labels span { color: rgba(237,243,241,.7); }
    .method {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 8px;
      margin: 12px 0 18px;
    }
    .method .card { min-height: 92px; }
    .n {
      font-family: "IBM Plex Mono", Consolas, monospace;
      font-size: 9px;
      color: #10e1b1;
      letter-spacing: 0.12em;
    }
    .method h4 {
      font-family: "Barlow Condensed", "Arial Narrow", Impact, sans-serif;
      font-size: 16px;
      text-transform: uppercase;
      margin: 6px 0 4px;
    }
    .method p { font-size: 10px; margin: 0; }
    .steps { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .price {
      font-family: "Barlow Condensed", "Arial Narrow", Impact, sans-serif;
      font-size: 56px;
      line-height: 0.9;
      color: #edf3f1;
    }
    .list { list-style: none; padding: 0; margin: 0; }
    .list li {
      font-size: 11.5px;
      padding: 7px 0;
      border-bottom: 1px solid rgba(237,243,241,.08);
      color: rgba(237,243,241,.78);
    }
    .list.no li::before { content: "—  "; color: #ff6b6b; }
    .list.yes li::before { content: "+  "; color: #10e1b1; }
    .cover { padding: 22mm 20mm 18mm 22mm; }
    .cover-mark { width: 72px; height: 72px; margin-bottom: 28px; }
    .cover h1 { font-size: 58px; line-height: 0.88; max-width: 160mm; }
    .cover .empresa {
      font-family: "Barlow Condensed", "Arial Narrow", Impact, sans-serif;
      font-size: 28px;
      letter-spacing: -0.02em;
      text-transform: uppercase;
      margin: 22px 0 6px;
      color: #10e1b1;
    }
    .chips { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 22px; }
    .chip {
      border: 1px solid rgba(237,243,241,.14);
      padding: 8px 12px;
      border-radius: 999px;
      font-size: 10px;
    }
    .chip b { color: #edf3f1; }
    .quote {
      border-left: 3px solid #10e1b1;
      padding: 4px 0 4px 14px;
      font-size: 12px;
      line-height: 1.55;
      color: rgba(237,243,241,.82);
    }
    .note {
      font-size: 10px;
      line-height: 1.5;
      color: rgba(237,243,241,.5);
      margin-top: 14px;
    }
    .push { margin-top: auto; }
    .chain {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-top: 14px;
    }
    .chain span {
      font-family: "IBM Plex Mono", Consolas, monospace;
      font-size: 9px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 7px 10px;
      border: 1px solid rgba(237,243,241,.12);
      border-radius: 999px;
      color: rgba(237,243,241,.7);
    }
    .sign {
      min-height: 78px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }
    .sign .line {
      border-top: 1px solid rgba(237,243,241,.22);
      padding-top: 8px;
      font-size: 11px;
      color: rgba(237,243,241,.7);
    }
  `;
}

function cabecalho(logo: string, kicker: string): string {
  return `<div class="top">
    <div>
      <div class="kicker">${kicker}</div>
    </div>
    ${logo ? `<img class="word" src="${logo}" alt="Frotec" />` : `<strong>Frotec</strong>`}
  </div>`;
}

function rodape(n: number, total: number, empresa: string): string {
  return `<div class="foot">
    <span>Frotec · Sinop/MT · ${escapar(empresa)}</span>
    <span>${String(n).padStart(2, "0")} / ${String(total).padStart(2, "0")}</span>
  </div>`;
}

export function montarHtmlProposta(dados: DadosProposta): string {
  const logo = pngDataUri(join(process.cwd(), "public", "frotec-logo.png"));
  const marca = pngDataUri(join(process.cwd(), "app", "icon.png"));
  const emitido = formatarDataBr(new Date());
  const qtd = Number(dados.quantidade);
  const frotaLabel = qtd === 1 ? "veículo" : "veículos";
  const total = 5;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<title>Proposta Frotec — ${escapar(dados.empresa)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=IBM+Plex+Mono:wght@400;500&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />
<style>${cssProposta()}</style>
</head>
<body>

<section class="sheet">
  <div class="pad cover">
    <div class="kicker">Confidencial · documento comercial</div>
    ${marca ? `<img class="cover-mark" src="${marca}" alt="" />` : ""}
    <h1>Proposta<br>comercial</h1>
    <p class="lead" style="margin-top:16px">
      Gestão técnica de frotas diesel. Avaliação, preventiva organizada e auditoria de
      orçamento — para manutenção deixar de ser emergência e voltar a ser decisão.
    </p>
    <div class="empresa">${escapar(dados.empresa)}</div>
    <p>${escapar(dados.responsavel)} · ${escapar(dados.cargo)}</p>
    <div class="chips">
      <div class="chip"><span class="label">Frota</span><br><b>${escapar(dados.quantidade)} ${frotaLabel}</b></div>
      <div class="chip"><span class="label">Vigência</span><br><b>${escapar(formatarDataBr(dados.vigencia))}</b></div>
      <div class="chip"><span class="label">Mensalidade</span><br><b>${escapar(formatarMoeda(dados.valorMensal))}</b></div>
      <div class="chip"><span class="label">Corredor</span><br><b>BR-163 · ${escapar(EXTENSAO_APROXIMADA)}</b></div>
    </div>
    <div class="push grid-3" style="margin-bottom:12px">
      <div class="card"><div class="n">01</div><strong>Avaliar</strong><p>Checklist estruturado e classificação de risco da frota.</p></div>
      <div class="card"><div class="n">02</div><strong>Prevenir</strong><p>Calendário técnico alinhado à operação, não à urgência.</p></div>
      <div class="card"><div class="n">03</div><strong>Auditar</strong><p>Diagnóstico e orçamento passam pela central antes da execução.</p></div>
    </div>
    ${rodape(1, total, dados.empresa)}
  </div>
</section>

<section class="sheet">
  <div class="pad">
    ${cabecalho(logo, "01 — Cliente e operação")}
    <h2>Quem opera.<br>Onde roda.</h2>
    <p class="lead">Esta proposta descreve o plano da frota como um todo — não um contrato veículo a veículo.</p>
    <div class="grid-2" style="margin:16px 0 14px">
      <div class="card"><div class="label">Empresa</div><strong>${escapar(dados.empresa)}</strong></div>
      <div class="card"><div class="label">Responsável</div><strong>${escapar(dados.responsavel)}</strong></div>
      <div class="card"><div class="label">Cargo</div><strong>${escapar(dados.cargo)}</strong></div>
      <div class="card"><div class="label">WhatsApp</div><strong>${escapar(dados.whatsapp)}</strong></div>
      <div class="card"><div class="label">E-mail</div><strong>${escapar(dados.email)}</strong></div>
      <div class="card"><div class="label">Categoria / faixa</div><strong>${textoOuTraco(dados.faixa)}</strong></div>
    </div>
    <div class="card" style="margin-bottom:14px">
      <div class="label">Região e rotas de operação</div>
      <p style="margin:6px 0 0;color:#edf3f1">${textoOuTraco(dados.rotas)}</p>
    </div>
    <div class="stat">
      <div class="label">Tamanho da frota nesta proposta</div>
      <div class="num">${escapar(dados.quantidade)}</div>
      <p style="margin:4px 0 0">${frotaLabel} no plano · perfil técnico ${dados.faixa.trim() ? escapar(dados.faixa) : "a combinar na vistoria"}</p>
    </div>
    <div class="card" style="margin-top:14px">
      <div class="label">Corredor de atuação · BR-163 e ramal BR-364</div>
      <div class="corridor" aria-hidden="true">
        <span class="dot"></span><span class="line"></span>
        <span class="dot"></span><span class="line"></span>
        <span class="dot"></span><span class="line"></span>
        <span class="dot"></span>
      </div>
      <div class="corridor-labels">
        <span>Rondonópolis</span><span>Cuiabá</span><span>Sinop</span><span>Miritituba</span>
      </div>
      <p style="margin:10px 0 0">Base em Sinop/MT. Ramal BR-364 até Vilhena/RO. Extensão aproximada ${escapar(EXTENSAO_APROXIMADA)}.</p>
    </div>
    ${rodape(2, total, dados.empresa)}
  </div>
</section>

<section class="sheet">
  <div class="pad">
    ${cabecalho(logo, "02 — Entrada e escopo")}
    <h2>Vistoria, assistência<br>e o que entra no plano.</h2>
    <div class="grid-2" style="margin:16px 0">
      <div class="stat">
        <div class="label">Vistoria de entrada · por veículo</div>
        <div class="num" style="font-size:42px">${escapar(formatarMoeda(dados.valorVistoria))}</div>
        <p style="margin:8px 0 0">Pagamento antecipado como condição de ativação: <b style="color:#edf3f1">${simNao(dados.aceiteVistoria)}</b></p>
      </div>
      <div class="card">
        <div class="label">Irregularidades / checklist</div>
        <p style="margin-top:8px;color:#edf3f1">${textoOuTraco(dados.irregularidades)}</p>
        <p class="note">Se a vistoria identificar irregularidade técnica, a ativação fica condicionada ao acerto — orçado à parte.</p>
      </div>
    </div>
    <h3>Escopo combinado</h3>
    <div class="grid-2" style="margin-bottom:14px">
      <div class="card">
        <div class="label">SCR / Arla 32</div>
        <strong>${status(dados.cobreScr)}</strong>
        <p style="margin-top:8px">Peças críticas do sistema catalisador no escopo desta proposta.</p>
      </div>
      <div class="card">
        <div class="label">Motor / anexos técnicos</div>
        <strong>${textoOuTraco(dados.tipoMotor)}</strong>
      </div>
    </div>
    <div class="card" style="margin-bottom:14px">
      <div class="label">Fluxo de assistência</div>
      <div class="quote" style="margin-top:10px">${textoOuTraco(dados.fluxoSocorro)}</div>
    </div>
    <h3>Opcionais</h3>
    <div class="grid-2">
      <div class="card">
        <div class="label">Alarme de módulo</div>
        <strong>${status(dados.alarmeModulo)}</strong>
      </div>
      <div class="card">
        <div class="label">Parafusos de segredo</div>
        <strong>${status(dados.parafusosSegredo)}</strong>
      </div>
    </div>
    <h3 style="margin-top:16px">Ativação desta proposta</h3>
    <div class="grid-3">
      <div class="card"><div class="n">01</div><strong>Vistoria antecipada</strong><p>Pagamento da vistoria como condição de ativação do plano.</p></div>
      <div class="card"><div class="n">02</div><strong>Laudo e regularização</strong><p>Irregularidade técnica trava a ativação até o acerto, orçado à parte.</p></div>
      <div class="card"><div class="n">03</div><strong>Rotina na central</strong><p>Preventiva, OS e oficina credenciada passam a ser acompanhadas com método.</p></div>
    </div>
    ${rodape(3, total, dados.empresa)}
  </div>
</section>

<section class="sheet">
  <div class="pad">
    ${cabecalho(logo, "03 — Método Frotec")}
    <h2>Troque manutenção reativa<br>por rotina previsível.</h2>
    <p class="lead">Cinco perguntas que a operação passa a responder com método — não com improviso.</p>
    <div class="method">
      <div class="card"><div class="n">01</div><h4>Diagnosticar</h4><p>O que precisa de atenção agora?</p></div>
      <div class="card"><div class="n">02</div><h4>Priorizar</h4><p>O que pode esperar e o que não pode?</p></div>
      <div class="card"><div class="n">03</div><h4>Prevenir</h4><p>Quando intervir antes de parar?</p></div>
      <div class="card"><div class="n">04</div><h4>Auditar</h4><p>O serviço e o orçamento fazem sentido?</p></div>
      <div class="card"><div class="n">05</div><h4>Acompanhar</h4><p>O que aconteceu na frota?</p></div>
    </div>
    <h3>Como o plano entra na operação</h3>
    <div class="steps">
      <div class="card"><div class="n">01</div><strong>Entendemos a operação</strong><p>Base, perfil de rota, tamanho da frota e categorias — para desenhar o acompanhamento certo.</p></div>
      <div class="card"><div class="n">02</div><strong>Avaliamos a frota</strong><p>Checklist estruturado, evidências e classificação de risco para saber o que precisa de atenção primeiro.</p></div>
      <div class="card"><div class="n">03</div><strong>Montamos a rotina</strong><p>Preventiva programada, aprovações e calendário alinhados à operação — não ao improviso da urgência.</p></div>
      <div class="card"><div class="n">04</div><strong>Acompanhamos os serviços</strong><p>OS, itens, status e auditoria — para decidir com mais informação antes de aprovar a oficina.</p></div>
    </div>
    <div class="card" style="margin-top:16px">
      <div class="label">Por que a rotina existe</div>
      <p style="margin:8px 0 0;color:#edf3f1">Um problema técnico raramente termina na oficina. Sem preventiva, a falha vira caminhão parado, carga atrasada e margem reduzida.</p>
      <div class="chain">
        <span>Falha</span><span>Caminhão parado</span><span>Carga atrasada</span><span>Custo extra</span><span>Cliente pressionando</span><span>Margem reduzida</span>
      </div>
    </div>
    ${rodape(4, total, dados.empresa)}
  </div>
</section>

<section class="sheet">
  <div class="pad">
    ${cabecalho(logo, "04 — Condições e limites")}
    <h2>Investimento<br>e o que isto não é.</h2>
    <div class="stat" style="margin:14px 0 16px">
      <div class="label">Valor mensal desta proposta</div>
      <div class="price">${escapar(formatarMoeda(dados.valorMensal))}</div>
      <div class="grid-2" style="margin-top:12px">
        <div><div class="label">Início de vigência</div><strong>${escapar(formatarDataBr(dados.vigencia))}</strong></div>
        <div><div class="label">Calendário de preventivas</div><strong>${status(dados.aceitePreventiva, "Aceito", "Pendente")}</strong></div>
      </div>
    </div>
    <div class="grid-2">
      <div>
        <h3>O que a Frotec faz</h3>
        <ul class="list yes">
          <li>Avaliação técnica da frota</li>
          <li>Classificação de risco</li>
          <li>Organização da preventiva</li>
          <li>Auditoria técnica de OS</li>
          <li>Acesso à rede conforme cobertura</li>
          <li>Acompanhamento previsto em contrato</li>
        </ul>
      </div>
      <div>
        <h3>O que isto não é</h3>
        <ul class="list no">
          <li>Seguro</li>
          <li>Garantia mecânica</li>
          <li>Substituto da responsabilidade do proprietário</li>
          <li>Promessa de zero falhas</li>
          <li>Cobertura ilimitada de qualquer serviço</li>
        </ul>
      </div>
    </div>
    <p class="note">
      A Frotec presta serviços de gestão técnica e consultoria em manutenção de frotas.
      Esta proposta não é seguro, não é garantia estendida e não constitui operação securitária.
      Escopo, limites e exclusões de cada plano são definidos em contrato.
      Cada ordem de serviço passa por aprovação técnica da central antes da execução.
      Documento gerado em ${escapar(emitido)}.
    </p>
    <h3 style="margin-top:16px">Próximos passos</h3>
    <div class="grid-3" style="margin-bottom:14px">
      <div class="card"><div class="n">01</div><strong>Confirmar esta proposta</strong><p>Validar valores, vigência e escopo combinado com o responsável.</p></div>
      <div class="card"><div class="n">02</div><strong>Agendar a vistoria</strong><p>Entrada técnica da frota, com laudo e classificação de risco.</p></div>
      <div class="card"><div class="n">03</div><strong>Contrato e rotina</strong><p>Ativação após vistoria e início do calendário de preventivas.</p></div>
    </div>
    <div class="grid-2">
      <div class="card sign"><div class="line">Aceite do cliente · ${escapar(dados.responsavel)}</div></div>
      <div class="card sign"><div class="line">Frotec · Sinop/MT</div></div>
    </div>
    ${rodape(5, total, dados.empresa)}
  </div>
</section>

</body>
</html>`;
}
