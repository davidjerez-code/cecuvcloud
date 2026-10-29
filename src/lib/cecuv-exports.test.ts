import assert from "node:assert/strict";
import { it } from "node:test";
import { buildSimulationPdf } from "./cecuv-exports";

it("el PDF conserva offsets de bytes válidos con acentos y delimitadores", async () => {
  const blob = buildSimulationPdf(["Operador: José (OPENIN) \\ Prueba 🧪"]);
  assert.equal(blob.type, "application/pdf");
  const data = await blob.text();
  const offset = Number(/startxref\n(\d+)/.exec(data)?.[1]);
  const bytes = new TextEncoder().encode(data);
  assert.equal(new TextDecoder().decode(bytes.slice(offset, offset + 4)), "xref");
  const entries = data.slice(offset).split("\n").slice(3, 9);
  entries.forEach((entry, index) => {
    const position = Number(entry.slice(0, 10));
    assert.ok(new TextDecoder().decode(bytes.slice(position)).startsWith(`${index + 1} 0 obj`));
  });
  assert.ok(data.includes("Jose \\(OPENIN\\) \\\\ Prueba ?"));
});
