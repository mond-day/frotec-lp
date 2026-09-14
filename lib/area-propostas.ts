import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_PROPOSTAS, sessaoValida } from "./auth";

/** Redireciona para o login se o cookie da área /propostas não for válido. */
export async function exigirSessaoPropostas(proxima: string): Promise<void> {
  const jar = await cookies();
  if (await sessaoValida(jar.get(COOKIE_PROPOSTAS)?.value)) return;
  const dest = proxima.startsWith("/propostas") ? proxima : "/propostas";
  redirect(`/propostas/login?next=${encodeURIComponent(dest)}`);
}
