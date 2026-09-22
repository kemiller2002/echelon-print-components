# Web Print and Paged-Media Capability Baseline

Observed: 2026-09-22  
Purpose: establish the technical baseline for Echelon Print Components requirements and experiments.

This is an implementation-research baseline, not a permanent compatibility guarantee. Browser and renderer behavior must be re-tested as versions change.

## Executive findings

1. Modern browser CSS is strong enough to make standards-first HTML printing the correct core architecture.
2. Mainstream browsers now broadly support `@page` for page size/margins and named-page selection, but not every paged-media feature is interoperable.
3. Chromium 131+ materially changed the landscape by adding CSS page-margin boxes and the special `page` / `pages` counters. This enables native CSS page headers/footers and Page X of Y in modern Chromium.
4. Firefox and Safari still do not implement those `@page` margin boxes as of this baseline, so repeated margin headers/footers and CSS page counters cannot be a portable-browser requirement.
5. Mainstream browsers do not implement `@page` page-box background descriptors. Full-page art should therefore be modeled as content/page layers for portable output.
6. Browsers may remove CSS backgrounds when printing. `print-color-adjust: exact` is widely available but remains subordinate to user print preferences.
7. CSS fragmentation and `break-inside` are strong enough to use as the primary break-control model, but difficult nested fragmentation still needs empirical tests.
8. CSS multicolumn layout is appropriate for portable columns because it participates in fragmentation rather than emulating columns with positioned page boxes.
9. `orphans` and `widows` are useful progressive enhancements, not portable guarantees.
10. `hyphens` is broadly available but automatic hyphenation depends on a correct `lang` value and an available language dictionary.
11. Mainstream browsers do not support paged-media `bleed` and `marks`, so professional prepress behavior belongs to an enhanced renderer capability.
12. Dedicated paged-media engines such as Vivliostyle and Prince support important capabilities beyond mainstream browsers. They are candidates for optional adapters, not core runtime dependencies.

## Capability matrix

| Feature | Portable modern browser | Chromium 131+ | Enhanced paged-media engine | Design consequence |
|---|---|---|---|---|
| Print media CSS | Yes | Yes | Yes | Core |
| `@page` size/margins | Broad | Yes | Yes | Core |
| Named pages / `page` property | Broad modern support | Yes | Yes | Core, test per renderer |
| Break before/after/inside | Broad | Yes | Yes | Core |
| Multi-column flow | Broad | Yes | Yes | Core |
| Running page-margin header/footer | Not interoperable | Yes via page-margin boxes | Yes | P1/P3 capability |
| Current page counter | Not interoperable | Yes in margin boxes | Yes | P1/P3 capability |
| Total page counter | Not interoperable | Yes in margin boxes | Yes | P1/P3 capability |
| Dynamic named-string/running-element headers | No common browser contract | Limited compared with publishing engines | Supported by publishing engines in varying forms | P3 unless experiment finds safe subset |
| Automatic footnotes | No common browser contract | No general native publishing footnote model | Available in dedicated engines | P3 |
| Target page counters / page-aware TOC | No common browser contract | No general portable contract | Available in dedicated engines | P3 |
| `@page` background image | No mainstream implementation | No mainstream implementation | Renderer-dependent | Use document layer in core |
| `print-color-adjust: exact` | Broad modern support | Yes | Renderer-dependent | Helpful, not guarantee |
| Bleed/crop marks | No mainstream browser support | No | Available in some dedicated engines | P3 |
| Widows/orphans | Partial/variable | Variable | Renderer-dependent | Progressive enhancement |
| Language-aware hyphenation | Broad, dictionary dependent | Yes, language dependent | Yes, renderer dependent | Require `lang` |

## Mainstream browser findings

### 1. `@page` is now a viable foundation

MDN marks `@page` as Baseline 2024 and documents page size, orientation, margins, named pages, and margin at-rules.

Source:
https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40page

Can I Use reports broad current support for CSS Paged Media `@page`.

Source:
https://caniuse.com/css-paged-media

Implication: page size, orientation, margins, and named page intent belong in the core model.

### 2. Named pages are broadly available

The CSS `page` property, used to select a named `@page`, is marked widely available by MDN, with cross-browser availability dating to February 2023.

Source:
https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/page

Implication: title/body/back/wide page profiles should be expressed with named pages rather than manual size calculations.

### 3. Chromium page-margin boxes changed headers and page numbering

Chrome 131 added the 16 `@page` margin boxes. Chrome documents generated text in these margin regions plus the special `page` and `pages` counters.

Sources:
https://developer.chrome.com/blog/new-in-chrome-131
https://developer.chrome.com/blog/print-margins

Implication: modern Chromium can natively implement Page X of Y and static margin headers/footers without a JavaScript pagination engine.

### 4. Page-margin boxes remain a renderer capability, not a portable-browser feature

Current Can I Use data for `@page @top-center` shows support in Chrome/Edge from 131 and no support in current Firefox or Safari.

Source:
https://caniuse.com/mdn-css_at-rules_page_top-center

Implication: the public API can express header/footer/page-number intent, but a capability profile must say whether it can actually be repeated in page margins. Firefox/Safari output must retain meaningful content without relying on those boxes.

### 5. Browser automatic headers/footers are independent

Chrome's documentation notes that browser-generated print headers/footers can coexist with authored page-margin content unless disabled in the print dialog.

Source:
https://developer.chrome.com/blog/print-margins

