# Echelon Print Components

Reusable, installable web components and print-layout primitives for building professional documents in HTML and printing them to paper or PDF with a consistent visual system.

The project is **standards first**: semantic HTML and CSS express document and pagination intent, while renderer-specific capabilities are explicit. The goal is not to build a second pagination engine in JavaScript.

## Current status

Requirements and architecture research are established. Product implementation has not started yet.

Installed engineering foundation:

- Repository Operating System (ROS) 3.1.4
- State-Directed Engineering / Ordo (SDE) 1.3.0
- Visual Engineering 1.0.0
- Communication Engineering 1.0.0 operational context
- Limen 0.6.2

## Architecture direction

Core output will use light-DOM custom elements, semantic HTML, print CSS, design tokens, named pages, native fragmentation, and CSS multi-column layout.

Renderer capability is intentionally tiered:

- **P0 Portable browser:** common modern-browser print behavior.
- **P1 Chromium margin boxes:** repeated margin headers/footers plus current/total page counters.
- **P2 Deterministic Chromium:** controlled automated PDF export.
- **P3 Enhanced paged media:** optional publishing-engine capabilities such as richer running content, automatic footnotes, target page counters, sidenotes, bleed, and crop marks.

Limen is installed for a future interactive preview/configuration application. It is not intended to become the pagination engine.

## Start here

- [Comprehensive requirements](docs/requirements/PRINT-COMPONENTS-REQUIREMENTS.md)
- [Architecture](docs/architecture/PRINT-ARCHITECTURE.md)
- [Web print capability baseline](docs/research/PRINT-WEB-CAPABILITY-BASELINE-2026-09.md)
- [Project charter](PROJECT-CHARTER.md)
- [Current state](context/CURRENT-STATE.md)
- [Research queue](context/RESEARCH-QUEUE.md)

## First vertical slice

The first implementation must exercise difficult print behavior rather than a trivial component demo: title page, page art, normal body pages, repeated Chromium header/footer with Page X of Y, portable fallback, two-column content, side panel, multipage table, code block, landscape section, and back page, with deterministic PDF tests.
