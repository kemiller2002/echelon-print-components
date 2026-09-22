---
id: EX-PRINT-2026-0004
title: SIDEBAR-01 grid side-rail fragmentation
research_area: print-components
status: completed
created: 2026-09-22
author_agent: chatgpt
tests_hypotheses:
  - HY-PRINT-2026-0004
related_theories: []
inputs:
  - tests/fixtures/sidebar/sidebar.html
outputs:
  - test-results/print-experiments/sidebar-01.pdf
  - test-results/print-experiments/results.json
---

# Experiment

## Research question

Can the current grid-based `ef-print-sidebar` remain usable when its main
content exceeds one physical page?

## Hypotheses tested

HY-PRINT-2026-0004.

## Variables

The grid rail width/gap are fixed while content forces the main column to
fragment across pages.

## Method

Render the fixture through Chromium PDF, verify unique main/sidebar markers, and
inspect Poppler word bounding boxes on pages containing both marker groups.

## Acceptance criteria

- PDF spans at least two pages.
- MAIN-01 through MAIN-10 and SIDE-01 through SIDE-04 appear once each.
- At least one page contains both marker groups.
- Marker bounding boxes retain more than 6 pt horizontal separation.

## Falsification criteria

Any acceptance criterion fails.

## Controls

Marker text is unique and source order remains main content followed by the rail.

## Procedure

Run `npm test`.

## Results

Passed on 2026-09-22 in Chromium 153.0.8010.12.

- Two Letter pages.
- 10/10 MAIN markers preserved.
- 4/4 SIDE markers preserved.
- One page contained both marker groups.
- Minimum marker-word horizontal separation: 367.647205 pt.

Primary evidence: EV-PRINT-2026-0004.

## Analysis

A grid side rail is viable enough to continue testing. The result should not
yet be promoted to a universal portable-sidebar guarantee because the current
geometry assertion is marker-level.

## Threats to validity

Marker-level horizontal separation does not prove all descendant text is
overlap-free. Firefox/Safari final paginated output is not captured here.

## Replication notes

GitHub Actions run:
https://github.com/kemiller2002/echelon-print-components/actions/runs/35693518579

## Conclusion

Retain grid as the leading portable sidebar candidate, but keep the decision
provisional until deeper geometry and fallback tests pass.

## Registry updates required

Register EX-PRINT-2026-0004, HY-PRINT-2026-0004, and EV-PRINT-2026-0004.
