/**
 * Sessao unica da area /propostas.
 *
 * Cookie HMAC (Web Crypto), sem jose. Funciona no proxy (Edge) e nas rotas Node.
 * Usuario/senha vem de env — nao ha tabela de usuarios.
 */

export const COOKIE_PROPOSTAS = "frotec_propostas";
export const SESSAO_MS = 8 * 60 * 60 * 1000;

type PayloadSessao = {
  sub: "propostas";
  exp: number;
};

function secret(): string | null {
  const valor = process.env.PROPOSTAS_SESSION_SECRET?.trim();
  return valor ? valor : null;
}

export function loginConfigurado(): boolean {
  return Boolean(
    process.env.PROPOSTAS_USER?.trim() &&
      process.env.PROPOSTAS_PASSWORD &&
      process.env.PROPOSTAS_SESSION_SECRET?.trim(),
  );
}

export function credenciaisValidas(usuario: string, senha: string): boolean {
  const esperadoUser = process.env.PROPOSTAS_USER?.trim();
  const esperadoPass = process.env.PROPOSTAS_PASSWORD;
  if (!esperadoUser || esperadoPass == null) return false;
  return usuario === esperadoUser && senha === esperadoPass;
}

function paraBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function deBase64Url(texto: string): Uint8Array {
  const pad = texto.replace(/-/g, "+").replace(/_/g, "/");
  const padded = pad + "=".repeat((4 - (pad.length % 4)) % 4);
  const bin = atob(padded);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmac(dados: string, chave: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(chave),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(dados));
  return paraBase64Url(new Uint8Array(sig));
}

export async function criarSessao(): Promise<string | null> {
  const chave = secret();
  if (!chave) return null;
  const payload: PayloadSessao = { sub: "propostas", exp: Date.now() + SESSAO_MS };
  const corpo = paraBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const assinatura = await hmac(corpo, chave);
  return `${corpo}.${assinatura}`;
}

export async function sessaoValida(token: string | undefined | null): Promise<boolean> {
  const chave = secret();
  if (!chave || !token) return false;
  const partes = token.split(".");
  if (partes.length !== 2) return false;
  const [corpo, assinatura] = partes;
  if (!corpo || !assinatura) return false;
  const esperada = await hmac(corpo, chave);
  if (esperada.length !== assinatura.length) return false;
  let diff = 0;
  for (let i = 0; i < esperada.length; i++) {
    diff |= esperada.charCodeAt(i) ^ assinatura.charCodeAt(i);
  }
  if (diff !== 0) return false;
  try {
    const json = new TextDecoder().decode(deBase64Url(corpo));
    const payload = JSON.parse(json) as PayloadSessao;
    return payload.sub === "propostas" && typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export function opcoesCookie(maxAgeSegundos: number) {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSegundos,
  };
}
