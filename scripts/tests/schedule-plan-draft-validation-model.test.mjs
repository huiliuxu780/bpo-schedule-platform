import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { validateSchedulePlanDraft } from "../../lib/schedule-plans.ts"

const projectRoot = join(import.meta.dirname, "../../")

// ── Valid draft tests ──

test("valid draft with no gaps has canSubmit true and zero errors", () => {
  const planFields = {
    plan_date: "2026-06-30",
    project_name: "Test Project",
    site_name: "Test Site",
    version: "v1",
  }

  const rows = [
    {
      interval_start: "09:00",
      interval_end: "09:30",
      forecast_agents: 5,
      scheduled_agents: 5,
      note: "",
    },
  ]

  const result = validateSchedulePlanDraft(planFields, rows)

  assert.equal(result.canSubmit, true)
  assert.equal(result.errorCount, 0)
  assert.equal(result.totalGap, 0)
})

test("valid draft with gap has canSubmit true and warning count", () => {
  const planFields = {
    plan_date: "2026-06-30",
    project_name: "Test Project",
    site_name: "Test Site",
    version: "v1",
  }

  const rows = [
    {
      interval_start: "09:00",
      interval_end: "09:30",
      forecast_agents: 5,
      scheduled_agents: 3,
      note: "",
    },
  ]

  const result = validateSchedulePlanDraft(planFields, rows)

  assert.equal(result.canSubmit, true)
  assert.equal(result.errorCount, 0)
  assert.equal(result.warningCount, 1)
  assert.equal(result.totalGap, 2)
})

// ── Plan field validation tests ──

test("missing plan_date creates hard error", () => {
  const planFields = {
    plan_date: "",
    project_name: "Test Project",
    site_name: "Test Site",
    version: "v1",
  }

  const rows = [
    {
      interval_start: "09:00",
      interval_end: "09:30",
      forecast_agents: 5,
      scheduled_agents: 5,
      note: "",
    },
  ]

  const result = validateSchedulePlanDraft(planFields, rows)

  assert.equal(result.canSubmit, false)
  assert.equal(result.errorCount, 1)
  assert.ok(result.issues.some((i) => i.kind === "missing_plan_date"))
})

test("missing project_name creates hard error", () => {
  const planFields = {
    plan_date: "2026-06-30",
    project_name: "",
    site_name: "Test Site",
    version: "v1",
  }

  const rows = [
    {
      interval_start: "09:00",
      interval_end: "09:30",
      forecast_agents: 5,
      scheduled_agents: 5,
      note: "",
    },
  ]

  const result = validateSchedulePlanDraft(planFields, rows)

  assert.equal(result.canSubmit, false)
  assert.ok(result.issues.some((i) => i.kind === "missing_project_name"))
})

test("missing site_name creates hard error", () => {
  const planFields = {
    plan_date: "2026-06-30",
    project_name: "Test Project",
    site_name: "",
    version: "v1",
  }

  const rows = [
    {
      interval_start: "09:00",
      interval_end: "09:30",
      forecast_agents: 5,
      scheduled_agents: 5,
      note: "",
    },
  ]

  const result = validateSchedulePlanDraft(planFields, rows)

  assert.equal(result.canSubmit, false)
  assert.ok(result.issues.some((i) => i.kind === "missing_site_name"))
})

test("missing version creates hard error", () => {
  const planFields = {
    plan_date: "2026-06-30",
    project_name: "Test Project",
    site_name: "Test Site",
    version: "",
  }

  const rows = [
    {
      interval_start: "09:00",
      interval_end: "09:30",
      forecast_agents: 5,
      scheduled_agents: 5,
      note: "",
    },
  ]

  const result = validateSchedulePlanDraft(planFields, rows)

  assert.equal(result.canSubmit, false)
  assert.ok(result.issues.some((i) => i.kind === "missing_version"))
})

// ── Interval validation tests ──

test("empty interval list creates hard error", () => {
  const planFields = {
    plan_date: "2026-06-30",
    project_name: "Test Project",
    site_name: "Test Site",
    version: "v1",
  }

  const rows = []

  const result = validateSchedulePlanDraft(planFields, rows)

  assert.equal(result.canSubmit, false)
  assert.ok(result.issues.some((i) => i.kind === "no_intervals"))
})

