import fs from "node:fs";
import path from "node:path";
import { coreComponentMetadata } from "./core-component-metadata.mjs";

const root = process.cwd();
const output = path.join(root, "site-dist");
const registerSource = fs.readFileSync(path.join(root, "src/components/register.js"), "utf8");

const registered = [...registerSource.matchAll(/"(ef-print-[a-z-]+)"/g)].map(match => match[1]);
const uniqueRegistered = [...new Set(registered)];

const components = {
  "ef-print-document": {
    slug: "document",
    title: "Document",
    category: "Document structure",
    capability: "P0 portable",
    maturity: "implemented",
    summary: "Top-level print intent wrapper for a complete semantic document. It does not synthesize pages or own document data.",
    caution: "Page size and margin are currently stylesheet-level tokens; the wrapper itself does not create a synthetic page model.",
    examples: [
      {
        title: "Quarterly report",
        note: "A complete report shell with ordinary semantic headings and body content.",
        html: `<ef-print-document>
  <header>
    <p class="folio-kicker">Quarterly review</p>
    <h1>Operational Readiness</h1>
    <p class="folio-meta">Prepared 22 September 2026</p>
  </header>
  <hr class="folio-rule">
  <main class="folio-stack">
    <section>
      <h2>Executive summary</h2>
      <p>Folio keeps document meaning in ordinary HTML while reusable print primitives express layout intent.</p>
    </section>
    <section>
      <h2>Decision posture</h2>
      <p>The browser or selected renderer owns pagination.</p>
    </section>
  </main>
</ef-print-document>`
      },
      {
        title: "Decision memo",
        note: "A compact memo using the same document wrapper without a page-layout runtime.",
        html: `<ef-print-document>
  <article class="folio-stack">
    <p class="folio-kicker">Decision memo</p>
    <h1>Renderer capability policy</h1>
    <p class="folio-meta">Owner: Platform Engineering</p>
    <div class="folio-callout">
      <strong>Decision.</strong> Use explicit P0–P3 capability tiers rather than hiding renderer differences.
    </div>
    <h2>Rationale</h2>
    <p>Mainstream browsers do not expose identical paged-media features.</p>
  </article>
</ef-print-document>`
      },
      {
        title: "Technical handoff",
        note: "Semantic lists, code-like metadata, and status content remain ordinary HTML.",
        html: `<ef-print-document>
  <main class="folio-stack">
    <p class="folio-kicker">Engineering handoff</p>
    <h1>Print pipeline</h1>
    <p>Required verification:</p>
    <ol>
      <li>Wait for document assets.</li>
      <li>Select the declared renderer profile.</li>
      <li>Export or print with known settings.</li>
    </ol>
    <p class="folio-meta">Core layout stays standards-first and framework-independent.</p>
  </main>
</ef-print-document>`
      }
    ]
  },

  "ef-print-title-page": {
    slug: "title-page",
    title: "Title Page",
    category: "Document structure",
    capability: "P0 portable",
    maturity: "implemented",
    summary: "A document cover/title region that requests a page break after itself using native fragmentation.",
    caution: "Portable title-page layout is in-flow content. Full-bleed art and background output still depend on renderer and print-background policy.",
    examples: [
      {
        title: "Centered report cover",
        note: "A restrained professional cover using ordinary title and metadata content.",
        html: `<ef-print-document>
  <ef-print-title-page>
    <div class="folio-title-layout">
      <p class="folio-kicker">Echelon Foundry</p>
      <h1>Architecture Review</h1>
      <p>State-directed modernization program</p>
      <p class="folio-meta">September 2026 · Confidential</p>
    </div>
  </ef-print-title-page>
  <p>Body content begins after the title page.</p>
</ef-print-document>`
      },
      {
        title: "Bottom-aligned cover",
        note: "The component expresses page intent; the consumer controls cover composition.",
        html: `<ef-print-document>
  <ef-print-title-page>
    <div class="folio-title-layout folio-title-layout--bottom">
      <p class="folio-kicker">Research package</p>
      <h1>Browser Print Capability Baseline</h1>
      <p class="folio-meta">Evidence-backed renderer guidance</p>
    </div>
  </ef-print-title-page>
  <h2>Abstract</h2>
  <p>Document content remains useful without custom-element upgrade.</p>
</ef-print-document>`
      },
      {
        title: "Artwork cover",
        note: "Decorative page art is content-layer presentation, not a portable @page background guarantee.",
        html: `<ef-print-document>
  <ef-print-title-page>
    <div class="folio-title-art">
      <p class="folio-kicker">Folio / Print system</p>
      <h1>Annual Review</h1>
      <p>Standards-first document composition</p>
    </div>
  </ef-print-title-page>
  <p>Essential title text is present in the document source, not only in background graphics.</p>
</ef-print-document>`
      }
    ]
  },

  "ef-print-section": {
    slug: "section",
    title: "Section",
    category: "Document structure",
    capability: "P0 portable",
    maturity: "implemented",
    summary: "Block-level section wrapper with explicit optional page-break intent before or after the section.",
    caution: "A requested break is pagination intent, not a guarantee that every renderer will produce identical physical pagination.",
    examples: [
      {
        title: "Ordinary body section",
        note: "Use semantic headings inside the print section rather than replacing document semantics.",
        html: `<ef-print-document>
  <ef-print-section>
    <p class="folio-kicker">01 / Context</p>
    <h1>Executive summary</h1>
    <p>Folio owns reusable print presentation; the application owns the report's meaning and content.</p>
  </ef-print-section>
</ef-print-document>`
      },
      {
        title: "Start on a new page",
        note: "The break-before attribute maps to native CSS page fragmentation.",
        html: `<ef-print-document>
  <p>Previous section content ends here.</p>
  <ef-print-section break-before="page">
    <p class="folio-kicker">Appendix A</p>
    <h1>Detailed evidence</h1>
    <p>This section requests a new physical page before it.</p>
  </ef-print-section>
</ef-print-document>`
      },
      {
        title: "End with a page break",
        note: "Useful when the following content must begin on a fresh page.",
        html: `<ef-print-document>
  <ef-print-section break-after="page">
    <p class="folio-kicker">Terms</p>
    <h1>Agreement terms</h1>
    <p>The section requests a page break after this content.</p>
  </ef-print-section>
  <h2>Signature page</h2>
  <p>The next content begins after the requested break.</p>
</ef-print-document>`
      }
    ]
  },

  "ef-print-back-page": {
    slug: "back-page",
    title: "Back Page",
    category: "Document structure",
    capability: "P0 portable",
    maturity: "implemented",
    summary: "Terminal document region for contact information, closing content, legal notes, or branded back matter.",
    caution: "The current component is a structural wrapper. Insert an explicit page break before it when a dedicated final page is required.",
    examples: [
      {
        title: "Contact close",
        note: "An explicit page break creates a dedicated terminal page.",
        html: `<ef-print-document>
  <p>Final body paragraph.</p>
  <ef-print-break page></ef-print-break>
  <ef-print-back-page>
    <div class="folio-back folio-back--center">
      <p class="folio-kicker">Echelon Foundry</p>
      <h1>Thank you.</h1>
      <p>echelonfoundry.com</p>
    </div>
  </ef-print-back-page>
</ef-print-document>`
      },
      {
        title: "Legal back matter",
        note: "Back-page content stays semantic and selectable rather than becoming a flattened image.",
        html: `<ef-print-document>
  <ef-print-break page></ef-print-break>
  <ef-print-back-page>
    <div class="folio-back">
      <h2>Document notice</h2>
      <p>This material is provided for the intended recipients and should be handled according to the applicable policy.</p>
      <p class="folio-meta">Document ID: EF-2026-091</p>
    </div>
  </ef-print-back-page>
</ef-print-document>`
      },
      {
        title: "Branded final statement",
        note: "Consumers can compose a quiet closing page without changing Folio internals.",
        html: `<ef-print-document>
  <ef-print-break page></ef-print-break>
  <ef-print-back-page>
    <div class="folio-back">
      <p class="folio-kicker">Decision posture</p>
      <h1>Evidence before certainty.</h1>
      <p>Folio preserves source meaning while the selected renderer owns physical pagination.</p>
    </div>
  </ef-print-back-page>
</ef-print-document>`
      }
    ]
  },

  "ef-print-columns": {
    slug: "columns",
    title: "Columns",
    category: "Flow layout",
    capability: "P0 portable",
    maturity: "experiment-backed",
    summary: "Native CSS multicolumn flow for report, editorial, and digest layouts that participate in browser fragmentation.",
    caution: "Column behavior has experiment evidence, but content geometry still depends on renderer, fonts, page size, and the material being fragmented.",
    examples: [
      {
        title: "Two-column report",
        note: "The default component uses two native CSS columns.",
        html: `<ef-print-document>
  <h1>Findings</h1>
  <ef-print-columns>
    <p>Native multicolumn layout allows text to flow across columns while remaining one semantic source sequence.</p>
    <p>Folio avoids positioned synthetic columns because they interact poorly with pagination and accessibility.</p>
    <p>Keep important figures and blocks tested under real print fragmentation.</p>
    <p>Renderer differences remain explicit rather than hidden behind DOM measurement.</p>
  </ef-print-columns>
</ef-print-document>`
      },
      {
        title: "Three-column digest",
        note: "Consumers may tune count through the documented custom property.",
        html: `<ef-print-document>
  <h1>Research digest</h1>
  <ef-print-columns style="--ef-print-column-count: 3; --ef-print-column-gap: .2in">
    <p>Evidence record one summarizes pagination observations.</p>
    <p>Evidence record two captures page-margin behavior.</p>
    <p>Evidence record three covers multicolumn fragmentation.</p>
    <p>Evidence record four records sidebar geometry limits.</p>
    <p>Evidence record five captures multipage table output.</p>
  </ef-print-columns>
</ef-print-document>`
      },
      {
        title: "Loose two-column reading",
        note: "Column gap can be widened without introducing a second layout engine.",
        html: `<ef-print-document>
  <p class="folio-kicker">Field notes</p>
  <ef-print-columns style="--ef-print-column-gap: .42in">
    <h2>Observation</h2>
    <p>The browser remains responsible for balancing and fragmentation.</p>
    <h2>Constraint</h2>
    <p>Do not place domain meaning in visual column position alone.</p>
    <h2>Recommendation</h2>
    <p>Validate long real-world content rather than only short screen examples.</p>
  </ef-print-columns>
</ef-print-document>`
      }
    ]
  },

  "ef-print-sidebar": {
    slug: "sidebar",
    title: "Sidebar",
    category: "Flow layout",
    capability: "P0 candidate",
    maturity: "provisional",
    summary: "In-flow main/rail composition using CSS Grid as the current side-panel candidate.",
    caution: "Grid sidebar fragmentation is intentionally provisional. Current evidence proves bounded marker preservation/separation, not a universal cross-browser paginated guarantee.",
    examples: [
      {
        title: "Evidence rail",
        note: "Main content stays first in source order and the rail follows it.",
        html: `<ef-print-document>
  <ef-print-sidebar>
    <main class="folio-sidebar-main">
      <h1>Recommendation</h1>
      <p>Adopt a standards-first print architecture and preserve renderer capability as explicit metadata.</p>
      <p>The main narrative remains the primary source-order content.</p>
    </main>
    <aside class="folio-sidebar-rail">
      <h2>Evidence</h2>
      <p>Chromium 153 experiment.</p>
      <p>Two-page bounded fixture.</p>
    </aside>
  </ef-print-sidebar>
</ef-print-document>`
      },
      {
        title: "Wider decision rail",
        note: "Rail width is a presentation token, but wider rails increase fragmentation risk and must be tested.",
        html: `<ef-print-document>
  <ef-print-sidebar style="--ef-print-sidebar-width: 2.1in">
    <section class="folio-sidebar-main">
      <h1>Decision context</h1>
      <p>Applications own content and domain decisions. Folio owns the reusable layout intent.</p>
    </section>
    <aside class="folio-sidebar-rail">
      <h2>Constraints</h2>
      <ul>
        <li>No synthetic pagination.</li>
        <li>Source order must remain logical.</li>
        <li>Fallback must preserve content.</li>
      </ul>
    </aside>
  </ef-print-sidebar>
</ef-print-document>`
      },
      {
        title: "Callout rail",
        note: "Use side rails for supplementary material, not content whose meaning depends on fixed physical alignment.",
        html: `<ef-print-document>
  <ef-print-sidebar>
    <article class="folio-sidebar-main">
      <h1>Implementation note</h1>
      <p>Grid is the leading portable side-rail candidate, but the public guarantee remains provisional until deeper geometry and browser evidence exists.</p>
    </article>
    <aside class="folio-sidebar-rail">
      <p class="folio-kicker">Status</p>
      <strong>Provisional</strong>
      <p>Test before relying on multipage alignment.</p>
    </aside>
  </ef-print-sidebar>
</ef-print-document>`
      }
    ]
  },

  "ef-print-break": {
    slug: "break",
    title: "Page Break",
    category: "Fragmentation",
    capability: "P0 portable",
    maturity: "implemented",
    summary: "Explicit native page-break intent without measuring the DOM or manufacturing synthetic pages.",
    caution: "The documentation preview draws a dashed screen marker. The marker is documentation-only; printed output uses native break-after behavior.",
    examples: [
      {
        title: "Between major sections",
        note: "The page attribute requests a physical page break after the element.",
        html: `<ef-print-document>
  <section>
    <h1>Executive summary</h1>
    <p>This content finishes the first major part.</p>
  </section>
  <ef-print-break page></ef-print-break>
  <section>
    <h1>Detailed findings</h1>
    <p>This content begins after the explicit page break.</p>
  </section>
</ef-print-document>`
      },
      {
        title: "Before a back page",
        note: "Pair the break with a terminal wrapper when the final material must start fresh.",
        html: `<ef-print-document>
  <p>Final body content.</p>
  <ef-print-break page></ef-print-break>
  <ef-print-back-page>
    <div class="folio-back">
      <h1>Appendix</h1>
      <p>Reference material begins on the next requested page.</p>
    </div>
  </ef-print-back-page>
</ef-print-document>`
      },
      {
        title: "Technical appendix boundary",
        note: "Explicit breaks are useful for authored structure; avoid using them to repair unpredictable layout by trial and error.",
        html: `<ef-print-document>
  <h2>Results</h2>
  <p>Experiment results and interpretation.</p>
  <ef-print-break page></ef-print-break>
  <p class="folio-kicker">Appendix B</p>
  <h1>Raw measurements</h1>
  <p>Detailed output follows on a fresh requested page.</p>
</ef-print-document>`
      }
    ]
  },

  "ef-print-keep": {
    slug: "keep",
    title: "Keep Together",
    category: "Fragmentation",
    capability: "P0 portable",
    maturity: "implemented / best-effort",
    summary: "Requests that a bounded content block avoid internal fragmentation using native break-inside behavior.",
    caution: "Avoidance is not absolute when the block is taller than the available page. Never hide overflow or shrink essential text to force a keep.",
    examples: [
      {
        title: "Callout block",
        note: "A compact callout is a good candidate for break-inside avoidance.",
        html: `<ef-print-document>
  <ef-print-keep>
    <div class="folio-callout">
      <h2>Decision</h2>
      <p>Use Chromium page-margin boxes only in the capability tiers where they are actually supported.</p>
    </div>
  </ef-print-keep>
</ef-print-document>`
      },
      {
        title: "Figure and caption",
        note: "Keep a small figure with its caption when the combined block can fit on one page.",
        html: `<ef-print-document>
  <ef-print-keep>
    <figure class="folio-figure">
      <div class="folio-figure-box">Architecture diagram</div>
      <figcaption>Figure 1. Application content flows through Folio intent into the selected renderer.</figcaption>
    </figure>
  </ef-print-keep>
</ef-print-document>`
      },
      {
        title: "Approval block",
        note: "Short signature or approval blocks should not split when sufficient page space exists.",
        html: `<ef-print-document>
  <ef-print-keep>
    <section class="folio-card">
      <h2>Approval</h2>
      <p><strong>Decision owner:</strong> Engineering</p>
      <p><strong>Status:</strong> Accepted</p>
      <p class="folio-meta">The browser may still fragment an oversized keep block.</p>
    </section>
  </ef-print-keep>
</ef-print-document>`
      }
    ]
  }
};

