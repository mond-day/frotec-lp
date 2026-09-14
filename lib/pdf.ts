import { existsSync } from "node:fs";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

function chromeLocal(): string | undefined {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }
  if (process.platform === "win32") {
    const candidatos = [
      "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
      "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    ];
    return candidatos.find((p) => existsSync(p));
  }
  return undefined;
}

export type OpcoesPdf = {
  cabecalhoHtml?: string;
  rodapeHtml?: string;
  margem?: { top: string; bottom: string; left: string; right: string };
};

export async function htmlParaPdf(html: string, opcoes?: OpcoesPdf): Promise<Buffer> {
  const local = chromeLocal();
  const browser = await puppeteer.launch({
    args: local ? ["--no-sandbox", "--disable-dev-shm-usage"] : chromium.args,
    defaultViewport: { width: 1200, height: 1600 },
    executablePath: local ?? (await chromium.executablePath()),
    headless: true,
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load", timeout: 120000 });
    await page.evaluate(() => document.fonts.ready);
    const comCabeca = Boolean(opcoes?.cabecalhoHtml || opcoes?.rodapeHtml);
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: !comCabeca,
      displayHeaderFooter: comCabeca,
      headerTemplate: opcoes?.cabecalhoHtml ?? "<div></div>",
      footerTemplate: opcoes?.rodapeHtml ?? "<div></div>",
      margin: opcoes?.margem,
      timeout: 120000,
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
