# Echelon Print Components current state

## Repository status

Greenfield repository initialized on 2026-09-22.

Installed foundation:

- ROS 3.1.4
- SDE / Ordo 1.3.0
- Visual Engineering 1.0.0
- Communication Engineering 1.0.0 operational context
- Limen 0.6.2

Communication Engineering 1.0.0 was installed from a pinned repository commit
because the package metadata is current but that version was not available from
npm at bootstrap time.

## Observed facts

- Comprehensive product requirements are recorded in
  `docs/requirements/PRINT-COMPONENTS-REQUIREMENTS.md`.
- The proposed standards-first architecture is recorded in
  `docs/architecture/PRINT-ARCHITECTURE.md`.
- A dated browser/paged-media research baseline is recorded in
  `docs/research/PRINT-WEB-CAPABILITY-BASELINE-2026-09.md`.
- Modern Chromium supports CSS page-margin boxes and current/total page counters.
- Current Firefox and Safari do not provide the same page-margin-box capability.
- Mainstream browsers do not implement page-box background descriptors or
  paged-media bleed/crop marks.
- No product component implementation has been accepted yet.

## Current decision posture

- Use semantic HTML and light-DOM custom elements.
- Let CSS/renderers own pagination; do not build a JavaScript pagination engine.
- Use explicit P0/P1/P2/P3 renderer capability profiles.
- Keep deterministic Chromium PDF generation outside core.
- Keep advanced publishing engines optional until experiments justify an adapter.
- Use Limen only for meaningful interactive preview/configuration state and browser effects.

## Active work

Begin the first experiment sequence:

1. light-DOM custom-element fragmentation;
2. Chromium margin headers/footers/page counters;
3. multi-page columns;
4. portable side-panel layouts;
5. long tables and landscape named pages;
6. background/page artwork behavior;
7. font readiness/page-count stability;
8. PDF accessibility inspection;
9. enhanced-renderer comparison.

## Largest decision-relevant unknown

Which small public component surface gives applications enough print expressiveness
without creating a second HTML vocabulary or locking core to a particular renderer?

## Baseline

The architecture baseline is ordinary semantic HTML/CSS print styling without the
library. Experiments should compare the component abstraction against that baseline
for correctness, complexity, portability, and rework rather than merely proving
that a browser can print HTML.
