import { NextResponse } from "next/server";
import {
  COOKIE_PROPOSTAS,
  SESSAO_MS,
  criarSessao,
  credenciaisValidas,
  loginConfigurado,
  opcoesCookie,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!loginConfigurado()) {
    console.error("[propostas] PROPOSTAS_USER / PASSWORD / SESSION_SECRET incompletos.");
    return NextResponse.json(
      { erro: "Área de propostas indisponível no momento." },
      { status: 503 },
    );
  }

  let corpo: { usuario?: unknown; senha?: unknown };
  try {
    corpo = (await request.json()) as { usuario?: unknown; senha?: unknown };
  } catch {
    return NextResponse.json({ erro: "Corpo da requisição inválido." }, { status: 400 });
  }

  const usuario = typeof corpo.usuario === "string" ? corpo.usuario : "";
  const senha = typeof corpo.senha === "string" ? corpo.senha : "";

  if (!credenciaisValidas(usuario, senha)) {
    return NextResponse.json({ erro: "Usuário ou senha inválidos." }, { status: 401 });
  }

  const token = await criarSessao();
  if (!token) {
    return NextResponse.json({ erro: "Área de propostas indisponível no momento." }, { status: 503 });
  }

  const resposta = NextResponse.json({ ok: true });
  resposta.cookies.set(COOKIE_PROPOSTAS, token, opcoesCookie(Math.floor(SESSAO_MS / 1000)));
  return resposta;
}