Object.assign(components, coreComponentMetadata);

const escapeHtml = value => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

const stripIndent = value => value.trim();

function header(rootPath) {
  return `<header class="site-header">
  <div class="nav-shell">
    <div class="brand">
      <a class="brand-link" href="${rootPath}">
        <span class="brand-mark" aria-hidden="true">EF</span>
        <span>Echelon / Foundry</span>
      </a>
      <span class="brand-subtitle">Folio / Print system</span>
    </div>
    <nav class="site-nav" aria-label="Primary">
      <a href="${rootPath}">Overview</a>
      <a href="${rootPath}#components">Components</a>
      <a href="${rootPath}capabilities/">Capabilities</a>
      <a class="pill-link" href="${rootPath}agents/">Agent use</a>
    </nav>
  </div>
</header>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="footer-grid">
    <div>
      <p class="eyebrow">Echelon / Foundry</p>
      <p>Folio: semantic HTML, print CSS, and explicit renderer capabilities.</p>
    </div>
    <div><a href="https://echelonfoundry.com/">Echelon Foundry</a></div>
  </div>
  <p class="footer-note">Folio print system <span>Generated from the registered public component surface.</span></p>
</footer>`;
}

function page(title, rootPath, body) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="description" content="Folio, the Echelon Foundry standards-first print component system.">
  <title>${escapeHtml(title)} · Folio · Echelon Foundry</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Manrope:wght@400;500;600;700&family=Newsreader:opsz,wght@6..72,500;6..72,650&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${rootPath}assets/site.css">
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  ${header(rootPath)}
  ${body}
  ${footer()}
