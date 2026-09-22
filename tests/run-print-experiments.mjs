import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createServer } from "node:http";
import { readFile, mkdir, rm, writeFile, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { chromium, firefox, webkit } from "playwright";

const root = resolve(new URL("..", import.meta.url).pathname);
const outputDir = resolve(root, "test-results/print-experiments");
const tolerancePx = 0.75;

const results = {
  experiment: "PAGINATION-01 + MARGIN-01",
  status: "running",
  observedAt: new Date().toISOString(),
  limitations: [
    "Firefox and WebKit are compared under print media for DOM/layout equivalence, but Playwright does not expose their native paginated PDF output.",
    "Chromium PDF assertions validate this controlled fixture, not every possible custom-element composition.",
  ],
  pagination: {
    printMediaEquivalence: {},
    chromiumPdf: {},
  },
  margin: {},
  columns: {},
  sidebar: {},
  table: {},
};

function mimeType(path) {
  switch (extname(path)) {
    case ".html": return "text/html; charset=utf-8";
    case ".css": return "text/css; charset=utf-8";
    case ".js":
    case ".mjs": return "text/javascript; charset=utf-8";
    case ".json": return "application/json; charset=utf-8";
    default: return "application/octet-stream";
  }
}

async function startServer() {
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url ?? "/", "http://127.0.0.1");
      const relativePath = decodeURIComponent(url.pathname).replace(/^\/+/, "");
      const filePath = resolve(root, relativePath || "README.md");
      if (filePath !== root && !filePath.startsWith(root + sep)) {
        response.writeHead(403);
        response.end("Forbidden");
        return;
      }

      const info = await stat(filePath);
      if (!info.isFile()) throw new Error("Not a file");
      const body = await readFile(filePath);
      response.writeHead(200, { "content-type": mimeType(filePath) });
      response.end(body);
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
  return {
    server,
    baseUrl: `http://127.0.0.1:${address.port}`,
  };
}

async function waitForDocument(page, component = false) {
  await page.waitForLoadState("networkidle");
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
  if (component) {
    await page.evaluate(async () => {
      await customElements.whenDefined("ef-print-document");
    });
  }
}

async function collectPrintLayout(browserType, browserName, baseUrl, fixturePath, component) {
  const browser = await browserType.launch();
  const version = browser.version();
  const page = await browser.newPage({ viewport: { width: 816, height: 1056 } });
  await page.emulateMedia({ media: "print" });
  await page.goto(`${baseUrl}/${fixturePath}`);
  await waitForDocument(page, component);

  const layout = await page.evaluate(() => {
    const probes = [...document.querySelectorAll("[data-probe]")].map((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        id: element.getAttribute("data-probe"),
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        display: style.display,
        breakInside: style.breakInside,
        breakBefore: style.breakBefore,
        breakAfter: style.breakAfter,
      };
    });

    return {
      text: document.querySelector("[data-document-kind]")?.innerText.replace(/\s+/g, " ").trim(),
      scrollHeight: document.documentElement.scrollHeight,
      scrollWidth: document.documentElement.scrollWidth,
      probes,
    };
  });

  await browser.close();
  return { browserName, version, layout };
}

function compareLayouts(nativeResult, componentResult) {
  assert.equal(componentResult.layout.text, nativeResult.layout.text, "Meaningful text changed between fixtures");
  assert.equal(componentResult.layout.probes.length, nativeResult.layout.probes.length, "Probe count differs");
  assert.ok(
    Math.abs(componentResult.layout.scrollHeight - nativeResult.layout.scrollHeight) <= tolerancePx,
    `Document height differs: native=${nativeResult.layout.scrollHeight}, component=${componentResult.layout.scrollHeight}`,
  );

  const differences = [];
  for (let index = 0; index < nativeResult.layout.probes.length; index += 1) {
    const expected = nativeResult.layout.probes[index];
    const actual = componentResult.layout.probes[index];
    assert.equal(actual.id, expected.id, "Probe order/id differs");
    assert.equal(actual.display, expected.display, `${expected.id}: display differs`);
    assert.equal(actual.breakInside, expected.breakInside, `${expected.id}: break-inside differs`);
    assert.equal(actual.breakBefore, expected.breakBefore, `${expected.id}: break-before differs`);
    assert.equal(actual.breakAfter, expected.breakAfter, `${expected.id}: break-after differs`);

    for (const field of ["x", "y", "width", "height"]) {
      const delta = Math.abs(actual[field] - expected[field]);
      differences.push({ id: expected.id, field, delta });
      assert.ok(delta <= tolerancePx, `${expected.id}: ${field} delta ${delta}px exceeds ${tolerancePx}px`);
    }
  }

  return {
    maxGeometryDeltaPx: Math.max(0, ...differences.map((item) => item.delta)),
    probeCount: nativeResult.layout.probes.length,
    documentHeightPx: nativeResult.layout.scrollHeight,
  };
}

