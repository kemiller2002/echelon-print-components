# Canonical Signal Results Report

Status: implemented consumer fixture  
Fixture: `tests/fixtures/reports/signal-results.html`  
Profile: Signal Results Print Profile 1.0  
Folio baseline: 0.3.0

## Purpose

This fixture proves that a substantial assessment-results document can be composed from Folio without moving Signal scoring or interpretation into the print library.

The ownership boundary remains:

```text
Signal ReportData
  -> Signal ReportProfile
  -> semantic HTML + Folio primitives
  -> selected renderer
  -> print / PDF
```

Folio does not calculate scores, select findings, decide confidence, suppress cohorts, establish comparability, or create recommendations.

## New reusable report primitives

The fixture demonstrated three recurring layout contracts that justify public primitives:

- `ef-print-metric` for label/value/detail result blocks.
- `ef-print-integrity` for coverage, completeness, confidence, comparability, suppression, and limitation summaries.
- `ef-print-finding` for explicitly separated observation, implication, possible action, and evidence-needed content.

No `ef-print-report` root was added. `ef-print-document` already expresses the document boundary.

No chart primitive was added. Charts remain application-owned SVG/canvas/image content inside `ef-print-figure`, with a required semantic/table equivalent when the graphic carries unique information.

## Canonical fixture coverage

The example includes:

- branded cover with suppressible decorative artwork;
- semantic TOC with a P0 fallback that does not fabricate target-page numbers;
- executive summary;
- four compact metrics;
- mandatory result-integrity block;
- radar profile with solid/dashed series and a complete table equivalent;
- repeating dimension-detail composition;
- cross-dimension findings;
- observation -> implication -> possible action -> evidence-needed structure;
- response distributions;
- a landscape comparison section;
- methodology, psychometric limitations, and provenance;
- Letter and A4 deterministic exports;
- grayscale mode;
- backgrounds-disabled output;
- Chromium page-margin Page X of Y in the deterministic profile.

## Accessibility and privacy

The chart has an SVG title/description and an adjacent semantic table containing the same values. Color is redundant with solid/dashed line styles and direct labels.

The fixture uses non-PII illustrative data. Suppressed cohort values are not present in hidden markup. Production consumers must apply privacy and suppression rules before content reaches Folio.

## Verification

Run:

```bash
npm test
npm run site:check
npm run site:test:browser
```

`npm test` includes the canonical report fixture and emits deterministic PDFs under `test-results/report-fixture/`.

The renderer test proves the controlled output path only. It does not establish identical pagination across every browser or prove PDF/UA conformance.