Implication: deterministic PDF export must disable browser headers/footers. Normal `window.print()` documentation must tell users about the setting.

### 6. Page-box backgrounds are not implemented in mainstream browsers

MDN lists `background-image` and related page-box properties in the specification but states that these remaining page properties have not been supported by any user agent.

Source:
https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40page

Implication: page artwork belongs in an element/page-layer strategy rather than `@page { background-image }` for portable output.

### 7. Printed backgrounds remain user-controlled

MDN documents that browsers may omit background colors/images for print economy. `print-color-adjust: exact` requests preservation, but user print preferences override it.

Sources:
https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/print-color-adjust
https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Colors/Using_color_wisely

Implication: decorative brand art can use backgrounds; information essential to understanding must not exist only in a background. Deterministic Chromium export can explicitly turn print backgrounds on.

### 8. Fragmentation is a first-class CSS model

CSS Fragmentation defines breaks across pages and columns. MDN marks `break-inside` widely available and documents use for avoiding breaks inside figures and similar blocks.

Sources:
https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Fragmentation
https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/break-inside
https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Multicol_layout/Handling_content_breaks

Implication: `break-before`, `break-after`, and `break-inside` should be the primary API vocabulary. Manual height-driven pagination should be avoided.

### 9. Orphan/widow control is not fully interoperable

MDN marks `orphans` as limited availability.

Source:
https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/orphans

Implication: set reasonable values as progressive enhancement, but do not make conformance depend on them in the portable profile.

### 10. Hyphenation requires language metadata

MDN marks `hyphens` widely available but states that automatic rules are language-specific and depend on `lang` plus a browser dictionary.

Source:
https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/hyphens

Implication: `lang` is a pagination/typography input, not just metadata.

### 11. Mainstream browsers do not provide bleed/marks

MDN and Can I Use both note that mainstream browsers do not support CSS paged-media `bleed`/`marks`.

Sources:
https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Paged_media
https://caniuse.com/css-paged-media

Implication: crop marks, bleed, and true prepress output belong in the enhanced-renderer profile.

## Enhanced renderer findings

### Vivliostyle

Vivliostyle's current supported-CSS documentation covers a broad range of CSS paged-media/generated-content features, including page-based behavior, footnote mechanisms, named strings, and paged-media properties including bleed/marks.

Sources:
https://docs.vivliostyle.org/en/reference/supported-css-features/
https://docs.vivliostyle.org/en/cookbook/footnotes/

Implication: Vivliostyle is a strong experimental candidate when requirements exceed mainstream browsers, especially footnotes and richer publishing constructs. It should first be compared against the canonical fixtures rather than adopted as a core dependency.

### Prince

Prince documents page-margin regions, running elements, footnote regions, page floats, sidenotes, overlays/watermarks, and other dedicated-publishing behaviors.

Source:
https://www.princexml.com/doc/paged/

Implication: Prince represents the high-end publishing capability model and may be useful as an optional commercial integration. Core should not require it.

## Custom-element / Shadow DOM consideration

The central design question is not whether custom elements can print. It is whether encapsulation helps this specific problem.

MDN documents that Shadow DOM intentionally prevents normal page styles from crossing the boundary except through defined mechanisms.

Source:
https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM

Print/paged-media behavior depends heavily on document-wide cascade, fragmentation, page profiles, and content flow. Therefore the initial architecture should use custom elements with light DOM for printable structures and reserve Shadow DOM for screen-only controls where isolation is useful.

This is an architectural inference that must be tested, not a browser-spec claim. The first conformance experiment must compare otherwise-identical native and light-DOM custom-element fixtures across the target renderers.

## What this means for the product

### Put in core

- semantic custom elements with light DOM;
- print CSS and design tokens;
- A4/Letter page profiles;
- title/body/back page semantics;
- named pages;
- break/keep intent;
- multicolumn layout;
- in-flow side panels;
- figures/tables/code/document patterns;
- page artwork layers;
- accessibility/source-order constraints;
- renderer capability model.

### Put behind Chromium capability

- CSS margin-box running headers/footers;
- current/total page counters.

### Put behind deterministic export adapter

- known Chromium version;
- automatic asset/font readiness;
- browser header/footer disabling;
- print-background option;
- repeatable PDF generation and diagnostics.

### Keep enhanced/experimental until evidence warrants adoption

- automatic page footnotes;
- page-aware TOC target counters;
- dynamic running section headings;
- true margin notes/sidenotes;
- bleed/crop marks;
- higher-end prepress output;
- tagged/PDF-UA guarantees.

## Required experiments from this research baseline

1. Light-DOM custom elements vs equivalent native wrappers under page fragmentation.
2. Chromium page-margin box behavior with title/back/named pages and Page X of Y.
3. Firefox/Safari graceful fallback for the same document.
4. Multicolumn flow across multiple pages, including figures and explicit breaks.
5. Sidebar candidates under fragmentation.
6. Long-table repetition/splitting in each target browser.
7. Page artwork with backgrounds enabled and disabled.
8. Font substitution and page-count stability.
9. Chromium PDF semantic/tag inspection.
10. Chromium vs Vivliostyle comparison using exactly the same canonical document.

## Evidence discipline

Do not turn this baseline into permanent truth.

For every capability promoted to "guaranteed":

- record browser/renderer and version;
- keep a minimal fixture;
- create an automated or repeatable test;
- state the fallback;
- date the observation;
- revise the matrix when behavior changes.
