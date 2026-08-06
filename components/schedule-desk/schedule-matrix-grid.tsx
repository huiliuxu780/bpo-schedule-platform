"use client"

// 可编辑排班矩阵：单元格点击进入分段编辑抽屉；行级订阅（useSyncExternalStore）
// + React.memo 单元格，单 cell 编辑不触发全表重渲染。
// 批量工具条：复制行/设置/清空/锁定，作用于勾选的员工行。

import * as React from "react"
import { useSyncExternalStore } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { Copy, Eraser, Lock, LockOpen, Settings2 } from "lucide-react"
import { toast } from "sonner"

import {
  formatWeekdayLabel,
  summarizeMatrixSegment,
} from "@/components/schedule-desk/schedule-matrix-model"
import {
  type MatrixCellView,
  clearSelectedRows,
  clearSelection,
  copySelectedRows,
  getDateColumnIndex,
  getEmployeeRowIndex,
  getFocusTarget,
  getRowView,
  isEmployeeSelected,
  lockSelectedRows,
  subscribeSelection,
  toggleEmployeeSelected,
  useMatrixRow,
  useMatrixStatus,
} from "@/components/schedule-desk/use-matrix-store"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

const EMPLOYEE_COLUMN_WIDTH = 176
const DATE_COLUMN_WIDTH = 184
const SELECT_COLUMN_WIDTH = 40
const FOCUS_HIGHLIGHT_MS = 2500

type ScheduleMatrixGridProps = {
  dates: string[]
  employees: string[]
  readOnly: boolean
  onCellOpen: (employeeId: string, scheduleDate: string) => void
  onTemplateRequest: () => void
}

export function ScheduleMatrixGrid({
  dates,
  employees,
  readOnly,
  onCellOpen,
  onTemplateRequest,
}: ScheduleMatrixGridProps) {
  const parentRef = React.useRef<HTMLDivElement>(null)
  const status = useMatrixStatus()
  const [focusToken, setFocusToken] = React.useState(0)
  const [highlight, setHighlight] = React.useState<{
    employeeId: string
    scheduleDate: string
    segmentIndex: number | null
  } | null>(null)
  const [anySelectedUnlocked, setAnySelectedUnlocked] = React.useState(false)

  const virtualizer = useVirtualizer({
    count: employees.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 52,
    overscan: 8,
    measureElement: (element) => element.getBoundingClientRect().height,
  })

  // 校验面板点击问题项 → 滚动定位到对应 员工/日期/分段。
  React.useEffect(() => {
    if (status.focusToken === 0 || status.focusToken === focusToken) {
      return
    }

    const target = getFocusTarget()

    if (!target) {
      return
    }

    setFocusToken(status.focusToken)

    const rowIndex = getEmployeeRowIndex(target.employeeId)
    const columnIndex = getDateColumnIndex(target.scheduleDate)

    if (rowIndex >= 0) {
      virtualizer.scrollToIndex(rowIndex, { align: "center" })
    }

    if (columnIndex >= 0 && parentRef.current) {
      const scrollLeft =
        SELECT_COLUMN_WIDTH + EMPLOYEE_COLUMN_WIDTH + columnIndex * DATE_COLUMN_WIDTH - 120
      parentRef.current.scrollTo({ left: Math.max(scrollLeft, 0), behavior: "smooth" })
    }

    setHighlight({
      employeeId: target.employeeId,
      scheduleDate: target.scheduleDate,
      segmentIndex: target.segmentIndex,
    })

    const timer = setTimeout(() => setHighlight(null), FOCUS_HIGHLIGHT_MS)

    return () => clearTimeout(timer)
  }, [status.focusToken, focusToken, virtualizer])

  // 工具条「锁定/解锁」的切换方向取决于选中行现状。
  React.useEffect(() => {
    let unlocked = false

    for (const employeeId of employees) {
      if (!isEmployeeSelected(employeeId)) {
        continue
      }

      const row = peekRowLockState(employeeId, dates)

      if (!row.allLocked) {
        unlocked = true
        break
      }
    }

    setAnySelectedUnlocked(unlocked)
  }, [employees, dates, status.selectedCount, status.baseVersion, status.dirtyCount])

  if (dates.length === 0) {
    return (
      <p className="p-6 text-sm text-muted-foreground">当前周期没有可展示的日期范围。</p>
    )
  }

  if (employees.length === 0) {
    return (
      <p className="p-6 text-sm text-muted-foreground">
        当前范围内没有排员工；该周期尚未从排班批次派生矩阵单元格。
      </p>
    )
  }

  const virtualItems = virtualizer.getVirtualItems()
  const paddingTop = virtualItems.length > 0 ? virtualItems[0].start : 0
  const paddingBottom =
    virtualItems.length > 0
      ? Math.max(virtualizer.getTotalSize() - virtualItems[virtualItems.length - 1].end, 0)
      : 0
  const gridTemplateColumns = `${SELECT_COLUMN_WIDTH}px ${EMPLOYEE_COLUMN_WIDTH}px repeat(${dates.length}, ${DATE_COLUMN_WIDTH}px)`
  const minWidth = SELECT_COLUMN_WIDTH + EMPLOYEE_COLUMN_WIDTH + dates.length * DATE_COLUMN_WIDTH

  return (
    <div className="flex flex-col">
      <MatrixBatchToolbar
        readOnly={readOnly}
        selectedCount={status.selectedCount}
        anySelectedUnlocked={anySelectedUnlocked}
        onTemplateRequest={onTemplateRequest}
      />
      <div ref={parentRef} className="max-h-[520px] overflow-auto overscroll-contain">
        <div style={{ minWidth }}>
          <div
            className="sticky top-0 z-20 grid border-b bg-muted/80 backdrop-blur"
            style={{ gridTemplateColumns }}
          >
            <div className="sticky left-0 z-30 border-r bg-muted px-2 py-2" />
            <div className="sticky left-10 z-30 border-r bg-muted px-3 py-2 text-xs font-medium text-muted-foreground">
              员工（{employees.length} 人）
            </div>
            {dates.map((date) => (
              <div
                key={date}
                className="border-l px-3 py-2 text-xs font-medium text-muted-foreground"
              >
                {date.slice(5)} {formatWeekdayLabel(date)}
              </div>
            ))}
          </div>
          {paddingTop > 0 ? <div style={{ height: paddingTop }} /> : null}
          {virtualItems.map((virtualItem) => {
            const employeeId = employees[virtualItem.index]

            return (
              <div
                key={employeeId}
                data-index={virtualItem.index}
                ref={virtualizer.measureElement}
              >
                <MatrixRow
                  employeeId={employeeId}
                  dates={dates}
                  gridTemplateColumns={gridTemplateColumns}
                  readOnly={readOnly}
                  highlight={highlight}
                  onCellOpen={onCellOpen}
                />
              </div>
            )
          })}
          {paddingBottom > 0 ? <div style={{ height: paddingBottom }} /> : null}
        </div>
      </div>
    </div>
  )
}

