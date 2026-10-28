export async function register() {
  // Bloco condicional (e não return antecipado): o bundle edge elimina os imports de módulos Node
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Padrão Sonder Corp: banner uma vez, console padronizado e access log com X-Request-ID
    const { startLogging } = await import("@/lib/logging");
    startLogging();
  }
}
