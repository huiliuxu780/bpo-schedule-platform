import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import test from "node:test"

const projectRoot = join(import.meta.dirname, "../../")

function readProjectFile(path) {
  return readFileSync(join(projectRoot, path), "utf-8")
}

test("roster change governance page is an independent formal roster workbench", () => {
  const pagePath = join(projectRoot, "app/roster-change-governance/page.tsx")

  assert.ok(existsSync(pagePath), "app/roster-change-governance/page.tsx must exist")

  const content = readFileSync(pagePath, "utf-8")
  assert.ok(content.includes("RosterChangeGovernanceWorkbench"))
  assert.ok(content.includes("generateRosterDraftViewModel"))
  assert.ok(content.includes("正式班表变更治理"))
  assert.ok(content.includes("initialRevisionId"))
  assert.ok(content.includes("initialCellId"))
  assert.ok(content.includes("initialIssueId"))
  assert.ok(content.includes("h-[calc(100svh-var(--header-height))]"))
})

test("roster change governance workbench uses aggregate API and mature workbench slots", () => {
  const content = readProjectFile("components/roster-change-governance-workbench.tsx")

  assert.ok(content.includes('"use client"'))
  assert.ok(content.includes("/api/v1/roster-change-governance"))
  assert.ok(content.includes('data-slot="roster-change-governance-shell"'))
  assert.ok(content.includes('data-slot="roster-change-timeline"'))
  assert.ok(content.includes('data-slot="roster-change-diff-list"'))
  assert.ok(content.includes('data-slot="roster-change-linked-issues"'))
  assert.ok(content.includes("人员-日期"))
  assert.ok(content.includes("修订前"))
  assert.ok(content.includes("修订后"))
  assert.ok(content.includes("关联问题"))
  assert.ok(content.includes("处理说明"))
  assert.ok(content.includes("source_cell_id"))
  assert.ok(!content.includes("审批状态"))
  assert.ok(!content.includes("批量导出"))
})

test("roster change governance navigation is a distinct planning sidebar item", () => {
  const content = readProjectFile("components/app-sidebar.tsx")

  assert.ok(content.includes("/roster-change-governance"))
  assert.ok(content.includes("正式班表变更治理"))
  assert.ok(content.includes("History"))
  assert.ok(content.includes("/published-roster"))
  assert.ok(content.includes("/roster-drafts"))
})
