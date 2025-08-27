import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/2a2", // ✅ só vai rodar essa pasta
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  }
});