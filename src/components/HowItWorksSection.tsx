import { useState } from "react";
import { Droplets, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  { icon: Droplets, emoji: "💧", title: "Captura del Agua", tone: "emerald", text: "El efluente contaminado de curtiembres ingresa a la cámara y se deposita en el vaso de ensayo, donde fluye en agitación antes de entrar en contacto con el fotocatalizador TiO₂.", visual: "flow" },
  { icon: Zap, emoji: "⚡", title: "Irradiación UV-A", tone: "violet", text: "Los fotones UV-A de 365 nm golpean las partículas de TiO₂. Sus electrones saltan de la banda de valencia a la de conducción, creando pares electrón–hueco listos para reaccionar.", visual: "photon" },
  { icon: ShieldCheck, emoji: "🛡️", title: "Descontaminación del Cr(VI)", tone: "emerald", text: "Los electrones excitados reducen el Cromo Hexavalente (tóxico y soluble) a Cromo Trivalente (menos tóxico y precipitable), que puede separarse del agua.", visual: "reduce" },
] as const;

export function HowItWorksSection() {
  const [active, setActive] = useState(0);
  return <section id="como-funciona" className="section-band"><div className="container">
    <div className="section-heading"><small>00 / ¿CÓMO FUNCIONA?</small><h2>¿Cómo funciona la CECUV?</h2><p>Tres pasos sencillos para entender cómo la luz limpia el agua.</p></div>
    <div className="hiw-grid">
      {steps.map((s, i) => { const Icon = s.icon; return (
        <Button variant="outline" key={s.title} className={`hiw-card ${s.tone} ${active === i ? "active" : ""}`} onClick={() => setActive(i)} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} aria-pressed={active === i}>
          <div className="hiw-head"><span className="hiw-num">PASO {i + 1}</span><Icon/></div>
          <div className={`hiw-visual ${s.visual}`} aria-hidden>
            {s.visual === "flow" && <><i/><i/><i/><i/></>}
            {s.visual === "photon" && <><b className="ti">TiO₂</b><i/><i/><i/><em>e⁻</em></>}
            {s.visual === "reduce" && <><b className="cr6">Cr(VI)</b><span className="arrow">→</span><b className="cr3">Cr(III)</b></>}
          </div>
          <h3>{s.emoji} {s.title}</h3>
          <p>{s.text}</p>
        </Button>
      ); })}
    </div>
  </div></section>;
}
