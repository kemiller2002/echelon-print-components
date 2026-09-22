---
id: EX-PRINT-2026-0005
title: TABLE-01 multipage and landscape tables
research_area: print-components
status: active
created: 2026-09-22
author_agent: chatgpt
tests_hypotheses:
  - HY-PRINT-2026-0005
related_theories: []
inputs:
  - tests/fixtures/table/table.html
outputs:
  - test-results/print-experiments/results.json
---

# Experiment

## Research question

Can semantic tables provide repeated headers across portrait pages and cleanly transition into a named Letter-landscape wide-table page?

## Hypotheses tested

HY-PRINT-2026-0005.

## Variables

The layout primitive under test is varied while page size, renderer, fonts, and output settings remain controlled.

## Method

Render the committed fixture through the deterministic Chromium PDF path and inspect page text, page metadata, and bounding boxes using Poppler.

## Acceptance criteria

- All portrait/wide row markers are present exactly once.\n- Portrait rows occupy at least two pages.\n- Every portrait row page includes PORTRAIT-HEADER-ROWID.\n- WIDE-SECTION-MARKER appears on a page whose PDF dimensions are 792 x 612 points.

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

This pass does not include an oversized single row, complex rowspan/colspan, or Firefox/WebKit paginated PDF capture.

## Replication notes

Browser version and measured output are emitted to `test-results/print-experiments/results.json`.

## Conclusion

Pending.

## Registry updates required

Register this experiment and linked hypothesis before interpreting results.
