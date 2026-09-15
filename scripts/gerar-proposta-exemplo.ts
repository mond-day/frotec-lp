import { mkdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { htmlParaPdf } from "../lib/pdf";
import { montarHtmlProposta } from "../lib/proposta-pdf-template";
import { type DadosProposta } from "../lib/proposta";

/** Dados exatamente como no main.pdf — o que não veio no documento fica em branco. */
const PROPOSTA_EXEMPLO: DadosProposta = {
  empresa: "Rodoamazonas",
  responsavel: "",
  cargo: "",
  email: "",
  whatsapp: "",
  rotas:
    "BR-163 — Sinop e região; demais trechos da BR-163; BR-364 e demais principais rotas nacionais",
  quantidade: "",
  faixa: "",
  valorVistoria: "340",
  aceiteVistoria: false,
  valorMensal: "4800",
  vigencia: "",
  validadeDias: "",
  dataProposta: "09/09/2026",
};

async function main() {
  const html = montarHtmlProposta(PROPOSTA_EXEMPLO);
  const pdf = await htmlParaPdf(html);
  const downloads = join(homedir(), "Downloads", "proposta-frotec-rodoamazonas.pdf");
  const publico = join(process.cwd(), "public", "proposta-frotec-rodoamazonas.pdf");
  mkdirSync(join(process.cwd(), "public"), { recursive: true });
  writeFileSync(downloads, pdf);
  writeFileSync(publico, pdf);
  console.log(downloads);
  console.log(publico);
}

main().catch((erro) => {
  console.error(erro);
  process.exit(1);
});
