import type { TelemetrySample } from "./cecuv-telemetry";

function pdfText(value: string) {
  // The built-in Helvetica font uses ASCII. Keep byte offsets deterministic,
  // and escape PDF delimiters for names entered by the operator.
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7e]/g, "?")
    .replace(/[\\()]/g, "\\$&");
}

export function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function chartCommands(samples: readonly TelemetrySample[]) {
  if (!samples.length) return [];
  const firstTime = Date.parse(samples[0]!.timestamp);
  const duration = Math.max(1, Date.parse(samples.at(-1)!.timestamp) - firstTime);
  const path = (key: "temperature" | "uv", min: number, max: number) =>
    samples
      .map((sample, index) => {
        const x = 54 + ((Date.parse(sample.timestamp) - firstTime) / duration) * 500;
        const y = 130 + Math.max(0, Math.min(1, (sample[key] - min) / (max - min))) * 110;
        return `${x.toFixed(2)} ${y.toFixed(2)} ${index ? "l" : "m"}`;
      })
      .join(" ") + " S";
  return [
    "BT /F2 10 Tf 1 0 0 1 54 280 Tm (Historico de la sesion simulada) Tj ET",
    "BT /F1 9 Tf 1 0 0 1 54 263 Tm (Temperatura: rojo, 20-40 C. UV: azul, 0-10 mW/cm2.) Tj ET",
    "0.7 0.7 0.7 RG 0.5 w 54 130 500 110 re S",
    "0.85 0.2 0.15 RG 1.5 w " + path("temperature", 20, 40),
    "0.05 0.4 0.8 RG 1.5 w " + path("uv", 0, 10),
    "BT /F1 8 Tf 1 0 0 1 54 113 Tm (Inicio del registro) Tj ET",
    "BT /F1 8 Tf 1 0 0 1 455 113 Tm (Ultima muestra) Tj ET",
  ];
}

export function buildSimulationPdf(lines: string[], samples: readonly TelemetrySample[] = []) {
  const content = [
    "q 0.95 0.98 1 rg 0 0 612 792 re f Q",
    "0.05 0.18 0.24 RG 36 36 540 720 re S",
    "BT /F2 21 Tf 1 0 0 1 54 724 Tm (CECUV-Cloud) Tj ET",
    "BT /F1 11 Tf 1 0 0 1 54 704 Tm (Cabina Experimental de Control UV) Tj ET",
    ...lines.map(
      (line, index) =>
        `BT /${index < 2 ? "F2" : "F1"} ${index < 2 ? 14 : 10} Tf 1 0 0 1 54 ${660 - index * 24} Tm (${pdfText(line)}) Tj ET`,
    ),
    ...chartCommands(samples),
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
  const offsets: number[] = [];
  for (const object of objects) {
    offsets.push(pdf.length);
    pdf += object;
  }
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets.map((offset) => `${String(offset).padStart(10, "0")} 00000 n `).join("\n");
  pdf += `\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([pdf], { type: "application/pdf" });
}
