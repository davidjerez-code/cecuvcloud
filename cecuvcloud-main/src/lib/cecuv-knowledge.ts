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
    keywords: ["cromo", "cr6", "crvi", "hexavalente", "toxico", "toxicidad", "peligro", "riesgo", "carcinogeno", "salud", "contaminante", "metal", "pesado", "curtiembre", "galvanoplastia", "pigmento"],
    answer: "El cromo hexavalente Cr(VI) es el contaminante objetivo del proyecto. Se origina en galvanoplastia, fabricación de pigmentos, curtido de pieles y tratamientos superficiales de metales. Es altamente oxidante, soluble y móvil en agua, muy persistente y carcinógeno: afecta hígado, riñones y material genético incluso en bajas concentraciones. Por eso el trabajo lo toma como referencia para medir la reducción alcanzada en los ensayos.",
  },
  {
    id: "cr6-cr3",
    topic: "Reducción de Cr(VI) a Cr(III)",
    keywords: ["cr3", "criii", "trivalente", "reduccion", "reducir", "degradacion", "remocion", "convierte", "transforma"],
    answer: "En la fotocatálisis heterogénea los electrones fotogenerados en el TiO₂ reducen el Cr(VI) a Cr(III), una especie mucho menos tóxica y de baja movilidad, mientras los huecos generan radicales •OH que oxidan la materia orgánica acompañante. La variable dependiente del estudio es precisamente el porcentaje de reducción del Cr(VI) y la cinética de esa reacción.",
  },
  {
    id: "fotocatalisis",
    topic: "Fotocatálisis heterogénea y PAOs",
    keywords: ["fotocatalisis", "fotocatalitico", "pao", "paos", "oxidacion", "avanzada", "radical", "oh", "semiconductor", "electron", "hueco", "mecanismo", "como", "funciona", "quimica", "fundamento"],
    answer: "La fotocatálisis heterogénea es un Proceso de Oxidación Avanzada: al irradiar un semiconductor como el TiO₂ con luz UV-A se generan pares electrón–hueco. Los huecos producen radicales hidroxilo •OH, altamente oxidantes, y los electrones reducen especies metálicas como el Cr(VI). Es una tecnología limpia porque no depende del uso intensivo de reactivos químicos convencionales.",
  },
  {
    id: "tio2",
    topic: "Dióxido de titanio TiO₂",
    keywords: ["tio2", "titanio", "dioxido", "fotocatalizador", "catalizador", "concentracion", "gl", "g/l", "suspension", "sedimentacion", "dosis"],
    answer: "El fotocatalizador es dióxido de titanio (TiO₂). El diseño experimental evalúa cuatro concentraciones: M1 0,5 g/L, M2 1,0 g/L, M3 1,5 g/L y M4 2,0 g/L, ajustables según resultados preliminares. Para evitar que el TiO₂ sedimente por gravedad, la bandeja incorpora agitación magnética multipunto que mantiene la suspensión homogénea y expuesta a la radiación durante todo el ensayo.",
  },
  {
    id: "uv-a",
    topic: "Irradiación UV-A 365 nm y PWM",
    keywords: ["uv", "uva", "365", "nm", "longitud", "onda", "lampara", "lamparas", "led", "irradiacion", "radiacion", "intensidad", "pwm", "potencia", "luz"],
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
    keywords: ["electronica", "arduino", "esp32", "microcontrolador", "sensor", "sensores", "iot", "telemetria", "datos", "logging", "adquisicion", "temperatura", "humedad", "cronometro", "temporizador", "monitoreo", "dashboard", "electrico", "fuente", "fusible", "cableado"],
    answer: "La CECUV integra un módulo de adquisición de datos (data logging) con microcontrolador Arduino/ESP32 que registra y almacena en tiempo real la temperatura interna, la humedad relativa, la intensidad radiativa UV y el tiempo transcurrido, minimizando errores humanos en la toma de datos. Se complementa con sensor de temperatura, sensor de humedad, sensor de intensidad UV y temporizador digital. El sistema eléctrico incluye fuente de alimentación, interruptor principal, cableado protegido, portafusibles y conexión para las lámparas UV.",
  },
  {
    id: "termico",
    topic: "Disipación térmica y trampas de luz",
    keywords: ["ventilacion", "extractor", "extractores", "cooler", "fan", "trampa", "trampas", "calor", "termico", "disipacion", "sobrecalentamiento", "evaporacion", "fuga"],
    answer: "El control térmico se realiza con ventilación forzada mediante fan coolers equipados con trampas de luz, que impiden el escape de radiación UV al exterior. Así se mantiene la temperatura interna estable, se previene el sobrecalentamiento y se evita la evaporación no deseada de las muestras.",
  },
  {
    id: "seguridad",
    topic: "Seguridad operativa e interlock",
    keywords: ["seguridad", "interlock", "microinterruptor", "apagado", "proteccion", "operador", "aislamiento", "riesgo", "accidente", "cerrada"],
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
    answer: "Variables independientes: concentración de TiO₂ (0,5 / 1,0 / 1,5 / 2,0 g/L), tiempo de exposición UV y nivel de intensidad radiativa. Variables dependientes: porcentaje de reducción del Cr(VI) y cinética de la reacción. Variables de control: temperatura interna (regulada por ventilación), velocidad de agitación magnética, volumen de muestra y distancia a la fuente. Cada ensayo registra fecha, identificación de muestra, concentración de TiO₂, tiempo de exposición, temperatura interna, humedad relativa y observaciones.",
  },
  {
    id: "costos",
    topic: "Costos y viabilidad económica",
    keywords: ["costo", "costos", "precio", "economico", "economica", "viabilidad", "presupuesto", "bom", "inversion", "barato", "ahorro", "reduccion", "fotorreactor", "comercial", "importado", "ventaja"],
    answer: "La viabilidad económica es uno de los aportes fuertes: la CECUV se construye con materiales de disponibilidad local (Triplex Marino, Mylar, LED UV-A, bandeja AISI 304, ESP32) y arquitectura abierta y modular. Frente a un fotorreactor comercial importado equivalente, la reducción de costo estimada está entre el 60% y el 75% (≈68% en la comparación del proyecto), lo que además permite optimizar recursos y reducir los costos asociados a la experimentación previa a intervenir cuerpos de agua reales.",
  },
  {
    id: "objetivos",
    topic: "Objetivos y pregunta de investigación",
    keywords: ["objetivo", "objetivos", "general", "especifico", "pregunta", "proposito", "meta", "alcance", "problema", "planteamiento", "justificacion"],
    answer: "Pregunta de investigación: ¿cómo diseñar y construir una cabina experimental de control UV que permita determinar de manera controlada los parámetros óptimos de aplicación de fotocatalizadores en el tratamiento de aguas contaminadas? Objetivo general: diseñar y construir esa cabina para optimizar procesos fotocatalíticos mediante la determinación de parámetros operativos. Entre los específicos: identificar las variables operativas que influyen en la eficiencia, diseñar la estructura física y funcional, y realizar ensayos comparativos reproducibles.",
  },
  {
    id: "innovacion",
    topic: "Innovación de la propuesta",
    keywords: ["innovacion", "novedad", "aporte", "diferencia", "original", "valor", "por que", "importante"],
    answer: "La innovación no está en usar UV o fotocatalizadores, tecnologías ya estudiadas, sino en construir una herramienta experimental que permita determinar de forma controlada las condiciones óptimas del proceso antes de intervenir cuerpos de agua reales. Así la CECUV optimiza recursos, reduce costos de experimentación y genera información técnica útil para aplicaciones ambientales, académicas e industriales.",
  },
  {
    id: "resultados",
    topic: "Resultados esperados",
    keywords: ["resultado", "resultados", "esperado", "esperados", "validacion", "repetibilidad", "reproducibilidad", "escalamiento", "escala", "tendencia"],
    answer: "Como la cabina está en fase de diseño, construcción y validación, no se reportan resultados definitivos sino esperados: validación funcional del sistema, condiciones estables de irradiación que favorezcan la repetibilidad, distribución uniforme de la radiación gracias al recubrimiento reflectivo, identificación de tendencias al variar TiO₂ y tiempo de exposición, y generación de parámetros de referencia que reduzcan la incertidumbre del escalamiento a cuerpos de agua mayores.",
  },
  {
    id: "impacto",
    topic: "Impacto ambiental, social, académico y tecnológico",
    keywords: ["impacto", "ambiental", "social", "academico", "tecnologico", "sostenibilidad", "sostenible", "comunidad", "agua", "hidrico", "beneficio", "medio", "ambiente"],
    answer: "Impacto ambiental: avanza en tecnologías limpias para recuperar fuentes hídricas y reduce la dependencia de reactivos químicos. Social: los conocimientos pueden apoyar soluciones en comunidades rurales, instituciones educativas, organizaciones ambientales y sectores productivos, y fomenta la cultura científica estudiantil. Académico: integra ingeniería, ciencias ambientales y gestión tecnológica, y habilita nuevas líneas de investigación y trabajos de grado. Tecnológico: aporta una herramienta experimental específica para optimizar procesos fotocatalíticos.",
  },
  {
    id: "openin",
    topic: "Semillero OPENIN y equipo",
    keywords: ["openin", "semillero", "equipo", "autor", "autores", "integrante", "integrantes", "quien", "quienes", "universidad", "cooperativa", "ucc", "indesco", "esis", "encuentro", "bogota", "campus", "2026", "institucion"],
    answer: "El proyecto pertenece al Semillero de Investigación OPENIN de la Universidad Cooperativa de Colombia, Campus Bogotá (2026), y se presenta en el VI Encuentro ESIS 2026 bajo el eje de Sostenibilidad Ambiental y Desarrollo Tecnológico. Autores: John Alejandro Almanza Valderrama, Andrés Felipe Leguizamón Rodríguez, David Stiven Jerez Díaz y Sara Valentina Quintana. El trabajo también busca fortalecer las capacidades científicas del semillero y la formación en investigación aplicada.",
  },
  {
    id: "cecuv-general",
    topic: "Qué es la CECUV",
    keywords: ["cecuv", "que", "es", "proyecto", "cabina", "resumen", "titulo", "sistema", "prototipo", "hace", "sirve"],
    answer: "La CECUV (Cabina Experimental de Control UV) es un sistema de experimentación que recrea condiciones controladas para estudiar procesos fotocatalíticos aplicados a aguas contaminadas. Integra irradiación UV-A, superficies reflectivas internas, bandeja con agitación, ventilación con trampas de luz, interlock de seguridad y adquisición automática de datos. Su fin es determinar parámetros óptimos (TiO₂, tiempo, intensidad) a pequeña escala antes de intervenir cuerpos de agua reales.",
  },
];

