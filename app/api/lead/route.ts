import { enviarLead, lerConfigSmtp } from "@/lib/email";
import {
  CAMPO_ISCA,
  LEAD_VAZIO,
  montarPayload,
  normalizarProblemas,
  validarLead,
  type DadosLead,
} from "@/lib/lead";

/**
 * Recebe o formulario do site e envia o lead por e-mail ao time comercial.
 *
 * As credenciais de SMTP ficam so no servidor e sao lidas a cada request, entao
 * podem ser definidas como variaveis do servico na stack do Swarm sem rebuildar
 * a imagem. Variaveis NEXT_PUBLIC_ seriam congeladas no build e expostas no
 * navegador.
 */

// O nodemailer abre socket TCP, o que so existe no runtime Node.
export const runtime = "nodejs";

/** Garante que todo campo esperado chegue tipado, venha o que vier no corpo. */
function normalizar(corpo: unknown): DadosLead {
  const bruto = (corpo ?? {}) as Record<string, unknown>;
  const dados: DadosLead = { ...LEAD_VAZIO, problemas: [] };

  for (const campo of Object.keys(LEAD_VAZIO) as (keyof DadosLead)[]) {
    if (campo === "problemas") continue;
    const valor = bruto[campo];
    dados[campo] = typeof valor === "string" ? valor : valor == null ? "" : String(valor);
  }

  // Aceita `problemas` (array) ou legado `problema` (string).
  const problemasBrutos =
    bruto.problemas ??
    (typeof bruto.problema === "string" ? [bruto.problema] : []);
  dados.problemas = normalizarProblemas(problemasBrutos);

  return dados;
}

export async function POST(request: Request) {
  let corpo: unknown;
  try {
    corpo = await request.json();
  } catch {
    return Response.json({ erro: "Corpo da requisicao invalido." }, { status: 400 });
  }

  // Robo caiu na isca: responde como se tivesse dado certo, para ele nao tentar
  // de novo, mas nao gasta envio nem suja a caixa do comercial.
  const isca = (corpo as Record<string, unknown> | null)?.[CAMPO_ISCA];
  if (typeof isca === "string" && isca.trim() !== "") {
    console.warn("[lead] Envio descartado: campo isca preenchido.");
    return Response.json({ ok: true });
  }

  const config = lerConfigSmtp();
  if (!config) {
    console.error("[lead] Configuracao de SMTP incompleta no ambiente.");
    return Response.json(
      { erro: "Canal de contato indisponivel no momento." },
      { status: 503 },
    );
  }

  const dados = normalizar(corpo);

  const erros = validarLead(dados);
  if (Object.keys(erros).length > 0) {
    return Response.json({ erros }, { status: 422 });
  }

  const payload = montarPayload(dados);

  try {
    await enviarLead(payload, config);
  } catch (erro) {
    // O lead vai inteiro para o log: se o SMTP estiver fora, o contato ainda
    // pode ser recuperado nos logs do container em vez de se perder.
    console.error("[lead] Falha ao enviar o e-mail:", erro);
    console.error("[lead] Conteudo do lead perdido:", JSON.stringify(payload));
    return Response.json({ erro: "Nao foi possivel registrar o contato." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
