import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import test from "node:test"

const projectRoot = join(import.meta.dirname, "../../")

function readProjectFile(path) {
  return readFileSync(join(projectRoot, path), "utf-8")
}

test("roster change governance route now presents the duty change request page", () => {
  const pagePath = join(projectRoot, "app/roster-change-governance/page.tsx")

  assert.ok(existsSync(pagePath), "app/roster-change-governance/page.tsx must exist")

  const content = readFileSync(pagePath, "utf-8")
  assert.ok(content.includes("RosterChangeGovernanceWorkbench"))
  assert.ok(content.includes("generateRosterDraftViewModel"))
  assert.ok(content.includes("班务变更申请"))
  assert.ok(content.includes("initialCellId"))
  assert.ok(content.includes("initialIssueId"))
  assert.ok(content.includes("h-[calc(100svh-var(--header-height))]"))
  assert.ok(!content.includes("正式班表变更治理"))
  assert.ok(!content.includes("班表变更中心"))
})

test("duty change request workbench uses request-first states and actions", () => {
  const content = readProjectFile("components/roster-change-governance-workbench.tsx")

  assert.ok(content.includes('"use client"'))
  assert.ok(content.includes('data-slot="duty-change-request-shell"'))
  assert.ok(content.includes('data-slot="duty-change-request-tabs"'))
  assert.ok(content.includes('data-slot="duty-change-request-list"'))
  assert.ok(content.includes('data-slot="duty-change-request-detail-drawer"'))
  assert.ok(content.includes("班务变更申请"))
  assert.ok(content.includes("待处理"))
  assert.ok(content.includes("跟进中"))
  assert.ok(content.includes("已处理"))
  assert.ok(content.includes("按员工"))
  assert.ok(content.includes("同意"))
  assert.ok(content.includes("拒绝"))
  assert.ok(content.includes("现场跟进"))
  assert.ok(content.includes("去调整班表"))
  assert.ok(content.includes("保存调整"))
  assert.ok(content.includes("返回申请"))
  assert.ok(content.includes("处理下一条"))
  assert.ok(!content.includes("确认变更"))
  assert.ok(!content.includes("全部变更"))
  assert.ok(!content.includes("修订前"))
  assert.ok(!content.includes("修订后"))
  assert.ok(!content.includes("/api/v1/roster-change-governance/events/"))
  assert.ok(!content.includes("版本时间线"))
  assert.ok(!content.includes("人员-日期差异"))
  assert.ok(!content.includes("source_cell_id"))
  assert.ok(!content.includes("diff"))
  assert.ok(!content.includes("审批状态"))
  assert.ok(!content.includes("批量导出"))
})

test("duty change request navigation is a distinct planning sidebar item", () => {
  const content = readProjectFile("components/app-sidebar.tsx")

  assert.ok(content.includes("/roster-change-governance"))
  assert.ok(content.includes("班务变更申请"))
  assert.ok(content.includes("/published-roster"))
  assert.ok(content.includes("/roster-drafts"))
  assert.ok(!content.includes("正式班表变更治理"))
  assert.ok(!content.includes("班表变更中心"))
})