function pdfInfo(path) {
  const info = execFileSync("pdfinfo", [path], { encoding: "utf8" });
  const pagesMatch = info.match(/^Pages:\s+(\d+)/m);
  const sizeMatch = info.match(/^Page size:\s+(.+)$/m);
  if (!pagesMatch) throw new Error(`Unable to read page count from ${path}`);
  return {
    pages: Number(pagesMatch[1]),
    pageSize: sizeMatch?.[1]?.trim() ?? null,
  };
}

function pdfText(path) {
  return execFileSync("pdftotext", ["-layout", path, "-"], { encoding: "utf8" });
}

function pdfPagesText(path) {
  const pages = pdfText(path).split("\f").map((page) => normalizeText(page));
  while (pages.length && pages.at(-1) === "") pages.pop();
  return pages;
}

function pageContaining(pages, needle) {
  const matches = pages
    .map((page, index) => page.includes(needle) ? index + 1 : null)
    .filter(Boolean);
  assert.equal(matches.length, 1, `Expected "${needle}" on exactly one page, observed on ${matches.join(", ") || "none"}`);
  return matches[0];
}

function assertMarkerOnce(text, marker) {
  assert.equal(occurrenceCount(text, marker), 1, `Expected marker ${marker} exactly once`);
}

function assertPairOnSamePage(pages, start, end) {
  const startPage = pageContaining(pages, start);
  const endPage = pageContaining(pages, end);
  assert.equal(endPage, startPage, `${start}/${end} split across pages ${startPage} and ${endPage}`);
  return startPage;
}

