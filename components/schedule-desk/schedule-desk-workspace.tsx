"use client"

// 排班计划台客户端编排：初始化矩阵 store（乐观编辑态）、本地即时覆盖重算
//（编辑后纯函数即时重算 48×7 区间覆盖；保存响应带回 coverage_delta 时以后端
// 为权威合并），并编排网格、分段编辑抽屉、校验面板、发布弹窗与状态区。

import * as React from "react"
import { toast } from "sonner"

import { ScheduleDeskStatusBar } from "@/components/schedule-desk/board-status-bar"
import { ScheduleDeskCoveragePanel } from "@/components/schedule-desk/coverage-panel"
import { ScheduleDeskPublishDialog } from "@/components/schedule-desk/publish-dialog"
import { SegmentEditorDrawer } from "@/components/schedule-desk/segment-editor-drawer"
import {
  type ScheduleDeskApiCoverage,
  type ScheduleDeskApiMatrix,
  type ScheduleDeskApiPeriod,
  applyCoverageDelta,
  computeLocalCoverage,
  summarizeCoverageDailySummaries,
  summarizeCoverageIntervalSeries,
  summarizeCoverageOverall,
  summarizeScheduleMatrix,
} from "@/components/schedule-desk/schedule-matrix-model"
import { ScheduleMatrixGrid } from "@/components/schedule-desk/schedule-matrix-grid"
import { configureScheduleDeskApiBase } from "@/components/schedule-desk/schedule-matrix-api"
import {
  applySegmentsToSelectedRows,
  getCurrentCells,
  getCoverageDelta,
  getRowView,
  initMatrixStore,
  useMatrixStatus,
} from "@/components/schedule-desk/use-matrix-store"
import { ScheduleDeskValidationPanel } from "@/components/schedule-desk/validation-panel"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type ScheduleDeskWorkspaceProps = {
  period: ScheduleDeskApiPeriod
  matrix: ScheduleDeskApiMatrix
  coverage: ScheduleDeskApiCoverage
  selectedDate: string
  queryPrefix: string
  shiftCodeOptions: string[]
  // 后端 API base：由 app/schedule-desk/page.tsx 在请求时求值后以 prop 传入，
  // 再注入客户端写路径；客户端不依赖构建期内联的 NEXT_PUBLIC_* 环境变量。
  apiBaseUrl: string
}