const stop = new Set(["que", "cual", "cuales", "como", "para", "por", "los", "las", "del", "con", "una", "uno", "unos", "unas", "sobre", "este", "esta", "esto", "esos", "hay", "son", "the", "and", "mas", "muy", "the", "tiene", "hace", "dime", "cuentame", "explicame", "explica", "puede", "puedes", "favor", "ser", "sus", "sus", "porque", "por", "qué"]);

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
    return { text: "Escriba una pregunta sobre la CECUV: fundamentos del Cr(VI), fotocatálisis, diseño de la cabina, electrónica IoT, diseño de experimentos, costos o el semillero OPENIN.", topics: [] };
  }

  if (/^(hola|buenas|buenos dias|buenas tardes|hey|saludos)\b/.test(raw)) {
    return { text: "Hola, soy CECUV—Bot. Consulto la matriz de conocimiento del trabajo escrito del Semillero OPENIN. Pregúnteme por Cr(VI), fotocatálisis con TiO₂/UV-A, materiales y diseño de la cabina, electrónica y telemetría, diseño de experimentos, costos o resultados esperados.", topics: [] };
  }

  const scored = knowledgeBase
    .map((entry) => {
      let score = 0;
      for (const key of entry.keywords) {
        if (raw.includes(key)) score += key.length > 4 ? 3 : 2;
      }
      for (const word of words) {
        if (entry.keywords.some((k) => k.startsWith(word) || word.startsWith(k))) score += 1;
        if (normalize(entry.topic).includes(word)) score += 2;
        if (normalize(entry.answer).includes(word)) score += 0.5;
      }
      return { entry, score };
    })
    .filter((s) => s.score > 1.5)
    .sort((a, b) => b.score - a.score);

  if (!scored.length) {
    return {
      text: "No encontré esa información en el trabajo escrito. Puedo responder sobre: toxicidad del Cr(VI), fotocatálisis heterogénea y TiO₂, irradiación UV-A 365 nm con PWM, materiales y diseño de la cabina, Mylar y visor, bandeja AISI 304 con agitación, electrónica ESP32 y telemetría, seguridad e interlock, diseño de experimentos (DoE/RSM), variables, costos y viabilidad, impactos y el semillero OPENIN.",
      topics: [],
    };
  }

  const top = scored.slice(0, 2);
  const text = top.map((s) => s.entry.answer).join("\n\n");
  return { text, topics: top.map((s) => s.entry.topic) };
}
