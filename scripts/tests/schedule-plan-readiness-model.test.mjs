import { describe, it } from "node:test"
import { strict as assert } from "node:assert"
import { readFile } from "node:fs/promises"

import {
  getSchedulePlanResult,
  getSchedulePlansResult,
} from "../../lib/schedule-plans.ts"

const fallbackPlanId = "plan-20260511-suzhou-bosch-v1"

async function withMockedFetch(mockFetch, callback) {
  const originalFetch = globalThis.fetch
  globalThis.fetch = mockFetch

  try {
    return await callback()
  } finally {
    globalThis.fetch = originalFetch
  }
}

function jsonResponse({ ok = true, status = ok ? 200 : 500, body }) {
  return {
    ok,
    status,
    json: async () => body,
  }
}

describe("IM253 Packet A - Schedule Plan List Readiness", () => {
  describe("app/schedule-plans/page.tsx", () => {
    it("should use getSchedulePlansResult instead of getSchedulePlansWithFilters", async () => {
      const content = await readFile("app/schedule-plans/page.tsx", "utf-8")
      assert.ok(
        content.includes("getSchedulePlansResult"),
        "page.tsx should import and use getSchedulePlansResult"
      )
      assert.ok(
        !content.includes("getSchedulePlansWithFilters"),
        "page.tsx should not use deprecated getSchedulePlansWithFilters"
      )
    })

    it("should render ReadinessBanner with result data", async () => {
      const content = await readFile("app/schedule-plans/page.tsx", "utf-8")
      assert.ok(
        content.includes("ReadinessBanner"),
        "page.tsx should import and render ReadinessBanner"
      )
      assert.ok(
        content.includes("result.message"),
        "ReadinessBanner should receive result.message"
      )
      assert.ok(
        content.includes("result.source"),
        "ReadinessBanner should receive result.source"
      )
      assert.ok(
        content.includes("hasData"),
        "ReadinessBanner should receive hasData prop"
      )
    })

    it("should pass sourceTotal to SchedulePlanTable", async () => {
      const content = await readFile("app/schedule-plans/page.tsx", "utf-8")
      assert.ok(
        content.includes("sourceTotal="),
        "SchedulePlanTable should receive sourceTotal prop"
      )
    })

    it("should not contain forbidden internal terminology", async () => {
      const content = await readFile("app/schedule-plans/page.tsx", "utf-8")
      const forbiddenTerms = [
        "Gate Plan",
        "PM",
        "Harness",
        "Codex",
        "Packet A",
        "Packet B",
        "IM253",
      ]
      for (const term of forbiddenTerms) {
        assert.ok(
          !content.includes(term),
          `page.tsx should not contain forbidden term: ${term}`
        )
      }
    })

    it("should not contain auto-fix or auto-scheduling terminology", async () => {
      const content = await readFile("app/schedule-plans/page.tsx", "utf-8")
      const forbiddenTerms = ["自动修复", "自动排班", "自动调度", "自动调整"]
      for (const term of forbiddenTerms) {
        assert.ok(
          !content.includes(term),
          `page.tsx should not contain forbidden term: ${term}`
        )
      }
    })
  })

  describe("components/schedule-plan-table.tsx", () => {
    it("should accept sourceTotal prop", async () => {
      const content = await readFile(
        "components/schedule-plan-table.tsx",
        "utf-8"
      )
      assert.ok(
        content.includes("sourceTotal"),
        "SchedulePlanTable should accept sourceTotal prop"
      )
    })

    it("should distinguish between source empty and filtered empty", async () => {
      const content = await readFile(
        "components/schedule-plan-table.tsx",
        "utf-8"
      )
      assert.ok(
        content.includes("暂无排班计划数据"),
        "Should show '暂无排班计划数据' when source is empty"
      )
      assert.ok(
        content.includes("暂无符合条件的排班计划"),
        "Should show '暂无符合条件的排班计划' when filtered empty"
      )
    })

    it("should use sourceTotal to determine empty state", async () => {
      const content = await readFile(
        "components/schedule-plan-table.tsx",
        "utf-8"
      )
      assert.ok(
        content.includes("sourceIsEmpty") ||
          content.includes("sourceTotal === 0"),
        "Should check sourceTotal to determine if source is empty"
      )
    })

    it("should not contain forbidden internal terminology", async () => {
      const content = await readFile(
        "components/schedule-plan-table.tsx",
        "utf-8"
      )
      const forbiddenTerms = [
        "Gate Plan",
        "PM",
        "Harness",
        "Codex",
        "Packet A",
        "Packet B",
        "IM253",
      ]
      for (const term of forbiddenTerms) {
        assert.ok(
          !content.includes(term),
          `schedule-plan-table.tsx should not contain forbidden term: ${term}`
        )
      }
    })

    it("should not contain auto-fix or auto-scheduling terminology", async () => {
      const content = await readFile(
        "components/schedule-plan-table.tsx",
        "utf-8"
      )
      const forbiddenTerms = ["自动修复", "自动排班", "自动调度", "自动调整"]
      for (const term of forbiddenTerms) {
        assert.ok(
          !content.includes(term),
          `schedule-plan-table.tsx should not contain forbidden term: ${term}`
        )
      }
    })
  })

  describe("lib/schedule-plans.ts", () => {
    it("should export getSchedulePlansResult", async () => {
      const content = await readFile("lib/schedule-plans.ts", "utf-8")
      assert.ok(
        content.includes("export") &&
          content.includes("getSchedulePlansResult"),
        "lib/schedule-plans.ts should export getSchedulePlansResult"
      )
    })

    it("should return DataSourceResult with source and failed fields", async () => {
      const content = await readFile("lib/schedule-plans.ts", "utf-8")
      assert.ok(
        content.includes("DataSourceResult"),
        "Should use DataSourceResult type"
      )
      assert.ok(
        content.includes("source:") && content.includes("failed:"),
        "Result should include source and failed fields"
      )
    })

    it("reports api source and operator-facing local data message when API returns rows", async () => {
      await withMockedFetch(
        async () =>
          jsonResponse({
            body: {
              items: [
                {
                  id: "plan-api-1",
                  plan_date: "2026-05-11",
                  project_name: "博西客服",
                  site_name: "上海职场",
                  version: "v1",
                  status: "draft",
                  forecast_agents: 10,
                  scheduled_agents: 9,
                  gap_agents: 1,
                  coverage_rate: 0.9,
                  updated_at: "2026-05-11T09:00:00+08:00",
                },
              ],
            },
          }),
        async () => {
          const result = await getSchedulePlansResult()

          assert.equal(result.source, "api")
          assert.equal(result.failed, false)
          assert.equal(result.items[0].id, "plan-api-1")
          assert.equal(result.message, "数据来自当前本地排班计划。")
        }
      )
    })

    it("distinguishes unfiltered empty data from filtered empty result", async () => {
      await withMockedFetch(
        async () => jsonResponse({ body: { items: [] } }),
        async () => {
          const emptyResult = await getSchedulePlansResult()
          const filteredEmptyResult = await getSchedulePlansResult({
            query: "不存在的计划",
          })

          assert.equal(emptyResult.source, "api_empty")
          assert.equal(emptyResult.message, "当前暂无本地排班计划数据。")
          assert.equal(filteredEmptyResult.source, "api_empty")
          assert.equal(
            filteredEmptyResult.message,
            "当前筛选没有匹配的排班计划。"
          )
        }
      )
    })

    it("uses fallback rows with an explicit local example message when data cannot update", async () => {
      await withMockedFetch(
        async () => {
          throw new Error("backend unavailable")
        },
        async () => {
          const result = await getSchedulePlansResult()

          assert.equal(result.source, "fallback")
          assert.equal(result.failed, true)
          assert.ok(result.items.length > 0)
          assert.match(result.message, /本地示例数据/)
          assert.doesNotMatch(result.message, /生产实时|real-time/i)
          assert.doesNotMatch(result.message, /API|后端|验收/)
        }
      )
    })
  })
})

