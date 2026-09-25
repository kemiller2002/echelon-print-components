# EV-PRINT-2026-0008 — 2026 State Fair bounded-sheet reference

Date: 2026-09-25
Status: implementation evidence

## Source

The reference implementation in kemiller2002/recipes uses a US Letter entry sheet, 0.35in inset, semantic header metadata, bounded recipe body, bottom entrant footer, and an ordered fit sequence: normal, compact, compact two-column, tiny, micro.

## Folio translation

Folio generalizes the physical constraint as ef-print-bounded-sheet and the finite profile search as ef-print-fit-region. Recipe semantics remain ordinary HTML. The regression fixture reproduces the reference structure and profile progression without importing recipe-specific behavior into the core.

## Evidence boundary

This record establishes provenance and an implementation fixture. Cross-browser primitive behavior remains covered by the existing browser suite; the bounded State Fair physical-unit regression uses Chromium as the direct acceptance target.
