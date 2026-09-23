// Base de conocimiento del trabajo escrito CECUV (Semillero OPENIN — UCC, ESIS 2026)
// Usada por CECUV-Bot para responder preguntas libres del usuario.

export type KnowledgeEntry = {
  id: string;
  topic: string;
  keywords: string[];
  answer: string;
};

export const knowledgeBase: KnowledgeEntry[] = [
  {
    id: "cr6-riesgo",
    topic: "Cromo hexavalente Cr(VI)",
    keywords: ["cromo", "cr6", "crvi", "hexavalente", "toxico", "toxicidad", "peligro", "riesgo", "carcinogeno", "salud", "contaminante", "metal", "pesado", "curtiembre", "galvanoplastia", "pigmento", "salud publica"],
    answer: "El cromo hexavalente Cr(VI) es el contaminante objetivo del proyecto. Se origina en galvanoplastia, fabricación de pigmentos, curtido de pieles y tratamientos superficiales de metales. Es altamente oxidante, soluble y móvil en agua, muy persistente y carcinógeno: afecta hígado, riñones y material genético incluso en bajas concentraciones. Por eso el trabajo lo toma como referencia para medir la reducción alcanzada en los ensayos.",
  },
  {
    id: "cr6-cr3",
    topic: "Reducción de Cr(VI) a Cr(III)",
    keywords: ["cr3", "criii", "trivalente", "reduccion", "reducir", "degradacion", "remocion", "convierte", "transforma", "eficiencia"],
    answer: "En la fotocatálisis heterogénea los electrones fotogenerados en el TiO₂ reducen el Cr(VI) a Cr(III), una especie mucho menos tóxica y de baja movilidad, mientras los huecos generan radicales •OH que oxidan la materia orgánica acompañante. La variable dependiente del estudio es precisamente el porcentaje de reducción del Cr(VI) y la cinética de esa reacción.",
  },
  {
    id: "fotocatalisis",
    topic: "Fotocatálisis heterogénea y PAOs",
    keywords: ["fotocatalisis", "fotocatalitico", "pao", "paos", "oxidacion", "avanzada", "radical", "oh", "semiconductor", "electron", "hueco", "mecanismo", "como funciona", "quimica", "fundamento", "reaccion"],
    answer: "La fotocatálisis heterogénea es un Proceso de Oxidación Avanzada: al irradiar un semiconductor como el TiO₂ con luz UV-A se generan pares electrón–hueco. Los huecos producen radicales hidroxilo •OH, altamente oxidantes, y los electrones reducen especies metálicas como el Cr(VI). Es una tecnología limpia porque no depende del uso intensivo de reactivos químicos convencionales.",
  },
  {
    id: "tio2",
    topic: "Dióxido de titanio TiO₂",
    keywords: ["tio2", "titanio", "dioxido", "fotocatalizador", "catalizador", "concentracion", "gl", "g/l", "suspension", "sedimentacion", "dosis", "catalizador"],
    answer: "El fotocatalizador es dióxido de titanio (TiO₂). El diseño experimental evalúa cuatro concentraciones: M1 0,5 g/L, M2 1,0 g/L, M3 1,5 g/L y M4 2,0 g/L, ajustables según resultados preliminares. Para evitar que el TiO₂ sedimente por gravedad, la bandeja incorpora agitación magnética multipunto que mantiene la suspensión homogénea y expuesta a la radiación durante todo el ensayo.",
  },
  {
    id: "uv-a",
    topic: "Irradiación UV-A 365 nm y PWM",
    keywords: ["uv", "uva", "365", "nm", "longitud", "onda", "lampara", "lamparas", "led", "irradiacion", "radiacion", "intensidad", "pwm", "potencia", "luz", "fotorreactor"],
    answer: "El sistema de irradiación es híbrido y configurable: lámparas UV-A tubulares de emisión continua más módulos LED UV-A de alta densidad centrados en 365 nm. El control por modulación por ancho de pulsos (PWM) permite regular con precisión la intensidad, optimizar el consumo, reducir la disipación térmica y estudiar el efecto de distintos niveles radiativos sobre la degradación. Se eligió UV-A por su compatibilidad fotocatalítica, mayor seguridad frente a otras bandas UV, disponibilidad comercial y bajo consumo.",
  },
  {
    id: "estructura",
    topic: "Estructura y materiales de la cabina",
    keywords: ["estructura", "material", "materiales", "madera", "triplex", "marino", "chasis", "carcasa", "15", "mm", "construccion", "cad", "diseno", "cabina", "dimension", "puerta", "tapa", "piston", "pistones", "neumatico"],
    answer: "La estructura externa se fabrica en madera Triplex Marino de 15 mm por su resistencia mecánica, estabilidad dimensional, resistencia a la humedad, fácil mecanizado y bajo costo frente a estructuras metálicas. La tapa abatible se asiste con pistones neumáticos para una apertura suave, controlada y segura, y el diseño facilita futuras modificaciones y mantenimiento.",
  },
  {
    id: "mylar",
    topic: "Revestimiento reflectivo Mylar",
    keywords: ["mylar", "reflectivo", "reflexion", "aluminizado", "pelicula", "interno", "pared", "paredes", "uniformidad", "homogenea", "distribucion"],
    answer: "Las paredes internas se recubren con película reflectiva tipo Mylar aluminizado: alta reflectividad, resistencia térmica, bajo peso y fácil instalación. Su función es incrementar la eficiencia lumínica, reducir pérdidas de radiación, mejorar la distribución energética dentro de la cámara y generar condiciones uniformes para todas las muestras.",
  },
  {
    id: "visor",
    topic: "Ventana de inspección",
    keywords: ["ventana", "visor", "vidrio", "templado", "polarizado", "inspeccion", "observacion", "mirar", "ver", "filtro"],
    answer: "El sistema de observación es una ventana de inspección en vidrio templado de seguridad con película polarizada de protección UV. Permite monitorear las muestras sin abrir la cabina, evita la exposición directa del operador a la radiación, reduce perturbaciones del ensayo y mantiene estables las condiciones internas.",
  },
  {
    id: "bandeja",
    topic: "Bandeja AISI 304 y agitación",
    keywords: ["bandeja", "aisi", "304", "acero", "inoxidable", "plataforma", "soporte", "agitacion", "magnetica", "agitador", "multipunto", "muestra", "recipiente", "vaso"],
    answer: "La plataforma de trabajo es una bandeja de acero inoxidable AISI 304, elegida por su resistencia a la corrosión, facilidad de limpieza, compatibilidad con ambientes húmedos y larga vida útil. Debajo de ella se instala agitación magnética multipunto, que mantiene el TiO₂ suspendido en todos los recipientes de forma simultánea y garantiza reproducibilidad y cinéticas uniformes.",
  },
  {
    id: "electronica",
    topic: "Electrónica, sensores y data logging",
    keywords: ["electronica", "arduino", "esp32", "microcontrolador", "sensor", "sensores", "iot", "telemetria", "datos", "logging", "adquisicion", "temperatura", "humedad", "cronometro", "temporizador", "monitoreo", "dashboard", "electrico", "fuente", "fusible", "cableado", "mqtt", "websockets"],
    answer: "La CECUV integra un módulo de adquisición de datos (data logging) con microcontrolador ESP32/Arduino que registra y transmite vía IoT/MQTT en tiempo real la temperatura interna, la humedad relativa, la intensidad radiativa UV y el tiempo transcurrido, minimizando errores humanos en la toma de datos. Se complementa con sensores térmicos, ópticos y de ambiente. El sistema eléctrico incluye fuente de alimentación conmutada, interruptor principal, cableado industrial y portafusibles de protección.",
  },
  {
    id: "termico",
    topic: "Disipación térmica y trampas de luz",
    keywords: ["ventilacion", "extractor", "extractores", "cooler", "fan", "trampa", "trampas", "calor", "termico", "disipacion", "sobrecalentamiento", "evaporacion", "fuga"],
    answer: "El control térmico se realiza con ventilación forzada mediante fan coolers equipados con trampas de luz impresas en 3D, que impiden el escape de radiación UV al exterior. Así se mantiene la temperatura interna estable (evitando degradación prematura de componentes), se previene el sobrecalentamiento y se evita la evaporación no deseada de las muestras líquidas.",
  },
  {
    id: "seguridad",
    topic: "Seguridad operativa e interlock",
    keywords: ["seguridad", "interlock", "microinterruptor", "apagado", "proteccion", "operador", "aislamiento", "riesgo", "accidente", "cerrada", "norma", "seguro"],
    answer: "Las consideraciones de seguridad incluyen cámara completamente cerrada, ventana con película polarizada UV, aislamiento térmico y eléctrico de las conexiones internas y un microinterruptor de interrupción automática (interlock switch) en la tapa abatible: al abrirla desenergiza de inmediato la iluminación UV, evitando la exposición accidental del operador.",
  },
  {
    id: "doe",
    topic: "Diseño de experimentos (DoE)",
    keywords: ["doe", "diseno", "experimento", "experimental", "factorial", "3k", "rsm", "superficie", "respuesta", "estadistico", "minitab", "interaccion", "variable", "variables", "cinetica", "modelo", "analisis", "optimizacion"],
    answer: "El análisis se apoya en un marco formal de Diseño de Experimentos: Diseño Factorial Completo 3k o Metodología de Superficie de Respuesta (RSM), en lugar de variar una sola variable a la vez. Esto permite estimar los efectos principales de la concentración de TiO₂ y del tiempo de exposición, y también sus interacciones. Los datos del data logging se procesan en software estadístico (Minitab o R) para modelar la ecuación de optimización del proceso.",
  },
  {
    id: "variables",
    topic: "Variables de la investigación",
    keywords: ["independiente", "dependiente", "control", "tiempo", "exposicion", "120", "minutos", "distancia", "volumen", "velocidad", "registro", "formato", "ensayo", "protocolo", "pasos", "metodologia"],
    answer: "Variables independientes: concentración de TiO₂ (0,5 / 1,0 / 1,5 / 2,0 g/L), tiempo de exposición UV y nivel de intensidad radiativa PWM. Variables dependientes: porcentaje de reducción del Cr(VI) y cinética de la reacción. Variables de control: temperatura interna, velocidad de agitación magnética, volumen de muestra y distancia a la fuente. Cada ensayo registra datos mediante telemetría IoT.",
  },
  {
    id: "costos",
    topic: "Costos y viabilidad económica",
    keywords: ["costo", "costos", "precio", "economico", "economica", "viabilidad", "presupuesto", "bom", "inversion", "barato", "ahorro", "reduccion", "fotorreactor", "comercial", "importado", "ventaja", "dolares", "cop"],
    answer: "La viabilidad económica es uno de los aportes más fuertes: la CECUV se construye con materiales de disponibilidad local (Triplex Marino, Mylar, LED UV-A, bandeja AISI 304, ESP32) y arquitectura abierta y modular. Frente a un fotorreactor comercial importado equivalente, la reducción de costo estimada está entre el 60% y el 75% (≈68% en la comparación del proyecto), lo que además permite optimizar recursos antes de escalar a plantas piloto.",
  },
  {
    id: "objetivos",
    topic: "Objetivos y pregunta de investigación",
    keywords: ["objetivo", "objetivos", "general", "especifico", "pregunta", "proposito", "meta", "alcance", "problema", "planteamiento", "justificacion"],
    answer: "Pregunta de investigación: ¿Cómo diseñar y construir una cabina experimental de control UV que permita determinar de manera controlada los parámetros óptimos de aplicación de fotocatalizadores en el tratamiento de aguas contaminadas? Objetivo general: Diseñar y construir dicha cabina para optimizar procesos fotocatalíticos mediante la determinación de parámetros operativos clave.",
  },
  {
    id: "innovacion",
    topic: "Innovación de la propuesta",
    keywords: ["innovacion", "novedad", "aporte", "diferencia", "original", "valor", "por que", "importante", "por que usar"],
    answer: "La innovación no radica en usar UV o TiO₂ por separado, sino en la integración de una herramienta experimental IoT de bajo costo, que permite estandarizar y registrar de forma automatizada las condiciones del ensayo antes de intervenir cuerpos de agua reales, reduciendo costos de experimentación e incertidumbre.",
  },
  {
    id: "resultados",
    topic: "Resultados esperados",
    keywords: ["resultado", "resultados", "esperado", "esperados", "validacion", "repetibilidad", "reproducibilidad", "escalamiento", "escala", "tendencia"],
    answer: "Como la cabina está en fase de diseño, construcción y validación, los resultados esperados contemplan: validación funcional de la telemetría, condiciones estables de radiación UV-A que favorezcan la repetibilidad, distribución uniforme del flujo fotónico y la determinación de las cinéticas de reducción óptimas para el Cr(VI).",
  },
  {
    id: "impacto",
    topic: "Impacto ambiental, social y académico",
    keywords: ["impacto", "ambiental", "social", "academico", "tecnologico", "sostenibilidad", "sostenible", "comunidad", "agua", "hidrico", "beneficio", "medio ambiente"],
    answer: "Impacto ambiental: promueve el desarrollo de tecnologías de tratamiento limpio para efluentes industriales. Social: la transferencia tecnológica abierta beneficia a comunidades rurales e instituciones con limitaciones presupuestales. Académico/Tecnológico: integra ingeniería de software, IoT, ciencias ambientales y diseño experimental.",
  },
  {
    id: "openin",
    topic: "Semillero OPENIN y Ponencia ESIS 2026",
    keywords: ["openin", "semillero", "equipo", "autor", "autores", "integrante", "integrantes", "quien", "quienes", "universidad", "cooperativa", "ucc", "indesco", "esis", "encuentro", "bogota", "campus", "2026", "institucion", "ponencia", "fecha"],
    answer: "El proyecto pertenece al Semillero de Investigación OPENIN de la Universidad Cooperativa de Colombia (UCC, Campus Bogotá). Se presenta en el VI Encuentro ESIS 2026 bajo el eje de Sostenibilidad Ambiental y Desarrollo Tecnológico. Autores: John Alejandro Almanza Valderrama, Andrés Felipe Leguizamón Rodríguez, David Stiven Jerez Díaz y Sara Valentina Quintana.",
  },
  {
    id: "cecuv-general",
    topic: "Qué es la CECUV",
    keywords: ["cecuv", "que es", "proyecto", "cabina", "resumen", "titulo", "sistema", "prototipo", "hace", "sirve", "que hace"],
    answer: "La CECUV (Cabina Experimental de Control UV) es un sistema de experimentación asistido por IoT que recrea condiciones estandarizadas para evaluar la degradación fotocatalítica de contaminantes en agua. Integra irradiación UV-A (365 nm), paredes Mylar, agitación magnética, ventilación con trampas de luz y monitoreo de variables en tiempo real.",
  },
];