test("missing interval_start creates hard error", () => {
  const planFields = {
    plan_date: "2026-06-30",
    project_name: "Test Project",
    site_name: "Test Site",
    version: "v1",
  }

  const rows = [
    {
      interval_start: "",
      interval_end: "09:30",
      forecast_agents: 5,
      scheduled_agents: 5,
      note: "",
    },
  ]

  const result = validateSchedulePlanDraft(planFields, rows)

  assert.equal(result.canSubmit, false)
  assert.ok(result.issues.some((i) => i.kind === "invalid_start_format"))
})

test("missing interval_end creates hard error", () => {
  const planFields = {
    plan_date: "2026-06-30",
    project_name: "Test Project",
    site_name: "Test Site",
    version: "v1",
  }

  const rows = [
    {
      interval_start: "09:00",
      interval_end: "",
      forecast_agents: 5,
      scheduled_agents: 5,
      note: "",
    },
  ]

  const result = validateSchedulePlanDraft(planFields, rows)

  assert.equal(result.canSubmit, false)
  assert.ok(result.issues.some((i) => i.kind === "invalid_end_format"))
})

test("invalid HH:mm format creates hard error", () => {
  const planFields = {
    plan_date: "2026-06-30",
    project_name: "Test Project",
    site_name: "Test Site",
    version: "v1",
  }

  const rows = [
    {
      interval_start: "9:00",
      interval_end: "09:30",
      forecast_agents: 5,
      scheduled_agents: 5,
      note: "",
    },
  ]

  const result = validateSchedulePlanDraft(planFields, rows)

  assert.equal(result.canSubmit, false)
  assert.ok(result.issues.some((i) => i.kind === "invalid_start_format"))
})

test("out-of-range HH:mm value creates hard error", () => {
  const planFields = {
    plan_date: "2026-06-30",
    project_name: "Test Project",
    site_name: "Test Site",
    version: "v1",
  }

  const rows = [
    {
      interval_start: "09:00",
      interval_end: "24:30",
      forecast_agents: 5,
      scheduled_agents: 5,
      note: "",
    },
  ]

  const result = validateSchedulePlanDraft(planFields, rows)

  assert.equal(result.canSubmit, false)
  assert.ok(result.issues.some((i) => i.kind === "invalid_end_format"))
})

test("end time earlier than start creates hard error", () => {
  const planFields = {
    plan_date: "2026-06-30",
    project_name: "Test Project",
    site_name: "Test Site",
    version: "v1",
  }

  const rows = [
    {
      interval_start: "09:30",
      interval_end: "09:00",
      forecast_agents: 5,
      scheduled_agents: 5,
      note: "",
    },
  ]

  const result = validateSchedulePlanDraft(planFields, rows)

  assert.equal(result.canSubmit, false)
  assert.ok(result.issues.some((i) => i.kind === "invalid_time_range"))
})

test("end time equal to start creates hard error", () => {
  const planFields = {
    plan_date: "2026-06-30",
    project_name: "Test Project",
    site_name: "Test Site",
    version: "v1",
  }

  const rows = [
    {
      interval_start: "09:00",
      interval_end: "09:00",
      forecast_agents: 5,
      scheduled_agents: 5,
      note: "",
    },
  ]

  const result = validateSchedulePlanDraft(planFields, rows)

  assert.equal(result.canSubmit, false)
  assert.ok(result.issues.some((i) => i.kind === "invalid_time_range"))
})

test("overlapping intervals create hard error", () => {
  const planFields = {
    plan_date: "2026-06-30",
    project_name: "Test Project",
    site_name: "Test Site",
    version: "v1",
  }

  const rows = [
    {
      interval_start: "09:00",
      interval_end: "09:30",
      forecast_agents: 5,
      scheduled_agents: 5,
      note: "",
    },
    {
      interval_start: "09:15",
      interval_end: "09:45",
      forecast_agents: 5,
      scheduled_agents: 5,
      note: "",
    },
  ]

  const result = validateSchedulePlanDraft(planFields, rows)

  assert.equal(result.canSubmit, false)
  assert.ok(result.issues.some((i) => i.kind === "interval_overlap"))
})

test("break between adjacent intervals creates warning only", () => {
  const planFields = {
    plan_date: "2026-06-30",
    project_name: "Test Project",
    site_name: "Test Site",
    version: "v1",
  }

  const rows = [
    {
      interval_start: "09:00",
      interval_end: "09:30",
      forecast_agents: 5,
      scheduled_agents: 5,
      note: "",
    },
    {
      interval_start: "10:00",
      interval_end: "10:30",
      forecast_agents: 5,
      scheduled_agents: 5,
      note: "",
    },
  ]

  const result = validateSchedulePlanDraft(planFields, rows)

  assert.equal(result.canSubmit, true)
  assert.equal(result.errorCount, 0)
  assert.ok(result.issues.some((i) => i.kind === "interval_break"))
})

