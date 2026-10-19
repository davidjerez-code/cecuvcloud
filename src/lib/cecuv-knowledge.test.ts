import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { answerQuestion } from "./cecuv-knowledge";

describe("Consultas libres CECUV—Bot", () => {
  it("interpreta Cr(VI) con paréntesis", () => {
    assert.ok(answerQuestion("¿Por qué es peligroso el Cr(VI)?").topics.includes("Cromo hexavalente Cr(VI)"));
  });
  it("interpreta TiO₂ con subíndice", () => {
    assert.ok(answerQuestion("¿Qué dosis de TiO₂ se utiliza?").topics.includes("Dióxido de titanio TiO₂"));
  });
  it("responde la consulta después de un saludo", () => {
    assert.ok(answerQuestion("Hola, ¿cómo funciona el interlock?").topics.includes("Seguridad operativa e interlock"));
  });
  it("no relaciona fragmentos incidentales con electrónica", () => {
    assert.deepEqual(answerQuestion("receta de galletas").topics, []);
  });
});