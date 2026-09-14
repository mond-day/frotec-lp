import { cookies } from "next/headers";
import { COOKIE_PROPOSTAS, sessaoValida } from "@/lib/auth";
import { htmlParaPdf } from "@/lib/pdf";
import { montarHtmlProposta } from "@/lib/proposta-pdf-template";
import { normalizarProposta, validarProposta } from "@/lib/proposta";

export const runtime = "nodejs";
export const maxDuration = 60;

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

  const dados = normalizarProposta(corpo);
  const erros = validarProposta(dados);
  if (Object.keys(erros).length > 0) {
    return Response.json({ erros }, { status: 422 });
  }

  try {
    const html = montarHtmlProposta(dados);
    const pdf = await htmlParaPdf(html);
    const slug = dados.empresa
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
        "Content-Disposition": `attachment; filename="proposta-frotec-${slug || "cliente"}.pdf"`,
      },
    });
  } catch (erro) {
    console.error("[propostas] Falha ao gerar PDF:", erro);
    return Response.json({ erro: "Não foi possível gerar o PDF agora." }, { status: 502 });
  }
}
