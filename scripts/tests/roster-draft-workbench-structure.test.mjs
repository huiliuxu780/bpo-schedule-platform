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

test("roster draft workbench is organized as a scheduler workbench, not a report page", () => {
  const content = readProjectFile("components/roster-draft-workbench.tsx")

  assert.ok(content.includes("RosterWorkbenchToolbar"))
  assert.ok(content.includes("MonthScanGrid"))
  assert.ok(content.includes("WeekScheduleGrid"))
  assert.ok(content.includes("CellInspector"))
  assert.ok(content.includes("WorkbenchQueue"))
  assert.ok(content.includes("data-roster-cell-key"))
  assert.ok(content.includes("定位到格子"))
  assert.ok(content.includes("月度扫盘"))
  assert.ok(content.includes("周度处理"))
  assert.ok(!content.includes('<TableHead>日期</TableHead>'))
  assert.ok(!content.includes('<TableHead>员工</TableHead>'))
  assert.ok(!content.includes("展开单周明细"))
})

test("roster draft page is a full-screen grid-first scheduler surface", () => {
  const page = readProjectFile("app/roster-drafts/page.tsx")
  const content = readProjectFile("components/roster-draft-workbench.tsx")

  assert.ok(!page.includes("WorkbenchPageHeader"))
  assert.ok(!page.includes("按目标月份生成下月人员级班表草稿"))
  assert.ok(page.includes("h-[calc(100svh-var(--header-height))]"))
  assert.ok(page.includes("p-0"))
  assert.ok(content.includes('data-slot="roster-workbench-shell"'))
  assert.ok(content.includes('data-slot="roster-board-toolbar"'))
  assert.ok(content.includes('data-slot="roster-grid-canvas"'))
  assert.ok(content.includes('data-slot="roster-board-statusbar"'))
  assert.ok(content.includes('React.useState<WorkbenchView>("month")'))
  assert.ok(!content.includes('React.useState<WorkbenchView>("week")'))
})

test("roster draft detail and queue are exposed through a right drawer, not a fixed side card", () => {
  const content = readProjectFile("components/roster-draft-workbench.tsx")

  assert.ok(content.includes("@/components/ui/drawer"))
  assert.ok(content.includes("<Drawer"))
  assert.ok(content.includes('direction="right"'))
  assert.ok(content.includes("setInspectorOpen(true)"))
  assert.ok(content.includes("CellInspectorPanel"))
  assert.ok(content.includes("WorkbenchQueuePanel"))
  assert.ok(!content.includes("xl:grid-cols-[minmax(0,1fr)_360px]"))
  assert.ok(!content.includes("<aside"))
  assert.ok(!content.includes("<CellInspector selectedCell={selectedCell} />"))
  assert.ok(!content.includes("<WorkbenchQueue items={queueItems} onLocateCell={locateCell} />"))
})

test("roster draft copied cells support controlled local editing without production save or publish", () => {
  const content = readProjectFile("components/roster-draft-workbench.tsx")

  assert.ok(content.includes("@/components/ui/input"))
  assert.ok(content.includes("type RosterCellDraftEdit"))
  assert.ok(content.includes("const [cellEdits, setCellEdits]"))
  assert.ok(content.includes("getEffectiveCell"))
  assert.ok(content.includes("updateCellDraftEdit"))
  assert.ok(content.includes("resetCellDraftEdit"))
  assert.ok(content.includes("RosterCellEditPanel"))
  assert.ok(content.includes('aria-label="班种"'))
  assert.ok(content.includes("恢复生成值"))
  assert.ok(content.includes("仅当前草稿预览"))
  assert.ok(content.includes('selectedCell.originalCell.status === "copied"'))
  assert.ok(content.includes("异常和待确认格子不在本轮编辑"))
  assert.ok(!content.includes("保存并发布"))
  assert.ok(!content.includes("提交审批"))
})