// ── Gap and zero value tests ──

test("gap creates warning and contributes to totalGap", () => {
  const planFields = {
    plan_date: "2026-06-30",
    project_name: "Test Project",
    site_name: "Test Site",
    version: "v1",
  }

  const rows = [
    {
      interval_start: "09:00",
      interval_end: "09:30",
      forecast_agents: 10,
      scheduled_agents: 7,
      note: "",
    },
    {
      interval_start: "09:30",
      interval_end: "10:00",
      forecast_agents: 8,
      scheduled_agents: 5,
      note: "",
    },
  ]

  const result = validateSchedulePlanDraft(planFields, rows)

  assert.equal(result.canSubmit, true)
  assert.equal(result.totalGap, 6) // (10-7) + (8-5) = 3 + 3 = 6
  assert.ok(result.issues.filter((i) => i.kind === "gap_exists").length === 2)
})

test("zero forecast_agents creates warning", () => {
  const planFields = {
    plan_date: "2026-06-30",
    project_name: "Test Project",
    site_name: "Test Site",
    version: "v1",
  }

  const rows = [
    {
      interval_start: "09:00",
      interval_end: "09:30",
      forecast_agents: 0,
      scheduled_agents: 5,
      note: "",
    },
  ]

  const result = validateSchedulePlanDraft(planFields, rows)

  assert.equal(result.zeroForecastRows, 1)
  assert.ok(result.issues.some((i) => i.kind === "zero_forecast"))
})

test("zero scheduled_agents creates warning", () => {
  const planFields = {
    plan_date: "2026-06-30",
    project_name: "Test Project",
    site_name: "Test Site",
    version: "v1",
  }

  const rows = [
    {
      interval_start: "09:00",
      interval_end: "09:30",
      forecast_agents: 5,
      scheduled_agents: 0,
      note: "",
    },
  ]

  const result = validateSchedulePlanDraft(planFields, rows)

  assert.equal(result.zeroScheduledRows, 1)
  assert.ok(result.issues.some((i) => i.kind === "zero_scheduled"))
})

// ── Input mutation test ──

test("inputs are not mutated", () => {
  const planFields = {
    plan_date: "2026-06-30",
    project_name: "Test Project",
    site_name: "Test Site",
    version: "v1",
  }

  const rows = [
    {
      interval_start: "09:00",
      interval_end: "09:30",
      forecast_agents: 5,
      scheduled_agents: 3,
      note: "",
    },
  ]

  const originalRows = JSON.parse(JSON.stringify(rows))

  validateSchedulePlanDraft(planFields, rows)

  assert.deepEqual(rows, originalRows)
})

// ── Validation panel UI tests ──

test("validation panel renders required labels", () => {
  const panelPath = join(
    projectRoot,
    "components/schedule-plan-draft-validation-panel.tsx"
  )
  const content = readFileSync(panelPath, "utf-8")

  assert.ok(content.includes("可保存"))
  assert.ok(content.includes("需要修正"))
  assert.ok(content.includes("错误"))
  assert.ok(content.includes("提醒"))
  assert.ok(content.includes("缺口"))
})

test("validation panel has no forbidden internal terms", () => {
  const forbiddenTerms = [
    "Gate",
    "PM",
    "Harness",
    "Codex",
    "Qoder",
    "backend API",
    "data source",
  ]

  const panelPath = join(
    projectRoot,
    "components/schedule-plan-draft-validation-panel.tsx"
  )
  const content = readFileSync(panelPath, "utf-8")

  for (const term of forbiddenTerms) {
    assert.ok(!content.includes(term), `Found forbidden term: ${term}`)
  }
})

test("validation panel has no forbidden capability claims", () => {
  const forbiddenClaims = [
    "自动排班",
    "自动修复",
    "自动补齐",
    "审批",
    "导出",
    "批量",
    "结算",
    "收费",
  ]

  const panelPath = join(
    projectRoot,
    "components/schedule-plan-draft-validation-panel.tsx"
  )
  const content = readFileSync(panelPath, "utf-8")

  for (const claim of forbiddenClaims) {
    assert.ok(!content.includes(claim), `Found forbidden claim: ${claim}`)
  }
})
