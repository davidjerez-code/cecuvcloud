import { operatingOutputs } from "./cecuv-simulation";

export type TelemetrySample = {
  timestamp: string;
  temperature: number;
  humidity: number;
  uv: number;
  rpm: number;
  doorOpen: boolean;
};

export type TelemetryState = {
  running: boolean;
  doorOpen: boolean;
  seconds: number;
  temperature: number;
  humidity: number;
  sourceUv: number;
  samples: TelemetrySample[];
};

export const initialTelemetryState: TelemetryState = {
  running: false,
  doorOpen: false,
  seconds: 0,
  temperature: 32.4,
  humidity: 54.8,
  sourceUv: 8.42,
  samples: [],
};

export type TelemetryAction =
  | { type: "sample" | "toggle-running" | "toggle-door"; timestamp: string }
  | { type: "tick"; timestamp: string; random: [number, number, number] };

export function telemetryReducer(state: TelemetryState, action: TelemetryAction): TelemetryState {
  let next = state;
  if (action.type === "tick") {
    if (!state.running || state.doorOpen) return state;
    next = {
      ...state,
      seconds: state.seconds + 1,
      temperature: +Math.min(
        34.2,
        Math.max(31.8, state.temperature + (action.random[0] - 0.5) * 0.4),
      ).toFixed(1),
      humidity: +Math.min(
        56.5,
        Math.max(52, state.humidity + (action.random[1] - 0.5) * 0.6),
      ).toFixed(1),
      sourceUv: +Math.min(
        8.65,
        Math.max(8.3, state.sourceUv + (action.random[2] - 0.5) * 0.06),
      ).toFixed(2),
    };
  } else if (action.type === "toggle-running") {
    if (state.doorOpen) return state;
    next = { ...state, running: !state.running };
  } else if (action.type === "toggle-door") {
    next = { ...state, doorOpen: !state.doorOpen, running: false };
  }

  const outputs = operatingOutputs(next.running, next.doorOpen, next.sourceUv);
  const sample: TelemetrySample = {
    timestamp: action.timestamp,
    temperature: next.temperature,
    humidity: next.humidity,
    uv: outputs.uv,
    rpm: outputs.rpm,
    doorOpen: next.doorOpen,
  };
  // Append an event rather than changing samples captured before the event.
  return { ...next, samples: [...state.samples.slice(-3599), sample] };
}

export function telemetryCsv(trialId: string, samples: readonly TelemetrySample[]) {
  return [
    "id_ensayo,timestamp,temperatura_c,humedad_pct,uv_mw_cm2,rpm,interlock",
    ...samples.map((sample) =>
      [
        trialId,
        sample.timestamp,
        sample.temperature,
        sample.humidity,
        sample.uv,
        sample.rpm,
        sample.doorOpen ? "abierto" : "cerrado",
      ].join(","),
    ),
  ].join("\n");
}
