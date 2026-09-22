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
