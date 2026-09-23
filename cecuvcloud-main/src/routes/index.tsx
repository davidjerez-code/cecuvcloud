import { createFileRoute } from "@tanstack/react-router";
import { CecuvCloud } from "@/components/cecuv-cloud";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CECUV-Cloud | Laboratorio UV e IoT · Semillero OPENIN" },
      { 
        name: "description", 
        content: "Plataforma científica de control UV, simulación fotocatalítica DoE (TiO₂/UV-A) y monitoreo IoT en tiempo real para la remoción de Cr(VI) en aguas residuales." 
      },
      { property: "og:title", content: "CECUV-Cloud | Laboratorio UV e IoT" },
      { 
        property: "og:description", 
        content: "Cabina experimental, simulación cinético-fotocatalítica y telemetría científica en tiempo real para el VI Encuentro ESIS 2026." 
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "keywords", content: "CECUV, IoT, Fotocatalisis, TiO2, UV-A, Cr(VI), UCC, OPENIN, ESIS 2026, Telemetria" },
    ],
  }),
  component: IndexPage,
});

function IndexPage() {
  return <CecuvCloud />;
}