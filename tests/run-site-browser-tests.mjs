import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { chromium, firefox, webkit } from "playwright";

const root = process.cwd();
const site = path.join(root, "site-dist");

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

function serve() {
  return new Promise(resolve => {
    const server = http.createServer((request, response) => {
      const url = new URL(request.url, "http://127.0.0.1");
      let pathname = decodeURIComponent(url.pathname);
      if (pathname.endsWith("/")) pathname += "index.html";
      const target = path.normalize(path.join(site, pathname.replace(/^\//, "")));

      if (!target.startsWith(site) || !fs.existsSync(target) || fs.statSync(target).isDirectory()) {
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
const engines = [
  ["chromium", chromium],
  ["firefox", firefox],
  ["webkit", webkit]
];

try {
  for (const [name, engine] of engines) {
    const browser = await engine.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

    await page.goto(baseURL + "/");
    assert.equal(await page.locator("h1").textContent(), "Folio", `${name}: home title`);
    assert.equal(await page.locator(".component-card").count(), 8, `${name}: component count`);

    await page.goto(baseURL + "/components/columns/");
    assert.equal(await page.locator("[data-example]").count(), 3, `${name}: three examples`);
    assert.match(await page.locator(".contract-grid").innerText(), /P0 portable/i);

    const preview = page.frameLocator("iframe").first();
    const columns = preview.locator("ef-print-columns");
    await columns.waitFor({ state: "attached" });
    const columnCount = await columns.evaluate(element => getComputedStyle(element).columnCount);
    assert.equal(columnCount, "2", `${name}: Folio print CSS applied inside preview`);

    await page.goto(baseURL + "/components/sidebar/");
    assert.match(await page.locator(".warning").innerText(), /provisional/i, `${name}: capability caveat visible`);

    await page.goto(baseURL + "/agents/");
    assert.match(await page.locator("h1").innerText(), /not a pagination engine/i, `${name}: agent boundary`);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(baseURL + "/");
    const widths = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth
    }));
    assert.ok(widths.scroll <= widths.client + 1, `${name}: narrow page does not overflow`);

    await browser.close();
  }

  console.log("Folio site browser checks passed in Chromium, Firefox, and WebKit.");
} finally {
  await new Promise(resolve => server.close(resolve));
}
