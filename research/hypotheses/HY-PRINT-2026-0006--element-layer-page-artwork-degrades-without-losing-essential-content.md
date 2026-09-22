---
id: HY-PRINT-2026-0006
title: Element-layer page artwork degrades without losing essential content when print backgrounds are disabled
research_area: print-components
status: proposed
confidence: medium
created: 2026-09-22
author_agent: chatgpt
supporting_evidence: []
contradicting_evidence: []
related_theories: []
supersedes: []
superseded_by: []
---

# Hypothesis

## Statement

A page-art layer implemented as ordinary document content with a CSS background
image can provide strong artwork in controlled background-enabled PDF output
while leaving all essential foreground content intact when background graphics
are disabled.

## Predictions

- Background-on and background-off PDFs contain identical extracted essential text.
- Both outputs contain ART-ESSENTIAL-TITLE, BODY, and FOOTER exactly once.
- The background-on raster has materially greater ink/darkness than background-off output.

## Evidence that would contradict it

Essential text disappears/changes, page generation fails, or disabling print
backgrounds does not produce a measurably different artwork raster.

## Tests performed

EX-PRINT-2026-0006.

## Current assessment

Open.

## Next experiment

If supported, test multi-page section artwork, watermarks, grayscale, and an
actual raster/photo background.
