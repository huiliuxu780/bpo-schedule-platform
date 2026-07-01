import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import test from "node:test"

const projectRoot = join(import.meta.dirname, "../../")

function readProjectFile(path) {
  return readFileSync(join(projectRoot, path), "utf-8")
}

test("roster drafts page exists and uses the roster draft generator", () => {
  const pagePath = join(projectRoot, "app/roster-drafts/page.tsx")

  assert.ok(existsSync(pagePath), "app/roster-drafts/page.tsx must exist")

  const content = readFileSync(pagePath, "utf-8")
  assert.ok(content.includes("generateRosterDraftViewModel"))
  assert.ok(content.includes("getRosterDraftTargetMonths"))
  assert.ok(content.includes("<RosterDraftWorkbench"))
  assert.ok(content.includes("月班表草稿"))
})

test("roster draft workbench renders month and week views with status markers", () => {
  const content = readProjectFile("components/roster-draft-workbench.tsx")

  assert.ok(content.includes('"use client"'))
  assert.ok(content.includes("Tabs"))
  assert.ok(content.includes("月视图"))
  assert.ok(content.includes("周视图"))
  assert.ok(content.includes("复制生成"))
  assert.ok(content.includes("待确认"))
  assert.ok(content.includes("异常"))
  assert.ok(content.includes("非班务标注已过滤"))
  assert.ok(content.includes("sticky left-0"))
})

test("roster draft workbench includes read-only pending exception and annotation sections", () => {
  const content = readProjectFile("components/roster-draft-workbench.tsx")

  assert.ok(content.includes("待排人员"))
  assert.ok(content.includes("异常清单"))
  assert.ok(content.includes("已过滤标注"))
  assert.ok(content.includes("只读"))
  assert.ok(!content.includes("标记已确认"))
  assert.ok(!content.includes("忽略异常"))
})

test("roster draft navigation is available in the planning sidebar group", () => {
  const content = readProjectFile("components/app-sidebar.tsx")

  assert.ok(content.includes("/roster-drafts"))
  assert.ok(content.includes("月班表草稿"))
})

test("roster draft UI does not expose forbidden production capability claims", () => {
  const forbiddenClaims = [
    "自动排班",
    "自动补班",
    "审批",
    "导出",
    "批量",
    "结算",
    "收费",
    "Excel 上传",
    "导入 Excel",
    "真实接口",
  ]
  const uiFiles = [
    "app/roster-drafts/page.tsx",
    "components/roster-draft-workbench.tsx",
  ]

  for (const file of uiFiles) {
    const content = readProjectFile(file)
    for (const claim of forbiddenClaims) {
      assert.ok(!content.includes(claim), `${file} must not contain ${claim}`)
    }
  }
})
