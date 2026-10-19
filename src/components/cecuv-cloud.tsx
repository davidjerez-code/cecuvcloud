import { useEffect, useMemo, useRef, useState } from "react";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { ProblemContextSection } from "@/components/ProblemContextSection";
import { FaqAccordion } from "@/components/FaqAccordion";
import { UvCalculatorSimulator } from "@/components/UvCalculatorSimulator";
import { TeamAndAcknowledgements } from "@/components/TeamAndAcknowledgements";
import {
  Activity, AlertTriangle, Atom, Bot, Box, CheckCircle2, ChevronRight,
  ClipboardList, Clock3, Download, Droplets, FileDown, FileSpreadsheet, FlaskConical, Gauge, GraduationCap,
  Heart, Leaf, Menu, Moon, Play, QrCode, RotateCcw, ShieldCheck, Sparkles,
  Sun, Thermometer, Users, Wind, X, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { answerQuestion } from "@/lib/cecuv-knowledge";
import { QRCodeSVG } from "qrcode.react";
import { kineticConcentration, operatingOutputs } from "@/lib/cecuv-simulation";

const PLATFORM_URL = "https://cecuvcloud.lovable.app";

const hotspots = [
  ["Chasis principal", "Madera Triplex Marino de 15 mm: resistente a la humedad y aislante térmico/radiativo."],
  ["Revestimiento optimizador", "Mylar aluminizado de alta reflexividad para una distribución UV homogénea."],
  ["Módulo de irradiación", "Lámparas y LED UV-A de 365 nm con intensidad regulable mediante PWM."],
  ["Plataforma de trabajo", "Bandeja AISI 304 y agitación magnética multipunto para evitar sedimentación de TiO₂."],
  ["Ventana de inspección", "Vidrio templado, película polarizada y filtro UV para supervisión ocular segura."],
  ["Acceso frontal ergonómico", "Puerta lateral con bisagras reinforced, manija y visor con filtro UV para una apertura segura."],
  ["Control térmico", "Extractores con trampas de luz que disipan calor sin permitir fugas UV."],
  ["IoT y seguridad", "ESP32, telemetría y microinterruptor interlock para apagado automático."],
] as const;

const bom = [
  ["Estructural", "Triplex marino 15 mm", "2 láminas", "$380.000"],
  ["Óptico", "Mylar aluminizado 95%", "4 m²", "$185.000"],
  ["Radiación", "Módulos LED UV-A 365 nm", "6", "$540.000"],
  ["Mecánico", "Bandeja AISI 304", "1", "$210.000"],
  ["Electrónico", "ESP32 + sensores", "1 kit", "$165.000"],
  ["Seguridad", "Interlock + filtro UV", "1 kit", "$128.000"],
  ["Térmico", "Extractores 120 mm", "2", "$96.000"],
  ["Mecánico", "Pistones neumáticos", "2", "$140.000"],
] as const;


const quickPrompts = [
  "¿Por qué es peligroso el Cr(VI)?",
  "¿Cómo actúa el TiO₂ con UV-A?",
  "¿Cuál es la ventaja económica?",
];

const WRITTEN_WORK_PDF = "/downloads/CABINA_EXPERIMENTAL_DE_CONTROL_UV_ESIS2026.pdf";

const methodologySteps = [
  ["01", "Toma de muestras", "Recolección controlada del efluente con rotulado, preservación y cadena básica de custodia."],
  ["02", "Caracterización inicial", "Registro de pH, turbidez, concentración de Cr(VI) y condiciones ambientales del ensayo."],
  ["03", "Acondicionamiento", "Homogeneización de la muestra y preparación del volumen experimental para la cabina."],
  ["04", "Dosificación de TiO₂", "Aplicación del catalizador entre 0.5 y 2.0 g/L según el diseño experimental."],
  ["05", "Montaje en bandeja", "Ubicación del vaso de precipitados sobre la bandeja AISI 304 con protección interna de Mylar."],
  ["06", "Agitación magnética", "Activación multipunto para mantener el TiO₂ suspendido y favorecer el contacto catalítico."],
  ["07", "Exposición UV-A", "Irradiación a 365 nm con intensidad regulada mediante PWM y condiciones seguras de operación."],
  ["08", "Registro de variables", "Captura de temperatura, humedad, intensidad UV, tiempo, RPM e interlock desde el módulo IoT."],
  ["09", "Seguimiento analítico", "Toma de alícuotas para estimar remoción de Cr(VI) y desempeño del proceso."],
  ["10", "Análisis cinético", "Ajuste de la curva C/C0 = e^(-k·t), eficiencia y comparación de escenarios DoE."],
] as const;

type ChatTurn = { role: "user" | "bot"; text: string; topics?: string[] };

const botChips = ["¿Por qué el Cr(VI) es peligroso?", "Simular reacción TiO₂ + UV-A", "¿Cómo funciona el Interlock?", "Sensores ESP32 / DHT22", "¿Cuál es la ventaja económica?", "Metodología del ensayo"];

function BotAnswer({ text, animate }: { text: string; animate: boolean }) {
  const [shown, setShown] = useState(animate ? 0 : text.length);
  useEffect(() => {
    if (!animate) return;
    let n = 0;
    const id = setInterval(() => { n += 6; setShown(Math.min(n, text.length)); if (n >= text.length) clearInterval(id); }, 16);
    return () => clearInterval(id);
  }, [text, animate]);
  const visible = text.slice(0, shown);
  const paragraphs = visible.split("\n\n");
  return <>{paragraphs.map((para, pi) => {
    const parts = para.split(/(?<=[.:])\s+(?=[A-ZÁÉÍÓÚÑ¿])/).filter(Boolean);
    if (parts.length < 2) return <p key={pi}>{para}</p>;
    return <ul key={pi} className="bot-bullets">{parts.map((s, si) => <li key={si}><CheckCircle2/><span>{s}</span></li>)}</ul>;
  })}{shown < text.length && <span className="bot-caret"/>}</>;
}

function BotPanel() {
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [chat, setChat] = useState<ChatTurn[]>([
    { role: "bot", text: "Hola, soy CECUV—Bot v2.0. Consulto la matriz de conocimiento del trabajo escrito del Semillero OPENIN. Pregúnteme sobre Cr(VI), fotocatálisis, sensores ESP32/DHT22, costos o metodología." },
  ]);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chat, thinking]);

  function send(question: string) {
    const q = question.trim();
    if (!q || thinking) return;
    setChat((prev) => [...prev, { role: "user", text: q }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      const reply = answerQuestion(q);
      setChat((prev) => [...prev, { role: "bot", text: reply.text, topics: reply.topics }]);
      setThinking(false);
    }, 650);
  }

  return <div className="bot-panel bot-v2">
    <div className="bot-head">
      <span className="bot-avatar"><Bot/></span>
      <div><h3>CECUV—Bot v2.0</h3><small className="bot-online"><i/> MATRIZ OPENIN</small></div>
      <em className="bot-tag">Semillero OPENIN</em>
    </div>
    <div className="bot-log" ref={logRef} aria-live="polite">
      {chat.map((turn, i) => turn.role === "user"
        ? <div key={i} className="bot-turn user"><p>{turn.text}</p></div>
        : <div key={i} className="bot-turn"><span className="bot-icon"><Sparkles/></span><div className="bot-bubble">
            <BotAnswer text={turn.text} animate={i > 0 && i === chat.length - 1}/>
            {turn.topics && turn.topics.length > 0 && <div className="bot-topics">{turn.topics.map((t) => <span key={t}><Atom/> {t}</span>)}</div>}
          </div></div>)}
      {thinking && <div className="bot-turn"><span className="bot-icon"><Sparkles/></span><div className="bot-bubble bot-typing"><i/><i/><i/></div></div>}
    </div>
    <div className="bot-prompts">{botChips.map((p) => <Button variant="outline" key={p} type="button" onClick={() => { setInput(p); inputRef.current?.focus(); }}>{p}</Button>)}</div>
    <form className="bot-form" onSubmit={(e) => { e.preventDefault(); send(input); }}>
      <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Escriba su pregunta…" aria-label="Pregunta para CECUV-Bot"/>
      <Button type="submit" size="icon" aria-label="Enviar pregunta" disabled={thinking || !input.trim()}><ChevronRight/></Button>
    </form>
  </div>;
}

