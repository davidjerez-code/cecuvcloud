import assert from "node:assert/strict";
import { it } from "node:test";
import { materials, prototypeCost, savingsRange, formatCop } from "./cecuv-budget";

it("el total y el ahorro provienen de las partidas y referencias comerciales", () => {
  assert.equal(materials.length, 8);
  assert.equal(prototypeCost, 1844000);
  assert.deepEqual(savingsRange, { min: 69, max: 77 });
  assert.equal(formatCop(prototypeCost), "$1.844.000");
});