test("roster draft workbench derives publish preview shift counts and half-hour coverage", () => {
  const content = readProjectFile("components/roster-draft-workbench.tsx")

  assert.ok(content.includes('type RosterLifecycleState = "draft" | "publishing" | "published"'))
  assert.ok(content.includes("const [rosterLifecycleState, setRosterLifecycleState]"))
  assert.ok(content.includes("buildRosterDerivedCoverage"))
  assert.ok(content.includes("RosterReleasePreviewPanel"))
  assert.ok(content.includes("shiftCounts"))
  assert.ok(content.includes("halfHourCoverage"))
  assert.ok(content.includes("发布当前草稿"))
  assert.ok(content.includes("已发布快照"))
  assert.ok(content.includes("发布预览"))
  assert.ok(content.includes("班次数"))
  assert.ok(content.includes("半小时覆盖"))
  assert.ok(content.includes("coveredSlotCount"))
  assert.ok(content.includes("parseHalfHourSlots"))
  assert.ok(!content.includes("保存并发布"))
  assert.ok(!content.includes("提交审批"))
})

test("roster draft workbench derives forecast arranged actual gaps from edited draft cells", () => {
  const content = readProjectFile("components/roster-draft-workbench.tsx")

  assert.ok(content.includes("type RosterGapPreviewRow"))
  assert.ok(content.includes("buildRosterGapPreview"))
  assert.ok(content.includes("RosterGapWorkbenchPanel"))
  assert.ok(content.includes("gapRows"))
  assert.ok(content.includes("forecastGap"))
  assert.ok(content.includes("actualGap"))
  assert.ok(content.includes("relatedEmployeeIds"))
  assert.ok(content.includes("cellEdits"))
  assert.ok(content.includes("缺口队列"))
  assert.ok(content.includes("Forecast"))
  assert.ok(content.includes("Arranged"))
  assert.ok(content.includes("Actual"))
  assert.ok(content.includes("定位缺口"))
  assert.ok(content.includes('onLocateCell(primaryEmployeeId, row.businessDate, "week")'))
})

test("roster draft workbench supports manual gap resolution through related covered cells", () => {
  const content = readProjectFile("components/roster-draft-workbench.tsx")

  assert.ok(content.includes("type RosterGapRelatedCell"))
  assert.ok(content.includes("relatedCells"))
  assert.ok(content.includes("RosterGapRelatedCellList"))
  assert.ok(content.includes("相关覆盖格子"))
  assert.ok(content.includes("当前无覆盖人员"))
  assert.ok(content.includes("定位当天"))
  assert.ok(content.includes("setInspectorTab"))
  assert.ok(content.includes('setInspectorTab("detail")'))
  assert.ok(content.includes("onSelectRelatedCell"))
  assert.ok(content.includes("isDraftEdited"))
  assert.ok(content.includes("已调整"))
  assert.ok(content.includes("复用格子详情"))
  assert.ok(!content.includes("候选推荐"))
  assert.ok(!content.includes("忽略缺口"))
})

test("roster draft workbench publishes current draft through local API and shows read-only snapshot", () => {
  const content = readProjectFile("components/roster-draft-workbench.tsx")

  assert.ok(content.includes('type RosterLifecycleState = "draft" | "publishing" | "published"'))
  assert.ok(content.includes("type PublishedRosterSnapshot"))
  assert.ok(content.includes("publishCurrentRosterDraft"))
  assert.ok(content.includes("/api/v1/roster-drafts/publish"))
  assert.ok(content.includes("/api/v1/roster-drafts/current-published"))
  assert.ok(content.includes("/api/v1/roster-drafts/locks/acquire"))
  assert.ok(content.includes("/api/v1/roster-drafts/locks/release"))
  assert.ok(content.includes("发布当前草稿"))
  assert.ok(content.includes("已发布快照"))
  assert.ok(content.includes("data-slot=\"roster-published-snapshot\""))
  assert.ok(content.includes("publishedSnapshot"))
  assert.ok(content.includes("isRosterReadOnly"))
  assert.ok(content.includes("releaseOwnRosterLock"))
  assert.ok(!content.includes("提交审批"))
  assert.ok(!content.includes("批量发布"))
})