function MiniLogo({ label }: { label: string }) {
  return <div className="institution-mark" aria-label={label}><span>{label}</span></div>;
}

function SectionHeading({ code, title, text }: { code: string; title: string; text: string }) {
  return <div className="section-heading reveal"><div className="section-code"><span>{code}</span><i /></div><h2>{title}</h2><p>{text}</p></div>;
}

function QrPattern() {
  return <div className="platform-qr"><QRCodeSVG value={PLATFORM_URL} size={220} marginSize={4} level="M" title="Código QR de CECUV-Cloud"/></div>;
}

function MethodologyDialog() {
  return <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline" className="method-trigger"><ClipboardList/> Metodología Experimental de 10 Pasos</Button>
    </DialogTrigger>
    <DialogContent className="method-dialog">
      <DialogHeader>
        <DialogTitle>Metodología Experimental de 10 Pasos</DialogTitle>
        <DialogDescription>Secuencia operativa para un ensayo fotocatalítico controlado en CECUV—Cloud.</DialogDescription>
      </DialogHeader>
      <div className="method-list">
        {methodologySteps.map(([number, title, description]) => <article key={number}>
          <span>{number}</span><div><h4>{title}</h4><p>{description}</p></div>
        </article>)}
      </div>
    </DialogContent>
  </Dialog>;
}

function pdfText(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[\\()]/g, "\\$&");
}

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 250);
}

