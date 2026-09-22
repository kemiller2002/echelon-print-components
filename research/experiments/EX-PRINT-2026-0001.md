---
id: EX-PRINT-2026-0001
title: PAGINATION-01 light-DOM wrapper equivalence
research_area: print-components
status: completed
created: 2026-09-22
author_agent: chatgpt
tests_hypotheses:
  - HY-PRINT-2026-0001
related_theories: []
inputs:
  - tests/fixtures/pagination/native.html
  - tests/fixtures/pagination/component.html
  - tests/fixtures/pagination/common.css
outputs:
  - test-results/print-experiments/pagination-native.pdf
  - test-results/print-experiments/pagination-component.pdf
  - test-results/print-experiments/results.json
---

# Experiment

## Research question

Does replacing ordinary block wrappers with passive light-DOM custom elements
change relevant print layout behavior?

## Hypotheses tested

HY-PRINT-2026-0001.

## Variables

Independent variable: native wrapper tags versus `ef-print-*` wrapper tags.

Controlled variables: meaningful text, classes, stylesheet, viewport, print
media, renderer version within each comparison, PDF options.

Dependent variables: print-media probe geometry/computed break properties and,
for Chromium, PDF page count/page size/extracted text.

## Method

Use Playwright 1.63.0 to drive Chromium, Firefox, and WebKit under print media.
Compare paired probe rectangles/computed styles. Then use Chromium's PDF API for
actual paginated output and compare PDF metadata plus normalized extracted text
using Poppler.

## Acceptance criteria

- Same meaningful text.
- Same probe count/order.
- Geometry delta <= 0.75 CSS px for every probe field in each engine.
- Same computed display/break properties.
- Same Chromium PDF page count and page size.
- Same normalized Chromium PDF text.

## Falsification criteria

Any acceptance condition fails.

## Controls

The fixtures intentionally share CSS and content. Only wrapper element names
and custom-element registration differ.

## Procedure

Run `npm test` in the CI environment defined by
`.github/workflows/print-experiments.yml`.

## Results

Passed on 2026-09-22.

- Chromium 153.0.8010.12: 0 px maximum geometry delta across 8 probes.
- Firefox 155.0: 0 px maximum geometry delta across 8 probes.
- WebKit 26.6: 0 px maximum geometry delta across 8 probes.
- Native Chromium PDF: 2 Letter pages.
- Component Chromium PDF: 2 Letter pages.
- Normalized extracted Chromium PDF text: identical.

Primary evidence: EV-PRINT-2026-0001.

## Analysis

The tested passive light-DOM wrapper abstraction did not change any measured
print-media geometry and did not change Chromium's resulting paginated PDF.
This is strong evidence for using custom elements as declarative print/layout
markers when they remain passive and their display behavior is explicitly
normalized.

The result does not justify assuming more complex custom components are
pagination-neutral. Columns, grid sidebars, tables, named pages, artwork, and
other layout mechanisms must each be tested independently.

## Threats to validity

Playwright does not expose equivalent native PDF generation for Firefox/WebKit,
so their portion measures print-media layout equivalence rather than final
paginated output. The fixture tests passive wrappers only and cannot validate
future complex components by implication.

## Replication notes

CI run: https://github.com/kemiller2002/echelon-print-components/actions/runs/35692737104

The run uploaded the paired PDFs and `results.json` as
`print-experiment-evidence`.

## Conclusion

The light-DOM passive-wrapper architecture survives PAGINATION-01 and remains
the preferred core component model.

## Registry updates required

Register this experiment, linked hypothesis, and EV-PRINT-2026-0001.