</body>
</html>`;
}

function componentNav(active) {
  const ordered = uniqueRegistered.map(name => components[name]);
  return `<nav class="component-nav" aria-label="Folio component catalog"><div class="component-nav-inner">
    <h2>Components</h2>
    <ul>${ordered.map(item => `<li><a href="../${item.slug}/"${item.slug === active ? ' aria-current="page"' : ""}>${escapeHtml(item.title)}</a></li>`).join("")}</ul>
  </div></nav>`;
}

function exampleBlock(component, example, index) {
  const demoPath = `../../demos/${component.slug}/${index + 1}.html`;
  return `<section class="example-block" data-example>
    <div class="example-heading">
      <div><span class="component-kicker">Example ${index + 1}</span><h2>${escapeHtml(example.title)}</h2></div>
      <p>${escapeHtml(example.note)}</p>
    </div>
    <div class="print-preview">
      <iframe src="${demoPath}" title="${escapeHtml(component.title)} example ${index + 1}: ${escapeHtml(example.title)}"></iframe>
    </div>
    <div class="example-actions">
      <a href="${demoPath}" target="_blank" rel="noopener">Open standalone print preview</a>
      <p class="preview-note">On narrow screens the embedded example uses a screen-only inspection layout. Printing and the standalone document keep Folio's physical print rules.</p>
    </div>
    <details>
      <summary>View HTML</summary>
      <pre><code>${escapeHtml(stripIndent(example.html))}</code></pre>
    </details>
  </section>`;
}

function demoPage(component, example) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(component.title)} · ${escapeHtml(example.title)} · Folio demo</title>
  <link rel="stylesheet" href="../../assets/folio-print.css">
  <link rel="stylesheet" href="../../assets/demo.css">
</head>
<body class="folio-demo">
  <div class="folio-paper">
    ${example.html}
  </div>
</body>
</html>`;
}