const stop = new Set(["que", "cual", "cuales", "como", "para", "por", "los", "las", "del", "con", "una", "uno", "unos", "unas", "sobre", "este", "esta", "esto", "esos", "hay", "son", "the", "and", "mas", "muy", "tiene", "hace", "dime", "cuentame", "explicame", "explica", "puede", "puedes", "favor", "ser", "sus", "porque", "qué"]);

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(text: string) {
  return normalize(text).split(" ").filter((t) => t.length > 2 && !stop.has(t));
}

export type BotReply = { text: string; topics: string[] };

/** Evalúa la pregunta libre del usuario contra la matriz de conocimiento. */
export function answerQuestion(question: string): BotReply {
  const raw = normalize(question);
  const words = tokens(question);

  if (!raw) {
    return { 
      text: "Escriba una pregunta sobre la CECUV: fundamentos del Cr(VI), fotocatálisis, diseño de la cabina, electrónica IoT, diseño de experimentos, costos o el semillero OPENIN.", 
      topics: [] 
    };
  }

  if (/^(hola|buenas|buenos dias|buenas tardes|hey|saludos|que tal)\b/.test(raw)) {
    return { 
      text: "Hola, soy CECUV—Bot. Consulto la matriz de conocimiento del trabajo escrito del Semillero OPENIN (UCC - ESIS 2026). Pregúnteme por la toxicidad del Cr(VI), la fotocatálisis con TiO₂/UV-A, la estructura física de la cabina, la telemetría ESP32, el diseño de experimentos (DoE) o los costos de fabricación.", 
      topics: [] 
    };
  }

  const scored = knowledgeBase
    .map((entry) => {
      let score = 0;
      for (const key of entry.keywords) {
        if (raw.includes(key)) score += key.length > 4 ? 3.5 : 2.5;
      }
      for (const word of words) {
        if (entry.keywords.some((k) => k.startsWith(word) || word.startsWith(k))) score += 1.2;
        if (normalize(entry.topic).includes(word)) score += 2;
        if (normalize(entry.answer).includes(word)) score += 0.5;
      }
      return { entry, score };
    })
    .filter((s) => s.score > 1.8)
    .sort((a, b) => b.score - a.score);

  if (!scored.length) {
    return {
      text: "No encontré información exacta para esa consulta en la base del proyecto. Prueba preguntando por: toxicidad del Cr(VI), fotocatálisis con TiO₂, lámparas UV-A 365nm, madera Triplex Marino, película Mylar, visor polarizado, agitación AISI 304, sensores ESP32, interruptor interlock, diseño DoE, reducción de costos o integrantes del semillero OPENIN.",
      topics: [],
    };
  }

  const top = scored.slice(0, 2);
  const text = top.map((s) => s.entry.answer).join("\n\n");
  return { text, topics: top.map((s) => s.entry.topic) };
}