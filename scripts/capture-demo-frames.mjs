/**
 * Captura frames das telas do HTML de referência para a demo interativa.
 *
 * Uso:
 *   MOCKUP_SOURCE_URL=file:///caminho/para/frotec_apresentacao.html \
 *   npm run capture:demo-frames
 */

import { chromium } from "playwright";
import { access, mkdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const outDir = join(root, "public", "mockups", "demo");

const presentationPath =
  "/Users/mond.day/Desktop/Propostas/Frotec/frotec_apresentacao.html";
const defaultSource = pathToFileURL(join(__dirname, "mockup-source.html")).href;

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

const DESKTOP_SCREENS = [
  { go: "webGoTo(0)", file: "desktop-dashboard.png" },
  { go: "webGoTo(1)", file: "desktop-frota.png" },
  { go: "webGoTo(2)", file: "desktop-checklist.png" },
  { go: "webGoTo(3)", file: "desktop-os.png" },
];

const MOBILE_SCREENS = [
  { go: "mobileGoTo(0)", file: "mobile-checklist.png" },
  { go: "mobileGoTo(1)", file: "mobile-fotos.png" },
  { go: "mobileGoTo(2)", file: "mobile-risco.png" },
  { go: "mobileGoTo(3)", file: "mobile-laudo.png" },
];

async function main() {
  await mkdir(outDir, { recursive: true });

  let sourceUrl = process.env.MOCKUP_SOURCE_URL;
  if (!sourceUrl) {
    sourceUrl = (await exists(presentationPath))
      ? pathToFileURL(presentationPath).href
      : defaultSource;
  }
  console.log("Fonte:", sourceUrl);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  await page.goto(sourceUrl, { waitUntil: "networkidle", timeout: 60000 });

  await page.evaluate(() => {
    if (typeof window.goTo === "function") window.goTo(2);
    const slide = document.getElementById("slide-2");
    if (slide) {
      document.querySelectorAll(".slide").forEach((s) => s.classList.remove("active"));
      slide.classList.add("active");
    }
  });
  await page.waitForTimeout(500);

  const webScreen = page.locator(".web-screen").first();
  await webScreen.waitFor({ state: "visible", timeout: 15000 });

  for (const screen of DESKTOP_SCREENS) {
    await page.evaluate((expr) => {
      const fn = expr.startsWith("webGoTo")
        ? window.webGoTo
        : window.mobileGoTo;
      const n = Number(expr.match(/\((\d+)\)/)?.[1] ?? 0);
      if (typeof fn === "function") fn(n);
    }, screen.go);
    await page.waitForTimeout(300);
    await webScreen.screenshot({ path: join(outDir, screen.file), type: "png" });
    console.log("✓", screen.file);
  }

  const phoneFrame = page.locator(".phone-frame").first();
  await phoneFrame.waitFor({ state: "visible", timeout: 15000 });

  for (const screen of MOBILE_SCREENS) {
    await page.evaluate((expr) => {
      const n = Number(expr.match(/\((\d+)\)/)?.[1] ?? 0);
      if (typeof window.mobileGoTo === "function") window.mobileGoTo(n);
    }, screen.go);
    await page.waitForTimeout(300);
    await phoneFrame.screenshot({ path: join(outDir, screen.file), type: "png" });
    console.log("✓", screen.file);
  }

  await browser.close();
  console.log("Frames em public/mockups/demo/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
