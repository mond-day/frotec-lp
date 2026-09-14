import nodemailer from "nodemailer";
import { formatarCnpj } from "./cnpj";
import { formatarTelefone, type PayloadLead } from "./lead";

/**
 * Envio do lead por SMTP: aviso ao comercial e agradecimento ao cliente.
 *
 * Tudo e lido de process.env a cada envio, entao a configuracao pode ser trocada
 * no ambiente do servico (Portainer/Swarm) sem reconstruir a imagem.
 */

const TIMEOUT_MS = 10000;

export type ConfigSmtp = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  remetente: string;
  destinatarios: string;
};

/**
 * Le a configuracao do ambiente. Devolve null quando falta alguma variavel
 * obrigatoria, para a rota responder "canal indisponivel" em vez de tentar um
 * envio que ja se sabe que vai falhar.
 */
export function lerConfigSmtp(): ConfigSmtp | null {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS;
  const destinatarios = process.env.LEAD_EMAIL_TO?.trim();

  if (!host || !user || !pass || !destinatarios) return null;

  const port = Number(process.env.SMTP_PORT) || 587;
  // A porta 465 fala TLS desde o primeiro byte; a 587 comeca em texto puro e
  // sobe para TLS via STARTTLS. SMTP_SECURE so existe para servidores que
  // fogem desse padrao.
  const secureBruto = process.env.SMTP_SECURE?.trim().toLowerCase();
  const secure = secureBruto ? secureBruto === "true" : port === 465;

  return {
    host,
    port,
    secure,
    user,
    pass,
    // Quase todo servidor exige que o remetente seja a propria caixa
    // autenticada, entao esse e o padrao quando LEAD_EMAIL_FROM nao vem.
    remetente: process.env.LEAD_EMAIL_FROM?.trim() || user,
    destinatarios,
  };
}

