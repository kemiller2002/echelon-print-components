---
id: EV-PRINT-2026-0005
title: TABLE-01 multipage and landscape evidence
research_area: print-components
evidence_type: primary
source_title: TABLE-01 CI execution
source_author: echelon-print-components CI
source_uri: https://github.com/kemiller2002/echelon-print-components/actions/runs/35693518579
source_date: 2026-09-22
retrieved: 2026-09-22
created_by_agent: chatgpt
confidence: high
supports:
  - HY-PRINT-2026-0005
contradicts: []
related_theories: []
tags: [print, tables, named-pages, landscape, chromium]
---

# Evidence Record

## Evidence summary

Chromium 153.0.8010.12 rendered a 72-row portrait table across three pages with
a repeated header and then switched a separate wide table to a named Letter
landscape page.

## Exact claim supported or contradicted

Supports using native semantic tables for the initial table primitive and named
`@page` profiles for isolated wide/landscape sections.

## Relevant excerpt or data

- Total PDF pages: 4.
- Portrait rows: 72/72 preserved.
- Portrait row pages: 1, 2, 3.
- Repeated header observed on all 3 portrait pages.
- Wide rows: 12/12 preserved.
- Wide page: page 4.
- Wide page size: 792 x 612 pt (Letter landscape).

## Interpretation

A common professional-report pattern works without JavaScript pagination.

## Limitations

No oversized row, rowspan/colspan, nested blocks, or non-Chromium paginated PDF
has been tested yet.

## Counterevidence

None observed.

## Reproduction or verification notes

Run `npm test`; inspect `table-01.pdf` and `results.json`.
