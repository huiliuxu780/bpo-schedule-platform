import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import test from "node:test"

const projectRoot = join(import.meta.dirname, "../../")

function readProjectFile(path) {
  return readFileSync(join(projectRoot, path), "utf-8")
}

test("published roster page exists as a downstream formal roster entry", () => {
  const pagePath = join(projectRoot, "app/published-roster/page.tsx")

  assert.ok(existsSync(pagePath), "app/published-roster/page.tsx must exist")

  const content = readFileSync(pagePath, "utf-8")
  assert.ok(content.includes("PublishedRosterViewer"))
  assert.ok(content.includes("generateRosterDraftViewModel"))
  assert.ok(content.includes("正式班表"))
  assert.ok(content.includes("h-[calc(100svh-var(--header-height))]"))
  assert.ok(!content.includes("月班表草稿"))
})

test("published roster viewer reads only the formal roster and supports downstream roles", () => {
  const content = readProjectFile("components/published-roster-viewer.tsx")

  assert.ok(content.includes('"use client"'))
  assert.ok(content.includes("buildDownstreamPublishedRosterView"))
  assert.ok(content.includes("/api/v1/roster-drafts/current-published"))
  assert.ok(content.includes("小组长"))
  assert.ok(content.includes("一线"))
  assert.ok(content.includes("本地角色"))
  assert.ok(content.includes("人员"))
  assert.ok(content.includes("月历概览"))
  assert.ok(content.includes("周明细"))
  assert.ok(content.includes("只读详情"))
  assert.ok(content.includes("暂无正式班表"))
  assert.ok(content.includes("先由排班师发布"))
  assert.ok(!content.includes("/api/v1/roster-drafts/active-draft"))
  assert.ok(!content.includes("revision_draft"))
  assert.ok(!content.includes("upcoming"))
})

test("published roster month mode renders a calendar overview instead of a 31-day person grid", () => {
  const content = readProjectFile("components/published-roster-viewer.tsx")

  assert.ok(content.includes('data-slot="published-roster-month-calendar"'))
  assert.ok(content.includes("MonthCalendarOverview"))
  assert.ok(content.includes("monthCalendarDays"))
  assert.ok(!content.includes('mode === "month" ? activeRoleView.monthRows'))
  assert.ok(!content.includes('mode === "month" ? downstreamView.monthDays'))
})

test("published roster viewer creates local request intents without approval", () => {
  const content = [
    readProjectFile("components/published-roster-viewer.tsx"),
    readProjectFile("lib/published-roster-view.ts"),
  ].join("\n")

  assert.ok(content.includes("请假"))
  assert.ok(content.includes("换班"))
  assert.ok(content.includes("异常修复"))
  assert.ok(content.includes("RequestIntentPanel"))
  assert.ok(content.includes('data-slot="published-roster-request-intent"'))
  assert.ok(content.includes("/api/v1/roster-requests"))
  assert.ok(content.includes("登记处理意图"))
  assert.ok(content.includes("本地队列"))
  assert.ok(content.includes("intent_ready"))
  assert.ok(!content.includes("disabled={action.disabled}"))
  assert.ok(!content.includes("申请能力待开通"))
  assert.ok(!content.includes("提交申请"))
  assert.ok(!content.includes("提交审批"))
})

test("published roster viewer shows downstream issue status without polluting the roster grid", () => {
  const content = readProjectFile("components/published-roster-viewer.tsx")

  assert.ok(content.includes("type PublishedRosterIssueIntent"))
  assert.ok(content.includes("type PublishedRosterIssueSummary"))
  assert.ok(content.includes("IssueStatusDrawer"))
  assert.ok(content.includes('data-slot="published-roster-issue-status-drawer"'))
  assert.ok(content.includes('data-slot="published-roster-cell-open-issue-hint"'))
  assert.ok(content.includes("/api/v1/roster-requests/summary"))
  assert.ok(content.includes("fetchRosterIssueSummary"))
  assert.ok(content.includes("fetchRosterIssueIntents"))
  assert.ok(content.includes("我的问题状态"))
  assert.ok(content.includes("团队问题状态"))
  assert.ok(content.includes("已有待处理问题"))
  assert.ok(content.includes("继续登记"))
  assert.ok(content.includes("scheduler_resolution_note"))
  assert.ok(content.includes("linked_revision_version_id"))
  assert.ok(content.includes("/roster-change-governance"))
  assert.ok(content.includes("查看处理结果"))
  assert.ok(!content.includes("审批状态"))
})

test("published roster navigation is a distinct planning sidebar item", () => {
  const content = readProjectFile("components/app-sidebar.tsx")

  assert.ok(content.includes("/published-roster"))
  assert.ok(content.includes("正式班表"))
  assert.ok(content.includes("CalendarCheck"))
  assert.ok(content.includes("/roster-drafts"))
  assert.ok(content.includes("月班表草稿"))
})

test("published roster viewer does not expose internal English status wording", () => {
  const files = [
    "app/published-roster/page.tsx",
    "components/published-roster-viewer.tsx",
  ]

  for (const file of files) {
    const content = readProjectFile(file)
    assert.ok(!content.includes("current published"), `${file} must not expose current published`)
    assert.ok(!content.includes("Published Roster"), `${file} must not expose Published Roster`)
    assert.ok(!content.includes("revision draft"), `${file} must not expose revision draft`)
  }
})
