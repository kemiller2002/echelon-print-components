# Feature Manifest — Folio Documentation Site

## Purpose

Generate and publish a static documentation/showcase site for Folio's currently registered print components.

## Ownership

- registered component surface: `src/components/register.js`
- print implementation: `src/styles/print.css`
- site generation and component metadata: `tools/build-site.mjs`
- docs shell styling: `site/site.css`
- standalone preview styling: `site/demo.css`
- generated output: `site-dist/`
- renderer capability truth: architecture/research evidence

## Invariants

- one page per registered public element;
- at least three examples per element;
- no documentation pages for merely planned/unimplemented elements;
- actual Folio print CSS renders the previews;
- no browser JavaScript in generated documentation;
- capability tier and maturity are visible;
- sidebar remains explicitly provisional;
- generated output is never hand-edited.

## Verification

- `npm run site:check`
- `npm run site:test:browser`
- existing `npm test` print experiments
- ROS validation

## Modification boundaries

Normal:

- `site/**`
- `tools/build-site.mjs`
- site tests/workflows
- Folio site/agent documentation

Escalation/evidence required:

- adding a public print component;
- changing renderer capability promises;
- changing pagination-sensitive component behavior;
- promoting provisional layout behavior to portable;
- adding a pagination runtime.


## Mobile documentation contract

The Folio docs shell is responsive down to 320 CSS pixels.

Embedded demos may use screen-only inspection adaptations on narrow viewports, but those adaptations must never change `@media print` behavior or Folio's renderer capability claims.

Cross-browser site tests cover 320px, 390px, and 430px widths in Chromium, Firefox, and WebKit.


## Core responsive component contract

Folio's public stylesheet, not the documentation demo layer, owns component-level responsive behavior.

At screen widths <= 48rem:

- `ef-print-columns` becomes one column.
- `ef-print-sidebar` becomes one stacked column.

These rules are screen-only. Under print media, the authored column count and side-rail layout remain unchanged.

The other registered Folio primitives use natural block flow and must not gain unnecessary mobile-specific layout rules.
