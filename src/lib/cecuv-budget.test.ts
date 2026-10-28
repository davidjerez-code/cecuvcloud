import assert from "node:assert/strict";
import { it } from "node:test";
import { materials, prototypeCost, savingsRange, formatCop } from "./cecuv-budget";
import { platformUrl } from "./cecuv-resources";

it("el total y el ahorro provienen de las partidas y referencias comerciales", () => {
  assert.equal(materials.length, 8);
  assert.equal(prototypeCost, 1844000);
  assert.deepEqual(savingsRange, { min: 69, max: 77 });
  assert.equal(formatCop(prototypeCost), "$1.844.000");
});

it("el QR utiliza el origen de cada despliegue y rechaza esquemas ejecutables", () => {
  assert.equal(
    platformUrl("https://cecuv-preview.vercel.app/"),
    "https://cecuv-preview.vercel.app",
  );
  assert.equal(platformUrl("http://localhost:4173"), "http://localhost:4173");
  assert.throws(() => platformUrl("javascript:alert(1)"));
});