export function ScheduleDeskWorkspace({
  period,
  matrix,
  coverage,
  selectedDate,
  queryPrefix,
  shiftCodeOptions,
  apiBaseUrl,
}: ScheduleDeskWorkspaceProps) {
  const matrixSummary = React.useMemo(() => summarizeScheduleMatrix(matrix), [matrix])
  const rangeKey = `${period.period_id}|${matrix.date_from}|${matrix.date_to}`
  const readOnly = period.status === "published"

  // store 初始化移入 effect：render 阶段不通知订阅组件（发布后 router.refresh()
  // 触发 readOnly 翻转时，不会在渲染期间波及其它订阅者）。
  // 初始化幂等：同范围内重复调用只同步只读态，不覆盖本地未保存改动；
  // 范围切换时 initMatrixStore 会等待在途 flush 完成并刷出脏改动后再重建。
  React.useEffect(() => {
    configureScheduleDeskApiBase(apiBaseUrl)
    void initMatrixStore({
      periodId: period.period_id,
      rangeKey,
      dateFrom: matrix.date_from,
      dateTo: matrix.date_to,
      readOnly,
      version: matrix.version,
      employees: matrixSummary.employees,
      dates: matrixSummary.dates,
      cells: matrix.cells,
    })
  }, [
    apiBaseUrl,
    period.period_id,
    rangeKey,
    matrix.date_from,
    matrix.date_to,
    matrix.version,
    matrix.cells,
    readOnly,
    matrixSummary,
  ])

  const status = useMatrixStatus()
  const [editorTarget, setEditorTarget] = React.useState<{
    employeeId: string
    scheduleDate: string
  } | null>(null)
  const [templateOpen, setTemplateOpen] = React.useState(false)
  const [publishOpen, setPublishOpen] = React.useState(false)

  // 编辑后本地即时覆盖：以当前单元格（含未保存改动）纯函数重算；
  // 无脏改动时若保存响应带回 coverage_delta，则以后端为权威合并进覆盖状态。
  const liveCoverage = React.useMemo(() => {
    const delta = getCoverageDelta()

    if (status.dirtyCount > 0) {
      try {
        return computeLocalCoverage(
          matrix.date_from,
          matrix.date_to,
          getCurrentCells(),
          coverage
        )
      } catch {
        return coverage
      }
    }

    return delta ? applyCoverageDelta(coverage, delta) : coverage
  }, [
    coverage,
    matrix.date_from,
    matrix.date_to,
    status.dirtyCount,
    status.saving,
    status.baseVersion,
    status.lastSavedAt,
  ])

  const intervalPoints = summarizeCoverageIntervalSeries(liveCoverage, selectedDate)
  const dailySummaries = summarizeCoverageDailySummaries(liveCoverage)
  const coverageOverall = summarizeCoverageOverall(liveCoverage)
  const rangeLabel = matrix.week
    ? `${matrix.week.label} ${matrix.week.date_from} 至 ${matrix.week.date_to}`
    : `${period.date_from} 至 ${period.date_to}`

  const skillOptions = React.useMemo(() => {
    const skills = new Set<string>()

    for (const cell of matrix.cells) {
      for (const segment of cell.segments) {
        if (segment.skill_id) {
          skills.add(segment.skill_id)
        }
      }
    }

    return Array.from(skills).sort()
  }, [matrix.cells])

  const editorSegments = editorTarget
    ? getRowView(editorTarget.employeeId).cells[editorTarget.scheduleDate]?.segments ?? []
    : []

  return (
    <>
      <ScheduleDeskCoveragePanel
        dates={matrixSummary.dates}
        selectedDate={selectedDate}
        queryPrefix={queryPrefix}
        intervalPoints={intervalPoints}
        dailySummaries={dailySummaries}
      />
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <Card className="min-w-0 flex-1">
          <CardHeader>
            <CardTitle>排班矩阵{readOnly ? "（只读）" : ""}</CardTitle>
            <CardDescription>
              {readOnly
                ? `周期已发布，单元格只读展示；范围：${rangeLabel}`
                : `员工×日期网格，点击单元格编辑活动分段，改动自动保存；范围：${rangeLabel}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScheduleMatrixGrid
              dates={matrixSummary.dates}
              employees={matrixSummary.employees}
              readOnly={readOnly}
              onCellOpen={(employeeId, scheduleDate) => setEditorTarget({ employeeId, scheduleDate })}
              onTemplateRequest={() => setTemplateOpen(true)}
            />
          </CardContent>
        </Card>
        <ScheduleDeskValidationPanel periodId={period.period_id} />
      </div>
      <ScheduleDeskStatusBar
        period={period}
        matrixVersion={matrixSummary.version}
        rangeLabel={rangeLabel}
        employeeCount={matrixSummary.employees.length}
        cellCount={matrixSummary.totalCells}
        coverageOverall={coverageOverall}
        onPublishRequest={() => setPublishOpen(true)}
      />
      <SegmentEditorDrawer
        open={editorTarget !== null}
        employeeId={editorTarget?.employeeId ?? ""}
        scheduleDate={editorTarget?.scheduleDate ?? ""}
        initialSegments={editorSegments}
        shiftCodeOptions={shiftCodeOptions}
        skillOptions={skillOptions}
        onClose={() => setEditorTarget(null)}
      />
      <SegmentEditorDrawer
        open={templateOpen}
        employeeId="选中行"
        scheduleDate="全部日期"
        initialSegments={[]}
        shiftCodeOptions={shiftCodeOptions}
        skillOptions={skillOptions}
        onClose={() => setTemplateOpen(false)}
        onConfirm={(segments) => {
          applySegmentsToSelectedRows(segments)
          toast.success("已将分段应用到选中行的未锁定单元格")
        }}
      />
      <ScheduleDeskPublishDialog
        open={publishOpen}
        periodId={period.period_id}
        month={period.month}
        status={period.status}
        dateFrom={matrix.date_from}
        dateTo={matrix.date_to}
        onClose={() => setPublishOpen(false)}
      />
    </>
  )
}
