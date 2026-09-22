# Echelon Print Components architecture

## Current architecture

The current proposed architecture is documented in detail at
`docs/architecture/PRINT-ARCHITECTURE.md`.

The core is a document-intent layer over semantic HTML and CSS:

```text
Application content
  -> semantic HTML + print primitives
  -> print CSS + tokens + named page profiles
  -> selected renderer capability
  -> paper/PDF
```

## Accepted direction for experiments

- Printable structures use light DOM.
- Native semantic HTML remains preferred for ordinary content.
- Custom elements express reusable print/layout intent.
- CSS owns page flow, fragmentation, columns, and page profiles.
- JavaScript must not become a general pagination engine.
- Renderer-specific capability is explicit.
- Deterministic Chromium export is separated from core.
- Advanced paged-media engines are adapters/experiments, not core dependencies.
- Interactive preview/configuration state, if introduced, uses the installed Limen boundary.

## Capability boundaries

- **P0:** portable modern-browser print.
- **P1:** Chromium page-margin boxes and page counters.
- **P2:** deterministic controlled Chromium PDF export.
- **P3:** optional enhanced paged-media renderer.

A feature may be in the public component vocabulary while still requiring a
higher renderer capability. In that case its fallback and diagnostics are part
of the component contract.

## Architectural constraints

- Canonical records remain independent of model vendor or chat history.
- Source/DOM reading order remains semantically authoritative.
- Print behavior must not require network access from core.
- Core must remain framework independent.
- Runtime dependencies require explicit justification.
- Essential information must survive disabled print backgrounds.
- Unsupported features fail or degrade explicitly; they are never silently simulated.
- Generated views must not silently replace canonical source records.
