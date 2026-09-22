---
id: EX-PRINT-2026-0005
title: TABLE-01 multipage and landscape tables
research_area: print-components
status: completed
created: 2026-09-22
author_agent: chatgpt
tests_hypotheses:
  - HY-PRINT-2026-0005
related_theories: []
inputs:
  - tests/fixtures/table/table.html
outputs:
  - test-results/print-experiments/table-01.pdf
  - test-results/print-experiments/results.json
---

# Experiment

## Research question

Can semantic tables provide repeated headers across portrait pages and cleanly
transition into a named Letter-landscape wide-table page?

## Hypotheses tested

HY-PRINT-2026-0005.

## Method

Render the fixture through Chromium PDF; use extracted per-page text to verify
row/header preservation and `pdfinfo` to verify physical dimensions of the
named wide page.

## Acceptance criteria

- All portrait/wide row markers are present exactly once.
- Portrait rows occupy at least two pages.
- Every portrait row page includes PORTRAIT-HEADER-ROWID.
- WIDE-SECTION-MARKER appears on a 792 x 612 pt page.

## Falsification criteria

Any acceptance criterion fails.

## Controls

Unique row markers prevent silent loss/duplication.

## Procedure

Run `npm test`.

## Results

Passed on 2026-09-22 in Chromium 153.0.8010.12.

- Four total PDF pages.
- 72 portrait rows preserved across pages 1-3.
- Repeated header observed on all 3 portrait table pages.
- 12 wide-table rows preserved.
- Wide section appeared on page 4.
- Page 4 measured 792 x 612 pt (Letter landscape).

Primary evidence: EV-PRINT-2026-0005.

## Analysis

Native semantic tables plus named pages solve two important professional-report
needs without a pagination framework: repeated table headers and isolated
landscape inserts.

## Threats to validity

The fixture does not yet cover an oversized single row, complex rowspan/colspan,
nested blocks, or Firefox/WebKit paginated PDF output.

## Replication notes

GitHub Actions run:
https://github.com/kemiller2002/echelon-print-components/actions/runs/35693518579

## Conclusion

Use native semantic tables as the core table strategy and named pages for wide
landscape sections. Add hostile table-content tests before freezing the API.

## Registry updates required

Register EX-PRINT-2026-0005, HY-PRINT-2026-0005, and EV-PRINT-2026-0005.