function componentPage(component) {
  const rootPath = "../../";
  const warning = component.caution
    ? `<div class="warning"><p><strong>Capability note.</strong> ${escapeHtml(component.caution)}</p></div>`
    : "";

  return page(component.title, rootPath, `<div class="docs-shell">
    ${componentNav(component.slug)}
    <main class="component-main" id="main">
      <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="../../">Folio</a><span>/</span><span>${escapeHtml(component.title)}</span></nav>
      <header class="component-header">
        <span class="component-kicker">${escapeHtml(component.category)}</span>
        <h1>${escapeHtml(component.title)}</h1>
        <p class="lead">${escapeHtml(component.summary)}</p>
        <div class="contract-grid">
          <div class="contract-item"><span class="metric-label">Element</span><strong>${escapeHtml(uniqueRegistered.find(name => components[name] === component))}</strong></div>
          <div class="contract-item"><span class="metric-label">Capability</span><strong>${escapeHtml(component.capability)}</strong></div>
          <div class="contract-item"><span class="metric-label">Maturity</span><strong>${escapeHtml(component.maturity)}</strong></div>
          <div class="contract-item"><span class="metric-label">Pagination owner</span><strong>Browser / selected renderer</strong></div>
        </div>
      </header>
      ${warning}
      <div class="examples">
        ${component.examples.map((example, index) => exampleBlock(component, example, index)).join("")}
      </div>
    </main>
  </div>`);
}

