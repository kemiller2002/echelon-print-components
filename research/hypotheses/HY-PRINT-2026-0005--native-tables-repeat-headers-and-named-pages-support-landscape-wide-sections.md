---
id: HY-PRINT-2026-0005
title: Native tables repeat headers and named pages support landscape wide sections
research_area: print-components
status: supported
confidence: high
created: 2026-09-22
author_agent: chatgpt
supporting_evidence:
  - EV-PRINT-2026-0005
contradicting_evidence: []
related_theories: []
supersedes: []
superseded_by: []
---

# Hypothesis

## Statement

A semantic HTML table can paginate across multiple portrait pages with repeated
`thead` content, while a following named-page section can switch to Letter
landscape for wide content without losing row markers.

## Mechanism

Native table layout and CSS paged media remain responsible for row
fragmentation/header repetition, while a named `@page` profile changes the
wide section's physical page dimensions.

## Predictions

- All 72 portrait row markers appear exactly once.
- The portrait table spans at least two pages.
- Every page containing portrait rows includes the repeated header marker.
- All 12 wide row markers appear exactly once.
- The page containing WIDE-SECTION-MARKER measures Letter landscape.

## Evidence that would support it

All automated acceptance criteria in EX-PRINT-2026-0005 pass.

## Evidence that would contradict it

Missing/duplicated rows, missing repeated headers, or incorrect named-page dimensions.

## Tests performed

EX-PRINT-2026-0005.

## Results

Chromium 153.0.8010.12 produced four pages. The 72 portrait rows occupied pages
1-3 and all three pages contained the repeated header marker. All twelve wide
row markers were preserved. The named wide section occupied page 4 at
792 x 612 pt, confirming Letter landscape output.

## Falsification attempts

The fixture uses enough rows to force a three-page portrait table and then
changes page profile before a separate eight-column wide table.

## Current assessment

Supported with high confidence for the controlled Chromium fixture.

## Next experiment

Test an oversized row, nested block content, rowspan/colspan, long unbreakable
tokens, and final paginated output in additional renderers.
