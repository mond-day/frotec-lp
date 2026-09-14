import { mkdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { CONTRATO_EXEMPLO } from "../lib/contrato";
import { montarHtmlContrato, templatesCabecalhoRodapeContrato } from "../lib/contrato-pdf-template";
import { htmlParaPdf } from "../lib/pdf";

async function main() {
  const html = montarHtmlContrato(CONTRATO_EXEMPLO);
  const { cabecalhoHtml, rodapeHtml } = templatesCabecalhoRodapeContrato();
  const pdf = await htmlParaPdf(html, {
    cabecalhoHtml,
    rodapeHtml,
    margem: { top: "18mm", bottom: "16mm", left: "16mm", right: "16mm" },
  });
  const downloads = join(homedir(), "Downloads", "contrato-frotec-exemplo.pdf");
  const publico = join(process.cwd(), "public", "contrato-frotec-exemplo.pdf");
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
