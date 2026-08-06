import { defineConfig } from "@playwright/test"

// E2E 行为检查：由 scripts/e2e.sh 编排独立的后端/前端进程后触发。
// 服务器编排（端口、数据库、种子数据）集中在 scripts/e2e.sh，本配置只负责测试执行。
export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  retries: 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: process.env.BPO_E2E_BASE_URL ?? "http://127.0.0.1:3310",
  },
})
