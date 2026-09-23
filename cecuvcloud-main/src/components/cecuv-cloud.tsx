import { useEffect, useMemo, useRef, useState } from "react";
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

const hotspots = [
  ["Chasis principal", "Madera Triplex Marino de 15 mm: resistente a la humedad y aislante térmico/radiativo."],
  ["Revestimiento optimizador", "Mylar aluminizado de alta reflexividad para una distribución UV homogénea."],
  ["Módulo de irradiación", "Lámparas y LED UV-A de 365 nm con intensidad regulable mediante PWM."],
  ["Plataforma de trabajo", "Bandeja AISI 304 y agitación magnética multipunto para evitar sedimentación de TiO₂."],
  ["Ventana de inspección", "Vidrio templado, película polarizada y filtro UV para supervisión ocular segura."],
  ["Acceso frontal ergonómico", "Puerta lateral con bisagras reforzadas, manija y visor con filtro UV para una apertura segura."],
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

const team = [
  ["JA", "John Alejandro Almanza Valderrama", "Ingeniería Industrial"],
  ["AL", "Andrés Felipe Leguizamón Rodríguez", "Ingeniería Industrial"],
  ["DJ", "David Stiven Jerez Díaz", "Ingeniería Industrial"],
  ["SQ", "Sara Valentina Quintana López", "Ingeniería de Sistemas"],
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

const guideSteps = [
  { target: "inicio", label: "Paso 1", title: "Propósito de CECUV—Cloud", text: "La cabina busca optimizar la remoción de Cromo Hexavalente Cr(VI) en efluentes de curtiembres usando fotocatálisis heterogénea con TiO₂ y UV-A 365 nm." },
  { target: "educacion", label: "Paso 2", title: "Educación, bot y simulador", text: "Aquí se consultan fundamentos científicos con CECUV—Bot y se exploran escenarios DoE con dosis de TiO₂, tiempo e intensidad UV-A." },
  { target: "telemetria", label: "Paso 3", title: "Telemetría IoT segura", text: "El panel resume temperatura, humedad, intensidad UV, RPM e Interlock para mantener trazabilidad y proteger al usuario durante el ensayo." },
  { target: "viabilidad", label: "Paso 4", title: "Viabilidad y materiales", text: "El módulo compara el ahorro del 68%–75% frente a equipos comerciales y muestra el BOM: Triplex Marino 15 mm, Mylar aluminizado y AISI 304." },
  { target: "equipo", label: "Paso 5", title: "Equipo OPENIN", text: "El recorrido finaliza con John Almanza, Andrés Leguizamón, David Jerez y Sara Quintana, con la guía docente de Pablo Velásquez." },
] as const;

type ChatTurn = { role: "user" | "bot"; text: string; topics?: string[] };

function BotPanel() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<ChatTurn[]>([
    { role: "bot", text: "Soy CECUV—Bot. Consulto la matriz de conocimiento del trabajo escrito del Semillero OPENIN. Escriba cualquier pregunta sobre Cr(VI), fotocatálisis, diseño de la cabina, electrónica IoT, diseño de experimentos, costos o el equipo." },
  ]);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chat]);

  function send(question: string) {
    const q = question.trim();
    if (!q) return;
    const reply = answerQuestion(q);
    setChat((prev) => [...prev, { role: "user", text: q }, { role: "bot", text: reply.text, topics: reply.topics }]);
    setInput("");
  }

  return <div className="bot-panel">
    <div className="bot-head"><span><Bot/></span><div><small>ASISTENTE IA CIENTÍFICO</small><h3>CECUV—Bot</h3></div><i>EN LÍNEA</i></div>
    <div className="bot-log" ref={logRef} aria-live="polite">
      {chat.map((turn, i) => <div key={i} className={turn.role === "user" ? "bot-turn user" : "bot-turn"}>
        <p>{turn.text}</p>
        {turn.topics && turn.topics.length > 0 && <div className="bot-topics">{turn.topics.map((t) => <span key={t}>{t}</span>)}</div>}
      </div>)}
    </div>
    <form className="bot-form" onSubmit={(e) => { e.preventDefault(); send(input); }}>
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Escriba su pregunta sobre la CECUV…" aria-label="Pregunta para CECUV-Bot"/>
      <button type="submit" aria-label="Enviar pregunta"><ChevronRight/></button>
    </form>
    <p className="prompt-label">CONSULTAS SUGERIDAS</p>
    <div className="bot-prompts">{quickPrompts.map((p) => <button key={p} type="button" onClick={() => setInput(p)}>{p}</button>)}</div>
  </div>;
}


