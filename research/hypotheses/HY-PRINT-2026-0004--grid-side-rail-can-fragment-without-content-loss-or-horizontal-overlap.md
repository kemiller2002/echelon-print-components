---
id: HY-PRINT-2026-0004
title: Grid side rail can fragment without content loss or horizontal overlap
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

The initial grid-based ef-print-sidebar layout can span more than one physical page while preserving main and rail content and maintaining horizontal separation on pages where both marker groups appear.

## Mechanism

The browser's native paged-layout engine receives standards-based CSS rather than synthetic page coordinates, so supported fragmentation/layout constructs should preserve content and declared relationships.

## Predictions

- The fixture spans at least two pages.\n- Ten MAIN markers and four SIDE markers each appear exactly once.\n- At least one page contains markers from both columns.\n- On every such page, the PDF marker bounding boxes retain more than 6 pt horizontal separation.

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

If rejected, compare bounded grid sections, float-based rails, and linearized portable fallbacks.
