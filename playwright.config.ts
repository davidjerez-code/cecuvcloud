import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: process.env["BASE_URL"] || "http://127.0.0.1:4180",
    reducedMotion: "reduce",
    trace: "off",
    screenshot: "only-on-failure",
    launchOptions: process.env["PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH"]
      ? { executablePath: process.env["PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH"] }
      : {},
  },
  projects: [
    { name: "escritorio", use: { viewport: { width: 1440, height: 1000 } } },
    { name: "movil", use: { viewport: { width: 390, height: 844 } } },
  ],
  ...(process.env["BASE_URL"]
    ? {}
    : {
        webServer: {
          command: "npm run dev -- --host 127.0.0.1 --port 4180",
          url: "http://127.0.0.1:4180",
          reuseExistingServer: !process.env["CI"],
          timeout: 30000,
        },
      }),
});
