// scripts/capture.mjs
//
// Levanta la app (via la API de Vite, sin necesidad de tener `npm run dev`
// corriendo aparte), la abre con Chromium headless (Playwright) y genera:
//   - Capturas de escritorio y móvil (media/*.png)
//   - Un GIF corto mostrando las animaciones clave (media/demo.gif)
//
// Uso: npm run capture

import { createServer } from "vite";
import { chromium } from "playwright-core";
import ffmpegPath from "ffmpeg-static";
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "media");

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
};

function resetDir(dir) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
}

async function shot(page, name) {
  await page.screenshot({ path: path.join(OUT_DIR, `${name}.png`) });
  console.log("captura:", name);
}

async function loadMockApi(page, appUrl) {
  await page.goto(appUrl, { waitUntil: "networkidle" });
  await page.fill('input[type="text"]', new URL("mock-api.json", appUrl).toString());
  await page.click('button:has-text("Cargar documentación")');
  await page.waitForSelector("text=PetVerse API");
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Empareja el botón de endpoint exacto (método + path completo) por su
// nombre accesible, para no chocar con paths que comparten sufijo
// (ej. "/pets" vs "/owners/{ownerId}/pets").
function endpointButton(page, method, exactPath) {
  return page.getByRole("button", {
    name: new RegExp(`^${method}\\s+${escapeRegExp(exactPath)}$`, "i"),
  });
}

async function captureDesktop(browser, appUrl) {
  const context = await browser.newContext({ viewport: VIEWPORTS.desktop });
  const page = await context.newPage();

  await page.goto(appUrl, { waitUntil: "networkidle" });
  await shot(page, "desktop-01-loader");

  await loadMockApi(page, appUrl);
  await shot(page, "desktop-02-overview");

  await endpointButton(page, "POST", "/pets").click();
  await page.waitForTimeout(300);
  await shot(page, "desktop-03-endpoint-detail");

  await endpointButton(page, "DELETE", "/pets/{petId}").click();
  await page.waitForTimeout(300);
  await shot(page, "desktop-04-deprecated");

  await context.close();
}

async function captureMobile(browser, appUrl) {
  const context = await browser.newContext({
    viewport: VIEWPORTS.mobile,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  await page.goto(appUrl, { waitUntil: "networkidle" });
  await shot(page, "mobile-01-loader");

  await loadMockApi(page, appUrl);
  await shot(page, "mobile-02-overview");

  await page.click('button[aria-label="Abrir menú"]');
  await page.waitForTimeout(300);
  await shot(page, "mobile-03-drawer-open");

  await endpointButton(page, "GET", "/pets").click();
  await page.waitForTimeout(300);
  await shot(page, "mobile-04-endpoint-detail");

  await context.close();
}

async function captureGif(browser, appUrl) {
  const videoDir = path.join(OUT_DIR, "_video");
  resetDir(videoDir);

  const context = await browser.newContext({
    viewport: VIEWPORTS.desktop,
    recordVideo: { dir: videoDir, size: VIEWPORTS.desktop },
  });
  const page = await context.newPage();

  await loadMockApi(page, appUrl);

  await endpointButton(page, "GET", "/pets").click();
  await page.waitForTimeout(600);

  // colapsar / expandir parámetros
  await page.click('button:has-text("Parameters")');
  await page.waitForTimeout(500);
  await page.click('button:has-text("Parameters")');
  await page.waitForTimeout(500);

  // recorrer tabs de status code
  for (const status of ["400", "401", "500", "200"]) {
    await page.click(`button:has-text("${status}")`);
    await page.waitForTimeout(500);
  }

  // colapsar un grupo de tag en el sidebar
  await page.click("text=Owners");
  await page.waitForTimeout(500);
  await page.click("text=Owners");
  await page.waitForTimeout(500);

  const video = page.video();
  await context.close(); // finaliza el archivo de video
  const videoPath = await video.path();

  const gifPath = path.join(OUT_DIR, "demo.gif");
  const palette = path.join(videoDir, "palette.png");

  execFileSync(ffmpegPath, [
    "-y",
    "-i", videoPath,
    "-vf", "fps=12,scale=900:-1:flags=lanczos,palettegen",
    palette,
  ]);
  execFileSync(ffmpegPath, [
    "-y",
    "-i", videoPath,
    "-i", palette,
    "-lavfi", "fps=12,scale=900:-1:flags=lanczos[x];[x][1:v]paletteuse",
    gifPath,
  ]);

  rmSync(videoDir, { recursive: true, force: true });
  console.log("gif:", gifPath);
}

async function run() {
  resetDir(OUT_DIR);

  const server = await createServer({
    root: ROOT,
    logLevel: "error",
    server: { port: 5183, strictPort: true, host: "127.0.0.1" },
  });
  await server.listen();
  const appUrl = server.resolvedUrls.local[0];
  console.log("dev server:", appUrl);

  const browser = await chromium.launch();
  try {
    await captureDesktop(browser, appUrl);
    await captureMobile(browser, appUrl);
    await captureGif(browser, appUrl);
  } finally {
    await browser.close();
    await server.close();
  }

  console.log(`\nListo. Archivos generados en ${OUT_DIR}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