// 不触发订阅地快速查看行锁定状态（仅工具条方向判断用）。
function peekRowLockState(employeeId: string, dates: string[]): { allLocked: boolean } {
  const row = getRowView(employeeId)

  return { allLocked: dates.length > 0 && dates.every((date) => row.cells[date]?.locked) }
}

type MatrixBatchToolbarProps = {
  readOnly: boolean
  selectedCount: number
  anySelectedUnlocked: boolean
  onTemplateRequest: () => void
}

function MatrixBatchToolbar({
  readOnly,
  selectedCount,
  anySelectedUnlocked,
  onTemplateRequest,
}: MatrixBatchToolbarProps) {
  const disabled = readOnly || selectedCount === 0
  const readOnlyHint = readOnly ? "周期已发布，矩阵只读" : undefined
  const selectionHint = readOnly ? undefined : "请先在左侧勾选员工行"

  return (
    <div className="flex flex-wrap items-center gap-2 border-b px-3 py-2">
      <span className="text-xs text-muted-foreground">
        {readOnly
          ? "只读模式：周期已发布，编辑控件不可用"
          : `已选 ${selectedCount} 行${selectedCount === 0 ? "（勾选员工行后可批量操作）" : ""}`}
      </span>
      <div className="ml-auto flex items-center gap-1.5">
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={disabled}
          title={readOnlyHint ?? selectionHint}
          onClick={() => copySelectedRows()}
        >
          <Copy />
          复制行
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={disabled}
          title={readOnlyHint ?? selectionHint}
          onClick={onTemplateRequest}
        >
          <Settings2 />
          设置
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={disabled}
          title={readOnlyHint ?? selectionHint}
          onClick={() => clearSelectedRows()}
        >
          <Eraser />
          清空
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={disabled}
          title={readOnlyHint ?? selectionHint}
          onClick={() => lockSelectedRows(anySelectedUnlocked)}
        >
          {anySelectedUnlocked ? <Lock /> : <LockOpen />}
          {anySelectedUnlocked ? "锁定" : "解锁"}
        </Button>
        {selectedCount > 0 && !readOnly ? (
          <Button type="button" size="sm" variant="ghost" onClick={() => clearSelection()}>
            取消选择
          </Button>
        ) : null}
      </div>
    </div>
  )
}