/** Evita que um caractere digitado pelo lead quebre o HTML da mensagem. */
function escaparHtml(valor: string): string {
  return valor
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatarData(iso: string): string {
  const partes = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Cuiaba",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(new Date(iso));
  const dia = partes.find((p) => p.type === "day")?.value ?? "";
  const mes = partes.find((p) => p.type === "month")?.value ?? "";
  const ano = partes.find((p) => p.type === "year")?.value ?? "";
  return `${dia}/${mes}/${ano}`;
}

function frotaLabel(lead: PayloadLead): string {
  return `${lead.veiculos} ${lead.veiculos === 1 ? "caminhão" : "caminhões"}`;
}

/** Campos da mensagem, na ordem em que o comercial le. */
function camposDoLead(lead: PayloadLead): [string, string][] {
  return [
    ["Empresa", lead.empresa],
    ["CNPJ", lead.cnpj ? formatarCnpj(lead.cnpj) : "—"],
    ["Responsável", lead.nome],
    ["WhatsApp", formatarTelefone(lead.whatsapp)],
    ["E-mail", lead.email || "—"],
    ["Frota", frotaLabel(lead)],
    ["Região", lead.rota_label],
    ["Problemas", lead.problemas_label || "—"],
    ["Mensagem", lead.mensagem || "—"],
    ["Recebido em", formatarData(lead.data_envio)],
  ];
}

function montarAssunto(lead: PayloadLead): string {
  const prefixo = lead.fora_area ? "[FORA DE ÁREA] " : "";
  return `${prefixo}Novo lead: ${lead.empresa} (${frotaLabel(lead)})`;
}

function montarTexto(lead: PayloadLead): string {
  const aviso = lead.fora_area
    ? "ATENÇÃO: região fora da área atendida hoje.\n\n"
    : "";
  const linhas = camposDoLead(lead)
    .map(([rotulo, valor]) => `${rotulo}: ${valor}`)
    .join("\n");

  return `${aviso}${linhas}\n\nEnviado pelo formulário do site.`;
}

function montarHtml(lead: PayloadLead): string {
  const aviso = lead.fora_area
    ? '<p style="color:#b45309;font-weight:600">Atenção: região fora da área atendida hoje.</p>'
    : "";
  const linhas = camposDoLead(lead)
    .map(
      ([rotulo, valor]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#666;vertical-align:top">${rotulo}</td>` +
        `<td style="padding:6px 0"><strong>${escaparHtml(valor)}</strong></td></tr>`,
    )
    .join("");

  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111">
  <h2 style="margin:0 0 12px">Novo lead do site</h2>
  ${aviso}
  <table cellpadding="0" cellspacing="0">${linhas}</table>
  <p style="margin-top:16px;color:#666">Enviado pelo formulário do site.</p>
</div>`;
}

function criarTransporte(config: ConfigSmtp) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.pass },
    connectionTimeout: TIMEOUT_MS,
    greetingTimeout: TIMEOUT_MS,
    socketTimeout: TIMEOUT_MS,
  });
}

function replyToComercial(config: ConfigSmtp): string {
  const primeiro = config.destinatarios.split(",")[0]?.trim();
  return primeiro || config.remetente;
}

const PERGUNTAS_PROPOSTA = [
  "Cargo do responsável",
  "Rotas de operação (trechos que a frota roda)",
  "Faixa de categoria / marca da frota",
  "Tipo de motor / anexos",
  "SCR / Arla 32 no escopo? (sim/não)",
  "Interesse em alarme de módulo? (sim/não)",
  "Interesse em parafusos de segredo? (sim/não)",
  "Data desejada de início (dd/mm/aaaa)",
  "Irregularidades técnicas já conhecidas (opcional)",
];

function montarAssuntoAgradecimento(lead: PayloadLead): string {
  const primeiroNome = lead.nome.trim().split(/\s+/)[0] || lead.nome;
  return `Recebemos seu pedido, ${primeiroNome}`;
}

function montarTextoAgradecimento(lead: PayloadLead): string {
  const perguntas = PERGUNTAS_PROPOSTA.map((item, i) => `${i + 1}. ${item}`).join("\n");
  const jaSabemos = [
    `Empresa: ${lead.empresa}`,
    `Responsável: ${lead.nome}`,
    `Frota: ${frotaLabel(lead)}`,
    `Região: ${lead.rota_label}`,
    lead.problemas_label ? `Problemas: ${lead.problemas_label}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  if (lead.fora_area) {
    return `Olá, ${lead.nome}.

Recebemos os dados da ${lead.empresa}. Nesta fase a Frotec atende o corredor da BR-163 de Rondonópolis a Miritituba, com ramal até Rondônia. Sua região ficou registrada para a próxima expansão — ainda não há proposta nem ativação nesta área.

Se quiser, responda este e-mail com os itens abaixo. Eles entram no arquivo de expansão.

O que já registramos:
${jaSabemos}

${perguntas}

A Frotec presta serviços de gestão técnica e consultoria em manutenção de frotas. Não é seguro, não é garantia estendida e não constitui operação securitária.

Equipe Frotec`;
  }

  return `Olá, ${lead.nome}.

Recebemos o pedido da ${lead.empresa}. O time Frotec entra em contato para entender a operação.

Para montarmos a proposta, responda este e-mail com os itens abaixo.

O que já registramos:
${jaSabemos}

${perguntas}

A Frotec presta serviços de gestão técnica e consultoria em manutenção de frotas. Não é seguro, não é garantia estendida e não constitui operação securitária.

Equipe Frotec`;
}

function montarHtmlAgradecimento(lead: PayloadLead): string {
  const perguntas = PERGUNTAS_PROPOSTA.map((item) => `<li>${escaparHtml(item)}</li>`).join("");
  const jaSabemos = [
    ["Empresa", lead.empresa],
    ["Responsável", lead.nome],
    ["Frota", frotaLabel(lead)],
    ["Região", lead.rota_label],
    ...(lead.problemas_label ? [["Problemas", lead.problemas_label] as [string, string]] : []),
  ]
    .map(
      ([rotulo, valor]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#666">${escaparHtml(rotulo)}</td>` +
        `<td style="padding:4px 0"><strong>${escaparHtml(valor)}</strong></td></tr>`,
    )
    .join("");

  const intro = lead.fora_area
    ? `<p>Recebemos os dados da <strong>${escaparHtml(lead.empresa)}</strong>. Nesta fase a Frotec atende o corredor da BR-163 de Rondonópolis a Miritituba, com ramal até Rondônia. Sua região ficou registrada para a próxima expansão — ainda não há proposta nem ativação nesta área.</p>
  <p>Se quiser, responda este e-mail com os itens abaixo. Eles entram no arquivo de expansão.</p>`
    : `<p>Recebemos o pedido da <strong>${escaparHtml(lead.empresa)}</strong>. O time Frotec entra em contato para entender a operação.</p>
  <p>Para montarmos a proposta, <strong>responda este e-mail</strong> com os itens abaixo.</p>`;

  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111;line-height:1.5">
  <p>Olá, ${escaparHtml(lead.nome)}.</p>
  ${intro}
  <p style="margin:16px 0 6px;color:#666">O que já registramos</p>
  <table cellpadding="0" cellspacing="0">${jaSabemos}</table>
  <p style="margin:18px 0 6px">Responda com:</p>
  <ol style="padding-left:20px;margin:0">${perguntas}</ol>
  <p style="margin-top:18px;color:#666;font-size:12px">A Frotec presta serviços de gestão técnica e consultoria em manutenção de frotas. Não é seguro, não é garantia estendida e não constitui operação securitária.</p>
  <p style="margin-top:16px">Equipe Frotec</p>
</div>`;
}

export async function enviarLead(lead: PayloadLead, config: ConfigSmtp): Promise<void> {
  const transporte = criarTransporte(config);

  try {
    await transporte.sendMail({
      from: { name: "Site Frotec", address: config.remetente },
      to: config.destinatarios,
      // Deixa o comercial responder ao lead direto pelo "Responder".
      ...(lead.email ? { replyTo: lead.email } : {}),
      subject: montarAssunto(lead),
      text: montarTexto(lead),
      html: montarHtml(lead),
    });
  } finally {
    transporte.close();
  }
}

/** Agradecimento ao lead, com as perguntas para o time montar a proposta. */
export async function enviarAgradecimentoLead(lead: PayloadLead, config: ConfigSmtp): Promise<void> {
  if (!lead.email) return;

  const transporte = criarTransporte(config);

  try {
    await transporte.sendMail({
      from: { name: "Site Frotec", address: config.remetente },
      to: lead.email,
      replyTo: replyToComercial(config),
      subject: montarAssuntoAgradecimento(lead),
      text: montarTextoAgradecimento(lead),
      html: montarHtmlAgradecimento(lead),
    });
  } finally {
    transporte.close();
  }
}
