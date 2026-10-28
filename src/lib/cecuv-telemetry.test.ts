import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { initialTelemetryState, telemetryReducer, telemetryCsv } from "./cecuv-telemetry";

const start = { type: "toggle-running", timestamp: "2026-10-28T12:00:00Z" } as const;
const tick = { type: "tick", timestamp: "2026-10-28T12:00:01Z", random: [0.5, 0.5, 0.5] } as const;
const door = { type: "toggle-door", timestamp: "2026-10-28T12:00:02Z" } as const;

describe("Registro y seguridad de la telemetría simulada", () => {
  it("conserva las muestras anteriores al abrir y cerrar la puerta", () => {
    const active = telemetryReducer(telemetryReducer(initialTelemetryState, start), {
      ...tick,
      random: [...tick.random],
    });
    const captured = structuredClone(active.samples);
    const opened = telemetryReducer(active, door);
    assert.deepEqual(opened.samples.slice(0, captured.length), captured);
    assert.equal(opened.samples.at(-1)?.uv, 0);
    assert.equal(opened.samples.at(-1)?.rpm, 0);
    assert.equal(opened.running, false);
    const closed = telemetryReducer(opened, { ...door, timestamp: "2026-10-28T12:00:03Z" });
    assert.deepEqual(closed.samples.slice(0, captured.length), captured);
    assert.equal(closed.running, false);
    assert.equal(closed.samples.at(-1)?.uv, 0);
  });

  it("rechaza el arranque y los ticks pendientes con la puerta abierta", () => {
    const opened = telemetryReducer(initialTelemetryState, door);
    assert.equal(telemetryReducer(opened, start), opened);
    assert.equal(telemetryReducer(opened, { ...tick, random: [...tick.random] }), opened);
    assert.equal(opened.seconds, 0);
  });

  it("la parada manual registra cero sin borrar la radiación capturada", () => {
    const active = telemetryReducer(initialTelemetryState, start);
    const stopped = telemetryReducer(active, { ...start, timestamp: "2026-10-28T12:00:02Z" });
    assert.ok(stopped.samples[0]!.uv > 0);
    assert.equal(stopped.samples.at(-1)?.uv, 0);
    assert.equal(stopped.samples.at(-1)?.rpm, 0);
  });

  it("mantiene los límites de sensores y el máximo de 3600 registros", () => {
    let state = telemetryReducer(initialTelemetryState, start);
    for (let i = 0; i < 3700; i++) {
      state = telemetryReducer(state, { ...tick, random: [1, 0, 1] });
    }
    assert.equal(state.samples.length, 3600);
    assert.equal(state.seconds, 3700);
    assert.ok(state.temperature <= 34.2 && state.temperature >= 31.8);
    assert.ok(state.humidity >= 52 && state.humidity <= 56.5);
    assert.ok(state.sourceUv >= 8.3 && state.sourceUv <= 8.65);
  });

  it("exporta el mismo registro y sus valores seguros a CSV", () => {
    const state = telemetryReducer(telemetryReducer(initialTelemetryState, start), door);
    const rows = telemetryCsv("CEC-TEST", state.samples).split("\n");
    assert.equal(rows.length, state.samples.length + 1);
    assert.equal(rows[0]!.split(",").length, 7);
    assert.deepEqual(rows.at(-1)!.split(",").slice(4), ["0", "0", "abierto"]);
    assert.ok(rows[1]!.startsWith("CEC-TEST,"));
  });
});