type CellHighlight = {
  employeeId: string
  scheduleDate: string
  segmentIndex: number | null
} | null

type MatrixRowProps = {
  employeeId: string
  dates: string[]
  gridTemplateColumns: string
  readOnly: boolean
  highlight: CellHighlight
  onCellOpen: (employeeId: string, scheduleDate: string) => void
}

function MatrixRow({
  employeeId,
  dates,
  gridTemplateColumns,
  readOnly,
  highlight,
  onCellOpen,
}: MatrixRowProps) {
  const row = useMatrixRow(employeeId)
  const selected = useSyncExternalStore(subscribeSelection, () => isEmployeeSelected(employeeId))

  return (
    <div className="grid border-b" style={{ gridTemplateColumns }}>
      <div className="sticky left-0 z-10 flex items-center justify-center border-r bg-card px-2 py-2">
        <Checkbox
          aria-label={`选择员工 ${employeeId}`}
          checked={selected}
          onCheckedChange={() => toggleEmployeeSelected(employeeId)}
        />
      </div>
      <div className="sticky left-10 z-10 flex truncate border-r bg-card px-3 py-2 text-sm font-medium">
        <span className="truncate" title={employeeId}>
          {employeeId}
        </span>
      </div>
      {dates.map((date) => {
        const cell = row.cells[date]
        const target =
          highlight !== null &&
          highlight.employeeId === employeeId &&
          highlight.scheduleDate === date
            ? highlight
            : null

        return (
          <MatrixGridCell
            key={date}
            cell={cell}
            readOnly={readOnly}
            highlighted={target !== null}
            highlightSegmentIndex={target?.segmentIndex ?? null}
            onOpen={() => {
              if (readOnly) {
                toast.info("周期已发布，矩阵只读")

                return
              }

              if (cell.locked) {
                toast.info(`${employeeId} ${date} 单元格已锁定，请先解锁`)

                return
              }

              onCellOpen(employeeId, date)
            }}
          />
        )
      })}
    </div>
  )
}

type MatrixGridCellProps = {
  cell: MatrixCellView
  readOnly: boolean
  highlighted: boolean
  highlightSegmentIndex: number | null
  onOpen: () => void
}

const MatrixGridCell = React.memo(function MatrixGridCell({
  cell,
  readOnly,
  highlighted,
  highlightSegmentIndex,
  onOpen,
}: MatrixGridCellProps) {
  const summaries = cell.segments.map((segment, index) =>
    summarizeMatrixSegment(segment, `${cell.employeeId}-${cell.scheduleDate}-${index}`)
  )

  return (
    <button
      type="button"
      onClick={onOpen}
      data-cell={`${cell.employeeId}|${cell.scheduleDate}`}
      title={readOnly ? "只读" : "点击编辑活动分段"}
      className={cn(
        "flex min-h-[40px] cursor-pointer flex-col gap-1 border-l px-2 py-1.5 text-left transition-colors",
        "hover:bg-muted/60 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
        highlighted && "bg-amber-100/60 ring-2 ring-inset ring-amber-500"
      )}
    >
      {cell.isEmpty ? (
        <span className="text-xs text-muted-foreground/60">—</span>
      ) : (
        <>
          <span className="flex items-center gap-1">
            {cell.locked ? <Lock className="size-3 text-muted-foreground" aria-hidden /> : null}
            {cell.dirty ? (
              <span
                className="size-1.5 rounded-full bg-amber-500"
                title="有未保存改动"
                aria-label="有未保存改动"
              />
            ) : null}
          </span>
          {summaries.map((summary, index) => (
            <span
              key={summary.key}
              title={`${summary.activityTypeLabel} ${summary.timeRangeText}${
                summary.crossesDay ? "（跨日）" : ""
              }`}
              className={cn(
                "rounded px-1.5 py-0.5 text-[11px] leading-4",
                summary.activityTypeLabel === "出勤"
                  ? "bg-muted font-medium"
                  : "border border-dashed text-muted-foreground",
                highlightSegmentIndex === index && "bg-amber-200 font-semibold"
              )}
            >
              {summary.summaryText}
            </span>
          ))}
        </>
      )}
      <span className="sr-only">{readOnly ? "只读单元格" : "编辑单元格"}</span>
    </button>
  )
})
