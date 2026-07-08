import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import test from "node:test"

const projectRoot = join(import.meta.dirname, "../../")

function readProjectFile(path) {
  return readFileSync(join(projectRoot, path), "utf-8")
}

test("duty request center route presents downstream request result tracking", () => {
  const pagePath = join(projectRoot, "app/duty-requests/page.tsx")

  assert.ok(existsSync(pagePath), "app/duty-requests/page.tsx must exist")

  const content = readFileSync(pagePath, "utf-8")
  assert.ok(content.includes("DutyRequestCenterWorkbench"))
  assert.ok(content.includes("generateRosterDraftViewModel"))
  assert.ok(content.includes("班务申请中心"))
  assert.ok(content.includes("h-[calc(100svh-var(--header-height))]"))
})

test("duty request center uses list-detail result tracking without workflow actions", () => {
  const content = readProjectFile("components/duty-request-center-workbench.tsx")

  assert.ok(content.includes('"use client"'))
  assert.ok(content.includes('data-slot="duty-request-center-shell"'))
  assert.ok(content.includes('data-slot="duty-request-center-toolbar"'))
  assert.ok(content.includes('data-slot="duty-request-center-layout"'))
  assert.ok(content.includes('data-slot="duty-request-center-list"'))
  assert.ok(content.includes('data-slot="duty-request-center-detail"'))
  assert.ok(content.includes('data-slot="duty-request-result-card"'))
  assert.ok(content.includes("我的申请"))
  assert.ok(content.includes("团队申请"))
  assert.ok(content.includes("待处理"))
  assert.ok(content.includes("跟进中"))
  assert.ok(content.includes("已调整"))
  assert.ok(content.includes("已拒绝"))
  assert.ok(content.includes("已关闭"))
  assert.ok(content.includes("原班表"))
  assert.ok(content.includes("申请内容"))
  assert.ok(content.includes("处理说明"))
  assert.ok(content.includes("最终班表结果"))
  assert.ok(content.includes("查看月班表"))
  assert.ok(content.includes("/api/v1/roster-requests"))
  assert.ok(content.includes("/published-roster"))
  assert.ok(!content.includes("新建申请"))
  assert.ok(!content.includes("催办"))
  assert.ok(!content.includes("撤回"))
  assert.ok(!content.includes("审批"))
  assert.ok(!content.includes("revision"))
  assert.ok(!content.includes("发布修订"))
  assert.ok(!content.includes("diff"))
})

test("duty request routes are owned by the slim task sidebar entry", () => {
  const content = readProjectFile("components/app-sidebar.tsx")

  assert.ok(content.includes('title: "待办"'))
  assert.ok(content.includes("/duty-requests"))
  assert.ok(content.includes("/roster-change-governance"))
  assert.ok(content.includes("Inbox"))
  assert.ok(!content.includes('title: "班务申请中心"'))
  assert.ok(!content.includes('title: "班务变更申请"'))
})
