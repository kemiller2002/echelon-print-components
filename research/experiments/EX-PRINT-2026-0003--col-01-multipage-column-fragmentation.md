---
id: EX-PRINT-2026-0003
title: COL-01 multipage column fragmentation
research_area: print-components
status: completed
created: 2026-09-22
author_agent: chatgpt
tests_hypotheses:
  - HY-PRINT-2026-0003
related_theories: []
inputs:
  - tests/fixtures/columns/columns.html
outputs:
  - test-results/print-experiments/columns-01.pdf
  - test-results/print-experiments/results.json
---

# Experiment

## Research question

Can native CSS multicolumn provide the initial multipage column primitive
without splitting bounded keep-together cards or losing column-spanning content?

## Hypotheses tested

HY-PRINT-2026-0003.

## Variables

The multicolumn layout is held at two columns while page size, renderer, fonts,
and output settings remain controlled.

## Method

Render the committed fixture through Chromium PDF and inspect marker text by
physical PDF page.

## Acceptance criteria

- PDF spans at least two pages.
- All 18 card marker pairs are present exactly once and remain on the same page.
- COL-SPAN-MARKER appears exactly once.

## Falsification criteria

Any acceptance criterion fails.

## Controls

Every card has unique START/END markers and `break-inside: avoid`.

## Procedure

Run `npm test` through the committed print experiment workflow.

## Results

Passed on 2026-09-22 in Chromium 153.0.8010.12.

- Four Letter pages.
- 18 kept blocks preserved.
- 0 kept blocks split across pages.
- Column-span marker preserved once.
- Cards were distributed across physical pages 2-4.

Primary evidence: EV-PRINT-2026-0003.

## Analysis

The standards-first multicolumn approach survived a real multipage PDF stress
fixture. There is no evidence here that a custom JavaScript pagination layer is
needed for this use case.

## Threats to validity

Chromium PDF is the paginated oracle in this pass. Other browser engines require
a separate final-print capture path before P0 portability is considered proven.

## Replication notes

GitHub Actions run:
https://github.com/kemiller2002/echelon-print-components/actions/runs/35693518579

## Conclusion

Keep native CSS multicolumn as the preferred implementation for the initial
`ef-print-columns` primitive.

## Registry updates required

Register EX-PRINT-2026-0003, HY-PRINT-2026-0003, and EV-PRINT-2026-0003.
