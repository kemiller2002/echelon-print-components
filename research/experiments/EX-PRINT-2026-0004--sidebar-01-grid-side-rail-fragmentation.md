---
id: EX-PRINT-2026-0004
title: SIDEBAR-01 grid side-rail fragmentation
research_area: print-components
status: active
created: 2026-09-22
author_agent: chatgpt
tests_hypotheses:
  - HY-PRINT-2026-0004
related_theories: []
inputs:
  - tests/fixtures/sidebar/sidebar.html
outputs:
  - test-results/print-experiments/results.json
---

# Experiment

## Research question

Can the current grid-based ef-print-sidebar remain usable when its main content exceeds one physical page?

## Hypotheses tested

HY-PRINT-2026-0004.

## Variables

The layout primitive under test is varied while page size, renderer, fonts, and output settings remain controlled.

## Method

Render the committed fixture through the deterministic Chromium PDF path and inspect page text, page metadata, and bounding boxes using Poppler.

## Acceptance criteria

- PDF spans at least two pages.\n- MAIN-01 through MAIN-10 and SIDE-01 through SIDE-04 are each present exactly once.\n- At least one page contains both marker groups.\n- Marker bounding boxes retain more than 6 pt horizontal separation.

## Falsification criteria

Any acceptance criterion fails.

## Controls

All markers are unique and are asserted exactly once so clipping and accidental duplication are observable.

## Procedure

Run `npm test` through the committed print experiment workflow.

## Results

Pending first execution.

## Analysis

Pending.

## Threats to validity

Marker-level horizontal separation does not prove all descendant text is overlap-free. A passing result permits deeper geometry tests; it does not yet establish full cross-browser portability.

## Replication notes

Browser version and measured output are emitted to `test-results/print-experiments/results.json`.

## Conclusion

Pending.

## Registry updates required

Register this experiment and linked hypothesis before interpreting results.