test("roster draft workbench supports published roster revision draft loop", () => {
  const content = readProjectFile("components/roster-draft-workbench.tsx")

  assert.ok(content.includes('type RosterLifecycleState = "draft" | "publishing" | "published" | "revision_draft"'))
  assert.ok(content.includes("type RosterRevisionDraft"))
  assert.ok(content.includes("createRosterRevisionDraft"))
  assert.ok(content.includes("publishRevisionDraft"))
  assert.ok(content.includes("/api/v1/roster-drafts/revisions/create"))
  assert.ok(content.includes("/api/v1/roster-drafts/active-draft"))
  assert.ok(content.includes("创建修订草稿"))
  assert.ok(content.includes("重新发布修订"))
  assert.ok(content.includes("上一版来源"))
  assert.ok(content.includes("本次修改摘要"))
  assert.ok(content.includes("revisionDraft"))
  assert.ok(content.includes("revisionCellSourceByKey"))
  assert.ok(!content.includes("版本历史页"))
  assert.ok(!content.includes("未来生效"))
})

test("roster draft workbench closes published roster gaps through locate and revision flow", () => {
  const content = readProjectFile("components/roster-draft-workbench.tsx")

  assert.ok(content.includes("type PublishedRosterSnapshot"))
  assert.ok(content.includes("cells: PublishedRosterCell[]"))
  assert.ok(content.includes("const publishedGapRows = React.useMemo"))
  assert.ok(content.includes("buildPublishedRosterGapPreview"))
  assert.ok(content.includes("publishedGapRows"))
  assert.ok(content.includes('gapRows={publishedGapRows}'))
  assert.ok(content.includes("正式班表缺口"))
  assert.ok(content.includes("先发布正式班表"))
  assert.ok(content.includes("当前正式版"))
  assert.ok(content.includes("Arranged 从正式版派生"))
  assert.ok(content.includes("创建修订草稿"))
  assert.ok(content.includes("重新发布修订"))
  assert.ok(!content.includes("自动推荐"))
  assert.ok(!content.includes("自动处理"))
})

test("roster draft workbench handles downstream request intents through locate and revision flow", () => {
  const content = readProjectFile("components/roster-draft-workbench.tsx")

  assert.ok(content.includes("type DownstreamRosterRequestIntent"))
  assert.ok(content.includes("DownstreamIssueWorkspacePanel"))
  assert.ok(content.includes("const downstreamRequestRows = React.useMemo"))
  assert.ok(content.includes("/api/v1/roster-requests"))
  assert.ok(content.includes("/api/v1/roster-requests/{request_id}/resolve") || content.includes("/resolve"))
  assert.ok(content.includes('data-slot="downstream-issue-workspace"'))
  assert.ok(content.includes("下游问题工作区"))
  assert.ok(content.includes("issueStatusFilter"))
  assert.ok(content.includes("issueActionFilter"))
  assert.ok(content.includes("issueEmployeeFilter"))
  assert.ok(content.includes("scheduler_resolution_note"))
  assert.ok(content.includes("resolutionNotes"))
  assert.ok(content.includes("处理说明"))
  assert.ok(content.includes("已处理"))
  assert.ok(content.includes("定位到正式班表格子"))
  assert.ok(content.includes("/roster-change-governance"))
  assert.ok(content.includes("查看变更治理"))
  assert.ok(content.includes("创建修订草稿"))
  assert.ok(content.includes("关闭问题"))
  assert.ok(!content.includes("审批通过"))
  assert.ok(!content.includes("通知一线"))
})

test("roster draft workbench keeps mature-scheduling references structural and non-production", () => {
  const content = readProjectFile("components/roster-draft-workbench.tsx")

  assert.ok(content.includes("Homebase"))
  assert.ok(content.includes("Deputy"))
  assert.ok(content.includes("When I Work"))
  assert.ok(content.includes("借鉴结构，不复制视觉"))
  assert.ok(!content.includes("Save & Publish"))
  assert.ok(!content.includes("Auto-Schedule"))
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
