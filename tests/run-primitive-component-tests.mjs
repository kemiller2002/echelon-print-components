import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { chromium, firefox, webkit } from "playwright";
import { elementNames as registeredElementNames } from "../src/components/register.js";

const root = process.cwd();
const fixture = "/tests/fixtures/primitives/primitives.html";
const expectedElements = [
  "ef-print-document",
  "ef-print-title-page",
  "ef-print-section",
  "ef-print-back-page",
  "ef-print-header",
  "ef-print-footer",
  "ef-print-page-number",
  "ef-print-columns",
  "ef-print-sidebar",
  "ef-print-layer",
  "ef-print-break",
  "ef-print-keep",
  "ef-print-callout",
  "ef-print-figure",
  "ef-print-table",
  "ef-print-code",
  "ef-print-toc",
  "ef-print-note",
];

assert.deepEqual(registeredElementNames, expectedElements, "Node-safe module import exposes the complete public registry");

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
};

function serve() {
  return new Promise(resolve => {
    const server = http.createServer((request, response) => {
      const url = new URL(request.url, "http://127.0.0.1");
      const target = path.normalize(path.join(root, decodeURIComponent(url.pathname)));
      if (!target.startsWith(root) || !fs.existsSync(target) || fs.statSync(target).isDirectory()) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }
      response.writeHead(200, { "content-type": mime[path.extname(target)] ?? "application/octet-stream" });
      fs.createReadStream(target).pipe(response);
    });
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      resolve({ server, baseURL: `http://127.0.0.1:${address.port}` });
    });
  });
}

const { server, baseURL } = await serve();

try {
  for (const [name, engine] of [["chromium", chromium], ["firefox", firefox], ["webkit", webkit]]) {
    const browser = await engine.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1024, height: 900 } });
    await page.goto(baseURL + fixture);
    await page.waitForLoadState("networkidle");
    await page.evaluate(async () => customElements.whenDefined("ef-print-note"));

    const registration = await page.evaluate(names => names.map(tag => [tag, Boolean(customElements.get(tag))]), expectedElements);
    assert.deepEqual(registration, expectedElements.map(tag => [tag, true]), `${name}: all public elements upgrade`);

    const styles = await page.evaluate(() => {
      const value = selector => {
        const element = document.querySelector(selector);
        const style = getComputedStyle(element);
        return {
          display: style.display,
          position: style.position,
          breakInside: style.breakInside,
          whiteSpace: style.whiteSpace,
          overflowX: style.overflowX,
          opacity: style.opacity,
        };
      };
      return {
        header: value("ef-print-header"),
        footer: value("ef-print-footer"),
        pageNumber: value("ef-print-page-number"),
        layer: value("ef-print-layer"),
        callout: value("ef-print-callout"),
        figure: value("ef-print-figure"),
        table: value("ef-print-table"),
        code: value("ef-print-code pre"),
        toc: value("ef-print-toc"),
        note: value("ef-print-note"),
        thead: getComputedStyle(document.querySelector("ef-print-table thead")).display,
        rowBreak: getComputedStyle(document.querySelector("ef-print-table tbody tr")).breakInside,
      };
    });

    assert.equal(styles.header.display, "grid", `${name}: header uses in-flow grid`);
    assert.equal(styles.footer.display, "grid", `${name}: footer uses in-flow grid`);
    assert.equal(styles.pageNumber.display, "inline", `${name}: page number remains inline intent`);
    assert.equal(styles.layer.position, "absolute", `${name}: artwork layer is out of flow`);
    assert.equal(styles.layer.opacity, "0.25", `${name}: artwork opacity token applies independently`);
    assert.equal(styles.callout.breakInside, "avoid", `${name}: callout requests keep-together`);
    assert.equal(styles.figure.breakInside, "avoid", `${name}: figure requests keep-together`);
    assert.equal(styles.thead, "table-header-group", `${name}: table header repetition intent is preserved`);
    assert.equal(styles.rowBreak, "avoid", `${name}: table rows request no split`);
    assert.equal(styles.code.whiteSpace, "pre-wrap", `${name}: code wraps for print safety`);
    assert.equal(styles.toc.display, "block", `${name}: TOC is a passive block wrapper`);
    assert.equal(styles.note.breakInside, "avoid", `${name}: note requests keep-together`);

    await page.setViewportSize({ width: 320, height: 844 });
    await page.emulateMedia({ media: "screen" });

    const mobile = await page.evaluate(() => {
      const table = document.querySelector("ef-print-table");
      const root = document.documentElement;
      return {
        pageScrollWidth: root.scrollWidth,
        pageClientWidth: root.clientWidth,
        tableOverflowX: getComputedStyle(table).overflowX,
        tableScrollWidth: table.scrollWidth,
        tableClientWidth: table.clientWidth,
        headerColumns: getComputedStyle(document.querySelector("ef-print-header")).gridTemplateColumns.split(" ").filter(Boolean).length,
      };
    });

    assert.ok(mobile.pageScrollWidth <= mobile.pageClientWidth + 1, `${name}: primitive fixture has no page-level mobile overflow`);
    assert.ok(["auto", "scroll"].includes(mobile.tableOverflowX), `${name}: wide table is contained on screen`);
    assert.ok(mobile.tableScrollWidth >= mobile.tableClientWidth, `${name}: wide table remains inspectable rather than clipped`);
    assert.equal(mobile.headerColumns, 1, `${name}: in-flow header stacks on narrow screens`);

    await page.emulateMedia({ media: "print" });
    const printHeaderColumns = await page.locator("ef-print-header").evaluate(element =>
      getComputedStyle(element).gridTemplateColumns.split(" ").filter(Boolean).length
    );
    assert.equal(printHeaderColumns, 3, `${name}: print restores the authored three-region header`);

    await browser.close();
  }

  console.log("Folio core primitive browser contract passed in Chromium, Firefox, and WebKit.");
} finally {
  await new Promise(resolve => server.close(resolve));
}
