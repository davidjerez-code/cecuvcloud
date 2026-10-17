import { describe, expect, test } from "bun:test";
import { kineticConcentration, operatingOutputs } from "./cecuv-simulation";

describe("Fotocatálisis y seguridad", () => {
  test("A tiempo cero la concentración relativa es 100%", () => {
    expect(kineticConcentration(0.5, 10, 0)).toBe(100);
    expect(kineticConcentration(2, 100, 120)).toBeCloseTo(100 * Math.exp(-8.16), 8);
  });
  test("El interlock apaga UV y agitación aunque el ensayo esté iniciado", () => {
    expect(operatingOutputs(true, true, 8.42)).toEqual({ uv: 0, rpm: 0 });
  });
  test("Un ensayo detenido no alimenta UV ni agitación", () => {
    expect(operatingOutputs(false, false, 8.42)).toEqual({ uv: 0, rpm: 0 });
    expect(operatingOutputs(true, false, 8.42)).toEqual({ uv: 8.42, rpm: 420 });
  });
});