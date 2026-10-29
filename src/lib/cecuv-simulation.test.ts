import { describe, it as test } from "node:test";
import assert from "node:assert/strict";
import { kineticConcentration, operatingOutputs } from "./cecuv-simulation";

describe("Fotocatálisis y seguridad", () => {
  test("A tiempo cero la concentración relativa es 100%", () => {
    assert.equal(kineticConcentration(0.5, 10, 0), 100);
    assert.ok(Math.abs(kineticConcentration(2, 100, 120) - 100 * Math.exp(-8.16)) < 1e-8);
  });
  test("El interlock apaga UV y agitación aunque el ensayo esté iniciado", () => {
    assert.deepEqual(operatingOutputs(true, true, 8.42), { uv: 0, rpm: 0 });
  });
  test("Un ensayo detenido no alimenta UV ni agitación", () => {
    assert.deepEqual(operatingOutputs(false, false, 8.42), { uv: 0, rpm: 0 });
    assert.deepEqual(operatingOutputs(true, false, 8.42), { uv: 8.42, rpm: 420 });
  });
});
