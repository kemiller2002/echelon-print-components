const elementNames = [
  "ef-print-document",
  "ef-print-title-page",
  "ef-print-section",
  "ef-print-back-page",
  "ef-print-columns",
  "ef-print-sidebar",
  "ef-print-break",
  "ef-print-keep",
];

class EchelonPrintElement extends HTMLElement {}

export function registerPrintElements(registry = globalThis.customElements) {
  if (!registry) return;

  for (const name of elementNames) {
    if (!registry.get(name)) {
      registry.define(name, EchelonPrintElement);
    }
  }
}

registerPrintElements();

export { elementNames };
