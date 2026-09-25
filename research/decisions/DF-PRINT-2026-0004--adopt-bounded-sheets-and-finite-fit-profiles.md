# DF-PRINT-2026-0004 — Adopt bounded sheets with finite authored fit profiles

Status: accepted
Date: 2026-09-25

## Decision

Folio adds an opt-in bounded-sheet composition and fit-region enhancement for artifacts whose physical one-sheet boundary is part of their meaning. Fit regions may measure rendered overflow only to choose among a finite ordered set of author-defined CSS profiles. They may not synthesize arbitrary font sizes, coordinates, or pagination.

Ordinary Folio documents remain CSS-first and renderer-paginated. Bounded fitting is a narrow exception, not a new pagination engine.

## Rationale

The 2026 State Fair recipe-entry implementation demonstrates a legitimate class of document where preserving one physical Letter sheet is a requirement. A finite profile search preserves author control while avoiding silent clipping and avoiding a general JavaScript layout engine.
