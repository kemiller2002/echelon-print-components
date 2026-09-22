# Folio Agent Usage

Status: canonical repository-local instructions for agents consuming or changing Folio.

## Purpose

Folio is the Echelon Foundry print component system in this repository.

It is a document-intent layer over semantic HTML and standards-based print CSS. It is not a general UI framework and it is not a JavaScript pagination engine.

Agents must preserve the distinction between:

- document content and meaning;
- Folio layout intent;
- renderer capability;
- interactive preview/configuration state.

## Required sequence

Before creating or changing printable document UI:

1. Start with semantic HTML and logical reading order.
2. Use ordinary HTML for headings, paragraphs, lists, tables, figures, links, and images.
3. Search the Folio component catalog and `src/components/register.js` for an existing print primitive.
4. Use a Folio custom element only when it expresses reusable print/layout intent.
5. Read the component's capability tier and maturity before promising renderer behavior.
6. Keep source content useful when JavaScript is unavailable or the custom element has not upgraded.
7. Prefer CSS/native browser pagination and fragmentation over DOM measurement.
8. Use Limen/Ordo only for meaningful preview/configuration state, not physical pagination.
9. Run print experiments and Folio site validation before claiming completion.

## Current public component surface

The registered component list is authoritative:

- `ef-print-document`;
- `ef-print-title-page`;
- `ef-print-section`;
- `ef-print-back-page`;
- `ef-print-columns`;
- `ef-print-sidebar`;
- `ef-print-break`;
- `ef-print-keep`.

The Folio documentation generator fails if a newly registered public element lacks site metadata and three examples. Documentation examples must also remain usable at phone widths without changing the component's print-media contract.

## Capability tiers

### P0 — Portable browser

Common standards-based print behavior:

- print media;
- `@page` size/margins where supported;
- native page/column fragmentation;
- multicolumn flow;
- in-flow document structure;
- semantic tables/figures;
- graceful fallback.

P0 does not mean pixel-identical output across browsers and printers.

### P1 — Chromium margin boxes

Controlled Chromium features validated separately:

- authored page-margin headers/footers;
- current page counter;
- total page counter.

Never describe P1 as portable Firefox/Safari behavior.

### P2 — Deterministic Chromium

Controlled export contract:

- known Chromium version;
- font/image readiness;
- print media;
- print-background policy;
- browser chrome disabled;
- diagnostics and renderer metadata.

### P3 — Enhanced paged media

Optional dedicated publishing-engine integrations for features outside mainstream browser interoperability.

## Mobile and screen-preview behavior

Folio's public stylesheet is responsive on screens and keeps print behavior separate.

- `ef-print-columns` collapses to one column at screen widths of 48rem or less.
- `ef-print-sidebar` stacks to one column at screen widths of 48rem or less.
- `ef-print-document`, `ef-print-title-page`, `ef-print-section`, `ef-print-back-page`, `ef-print-break`, and `ef-print-keep` already use ordinary block flow and do not need component-specific mobile overrides.
- These adaptations are screen-only. Print media preserves the authored column count, side-rail layout, break behavior, and renderer contract.
- Do not introduce JavaScript solely for responsive behavior.
- Do not change pagination semantics to make a screen preview fit.
- If consumer content itself is intrinsically wide, such as a large data table, preserve the content and use an explicit contained scrolling or alternate screen presentation strategy rather than clipping it.

## Boundary ownership

| Concern | Owner |
| --- | --- |
| Document data and semantic meaning | Consuming application |
| Reusable print/layout intent | Folio |
| Print CSS and Folio visual defaults | Folio |
| Physical pagination and fragmentation | Browser / selected renderer |
| Renderer capability guarantees | Capability profile / adapter |
| Interactive preview/configuration state | Limen + Ordo/application |
| Authorization/privacy/domain decisions | Consuming application |

## Do not

- build a DOM-measure-and-repage loop in Folio core;
- move meaningful application state into print custom elements;
- replace ordinary semantic HTML merely for styling;
- use Shadow DOM as the default printable-content container;
- claim renderer-specific behavior as portable;
- hide unsupported capabilities through silent approximation;
- depend on CSS visual reordering that contradicts reading order;
- put essential content only in suppressible background graphics;
- shrink text to illegibility to force wide content onto a page;
- promote `ef-print-sidebar` from provisional portability without stronger evidence;
- make pagination-sensitive token changes without print/PDF regression evidence.

## Component-specific cautions

### ef-print-sidebar

Current CSS Grid implementation is an experiment-backed candidate, not a frozen universal portability guarantee.

### ef-print-keep

`break-inside: avoid` is a request. A block taller than available page space may still fragment.

### ef-print-columns

Native multicolumn flow is accepted as the initial implementation, but real long content must still be tested under target renderers.

### ef-print-break

Use explicit page breaks for authored document structure, not as repeated trial-and-error repair for unstable layout.

## Adding a Folio component

When adding a registered public component:

1. define the semantic/layout need;
2. run or cite a fragmentation/rendering experiment proportional to its risk;
3. add the passive light-DOM element registration;
4. add print CSS;
5. add structural/print tests;
6. add Folio site metadata and at least three examples;
7. update capability/maturity guidance;
8. verify the documentation examples at narrow mobile widths as well as print media;
9. run ROS attribution and validation.

## Documentation site

The site is generated by `tools/build-site.mjs`.

Source:

- shell CSS: `site/site.css`;
- standalone preview CSS: `site/demo.css`;
- component registry: `src/components/register.js`;
- print CSS: `src/styles/print.css`;
- generated output: `site-dist/` (ignored).

Do not hand-edit `site-dist/`.

## Verification

For site-only work:

```bash
npm run site:check
npx playwright install chromium firefox webkit
npm run site:test:browser
```

For Folio implementation changes:

```bash
npm test
npm run site:check
npm run site:test:browser
./ros registry check
./ros validate
```

The established print experiment suite remains the authority for PDF/browser output evidence.
