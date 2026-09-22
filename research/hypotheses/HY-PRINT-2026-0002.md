---
id: HY-PRINT-2026-0002
title: Chromium margin boxes can provide native running metadata and Page X of Y
research_area: print-components
status: supported
confidence: high
created: 2026-09-22
author_agent: chatgpt
supporting_evidence:
  - EV-PRINT-2026-0002
contradicting_evidence: []
related_theories: []
supersedes: []
superseded_by: []
---

# Hypothesis

## Statement

A controlled modern Chromium renderer can use CSS page-margin boxes plus the
`page` and `pages` counters to produce repeated authored headers/footers and
Page X of Y while suppressing those regions on a named title page.

## Mechanism

Chromium implements CSS page-margin boxes and page counters. A named title page
can define empty margin-box content while body pages use authored running
content.

## Predictions

For a four-page fixture containing one title page plus three body pages:

- PDF page count is exactly four.
- The authored body header appears exactly three times.
- The authored body footer appears exactly three times.
- Counters include Page 2 of 4, Page 3 of 4, and Page 4 of 4.
- Page 1 of 4 is absent because the title page suppresses the counter.

## Evidence that would support it

All predictions are observed in extracted text from the generated Chromium PDF.

## Evidence that would contradict it

Any required running content is absent/duplicated, total-page count is wrong, or
the title page cannot suppress the margin content.

## Tests performed

EX-PRINT-2026-0002.

## Results

Chromium 153.0.8010.12 generated a four-page Letter PDF. The authored body
header and footer each appeared exactly three times. Extracted PDF text included
Page 2 of 4, Page 3 of 4, and Page 4 of 4; Page 1 of 4 was absent.

## Falsification attempts

The fixture separates an unnumbered named title page from numbered named body
pages and verifies both occurrence counts and exact page-counter strings.

## Current assessment

Supported with high confidence for controlled Chromium 153 and the static
running-content pattern tested. This does not imply equivalent Firefox/Safari
support or dynamic section-title running strings.

## Next experiment

Test odd/even placement, multiple named body page profiles, and interaction
with landscape sections before broadening the public running-content API.
