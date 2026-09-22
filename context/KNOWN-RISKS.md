# Echelon Print Components known risks

| Risk | Likelihood | Impact | Mitigation | Owner |
|---|---|---|---|---|
| Browser print engines disagree on paged-media behavior | High | High | Capability profiles, cross-browser fixtures, deterministic Chromium path | Project |
| Chromium-only margin boxes are mistaken for portable behavior | High | High | P0/P1 boundary, explicit docs/tests and Firefox/Safari fallback | Project |
| Font loading/substitution changes pagination or page count | High | High | Await fonts in deterministic export; test fallback fonts | Project |
| Browser/user print settings omit backgrounds | High | Medium | Essential information outside backgrounds; deterministic backgrounds-on export | Project |
| Long tables clip, split badly, or lose headers | Medium | High | Dedicated table fixtures, landscape profiles, structural/geometric assertions | Project |
| Flex/grid/positioning interferes with page fragmentation | Medium | High | Prefer normal flow/multicol; test side-panel candidates across pages | Project |
| Component abstraction becomes a second HTML vocabulary | Medium | High | Keep public primitives small; prefer native semantic elements | Project |
| Shadow DOM blocks needed print theming/cascade or complicates flow | Medium | High | Light DOM default; comparative experiment before any exception | Project |
| JS pagination duplicates the browser and becomes brittle | Medium | High | Explicit non-goal; CSS/renderers own pagination | Project |
| Background art overlaps or obscures content | Medium | High | Safe-content region, stacking contract, contrast tests | Project |
| PDF output is assumed accessible because source HTML is semantic | Medium | High | Separate PDF accessibility validation; no unverified PDF/UA claims | Project |
| Optional renderer becomes an accidental hard dependency | Medium | Medium | Adapter boundary and dependency review | Project |
| Visual regression tests become noisy across renderer upgrades | Medium | Medium | Pin deterministic renderer; combine visual and geometric assertions | Project |
| Documentation diverges from tested browser behavior | Medium | High | Dated capability evidence and fixtures tied to claims | Project |
| Process/tooling overhead exceeds component value | Low/Medium | Medium | Keep experiments bounded; use ROS evidence proportional to decision cost | Project |
