import { describe, it } from "node:test"
import { strict as assert } from "node:assert"
import { readFile } from "node:fs/promises"

describe("IM254 Packet B - Dashboard Anomaly Table Scanability", () => {
  describe("sortDashboardAnomaliesForReview function", () => {
    it("should export sortDashboardAnomaliesForReview", async () => {
      const content = await readFile(
        "components/data-table-model.ts",
        "utf-8"
      )
      assert.ok(
        content.includes("export function sortDashboardAnomaliesForReview"),
        "Should export sortDashboardAnomaliesForReview function"
      )
    })

    it("should sort by severity first (高 > 中 > 低)", async () => {
      const content = await readFile(
        "components/data-table-model.ts",
        "utf-8"
      )
      // Check that severity ranking is defined with Chinese characters
      assert.ok(
        content.includes("高: 0") || content.includes("'高': 0"),
        "Should prioritize 高 severity first"
      )
      assert.ok(
        content.includes("中: 1") || content.includes("'中': 1"),
        "Should place 中 severity second"
      )
      assert.ok(
        content.includes("低: 2") || content.includes("'低': 2"),
        "Should place 低 severity last"
      )
    })

    it("should prioritize 待复核 status", async () => {
      const content = await readFile(
        "components/data-table-model.ts",
        "utf-8"
      )
      assert.ok(
        content.includes("待复核"),
        "Should check for 待复核 status in sorting logic"
      )
      assert.ok(
        content.includes("a.status === \"待复核\"") ||
          content.includes("b.status === \"待复核\""),
        "Should compare status against 待复核"
      )
    })

    it("should prioritize items with downstream entry", async () => {
      const content = await readFile(
        "components/data-table-model.ts",
        "utf-8"
      )
      assert.ok(
        content.includes("downstreamEntry"),
        "Should check for downstreamEntry field"
      )
      assert.ok(
        content.includes("!= null") || content.includes("!== null"),
        "Should check if downstreamEntry exists"
      )
    })

    it("should sort by ID as final tiebreaker", async () => {
      const content = await readFile(
        "components/data-table-model.ts",
        "utf-8"
      )
      assert.ok(
        content.includes("localeCompare"),
        "Should use localeCompare for ID sorting"
      )
    })
  })

  describe("DataTable component integration", () => {
    it("should import sortDashboardAnomaliesForReview", async () => {
      const content = await readFile("components/data-table.tsx", "utf-8")
      assert.ok(
        content.includes("sortDashboardAnomaliesForReview"),
        "DataTable should import sortDashboardAnomaliesForReview"
      )
    })

    it("should use sorted source data", async () => {
      const content = await readFile("components/data-table.tsx", "utf-8")
      assert.ok(
        content.includes("sortedSourceAnomalies") ||
          content.includes("sortDashboardAnomaliesForReview(sourceAnomalies"),
        "DataTable should apply sorting to source anomalies"
      )
    })

    it("should keep TanStack sorting neutral so review ordering stays model-driven", async () => {
      const content = await readFile("components/data-table.tsx", "utf-8")
      assert.ok(
        content.includes("useState<SortingState>([])"),
        "Default table sorting should preserve source review ordering"
      )
      assert.ok(
        content.includes("sortDashboardAnomaliesForReview(sourceAnomalies)"),
        "Review ordering should come from the business sorting model"
      )
    })

    it("should calculate summary statistics", async () => {
      const content = await readFile("components/data-table.tsx", "utf-8")
      assert.ok(
        content.includes("highCount") || content.includes("summary.high"),
        "Should calculate high severity count"
      )
      assert.ok(
        content.includes("pendingReviewCount") ||
          content.includes("summary.pendingReview"),
        "Should calculate pending review count"
      )
      assert.ok(
        content.includes("drillableCount") ||
          content.includes("summary.drillable"),
        "Should calculate drillable count"
      )
    })

    it("should display summary badges in UI", async () => {
      const content = await readFile("components/data-table.tsx", "utf-8")
      assert.ok(
        content.includes("高严重度"),
        "Should display high severity badge"
      )
      assert.ok(
        content.includes("待复核") && content.includes("Badge"),
        "Should display pending review badge"
      )
      assert.ok(
        content.includes("可下钻"),
        "Should display drillable badge"
      )
    })

    it("should preserve existing toolbar controls", async () => {
      const content = await readFile("components/data-table.tsx", "utf-8")
      assert.ok(
        content.includes("Search") && content.includes("globalFilter"),
        "Should preserve search functionality"
      )
      assert.ok(
        content.includes("severityFilter") &&
          content.includes("SelectItem value=\"高\""),
        "Should preserve severity filter"
      )
      assert.ok(
        content.includes("statusFilter") &&
          content.includes("SelectItem value=\"待复核\""),
        "Should preserve status filter"
      )
      assert.ok(
        content.includes("pagination.pageSize") &&
          content.includes("条/页"),
        "Should preserve pagination controls"
      )
      assert.ok(
        content.includes("重置") || content.includes("reset"),
        "Should preserve reset button"
      )
      assert.ok(
        content.includes("列控制") || content.includes("Columns3"),
        "Should preserve column visibility control"
      )
    })
  })

  describe("Downstream entry behavior", () => {
    it("should use buildDashboardAnomalyEntryState for downstream handling", async () => {
      const content = await readFile("components/data-table.tsx", "utf-8")
      assert.ok(
        content.includes("buildDashboardAnomalyEntryState"),
        "Should use buildDashboardAnomalyEntryState function"
      )
    })

    it("should conditionally render downstream links", async () => {
      const content = await readFile("components/data-table.tsx", "utf-8")
      const hasConditionalLink =
        content.includes("kind === \"link\"") ||
        (content.includes("href") && content.includes("entry.href"))
      assert.ok(
        hasConditionalLink,
        "Should conditionally render links based on entry state"
      )
    })
  })

  describe("Code quality and constraints", () => {
    it("should not contain forbidden internal terminology", async () => {
      const content = await readFile("components/data-table.tsx", "utf-8")
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

    it("should not contain auto-capability wording", async () => {
      const content = await readFile("components/data-table.tsx", "utf-8")
      const forbiddenPhrases = [
        "自动排班",
        "自动修复",
        "批量处理",
      ]
      for (const phrase of forbiddenPhrases) {
        assert.ok(
          !content.includes(phrase),
          `Should not contain forbidden phrase: ${phrase}`
        )
      }
    })
  })
})
