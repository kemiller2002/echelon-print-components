import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("./fixtures/reports/tutela-security-record.html", import.meta.url), "utf8");
const register = await import("../src/components/register.js");

for (const name of ["ef-print-security-record","ef-print-security-posture","ef-print-security-invariant","ef-print-security-evidence","ef-print-security-unknown","ef-print-security-exception"]) {
  assert.ok(register.elementNames.includes(name), `${name} is registered`);
  assert.ok(html.includes(`<${name}`) || name === "ef-print-security-exception", `${name} fixture/contract is represented`);
}
for (const marker of ["TUTELA-EXAMPLE-001","BLOCKED","0123456789abcdef","SEC-UNK-001","SEC-INV-001","SEC-EVD-001","not a general claim that the system is secure"]) {
  assert.ok(html.includes(marker), `security record preserves ${marker}`);
}
assert.ok(!/security score/i.test(html), "Security Evidence Record does not introduce a composite security score");
console.log(JSON.stringify({status:"passed",fixture:"tutela-security-record.html"}));
