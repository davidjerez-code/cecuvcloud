export const materials = [
  { category: "Estructural", name: "Triplex marino 15 mm", quantity: "2 láminas", cost: 380000 },
  { category: "Óptico", name: "Mylar aluminizado 95%", quantity: "4 m²", cost: 185000 },
  { category: "Radiación", name: "Módulos LED UV-A 365 nm", quantity: "6", cost: 540000 },
  { category: "Mecánico", name: "Bandeja AISI 304", quantity: "1", cost: 210000 },
  { category: "Electrónico", name: "ESP32 + sensores", quantity: "1 kit", cost: 165000 },
  { category: "Seguridad", name: "Interlock + filtro UV", quantity: "1 kit", cost: 128000 },
  { category: "Térmico", name: "Extractores 120 mm", quantity: "2", cost: 96000 },
  { category: "Mecánico", name: "Pistones neumáticos", quantity: "2", cost: 140000 },
] as const;

export const prototypeCost = materials.reduce((total, item) => total + item.cost, 0);
export const commercialCost = { min: 6000000, max: 8000000 } as const;
export const savingsRange = {
  min: Math.round((1 - prototypeCost / commercialCost.min) * 100),
  max: Math.round((1 - prototypeCost / commercialCost.max) * 100),
};
export const savingsLabel = `${savingsRange.min}%–${savingsRange.max}%`;

export function formatCop(value: number) {
  return `$${new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 }).format(value)}`;
}