describe("IM253 Packet B - Schedule Plan Detail Readiness", () => {
  describe("app/schedule-plans/[planId]/page.tsx", () => {
    it("should use getSchedulePlanResult", async () => {
      const content = await readFile(
        "app/schedule-plans/[planId]/page.tsx",
        "utf-8"
      )
      assert.ok(
        content.includes("getSchedulePlanResult"),
        "Detail page should use getSchedulePlanResult"
      )
    })

    it("should render ReadinessBanner", async () => {
      const content = await readFile(
        "app/schedule-plans/[planId]/page.tsx",
        "utf-8"
      )
      assert.ok(
        content.includes("ReadinessBanner"),
        "Detail page should render ReadinessBanner"
      )
      assert.ok(
        content.includes("result.message"),
        "Detail page should pass the result message to ReadinessBanner"
      )
    })

    it("should include downstream entry links", async () => {
      const content = await readFile(
        "app/schedule-plans/[planId]/page.tsx",
        "utf-8"
      )
      assert.ok(
        content.includes("/schedule-risks?query="),
        "Detail page should include link to related schedule risks"
      )
      assert.ok(
        content.includes("/unavailability?query="),
        "Detail page should include link to related unavailability"
      )
    })

    it("should not contain forbidden internal terminology", async () => {
      const content = await readFile(
        "app/schedule-plans/[planId]/page.tsx",
        "utf-8"
      )
      const forbiddenTerms = [
        "Gate Plan",
        "PM",
        "Harness",
        "Codex",
        "Packet A",
        "Packet B",
        "IM253",
      ]
      for (const term of forbiddenTerms) {
        assert.ok(
          !content.includes(term),
          `Detail page should not contain forbidden term: ${term}`
        )
      }
    })

    it("should not contain auto-fix or auto-scheduling terminology", async () => {
      const content = await readFile(
        "app/schedule-plans/[planId]/page.tsx",
        "utf-8"
      )
      const forbiddenTerms = ["自动修复", "自动排班", "自动调度", "自动调整"]
      for (const term of forbiddenTerms) {
        assert.ok(
          !content.includes(term),
          `Detail page should not contain forbidden term: ${term}`
        )
      }
    })
  })

  describe("lib/schedule-plans.ts (detail)", () => {
    it("should export getSchedulePlanResult", async () => {
      const content = await readFile("lib/schedule-plans.ts", "utf-8")
      assert.ok(
        content.includes("export") &&
          content.includes("getSchedulePlanResult"),
        "lib/schedule-plans.ts should export getSchedulePlanResult"
      )
    })

    it("should return DetailDataSourceResult with source and failed fields", async () => {
      const content = await readFile("lib/schedule-plans.ts", "utf-8")
      assert.ok(
        content.includes("DetailDataSourceResult"),
        "Should use DetailDataSourceResult type"
      )
      assert.ok(
        content.includes("source:") && content.includes("failed:"),
        "Detail result should include source and failed fields"
      )
    })

    it("returns API detail when the backend returns the requested plan", async () => {
      await withMockedFetch(
        async () =>
          jsonResponse({
            body: {
              summary: {
                id: "plan-api-detail",
                plan_date: "2026-05-11",
                project_name: "博西客服",
                site_name: "上海职场",
                version: "v1",
                status: "published",
                forecast_agents: 10,
                scheduled_agents: 10,
                gap_agents: 0,
                coverage_rate: 1,
                updated_at: "2026-05-11T09:00:00+08:00",
              },
              intervals: [],
            },
          }),
        async () => {
          const result = await getSchedulePlanResult("plan-api-detail")

          assert.equal(result.source, "api")
          assert.equal(result.failed, false)
          assert.equal(result.item?.summary.id, "plan-api-detail")
          assert.equal(result.message, "详情数据来自当前本地排班计划。")
        }
      )
    })

    it("does not fall back when API returns 404 for an id that exists in fallback data", async () => {
      await withMockedFetch(
        async () => jsonResponse({ ok: false, status: 404, body: {} }),
        async () => {
          const result = await getSchedulePlanResult(fallbackPlanId)

          assert.equal(result.source, "missing")
          assert.equal(result.failed, false)
          assert.equal(result.item, null)
          assert.equal(result.message, "未找到该排班计划")
        }
      )
    })

    it("uses fallback detail only when the data request fails before a not-found response", async () => {
      await withMockedFetch(
        async () => {
          throw new Error("network unavailable")
        },
        async () => {
          const result = await getSchedulePlanResult(fallbackPlanId)

          assert.equal(result.source, "fallback")
          assert.equal(result.failed, true)
          assert.equal(result.item?.summary.id, fallbackPlanId)
          assert.match(result.message, /本地示例数据/)
          assert.doesNotMatch(result.message, /API|后端|验收/)
        }
      )
    })

    it("returns missing failure when API fails and no fallback detail exists", async () => {
      await withMockedFetch(
        async () => jsonResponse({ ok: false, status: 500, body: {} }),
        async () => {
          const result = await getSchedulePlanResult("not-in-fallback")

          assert.equal(result.source, "missing")
          assert.equal(result.failed, true)
          assert.equal(result.item, null)
          assert.equal(
            result.message,
            "排班计划暂时无法读取，且本地示例数据中没有该计划。"
          )
        }
      )
    })
  })
})
