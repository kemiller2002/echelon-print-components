---
id: EV-PRINT-2026-0003
title: COL-01 multipage column evidence
research_area: print-components
evidence_type: primary
source_title: COL-01 CI execution
source_author: echelon-print-components CI
source_uri: https://github.com/kemiller2002/echelon-print-components/actions/runs/35693518579
source_date: 2026-09-22
retrieved: 2026-09-22
created_by_agent: chatgpt
confidence: high
supports:
  - HY-PRINT-2026-0003
contradicts: []
related_theories: []
tags: [print, columns, pagination, chromium]
---

# Evidence Record

## Evidence summary

Chromium 153.0.8010.12 rendered the COL-01 two-column fixture into four Letter
pages with every marker preserved.

## Exact claim supported or contradicted

Supports the bounded claim that native CSS multicolumn can paginate the tested
two-column component while preserving 18 `break-inside: avoid` cards and one
`column-span: all` element.

## Relevant excerpt or data

- Pages: 4.
- Kept blocks: 18.
- Kept blocks split across pages: 0.
- COL-SPAN-MARKER: present exactly once.

## Interpretation

Native multicolumn remains the preferred core implementation.

## Limitations

Controlled Chromium only for final PDF pagination. No three-column, explicit
column-break, or oversized-block case yet.

## Counterevidence

None observed.

## Reproduction or verification notes

Run `npm test`; evidence artifact name is `print-experiment-evidence`.
