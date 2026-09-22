---
id: EX-PRINT-2026-0007
title: ACCESS-PDF-01 tagged Chromium PDF
research_area: print-components
status: active
created: 2026-09-22
author_agent: chatgpt
tests_hypotheses:
  - HY-PRINT-2026-0007
related_theories: []
inputs:
  - tests/fixtures/accessibility/semantic.html
outputs:
  - test-results/print-experiments/access-pdf-01-untagged.pdf
  - test-results/print-experiments/access-pdf-01-tagged.pdf
  - test-results/print-experiments/results.json
---

# Experiment

## Research question

Can the deterministic Chromium export path deliberately emit a tagged PDF from
semantic HTML without changing extracted textual content?

## Method

Render the same semantic HTML twice with Playwright/Chromium, explicitly setting
`tagged:false` and `tagged:true`. Use `pdfinfo` to inspect the Tagged field
and `pdftotext` to compare extracted content.

## Acceptance criteria

- Untagged output reports Tagged: no.
- Tagged output reports Tagged: yes.
- Extracted text is equivalent.
- ACCESS-TITLE, SECTION, TABLE, and FIGURE markers are preserved.

## Falsification criteria

Any acceptance condition fails.

## Threats to validity

`Tagged: yes` proves only that a PDF structure tree/tagging mechanism exists.
It is not proof of correct semantics, assistive-technology behavior, or PDF/UA
conformance.

## Conclusion

Pending.
