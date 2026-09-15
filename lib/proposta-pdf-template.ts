import { readFileSync } from "node:fs";
import { join } from "node:path";
import { EXTENSAO_APROXIMADA } from "./cobertura";
import {
  dataBrValida,
  formatarDataBr,
  formatarMoeda,
  totalMensalFrota,
  type DadosProposta,
} from "./proposta";

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

function textoOuTraco(valor: string): string {
  const t = valor.trim();
  return t ? escapar(t).replace(/\n/g, "<br>") : "—";
}

function itens(lista: string[], classe = "yes"): string {
  return `<ul class="list ${classe}">${lista.map((item) => `<li>${item}</li>`).join("")}</ul>`;
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
    .pad { padding: 14mm 16mm 16mm 18mm; height: 100%; display: flex; flex-direction: column; }
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(237,243,241,.12);
      padding-bottom: 8px;
      margin-bottom: 12px;
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
    h1, h2, h3 {
      font-family: "Barlow Condensed", "Arial Narrow", Impact, sans-serif;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin: 0;
      text-transform: uppercase;
    }
    h2 { font-size: 26px; line-height: 0.95; margin-bottom: 8px; }
    h3 { font-size: 12px; letter-spacing: 0.14em; color: #10e1b1; margin: 10px 0 8px; }
    p { margin: 0 0 8px; font-size: 11px; line-height: 1.45; color: rgba(237,243,241,.72); }
    .lead { font-size: 12.5px; line-height: 1.45; max-width: 160mm; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 12px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
    .card {
      background: rgba(255,255,255,.035);
      border: 1px solid rgba(237,243,241,.1);
      border-radius: 10px;
      padding: 10px 12px;
    }
    .card strong { display: block; font-size: 13px; color: #edf3f1; margin-top: 2px; }
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
      padding: 12px 14px;
    }
    .stat .num {
      font-family: "Barlow Condensed", "Arial Narrow", Impact, sans-serif;
      font-size: 42px;
      line-height: 0.9;
      color: #10e1b1;
    }
    .foot {
      margin-top: auto;
      padding-top: 10px;
      border-top: 1px solid rgba(237,243,241,.1);
      display: flex;
      justify-content: space-between;
      font-family: "IBM Plex Mono", Consolas, monospace;
      font-size: 8px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: rgba(237,243,241,.38);
    }
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
    .n {
      font-family: "IBM Plex Mono", Consolas, monospace;
      font-size: 9px;
      color: #10e1b1;
      letter-spacing: 0.12em;
    }
    .price {
      font-family: "Barlow Condensed", "Arial Narrow", Impact, sans-serif;
      font-size: 44px;
      line-height: 0.9;
      color: #edf3f1;
    }
    .list { list-style: none; padding: 0; margin: 0; }
    .list li {
      font-size: 10.5px;
      padding: 5px 0;
      border-bottom: 1px solid rgba(237,243,241,.08);
      color: rgba(237,243,241,.78);
      line-height: 1.4;
    }
    .list.tight li { padding: 3px 0; font-size: 10.5px; }
    .list.two {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0 16px;
    }
    .list.no li::before { content: "—  "; color: #ff6b6b; }
    .list.yes li::before { content: "+  "; color: #10e1b1; }
    .cover { padding: 20mm 18mm 16mm 20mm; }
    .cover-mark { width: 72px; height: 72px; margin-bottom: 24px; }
    .cover h1 { font-size: 54px; line-height: 0.88; max-width: 170mm; }
    .cover .empresa {
      font-family: "Barlow Condensed", "Arial Narrow", Impact, sans-serif;
      font-size: 28px;
      letter-spacing: -0.02em;
      text-transform: uppercase;
      margin: 18px 0 6px;
      color: #10e1b1;
    }
    .chips { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 18px; }
    .chip {
      border: 1px solid rgba(237,243,241,.14);
      padding: 8px 12px;
      border-radius: 999px;
      font-size: 10px;
    }
    .chip b { color: #edf3f1; }
    .note {
      font-size: 10px;
      line-height: 1.45;
      color: rgba(237,243,241,.5);
      margin-top: 10px;
    }
    .push { margin-top: auto; }
    .sign {
      min-height: 72px;
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
    table.tbl {
      width: 100%;
      border-collapse: collapse;
      font-size: 10.5px;
      margin: 6px 0 10px;
    }
    table.tbl th {
      font-family: "IBM Plex Mono", Consolas, monospace;
      font-size: 8px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      text-align: left;
      color: #10e1b1;
      border-bottom: 1px solid rgba(16,225,177,.32);
      padding: 6px 8px;
    }
    table.tbl td {
      padding: 6px 8px;
      border-bottom: 1px solid rgba(237,243,241,.08);
      color: rgba(237,243,241,.78);
      vertical-align: top;
      line-height: 1.4;
    }
    table.tbl td:first-child { color: #edf3f1; font-weight: 600; width: 34%; }
    .chips-sys { display: flex; flex-wrap: wrap; gap: 6px; margin: 8px 0 0; }
    .chips-sys span {
      font-family: "IBM Plex Mono", Consolas, monospace;
      font-size: 8.5px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      padding: 6px 9px;
      border: 1px solid rgba(237,243,241,.12);
      border-radius: 999px;
      color: rgba(237,243,241,.75);
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

function tabela(cabecas: string[], linhas: string[][]): string {
  return `<table class="tbl">
    <thead><tr>${cabecas.map((c) => `<th>${c}</th>`).join("")}</tr></thead>
    <tbody>${linhas
      .map((linha) => `<tr>${linha.map((cel) => `<td>${cel}</td>`).join("")}</tr>`)
      .join("")}</tbody>
  </table>`;
}

export function montarHtmlProposta(dados: DadosProposta): string {
  const logo = pngDataUri(join(process.cwd(), "public", "frotec-logo.png"));
  const marca = pngDataUri(join(process.cwd(), "app", "icon.png"));
  const dataDoc = dataBrValida(dados.dataProposta)
    ? formatarDataBr(dados.dataProposta)
    : formatarDataBr(new Date());
  const qtd = Number(dados.quantidade);
  const temFrota = Number.isInteger(qtd) && qtd >= 1;
  const frotaLabel = qtd === 1 ? "veículo" : "veículos";
  const frotaTexto = temFrota ? `${escapar(dados.quantidade)} ${frotaLabel}` : "A definir";
  const cliente = escapar(dados.empresa);
  const mensal = formatarMoeda(dados.valorMensal);
  const total = temFrota
    ? formatarMoeda(totalMensalFrota(dados.quantidade, dados.valorMensal))
    : "A definir";
  const vistoria = formatarMoeda(dados.valorVistoria);
  const validade = dados.validadeDias.trim()
    ? `${escapar(dados.validadeDias)} dias`
    : "A definir";
  const vigenciaTexto = dataBrValida(dados.vigencia)
    ? formatarDataBr(dados.vigencia)
    : "Após formalização contratual";
  const pagamentoVistoria = dados.aceiteVistoria
    ? "Antecipado · condição de ativação"
    : "A definir";
  const linhaPessoa = [dados.responsavel, dados.cargo]
    .map((s) => s.trim())
    .filter(Boolean)
    .join(" · ");
  const nomeAssinatura = dados.responsavel.trim() || "________________________________";
  const cargoAssinatura = dados.cargo.trim() || "________________________________";
  const investimentoLinhas: string[][] = [
    ["Vistoria técnica inicial", `${escapar(vistoria)} por veículo`],
    [
      "Plano mensal de manutenção preventiva e corretiva, com reposição de peças no plano, sistema online e monitoramento 24/7",
      `${escapar(mensal)} por veículo`,
    ],
  ];
  if (temFrota) {
    investimentoLinhas.push([
      "Total mensal desta frota",
      `${escapar(total)} · ${escapar(dados.quantidade)} ${frotaLabel}`,
    ]);
  }
  const totalFolhas = 10;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<title>Proposta Frotec — ${cliente}</title>
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
      Gestão técnica e manutenção de frota — preventiva, corretiva, reposição de peças
      no escopo e suporte operacional contínuo, com custo mensal fixo por veículo.
    </p>
    <div class="empresa">${cliente}</div>
    ${linhaPessoa ? `<p>${escapar(linhaPessoa)}</p>` : ""}
    <div class="chips">
      <div class="chip"><span class="label">Data</span><br><b>${escapar(dataDoc)}</b></div>
      <div class="chip"><span class="label">Validade</span><br><b>${validade}</b></div>
      <div class="chip"><span class="label">Mensal / veículo</span><br><b>${escapar(mensal)}</b></div>
      <div class="chip"><span class="label">Frota</span><br><b>${frotaTexto}</b></div>
    </div>
    <div class="push grid-3" style="margin-bottom:12px">
      <div class="card"><div class="n">01</div><strong>Avaliar</strong><p>Vistoria individual, checklist e classificação de prioridade.</p></div>
      <div class="card"><div class="n">02</div><strong>Manter</strong><p>Preventiva e corretiva mecânica e eletrônica, com peças no plano.</p></div>
      <div class="card"><div class="n">03</div><strong>Acompanhar</strong><p>Sistema online, alertas e monitoramento 24 horas, sete dias.</p></div>
    </div>
    ${rodape(1, totalFolhas, dados.empresa)}
  </div>
</section>

<section class="sheet">
  <div class="pad">
    ${cabecalho(logo, "01 — Apresentação e objetivo")}
    <h2>Gestão técnica<br>com custo previsível.</h2>
    <p class="lead">A Frotec apresenta à ${cliente} uma solução de gestão técnica e manutenção de veículos, com atuação nas áreas eletrônica e mecânica, reposição de peças, acompanhamento das intervenções e suporte operacional contínuo.</p>
    <p>A proposta apoia a redução de paradas inesperadas, a organização da preventiva e a agilidade da corretiva. O trabalho combina avaliação técnica, priorização, execução, acompanhamento digital por veículo e monitoramento 24 horas por dia, sete dias por semana.</p>
    <p>O plano foi desenvolvido para reduzir gastos mensais elevados e variáveis com manutenção, com um custo mensal fixo por veículo. Dentro do escopo e dos limites contratados, a empresa conta com peças e mão de obra previstas no plano sem absorver, a cada ocorrência, despesas inesperadas.</p>
    <div class="grid-2" style="margin:12px 0">
      <div class="card"><div class="label">Empresa</div><strong>${cliente}</strong></div>
      <div class="card"><div class="label">Responsável</div><strong>${textoOuTraco(dados.responsavel)}</strong></div>
      <div class="card"><div class="label">Cargo</div><strong>${textoOuTraco(dados.cargo)}</strong></div>
      <div class="card"><div class="label">WhatsApp</div><strong>${textoOuTraco(dados.whatsapp)}</strong></div>
      <div class="card"><div class="label">E-mail</div><strong>${textoOuTraco(dados.email)}</strong></div>
      <div class="card"><div class="label">Tipos de veículos</div><strong>${textoOuTraco(dados.faixa)}</strong></div>
    </div>
    <div class="card" style="margin-bottom:10px">
      <div class="label">Região e rotas de operação</div>
      <p style="margin:6px 0 0;color:#edf3f1">${textoOuTraco(dados.rotas)}</p>
    </div>
    <h3>Objetivo da contratação</h3>
    <p>Disponibilizar atendimento técnico integrado para manter os veículos em condições adequadas de funcionamento, segurança e disponibilidade, com previsibilidade financeira.</p>
    ${itens([
      "Maior previsibilidade na manutenção da frota",
      "Substituição de despesas recorrentes por custo mensal fixo por veículo",
      "Identificação antecipada de falhas e desgastes",
      "Redução do tempo de veículo parado e mais agilidade nas ocorrências",
      "Acompanhamento online dos veículos em oficina e monitoramento contínuo",
      "Mais clareza sobre peças, mão de obra e prioridades",
    ])}
    ${rodape(2, totalFolhas, dados.empresa)}
  </div>
</section>

<section class="sheet">
  <div class="pad">
    ${cabecalho(logo, "02 — Escopo dos serviços")}
    <h2>O que entra<br>no plano.</h2>
    <p>A Frotec realizará manutenção preventiva e corretiva, conforme a necessidade de cada veículo e o plano aprovado pela ${cliente}.</p>
    ${tabela(
      ["Área", "Serviços previstos"],
      [
        ["Mecânica", "Inspeção, diagnóstico, ajustes, reparos e troca de peças e componentes mecânicos conforme a necessidade do veículo."],
        ["Eletrônica", "Diagnóstico, identificação de falhas, testes, correções e troca de peças e componentes eletrônicos, incluindo módulos de controle quando tecnicamente necessários."],
        ["Módulos eletrônicos", "Atualizações, parametrizações e programações dos módulos, quando tecnicamente necessárias e compatíveis com o modelo."],
        ["Sistema ARLA 32", "Diagnóstico, preventiva e corretiva do sistema completo: tanque, bomba, injetor, sensores, linhas, módulo e demais componentes."],
        ["Catalisador", "Avaliação, correção de falhas e substituição quando tecnicamente necessária, incluindo verificação de eficiência e comunicação com o pós-tratamento."],
        ["Preventiva", "Checklist técnico, itens de desgaste, programação de intervenções e acompanhamento do histórico."],
        ["Corretiva", "Análise da ocorrência, definição de prioridade, reparo e validação do serviço."],
        ["Peças", "Reposição das peças previstas no plano aprovado, observadas as condições e os limites do contrato."],
        ["Controle de qualidade", "Número de série e data de substituição registrados para rastreabilidade e histórico do veículo."],
        ["Sistema online", "Acesso do gestor a veículos em oficina, serviços autorizados, etapas e status."],
        ["Monitoramento 24/7", "Canal 24 horas, sete dias, para receber problemas e encaminhar o atendimento."],
        ["Atendimento na base", "Em urgência, técnicos mecânicos e eletrônicos na base da contratante, quando solicitado."],
      ],
    )}
    ${rodape(3, totalFolhas, dados.empresa)}
  </div>
</section>

<section class="sheet">
  <div class="pad">
    ${cabecalho(logo, "03 — Sistemas e método")}
    <h2>Sistemas abrangidos<br>e como atendemos.</h2>
    <h3>3.1 Sistemas e componentes</h3>
    <p>Dentro do escopo, o plano abrange avaliação, preventiva, corretiva, diagnóstico, reparo e substituição dos conjuntos abaixo, conforme necessidade técnica:</p>
    <div class="chips-sys">
      <span>Motor</span><span>Câmbio</span><span>Diferencial</span><span>Turbina</span>
      <span>Injeção</span><span>EGR</span><span>DPF</span><span>Catalisador</span>
      <span>Módulos</span><span>Sistema de ar</span><span>Arrefecimento</span><span>Elétrico</span>
    </div>
    <p class="note">Peças, módulos, horas de mão de obra e demais serviços seguem os limites e as condições da seção 5.</p>
    <h3>4. Metodologia</h3>
    <div class="grid-2">
      <div class="card">
        <div class="n">4.1</div>
        <strong>Vistoria técnica inicial</strong>
        <p>Inspeção visual, checklist, diagnóstico eletrônico quando aplicável, evidências e itens que exigem atenção. Ao final, a ${cliente} recebe a visão das condições e das necessidades encontradas.</p>
      </div>
      <div class="card">
        <div class="n">4.2</div>
        <strong>Classificação e priorização</strong>
        <p>As necessidades são organizadas por risco técnico, segurança, impacto na operação e possibilidade de agravamento.</p>
      </div>
    </div>
    ${tabela(
      ["Prioridade", "Critério", "Tratamento"],
      [
        ["Crítica", "Falha ou condição com potencial de comprometer a segurança ou impedir a operação.", "Atendimento prioritário."],
        ["Alta", "Problema que pode evoluir rapidamente ou provocar parada do veículo.", "Programação em curto prazo."],
        ["Planejada", "Item de desgaste ou manutenção sem risco imediato à operação.", "Inclusão no calendário preventivo."],
      ],
    )}
    <div class="grid-2">
      <div class="card">
        <div class="n">4.3</div>
        <strong>Execução e acompanhamento</strong>
        <p>Após aprovação, os serviços são executados com OS, itens autorizados, peças, status e pendências no sistema. Necessidade fora do escopo é comunicada antes da execução.</p>
      </div>
      <div class="card">
        <div class="n">4.4 / 4.5</div>
        <strong>Alertas e monitoramento 24/7</strong>
        <p>Avisos automáticos de preventiva. Canal 24 horas para registrar ocorrência e encaminhar atendimento. O monitoramento não inclui, por si só, guincho ou remoção.</p>
      </div>
    </div>
    ${rodape(4, totalFolhas, dados.empresa)}
  </div>
</section>

<section class="sheet">
  <div class="pad">
    ${cabecalho(logo, "04 — Composição do plano")}
    <h2>Custo fixo.<br>Escopo fechado.</h2>
    <div class="stat" style="margin:10px 0 12px">
      <div class="label">Plano mensal por veículo</div>
      <div class="price">${escapar(mensal)}</div>
      <p style="margin:8px 0 0">Dentro desse escopo, não haverá limite financeiro para peças, componentes ou serviços de mão de obra. A responsabilidade da Frotec é manter o veículo em condições originais de trabalho, observadas as exclusões desta proposta.</p>
    </div>
    ${tabela(
      ["Componente incluído", "Condição do plano"],
      [
        ["Gestão técnica", "Vistoria inicial, checklist, priorização, histórico, plano preventivo e acompanhamento das OS."],
        ["Mão de obra", "Toda a mão de obra mecânica e eletrônica necessária aos serviços do escopo, sem limite de horas."],
        ["Peças e componentes", "Peças mecânicas e eletrônicas, sensores, atuadores, módulos, ARLA 32 e catalisador, sem limite financeiro dentro do escopo."],
        ["Sistema e suporte", "Sistema online, alertas preventivos, acompanhamento em oficina e monitoramento 24/7."],
        ["Rede de atendimento", "Encaminhamento e acompanhamento pela rede de oficinas parceiras, conforme cobertura e disponibilidade."],
      ],
    )}
    <p>A Frotec deverá executar ou coordenar os serviços necessários para devolver o veículo às condições originais de trabalho, sem cobrança adicional por peças ou mão de obra incluídas no escopo.</p>
    <h3>5.1 O que será considerado custo extra</h3>
    <p>Somente o item expressamente excluído do plano. Exemplos: pneus; troca de óleo e lubrificantes; guincho, remoção e transporte; deslocamentos superiores a 500 km quando houver necessidade de guincho; frete especial; danos de acidente, mau uso ou alteração não autorizada; serviços fora do escopo.</p>
    <p>Nenhum custo extra será executado sem orçamento, justificativa técnica e aprovação prévia da ${cliente}. Em risco à segurança, o veículo poderá permanecer imobilizado até a autorização do responsável.</p>
    ${rodape(5, totalFolhas, dados.empresa)}
  </div>
</section>

<section class="sheet">
  <div class="pad">
    ${cabecalho(logo, "05 — Rede e atendimento")}
    <h2>Oficinas, prazos<br>e 500 km.</h2>
    <p>A Frotec mantém parcerias com mais de 30 oficinas padronizadas nas principais rotas do país, conforme cobertura, localização, capacidade e disponibilidade. A indicação depende da rota, do tipo de problema e das condições no momento da ocorrência.</p>
    ${tabela(
      ["Corredor ou região", "Cobertura prevista", "Observação"],
      [
        ["BR-163 — Sinop e região", "Base Alfadiesel e oficinas parceiras conforme necessidade", "Coordenação a partir de Sinop/MT."],
        ["BR-163 — demais trechos", "Oficinas parceiras credenciadas conforme rota", "Confirmar disponibilidade antes do encaminhamento."],
        ["BR-364 e demais rotas nacionais", "Rede parceira conforme cidade, capacidade e disponibilidade", "A cobertura efetiva é consultada na ocorrência."],
      ],
    )}
    <div class="card" style="margin-bottom:10px">
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
      <p style="margin:8px 0 0">Base em Sinop/MT. Ramal BR-364 até Vilhena/RO. Extensão aproximada ${escapar(EXTENSAO_APROXIMADA)}. A existência de parceria não significa disponibilidade simultânea em todas as cidades.</p>
    </div>
    <h3>7. Locais e prazo</h3>
    <p>A Frotec é responsável pelos deslocamentos de até 500 km para atendimento relacionado ao plano. Além disso, ou quando exigir estrutura especializada, aciona-se a oficina parceira mais próxima. O prazo depende da complexidade, das condições do veículo e da capacidade da oficina.</p>
    <div class="grid-2">
      <div class="card">
        <div class="n">7.1</div>
        <strong>Atendimento emergencial na base</strong>
        <p>Em urgência, técnicos mecânicos e eletrônicos na base da ${cliente}, para agilizar diagnóstico e liberação. Se exigir estrutura especializada, o veículo poderá seguir depois à rede parceira.</p>
      </div>
      <div class="card">
        <div class="n">7.2</div>
        <strong>Guincho e remoção</strong>
        <p>Quando necessário para encaminhar o veículo. Contratação e custo são da ${cliente}. A Frotec orienta o acionamento, indica o destino e acompanha pelo sistema.</p>
      </div>
    </div>
    ${rodape(6, totalFolhas, dados.empresa)}
  </div>
</section>

<section class="sheet">
  <div class="pad">
    ${cabecalho(logo, "06 — Garantias e investimento")}
    <h2>Garantia, relatório<br>e valores.</h2>
    <div class="grid-2" style="margin-bottom:10px">
      <div class="card">
        <div class="n">8.1</div>
        <strong>Peças, serviços e retrabalho</strong>
        <p>Garantias das peças e dos serviços são da Frotec. Peças: garantia do fabricante ou fornecedor. Serviços: mínimo de 90 dias, salvo prazo maior. Retrabalho no mesmo item, no prazo, sem cobrança adicional de peça ou mão de obra no escopo. Não cobre mau uso, acidente, alteração não autorizada, desgaste natural, intervenção de terceiros ou causa diferente do serviço original.</p>
      </div>
      <div class="card">
        <div class="n">8.2</div>
        <strong>Relatório mensal</strong>
        <p>Até o 5º dia útil do mês seguinte: disponibilidade por veículo, paradas programadas e não programadas, OS abertas e concluídas, tempos médios, peças e números de série, custos extras aprovados, SLA, retrabalhos e ações preventivas.</p>
      </div>
    </div>
    <h3>9. Investimento</h3>
    ${tabela(["Item", "Valor"], investimentoLinhas)}
    <div class="stat" style="margin-bottom:10px">
      <div class="grid-2">
        <div><div class="label">Pagamento da vistoria</div><strong>${pagamentoVistoria}</strong></div>
        <div><div class="label">Início de vigência</div><strong>${escapar(vigenciaTexto)}</strong></div>
      </div>
    </div>
    <p>O plano tem vigência mensal, com cobrança mensal de ${escapar(mensal)} por veículo. Qualquer parte pode encerrar mediante aviso prévio de 30 dias, sem multa, desde que serviços já executados e obrigações vencidas estejam quitados.</p>
    <p class="note">Salvo previsão expressa em contrato, serviços adicionais, peças fora do escopo, deslocamentos extraordinários, fretes e intervenções não previstas devem ser orçados e aprovados previamente. Documento gerado em ${escapar(dataDoc)}.</p>
    ${rodape(7, totalFolhas, dados.empresa)}
  </div>
</section>

<section class="sheet">
  <div class="pad">
    ${cabecalho(logo, "07 — Diferenciais e entregas")}
    <h2>Além do reparo<br>pontual.</h2>
    <p>O diferencial está na rotina técnica, na visibilidade das intervenções e na previsibilidade para a operação.</p>
    <div class="grid-2" style="margin-bottom:8px">
      <div class="card"><div class="n">10.1</div><strong>Sistema online</strong><p>Acompanhar veículos em oficina, etapas, pendências e conclusão.</p></div>
      <div class="card"><div class="n">10.2</div><strong>Monitoramento 24/7</strong><p>Registrar ocorrências e direcionar o atendimento o dia todo.</p></div>
      <div class="card"><div class="n">10.3</div><strong>Alertas de preventiva</strong><p>Avisos automáticos antes que o item vire falha operacional.</p></div>
      <div class="card"><div class="n">10.4</div><strong>Rede 30+ oficinas</strong><p>Mais opções nas principais rotas e maior uniformidade.</p></div>
      <div class="card"><div class="n">10.5</div><strong>Atendimento integrado</strong><p>Eletrônica, mecânica, preventiva e corretiva na mesma rotina.</p></div>
      <div class="card"><div class="n">10.6</div><strong>Peças no plano</strong><p>Reposição integrada, sem negociação fragmentada a cada OS.</p></div>
      <div class="card"><div class="n">10.7</div><strong>Agilidade</strong><p>Priorização pelo risco e pelo impacto operacional.</p></div>
      <div class="card"><div class="n">10.8</div><strong>Decisão informada</strong><p>Diagnóstico, evidências, histórico e acompanhamento online.</p></div>
    </div>
    <div class="card" style="margin-bottom:10px">
      <div class="n">10.9</div>
      <strong>Acompanhamento por veículo</strong>
      <p style="margin:6px 0 0">Histórico de vistoria, intervenções, peças, pendências e próximas ações.</p>
    </div>
    <h3>11. Entregas previstas</h3>
    ${itens(
      [
        "Vistoria técnica individual, checklist, registro de falhas e classificação de prioridade",
        "Plano de manutenção preventiva e corretiva; atualização de módulos quando necessária",
        "Sistema online, acompanhamento de OS, relação de peças e número de série",
        "Alertas automáticos de preventiva e histórico básico por veículo",
        "Monitoramento 24/7 e técnicos na base da contratante, quando solicitado",
        "Registro de ocorrências e comunicação de necessidades adicionais",
      ],
      "yes tight",
    )}
    ${rodape(8, totalFolhas, dados.empresa)}
  </div>
</section>

<section class="sheet">
  <div class="pad">
    ${cabecalho(logo, "08 — Exclusões e responsabilidades")}
    <h2>O que não entra.<br>Quem faz o quê.</h2>
    <p>Os itens abaixo não fazem parte do plano mensal e não estão incluídos em ${escapar(mensal)} por veículo:</p>
    ${itens(
      [
        "Pneus: troca, conserto, recapagem, alinhamento, balanceamento ou aquisição",
        "Troca de óleo, lubrificantes e serviços de lubrificação, salvo contratação adicional expressa",
        "Guincho, remoção ou transporte do veículo",
        "Molas e componentes de suspensão",
        "Freios: pastilhas, lonas, discos, tambores e demais componentes",
        "Danos de acidentes, mau uso, negligência, operação inadequada ou alterações não autorizadas",
        "Peças e serviços expressamente excluídos ou que ultrapassem os limites do contrato",
      ],
      "no",
    )}
    <p class="note">Pneus, óleo e guincho podem ser solicitados a terceiros ou contratados à parte, com orçamento e aprovação específicos.</p>
    <h3>13. Responsabilidades da Frotec</h3>
    <p>Realizar os serviços aprovados com diligência técnica, comunicar necessidades, manter registros no sistema, disponibilizar o monitoramento 24/7, informar o andamento e pedir aprovação para o que estiver fora do escopo. Buscar peças e soluções compatíveis com a aplicação do veículo. A Frotec não se responsabiliza pela contratação, disponibilidade, custo ou execução de guincho, remoção ou transporte — salvo acordo escrito em contrário.</p>
    <h3>14. Responsabilidades da ${cliente}</h3>
    <p>Disponibilizar os veículos, fornecer informações, indicar prioridades, autorizar serviços e efetuar os pagamentos. Acompanhar os alertas, comunicar alterações de rota, uso, carga, sintomas ou ocorrências. Providenciar e custear os serviços excluídos, incluindo pneus, óleo, guincho, remoção e transporte, quando necessários.</p>
    ${rodape(9, totalFolhas, dados.empresa)}
  </div>
</section>

<section class="sheet">
  <div class="pad">
    ${cabecalho(logo, "09 — Condições e aceite")}
    <h2>Condições comerciais<br>e assinaturas.</h2>
    ${tabela(
      ["Condição", "Definição"],
      [
        ["Forma de pagamento da vistoria", "A definir"],
        ["Forma de pagamento do plano", `Cobrança mensal de ${escapar(mensal)} por veículo`],
        ["Vigência do plano", "Mensal"],
        ["Início de vigência", escapar(vigenciaTexto)],
        ["Encerramento", "Aviso prévio de 30 dias, sem multa"],
        ["Prazo de pagamento", "A definir"],
        ["Garantia dos serviços e peças", "Responsabilidade da Frotec, conforme seção 8"],
        ["Validade da proposta", validade],
        ["Início dos serviços", "Após aprovação e formalização contratual"],
      ],
    )}
    <p>A aprovação desta proposta representa a concordância com o escopo geral. A execução começa após a definição das condições comerciais pendentes e a formalização do contrato ou ordem de serviço correspondente.</p>
    <div class="grid-2" style="margin:12px 0">
      <div class="card sign">
        <div class="line">${cliente}<br>Nome: ${escapar(nomeAssinatura)} · Cargo: ${escapar(cargoAssinatura)}<br>Assinatura / data</div>
      </div>
      <div class="card sign">
        <div class="line">Frotec · Sinop/MT<br>Representante / cargo<br>Assinatura / data</div>
      </div>
    </div>
    <div class="grid-2">
      <div class="card">
        <div class="label">Contatos da Frotec</div>
        <strong>Gestão técnica de frotas diesel</strong>
        <p style="margin:6px 0 0;color:#edf3f1">Base: Alfadiesel — Sinop/MT, BR-163<br>E-mail: contato@frotec.com.br<br>Telefone: (69) 9 9221-6293<br>Site: frotec.com.br</p>
      </div>
      <div class="card">
        <div class="label">Frota nesta proposta</div>
        <strong>${frotaTexto}</strong>
        <p style="margin:6px 0 0;color:#edf3f1">Mensal por veículo ${escapar(mensal)}${temFrota ? `<br>Total mensal ${escapar(total)}` : ""}</p>
      </div>
    </div>
    ${rodape(10, totalFolhas, dados.empresa)}
  </div>
</section>

</body>
</html>`;
}

