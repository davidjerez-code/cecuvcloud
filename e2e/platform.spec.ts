import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  // The root effect marks the document dark after React has hydrated it.
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("idioma, temas, recursos originales y presupuesto coherente", async ({ page, request }) => {
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await page.getByRole("button", { name: "Modo claro", exact: true }).click();
  await expect(page.locator(".cecuv-app")).toHaveClass(/light-theme/);
  await page.getByRole("button", { name: "Modo oscuro", exact: true }).click();
  await expect(page.getByRole("link", { name: "Ver póster ESIS 2026" })).toHaveAttribute(
    "href",
    /canva\.com\/design\/.+\/view$/,
  );
  const pdf = await request.get("/documents/trabajo-escrito-esis-2026.pdf");
  expect(pdf.status()).toBe(200);
  expect((await pdf.body()).subarray(0, 5).toString()).toBe("%PDF-");
  await page.locator("#equipo").scrollIntoViewIfNeeded();
  const photos = page.locator("#equipo img");
  await expect(photos).toHaveCount(3);
  for (const photo of await photos.all()) {
    await expect(photo).toHaveAttribute("src", /^\/team\/.+\.jpeg$/);
    await expect
      .poll(() => photo.evaluate((img: HTMLImageElement) => img.naturalWidth))
      .toBeGreaterThan(0);
  }
  const prices = await page.locator(".bom-table tbody tr td:last-child").allTextContents();
  const total = prices.reduce((sum, price) => sum + Number(price.replace(/\D/g, "")), 0);
  const displayed = await page.locator(".cost-summary h2").textContent();
  expect(Number(displayed!.replace(/\D/g, ""))).toBe(total);
  expect(total).toBe(1844000);
});

test("QR y metadatos conservan la URL pública incluso desde otro origen", async ({ page }) => {
  const canonicalUrl = "https://cecuvcloud.vercel.app/";
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", canonicalUrl);
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", canonicalUrl);
  await page.getByRole("button", { name: "Desplegar QR", exact: true }).click();
  await expect(page.getByRole("dialog").locator("code")).toHaveText(canonicalUrl);
  await expect(page.getByRole("dialog").locator(".platform-qr svg")).toBeVisible();
});

test("los cinco controles tienen nombre y el estimador no activa el ensayo", async ({ page }) => {
  await page.getByRole("slider", { name: "Tiempo de exposición", exact: true }).focus();
  await page.keyboard.press("Home");
  await expect(page.locator(".doe-result strong")).toHaveText("0%");
  for (const name of ["Concentración de TiO₂", "Tiempo de exposición", "Potencia radiativa LED"]) {
    await page.getByRole("slider", { name, exact: true }).focus();
    await page.keyboard.press("End");
  }
  await expect(page.locator(".doe-result strong")).toHaveText("100%");
  await page.getByRole("tab", { name: "Estimación de tratamiento" }).click();
  for (const name of ["Volumen a tratar", "Concentración inicial Cr(VI)"]) {
    await page.getByRole("slider", { name, exact: true }).focus();
    await page.keyboard.press("End");
  }
  await expect(page.locator(".calc-results")).toContainText("2 ciclos");
  await expect(page.locator(".safety-banner b")).toContainText("SISTEMA EN ESPERA");
  await page.getByRole("tab", { name: "Monitoreo en vivo" }).click();
  await expect(page.locator(".calc-box")).toBeHidden();
});

test("interlock conserva la historia, CSV seguro y reporte PDF trazable", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const dashboard = page.locator("#telemetria");
  await dashboard.getByRole("button", { name: "▷ Iniciar", exact: true }).click();
  await expect(dashboard.locator(".metrics-6 .metric-value strong").nth(3)).not.toHaveText("00:00");
  await dashboard.getByRole("button", { name: "Simular apertura", exact: true }).click();
  await expect(dashboard.getByRole("button", { name: "▷ Iniciar", exact: true })).toBeDisabled();
  await expect(dashboard.locator(".metrics-6 .metric-value strong").nth(2)).toHaveText(
    "0.00mW/cm²",
  );
  await expect(dashboard.locator(".metrics-6 .metric-value strong").nth(4)).toHaveText("0RPM");
  const csvEvent = page.waitForEvent("download");
  await dashboard.getByRole("button", { name: "Descargar registro CSV", exact: true }).click();
  const csv = await csvEvent;
  const rows = (await readFile((await csv.path())!, "utf8"))
    .trim()
    .split("\n")
    .slice(1)
    .map((line) => line.split(","));
  expect(rows.every((row) => row.length === 7)).toBeTruthy();
  expect(rows.some((row) => Number(row[4]) > 0)).toBeTruthy();
  expect(rows.at(-1)!.slice(4)).toEqual(["0", "0", "abierto"]);
  expect(rows[0]![0]).toMatch(/^CEC-[A-F0-9]{8}$/);
  await dashboard.getByRole("button", { name: "Exporte el registro", exact: true }).click();
  await page.getByLabel("Operador (opcional)").fill("Calidad CECUV (OPENIN)");
  const pdfEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "Reporte de simulación PDF", exact: true }).click();
  const pdf = await pdfEvent;
  const pdfPath = info.outputPath("reporte.pdf");
  await pdf.saveAs(pdfPath);
  const bytes = await readFile(pdfPath);
  expect(bytes.subarray(0, 5).toString()).toBe("%PDF-");
  expect(bytes.toString()).toContain("Operador: Calidad CECUV");
  expect(bytes.toString()).toContain("DoE de referencia:");
  expect(bytes.toString()).toContain("Historico de la sesion simulada");
  await page.keyboard.press("Escape");
  await dashboard.getByRole("button", { name: "Cerrar puerta", exact: true }).click();
  await expect(dashboard.locator(".safety-banner b")).toContainText("SISTEMA EN ESPERA");
  expect(errors).toEqual([]);
});

test("prototipo, chatbot, recorrido y menú móvil", async ({ page, isMobile }) => {
  for (let i = 1; i <= 8; i++) {
    const point = page.getByRole("button", { name: new RegExp(`^Punto ${i}:`) });
    await point.click();
    await expect(point).toHaveClass(/active/);
  }
  await page
    .getByRole("textbox", { name: "Pregunta para CECUV-Bot" })
    .fill("Hola, ¿cómo funciona el interlock?");
  await page.getByRole("button", { name: "Enviar pregunta", exact: true }).click();
  await expect(page.locator(".bot-topics").last()).toContainText("Seguridad operativa e interlock");
  await page.getByRole("button", { name: "Iniciar Recorrido Interactivo", exact: true }).click();
  for (let i = 0; i < 4; i++)
    await page.locator(".guide-card").getByRole("button", { name: "Siguiente" }).click();
  await expect(
    page.locator(".guide-card").getByRole("button", { name: "Reiniciar recorrido" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Cerrar recorrido" }).click();
  if ((page.viewportSize()?.width ?? 1440) < 1050 || isMobile) {
    await page.getByRole("button", { name: "Abrir menú", exact: true }).click();
    await page
      .getByRole("navigation")
      .getByRole("button", { name: "Telemetría IoT", exact: true })
      .click();
    await expect(page.getByRole("button", { name: "Abrir menú", exact: true })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  }
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBeTruthy();
});

test("404 en español permite volver al inicio", async ({ page }) => {
  const response = await page.goto("/ruta-inexistente-cecuv");
  expect(response?.status()).toBe(404);
  await page.getByRole("link", { name: "Volver al inicio", exact: true }).click();
  await expect(page.locator("h1").first()).toContainText("CECUV");
});
