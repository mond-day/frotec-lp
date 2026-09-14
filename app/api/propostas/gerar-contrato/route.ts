import { cookies } from "next/headers";
import { COOKIE_PROPOSTAS, sessaoValida } from "@/lib/auth";
import { montarHtmlContrato, templatesCabecalhoRodapeContrato } from "@/lib/contrato-pdf-template";
import { normalizarContrato, validarContrato } from "@/lib/contrato";
import { htmlParaPdf } from "@/lib/pdf";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: Request) {
  const jar = await cookies();
  if (!(await sessaoValida(jar.get(COOKIE_PROPOSTAS)?.value))) {
    return Response.json({ erro: "Sessão expirada. Entre de novo." }, { status: 401 });
  }

  let corpo: unknown;
  try {
    corpo = await request.json();
  } catch {
    return Response.json({ erro: "Corpo da requisição inválido." }, { status: 400 });
  }

  const dados = normalizarContrato(corpo);
  const erros = validarContrato(dados);
  if (Object.keys(erros).length > 0) {
    return Response.json({ erros }, { status: 422 });
  }

  try {
    const html = montarHtmlContrato(dados);
    const { cabecalhoHtml, rodapeHtml } = templatesCabecalhoRodapeContrato();
    const pdf = await htmlParaPdf(html, {
      cabecalhoHtml,
      rodapeHtml,
      margem: { top: "18mm", bottom: "16mm", left: "16mm", right: "16mm" },
    });
    const slug = dados.empresaRazaoSocial
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40);
    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="contrato-frotec-${slug || "empresa"}.pdf"`,
      },
    });
  } catch (erro) {
    console.error("[contrato] Falha ao gerar PDF:", erro);
    return Response.json({ erro: "Não foi possível gerar o PDF agora." }, { status: 502 });
  }
}
