const h = (...lines) => lines.join("\n");

export const coreComponentMetadata = {
  "ef-print-header": {
    slug: "header",
    title: "Header",
    category: "Running content",
    capability: "P0 in-flow · P1/P2 running capability",
    maturity: "implemented / capability-bound",
    summary: "A semantic three-region document header that stays in normal flow portably and can express running-page intent without faking pagination.",
    caution: "repeat='page' records running-header intent only. Repetition into physical page margins requires a renderer profile that actually supports and maps running content.",
    examples: [
      {
        title: "Document header",
        note: "A portable one-time header with left, center, and right regions.",
        html: h(
          "<ef-print-document>",
          "  <ef-print-header>",
          "    <span slot='left'>Echelon Foundry</span>",
          "    <span slot='center'>Architecture Review</span>",
          "    <span slot='right'>September 2026</span>",
          "  </ef-print-header>",
          "  <h1>Executive summary</h1>",
          "</ef-print-document>"
        )
      },
      {
        title: "Running intent",
        note: "The attribute declares intent; P0 keeps the content visible in flow while P1/P2 integrations may map it to page margins.",
        html: h(
          "<ef-print-document>",
          "  <ef-print-header repeat='page'>",
          "    <span slot='left'>Folio</span>",
          "    <span slot='right'>Confidential</span>",
          "  </ef-print-header>",
          "  <p>Body content remains meaningful without running-margin support.</p>",
          "</ef-print-document>"
        )
      },
      {
        title: "Single-region header",
        note: "Unslotted content spans the available header regions.",
        html: h(
          "<ef-print-document>",
          "  <ef-print-header>",
          "    <strong>Decision memorandum · Internal</strong>",
          "  </ef-print-header>",
          "  <p>Memo content follows.</p>",
          "</ef-print-document>"
        )
      }
    ]
  },

  "ef-print-footer": {
    slug: "footer",
    title: "Footer",
    category: "Running content",
    capability: "P0 in-flow · P1/P2 running capability",
    maturity: "implemented / capability-bound",
    summary: "A semantic document footer with three regions and explicit running-page intent while preserving a visible P0 fallback.",
    caution: "Portable browsers do not all expose the same page-margin feature set. repeat='page' must not be described as universally repeated output.",
    examples: [
      {
        title: "Document footer",
        note: "A one-time footer remains ordinary readable document content.",
        html: h(
          "<ef-print-document>",
          "  <p>Report body.</p>",
          "  <ef-print-footer>",
          "    <span slot='left'>Document EF-104</span>",
          "    <span slot='right'>Internal</span>",
          "  </ef-print-footer>",
          "</ef-print-document>"
        )
      },
      {
        title: "Footer with page-number intent",
        note: "The page-number child remains explicit about its renderer dependency.",
        html: h(
          "<ef-print-document>",
          "  <ef-print-footer repeat='page'>",
          "    <span slot='left'>Confidential</span>",
          "    <span slot='right'><ef-print-page-number format='page-of-pages'>Page number supplied by renderer</ef-print-page-number></span>",
          "  </ef-print-footer>",
          "</ef-print-document>"
        )
      },
      {
        title: "Centered closing line",
        note: "Use unslotted content when a three-region layout is unnecessary.",
        html: h(
          "<ef-print-document>",
          "  <ef-print-footer>",
          "    <span>Prepared by Echelon Foundry</span>",
          "  </ef-print-footer>",
          "</ef-print-document>"
        )
      }
    ]
  },

  "ef-print-page-number": {
    slug: "page-number",
    title: "Page Number",
    category: "Running content",
    capability: "P1/P2 counter · P0 authored fallback",
    maturity: "implemented / capability-bound",
    summary: "An explicit page-counter intent marker that never estimates pagination from DOM height and keeps authored fallback text available.",
    caution: "Dynamic current/total counters require renderer support. Folio core does not guess page numbers in JavaScript.",
    examples: [
      {
        title: "Page counter intent",
        note: "Use format='page' when a supporting renderer should emit the current page.",
        html: h(
          "<ef-print-footer>",
          "  <span slot='right'><ef-print-page-number format='page'>Page number supplied by renderer</ef-print-page-number></span>",
          "</ef-print-footer>"
        )
      },
      {
        title: "Page of pages intent",
        note: "The physical Page X of Y value is a P1/P2 renderer capability.",
        html: h(
          "<ef-print-footer repeat='page'>",
          "  <span slot='right'><ef-print-page-number format='page-of-pages'>Page X of Y</ef-print-page-number></span>",
          "</ef-print-footer>"
        )
      },
      {
        title: "Accessible authored fallback",
        note: "Meaningful fallback text remains visible when counters are unavailable.",
        html: h(
          "<p>Appendix content.</p>",
          "<ef-print-page-number aria-label='Physical page number'>Pagination shown in supported PDF output</ef-print-page-number>"
        )
      }
    ]
  },

  "ef-print-layer": {
    slug: "layer",
    title: "Artwork Layer",
    category: "Page artwork",
    capability: "P0 element layer",
    maturity: "experiment-backed",
    summary: "An out-of-flow artwork or watermark layer that sits behind semantic foreground content without depending on unsupported page-box backgrounds.",
    caution: "Decorative artwork can still be suppressed by user print settings. Essential information must remain in foreground semantic content.",
    examples: [
      {
        title: "Cover artwork",
        note: "Artwork is an element inside the title page rather than an @page background.",
        html: h(
          "<ef-print-title-page>",
          "  <ef-print-layer decorative aria-hidden='true' style='--ef-print-art-image:linear-gradient(135deg,#d9e2e8,#fff)'></ef-print-layer>",
          "  <h1>Annual Review</h1>",
          "  <p>Essential title content remains foreground HTML.</p>",
          "</ef-print-title-page>"
        )
      },
      {
        title: "Watermark",
        note: "Watermark mode centers authored non-essential layer content.",
        html: h(
          "<ef-print-section>",
          "  <ef-print-layer mode='watermark' decorative aria-hidden='true' style='--ef-print-art-opacity:.12'>Draft</ef-print-layer>",
          "  <h1>Decision memo</h1>",
          "  <p>The watermark does not carry document meaning.</p>",
          "</ef-print-section>"
        )
      },
      {
        title: "Positioned art",
        note: "Artwork tokens control image fit, position, inset, and opacity independently of foreground text.",
        html: h(
          "<ef-print-back-page>",
          "  <ef-print-layer decorative aria-hidden='true' style='--ef-print-art-image:linear-gradient(#eef2f4,#dbe5ea); --ef-print-art-position:bottom; --ef-print-art-opacity:.7'></ef-print-layer>",
          "  <h1>Thank you</h1>",
          "</ef-print-back-page>"
        )
      }
    ]
  },

  "ef-print-callout": {
    slug: "callout",
    title: "Callout",
    category: "Content emphasis",
    capability: "P0 portable",
    maturity: "implemented / cross-browser evidence",
    summary: "A bounded emphasis block for decisions, warnings, evidence, and summaries using print-safe flow and keep-together intent.",
    caution: "Keep-together remains best effort when the callout is taller than the available page area.",
    examples: [
      {
        title: "Decision callout",
        note: "Use semantic text inside the wrapper; Folio supplies reusable print presentation.",
        html: h(
          "<ef-print-callout>",
          "  <strong>Decision.</strong>",
          "  <p>Use explicit renderer capability profiles.</p>",
          "</ef-print-callout>"
        )
      },
      {
        title: "Plain evidence callout",
        note: "The plain variant removes the surface while retaining the structural rule.",
        html: h(
          "<ef-print-callout variant='plain'>",
          "  <strong>Evidence.</strong> Chromium margin boxes passed the controlled fixture.",
          "</ef-print-callout>"
        )
      },
      {
        title: "Custom branded tokens",
        note: "Consumers can theme callouts without replacing the component contract.",
        html: h(
          "<ef-print-callout style='--ef-print-callout-accent:#444; --ef-print-callout-surface:#f7f7f7'>",
          "  <h2>Constraint</h2>",
          "  <p>Do not hide unsupported renderer behavior.</p>",
          "</ef-print-callout>"
        )
      }
    ]
  },

  "ef-print-figure": {
    slug: "figure",
    title: "Figure",
    category: "Media",
    capability: "P0 portable",
    maturity: "implemented / cross-browser evidence",
    summary: "A print-aware wrapper around native figure semantics that requests caption cohesion without replacing figure, image, SVG, or figcaption HTML.",
    caution: "Oversized figures may still fragment or scale according to consumer and renderer rules; Folio does not crop them to force a page fit.",
    examples: [
      {
        title: "Image figure",
        note: "Native figure and figcaption remain the semantic source.",
        html: h(
          "<ef-print-figure>",
          "  <figure>",
          "    <div class='folio-figure-box'>Architecture image</div>",
          "    <figcaption>Figure 1. Application → Folio → renderer.</figcaption>",
          "  </figure>",
          "</ef-print-figure>"
        )
      },
      {
        title: "SVG diagram",
        note: "Application-generated diagrams remain ordinary SVG inside the wrapper.",
        html: h(
          "<ef-print-figure>",
          "  <figure>",
          "    <svg role='img' aria-label='Three architecture stages' viewBox='0 0 300 70'><rect x='1' y='10' width='80' height='45'></rect><rect x='110' y='10' width='80' height='45'></rect><rect x='219' y='10' width='80' height='45'></rect></svg>",
          "    <figcaption>Three-stage print pipeline.</figcaption>",
          "  </figure>",
          "</ef-print-figure>"
        )
      },
      {
        title: "Evidence figure",
        note: "Captions receive a restrained print treatment and stay associated with bounded figures where possible.",
        html: h(
          "<ef-print-figure>",
          "  <figure>",
          "    <blockquote>Observed output stayed within printable bounds.</blockquote>",
          "    <figcaption>Figure 3. Geometry experiment summary.</figcaption>",
          "  </figure>",
          "</ef-print-figure>"
        )
      }
    ]
  },

  "ef-print-table": {
    slug: "table",
    title: "Table",
    category: "Structured data",
    capability: "P0 portable · named-page behavior renderer-sensitive",
    maturity: "experiment-backed",
    summary: "A responsive screen container and print contract for native semantic tables, including repeated-header intent, row break avoidance, wrapping, and numeric alignment.",
    caution: "Very wide tables still need an authored strategy such as a landscape named page. Folio will not shrink text to illegibility.",
    examples: [
      {
        title: "Data table",
        note: "Keep caption, thead, tbody, th, and td as native table semantics.",
        html: h(
          "<ef-print-table>",
          "  <table>",
          "    <caption>Quarterly results</caption>",
          "    <thead><tr><th>Quarter</th><th data-align='number'>Revenue</th></tr></thead>",
          "    <tbody><tr><td>Q1</td><td data-align='number'>$125,000</td></tr><tr><td>Q2</td><td data-align='number'>$148,000</td></tr></tbody>",
          "  </table>",
          "</ef-print-table>"
        )
      },
      {
        title: "Long text cells",
        note: "Cells wrap rather than clipping or forcing unreadably small type.",
        html: h(
          "<ef-print-table>",
          "  <table>",
          "    <thead><tr><th>Finding</th><th>Interpretation</th></tr></thead>",
          "    <tbody><tr><td>Renderer variation</td><td>Physical pagination can change with fonts, browser version, page size, and content.</td></tr></tbody>",
          "  </table>",
          "</ef-print-table>"
        )
      },
      {
        title: "Wide comparison",
        note: "On narrow screens the wrapper contains horizontal scrolling; print keeps the actual table available for an authored page strategy.",
        html: h(
          "<ef-print-table style='--ef-print-table-screen-min-width:42rem'>",
          "  <table>",
          "    <thead><tr><th>Renderer</th><th>Margins</th><th>Counters</th><th>Footnotes</th><th>Bleed</th></tr></thead>",
          "    <tbody><tr><td>Portable browser</td><td>Basic</td><td>Varies</td><td>No guarantee</td><td>No guarantee</td></tr></tbody>",
          "  </table>",
          "</ef-print-table>"
        )
      }
    ]
  },

  "ef-print-code": {
    slug: "code",
    title: "Code",
    category: "Technical content",
    capability: "P0 portable",
    maturity: "implemented / cross-browser evidence",
    summary: "A print-safe wrapper for native pre/code content with controlled monospace typography and wrapping that prevents long lines from clipping the page.",
    caution: "Syntax highlighting is application-owned. Essential meaning must not depend on color alone.",
    examples: [
      {
        title: "Folio markup",
        note: "Long markup remains selectable text and wraps instead of creating page overflow.",
        html: h(
          "<ef-print-code>",
          "  <pre><code>&lt;ef-print-section break-before='page'&gt;...&lt;/ef-print-section&gt;</code></pre>",
          "</ef-print-code>"
        )
      },
      {
        title: "F# example",
        note: "Folio does not require a client-side syntax highlighter.",
        html: h(
          "<ef-print-code>",
          "  <pre><code>type PrintIntent = Portable | ChromiumMargin | Enhanced</code></pre>",
          "</ef-print-code>"
        )
      },
      {
        title: "Long command",
        note: "pre-wrap and overflow wrapping protect physical print width.",
        html: h(
          "<ef-print-code style='--ef-print-code-font-size:.82em'>",
          "  <pre><code>npx --package=@echelon-foundry/repository-operating-system ros verify --json</code></pre>",
          "</ef-print-code>"
        )
      }
    ]
  },

  "ef-print-toc": {
    slug: "toc",
    title: "Table of Contents",
    category: "Navigation",
    capability: "P0 authored pages · P3 automatic target counters",
    maturity: "implemented / capability-bound",
    summary: "A semantic contents wrapper for native navigation and lists, with authored page-number presentation in P0 and explicit separation from automatic target-page counters.",
    caution: "Automatic page-number lookup from links is not a portable browser capability. Do not calculate TOC pages from DOM height.",
    examples: [
      {
        title: "Authored page numbers",
        note: "Use ordinary navigation semantics with explicit page values when known.",
        html: h(
          "<ef-print-toc>",
          "  <nav aria-label='Contents'><ol>",
          "    <li><a href='#summary'>Executive summary</a><span data-page>2</span></li>",
          "    <li><a href='#evidence'>Evidence</a><span data-page>7</span></li>",
          "  </ol></nav>",
          "</ef-print-toc>"
        )
      },
      {
        title: "Contents without page values",
        note: "A TOC remains useful as semantic navigation even when automatic target counters are unavailable.",
        html: h(
          "<ef-print-toc>",
          "  <nav aria-label='Contents'><ol>",
          "    <li><a href='#context'>Context</a></li>",
          "    <li><a href='#decision'>Decision</a></li>",
          "  </ol></nav>",
          "</ef-print-toc>"
        )
      },
      {
        title: "Nested contents",
        note: "Applications may retain normal nested-list hierarchy for subsection structure.",
        html: h(
          "<ef-print-toc>",
          "  <nav aria-label='Contents'><ol>",
          "    <li><a href='#one'>1. Architecture</a><span data-page>3</span></li>",
          "    <li><a href='#two'>2. Evidence</a><span data-page>9</span></li>",
          "  </ol></nav>",
          "</ef-print-toc>"
        )
      }
    ]
  },

  "ef-print-note": {
    slug: "note",
    title: "Note",
    category: "Annotations",
    capability: "P0 in-flow note · P3 footnote/sidenote enhancement",
    maturity: "implemented / cross-browser evidence",
    summary: "An in-flow annotation primitive for notes, caveats, references, and explanatory material without pretending to provide automatic footnote placement.",
    caution: "Automatic footnotes, bottom-of-page placement, and true margin notes remain enhanced-renderer capabilities.",
    examples: [
      {
        title: "Evidence note",
        note: "Use role='note' when it improves the accessibility relationship for the consuming document.",
        html: h(
          "<ef-print-note role='note'>",
          "  Chromium validation used a controlled renderer version and does not prove identical output in every browser.",
          "</ef-print-note>"
        )
      },
      {
        title: "Reference note",
        note: "Short notes request keep-together but remain ordinary source-order content.",
        html: h(
          "<ef-print-note>",
          "  <strong>Reference.</strong> See Appendix B for the complete evidence record.",
          "</ef-print-note>"
        )
      },
      {
        title: "Custom note token",
        note: "The note rule and text size are themeable through stable Folio tokens.",
        html: h(
          "<ef-print-note style='--ef-print-note-accent:#555; --ef-print-note-font-size:.84em'>",
          "  Renderer-specific page placement is intentionally not implied.",
          "</ef-print-note>"
        )
      }
    ]
  }
};
