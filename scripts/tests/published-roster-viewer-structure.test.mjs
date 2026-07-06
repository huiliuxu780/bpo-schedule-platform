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
  assert.ok(content.includes("月视图"))
  assert.ok(content.includes("周视图"))
  assert.ok(content.includes("只读详情"))
  assert.ok(content.includes("暂无正式班表"))
  assert.ok(content.includes("先由排班师发布"))
  assert.ok(!content.includes("/api/v1/roster-drafts/active-draft"))
  assert.ok(!content.includes("revision_draft"))
  assert.ok(!content.includes("upcoming"))
})

test("published roster viewer keeps request actions visible but disabled", () => {
  const content = [
    readProjectFile("components/published-roster-viewer.tsx"),
    readProjectFile("lib/published-roster-view.ts"),
  ].join("\n")

  assert.ok(content.includes("请假"))
  assert.ok(content.includes("换班"))
  assert.ok(content.includes("异常修复"))
  assert.ok(content.includes("申请能力待开通"))
  assert.ok(content.includes("disabled"))
  assert.ok(!content.includes("提交申请"))
  assert.ok(!content.includes("提交审批"))
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
