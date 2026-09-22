---
id: EX-PRINT-2026-0003
title: COL-01 multipage column fragmentation
research_area: print-components
status: active
created: 2026-09-22
author_agent: chatgpt
tests_hypotheses:
  - HY-PRINT-2026-0003
related_theories: []
inputs:
  - tests/fixtures/columns/columns.html
outputs:
  - test-results/print-experiments/results.json
---

# Experiment

## Research question

Can native CSS multicolumn provide the initial multipage column primitive without splitting bounded keep-together cards or losing column-spanning content?

## Hypotheses tested

HY-PRINT-2026-0003.

## Variables

The layout primitive under test is varied while page size, renderer, fonts, and output settings remain controlled.

## Method

Render the committed fixture through the deterministic Chromium PDF path and inspect page text, page metadata, and bounding boxes using Poppler.

## Acceptance criteria

- PDF spans at least two pages.\n- All 18 card start/end marker pairs are present exactly once and remain on the same page.\n- COL-SPAN-MARKER appears exactly once.

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

Chromium PDF is the paginated oracle in this pass. Other browser engines require a separate final-print capture path before P0 portability is considered proven.

## Replication notes

Browser version and measured output are emitted to `test-results/print-experiments/results.json`.

## Conclusion

Pending.

## Registry updates required

Register this experiment and linked hypothesis before interpreting results.
