# Print experiment tests

These tests are research/conformance tests, not yet a public package test suite.

## Prerequisites

- Node.js 24
- Playwright 1.63.0 browsers: Chromium, Firefox, WebKit
- Poppler tools: `pdfinfo` and `pdftotext`

Install test tooling:

```bash
npm install
npx playwright install --with-deps chromium firefox webkit
```

Then run:

```bash
npm test
```

The test runner:

1. compares the native and light-DOM component fixtures under print media in Chromium, Firefox, and WebKit;
2. generates actual Chromium PDFs for both pagination fixtures and compares page count plus normalized extracted text;
3. generates the MARGIN-01 PDF and verifies authored running header/footer text plus Page X of Y counters;
4. writes `test-results/print-experiments/results.json` and PDFs for inspection.

Important limitation: Playwright exposes Chromium PDF generation, but not equivalent Firefox/WebKit PDF generation. The Firefox/WebKit portion therefore proves print-media DOM/layout equivalence, not final paginated-output equivalence. That limitation must remain visible in the research record.
