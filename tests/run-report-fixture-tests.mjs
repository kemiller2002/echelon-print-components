import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createServer } from "node:http";
import { mkdir, readFile, rm, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { chromium } from "playwright";

const root = resolve(new URL("..", import.meta.url).pathname);
const outputDir = resolve(root, "test-results/report-fixture");
const fixturePath = "tests/fixtures/reports/signal-results.html";

function mimeType(path) {
  if (path.endsWith(".html")) return "text/html; charset=utf-8";
  if (path.endsWith(".css")) return "text/css; charset=utf-8";
  if (path.endsWith(".js") || path.endsWith(".mjs")) return "text/javascript; charset=utf-8";
  return "application/octet-stream";
}

async function startServer() {
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url ?? "/", "http://127.0.0.1");
      const relative = decodeURIComponent(url.pathname).replace(/^\/+/, "");
      const filePath = resolve(root, relative || "README.md");
      if (filePath !== root && !filePath.startsWith(root + sep)) {
        response.writeHead(403);
        response.end("Forbidden");
        return;
      }
      const info = await stat(filePath);
      if (!info.isFile()) throw new Error("Not a file");
      response.writeHead(200, {"content-type": mimeType(filePath)});
      response.end(await readFile(filePath));
    } catch {
      response.writeHead(404);
      response.end("Not found");
    }
  });

  await new Promise((resolvePromise, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolvePromise);
  });

  const address = server.address();
  assert(address && typeof address === "object");
  return {server, baseUrl: `http://127.0.0.1:${address.port}`};
}

function pdfText(path) {
  return execFileSync("pdftotext", ["-layout", path, "-"], {encoding: "utf8"});
}

function normalizeText(value) {
  return value.replace(/\f/g, " ").replace(/\s+/g, " ").trim();
}

function pdfInfo(path) {
  const info = execFileSync("pdfinfo", [path], {encoding: "utf8"});
  const pages = Number(info.match(/^Pages:\s+(\d+)/m)?.[1] ?? 0);
  const size = info.match(/^Page size:\s+(.+)$/m)?.[1]?.trim() ?? "";
  return {pages, size};
}

function pageTexts(path) {
  const pages = pdfText(path).split("\f").map(normalizeText);
  while (pages.length && pages.at(-1) === "") pages.pop();
  return pages;
}

function pageContaining(pages, marker) {
  const matches = pages.map((page, index) => page.includes(marker) ? index + 1 : null).filter(Boolean);
  assert.equal(matches.length, 1, `Expected ${marker} on exactly one page, got ${matches.join(", ") || "none"}`);
  return matches[0];
}

function pageSize(path, pageNumber) {
  const info = execFileSync("pdfinfo", ["-f", String(pageNumber), "-l", String(pageNumber), path], {encoding: "utf8"});
  const match = info.match(/^Page\s+\d+\s+size:\s+([\d.]+) x ([\d.]+) pts/m) ?? info.match(/^Page size:\s+([\d.]+) x ([\d.]+) pts/m);
  if (!match) throw new Error(`Unable to parse page size for page ${pageNumber}`);
  return {width: Number(match[1]), height: Number(match[2])};
}

async function render(baseUrl, outputPath, {a4 = false, grayscale = false, printBackground = true} = {}) {
  const browser = await chromium.launch();
  const version = browser.version();
  const page = await browser.newPage({viewport: {width: 1100, height: 900}});
  await page.emulateMedia({media: "print"});
  await page.goto(`${baseUrl}/${fixturePath}`);
  await page.waitForLoadState("networkidle");
  await page.evaluate(async () => {
    await customElements.whenDefined("ef-print-finding");
    if (document.fonts?.ready) await document.fonts.ready;
  });

  if (a4) {
    await page.addStyleTag({content: `
      @page signal-cover { size: A4 portrait; }
      @page signal-body { size: A4 portrait; }
      @page signal-wide { size: A4 landscape; }
    `});
  }

  if (grayscale) {
    await page.evaluate(() => document.body.dataset.printMode = "grayscale");
  }

  const dom = await page.evaluate(() => {
    const required = ["ef-print-metric", "ef-print-integrity", "ef-print-finding"];
    const reportBlocks = [...document.querySelectorAll("[data-report-block]")];
    const root = document.documentElement;
    const radar = document.querySelector(".signal-radar svg");
    const equivalent = document.querySelector("table[aria-label='Textual equivalent of the delivery profile radar']");
    return {
      upgraded: required.every(tag => Boolean(customElements.get(tag))),
      reportBlockCount: reportBlocks.length,
      pageOverflow: root.scrollWidth > root.clientWidth + 1,
      radarHasAccessibleName: Boolean(radar?.querySelector("title") && radar?.querySelector("desc")),
      radarHasTextEquivalent: Boolean(equivalent),
      suppressedLeak: document.body.innerText.includes("SUPPRESSED-ROLE-VALUE"),
      printMode: document.body.dataset.printMode,
      integrityDisplay: getComputedStyle(document.querySelector("ef-print-integrity")).display,
      findingDisplay: getComputedStyle(document.querySelector("ef-print-finding")).display
    };
  });

  assert.equal(dom.upgraded, true, "Report-specific components upgrade");
  assert.ok(dom.reportBlockCount >= 8, "Canonical report has the expected major blocks");
  assert.equal(dom.pageOverflow, false, "Canonical report has no page-level DOM overflow");
  assert.equal(dom.radarHasAccessibleName, true, "Radar has title and description");
  assert.equal(dom.radarHasTextEquivalent, true, "Radar has a tabular text equivalent");
  assert.equal(dom.suppressedLeak, false, "Suppressed sentinel data is not present");
  assert.equal(dom.integrityDisplay, "block");
  assert.equal(dom.findingDisplay, "block");
  if (grayscale) assert.equal(dom.printMode, "grayscale");

  await page.pdf({
    path: outputPath,
    preferCSSPageSize: true,
    printBackground,
    displayHeaderFooter: false
  });
  await browser.close();
  return version;
}

