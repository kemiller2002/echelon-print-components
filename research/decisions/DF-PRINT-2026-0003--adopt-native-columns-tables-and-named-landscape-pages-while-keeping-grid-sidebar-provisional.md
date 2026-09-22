---
id: DF-PRINT-2026-0003
title: Adopt native columns, tables, and named landscape pages while keeping grid sidebar provisional
status: accepted
type: decision-record
created: 2026-09-22
updated: 2026-09-22
tags: [architecture, columns, tables, sidebar, named-pages]
supersedes: []
superseded_by: []
related_documents:
  - research/evidence/EV-PRINT-2026-0003--col-01-multipage-column-evidence.md
  - research/evidence/EV-PRINT-2026-0004--sidebar-01-grid-rail-evidence.md
  - research/evidence/EV-PRINT-2026-0005--table-01-multipage-and-landscape-evidence.md
---

# DF-PRINT-2026-0003

## Context

The first stress suite exercised native CSS multicolumn, a grid-based in-flow
side rail, semantic multipage tables, repeated table headers, and a named
landscape page.

## Decision

1. Use CSS multicolumn as the initial implementation of
   `ef-print-columns`.
2. Use native semantic HTML tables as the initial table strategy.
3. Use named `@page` profiles for isolated landscape/wide sections.
4. Keep CSS Grid as the leading `ef-print-sidebar` candidate, but **do not**
   freeze that public implementation yet. Its current evidence proves marker
   preservation and marker-level separation, not exhaustive descendant
   non-overlap or cross-browser paginated output.

## Rejected alternatives

- Simulating columns with positioned boxes.
- Rendering tables as div-based grids for print.
- Shrinking wide tables until they fit portrait pages.
- Promoting the grid sidebar to a portability guarantee from one bounded test.

## Consequences

Columns and tables can proceed into component API prototyping. Sidebar remains
an experiment-backed candidate with additional proof obligations.
