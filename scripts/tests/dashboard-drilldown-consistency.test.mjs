import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"
import { pathToFileURL } from "node:url"

const dashboardModule = await import(
  pathToFileURL("lib/dashboard.ts").href
)

const {
  buildDashboardDrilldownLinks,
  buildDashboardOperationalViewModel,
} = dashboardModule

function parseHref(href) {
  return new URL(href, "http://dashboard.local")
}

function samplePlan(overrides = {}) {
  return {
    id: "plan-001",
    plan_date: "2026-05-11",
    project_name: "博西客服",
    site_name: "上海职场",
    version: "v1",
    status: "published",
    forecast_agents: 10,
    scheduled_agents: 9,
    gap_agents: 1,
    ...overrides,
  }
}

function sampleRisk(overrides = {}) {
  return {
    risk_id: "risk-001",
    plan_id: "plan-001",
    plan_date: "2026-05-11",
    project_name: "博西客服",
    site_name: "上海职场",
    interval_start: "09:00",
    interval_end: "10:00",
    risk_level: "high",
    risk_status: "open",
    gap_agents: 2,
    affected_unavailability: 1,
    reason: "排班缺口",
    recommendation: "补充人员",
    ...overrides,
  }
}

function sampleUnavailability(overrides = {}) {
  return {
    unavailability_id: "unavail-001",
    unavailable_date: "2026-05-11",
    project_name: "博西客服",
    site_name: "上海职场",
    team_name: "上海职场",
    start_time: "09:00",
    end_time: "10:00",
    affected_intervals: 1,
    status: "active",
    reason: "培训",
    ...overrides,
  }
}

test("dashboard drilldown links point to existing operational workbenches", () => {
  const links = buildDashboardDrilldownLinks({})

  assert.equal(links.schedulePlans, "/schedule-plans")
  assert.equal(links.shiftDetails, "/shift-details")
  assert.equal(links.scheduleRisks, "/schedule-risks?status=open")
  assert.equal(links.unavailability, "/unavailability?status=active")
})

test("dashboard drilldown links preserve compatible project site and status context", () => {
  const links = buildDashboardDrilldownLinks({
    project: "博西客服",
    site: "上海职场",
    planStatus: "published",
  })

  const schedulePlans = parseHref(links.schedulePlans)
  assert.equal(schedulePlans.pathname, "/schedule-plans")
  assert.equal(schedulePlans.searchParams.get("query"), "博西客服 上海职场")
  assert.equal(schedulePlans.searchParams.get("status"), "published")

  const shiftDetails = parseHref(links.shiftDetails)
  assert.equal(shiftDetails.pathname, "/shift-details")
  assert.equal(shiftDetails.searchParams.get("query"), "博西客服 上海职场")
  assert.equal(shiftDetails.searchParams.get("status"), "published")

  const scheduleRisks = parseHref(links.scheduleRisks)
  assert.equal(scheduleRisks.pathname, "/schedule-risks")
  assert.equal(scheduleRisks.searchParams.get("query"), "博西客服 上海职场")
  assert.equal(scheduleRisks.searchParams.get("status"), "open")

  const unavailability = parseHref(links.unavailability)
  assert.equal(unavailability.pathname, "/unavailability")
  assert.equal(unavailability.searchParams.get("query"), "博西客服 上海职场")
  assert.equal(unavailability.searchParams.get("status"), "active")
})

test("operational dashboard model attaches drilldowns to every metric card", () => {
  const viewModel = buildDashboardOperationalViewModel({
    plans: [samplePlan()],
    risks: [sampleRisk()],
    unavailability: [sampleUnavailability()],
    plansSource: { source: "api", failed: false },
    risksSource: { source: "api", failed: false },
    unavailabilitySource: { source: "api", failed: false },
  })

  const drilldownByTitle = Object.fromEntries(
    viewModel.metricCards.map((card) => [card.title, card.drilldown])
  )

  assert.deepEqual(drilldownByTitle["排班计划总数"], {
    label: "查看计划",
    href: "/schedule-plans",
  })
  assert.deepEqual(drilldownByTitle["平均覆盖率"], {
    label: "查看班次",
    href: "/shift-details",
  })
  assert.deepEqual(drilldownByTitle["待处理风险"], {
    label: "查看风险",
    href: "/schedule-risks?status=open",
  })
  assert.deepEqual(drilldownByTitle["生效不可用"], {
    label: "查看不可用",
    href: "/unavailability?status=active",
  })
})

test("operational dashboard model exposes one heatmap drilldown", () => {
  const viewModel = buildDashboardOperationalViewModel({
    plans: [samplePlan()],
    risks: [sampleRisk()],
    unavailability: [sampleUnavailability()],
    plansSource: { source: "api", failed: false },
    risksSource: { source: "api", failed: false },
    unavailabilitySource: { source: "api", failed: false },
    filters: { project: "博西客服", site: "上海职场", planStatus: "published" },
  })

  const href = parseHref(viewModel.heatmapDrilldown.href)
  assert.equal(viewModel.heatmapDrilldown.label, "查看班次明细")
  assert.equal(href.pathname, "/shift-details")
  assert.equal(href.searchParams.get("query"), "博西客服 上海职场")
  assert.equal(href.searchParams.get("status"), "published")
})

test("dashboard page keeps heatmap drilldown out of the dashboard-01 first screen", () => {
  const source = readFileSync("app/dashboard/page.tsx", "utf8")

  assert.doesNotMatch(source, /BpoHeatmap/)
  assert.doesNotMatch(source, /drilldown=\{viewModel\.heatmapDrilldown\}/)
})

test("dashboard drilldown UI does not add extra top-level filter controls", () => {
  const source = readFileSync("app/dashboard/page.tsx", "utf8")

  assert.doesNotMatch(source, /riskLevel=/)
  assert.doesNotMatch(source, /issueStatus=/)
})

test("dashboard drilldown UI files do not expose forbidden product terms", () => {
  const sources = [
    "app/dashboard/page.tsx",
    "components/section-cards.tsx",
    "components/bpo-heatmap.tsx",
    "lib/dashboard.ts",
  ]
    .map((file) => readFileSync(file, "utf8"))
    .join("\n")

  assert.doesNotMatch(sources, /Gate|Harness|Codex|Qoder/)
  assert.doesNotMatch(sources, /自动排班|自动修复|审批|导出|批量|结算|收费/)
})