function pdfBboxPages(path) {
  const raw = execFileSync("pdftotext", ["-bbox", path, "-"], { encoding: "utf8" });
  const pages = [];
  const pageRegex = /<page width="([^"]+)" height="([^"]+)">([\s\S]*?)<\/page>/g;
  for (const pageMatch of raw.matchAll(pageRegex)) {
    const words = [];
    const wordRegex = /<word xMin="([^"]+)" yMin="([^"]+)" xMax="([^"]+)" yMax="([^"]+)">([^<]*)<\/word>/g;
    for (const wordMatch of pageMatch[3].matchAll(wordRegex)) {
      words.push({
        xMin: Number(wordMatch[1]),
        yMin: Number(wordMatch[2]),
        xMax: Number(wordMatch[3]),
        yMax: Number(wordMatch[4]),
        text: wordMatch[5],
      });
    }
    pages.push({ width: Number(pageMatch[1]), height: Number(pageMatch[2]), words });
  }
  return pages;
}

function pdfPageSize(path, pageNumber) {
  const info = execFileSync("pdfinfo", ["-f", String(pageNumber), "-l", String(pageNumber), path], { encoding: "utf8" });
  const match = info.match(/^Page\s+\d+\s+size:\s+(.+)$/m) ?? info.match(/^Page size:\s+(.+)$/m);
  if (!match) throw new Error(`Unable to read page ${pageNumber} size from ${path}`);
  return match[1].trim();
}

function normalizeText(value) {
  return value.replace(/\f/g, " ").replace(/\s+/g, " ").trim();
}

function occurrenceCount(value, needle) {
  return value.split(needle).length - 1;
}

async function renderChromiumPdf(baseUrl, fixturePath, outputPath) {
  const browser = await chromium.launch();
  const version = browser.version();
  const page = await browser.newPage();
  await page.emulateMedia({ media: "print" });
  await page.goto(`${baseUrl}/${fixturePath}`);
  await waitForDocument(page, fixturePath.includes("component.html"));
  await page.pdf({
    path: outputPath,
    preferCSSPageSize: true,
    printBackground: true,
    displayHeaderFooter: false,
  });
  await browser.close();
  return version;
}

async function run() {
  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });

  const { server, baseUrl } = await startServer();
  try {
    const browsers = [
      ["chromium", chromium],
      ["firefox", firefox],
      ["webkit", webkit],
    ];

    for (const [browserName, browserType] of browsers) {
      const nativeResult = await collectPrintLayout(
        browserType,
        browserName,
        baseUrl,
        "tests/fixtures/pagination/native.html",
        false,
      );
      const componentResult = await collectPrintLayout(
        browserType,
        browserName,
        baseUrl,
        "tests/fixtures/pagination/component.html",
        true,
      );
      const comparison = compareLayouts(nativeResult, componentResult);
      results.pagination.printMediaEquivalence[browserName] = {
        browserVersion: nativeResult.version,
        ...comparison,
      };
    }

    const nativePdf = resolve(outputDir, "pagination-native.pdf");
    const componentPdf = resolve(outputDir, "pagination-component.pdf");
    const chromiumVersion = await renderChromiumPdf(
      baseUrl,
      "tests/fixtures/pagination/native.html",
      nativePdf,
    );
    await renderChromiumPdf(
      baseUrl,
      "tests/fixtures/pagination/component.html",
      componentPdf,
    );

    const nativeInfo = pdfInfo(nativePdf);
    const componentInfo = pdfInfo(componentPdf);
    assert.equal(componentInfo.pages, nativeInfo.pages, "Chromium PDF page count differs");
    assert.equal(componentInfo.pageSize, nativeInfo.pageSize, "Chromium PDF page size differs");

    const nativeText = normalizeText(pdfText(nativePdf));
    const componentText = normalizeText(pdfText(componentPdf));
    assert.equal(componentText, nativeText, "Chromium extracted PDF text differs");

    results.pagination.chromiumPdf = {
      browserVersion: chromiumVersion,
      nativePages: nativeInfo.pages,
      componentPages: componentInfo.pages,
      pageSize: nativeInfo.pageSize,
      normalizedTextEquivalent: true,
    };

    const marginPdf = resolve(outputDir, "margin-01.pdf");
    const marginChromiumVersion = await renderChromiumPdf(
      baseUrl,
      "tests/fixtures/margin/margin.html",
      marginPdf,
    );
    const marginInfo = pdfInfo(marginPdf);
    const marginText = normalizeText(pdfText(marginPdf));

    assert.equal(marginInfo.pages, 4, `Expected 4 pages, observed ${marginInfo.pages}`);
    assert.equal(
      occurrenceCount(marginText, "EPC Margin Experiment"),
      3,
      "Running top-left header did not appear exactly on the three body pages",
    );
    assert.equal(
      occurrenceCount(marginText, "MARGIN-01"),
      4,
      "Expected one title occurrence plus three running top-right occurrences",
    );
    assert.equal(
      occurrenceCount(marginText, "Confidential"),
      3,
      "Running bottom-left footer did not appear exactly on the three body pages",
    );

    for (const expected of ["Page 2 of 4", "Page 3 of 4", "Page 4 of 4"]) {
      assert.ok(marginText.includes(expected), `Missing expected counter text: ${expected}`);
    }
    assert.ok(!marginText.includes("Page 1 of 4"), "Title page should suppress the page counter");

    results.margin = {
      browserVersion: marginChromiumVersion,
      pages: marginInfo.pages,
      pageSize: marginInfo.pageSize,
      runningHeaderBodyPageCount: occurrenceCount(marginText, "EPC Margin Experiment"),
      runningFooterBodyPageCount: occurrenceCount(marginText, "Confidential"),
      countersObserved: ["Page 2 of 4", "Page 3 of 4", "Page 4 of 4"],
      titlePageCounterSuppressed: true,
    };

    const columnsPdf = resolve(outputDir, "columns-01.pdf");
    const columnsChromiumVersion = await renderChromiumPdf(
      baseUrl,
      "tests/fixtures/columns/columns.html",
      columnsPdf,
    );
    const columnsInfo = pdfInfo(columnsPdf);
    const columnsText = normalizeText(pdfText(columnsPdf));
    const columnsPages = pdfPagesText(columnsPdf);
    assert.ok(columnsInfo.pages >= 2, `Expected columns fixture to span at least 2 pages, observed ${columnsInfo.pages}`);
    assertMarkerOnce(columnsText, "COL-SPAN-MARKER");
    const keptColumnPages = [];
    for (let index = 1; index <= 18; index += 1) {
      const id = String(index).padStart(2, "0");
      const start = `COL-${id}-START`;
      const end = `COL-${id}-END`;
      assertMarkerOnce(columnsText, start);
      assertMarkerOnce(columnsText, end);
      keptColumnPages.push(assertPairOnSamePage(columnsPages, start, end));
    }
    results.columns = {
      browserVersion: columnsChromiumVersion,
      pages: columnsInfo.pages,
      pageSize: columnsInfo.pageSize,
      keptBlockCount: 18,
      keptBlocksSplitAcrossPages: 0,
      columnSpanMarkerPresent: true,
      blockPages: keptColumnPages,
    };

    const sidebarPdf = resolve(outputDir, "sidebar-01.pdf");
    const sidebarChromiumVersion = await renderChromiumPdf(
      baseUrl,
      "tests/fixtures/sidebar/sidebar.html",
      sidebarPdf,
    );
    const sidebarInfo = pdfInfo(sidebarPdf);
    const sidebarText = normalizeText(pdfText(sidebarPdf));
    assert.ok(sidebarInfo.pages >= 2, `Expected sidebar fixture to span at least 2 pages, observed ${sidebarInfo.pages}`);
    for (let index = 1; index <= 10; index += 1) {
      assertMarkerOnce(sidebarText, `MAIN-${String(index).padStart(2, "0")}`);
    }
    for (let index = 1; index <= 4; index += 1) {
      assertMarkerOnce(sidebarText, `SIDE-${String(index).padStart(2, "0")}`);
    }
    const bboxPages = pdfBboxPages(sidebarPdf);
    let pagesWithBothColumns = 0;
    let minimumHorizontalGapPt = Number.POSITIVE_INFINITY;
    for (const page of bboxPages) {
      const mainWords = page.words.filter((word) => /^MAIN-\d{2}$/.test(word.text));
      const sideWords = page.words.filter((word) => /^SIDE-\d{2}$/.test(word.text));
      if (mainWords.length && sideWords.length) {
        pagesWithBothColumns += 1;
        const maxMainX = Math.max(...mainWords.map((word) => word.xMax));
        const minSideX = Math.min(...sideWords.map((word) => word.xMin));
        const gap = minSideX - maxMainX;
        minimumHorizontalGapPt = Math.min(minimumHorizontalGapPt, gap);
        assert.ok(gap > 6, `Sidebar/main marker columns overlap or are too close: gap=${gap}pt`);
      }
    }
    assert.ok(pagesWithBothColumns >= 1, "No page contained both main and sidebar markers for separation analysis");
    results.sidebar = {
      browserVersion: sidebarChromiumVersion,
      pages: sidebarInfo.pages,
      pageSize: sidebarInfo.pageSize,
      mainMarkers: 10,
      sidebarMarkers: 4,
      pagesWithBothColumns,
      minimumHorizontalGapPt,
      allMarkerTextPreserved: true,
    };

    const tablePdf = resolve(outputDir, "table-01.pdf");
    const tableChromiumVersion = await renderChromiumPdf(
      baseUrl,
      "tests/fixtures/table/table.html",
      tablePdf,
    );
    const tableInfo = pdfInfo(tablePdf);
    const tableRawText = pdfText(tablePdf);
    const tableText = normalizeText(tableRawText);
    const tablePages = tableRawText.split("\f").map((page) => normalizeText(page)).filter(Boolean);
    for (let index = 1; index <= 72; index += 1) {
      assertMarkerOnce(tableText, `ROW-${String(index).padStart(3, "0")}`);
    }
    for (let index = 1; index <= 12; index += 1) {
      assertMarkerOnce(tableText, `WIDE-ROW-${String(index).padStart(2, "0")}`);
    }
    const portraitRowPages = tablePages
      .map((page, index) => page.includes("ROW-") && !page.includes("WIDE-ROW-") ? index + 1 : null)
      .filter(Boolean);
    assert.ok(portraitRowPages.length >= 2, "Portrait table did not span at least two pages");
    for (const pageNumber of portraitRowPages) {
      assert.ok(tablePages[pageNumber - 1].includes("PORTRAIT-HEADER-ROWID"), `Repeated table header missing on page ${pageNumber}`);
    }
    const widePageNumber = pageContaining(tablePages, "WIDE-SECTION-MARKER");
    const widePageSize = pdfPageSize(tablePdf, widePageNumber);
    assert.ok(/792\s+x\s+612/.test(widePageSize), `Wide named page is not Letter landscape: ${widePageSize}`);
    results.table = {
      browserVersion: tableChromiumVersion,
      pages: tableInfo.pages,
      portraitRowCount: 72,
      portraitPagesWithRows: portraitRowPages,
      repeatedHeaderPages: portraitRowPages.length,
      wideRowCount: 12,
      widePageNumber,
      widePageSize,
      allMarkerTextPreserved: true,
    };

    results.status = "passed";
  } finally {
    await new Promise((resolvePromise) => server.close(resolvePromise));
  }
}

try {
  await run();
} catch (error) {
  results.status = "failed";
  results.error = error instanceof Error ? { message: error.message, stack: error.stack } : { message: String(error) };
  process.exitCode = 1;
} finally {
  results.completedAt = new Date().toISOString();
  await mkdir(outputDir, { recursive: true });
  await writeFile(resolve(outputDir, "results.json"), JSON.stringify(results, null, 2) + "\n");
  console.log(JSON.stringify(results, null, 2));
}
