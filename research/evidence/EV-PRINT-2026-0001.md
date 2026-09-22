---
id: EV-PRINT-2026-0001
title: PAGINATION-01 automated browser and Chromium PDF evidence
research_area: print-components
evidence_type: primary
source_title: PAGINATION-01 CI execution
source_author: echelon-print-components CI
source_uri: https://github.com/kemiller2002/echelon-print-components/actions/runs/35692737104
source_date: 2026-09-22
retrieved: 2026-09-22
created_by_agent: chatgpt
confidence: high
supports:
  - HY-PRINT-2026-0001
contradicts: []
related_theories: []
tags: [print, pagination, custom-elements, chromium, firefox, webkit]
---

# Evidence Record

## Evidence summary

The first controlled print experiment compared ordinary HTML wrappers with
passive light-DOM `ef-print-*` wrappers while holding content and CSS constant.

## Exact claim supported or contradicted

Supports the bounded claim that the passive light-DOM wrapper model tested does
not materially change print-media geometry and does not change Chromium
paginated PDF page count, page size, or normalized text.

## Source provenance

GitHub Actions run 35692737104 executed the committed test harness with
Playwright 1.63.0 and Poppler on 2026-09-22. The run uploaded
`print-experiment-evidence`, containing the generated PDFs and JSON results.

## Relevant excerpt or data

- Chromium 153.0.8010.12: maximum measured geometry delta = 0 px.
- Firefox 155.0: maximum measured geometry delta = 0 px.
- WebKit 26.6: maximum measured geometry delta = 0 px.
- 8 probes measured in each engine.
- Chromium native PDF = 2 Letter pages.
- Chromium component PDF = 2 Letter pages.
- Normalized extracted Chromium PDF text = identical.

## Interpretation

The current architecture can safely continue using passive light-DOM custom
elements as declarative layout markers. The result supports the abstraction,
not every future component behavior.

## Limitations

Playwright does not expose equivalent native PDF generation for Firefox/WebKit,
so those engines were compared under print-media layout rather than final
paginated output. Only passive wrappers were tested. The result does not cover
columns, grid sidebars, long tables, artwork, named pages, or other complex
fragmentation features.

## Counterevidence

None observed in this experiment.

## Reproduction or verification notes

Run `npm test` with the prerequisites listed in `tests/README.md`. The CI
workflow is `.github/workflows/print-experiments.yml`.