function capabilitiesPage() {
  const rootPath = "../";
  return page("Renderer capabilities", rootPath, `<main id="main" class="capability-page">
    <span class="eyebrow">Renderer contract</span>
    <h1>Capabilities are explicit.</h1>
    <p class="lead">Folio does not pretend every browser or PDF engine implements the same paged-media surface. The component API expresses document intent; capability tiers describe what the selected renderer can actually guarantee.</p>

    <div class="capability-grid">
      <article class="capability-card"><span class="capability-label">P0</span><h2>Portable browser</h2><p>Common standards-based document flow: print media, page size/margins, native fragmentation, multicolumn layout, semantic tables, and graceful fallback.</p></article>
      <article class="capability-card"><span class="capability-label">P1</span><h2>Chromium margin boxes</h2><p>Controlled Chromium support for authored page-margin headers/footers and physical Page X of Y counters.</p></article>
      <article class="capability-card"><span class="capability-label">P2</span><h2>Deterministic Chromium</h2><p>Pinned automation, font/image readiness, background policy, browser chrome disabled, and recorded renderer diagnostics.</p></article>
      <article class="capability-card"><span class="capability-label">P3</span><h2>Enhanced paged media</h2><p>Optional publishing engines for richer running content, target counters, footnotes, sidenotes, bleed, marks, and related advanced features.</p></article>
    </div>

    <h2>Current evidence posture</h2>
    <div class="table-scroll" role="region" aria-label="Renderer capability evidence" tabindex="0">
    <table>
      <thead><tr><th>Capability</th><th>Current posture</th><th>Evidence</th></tr></thead>
      <tbody>
        <tr><td>Passive light-DOM print wrappers</td><td>Accepted</td><td>PAGINATION-01 showed no geometry difference from native wrappers across tested engines.</td></tr>
        <tr><td>Native multicolumn flow</td><td>Accepted</td><td>COL-01 passed representative multipage fragmentation.</td></tr>
        <tr><td>Grid side rail</td><td>Provisional</td><td>SIDEBAR-01 preserved markers/separation in Chromium; deeper descendant/cross-browser proof remains open.</td></tr>
        <tr><td>Chromium page-margin boxes</td><td>P1/P2 only</td><td>MARGIN-01 validated static running content and Page X of Y in controlled Chromium.</td></tr>
        <tr><td>Header/footer/page-number primitives</td><td>Core intent shipped; repetition/counters capability-bound</td><td>Cross-browser primitive contract validates in-flow fallback; MARGIN-01 remains the physical counter evidence.</td></tr>
        <tr><td>Artwork layer</td><td>Accepted element-layer pattern</td><td>ART-01 validates that essential foreground content survives when page artwork is suppressed.</td></tr>
        <tr><td>Table primitive</td><td>Accepted wrapper contract</td><td>TABLE-01 validates long-table header repetition, row behavior, and named landscape output in controlled Chromium.</td></tr>
        <tr><td>Callout, figure, code, TOC, note</td><td>P0 core shipped</td><td>Cross-browser primitive contract plus generated mobile examples validate passive light-DOM/CSS behavior; enhanced placement remains capability-bound.</td></tr>
        <tr><td>Tagged/PDF-UA quality</td><td>Separate validation track</td><td>Semantic HTML is necessary but browser PDF tagging is not assumed.</td></tr>
      </tbody>
    </table>
    </div>

    <h2>Do not infer capability from markup</h2>
    <p>A document containing a Folio component is not evidence that every renderer can honor every requested physical-page feature. Consumers that require a feature must select or validate a renderer profile that provides it.</p>
  </main>`);
}

