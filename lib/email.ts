import nodemailer from "nodemailer";
import { formatarCnpj } from "./cnpj";
import { formatarTelefone, type PayloadLead } from "./lead";

/**
 * Envio do lead por SMTP para a caixa do comercial.
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
  return new Date(iso).toLocaleString("pt-BR", { timeZone: "America/Cuiaba" });
}

/** Campos da mensagem, na ordem em que o comercial le. */
function camposDoLead(lead: PayloadLead): [string, string][] {
  return [
    ["Empresa", lead.empresa],
    ["CNPJ", lead.cnpj ? formatarCnpj(lead.cnpj) : "—"],
    ["Responsável", lead.nome],
    ["WhatsApp", formatarTelefone(lead.whatsapp)],
    ["E-mail", lead.email || "—"],
    ["Frota", `${lead.veiculos} ${lead.veiculos === 1 ? "caminhão" : "caminhões"}`],
    ["Região", lead.rota_label],
    ["Maior problema", lead.problema_label || "—"],
    ["Mensagem", lead.mensagem || "—"],
    ["Recebido em", formatarData(lead.data_envio)],
  ];
}

function montarAssunto(lead: PayloadLead): string {
  const prefixo = lead.fora_area ? "[FORA DE ÁREA] " : "";
  const frota = `${lead.veiculos} ${lead.veiculos === 1 ? "caminhão" : "caminhões"}`;

  return `${prefixo}Novo lead: ${lead.empresa} (${frota})`;
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

export async function enviarLead(lead: PayloadLead, config: ConfigSmtp): Promise<void> {
  const transporte = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.pass },
    connectionTimeout: TIMEOUT_MS,
    greetingTimeout: TIMEOUT_MS,
    socketTimeout: TIMEOUT_MS,
  });

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