await rm(outputDir, {recursive: true, force: true});
await mkdir(outputDir, {recursive: true});

const {server, baseUrl} = await startServer();
try {
  const letter = resolve(outputDir, "signal-results-letter.pdf");
  const a4 = resolve(outputDir, "signal-results-a4.pdf");
  const grayscale = resolve(outputDir, "signal-results-grayscale.pdf");
  const noBackground = resolve(outputDir, "signal-results-backgrounds-off.pdf");

  const rendererVersion = await render(baseUrl, letter);
  await render(baseUrl, a4, {a4: true});
  await render(baseUrl, grayscale, {grayscale: true});
  await render(baseUrl, noBackground, {printBackground: false});

  const letterInfo = pdfInfo(letter);
  const a4Info = pdfInfo(a4);
  assert.ok(letterInfo.pages >= 7, `Expected a substantive multipage Letter report, got ${letterInfo.pages}`);
  assert.ok(a4Info.pages >= 7, `Expected a substantive multipage A4 report, got ${a4Info.pages}`);

  const letterFirst = pageSize(letter, 1);
  const a4First = pageSize(a4, 1);
  assert.ok(Math.abs(letterFirst.width - 612) < 2 && Math.abs(letterFirst.height - 792) < 2, `Unexpected Letter cover size: ${letterFirst.width}x${letterFirst.height}`);
  assert.ok(Math.abs(a4First.width - 595) < 3 && Math.abs(a4First.height - 842) < 3, `Unexpected A4 cover size: ${a4First.width}x${a4First.height}`);

  const letterPages = pageTexts(letter);
  const widePage = pageContaining(letterPages, "SIGNAL-WIDE-COMPARISON");
  const wideSize = pageSize(letter, widePage);
  assert.ok(wideSize.width > wideSize.height, `Comparison page is not landscape: ${wideSize.width}x${wideSize.height}`);

  const a4Pages = pageTexts(a4);
  const a4WidePage = pageContaining(a4Pages, "SIGNAL-WIDE-COMPARISON");
  const a4WideSize = pageSize(a4, a4WidePage);
  assert.ok(a4WideSize.width > a4WideSize.height, "A4 comparison page is not landscape");

  const essentialMarkers = [
    "SIGNAL-COVER",
    "SIGNAL-TOC",
    "SIGNAL-SUMMARY",
    "SIGNAL-INTEGRITY",
    "SIGNAL-PROFILE",
    "SIGNAL-RADAR-TABLE",
    "SIGNAL-DIMENSIONS",
    "SIGNAL-FINDINGS",
    "SIGNAL-DISTRIBUTIONS",
    "SIGNAL-WIDE-COMPARISON",
    "SIGNAL-METHODOLOGY",
    "SIGNAL-PSYCHOMETRIC-LIMIT"
  ];

  const letterText = normalizeText(pdfText(letter));
  const a4Text = normalizeText(pdfText(a4));
  const grayText = normalizeText(pdfText(grayscale));
  const noBackgroundText = normalizeText(pdfText(noBackground));
  for (const marker of essentialMarkers) {
    assert.ok(letterText.includes(marker), `Letter report missing ${marker}`);
    assert.ok(a4Text.includes(marker), `A4 report missing ${marker}`);
    assert.ok(grayText.includes(marker), `Grayscale report missing ${marker}`);
    assert.ok(noBackgroundText.includes(marker), `Backgrounds-off report missing ${marker}`);
  }

  assert.equal(noBackgroundText, letterText, "Disabling backgrounds changed essential extracted report text");
  assert.equal(grayText, letterText, "Grayscale mode changed essential extracted report text");

  assert.ok(!letterText.includes("Page 1 of"), "Cover should suppress running page counter");
  assert.ok(letterText.includes(`Page 2 of ${letterInfo.pages}`), "Body report is missing P1/P2 Page 2 of Y counter");
  assert.ok(letterText.includes(`Page ${letterInfo.pages} of ${letterInfo.pages}`), "Last page is missing Page X of Y counter");

  console.log(JSON.stringify({
    status: "passed",
    rendererVersion,
    letterPages: letterInfo.pages,
    a4Pages: a4Info.pages,
    widePage,
    a4WidePage,
    grayscaleTextEquivalent: true,
    backgroundsOffTextEquivalent: true,
    radarTextEquivalent: true
  }, null, 2));
} finally {
  await new Promise(resolvePromise => server.close(resolvePromise));
}