function agentsPage() {
  const rootPath = "../";
  return page("Agent use", rootPath, `<main id="main" class="agent-page">
    <span class="eyebrow">Agent operating contract</span>
    <h1>Use Folio as document intent, not a pagination engine.</h1>
    <p class="lead">Agents preserve semantic source HTML, choose the smallest Folio primitive that expresses layout intent, and keep renderer limitations explicit.</p>

    <h2>Required sequence</h2>
    <ol>
      <li>Start with the document's semantic HTML and reading order.</li>
      <li>Use ordinary headings, paragraphs, lists, tables, figures, and links directly.</li>
      <li>Add a Folio custom element only when it expresses reusable print/layout intent.</li>
      <li>Check the component page and capability tier before promising output behavior.</li>
      <li>Keep printable content useful before custom-element upgrade or when JavaScript is unavailable.</li>
      <li>Use CSS/native fragmentation before considering any browser code.</li>
      <li>Put preview/configurator application state in Limen/Ordo, not inside printable components.</li>
      <li>Run the print experiments and site checks before claiming a change is complete.</li>
    </ol>

    <h2>Mobile and screen preview behavior</h2>
    <p>Folio's public CSS is responsive on screens without changing the physical print contract. No JavaScript is required for responsive behavior.</p>
    <div class="instruction-grid">
      <article class="instruction-card">
        <span class="component-kicker">Adaptive component</span>
        <h3><code>ef-print-columns</code></h3>
        <p>At screen widths of 48rem or less, multicolumn content collapses to one readable column. Print media preserves the authored column count.</p>
      </article>
      <article class="instruction-card">
        <span class="component-kicker">Adaptive component</span>
        <h3><code>ef-print-sidebar</code></h3>
        <p>At screen widths of 48rem or less, the main/rail layout stacks into one column. Print media preserves the side-rail grid.</p>
      </article>
      <article class="instruction-card">
        <span class="component-kicker">Natural flow</span>
        <h3>Structural primitives</h3>
        <p>Structural and content primitives such as <code>document</code>, <code>title-page</code>, <code>section</code>, <code>back-page</code>, <code>callout</code>, <code>figure</code>, <code>code</code>, <code>toc</code>, <code>note</code>, <code>break</code>, and <code>keep</code> follow normal flow. Header/footer regions stack for screen inspection, and wide tables scroll inside their wrapper rather than overflowing the page.</p>
      </article>
      <article class="instruction-card">
        <span class="component-kicker">Contract boundary</span>
        <h3>Screen is inspection. Print is output.</h3>
        <p>Never change pagination rules merely to make a phone preview fit. Screen-only adaptations must disappear under <code>@media print</code>.</p>
      </article>
    </div>

    <h2>Boundary ownership</h2>
    <div class="table-scroll" role="region" aria-label="Folio boundary ownership" tabindex="0">
    <table>
      <thead><tr><th>Concern</th><th>Owner</th></tr></thead>
      <tbody>
        <tr><td>Document data and semantic meaning</td><td>Consuming application</td></tr>
        <tr><td>Reusable print layout intent and visual defaults</td><td>Folio</td></tr>
        <tr><td>Pagination, fragmentation, physical page construction</td><td>Browser or selected renderer</td></tr>
        <tr><td>Renderer capability and deterministic export policy</td><td>Capability profile / adapter</td></tr>
        <tr><td>Interactive preview/configuration state</td><td>Limen + Ordo/application</td></tr>
      </tbody>
    </table>
    </div>

    <h2>Do not</h2>
    <ul>
      <li>Build a JavaScript DOM-measure-and-repage engine in Folio core.</li>
      <li>Replace ordinary semantic HTML with custom tags merely for styling.</li>
      <li>Use Shadow DOM as the default printable-content container.</li>
      <li>Claim P1/P2 Chromium features as portable Firefox/Safari behavior.</li>
      <li>Promote the sidebar implementation from provisional to portable without new evidence.</li>
      <li>Hide clipping, overlap, or unsupported output behind silent visual approximation.</li>
      <li>Make important content exist only as a suppressible CSS background.</li>
      <li>Change pagination-sensitive tokens without print/PDF regression evidence.</li>
    </ul>

    <h2>Repository verification</h2>
    <pre><code>npm install
npm test
npm run site:check
npm run site:test:browser
./ros registry check
./ros validate</code></pre>

    <p>The repository source of truth for this guidance is <code>docs/AGENT-USAGE.md</code>.</p>
  </main>`);
}

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(path.join(output, "assets"), { recursive: true });
fs.mkdirSync(path.join(output, "components"), { recursive: true });
fs.mkdirSync(path.join(output, "demos"), { recursive: true });
fs.mkdirSync(path.join(output, "agents"), { recursive: true });
fs.mkdirSync(path.join(output, "capabilities"), { recursive: true });

