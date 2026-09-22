---
id: HY-PRINT-2026-0004
title: Grid side rail can fragment without content loss or horizontal overlap
research_area: print-components
status: supported
confidence: medium
created: 2026-09-22
author_agent: chatgpt
supporting_evidence:
  - EV-PRINT-2026-0004
contradicting_evidence: []
related_theories: []
supersedes: []
superseded_by: []
---

# Hypothesis

## Statement

The initial grid-based `ef-print-sidebar` layout can span more than one
physical page while preserving main and rail content and maintaining horizontal
separation on pages where both marker groups appear.

## Mechanism

Modern Chromium fragments grid containers in paged media. The sidebar remains
normal document content rather than an absolutely positioned overlay.

## Predictions

- The fixture spans at least two pages.
- Ten MAIN markers and four SIDE markers each appear exactly once.
- At least one page contains markers from both columns.
- On every such page, marker bounding boxes retain more than 6 pt horizontal separation.

## Evidence that would support it

All automated acceptance criteria in EX-PRINT-2026-0004 pass.

## Evidence that would contradict it

Missing/duplicated marker text or overlapping marker columns.

## Tests performed

EX-PRINT-2026-0004.

## Results

Chromium 153.0.8010.12 produced two Letter pages. All ten MAIN markers and four
SIDE markers were preserved exactly once. One physical page contained both
marker groups, and their nearest measured marker-word separation was
367.647205 pt, comfortably above the 6 pt non-overlap threshold.

## Falsification attempts

The main column deliberately extends beyond one physical page. PDF word
bounding boxes are inspected rather than relying on screenshot appearance.

## Current assessment

Supported only at medium confidence. The test proves marker-level content
preservation and horizontal separation, not that every descendant line is free
of overlap or that Firefox/Safari paginated output behaves the same way.

## Next experiment

Add full descendant bounding-box overlap detection, a rail taller than the
adjacent main content, and a portable linearized fallback comparison.
