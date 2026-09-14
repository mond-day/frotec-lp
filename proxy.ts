import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_PROPOSTAS, sessaoValida } from "@/lib/auth";

/**
 * Next 16: middleware.js foi renomeado para proxy.ts.
 * Protege /propostas (exceto login). A API gerar-pdf revalida o cookie no handler.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/propostas/login" || pathname.startsWith("/propostas/login/")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_PROPOSTAS)?.value;
  if (await sessaoValida(token)) return NextResponse.next();

  const login = new URL("/propostas/login", request.url);
  login.searchParams.set("next", pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/propostas", "/propostas/:path*"],
};
