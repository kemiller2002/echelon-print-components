---
id: EX-PRINT-2026-0006
title: ART-01 background artwork degradation
research_area: print-components
status: active
created: 2026-09-22
author_agent: chatgpt
tests_hypotheses:
  - HY-PRINT-2026-0006
related_theories: []
inputs:
  - tests/fixtures/artwork/artwork.html
outputs:
  - test-results/print-experiments/art-01-backgrounds-on.pdf
  - test-results/print-experiments/art-01-backgrounds-off.pdf
  - test-results/print-experiments/results.json
---

# Experiment

## Research question

Can an element-layer page-art pattern preserve all essential content when
background printing is disabled while still producing materially different
branded output when backgrounds are enabled?

## Method

Generate the same fixture twice in Chromium, once with `printBackground: true`
and once with `false`. Compare extracted text and rasterize page one using
Poppler to measure average distance from white.

## Acceptance criteria

- Essential extracted text is identical.
- Three essential markers appear exactly once in both PDFs.
- Background-on average raster ink score exceeds background-off by >20.

## Falsification criteria

Any acceptance condition fails.

## Threats to validity

The artwork is an embedded SVG background rather than a photograph, and
Playwright's controlled print-background flag is not the same thing as every
interactive printer driver's behavior.

## Conclusion

Pending.
