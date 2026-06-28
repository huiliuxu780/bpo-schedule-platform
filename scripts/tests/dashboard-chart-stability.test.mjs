import { describe, it } from "node:test"
import { strict as assert } from "node:assert"
import { readFile } from "node:fs/promises"

describe("Dashboard Chart Stability", () => {
  describe("chart-area-interactive component structure", () => {
    it("should export ChartAreaInteractive component", async () => {
      const content = await readFile(
        "components/chart-area-interactive.tsx",
        "utf-8"
      )
      assert.ok(
        content.includes("export function ChartAreaInteractive"),
        "Should export ChartAreaInteractive component"
      )
    })

    it("should not expose fake day/week/month range controls", async () => {
      const content = await readFile(
        "components/chart-area-interactive.tsx",
        "utf-8"
      )
      assert.ok(
        !content.includes('const ranges = ["日", "周", "月"]'),
        "Should not preserve fake day/week/month range options"
      )
      assert.ok(
        !content.includes("range === item"),
        "Should not have fake range selection logic"
      )
    })

    it("should have stable shadcn chart container dimensions", async () => {
      const content = await readFile(
        "components/chart-area-interactive.tsx",
        "utf-8"
      )
      assert.ok(
        content.includes("h-[250px]"),
        "ChartContainer should have fixed dashboard-01 height"
      )
      assert.ok(
        content.includes("aspect-auto"),
        "ChartContainer should use dashboard-01 aspect-auto sizing"
      )
    })

    it("should use shadcn ChartContainer with initialDimension", async () => {
      const content = await readFile(
        "components/chart-area-interactive.tsx",
        "utf-8"
      )
      assert.ok(
        content.includes("ChartContainer"),
        "Should use shadcn ChartContainer"
      )
      assert.ok(
        content.includes("initialDimension"),
        "ChartContainer should pass initialDimension for stable rendering"
      )
    })

    it("should provide stable initial dimension values", async () => {
      const content = await readFile(
        "components/chart-area-interactive.tsx",
        "utf-8"
      )
      const hasInitialDimension =
        content.includes("CHART_INITIAL_DIMENSION") ||
        content.match(/initialDimension\s*=\s*\{\s*[^}]*width\s*:/)
      assert.ok(
        hasInitialDimension,
        "Should define initial dimension constant or inline object with width/height"
      )
    })

    it("should not contain forbidden internal terminology", async () => {
      const content = await readFile(
        "components/chart-area-interactive.tsx",
        "utf-8"
      )
      const forbiddenTerms = [
        "Gate Plan",
        "PM",
        "Harness",
        "Codex",
        "Packet A",
        "Packet B",
        "IM254",
      ]
      for (const term of forbiddenTerms) {
        assert.ok(
          !content.includes(term),
          `Should not contain forbidden term: ${term}`
        )
      }
    })

    it("should not contain auto-capability or production real-time wording", async () => {
      const content = await readFile(
        "components/chart-area-interactive.tsx",
        "utf-8"
      )
      const forbiddenPhrases = [
        "自动排班",
        "自动修复",
        "生产实时",
        "real-time",
        "自动调整",
      ]
      for (const phrase of forbiddenPhrases) {
        assert.ok(
          !content.includes(phrase),
          `Should not contain forbidden phrase: ${phrase}`
        )
      }
    })

    it("should not introduce new dependencies", async () => {
      const content = await readFile(
        "components/chart-area-interactive.tsx",
        "utf-8"
      )
      // Check that it still uses recharts (not a new chart library)
      assert.ok(
        content.includes('from "recharts"'),
        "Should continue using recharts library"
      )
      // Ensure no new chart library imports (use word boundaries to avoid false positives like "recharts" containing "echarts")
      const forbiddenLibraries = [
        "chart.js",
        /from\s+["']d3/,
        /from\s+["']highcharts/,
        /from\s+["']apexcharts/,
        /from\s+["']echarts/,
      ]
      for (const lib of forbiddenLibraries) {
        const pattern = lib instanceof RegExp ? lib : new RegExp(lib, "i")
        assert.ok(
          !pattern.test(content),
          `Should not introduce new chart library: ${lib}`
        )
      }
    })
  })

  describe("chart wrapper stability", () => {
    it("should wrap chart content in stable container", async () => {
      const content = await readFile(
        "components/chart-area-interactive.tsx",
        "utf-8"
      )
      const hasStableWrapper =
        content.includes("ChartContainer") &&
        content.includes("h-[250px]") &&
        content.includes("w-full")
      assert.ok(
        hasStableWrapper,
        "Should wrap chart in stable container with dimension constraints"
      )
    })

    it("should prevent layout shift during SSR hydration", async () => {
      const content = await readFile(
        "components/chart-area-interactive.tsx",
        "utf-8"
      )
      const hasHydrationProtection =
        content.includes("use client") ||
        content.includes('initialDimension') ||
        content.includes("min-h-")
      assert.ok(
        hasHydrationProtection,
        "Should have SSR hydration protection (client directive, initial dimension, or min-height)"
      )
    })
  })
})
