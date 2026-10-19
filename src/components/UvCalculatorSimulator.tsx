import { useState } from "react";
import { Calculator } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { educationalEstimate } from "@/lib/cecuv-simulation";

export function UvCalculatorSimulator() {
  const [liters, setLiters] = useState(1);
  const [conc, setConc] = useState(50);
  const { minutes, cycles, reduction } = educationalEstimate(liters, conc);
  return <div className="calc-box metric-card">
    <div className="card-top"><span><Calculator/> MINI-SIMULADOR CECUV</span><small className="badge">Estimación</small></div>
    <label className="calc-row"><span>Volumen a tratar <b>{liters.toFixed(1)} L</b></span>
      <Slider min={0.5} max={5} step={0.5} value={[liters]} onValueChange={v => setLiters(v[0] ?? liters)}/></label>
    <label className="calc-row"><span>Concentración inicial Cr(VI) <b>{conc} mg/L</b></span>
      <Slider min={10} max={200} step={5} value={[conc]} onValueChange={v => setConc(v[0] ?? conc)}/></label>
    <div className="calc-results">
      <div><small>Tiempo recomendado</small><strong>{minutes}<sup>min</sup></strong>{cycles > 1 && <em>{cycles} ciclos</em>}</div>
      <div><small>Reducción estimada</small><strong>{reduction.toFixed(0)}<sup>%</sup></strong></div>
    </div>
    <div className="calc-bar"><i style={{ width: `${reduction}%` }}/></div>
    <p className="metric-footer">Valores teóricos con fines educativos (TiO₂ 1.0 g/L, UV-A 365 nm).</p>
  </div>;
}
