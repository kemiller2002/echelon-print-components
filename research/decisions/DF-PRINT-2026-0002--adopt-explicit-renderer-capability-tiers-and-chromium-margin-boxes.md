---
id: DF-PRINT-2026-0002
title: Adopt explicit renderer capability tiers and Chromium margin boxes
status: accepted
type: decision-record
created: 2026-09-22
updated: 2026-09-22
tags: [architecture, renderer, chromium, page-numbers, headers, footers]
supersedes: []
superseded_by: []
related_documents:
  - research/evidence/EV-PRINT-2026-0002--margin-01-chromium-page-margin-evidence.md
  - docs/architecture/PRINT-ARCHITECTURE.md
  - docs/research/PRINT-WEB-CAPABILITY-BASELINE-2026-09.md
---

# DF-PRINT-2026-0002

## Context

Mainstream browser engines do not expose the same paged-media capabilities.
MARGIN-01 demonstrated that controlled Chromium 153 can render authored CSS
page-margin headers/footers and physical Page X of Y, including suppression on
a named title page. That capability is not a portable Firefox/Safari contract.

## Decision

Adopt explicit renderer capability tiers:

- **P0 Portable browser:** common standards-based document flow and graceful
  fallback.
- **P1 Chromium margin-box:** authored page-margin regions and page/page-total
  counters.
- **P2 Deterministic Chromium:** controlled PDF export with known renderer,
  fonts/assets readiness, print-background policy, and browser chrome disabled.
- **P3 Enhanced paged-media:** optional dedicated publishing renderer features.

For P1/P2, static running headers/footers and physical Page X of Y use Chromium
CSS page-margin boxes rather than JavaScript pagination.

## Rejected alternatives

- Advertising Chromium margin boxes as universal browser behavior.
- Browser-sniffing followed by silent semantic degradation.
- Calculating total page count from document height.
- Making a dedicated publishing engine mandatory for all consumers.

## Consequences

Feature support becomes machine-readable and testable. Consumers can require a
capability or choose an explicit fallback. Advanced renderers can be added
without changing the basic document model.
