import { NextResponse } from "next/server";
import { COOKIE_PROPOSTAS, opcoesCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  const resposta = NextResponse.json({ ok: true });
  resposta.cookies.set(COOKIE_PROPOSTAS, "", { ...opcoesCookie(0), maxAge: 0 });
  return resposta;
}
