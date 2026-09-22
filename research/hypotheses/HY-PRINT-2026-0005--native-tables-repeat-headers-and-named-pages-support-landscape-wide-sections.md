---
id: HY-PRINT-2026-0005
title: Native tables repeat headers and named pages support landscape wide sections
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

A semantic HTML table can paginate across multiple portrait pages with repeated thead content, while a following named-page section can switch to Letter landscape for wide content without losing row markers.

## Mechanism

The browser's native paged-layout engine receives standards-based CSS rather than synthetic page coordinates, so supported fragmentation/layout constructs should preserve content and declared relationships.

## Predictions

- All 72 portrait row markers appear exactly once.\n- The portrait table spans at least two pages.\n- Every page containing portrait rows includes the repeated header marker.\n- All 12 wide row markers appear exactly once.\n- The page containing WIDE-SECTION-MARKER measures Letter landscape.

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

If supported, add oversized-row and nested-content table tests.
