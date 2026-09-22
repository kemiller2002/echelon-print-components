---
id: HY-PRINT-2026-0003
title: Native multicolumn flow preserves kept blocks across pages
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

A two-column ef-print-columns implementation based on CSS multicolumn can span physical pages while preserving all content, honoring break-inside avoidance for bounded cards, and supporting a full-width column-spanning element.

## Mechanism

The browser's native paged-layout engine receives standards-based CSS rather than synthetic page coordinates, so supported fragmentation/layout constructs should preserve content and declared relationships.

## Predictions

- The fixture spans at least two pages.\n- Every COL start/end marker appears exactly once.\n- No kept card has its start/end markers on different pages.\n- The column-span marker appears exactly once.

## Evidence that would support it

All automated acceptance criteria in the linked experiment pass.

## Evidence that would contradict it

Any required marker is missing/duplicated, a declared keep-together pair crosses pages, side-rail marker columns overlap, repeated table headers fail, or named-page dimensions are wrong.

## Tests performed

Pending linked experiment execution.

## Results

Pending.

## Falsification attempts

The fixture deliberately spans physical pages and tests the behavior from generated PDF output rather than only screen layout.

## Current assessment

Open.

## Next experiment

If supported, test three-column variants and explicit column breaks.
