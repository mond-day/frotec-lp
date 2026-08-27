/**
 * Gera public/media/coverage/route.mp4 a partir do mapa Leaflet animado.
 *
 * Uso:
 *   npm run generate:coverage-video
 *
 * Requer: playwright (chromium) + ffmpeg no PATH (ou FFMPEG_PATH).
 * Se ffmpeg não existir, o script baixa um binário estático (macOS) ou
 * documenta o fallback.
 */

import { spawn } from "node:child_process";
import { access, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const outDir = join(root, "public", "media", "coverage");
const outMp4 = join(outDir, "route.mp4");
const sourceHtml = pathToFileURL(join(__dirname, "coverage-map-source.html")).href;

const WIDTH = 1280;
const HEIGHT = 720;
const FPS = 15;
const DURATION_S = 6;
const TOTAL_FRAMES = FPS * DURATION_S;

async function resolveFfmpeg() {
  if (process.env.FFMPEG_PATH) return process.env.FFMPEG_PATH;

  for (const candidate of ["ffmpeg", "/tmp/ffmpeg-dl/ffmpeg", join(__dirname, ".tools", "ffmpeg")]) {
    try {
      if (candidate === "ffmpeg") {
        await run(candidate, ["-version"], { quiet: true });
        return candidate;
      }
      await access(candidate);
      return candidate;
    } catch {
      /* try next */
    }
  }
  return null;
}

function run(cmd, args, { quiet = false } = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(cmd, args, { stdio: quiet ? "ignore" : "inherit" });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolvePromise();
      else reject(new Error(`${cmd} exited ${code}`));
    });
  });
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

async function main() {
  const ffmpeg = await resolveFfmpeg();
  if (!ffmpeg) {
    console.error(`
ffmpeg não encontrado.

Opções:
  1) brew install ffmpeg
  2) Baixe um binário e exporte FFMPEG_PATH=/caminho/para/ffmpeg
  3) Fallback no site: CoverageSection usa animação CSS/Leaflet quando
     COVERAGE_HAS_VIDEO=false ou o vídeo falha no <video onError>.

Depois rode: npm run generate:coverage-video
`);
    process.exit(1);
  }

  await mkdir(outDir, { recursive: true });
  const framesDir = await mkdtemp(join(tmpdir(), "frotec-coverage-"));

  console.log("Abrindo mapa Leaflet…");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  });

  await page.goto(sourceHtml, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForFunction(() => window.__COVERAGE_READY__ === true, null, {
    timeout: 30000,
  });
  // Espera tiles carregarem
  await page.waitForTimeout(1800);

  const keyframes = [
    { center: [-12.4, -56.8], zoom: 6.2 }, // overview MT–RO
    { center: [-13.2, -55.9], zoom: 7.4 }, // eixo BR-163 sul→norte
    { center: [-11.86, -55.5], zoom: 8.2 }, // Sinop
    { center: [-10.6, -54.95], zoom: 7.6 }, // Guarantã
    { center: [-13.2, -58.5], zoom: 6.8 }, // ramal Vilhena
    { center: [-12.4, -56.8], zoom: 6.2 }, // overview final
  ];

  console.log(`Capturando ${TOTAL_FRAMES} frames…`);
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const t = i / (TOTAL_FRAMES - 1);
    const seg = t * (keyframes.length - 1);
    const idx = Math.min(keyframes.length - 2, Math.floor(seg));
    const local = easeInOut(seg - idx);
    const a = keyframes[idx];
    const b = keyframes[idx + 1];
    const lat = a.center[0] + (b.center[0] - a.center[0]) * local;
    const lng = a.center[1] + (b.center[1] - a.center[1]) * local;
    const zoom = a.zoom + (b.zoom - a.zoom) * local;

    await page.evaluate(
      ({ lat, lng, zoom }) => {
        window.__COVERAGE_MAP__.setView([lat, lng], zoom, { animate: false });
      },
      { lat, lng, zoom },
    );
    // pequeno settle para tiles
    if (i % 8 === 0) await page.waitForTimeout(40);

    const framePath = join(framesDir, `frame-${String(i).padStart(4, "0")}.png`);
    await page.screenshot({ path: framePath, type: "png" });
    if (i % 24 === 0) process.stdout.write(`  frame ${i}/${TOTAL_FRAMES}\n`);
  }

  await browser.close();

  console.log("Codificando MP4 com ffmpeg…");
  await run(ffmpeg, [
    "-y",
    "-framerate",
    String(FPS),
    "-i",
    join(framesDir, "frame-%04d.png"),
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-crf",
    "22",
    "-movflags",
    "+faststart",
    outMp4,
  ]);

  await rm(framesDir, { recursive: true, force: true });

  // Marker para documentação local
  await writeFile(
    join(outDir, "README.txt"),
    `route.mp4 gerado por scripts/generate-coverage-video.mjs\nDefina COVERAGE_HAS_VIDEO=true em lib/media.ts\n`,
    "utf8",
  );

  console.log(`✓ ${outMp4}`);
  console.log("Ative COVERAGE_HAS_VIDEO = true em lib/media.ts se ainda não estiver.");
}

main().catch(async (err) => {
  console.error(err);
  process.exit(1);
});
