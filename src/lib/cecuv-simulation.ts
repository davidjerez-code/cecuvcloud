export function kineticConcentration(dose: number, power: number, minutes: number) {
  return 100 * Math.exp(-0.00034 * dose * power * minutes);
}

export function operatingOutputs(running: boolean, doorOpen: boolean, uv: number) {
  const active = running && !doorOpen;
  return { uv: active ? uv : 0, rpm: active ? 420 : 0 };
}

export function educationalEstimate(liters: number, concentration: number) {
  const raw = 45 + (liters - 0.5) * 9 + (concentration - 10) * 0.25;
  const minutes = Math.round(Math.min(90, Math.max(45, raw)));
  const cycles = Math.max(1, Math.ceil(raw / 90));
  const k = 0.03 * (50 / (concentration + 25));
  const reduction = Math.min(98, (1 - Math.exp(-k * minutes * 1.4)) * 100);
  return { minutes, cycles, reduction };
}
