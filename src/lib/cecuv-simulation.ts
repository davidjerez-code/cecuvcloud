export function kineticConcentration(dose: number, power: number, minutes: number) {
  return 100 * Math.exp(-0.00034 * dose * power * minutes);
}

export function operatingOutputs(running: boolean, doorOpen: boolean, uv: number) {
  const active = running && !doorOpen;
  return { uv: active ? uv : 0, rpm: active ? 420 : 0 };
}