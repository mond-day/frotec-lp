// Limite de tentativas de login por IP, em memória (uma instância standalone).
// Só falhas contam; um login válido zera o contador do IP.

const MAX_FALHAS = 5;
const JANELA_MS = 15 * 60 * 1000;

const falhas = new Map<string, { total: number; expiraEm: number }>();

export function ipDaRequisicao(request: Request): string {
  const encaminhado = request.headers.get("x-forwarded-for");
  if (encaminhado) return encaminhado.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "desconhecido";
}

/** Segundos até liberar, ou 0 se o IP pode tentar. */
export function segundosBloqueado(ip: string, agora = Date.now()): number {
  const registro = falhas.get(ip);
  if (!registro || registro.expiraEm <= agora) return 0;
  return registro.total >= MAX_FALHAS ? Math.ceil((registro.expiraEm - agora) / 1000) : 0;
}

export function registrarFalha(ip: string, agora = Date.now()): void {
  const registro = falhas.get(ip);
  if (!registro || registro.expiraEm <= agora) {
    falhas.set(ip, { total: 1, expiraEm: agora + JANELA_MS });
  } else {
    registro.total += 1;
  }
  if (falhas.size > 10_000) {
    for (const [chave, valor] of falhas) if (valor.expiraEm <= agora) falhas.delete(chave);
  }
}

export function limparFalhas(ip: string): void {
  falhas.delete(ip);
}
