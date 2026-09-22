---
id: EX-PRINT-2026-0002
title: MARGIN-01 Chromium margin boxes and page counters
research_area: print-components
status: completed
created: 2026-09-22
author_agent: chatgpt
tests_hypotheses:
  - HY-PRINT-2026-0002
related_theories: []
inputs:
  - tests/fixtures/margin/margin.html
outputs:
  - test-results/print-experiments/margin-01.pdf
  - test-results/print-experiments/results.json
---

# Experiment

## Research question

Can the controlled Chromium output path provide authored running headers,
footers, and Page X of Y without JavaScript pagination, while suppressing those
regions on a named title page?

## Hypotheses tested

HY-PRINT-2026-0002.

## Variables

Independent configuration: named title/body pages and CSS page-margin boxes.

Dependent observations: physical PDF page count, repeated header/footer
occurrence count, exact page counter strings, title-page counter suppression.

## Method

Render the four-page fixture through Playwright's Chromium PDF API with CSS page
size preferred, print backgrounds enabled, and browser-generated headers/footers
disabled. Inspect the PDF with Poppler.

## Acceptance criteria

- Four physical pages.
- Three authored body headers.
- Three authored body footers.
- Page 2 of 4, Page 3 of 4, and Page 4 of 4 all observed.
- Page 1 of 4 absent.

## Falsification criteria

Any acceptance condition fails.

## Controls

The title page and body pages use distinct named page profiles. Browser-generated
header/footer output is explicitly disabled so extracted running content must
come from authored CSS.

## Procedure

Run `npm test` in the CI environment defined by
`.github/workflows/print-experiments.yml`.

## Results

Passed on 2026-09-22 using Chromium 153.0.8010.12.

- PDF pages: 4 Letter pages.
- Repeated authored top-left header occurrences: 3.
- Repeated authored bottom-left footer occurrences: 3.
- Observed counters: Page 2 of 4, Page 3 of 4, Page 4 of 4.
- Title page Page 1 of 4 counter: suppressed.

Primary evidence: EV-PRINT-2026-0002.

## Analysis

Chromium margin boxes are sufficient for the first controlled implementation of
static running document metadata and Page X of Y. JavaScript pagination is not
required for this capability.

The title page remains part of the physical page count even though authored
margin content is suppressed. The current counter therefore reports physical
page numbering. Any future requirement for a numbering sequence that restarts
after front matter requires a separate experiment.

## Threats to validity

This experiment applies to Chromium 153 in the controlled PDF path. It does not
imply Firefox/Safari support, dynamic named-string section headings, restarted
page-number sequences, or odd/even page styling beyond what was tested.

## Replication notes

CI run: https://github.com/kemiller2002/echelon-print-components/actions/runs/35692737104

The run uploaded `margin-01.pdf` and `results.json` as
`print-experiment-evidence`.

## Conclusion

Adopt Chromium page-margin boxes and page counters for P1/P2 static running
headers/footers and physical Page X of Y. Keep the portable P0 fallback explicit.

## Registry updates required

Register this experiment, linked hypothesis, and EV-PRINT-2026-0002.