const registeredSet = new Set(uniqueRegistered);
const metadataSet = new Set(Object.keys(components));
const missing = uniqueRegistered.filter(name => !metadataSet.has(name));
const stale = [...metadataSet].filter(name => !registeredSet.has(name));
if (missing.length || stale.length) {
  throw new Error(`Folio site metadata mismatch. Missing registered elements: ${missing.join(", ") || "none"}; stale metadata: ${stale.join(", ") || "none"}`);
}

for (const [name, component] of Object.entries(components)) {
  if (component.examples.length < 3) {
    throw new Error(`${name} requires at least three documentation examples.`);
  }

  const componentDir = path.join(output, "components", component.slug);
  const demoDir = path.join(output, "demos", component.slug);
  fs.mkdirSync(componentDir, { recursive: true });
  fs.mkdirSync(demoDir, { recursive: true });
  fs.writeFileSync(path.join(componentDir, "index.html"), componentPage(component));

  component.examples.forEach((example, index) => {
    fs.writeFileSync(path.join(demoDir, `${index + 1}.html`), demoPage(component, example));
  });
}

fs.copyFileSync(path.join(root, "site/site.css"), path.join(output, "assets/site.css"));
fs.copyFileSync(path.join(root, "site/demo.css"), path.join(output, "assets/demo.css"));
fs.copyFileSync(path.join(root, "src/styles/print.css"), path.join(output, "assets/folio-print.css"));
fs.writeFileSync(path.join(output, ".nojekyll"), "");

