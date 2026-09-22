---
id: DF-PRINT-2026-0001
title: Adopt standards-first browser pagination and light-DOM print components
status: accepted
type: decision-record
created: 2026-09-22
updated: 2026-09-22
tags: [architecture, print, web-components, pagination, light-dom]
supersedes: []
superseded_by: []
related_documents:
  - research/evidence/EV-PRINT-2026-0001--pagination-01-browser-and-pdf-evidence.md
  - research/evidence/EV-PRINT-2026-0003--col-01-multipage-column-evidence.md
  - research/evidence/EV-PRINT-2026-0005--table-01-multipage-and-landscape-evidence.md
  - docs/architecture/PRINT-ARCHITECTURE.md
---

# DF-PRINT-2026-0001

## Context

The central architectural risk was whether reusable custom elements would force
Echelon Print Components to become a JavaScript pagination engine. PAGINATION-01
found zero geometry difference between native wrappers and passive light-DOM
custom elements in print media across Chromium, Firefox, and WebKit, and
identical Chromium paginated PDF page count/text. COL-01 and TABLE-01 then
showed that native browser pagination can handle representative multicolumn and
multipage table/named-page cases without synthetic page construction.

## Decision

1. Core printable components use semantic HTML plus passive light-DOM custom
   elements where a reusable print/layout contract is needed.
2. CSS and the selected renderer own pagination, fragmentation, columns, and
   named pages.
3. Core will not implement a general JavaScript DOM-measure-and-repage engine.
4. Native semantic elements remain preferred for ordinary document content.
5. Complex layout primitives are admitted only after their own fragmentation
   experiments rather than by generalizing PAGINATION-01.

## Rejected alternatives

- Shadow DOM as the default printable-content container.
- A JavaScript pagination loop that measures nodes and moves them among
  synthetic page containers.
- Replacing native headings, paragraphs, tables, figures, and lists with a
  parallel custom-element vocabulary.

## Consequences

The core stays small, framework-independent, and aligned with browser layout.
Renderer limitations remain visible and must be modeled as capability rather
than patched through hidden pagination logic.
