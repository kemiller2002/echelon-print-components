---
id: HY-PRINT-2026-0001
title: Passive light-DOM print wrappers preserve layout behavior
research_area: print-components
status: supported
confidence: medium
created: 2026-09-22
author_agent: chatgpt
supporting_evidence:
  - EV-PRINT-2026-0001
contradicting_evidence: []
related_theories: []
supersedes: []
superseded_by: []
---

# Hypothesis

## Statement

Replacing otherwise-equivalent block wrappers with passive, light-DOM custom
elements whose computed layout properties are explicitly normalized will not
materially change print-media geometry or Chromium paginated PDF output.

## Mechanism

Custom elements participate in normal document flow. When they do not mutate
children, introduce Shadow DOM, add intrinsic sizing, or alter relevant
computed styles, the browser layout engine should receive an equivalent box
tree for the measured content.

## Predictions

- Native and component fixtures will have identical meaningful text.
- Probe geometry under print media will differ by no more than 0.75 CSS px in
  Chromium, Firefox, and WebKit.
- Chromium native/component PDFs will have equal page counts and page sizes.
- Normalized extracted text from those Chromium PDFs will be equal.

## Evidence that would support it

All predictions hold for the controlled fixture.

## Evidence that would contradict it

Any browser shows geometry beyond tolerance, computed fragmentation properties
differ, or Chromium produces a different page count/page size/text stream.

## Tests performed

EX-PRINT-2026-0001.

## Results

The 2026-09-22 CI run observed a maximum geometry delta of 0 px in Chromium
153.0.8010.12, Firefox 155.0, and WebKit 26.6 across eight probes. Chromium
produced two pages for both fixtures at identical Letter page size, and
normalized extracted PDF text was identical.

## Falsification attempts

The experiment used naturally pressured multi-page content, break-inside
avoidance, multiple sections, three browser engines under print media, and
actual Chromium PDF output rather than only a screen screenshot.

## Current assessment

Supported for the deliberately passive light-DOM wrapper model tested here.
Confidence remains medium because Firefox/WebKit final paginated output was not
captured and future complex components can introduce independent fragmentation
behavior.

## Next experiment

Test multi-column, sidebar, table, named-page, and artwork components separately
rather than generalizing this result beyond passive wrappers.