function buildCertificatePdf(lines: string[]) {
  const textLines = lines.map(pdfText);
  const content = [
    "q 0.95 0.98 1 rg 0 0 612 792 re f Q",
    "0.05 0.18 0.24 RG 36 36 540 720 re S",
    "BT /F2 21 Tf 1 0 0 1 54 724 Tm (CECUV-Cloud) Tj ET",
    "BT /F1 11 Tf 1 0 0 1 54 704 Tm (Cabina Experimental de Control UV) Tj ET",
    ...textLines.map((line, index) => `BT /${index < 2 ? "F2" : "F1"} ${index < 2 ? 14 : 10} Tf 1 0 0 1 54 ${660 - index * 24} Tm (${line}) Tj ET`),
    "BT /F1 9 Tf 1 0 0 1 54 84 Tm (Semillero OPENIN - Universidad Cooperativa de Colombia - UCC) Tj ET",
  ].join("\n");
  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj\n",
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n",
    `6 0 obj\n<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (const obj of objects) {
    offsets.push(pdf.length);
    pdf += obj;
  }
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n `).join("\n");
  pdf += `\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([pdf], { type: "application/pdf" });
}

function Cabinet({ active, setActive }: { active: number; setActive: (n: number) => void }) {
  return <div className="cabinet-stage" aria-label="Modelo técnico interactivo de la cabina CECUV">
    <div className="scan-line" />
    <svg viewBox="0 0 760 560" role="img" aria-label="Cabina CECUV de madera con puerta frontal abierta, cámara UV y panel lateral">
      <defs>
        <linearGradient id="woodFront" x1="0" y1="0" x2="1" y2="1"><stop stopColor="var(--wood-light)"/><stop offset=".52" stopColor="var(--wood-mid)"/><stop offset="1" stopColor="var(--wood-shadow)"/></linearGradient>
        <linearGradient id="woodSide" x1="0" x2="1"><stop stopColor="var(--wood-mid)"/><stop offset="1" stopColor="var(--wood-dark)"/></linearGradient>
        <linearGradient id="woodTop" x1="0" y1="0" x2="1" y2="1"><stop stopColor="var(--wood-top)"/><stop offset="1" stopColor="var(--wood-light)"/></linearGradient>
        <linearGradient id="cavityWall" x1="0" y1="0" x2="1" y2="0"><stop stopColor="var(--cavity-dark)"/><stop offset="1" stopColor="var(--cabinet-inner)"/></linearGradient>
        <linearGradient id="steelTray" x1="0" y1="0" x2="1" y2="1"><stop stopColor="var(--steel-light)"/><stop offset=".48" stopColor="var(--steel)"/><stop offset="1" stopColor="var(--steel-dark)"/></linearGradient>
        <radialGradient id="uvChamber" cx=".42" cy=".38"><stop stopColor="var(--uv-core)"/><stop offset=".48" stopColor="var(--uv-liquid)"/><stop offset="1" stopColor="var(--cabinet-inner)"/></radialGradient>
        <pattern id="woodGrain" width="70" height="22" patternUnits="userSpaceOnUse"><path d="M0 7 C18 1 37 14 70 6 M0 17 C25 11 46 23 70 15" fill="none" stroke="var(--wood-grain)" strokeWidth="1" opacity=".42"/></pattern>
        <filter id="uvGlow" x="-60%" y="-100%" width="220%" height="300%"><feGaussianBlur stdDeviation="13" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="cabinetShadow" x="-30%" y="-30%" width="170%" height="190%"><feDropShadow dx="0" dy="17" stdDeviation="15" floodColor="var(--shadow-color)" floodOpacity=".38"/></filter>
        <clipPath id="chamberClip"><polygon points="276,142 512,113 512,368 276,400"/></clipPath>
      </defs>
      <ellipse cx="392" cy="512" rx="292" ry="32" fill="var(--stage-shadow)"/>
      <g filter="url(#cabinetShadow)">
        <polygon points="250,110 540,75 665,140 375,175" fill="url(#woodTop)" stroke="var(--wood-edge)" strokeWidth="4"/>
        <path d="M262 113L532 80L646 138L376 170Z" fill="url(#woodGrain)" opacity=".55"/>
        <polygon points="540,75 665,140 665,450 540,405" fill="url(#woodSide)" stroke="var(--wood-edge)" strokeWidth="5"/>
        <path d="M549 88L654 144V436L549 396Z" fill="url(#woodGrain)" opacity=".65"/>
        <g clipPath="url(#chamberClip)">
          <polygon points="326,170 566,140 566,398 326,430" fill="url(#uvChamber)"/>
          <polygon points="276,142 512,113 566,140 326,170" fill="var(--cavity-dark)"/>
          <polygon points="276,142 326,170 326,430 276,400" fill="url(#cavityWall)"/>
          <polygon points="512,113 566,140 566,398 512,368" fill="var(--cavity-dark)" opacity=".9"/>
          <polygon points="276,400 326,430 566,398 512,368" fill="var(--cabinet-inner)"/>
          <path d="M340 192L550 165M340 384L552 356" stroke="var(--mylar-line)" strokeWidth="1.6" opacity=".45"/>
          <path d="M333 178L560 148V388L333 420Z" fill="none" stroke="var(--mylar-line)" strokeWidth="2" opacity=".6"/>
          <ellipse cx="428" cy="392" rx="118" ry="24" fill="var(--uv-core)" opacity=".16" filter="url(#uvGlow)"/>
          {[0,1].map(i => <g key={i} transform={`translate(0 ${i*54})`}><line x1="352" y1="210" x2="508" y2="191" stroke="var(--uv-core)" strokeWidth="16" strokeLinecap="round" opacity=".45" filter="url(#uvGlow)"/><line x1="352" y1="210" x2="508" y2="191" stroke="var(--uv-lamp)" strokeWidth="8" strokeLinecap="round"/><rect x="336" y="202" width="20" height="16" rx="3" fill="var(--lamp-cap)" transform="rotate(-7 346 210)"/><rect x="504" y="183" width="20" height="16" rx="3" fill="var(--lamp-cap)" transform="rotate(-7 514 191)"/></g>)}
          <ellipse cx="420" cy="380" rx="96" ry="17" fill="var(--cavity-dark)" opacity=".55"/>
          <polygon points="322,332 474,313 510,334 354,355" fill="url(#steelTray)" stroke="var(--steel-edge)" strokeWidth="3"/>
          <polygon points="354,355 510,334 510,354 354,375" fill="var(--steel-dark)" stroke="var(--steel-edge)" strokeWidth="2"/>
          <polygon points="322,332 354,355 354,375 322,352" fill="var(--steel-dark)" stroke="var(--steel-edge)" strokeWidth="2" opacity=".85"/>
          <path d="M370 296L375 340C376 355 423 351 427 336L427 291" fill="var(--glass)" stroke="var(--glass-edge)" strokeWidth="2"/>
          <path d="M376 322Q400 332 423 317L425 336Q400 351 375 340Z" fill="var(--uv-solution)" opacity=".85"/>
          <ellipse cx="398" cy="291" rx="29" ry="9" fill="var(--glass)" stroke="var(--glass-edge)" strokeWidth="2"/>
          <circle cx="364" cy="347" r="3" fill="var(--primary)"/><circle cx="402" cy="343" r="3" fill="var(--primary)"/><circle cx="441" cy="338" r="3" fill="var(--primary)"/>
        </g>
        <path d="M250 110L540 75L540 405L250 445Z M276 142L512 113L512 368L276 400Z" fillRule="evenodd" fill="url(#woodFront)" stroke="var(--wood-edge)" strokeWidth="5"/>
        <path d="M258 119L531 86L531 396L258 430Z M276 142L512 113L512 368L276 400Z" fillRule="evenodd" fill="url(#woodGrain)"/>
        <path d="M276 142L512 113M276 142L276 400" stroke="var(--wood-top)" strokeWidth="3" opacity=".75" fill="none"/>
        <path d="M512 113L512 368M276 400L512 368" stroke="var(--wood-edge)" strokeWidth="4" opacity=".85" fill="none"/>
        <path d="M250 110L540 75M540 75L665 140" stroke="var(--wood-top)" strokeWidth="3" opacity=".7"/>
        <path d="M252 112L538 78M252 442L538 406M542 78L663 139M541 404L664 448" stroke="var(--wood-edge)" strokeWidth="5" strokeDasharray="13 8" opacity=".8" fill="none"/>
        <polygon points="250,445 540,405 665,450 375,494" fill="url(#woodTop)" stroke="var(--wood-edge)" strokeWidth="4" opacity=".95"/>
        <path d="M262 446L532 408L648 450L378 489Z" fill="url(#woodGrain)" opacity=".5"/>
        <polygon points="250,445 375,494 375,512 250,463" fill="var(--wood-dark)" stroke="var(--wood-edge)" strokeWidth="3"/>
        <polygon points="375,494 665,450 665,468 375,512" fill="url(#woodSide)" stroke="var(--wood-edge)" strokeWidth="3"/>
        <path d="M250 463L375 512L665 468" stroke="var(--wood-edge)" strokeWidth="4" fill="none" opacity=".85"/>
        <path d="M256 449L534 410" stroke="var(--wood-top)" strokeWidth="3" opacity=".6" fill="none"/>
        <polygon points="559,132 646,170 646,422 559,392" fill="var(--panel-face)" stroke="var(--wood-edge)" strokeWidth="3"/>
        <polygon points="573,158 633,182 633,240 573,219" fill="var(--screen-bezel)" stroke="var(--cabinet-stroke)" strokeWidth="3"/>
        <polygon points="580,169 625,186 625,227 580,211" fill="var(--screen-blue)"/>
        <text x="584" y="189" fill="var(--screen-text)" fontSize="8" fontFamily="monospace">UV 365nm</text><text x="584" y="203" fill="var(--screen-text)" fontSize="7" fontFamily="monospace">32.4°C SAFE</text>
        <circle cx="578" cy="242" r="7" fill="var(--success)"/><circle cx="601" cy="250" r="7" fill="var(--control-violet)"/><circle cx="624" cy="258" r="7" fill="var(--danger)"/>
        <polygon points="579,274 628,291 628,328 579,313" fill="var(--module-face)" stroke="var(--cabinet-stroke)" strokeWidth="2"/>
        <text x="585" y="295" fill="var(--primary)" fontSize="8" fontFamily="monospace">PWM 72%</text>
        <polygon points="580,340 628,356 628,396 580,382" fill="var(--module-face)" stroke="var(--cabinet-stroke)" strokeWidth="2"/>
        <circle cx="595" cy="363" r="5" fill="var(--primary)"/><path d="M610 363l10 4v8l-10-4z" fill="var(--port)"/>
        <polygon points="238,124 224,114 90,148 104,158" fill="url(#woodTop)" stroke="var(--wood-edge)" strokeWidth="3"/>
        <polygon points="104,158 90,148 90,456 104,464" fill="var(--wood-dark)" stroke="var(--wood-edge)" strokeWidth="3"/>
        <polygon points="238,124 104,158 104,464 238,432" fill="url(#woodFront)" stroke="var(--wood-edge)" strokeWidth="6"/>
        <path d="M230 139L112 169V448L230 420Z" fill="url(#woodGrain)" opacity=".5"/>
        <polygon points="219,156 123,180 123,420 219,398" fill="var(--filter-glass)" stroke="var(--wood-edge)" strokeWidth="6"/>
        <path d="M134 196L210 176M134 398L210 380" stroke="var(--glass-glint)" strokeWidth="2" opacity=".48"/>
        <rect x="230" y="180" width="12" height="38" rx="2" fill="var(--hinge)"/><rect x="230" y="348" width="12" height="38" rx="2" fill="var(--hinge)"/>
        <path d="M114 292v46" stroke="var(--handle)" strokeWidth="9" strokeLinecap="round"/>
      </g>
    </svg>
    {[[45,16],[47,52],[52,31],[54,64],[22,51],[12,69],[66,20],[80,60]].map(([x,y], i) => { const point = hotspots[i]; if (!point) return null; return <button key={i} onClick={() => setActive(i)} aria-label={`Punto ${i+1}: ${point[0]}`} className={`hotspot ${active===i ? "active" : ""}`} style={{left:`${x}%`,top:`${y}%`}}>{i+1}</button>; })}
    <div className="model-legend"><span>PUERTA ABIERTA · VISTA ISOMÉTRICA</span><span className="live-dot">MODELO ACTIVO</span></div>
  </div>;
}

function LineChart({ values, secondary, fixedScale = false }: { values: number[]; secondary?: number[]; fixedScale?: boolean }) {
  const [displayValues, setDisplayValues] = useState(values);
  const [displaySecondary, setDisplaySecondary] = useState(secondary);
  const primaryRef = useRef(values);
  const secondaryRef = useRef(secondary);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayValues(values);
      setDisplaySecondary(secondary);
      primaryRef.current = values;
      secondaryRef.current = secondary;
      return;
    }
    const startPrimary = primaryRef.current.length === values.length ? primaryRef.current : values;
    const startSecondary = secondaryRef.current && secondary && secondaryRef.current.length === secondary.length ? secondaryRef.current : secondary;
    const started = performance.now();
    let frame = 0;
    const animate = (now: number) => {
      const progress = Math.min(1, (now - started) / 460);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValues(values.map((value, index) => {
        const origin = startPrimary[index] ?? value;
        return origin + (value - origin) * eased;
      }));
      if (secondary) {
        setDisplaySecondary(secondary.map((value, index) => {
          const origin = startSecondary?.[index] ?? value;
          return origin + (value - origin) * eased;
        }));
      } else {
        setDisplaySecondary(undefined);
      }
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        primaryRef.current = values;
        secondaryRef.current = secondary;
      }
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [values, secondary]);

  const path = (arr: number[], min: number, max: number) => {
    const span = Math.max(0.001, max - min);
    const divisor = Math.max(1, arr.length - 1);
    return arr.map((v,i) => `${i ? "L" : "M"} ${(i/divisor)*100} ${48-((v-min)/span)*42}`).join(" ");
  };
  const primaryMin = fixedScale ? 0 : Math.min(...displayValues) - 2;
  const primaryMax = fixedScale ? 100 : Math.max(...displayValues) + 2;
  const primaryPath = path(displayValues, primaryMin, primaryMax);
  const secondaryPath = displaySecondary ? path(displaySecondary, Math.min(...displaySecondary)-1, Math.max(...displaySecondary)+1) : "";
  return <svg className="line-chart" viewBox="0 0 100 52" preserveAspectRatio="none" aria-label="Gráfica de datos"><g className="grid-lines">{[8,18,28,38,48].map(y=><line key={y} x1="0" x2="100" y1={y} y2={y}/>)}</g><path className="area" d={`${primaryPath} L100 52 L0 52Z`} /><path className="line-primary" pathLength={100} d={primaryPath} />{displaySecondary && <path className="line-success" pathLength={100} d={secondaryPath} />}</svg>;
}

function AppHeader({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const [open, setOpen] = useState(false);
  const nav = [["Inicio","inicio"],["Educación","educacion"],["Telemetría IoT","telemetria"],["Viabilidad","viabilidad"],["Equipo","equipo"],["CECUV—Bot","bot-guia"],["Preguntas frecuentes","faq"]] as const;
  const go = (id:string) => { document.getElementById(id)?.scrollIntoView({behavior:"smooth"}); setOpen(false); };
  return <header className="app-header"><div className="header-inner">
    <button className="brand" onClick={()=>go("inicio")} aria-label="Ir al inicio"><span className="brand-symbol"><Atom /></span><span><b>CECUV</b><em>Cloud</em><small>LABORATORIO ABIERTO · IoT</small></span></button>
    <nav className={open?"open":""} aria-label="Navegación principal">{nav.map(([label,id])=><button key={id} onClick={()=>go(id)}>{label}</button>)}</nav>
    <div className="header-tools"><Button variant="outline" size="icon" onClick={toggleDark} title={dark?"Modo claro":"Modo oscuro"}>{dark?<Sun/>:<Moon/>}</Button>
      <Dialog><DialogTrigger asChild><Button variant="outline" size="icon" title="Desplegar QR" aria-label="Desplegar QR"><QrCode/></Button></DialogTrigger><DialogContent className="qr-dialog"><DialogHeader><DialogTitle>CECUV-Cloud móvil</DialogTitle><DialogDescription>Escanee para abrir la plataforma desde otro dispositivo.</DialogDescription></DialogHeader><QrPattern/><code>{PLATFORM_URL}</code></DialogContent></Dialog>
      <Button variant="outline" size="icon" className="menu-button" onClick={()=>setOpen(!open)} aria-label="Abrir menú">{open?<X/>:<Menu/>}</Button>
    </div>
  </div></header>;
}

function Hero() {
  const [active, setActive] = useState(2);
  const activeHotspot = hotspots[active] ?? hotspots[0];
  return <section id="inicio" className="hero"><div className="hero-grid"><div className="hero-copy reveal">
    <div className="eyebrow"><span className="status-pulse"/> SISTEMA ABIERTO DE MONITORIZACIÓN IoT</div>
    <h1>CECUV<span>—Cloud</span></h1><h2>Cabina Experimental de Control UV</h2>
    <p>Digitalización IoT al servicio de la sostenibilidad ambiental y la descontaminación del agua.</p>
    <div className="hero-actions"><Button size="lg" onClick={()=>document.getElementById("prototipo")?.scrollIntoView({behavior:"smooth"})}><Box/> Explorar prototipo 3D</Button><Button size="lg" variant="outline" onClick={()=>document.getElementById("telemetria")?.scrollIntoView({behavior:"smooth"})}><Activity/> Dashboard en vivo</Button></div>
    <div className="hero-links"><button onClick={()=>window.print()}><FileDown/> Póster ESIS 2026</button><a href={WRITTEN_WORK_PDF} download="CABINA_EXPERIMENTAL_DE_CONTROL_UV_ESIS2026.pdf"><FileDown/> Trabajo Escrito ESIS 2026 PDF</a><button onClick={()=>document.getElementById("educacion")?.scrollIntoView({behavior:"smooth"})}><GraduationCap/> Ver resumen extenso</button></div>
    <div className="institution-row"><MiniLogo label="UCC"/><MiniLogo label="INDESCO"/><MiniLogo label="OPENIN"/><MiniLogo label="ESIS 2026"/></div>
  </div><div id="prototipo" className="hero-model"><Cabinet active={active} setActive={setActive}/><div className="hotspot-card"><span>{String(active+1).padStart(2,"0")}</span><div><small>COMPONENTE TÉCNICO</small><h3>{activeHotspot[0]}</h3><p>{activeHotspot[1]}</p></div></div></div></div>
  <div className="congress-strip"><span>VI ENCUENTRO ESIS 2026</span><b>Sostenibilidad Ambiental</b><i/> <b>Desarrollo Tecnológico</b><span>Bogotá · Colombia</span></div></section>;
}

function Education() {
  const [tio, setTio] = useState(1.2), [time, setTime] = useState(75), [power, setPower] = useState(72);
  const efficiency = Math.round(100 - kineticConcentration(tio, power, time));
  const curve = useMemo(()=>Array.from({length:20},(_,i)=>kineticConcentration(tio,power,time*i/19)),[tio,time,power]);
  return <section id="educacion" className="section-band"><div className="container"><SectionHeading code="01 / EDUCACIÓN" title="Ciencia que se puede explorar" text="Comprenda el problema, consulte al asistente y experimente con variables fotocatalíticas."/>
    <div className="education-grid"><div className="research-column"><div className="research-cards">
      <article className="info-card"><div className="card-icon danger"><AlertTriangle/></div><small>PROBLEMÁTICA</small><h3>Cromo Hexavalente · Cr(VI)</h3><p>Contaminante altamente tóxico presente en efluentes de curtiembres, galvanoplastia y pigmentos.</p><div className="metric-line"><b>0,05 mg/L</b><span>Límite máximo recomendado por OMS</span></div></article>
      <article className="info-card"><div className="card-icon"><FlaskConical/></div><small>ENFOQUE</small><h3>Procesos de Oxidación Avanzada</h3><p>Fotocatálisis heterogénea TiO₂/UV-A para estandarizar ensayos y reducir el ruido experimental.</p><div className="tag-row"><span>TiO₂</span><span>UV-A 365 nm</span><span>PAO</span></div></article>
    </div><MethodologyDialog/><div id="bot-guia"><BotPanel/></div></div>
    <div className="doe-panel"><div className="panel-label"><span><Gauge/> SIMULADOR DoE</span><i>PROYECCIÓN TEÓRICA</i></div><h3>Diseñe su ensayo fotocatalítico</h3><p>Ajuste las condiciones y observe la cinética estimada de remoción.</p>
      <div className="control"><label><span>Concentración de TiO₂</span><b>{tio.toFixed(1)} g/L</b></label><Slider min={0.5} max={2} step={0.1} value={[tio]} onValueChange={v=>setTio(v[0] ?? tio)}/><div><span>0.5</span><span>2.0</span></div></div>
      <div className="control"><label><span>Tiempo de exposición</span><b>{time} min</b></label><Slider min={0} max={120} step={5} value={[time]} onValueChange={v=>setTime(v[0] ?? time)}/><div><span>0</span><span>120</span></div></div>
      <div className="control"><label><span>Potencia radiativa LED</span><b>{power}%</b></label><Slider min={10} max={100} step={1} value={[power]} onValueChange={v=>setPower(v[0] ?? power)}/><div><span>10%</span><span>100%</span></div></div>
      <div className="doe-result"><div><small>EFICIENCIA TEÓRICA</small><strong>{efficiency}<sup>%</sup></strong><span>Remoción estimada de Cr(VI)</span></div><div className="kinetic-chart"><div className="chart-y"><span>100</span><span>50</span><span>0</span></div><LineChart values={curve} fixedScale/><div className="chart-caption">Concentración relativa · 0–{time} min</div></div></div>
      <div className="formula"><span>MODELO CINÉTICO</span><code>C/C₀ = e<sup>−k·t</sup></code><i>R² = 0.972</i></div>
    </div></div></div></section>;
}

function Dashboard() {
  const [interlock, setInterlock] = useState(false), [running, setRunning] = useState(false), [seconds, setSeconds] = useState(0);
  const [alertToast, setAlertToast] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const recordRef = useRef<string[]>([]);
  const [temp, setTemp] = useState(32.4), [humidity, setHumidity] = useState(54.8), [uv, setUv] = useState(8.42);
  const [tempData, setTempData] = useState([32.0,32.2,32.4,32.4,32.4,32.4,32.4,32.4,32.4,32.4]);
  const [uvData, setUvData] = useState([8.4,8.42,8.42,8.42,8.42,8.42,8.42,8.42,8.42,8.42]);

  useEffect(() => {
    if (!running || interlock) return;
    const id = setInterval(() => {
      setSeconds(s => s + 1);
      setTemp(t => { const n = +Math.min(34.2, Math.max(31.8, t + (Math.random() - .5) * .4)).toFixed(1); setTempData(d => [...d.slice(-14), n]); return n; });
      setHumidity(h => +Math.min(56.5, Math.max(52, h + (Math.random() - .5) * .6)).toFixed(1));
      setUv(u => { const n = +Math.min(8.65, Math.max(8.3, u + (Math.random() - .5) * .06)).toFixed(2); setUvData(d => [...d.slice(-14), n]); return n; });
    }, 1000);
    return () => clearInterval(id);
  }, [running, interlock]);

  useEffect(() => { if (!alertToast) return; const t = setTimeout(() => setAlertToast(false), 6000); return () => clearTimeout(t); }, [alertToast]);

  const toggleInterlock = () => {
    if (!interlock) { setRunning(false); setAlertToast(true); }
    setInterlock(v => !v);
  };

  const uvSeries = useMemo(() => interlock ? uvData.map(() => 0) : uvData, [interlock, uvData]);
  const elapsed = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const outputs = operatingOutputs(running, interlock, uv);

  useEffect(() => {
    const current = operatingOutputs(running, interlock, uv);
    recordRef.current = [...recordRef.current.slice(-3599), `CEC-2609-041,${new Date().toISOString()},${temp},${humidity},${current.uv},${current.rpm},${interlock ? "abierto" : "cerrado"}`];
  }, [seconds, running, interlock, temp, humidity, uv]);

  const downloadCSV = () => {
    const rows = [
      "id_ensayo,timestamp,temperatura_c,humedad_pct,uv_mw_cm2,rpm,interlock",
      ...recordRef.current
    ];
    downloadBlob("CECUV_CEC-2609-041_telemetria.csv", new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" }));
  };

  const downloadCertificatePDF = () => downloadBlob("Certificado_Oficial_CEC-2609-041.pdf", buildCertificatePdf([
    "Certificado Oficial de Ensayo",
    "ID CEC-2609-041",
    `Tiempo registrado: ${elapsed}`,
    `Temperatura interna: ${temp.toFixed(1)} C`,
    `Humedad relativa: ${humidity.toFixed(1)} %`,
    `Intensidad UV-A: ${outputs.uv.toFixed(2)} mW/cm2`,
    `Agitacion magnetica: ${outputs.rpm} RPM`,
    `Interlock: ${interlock ? "abierto - radiacion interrumpida" : "cerrado - operacion normal"}`,
    "Proceso: Fotocatalisis heterogenea TiO2 + UV-A 365 nm",
    "Trazabilidad: registro simulado para ponencia ESIS 2026",
  ]));

  return <section id="telemetria" className="section-band"><div className="container">
    <SectionHeading code="02 / TELEMETRÍA IOT" title="Monitoreo de la Cabina en Tiempo Real" text="Supervisión continua de sensores con interrupción de seguridad automática interlock."/>
    {alertToast && <div className="safety-toast" role="alert"><AlertTriangle/> <span>¡ALERTA DE SEGURIDAD: Lámpara UV-A desactivada automáticamente por apertura de cabina!</span><button aria-label="Cerrar alerta" onClick={() => setAlertToast(false)}><X/></button></div>}
    <div className={`safety-banner ${interlock ? "alert" : "ok"}`}>
      <span className="pulse-dot"/>
      <b>{interlock ? "SISTEMA INTERRUMPIDO - APERTURA DETECTADA" : running ? "ENSAYO EN CURSO - OPERACIÓN SEGURA" : "SISTEMA EN ESPERA - LISTO PARA INICIAR"}</b>
      <div className="telemetry-actions">
        <Button variant={interlock ? "default" : "destructive"} size="sm" onClick={toggleInterlock}><ShieldCheck/> {interlock ? "Cerrar puerta" : "Simular apertura"}</Button>
        <Button size="sm" className={running ? "run-btn stop" : "run-btn start"} disabled={interlock} onClick={() => setRunning(!running)}>{running ? "⏸️ Detener Ensayo" : "▷ Iniciar"}</Button>
      </div>
    </div>

    <div className="metrics-6">
      <article className={`metric-card ${temp > 35 ? "warn" : ""}`}><div className="card-top"><span><Thermometer/> TEMPERATURA INTERNA</span><small className="badge">Límite 35 °C</small></div><div className="metric-value"><strong>{temp.toFixed(1)}<sup>°C</sup></strong></div><p className="metric-footer">Sensor DHT22 · ventilación activa</p></article>
      <article className="metric-card"><div className="card-top"><span><Droplets/> HUMEDAD RELATIVA</span><small className="badge">DHT22</small></div><div className="metric-value"><strong>{humidity.toFixed(1)}<sup>%</sup></strong></div><p className="metric-footer">Ambiente interno de la cámara</p></article>
      <article className="metric-card"><div className="card-top"><span><Sun/> INTENSIDAD UV</span><small className="badge">UV-A 365 nm</small></div><div className="metric-value"><strong>{outputs.uv.toFixed(2)}<sup>mW/cm²</sup></strong></div><p className="metric-footer">{outputs.uv === 0 ? "Lámparas apagadas" : "PWM 72% · GUVA-S12SD"}</p></article>
      <article className="metric-card"><div className="card-top"><span><Clock3/> CRONÓMETRO</span><small className="badge">CEC-2609-041</small></div><div className="metric-value"><strong>{elapsed}</strong></div><p className="metric-footer">Tiempo de ensayo (mm:ss)</p></article>
      <article className="metric-card"><div className="card-top"><span><RotateCcw/> AGITACIÓN MAGNÉTICA</span><small className="badge">Multipunto</small></div><div className="metric-value"><strong>{outputs.rpm}<sup>RPM</sup></strong></div><p className="metric-footer">Suspensión homogénea de TiO₂</p></article>
      <article className={`metric-card ${interlock ? "warn" : "safe"}`}><div className="card-top"><span><ShieldCheck/> SEGURIDAD INTERLOCK</span><small className="badge">Puerta</small></div><div className="metric-value"><strong>{interlock ? "ABIERTA" : "CERRADA"}</strong></div><p className="metric-footer">{interlock ? "Radiación interrumpida" : "Operación segura"}</p></article>
    </div>

    <div className="telemetry-lower">
      <article className="metric-card stability-card">
        <div className="card-top"><span><Activity/> ESTABILIDAD DEL SISTEMA</span><small className="legend"><i className="lg-temp"/> Temp °C <i className="lg-uv"/> UV mW/cm²</small></div>
        <LineChart values={tempData} secondary={uvSeries}/>
      </article>
      <article className="metric-card export-center">
        <div className="card-top"><span><Download/> CENTRO DE EXPORTACIÓN</span></div>
        <p>Ensayo <b className="export-id">CEC-2609-041</b></p>
        <Dialog open={exportOpen} onOpenChange={setExportOpen}><DialogTrigger asChild><Button className="export-primary"><FileDown/> Exporte el registro</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Exportar ensayo CEC-2609-041</DialogTitle><DialogDescription>Registro simulado de CECUV—Cloud · ESIS 2026.</DialogDescription></DialogHeader><div className="export-options"><Button onClick={downloadCSV}><FileSpreadsheet/> Descargar hoja de cálculo CSV</Button><Button variant="outline" onClick={downloadCertificatePDF}><FileDown/> Certificado Oficial PDF</Button></div></DialogContent></Dialog>
        <Button variant="outline" onClick={downloadCSV}><FileSpreadsheet/> Descargar registro CSV</Button>
      </article>
    </div>
    <div id="estimador" className="telemetry-estimator"><UvCalculatorSimulator /></div>
  </div></section>;
}

function Viability() {
  return <section id="viabilidad" className="section-band"><div className="container">
    <SectionHeading code="03 / VIABILIDAD" title="Análisis de Costos y Lista de Materiales (BOM)" text="Evaluación técnica y económica demostrando una reducción significativa frente a cabinas comerciales."/>
    
    <div className="viability-grid">
      <div className="bom-table-wrapper">
        <h3>Lista de Materiales (BOM)</h3>
        <table className="bom-table">
          <thead>
            <tr><th>Categoría</th><th>Componente</th><th>Cantidad</th><th>Costo (COP)</th></tr>
          </thead>
          <tbody>
            {bom.map(([cat, item, qty, price], i) => (
              <tr key={i}>
                <td><span className="cat-tag">{cat}</span></td>
                <td><b>{item}</b></td>
                <td>{qty}</td>
                <td><code>{price}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="cost-summary">
        <div className="summary-card highlight">
          <small>COSTO TOTAL PROTOTIPO</small>
          <h2>$1.755.000 COP</h2>
          <p>Frente a $6.000.000–$8.000.000 COP de homólogos comerciales importados.</p>
          <div className="saving-badge"><Sparkles/> Ahorro estimado: 70%–75%</div>
        </div>
      </div>
    </div>
  </div></section>;
}

function Footer() {
  return <footer className="app-footer"><div className="container">
    <div className="footer-content">
      <div>
        <h3>CECUV—Cloud</h3>
        <p>Cabina Experimental de Control UV · Universidad Cooperativa de Colombia (UCC)</p>
      </div>
      <div className="footer-logos">
        <span>OPENIN</span><span>INDESCO</span><span>ESIS 2026</span>
      </div>
    </div>
    <div className="footer-bottom">
      <small>© 2026 CECUV—Cloud. Proyecto de Investigación y Desarrollo Tecnológico.</small>
    </div>
  </div></footer>;
}

export function CecuvCloud() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return <div className={`cecuv-app ${dark ? "dark-theme" : "light-theme"}`}>
    <AppHeader dark={dark} toggleDark={() => setDark(!dark)} />
    <main>
      <Hero />
      <HowItWorksSection />
      <ProblemContextSection />
      <Education />
      <Dashboard />
      <section id="faq" className="section-band"><div className="container"><FaqAccordion /></div></section>
      <Viability />
      <TeamAndAcknowledgements />
    </main>
    <Footer />
    <CecuvGuide />
  </div>;
}

const guideSteps = [
  ["inicio", "Introducción", "La cabina busca optimizar la remoción de Cromo Hexavalente Cr(VI) de efluentes de curtiembres mediante fotocatálisis heterogénea (TiO₂ + UV-A 365 nm)."],
  ["educacion", "Educación y CECUV—Bot", "Escriba cualquier pregunta al CECUV—Bot y mueva los controles del Simulador DoE para ver la curva cinética en tiempo real."],
  ["telemetria", "Telemetría IoT", "Monitoreo de temperatura, humedad, agitación magnética (RPM) y el protocolo de seguridad Interlock que apaga la radiación al abrir la puerta."],
  ["viabilidad", "Viabilidad económica", "Ahorro del 68%–75% frente a equipos comerciales. BOM con Triplex Marino de 15 mm, Mylar aluminizado y acero AISI 304."],
  ["equipo", "Equipo OPENIN", "John Almanza, Andrés Leguizamón, David Jerez y Sara Quintana, con el acompañamiento del docente Pablo Velásquez."],
] as const;

function CecuvGuide() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const go = (i: number) => {
    const target = guideSteps[i];
    if (!target) return;
    setStep(i);
    document.getElementById(target[0])?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const s = guideSteps[step] ?? guideSteps[0];
  const last = step === guideSteps.length - 1;
  return <div className="guide-widget">
    {open ? <div className="guide-card" role="dialog" aria-label="CECUV—Guide">
      <div className="guide-top"><b><Sparkles/> CECUV—Guide</b><Button variant="ghost" size="icon" aria-label="Cerrar recorrido" onClick={() => setOpen(false)}><X/></Button></div>
      <small>PASO {step + 1} / {guideSteps.length}</small>
      <div className="guide-progress"><span style={{ width: `${((step + 1) / guideSteps.length) * 100}%` }}/></div>
      <h4>{s[1]}</h4><p>{s[2]}</p>
      <div className="guide-actions">
        {last ? <>
          <Button variant="outline" size="sm" onClick={() => go(0)}><RotateCcw/> Reiniciar recorrido</Button>
          <Button size="sm" onClick={() => { setOpen(false); document.getElementById("bot-guia")?.scrollIntoView({ behavior: "smooth" }); }}><Bot/> Pregunta rápida</Button>
        </> : <>
          <Button variant="outline" size="sm" disabled={step === 0} onClick={() => go(step - 1)}>Anterior</Button>
          <Button size="sm" onClick={() => go(step + 1)}>Siguiente <ChevronRight/></Button>
        </>}
      </div>
    </div> : <Button className="guide-launcher" aria-label="Iniciar Recorrido Interactivo" onClick={() => { setOpen(true); go(0); }}><Play/><span>Iniciar Recorrido Interactivo</span></Button>}
  </div>;
}

export default CecuvCloud;