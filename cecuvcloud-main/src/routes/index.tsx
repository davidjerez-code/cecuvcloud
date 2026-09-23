import { createFileRoute } from "@tanstack/react-router";
import { CecuvCloud } from "@/components/cecuv-cloud";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CECUV-Cloud | Laboratorio UV e IoT" },
      { name: "description", content: "Plataforma científica de control UV, simulación fotocatalítica y monitoreo IoT para descontaminación del agua." },
      { property: "og:title", content: "CECUV-Cloud | Laboratorio UV e IoT" },
      { property: "og:description", content: "Cabina experimental, simulación DoE y telemetría científica en tiempo real." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <CecuvCloud />;
}
