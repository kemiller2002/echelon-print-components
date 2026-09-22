---
id: HY-PRINT-2026-0003
title: Native multicolumn flow preserves kept blocks across pages
research_area: print-components
status: supported
confidence: high
created: 2026-09-22
author_agent: chatgpt
supporting_evidence:
  - EV-PRINT-2026-0003
contradicting_evidence: []
related_theories: []
supersedes: []
superseded_by: []
---

# Hypothesis

## Statement

A two-column `ef-print-columns` implementation based on CSS multicolumn can
span physical pages while preserving all content, honoring break-inside
avoidance for bounded cards, and supporting a full-width column-spanning element.

## Mechanism

The browser's native paged-layout engine receives standards-based multicolumn
and fragmentation rules rather than synthetic page coordinates.

## Predictions

- The fixture spans at least two pages.
- Every COL start/end marker appears exactly once.
- No kept card has its start/end markers on different pages.
- The column-span marker appears exactly once.

## Evidence that would support it

All automated acceptance criteria in EX-PRINT-2026-0003 pass.

## Evidence that would contradict it

Missing/duplicated markers, a kept card crossing a page boundary, or lost
column-spanning content.

## Tests performed

EX-PRINT-2026-0003.

## Results

Chromium 153.0.8010.12 produced a four-page Letter PDF. All 18 cards were
preserved, zero cards had start/end markers split across physical pages, and
the full-width COL-SPAN-MARKER appeared exactly once.

## Falsification attempts

The fixture forces enough content for four physical pages, places
`break-inside: avoid` on every card, and inserts a `column-span: all`
element inside the multicolumn flow.

## Current assessment

Supported with high confidence for the controlled Chromium fixture. This does
not establish final paginated-output equivalence in Firefox or Safari/WebKit.

## Next experiment

Test three-column variants, explicit column breaks, oversize content that cannot
fit within one page/column, and cross-browser final print capture.