function MiniLogo({ label }: { label: string }) {
  return <div className="institution-mark" aria-label={label}><span>{label}</span></div>;
}

function SectionHeading({ code, title, text }: { code: string; title: string; text: string }) {
  return <div className="section-heading reveal"><div className="section-code"><span>{code}</span><i /></div><h2>{title}</h2><p>{text}</p></div>;
}

function QrPattern() {
  const cells = Array.from({ length: 225 }, (_, i) => {
    const x = i % 15, y = Math.floor(i / 15);
    const finder = (x < 5 && y < 5) || (x > 9 && y < 5) || (x < 5 && y > 9);
    const center = finder && ((x % 10 === 0 || x % 10 === 4 || y % 10 === 0 || y % 10 === 4) || (x % 10 >= 2 && x % 10 <= 3 && y % 10 >= 2 && y % 10 <= 3));
    return finder ? center : ((x * 7 + y * 11 + x * y) % 5 < 2);
  });
  return <div className="qr-pattern" aria-label="Código QR de CECUV-Cloud">{cells.map((on, i) => <i key={i} className={on ? "on" : ""} />)}</div>;
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
        {/* Caja con volumen: cara superior, lateral derecho y frente */}
        <polygon points="250,110 540,75 665,140 375,175" fill="url(#woodTop)" stroke="var(--wood-edge)" strokeWidth="4"/>
        <path d="M262 113L532 80L646 138L376 170Z" fill="url(#woodGrain)" opacity=".55"/>
        <polygon points="540,75 665,140 665,450 540,405" fill="url(#woodSide)" stroke="var(--wood-edge)" strokeWidth="5"/>
        <path d="M549 88L654 144V436L549 396Z" fill="url(#woodGrain)" opacity=".65"/>
        {/* Cavidad interior con profundidad: fondo, techo, paredes y piso */}
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
        {/* Marco frontal con grosor: anillo de madera sobre la cavidad */}
        <path d="M250 110L540 75L540 405L250 445Z M276 142L512 113L512 368L276 400Z" fillRule="evenodd" fill="url(#woodFront)" stroke="var(--wood-edge)" strokeWidth="5"/>
        <path d="M258 119L531 86L531 396L258 430Z M276 142L512 113L512 368L276 400Z" fillRule="evenodd" fill="url(#woodGrain)"/>
        <path d="M276 142L512 113M276 142L276 400" stroke="var(--wood-top)" strokeWidth="3" opacity=".75" fill="none"/>
        <path d="M512 113L512 368M276 400L512 368" stroke="var(--wood-edge)" strokeWidth="4" opacity=".85" fill="none"/>
        {/* Ensambles diente de sierra y aristas con luz */}
        <path d="M250 110L540 75M540 75L665 140" stroke="var(--wood-top)" strokeWidth="3" opacity=".7"/>
        <path d="M252 112L538 78M252 442L538 406M542 78L663 139M541 404L664 448" stroke="var(--wood-edge)" strokeWidth="5" strokeDasharray="13 8" opacity=".8" fill="none"/>
        {/* Piso / base de la caja con espesor visible */}
        <polygon points="250,445 540,405 665,450 375,494" fill="url(#woodTop)" stroke="var(--wood-edge)" strokeWidth="4" opacity=".95"/>
        <path d="M262 446L532 408L648 450L378 489Z" fill="url(#woodGrain)" opacity=".5"/>
        <polygon points="250,445 375,494 375,512 250,463" fill="var(--wood-dark)" stroke="var(--wood-edge)" strokeWidth="3"/>
        <polygon points="375,494 665,450 665,468 375,512" fill="url(#woodSide)" stroke="var(--wood-edge)" strokeWidth="3"/>
        <path d="M250 463L375 512L665 468" stroke="var(--wood-edge)" strokeWidth="4" fill="none" opacity=".85"/>
        <path d="M256 449L534 410" stroke="var(--wood-top)" strokeWidth="3" opacity=".6" fill="none"/>
        {/* Panel de control sobre la cara lateral derecha */}
        <polygon points="559,132 646,170 646,422 559,392" fill="var(--panel-face)" stroke="var(--wood-edge)" strokeWidth="3"/>
        <polygon points="573,158 633,182 633,240 573,219" fill="var(--screen-bezel)" stroke="var(--cabinet-stroke)" strokeWidth="3"/>
        <polygon points="580,169 625,186 625,227 580,211" fill="var(--screen-blue)"/>
        <text x="584" y="189" fill="var(--screen-text)" fontSize="8" fontFamily="monospace">UV 365nm</text><text x="584" y="203" fill="var(--screen-text)" fontSize="7" fontFamily="monospace">32.4°C SAFE</text>
        <circle cx="578" cy="242" r="7" fill="var(--success)"/><circle cx="601" cy="250" r="7" fill="var(--control-violet)"/><circle cx="624" cy="258" r="7" fill="var(--danger)"/>
        <polygon points="579,274 628,291 628,328 579,313" fill="var(--module-face)" stroke="var(--cabinet-stroke)" strokeWidth="2"/>
        <text x="585" y="295" fill="var(--primary)" fontSize="8" fontFamily="monospace">PWM 72%</text>
        <polygon points="580,340 628,356 628,396 580,382" fill="var(--module-face)" stroke="var(--cabinet-stroke)" strokeWidth="2"/>
        <circle cx="595" cy="363" r="5" fill="var(--primary)"/><path d="M610 363l10 4v8l-10-4z" fill="var(--port)"/>
        {/* Puerta abierta con grosor de triplex y visor UV */}
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
function LineChart({ values, secondary }: { values: number[]; secondary?: number[] }) {
  const [displayValues, setDisplayValues] = useState(values);
  const [displaySecondary, setDisplaySecondary] = useState(secondary);
  const primaryRef = useRef(values);
  const secondaryRef = useRef(secondary);

  useEffect(() => {
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
  const primaryMin = Math.min(...displayValues) - 2;
  const primaryMax = Math.max(...displayValues) + 2;
  const primaryPath = path(displayValues, primaryMin, primaryMax);
  const secondaryPath = displaySecondary ? path(displaySecondary, Math.min(...displaySecondary)-1, Math.max(...displaySecondary)+1) : "";
  return <svg className="line-chart" viewBox="0 0 100 52" preserveAspectRatio="none" aria-label="Gráfica de datos"><g className="grid-lines">{[8,18,28,38,48].map(y=><line key={y} x1="0" x2="100" y1={y} y2={y}/>)}</g><path className="area" d={`${primaryPath} L100 52 L0 52Z`} /><path key={primaryPath} className="line-primary" pathLength={100} d={primaryPath} />{displaySecondary && <path key={secondaryPath} className="line-success" pathLength={100} d={secondaryPath} />}</svg>;
}

function AppHeader({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const [open, setOpen] = useState(false);
  const nav = [["Inicio","inicio"],["Educación","educacion"],["Telemetría IoT","telemetria"],["Viabilidad","viabilidad"],["Equipo","equipo"],["CECUV—Bot","bot-guia"]] as const;
  const go = (id:string) => { document.getElementById(id)?.scrollIntoView({behavior:"smooth"}); setOpen(false); };
  return <header className="app-header"><div className="header-inner">
    <button className="brand" onClick={()=>go("inicio")} aria-label="Ir al inicio"><span className="brand-symbol"><Atom /></span><span><b>CECUV</b><em>Cloud</em><small>LABORATORIO ABIERTO · IoT</small></span></button>
    <nav className={open?"open":""} aria-label="Navegación principal">{nav.map(([label,id])=><button key={id} onClick={()=>go(id)}>{label}</button>)}</nav>
    <div className="header-tools"><Button variant="outline" size="icon" onClick={toggleDark} title={dark?"Modo claro":"Modo oscuro"}>{dark?<Sun/>:<Moon/>}</Button>
      <Dialog><DialogTrigger asChild><Button variant="outline" size="icon" title="Desplegar QR"><QrCode/></Button></DialogTrigger><DialogContent className="qr-dialog"><DialogHeader><DialogTitle>CECUV-Cloud móvil</DialogTitle><DialogDescription>Escanee para abrir la plataforma desde otro dispositivo.</DialogDescription></DialogHeader><QrPattern/><code>cecuv-cloud.esis2026.edu.co</code></DialogContent></Dialog>
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
  const efficiency = Math.min(96, Math.round((1-Math.exp(-0.00034*tio*power*time))*100));
  const curve = useMemo(()=>Array.from({length:20},(_,i)=>100-(1-Math.exp(-0.00034*tio*power*(time*i/19)))*100),[tio,time,power]);
  return <section id="educacion" className="section-band"><div className="container"><SectionHeading code="01 / EDUCACIÓN" title="Ciencia que se puede explorar" text="Comprenda el problema, consulte al asistente y experimente con variables fotocatalíticas."/>
    <div className="education-grid"><div className="research-column"><div className="research-cards">
      <article className="info-card"><div className="card-icon danger"><AlertTriangle/></div><small>PROBLEMÁTICA</small><h3>Cromo Hexavalente · Cr(VI)</h3><p>Contaminante altamente tóxico presente en efluentes de curtiembres, galvanoplastia y pigmentos.</p><div className="metric-line"><b>0,05 mg/L</b><span>Límite máximo recomendado por OMS</span></div></article>
      <article className="info-card"><div className="card-icon"><FlaskConical/></div><small>ENFOQUE</small><h3>Procesos de Oxidación Avanzada</h3><p>Fotocatálisis heterogénea TiO₂/UV-A para estandarizar ensayos y reducir el ruido experimental.</p><div className="tag-row"><span>TiO₂</span><span>UV-A 365 nm</span><span>PAO</span></div></article>
    </div><MethodologyDialog/><div id="bot-guia"><BotPanel/></div></div>
    <div className="doe-panel"><div className="panel-label"><span><Gauge/> SIMULADOR DoE</span><i>PROYECCIÓN TEÓRICA</i></div><h3>Diseñe su ensayo fotocatalítico</h3><p>Ajuste las condiciones y observe la cinética estimada de remoción.</p>
      <div className="control"><label><span>Concentración de TiO₂</span><b>{tio.toFixed(1)} g/L</b></label><Slider min={0.5} max={2} step={0.1} value={[tio]} onValueChange={v=>setTio(v[0] ?? tio)}/><div><span>0.5</span><span>2.0</span></div></div>
      <div className="control"><label><span>Tiempo de exposición</span><b>{time} min</b></label><Slider min={0} max={120} step={5} value={[time]} onValueChange={v=>setTime(v[0] ?? time)}/><div><span>0</span><span>120</span></div></div>
      <div className="control"><label><span>Potencia radiativa LED</span><b>{power}%</b></label><Slider min={10} max={100} step={1} value={[power]} onValueChange={v=>setPower(v[0] ?? power)}/><div><span>10%</span><span>100%</span></div></div>
      <div className="doe-result"><div><small>EFICIENCIA TEÓRICA</small><strong>{efficiency}<sup>%</sup></strong><span>Remoción estimada de Cr(VI)</span></div><div className="kinetic-chart"><div className="chart-y"><span>100</span><span>50</span><span>0</span></div><LineChart values={curve}/><div className="chart-caption">Concentración relativa vs. tiempo</div></div></div>
      <div className="formula"><span>MODELO CINÉTICO</span><code>C/C₀ = e<sup>−k·t</sup></code><i>R² = 0.972</i></div>
    </div></div></div></section>;
}

function Dashboard() {
  const [interlock, setInterlock] = useState(false), [running, setRunning] = useState(true), [seconds, setSeconds] = useState(2487);
  const [temp, setTemp] = useState(32.4), [humidity, setHumidity] = useState(54.8), [uv, setUv] = useState(8.42);
  const [tempData, setTempData] = useState([30.8,31,31.3,31.5,31.8,32,32.1,32.3,32.4,32.4]);
  const [uvData, setUvData] = useState([7.9,8.1,8.2,8.4,8.3,8.4,8.5,8.4,8.42,8.42]);
  useEffect(()=>{const id=setInterval(()=>{if(running&&!interlock){setSeconds(s=>s+1); const nt=+(32.2+Math.random()*.5).toFixed(1), nu=+(8.3+Math.random()*.25).toFixed(2); setTemp(nt);setUv(nu);setHumidity(+(54+Math.random()*2).toFixed(1));setTempData(d=>[...d.slice(-14),nt]);setUvData(d=>[...d.slice(-14),nu]);}},2000);return()=>clearInterval(id)},[running,interlock]);
  const toggleInterlock=()=>{setInterlock(v=>!v);if(!interlock)setRunning(false)};
  const elapsed=`${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`;
  const downloadCSV=()=>{const rows=["id_ensayo,timestamp,temperatura_c,humedad_pct,uv_mw_cm2,rpm,interlock",...tempData.map((v,i)=>`CEC-2609-041,${new Date(Date.now()-(tempData.length-i)*2000).toISOString()},${v},${humidity},${uvData[i]??uv},${interlock?0:420},${interlock?"abierto":"cerrado"}`)];downloadBlob("CECUV_CEC-2609-041_telemetria.csv",new Blob([rows.join("\n")],{type:"text/csv;charset=utf-8"}))};
  const downloadCertificatePDF=()=>downloadBlob("Certificado_Oficial_CEC-2609-041.pdf",buildCertificatePdf([
    "Certificado Oficial de Ensayo",
    "ID CEC-2609-041",
    `Tiempo registrado: ${elapsed}`,
    `Temperatura interna: ${temp.toFixed(1)} C`,
    `Humedad relativa: ${humidity.toFixed(1)} %`,
    `Intensidad UV-A: ${interlock ? "0.00" : uv.toFixed(2)} mW/cm2`,
    `Agitacion magnetica: ${interlock ? "0" : "420"} RPM`,
    `Interlock: ${interlock ? "abierto - radiacion interrumpida" : "cerrado - operacion normal"}`,
    "Proceso: Fotocatalisis heterogenea TiO2 + UV-A 365 nm",
    "Trazabilidad: registro simulado para ponencia ESIS 2026",
  ]));
  return <section id="telemetria" className="dashboard-band"><div className="container"><SectionHeading code="02 / TELEMETRÍA" title="Dashboard IoT en vivo" text="Supervisión del ensayo, estabilidad operativa y protocolo de seguridad en una sola consola."/>
    <div className={`safety-banner ${interlock?"alert":""}`}><span>{interlock?<AlertTriangle/>:<ShieldCheck/>}</span><div><small>ESTADO GENERAL DEL SISTEMA</small><b>{interlock?"ALERTA: TAPA ABIERTA — RADIACIÓN UV INTERRUMPIDA":"SISTEMA SEGURO — OPERACIÓN NORMAL"}</b></div><Button variant={interlock?"destructive":"outline"} onClick={toggleInterlock}>{interlock?"Cerrar tapa":"Simular apertura"}</Button></div>
    <div className="kpi-grid">
      <Kpi icon={<Thermometer/>} label="Temperatura interna" value={`${temp.toFixed(1)} °C`} foot="Límite 35 °C" progress={temp/35*100}/><Kpi icon={<Droplets/>} label="Humedad relativa" value={`${humidity.toFixed(1)} %`} foot="Rango estable" progress={humidity}/><Kpi icon={<Zap/>} label="Intensidad UV" value={interlock?"0.00":`${uv.toFixed(2)} mW/cm²`} foot="UV-A · 365 nm" progress={interlock?0:84}/><Kpi icon={<Clock3/>} label="Cronómetro" value={elapsed} foot={running?"Ensayo en curso":"Ensayo pausado"} progress={(seconds%7200)/72}/><Kpi icon={<RotateCcw/>} label="Agitación magnética" value={interlock?"0 RPM":"420 RPM"} foot={interlock?"Inactiva":"Activa · multipunto"} progress={interlock?0:70}/><Kpi icon={<ShieldCheck/>} label="Seguridad interlock" value={interlock?"ABIERTA":"CERRADA"} foot={interlock?"Sistema apagado":"Luz activa"} progress={interlock?4:100} danger={interlock}/>
    </div>
    <div className="telemetry-grid"><div className="telemetry-chart"><div className="chart-head"><div><small>ESTABILIDAD DEL SISTEMA</small><h3>Temperatura e intensidad radiativa</h3></div><div className="legend"><span className="cyan">Temperatura °C</span><span className="green">UV mW/cm²</span></div></div><LineChart values={tempData} secondary={uvData}/><div className="x-axis"><span>−20 min</span><span>−15</span><span>−10</span><span>−5</span><span>Ahora</span></div></div>
      <aside className="export-panel"><small>CENTRO DE EXPORTACIÓN</small><h3>Datos trazables, resultados verificables.</h3><p>Exporte el registro para análisis estadístico o genere el certificado oficial del ensayo.</p><Dialog><DialogTrigger asChild><Button><Download/> Exporte el registro</Button></DialogTrigger><DialogContent className="export-dialog"><DialogHeader><DialogTitle>Centro de Exportación CECUV</DialogTitle><DialogDescription>Seleccione el formato de salida del ensayo ID CEC-2609-041.</DialogDescription></DialogHeader><div className="export-id"><span>ID DE ENSAYO</span><b>CEC-2609-041</b></div><div className="export-options"><button type="button" onClick={downloadCSV}><FileSpreadsheet/><span><b>Hoja de cálculo .CSV</b><small>Temperatura, humedad, UV-A, RPM e interlock.</small></span></button><button type="button" onClick={downloadCertificatePDF}><FileDown/><span><b>Certificado Oficial PDF</b><small>Resumen técnico listo para ponencia.</small></span></button></div></DialogContent></Dialog><div className="quality-seal"><CheckCircle2/><span><b>CONTROL DE CALIDAD</b><small>Registro íntegro · ID CEC-2609-041</small></span></div></aside>
    </div></div></section>;
}

function Kpi({icon,label,value,foot,progress,danger=false}:{icon:React.ReactNode,label:string,value:string,foot:string,progress:number,danger?:boolean}){
  return <article className={`kpi-card ${danger?"danger":""}`}><div className="kpi-top"><span>{icon}</span><i>{danger?"ALERTA":"EN VIVO"}</i></div><small>{label}</small><strong>{value}</strong><div className="kpi-progress"><i style={{width:`${Math.min(100,progress)}%`}}/></div><p>{foot}</p></article>
}

function Viability() {
  const [filter,setFilter]=useState("Todos"); const rows=filter==="Todos"?bom:bom.filter(r=>r[0]===filter);
  return <section id="viabilidad" className="section-band viability"><div className="container"><SectionHeading code="03 / VIABILIDAD" title="Ingeniería abierta, impacto medible" text="Una arquitectura replicable que reduce barreras económicas sin sacrificar seguridad ni trazabilidad."/>
    <div className="cost-grid"><div className="cost-story"><small>ANÁLISIS COMPARATIVO</small><h3>Hasta 75% menos inversión inicial</h3><p>La fabricación local y modular permite democratizar el acceso a equipos de investigación fotocatalítica.</p><div className="big-saving">68<sup>%</sup><span>AHORRO ESTIMADO</span></div><div className="compare-bars"><div><label><span>Fotorreactor comercial importado</span><b>$18,5 M COP</b></label><i><em style={{width:"100%"}}/></i></div><div><label><span>Prototipo CECUV-Cloud</span><b>$5,9 M COP</b></label><i><em className="success" style={{width:"32%"}}/></i></div></div></div>
    <div className="bom-panel"><div className="bom-head"><div><small>BOM INTERACTIVO</small><h3>Lista de materiales</h3></div><span>8 componentes clave</span></div><div className="filter-row">{["Todos","Estructural","Óptico","Electrónico","Seguridad"].map(f=><Button key={f} size="sm" variant={filter===f?"default":"ghost"} onClick={()=>setFilter(f)}>{f}</Button>)}</div><div className="bom-table"><div className="bom-row head"><span>Categoría</span><span>Componente</span><span>Cant.</span><span>Costo</span></div>{rows.map((r,i)=><div className="bom-row" key={i}><span>{r[0]}</span><b>{r[1]}</b><span>{r[2]}</span><strong>{r[3]}</strong></div>)}</div></div></div></div></section>;
}

function Team() {
  return <section id="equipo" className="team-band"><div className="container"><SectionHeading code="04 / PERSONAS" title="El equipo detrás de CECUV" text="Investigación interdisciplinaria nacida en el Semillero OPENIN de la Universidad Cooperativa de Colombia."/>
    <div className="team-grid">{team.map(([initials,name,career])=><article key={name} className="person-card"><div className="avatar">{initials}</div><div><h3>{name}</h3><p>Estudiante de {career}</p><span>UCC · Campus Bogotá · OPENIN</span></div></article>)}</div>
    <div className="recognition-grid"><article className="dedication"><Heart/><small>DEDICATORIA</small><blockquote>“Dedicamos este logro a Dios, a nuestras familias y padres, motor principal de nuestras vidas; y a quienes ya no están físicamente, pero desde el cielo nos acompañan con su recuerdo, fuerza y bendición.”</blockquote></article><article className="mentor"><div className="mentor-top"><div className="avatar leader">PV</div><div><small>DOCENTE LÍDER</small><h3>Pablo Elías Velásquez Perilla</h3><p>Líder Semillero OPENIN · Docente e Investigador</p></div></div><blockquote>“Gracias por su valiosa guía, mentoría incondicional y acompañamiento en cada decisión de este proceso académico, científico y personal.”</blockquote><div className="signature"><Sparkles/> Con profunda gratitud — Equipo CECUV</div></article></div>
    <div className="project-footer"><div><Atom/><span><b>CECUV—Cloud</b><small>Cabina Experimental de Control UV</small></span></div><p>Sostenibilidad Ambiental y Desarrollo Tecnológico</p><span>© 2026 · Semillero OPENIN · UCC</span></div>
  </div></section>;
}

function CecuvGuide() {
  const [open, setOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const step = guideSteps[stepIndex] ?? guideSteps[0];
  const isLast = stepIndex === guideSteps.length - 1;

  useEffect(() => {
    const clearActive = () => document.querySelectorAll('[data-guide-active="true"]').forEach((el) => el.removeAttribute("data-guide-active"));
    if (!open) {
      clearActive();
      return;
    }
    const target = document.getElementById(step.target);
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
    const timer = window.setTimeout(() => {
      clearActive();
      target?.setAttribute("data-guide-active", "true");
    }, 320);
    return () => {
      window.clearTimeout(timer);
      target?.removeAttribute("data-guide-active");
    };
  }, [open, step.target]);

  const startGuide = () => {
    setStepIndex(0);
    setOpen(true);
  };

  return <aside className="guide-widget" aria-live="polite">
    {!open ? <div className="guide-launcher"><span><Bot/></span><div><small>CECUV—Guide</small><b>Recorrido guiado</b></div><Button size="sm" onClick={startGuide}>Iniciar Recorrido Interactivo</Button></div> :
      <div className="guide-card">
        <div className="guide-top"><span><Bot/></span><div><small>CECUV—Guide</small><b>{step.label} · {step.title}</b></div><button type="button" onClick={() => setOpen(false)} aria-label="Cerrar recorrido"><X/></button></div>
        <p>{step.text}</p>
        <div className="guide-progress">{guideSteps.map((item, index) => <button key={item.label} type="button" className={index === stepIndex ? "active" : ""} onClick={() => setStepIndex(index)} aria-label={`Ir a ${item.label}`} />)}</div>
        <div className="guide-actions">{isLast
          ? <><Button variant="outline" size="sm" onClick={() => setStepIndex(0)}>Reiniciar recorrido</Button><Button size="sm" onClick={() => { setOpen(false); document.getElementById("bot-guia")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>Pregunta rápida</Button></>
          : <><Button variant="outline" size="sm" onClick={() => setStepIndex((value) => Math.max(0, value - 1))} disabled={stepIndex === 0}>Anterior</Button><Button size="sm" onClick={() => setStepIndex((value) => Math.min(guideSteps.length - 1, value + 1))}>Siguiente</Button></>}</div>
      </div>}
  </aside>;
}

export function CecuvCloud(){
  const [dark,setDark]=useState(true);
  useEffect(()=>{document.documentElement.classList.toggle("dark",dark)},[dark]);
  return <div className="cecuv-app"><AppHeader dark={dark} toggleDark={()=>setDark(v=>!v)}/><main><Hero/><Education/><Dashboard/><Viability/><Team/></main><CecuvGuide/></div>
}
