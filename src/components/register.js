const elementNames = [
  "ef-print-document",
  "ef-print-title-page",
  "ef-print-section",
  "ef-print-back-page",
  "ef-print-header",
  "ef-print-footer",
  "ef-print-page-number",
  "ef-print-columns",
  "ef-print-sidebar",
  "ef-print-layer",
  "ef-print-break",
  "ef-print-keep",
  "ef-print-callout",
  "ef-print-figure",
  "ef-print-table",
  "ef-print-code",
  "ef-print-toc",
  "ef-print-note",
];

class EchelonPrintElement extends HTMLElement {}

export function registerPrintElements(registry = globalThis.customElements) {
  if (!registry) return;

  for (const name of elementNames) {
    if (!registry.get(name)) {
      registry.define(name, class extends EchelonPrintElement {});
    }
  }
}

registerPrintElements();

export { elementNames };
