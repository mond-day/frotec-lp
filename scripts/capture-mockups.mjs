/**
 * Captura mockups do portal a partir de HTML local (não roda no build de produção).
 *
 * Uso:
 *   MOCKUP_SOURCE_URL=file:///caminho/para/frotec_apresentacao.html \
 *   npm run capture:mockups
 *
 * Ou com o HTML embutido em scripts/mockup-source.html:
 *   npm run capture:mockups
 *
 * Requer: npx playwright (chromium)
 */

import { chromium } from "playwright";
import { mkdir, access, copyFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const outDir = join(root, "public", "mockups");

const defaultSource = pathToFileURL(join(__dirname, "mockup-source.html")).href;
const sourceUrl = process.env.MOCKUP_SOURCE_URL || defaultSource;
/** Captura a tela interna (sem chrome duplo no device frame do site). */
const desktopSelector =
  process.env.MOCKUP_SELECTOR_DESKTOP || "[data-mockup='desktop'] .web-screen, .web-screen";
const mobileSelector =
  process.env.MOCKUP_SELECTOR_MOBILE || "[data-mockup='mobile'], .phone-frame";

async function ensurePlaywright() {
  try {
    await access(join(root, "node_modules", "playwright"));
  } catch {
    console.error(
      "Playwright não instalado. Rode: npm i -D playwright && npx playwright install chromium",
    );
    process.exit(1);
  }
}

async function main() {
  await ensurePlaywright();
  await mkdir(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  // Desktop — área da tela do portal (16:9)
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.goto(sourceUrl, { waitUntil: "networkidle" });
    const el = page.locator(desktopSelector).first();
    await el.waitFor({ state: "visible", timeout: 15000 });
    const desktopPng = join(outDir, "portal-desktop.png");
    const desktopWebp = join(outDir, "portal-desktop.webp");
    await el.screenshot({ path: desktopPng, type: "png" });
    await copyFile(desktopPng, desktopWebp);
    console.log("✓ portal-desktop.png / .webp");
  }

  // Mobile — frame do app
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(sourceUrl, { waitUntil: "networkidle" });
    const el = page.locator(mobileSelector).first();
    await el.waitFor({ state: "visible", timeout: 15000 });
    await el.screenshot({ path: join(outDir, "portal-mobile.webp"), type: "png" });
    console.log("✓ portal-mobile.webp");
  }

  await browser.close();
  console.log("Mockups em public/mockups/. Não faz parte do build de produção.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