const ordered = uniqueRegistered.map(name => ({ name, ...components[name] }));
const indexBody = `<main id="main">
<section class="hero">
  <div>
    <span class="eyebrow">Echelon Foundry / Paged documents</span>
    <h1>Folio</h1>
    <p class="lead">A standards-first print component system for professional HTML documents. Folio expresses document and pagination intent with semantic HTML, passive light-DOM elements, and print CSS while the browser or selected renderer remains responsible for physical pagination.</p>
  </div>
  <div class="hero-stats" aria-label="Current Folio facts">
    <div class="hero-stat"><span class="metric-label">Registered components</span><strong>${ordered.length}</strong></div>
    <div class="hero-stat"><span class="metric-label">Rendered examples</span><strong>${ordered.reduce((total, item) => total + item.examples.length, 0)}</strong></div>
    <div class="hero-stat"><span class="metric-label">Core runtime dependencies</span><strong>0</strong></div>
    <div class="hero-stat"><span class="metric-label">Capability model</span><strong>P0 → P3</strong></div>
  </div>
</section>

<section class="content-section">
  <div class="section-heading">
    <div><span class="eyebrow">Operating principles</span><h2>The renderer still owns pages.</h2></div>
    <p>Folio makes page intent easier to declare without quietly becoming another browser layout engine.</p>
  </div>
  <div class="principle-grid">
    <article class="principle"><span class="category-label">01</span><h3>Semantic source first</h3><p>Headings, tables, figures, lists, and links stay native HTML. Custom elements are reserved for reusable print/layout intent.</p></article>
    <article class="principle"><span class="category-label">02</span><h3>CSS owns layout intent</h3><p>Page rules, breaks, columns, side rails, and print presentation remain standards-based and visible in the cascade.</p></article>
    <article class="principle"><span class="category-label">03</span><h3>Capabilities stay explicit</h3><p>Chromium-only margin boxes, deterministic export, and enhanced publishing features are never advertised as universal browser behavior.</p></article>
  </div>
</section>

<section class="content-section" id="components">
  <div class="section-heading">
    <div><span class="eyebrow">Implemented component catalog</span><h2>Only shipped primitives get pages.</h2></div>
    <p>Every registered Folio element has a dedicated page with three print-ready examples and its current evidence posture.</p>
  </div>
  <div class="component-grid">
    ${ordered.map(item => `<article class="component-card">
      <span class="category-label">${escapeHtml(item.category)}</span>
      <a href="components/${item.slug}/"><h3>${escapeHtml(item.title)}</h3></a>
      <p>${escapeHtml(item.summary)}</p>
      <span class="status" data-status="${item.maturity.includes("provisional") ? "provisional" : "current"}">${escapeHtml(item.capability)} · ${escapeHtml(item.maturity)}</span>
    </article>`).join("")}
  </div>
</section>

<section class="content-section">
  <div class="section-heading">
    <div><span class="eyebrow">Renderer profiles</span><h2>Portable does not mean identical.</h2></div>
    <a class="button-link" href="capabilities/">Read the capability model</a>
  </div>
  <div class="capability-grid">
    <article class="capability-card"><span class="capability-label">P0</span><h3>Portable browser</h3><p>Common document-flow and fragmentation primitives.</p></article>
    <article class="capability-card"><span class="capability-label">P1</span><h3>Chromium margin boxes</h3><p>Static running content and Page X of Y where validated.</p></article>
    <article class="capability-card"><span class="capability-label">P2</span><h3>Deterministic Chromium</h3><p>Controlled PDF generation and renderer diagnostics.</p></article>
    <article class="capability-card"><span class="capability-label">P3</span><h3>Enhanced paged media</h3><p>Optional advanced publishing-engine capabilities.</p></article>
  </div>
</section>

<section class="content-section">
  <div class="section-heading">
    <div><span class="eyebrow">Evidence boundary</span><h2>Implemented is not the same as universally guaranteed.</h2></div>
    <p>The original core primitive set is now registered, documented, and tested. Renderer-sensitive behavior such as repeated page-margin content, physical page counters, automatic TOC target pages, footnotes, sidenotes, bleed, and marks remains gated by the P1–P3 capability model.</p>
  </div>
</section>
</main>`;

fs.writeFileSync(path.join(output, "index.html"), page("Overview", "./", indexBody));
fs.writeFileSync(path.join(output, "capabilities/index.html"), capabilitiesPage());
fs.writeFileSync(path.join(output, "agents/index.html"), agentsPage());

const manifest = {
  generatedAt: new Date().toISOString(),
  componentCount: ordered.length,
  exampleCount: ordered.reduce((total, item) => total + item.examples.length, 0),
  registeredElements: uniqueRegistered,
  runtime: "static-documentation-no-browser-script",
  components: ordered.map(item => ({
    element: item.name,
    slug: item.slug,
    title: item.title,
    category: item.category,
    capability: item.capability,
    maturity: item.maturity,
    examples: item.examples.length
  }))
};

fs.writeFileSync(path.join(output, "site-manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`Built Folio documentation: ${manifest.componentCount} components, ${manifest.exampleCount} examples.`);
