import { defineConfig, devices } from "@playwright/test"

const baseURL = process.env.BPO_WEB_URL ?? "http://localhost:3000"
const browserChannel = process.env.PLAYWRIGHT_CHANNEL ?? "chrome"

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  fullyParallel: false,
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], channel: browserChannel },
    },
  ],
})
