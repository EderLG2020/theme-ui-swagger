// scripts/record-footage.mjs
//
// Graba clips reales de la app (no mockups) para usarlos como material
// dentro del video de Remotion (video/). Cada clip es un contexto de
// Playwright separado grabado a video/public/footage/*.webm.
//
// Uso: npm run footage

import { createServer } from "vite";
import { chromium } from "playwright-core";
import ffmpegPath from "ffmpeg-static";
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, renameSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const FOOTAGE_DIR = path.join(ROOT, "video", "public", "footage");

const DESKTOP = { width: 1920, height: 1080 };
const MOBILE = { width: 390, height: 844 };

function resetDir(dir) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function endpointButton(page, method, exactPath) {
  return page.getByRole("button", {
    name: new RegExp(`^${method}\\s+${escapeRegExp(exactPath)}$`, "i"),
  });
}

async function quickLoad(page, appUrl) {
  await page.goto(appUrl, { waitUntil: "networkidle" });
  await page.fill('input[type="text"]', new URL("mock-api.json", appUrl).toString());
  await page.click('button:has-text("Cargar documentación")');
  await page.waitForSelector("text=PetVerse API");
  await page.waitForTimeout(600);
}

// Graba `fn(page)` en un contexto nuevo y reencodea el .webm resultante
// a `footage/<name>.mp4` (H.264, framerate constante). Remotion's frame
// extractor no maneja bien el VP8/VFR que produce Playwright ("No frame
// found at position ..."), así que normalizamos con ffmpeg antes de usarlo.
async function record(browser, name, viewport, fn) {
  const tmpDir = path.join(FOOTAGE_DIR, `_tmp-${name}`);
  resetDir(tmpDir);

  const context = await browser.newContext({
    viewport,
    isMobile: viewport === MOBILE,
    hasTouch: viewport === MOBILE,
    recordVideo: { dir: tmpDir, size: viewport },
  });
  const page = await context.newPage();

  await fn(page);

  const video = page.video();
  await context.close();
  const rawPath = await video.path();

  const dest = path.join(FOOTAGE_DIR, `${name}.mp4`);
  execFileSync(ffmpegPath, [
    "-y",
    "-i", rawPath,
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-r", "30",
    "-movflags", "+faststart",
    dest,
  ]);

  rmSync(tmpDir, { recursive: true, force: true });
  console.log("footage:", dest);
}

async function run() {
  resetDir(FOOTAGE_DIR);

  const server = await createServer({
    root: ROOT,
    logLevel: "error",
    server: { port: 5184, strictPort: true, host: "127.0.0.1" },
  });
  await server.listen();
  const appUrl = server.resolvedUrls.local[0];
  console.log("dev server:", appUrl);

  const browser = await chromium.launch();

  try {
    // Warm-up: la primera petición a un servidor de Vite recién creado
    // compila todo bajo demanda y tarda varios segundos. Lo hacemos una
    // vez fuera de cualquier grabación para que los clips no arranquen
    // con tiempo muerto.
    {
      const warmupPage = await browser.newPage();
      await warmupPage.goto(appUrl, { waitUntil: "networkidle" });
      await warmupPage.close();
    }

    // 1) Cargar un JSON desde URL (escribiendo, como lo haría un usuario)
    await record(browser, "desktop-loader", DESKTOP, async (page) => {
      await page.goto(appUrl, { waitUntil: "networkidle" });
      await page.waitForTimeout(600);
      await page.click('input[type="text"]');
      await page.type(
        'input[type="text"]',
        new URL("mock-api.json", appUrl).toString(),
        { delay: 45 }
      );
      await page.waitForTimeout(400);
      await page.click('button:has-text("Cargar documentación")');
      await page.waitForSelector("text=PetVerse API");
      await page.waitForTimeout(1200);
    });

    // 2) Explorar endpoints: búsqueda, colapsar/expandir tag, distintos métodos
    await record(browser, "desktop-explore", DESKTOP, async (page) => {
      await quickLoad(page, appUrl);

      await page.click('input[placeholder="Buscar endpoint..."]');
      await page.type('input[placeholder="Buscar endpoint..."]', "pet", {
        delay: 90,
      });
      await page.waitForTimeout(1000);
      await page.fill('input[placeholder="Buscar endpoint..."]', "");
      await page.waitForTimeout(500);

      await page.click("text=Pets");
      await page.waitForTimeout(500);
      await page.click("text=Pets");
      await page.waitForTimeout(600);

      await endpointButton(page, "GET", "/pets/{petId}").click();
      await page.waitForTimeout(1800);

      await endpointButton(page, "POST", "/pets").click();
      await page.waitForTimeout(2200);

      await endpointButton(page, "DELETE", "/pets/{petId}").click();
      await page.waitForTimeout(2200);

      await endpointButton(page, "PATCH", "/pets/{petId}/status").click();
      await page.waitForTimeout(2000);
    });

    // 3) Respuestas: cambiar entre tabs de status code
    await record(browser, "desktop-responses", DESKTOP, async (page) => {
      await quickLoad(page, appUrl);
      await endpointButton(page, "GET", "/pets").click();
      await page.waitForTimeout(1200);

      for (const status of ["400", "401", "500", "200"]) {
        await page.click(`button:has-text("${status}")`);
        await page.waitForTimeout(1800);
      }
    });

    // 4) Móvil: drawer, selección de endpoint, scroll por el detalle
    await record(browser, "mobile-flow", MOBILE, async (page) => {
      await quickLoad(page, appUrl);

      await page.click('button[aria-label="Abrir menú"]');
      await page.waitForTimeout(1000);

      await endpointButton(page, "POST", "/owners").click();
      await page.waitForTimeout(1200);

      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(1400);
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(1600);
    });
  } finally {
    await browser.close();
    await server.close();
  }

  const files = readdirSync(FOOTAGE_DIR).filter((f) => f.endsWith(".mp4"));
  console.log(`\nListo. ${files.length} clips en ${FOOTAGE_DIR}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
