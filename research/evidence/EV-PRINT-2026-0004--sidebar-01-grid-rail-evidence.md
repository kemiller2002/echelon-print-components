---
id: EV-PRINT-2026-0004
title: SIDEBAR-01 grid rail evidence
research_area: print-components
evidence_type: primary
source_title: SIDEBAR-01 CI execution
source_author: echelon-print-components CI
source_uri: https://github.com/kemiller2002/echelon-print-components/actions/runs/35693518579
source_date: 2026-09-22
retrieved: 2026-09-22
created_by_agent: chatgpt
confidence: medium
supports:
  - HY-PRINT-2026-0004
contradicts: []
related_theories: []
tags: [print, grid, sidebar, pagination, chromium]
---

# Evidence Record

## Evidence summary

Chromium 153.0.8010.12 rendered the grid sidebar fixture into two Letter pages
without losing any main/sidebar markers.

## Exact claim supported or contradicted

Supports the bounded claim that the current grid side rail can fragment across
the tested document while preserving content and marker-level horizontal
separation.

## Relevant excerpt or data

- Pages: 2.
- MAIN markers: 10/10 preserved.
- SIDE markers: 4/4 preserved.
- Pages containing both marker groups: 1.
- Minimum measured marker-word horizontal separation: 367.647205 pt.

## Interpretation

Grid remains a credible first implementation, but the evidence is not yet
strong enough to call the entire sidebar layout portable or overlap-proof.

## Limitations

The 367.647205 pt number is separation between marker word boxes, not the actual
column gutter. Descendant-line overlap has not yet been exhaustively tested.

## Counterevidence

None observed.

## Reproduction or verification notes

Run `npm test`; inspect `sidebar-01.pdf` and `results.json`.
