import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  [
    "¿Cuánto tarda un tratamiento?",
    "Entre 45 y 90 minutos, según el pH del efluente y la concentración inicial de Cr(VI). Los ensayos ácidos y de baja concentración se completan más rápido.",
  ],
  [
    "¿Cuánto duran los componentes?",
    "Las lámparas UV-A 365 nm superan las 8.000 horas de uso. El catalizador TiO₂ es reutilizable: se recupera por sedimentación y se emplea en nuevos ciclos.",
  ],
  [
    "¿Es segura la radiación UV dentro de la cabina?",
    "Sí. La cabina está cerrada con visor filtro UV, paredes de Mylar que confinan la luz y un interlock que apaga las lámparas al abrir la puerta. Se recomienda usar gafas y guantes al manipular muestras.",
  ],
  [
    "¿Qué pasa con el Cr(III) que se forma?",
    "Es menos tóxico y precipita como hidróxido, por lo que puede separarse por filtración o sedimentación y disponerse de forma controlada.",
  ],
] as const;

export function FaqAccordion() {
  return (
    <div className="faq-box">
      <div className="section-heading">
        <small>05 / PREGUNTAS FRECUENTES</small>
        <h2>Resolvemos tus dudas</h2>
      </div>
      <Accordion type="single" collapsible className="faq-acc">
        {faqs.map(([q, a], i) => (
          <AccordionItem key={q} value={`f${i}`}>
            <AccordionTrigger>{q}</AccordionTrigger>
            <AccordionContent>{a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
