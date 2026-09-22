---
id: EV-PRINT-2026-0002
title: MARGIN-01 Chromium page-margin and counter evidence
research_area: print-components
evidence_type: primary
source_title: MARGIN-01 CI execution
source_author: echelon-print-components CI
source_uri: https://github.com/kemiller2002/echelon-print-components/actions/runs/35692737104
source_date: 2026-09-22
retrieved: 2026-09-22
created_by_agent: chatgpt
confidence: high
supports:
  - HY-PRINT-2026-0002
contradicts: []
related_theories: []
tags: [print, chromium, page-margin-boxes, page-numbers, pdf]
---

# Evidence Record

## Evidence summary

Chromium 153.0.8010.12 generated a controlled four-page Letter PDF using named
title/body pages and CSS page-margin boxes.

## Exact claim supported or contradicted

Supports the claim that the controlled Chromium output path can provide static
running headers/footers and physical Page X of Y using authored CSS, while
suppressing the authored margin content on a named title page.

## Source provenance

GitHub Actions run 35692737104 executed the committed MARGIN-01 fixture with
Playwright 1.63.0 and inspected the generated PDF using Poppler.

## Relevant excerpt or data

- Physical PDF pages: 4.
- Body running header occurrences: 3.
- Body running footer occurrences: 3.
- Observed counters: Page 2 of 4, Page 3 of 4, Page 4 of 4.
- Page 1 of 4 absent.
- Page size: 612 x 792 points (US Letter).

## Interpretation

P1/P2 can use Chromium page-margin boxes for the initial static running-content
contract. JavaScript pagination is unnecessary for this use case.

## Limitations

Chromium only. The experiment did not test Firefox/Safari support, restarted
numbering after front matter, dynamic running section titles, odd/even page
variants, or mixed portrait/landscape page profiles.

## Counterevidence

None observed in this experiment.

## Reproduction or verification notes

Run `npm test` with the prerequisites listed in `tests/README.md`. The
generated `margin-01.pdf` and results JSON are uploaded by the print experiment
workflow.
