---
id: HY-PRINT-2026-0007
title: Deterministic Chromium export can deliberately produce a tagged PDF
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

The deterministic Chromium/Playwright output path can explicitly produce a PDF
whose metadata reports it as tagged, while preserving the same extracted
document text as an explicitly untagged export.

## Predictions

- `tagged:false` produces pdfinfo Tagged: no.
- `tagged:true` produces pdfinfo Tagged: yes.
- Extracted textual content is unchanged.
- Semantic test markers remain present.

## Evidence that would contradict it

The tagged flag does not change PDF tagging state or alters/losses document text.

## Tests performed

EX-PRINT-2026-0007.

## Current assessment

Open.

## Next experiment

If supported, inspect the actual PDF structure tree and test reading order,
table/header semantics, figure alternate text, and PDF/UA validation separately.
