const elementNames = [
  "ef-print-document",
  "ef-print-bounded-sheet",
  "ef-print-fit-region",
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
  "ef-print-metric",
  "ef-print-integrity",
  "ef-print-finding",
  "ef-print-callout",
  "ef-print-figure",
  "ef-print-table",
  "ef-print-code",
  "ef-print-toc",
  "ef-print-note",
  "ef-print-security-record",
  "ef-print-security-posture",
  "ef-print-security-invariant",
  "ef-print-security-evidence",
  "ef-print-security-unknown",
  "ef-print-security-exception",
];

const HTMLElementBase = globalThis.HTMLElement ?? class {};
class EchelonPrintElement extends HTMLElementBase {}

class EchelonFitRegionElement extends HTMLElementBase {
  connectedCallback() { this.fit(); globalThis.addEventListener?.("resize", this._fitOnResize ??= () => this.fit()); globalThis.document?.fonts?.ready?.then?.(() => this.fit()); }
  disconnectedCallback() { if (this._fitOnResize) globalThis.removeEventListener?.("resize", this._fitOnResize); }
  fit() {
    const profiles=(this.getAttribute("profiles")||"base").trim().split(/\s+/).filter(Boolean); let selected=profiles.at(-1)||"base"; let fits=false;
    for(const profile of profiles){ this.dataset.fitActive=profile; void this.offsetHeight; const box=this.getBoundingClientRect(); let overflow=0; for(const child of this.querySelectorAll("*")) for(const rect of child.getClientRects()) overflow=Math.max(overflow,rect.right-box.right,rect.bottom-box.bottom); selected=profile; if(overflow<=0){fits=true;break;} }
    this.dataset.fitStatus=fits?"fit":"overflow"; this.dataset.fitActive=selected; this.dispatchEvent?.(new CustomEvent("folio-fit",{bubbles:true,detail:{profile:selected,fits}}));
  }
}

export function registerPrintElements(registry = globalThis.customElements) {
  if (!registry) return;

  for (const name of elementNames) {
    if (!registry.get(name)) {
      registry.define(name, name === "ef-print-fit-region" ? EchelonFitRegionElement : class extends EchelonPrintElement {});
    }
  }
}

registerPrintElements();

export { elementNames };
