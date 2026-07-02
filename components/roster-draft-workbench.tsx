"use client"

import * as React from "react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type {
  RosterCellStatus,
  RosterDraftViewModel,
  RosterMonthCell,
  RosterMonthRow,
  RosterWeek,
  RosterWeekDetail,
} from "@/lib/roster-drafts"
import { cn } from "@/lib/utils"

type WorkbenchView = "month" | "week"
type QueueKind = "exception" | "pending" | "annotation"

type SelectedCell = {
  employeeId: string
  employeeName: string
  teamName: string
  date: string
  cell: RosterMonthCell
  detail?: RosterWeekDetail
}

type QueueItem = {
  id: string
  kind: QueueKind
  employeeId: string
  employeeName: string
  teamName: string
  date: string
  label: string
  description: string
  meta: string
}

const statusLabels: Record<RosterCellStatus, string> = {
  copied: "复制生成",
  needs_confirmation: "待确认",
  exception: "异常",
  filtered_annotation: "非班务标注已过滤",
}

const statusClasses: Record<RosterCellStatus, string> = {
  copied: "border-primary/20 bg-primary/10 text-primary",
  needs_confirmation: "border-muted-foreground/20 bg-muted text-muted-foreground",
  exception: "border-destructive/30 bg-destructive/10 text-destructive",
  filtered_annotation: "border-accent bg-accent text-accent-foreground",
}

const queueLabels: Record<QueueKind, string> = {
  exception: "异常清单",
  pending: "待排人员",
  annotation: "已过滤标注",
}

const matureSchedulingReference =
  "Homebase / Deputy / When I Work：借鉴结构，不复制视觉"

export function RosterDraftWorkbench({
  model,
  targetMonths,
}: {
  model: RosterDraftViewModel
  targetMonths: string[]
}) {
  const [selectedMonth, setSelectedMonth] = React.useState(model.targetMonth)
  const [selectedWeekId, setSelectedWeekId] = React.useState(
    model.weeks[0]?.weekId ?? "W1"
  )
  const [view, setView] = React.useState<WorkbenchView>("month")
  const [selectedCellKey, setSelectedCellKey] = React.useState(() =>
    firstActionableCellKey(model)
  )
  const [inspectorOpen, setInspectorOpen] = React.useState(false)

  const selectedWeek =
    model.weeks.find((week) => week.weekId === selectedWeekId) ?? model.weeks[0]
  const queueItems = buildQueueItems(model, selectedWeek)
  const selectedCell =
    getSelectedCell(model, selectedCellKey) ?? getSelectedCell(model, firstCellKey(model))
  const teamNames = Array.from(new Set(model.monthRows.map((row) => row.teamName)))

  function locateCell(employeeId: string, date: string, nextView: WorkbenchView = "week") {
    setSelectedCellKey(cellKey(employeeId, date))
    const week = model.weeks.find((item) =>
      item.days.some((day) => day.date === date)
    )
    if (week) {
      setSelectedWeekId(week.weekId)
    }
    setView(nextView)
    setInspectorOpen(true)
  }

  return (
    <Drawer
      direction="right"
      open={inspectorOpen}
      onOpenChange={setInspectorOpen}
    >
      <div
        data-slot="roster-workbench-shell"
        className="flex min-h-0 flex-1 flex-col"
        title={matureSchedulingReference}
      >
        <RosterWorkbenchToolbar
          model={model}
          targetMonths={targetMonths}
          selectedMonth={selectedMonth}
          onSelectedMonthChange={setSelectedMonth}
          selectedWeekId={selectedWeek?.weekId ?? selectedWeekId}
          onSelectedWeekIdChange={setSelectedWeekId}
          selectedWeek={selectedWeek}
          teamNames={teamNames}
          queueCount={queueItems.length}
          onOpenInspector={() => setInspectorOpen(true)}
        />

        <Tabs
          value={view}
          onValueChange={(value) => setView(value as WorkbenchView)}
          className="flex min-h-0 min-w-0 flex-1 flex-col"
        >
          <div
            data-slot="roster-view-switcher"
            className="flex shrink-0 items-center justify-between gap-3 border-b bg-background px-4 py-2"
          >
            <TabsList>
              <TabsTrigger value="month">月视图</TabsTrigger>
              <TabsTrigger value="week">周视图</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {model.statusLegend.map((item) => (
                <Badge
                  key={item.status}
                  variant="outline"
                  className={cn(statusClasses[item.status], "border")}
                  title={item.description}
                >
                  {item.label}
                </Badge>
              ))}
            </div>
          </div>

          <div data-slot="roster-grid-canvas" className="min-h-0 flex-1 overflow-hidden">
            <TabsContent value="month" className="m-0 size-full">
              <MonthScanGrid
                model={model}
                selectedCellKey={selectedCellKey}
                onLocateCell={(employeeId, date) => locateCell(employeeId, date, "month")}
              />
            </TabsContent>
            <TabsContent value="week" className="m-0 size-full">
              <WeekScheduleGrid
                model={model}
                week={selectedWeek}
                selectedCellKey={selectedCellKey}
                onLocateCell={(employeeId, date) => locateCell(employeeId, date, "week")}
              />
            </TabsContent>
          </div>
        </Tabs>

        <RosterBoardStatusbar
          model={model}
          selectedCell={selectedCell}
          queueCount={queueItems.length}
          onOpenInspector={() => setInspectorOpen(true)}
        />
      </div>

      <RosterInspectorDrawer
        selectedCell={selectedCell}
        items={queueItems}
        onLocateCell={locateCell}
      />
    </Drawer>
  )
}

function RosterWorkbenchToolbar({
  model,
  targetMonths,
  selectedMonth,
  onSelectedMonthChange,
  selectedWeekId,
  onSelectedWeekIdChange,
  selectedWeek,
  teamNames,
  queueCount,
  onOpenInspector,
}: {
  model: RosterDraftViewModel
  targetMonths: string[]
  selectedMonth: string
  onSelectedMonthChange: (month: string) => void
  selectedWeekId: string
  onSelectedWeekIdChange: (weekId: string) => void
  selectedWeek?: RosterWeek
  teamNames: string[]
  queueCount: number
  onOpenInspector: () => void
}) {
  return (
    <div
      data-slot="roster-board-toolbar"
      className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b bg-background px-4 py-3"
    >
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <div className="min-w-0 pr-2">
          <div className="truncate text-sm font-medium">
            {model.project.projectName} / {model.project.workplaceName}
          </div>
          <div className="truncate text-xs text-muted-foreground">
            {teamNames.join(" / ")} · {selectedWeek?.label ?? "-"}
          </div>
        </div>
        <Select value={selectedMonth} onValueChange={onSelectedMonthChange}>
          <SelectTrigger className="w-36" aria-label="目标月份">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {targetMonths.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedWeekId} onValueChange={onSelectedWeekIdChange}>
          <SelectTrigger className="w-44" aria-label="当前周">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {model.weeks.map((week) => (
              <SelectItem key={week.weekId} value={week.weekId}>
                {week.weekId} / {week.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button variant="outline" onClick={onOpenInspector}>
          详情与队列
          <Badge variant="secondary">{queueCount}</Badge>
        </Button>
        <Button asChild>
          <Link href={`/roster-drafts?month=${selectedMonth}`}>生成草稿</Link>
        </Button>
      </div>
    </div>
  )
}

function MonthScanGrid({
  model,
  selectedCellKey,
  onLocateCell,
}: {
  model: RosterDraftViewModel
  selectedCellKey: string
  onLocateCell: (employeeId: string, date: string) => void
}) {
  return (
    <div className="flex size-full min-h-0 flex-col bg-card">
      <div className="flex shrink-0 items-center justify-between border-b px-4 py-2">
        <div>
          <div className="text-sm font-medium">{model.targetMonth} 月度扫盘</div>
          <div className="text-xs text-muted-foreground">员工 x 日期</div>
        </div>
        <Badge variant="outline">{model.monthDays.length} 天</Badge>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        <div className="grid min-w-max grid-cols-[180px_repeat(var(--day-count),44px)]" style={{ "--day-count": model.monthDays.length } as React.CSSProperties}>
          <div className="sticky left-0 top-0 z-30 border-b border-r bg-card px-3 py-2 text-xs font-medium">
            员工
          </div>
          {model.monthDays.map((day) => (
            <div key={day.date} className="sticky top-0 z-20 border-b border-r bg-card px-1 py-2 text-center text-xs">
              <div className="font-medium">{day.dayOfMonth}</div>
              <div className="text-muted-foreground">周{day.weekdayLabel}</div>
            </div>
          ))}
          {model.monthRows.map((row) => (
            <React.Fragment key={row.employeeId}>
              <EmployeeCell row={row} dense />
              {row.cells.map((cell) => (
                <button
                  key={cell.date}
                  data-roster-cell-key={cellKey(row.employeeId, cell.date)}
                  type="button"
                  onClick={() => onLocateCell(row.employeeId, cell.date)}
                  className={cn(
                    "min-h-11 border-r border-b px-1 text-xs transition hover:bg-muted",
                    selectedCellKey === cellKey(row.employeeId, cell.date) && "ring-2 ring-ring ring-inset"
                  )}
                  title={`${row.employeeName} ${cell.date} ${cell.shiftCode ?? statusLabels[cell.status]}`}
                >
                  <span
                    className={cn(
                      "mx-auto flex size-8 items-center justify-center rounded-md border text-[11px] font-medium",
                      statusClasses[cell.status]
                    )}
                  >
                    {cell.shiftCode ?? (cell.status === "exception" ? "!" : "待")}
                  </span>
                </button>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

function WeekScheduleGrid({
  model,
  week,
  selectedCellKey,
  onLocateCell,
}: {
  model: RosterDraftViewModel
  week?: RosterWeek
  selectedCellKey: string
  onLocateCell: (employeeId: string, date: string) => void
}) {
  const weekDays = week?.days ?? []

  return (
    <div className="flex size-full min-h-0 flex-col bg-card">
      <div className="flex shrink-0 items-center justify-between border-b px-4 py-2">
        <div>
          <div className="text-sm font-medium">周度处理</div>
          <div className="text-xs text-muted-foreground">{week?.label ?? "-"}</div>
        </div>
        <Badge variant="outline">{weekDays.length} 天</Badge>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        <div className="grid min-w-[1040px] grid-cols-[220px_repeat(7,minmax(116px,1fr))]">
          <div className="sticky left-0 top-0 z-30 border-b border-r bg-card px-3 py-3 text-xs font-medium">
            员工
          </div>
          {weekDays.map((day) => (
            <div key={day.date} className="sticky top-0 z-20 border-b border-r bg-card px-3 py-3 text-sm">
              <div className="font-medium">{day.date}</div>
              <div className="text-xs text-muted-foreground">周{day.weekdayLabel}</div>
            </div>
          ))}
          {model.monthRows.map((row) => (
            <React.Fragment key={row.employeeId}>
              <EmployeeCell row={row} />
              {weekDays.map((day) => {
                const cell = row.cells.find((item) => item.date === day.date)
                const detail = model.weekDetails.find(
                  (item) =>
                    item.employeeId === row.employeeId && item.businessDate === day.date
                )

                return (
                  <button
                    key={day.date}
                    data-roster-cell-key={cellKey(row.employeeId, day.date)}
                    type="button"
                    onClick={() => onLocateCell(row.employeeId, day.date)}
                    className={cn(
                      "min-h-24 border-r border-b p-2 text-left transition hover:bg-muted/70",
                      selectedCellKey === cellKey(row.employeeId, day.date) && "ring-2 ring-ring ring-inset"
                    )}
                  >
                    <ShiftBlock cell={cell} detail={detail} />
                  </button>
                )
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

function EmployeeCell({ row, dense = false }: { row: RosterMonthRow; dense?: boolean }) {
  const exceptionCount = row.cells.filter((cell) => cell.status === "exception").length
  const copiedCount = row.cells.filter((cell) => cell.status === "copied").length

  return (
    <div
      className={cn(
        "sticky left-0 z-10 border-r border-b bg-card px-3",
        dense ? "py-2" : "py-3"
      )}
    >
      <div className="truncate text-sm font-medium">{row.employeeName}</div>
      <div className="truncate text-xs text-muted-foreground">{row.teamName}</div>
      {!dense && (
        <div className="mt-2 flex flex-wrap gap-1 text-[11px] text-muted-foreground">
          <span>{copiedCount} 天已生成</span>
          <span>/</span>
          <span>{exceptionCount} 异常</span>
        </div>
      )}
    </div>
  )
}

function ShiftBlock({
  cell,
  detail,
}: {
  cell?: RosterMonthCell
  detail?: RosterWeekDetail
}) {
  if (!cell) {
    return <span className="text-xs text-muted-foreground">无日期</span>
  }

  return (
    <div className={cn("rounded-lg border p-2", statusClasses[cell.status])}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold">
          {cell.shiftCode ?? (cell.status === "exception" ? "异常" : "待确认")}
        </span>
        <span className="size-2 rounded-full bg-current" />
      </div>
      <div className="mt-1 text-xs">{detail?.intervalLabel ?? "-"}</div>
      <div className="mt-2 text-[11px] opacity-80">
        来源 {detail?.sourceDate ?? cell.sourceDate ?? "-"}
      </div>
      <div className="mt-1 line-clamp-2 text-[11px] opacity-80">
        {detail?.reason ?? cell.reason ?? statusLabels[cell.status]}
      </div>
    </div>
  )
}

function RosterBoardStatusbar({
  model,
  selectedCell,
  queueCount,
  onOpenInspector,
}: {
  model: RosterDraftViewModel
  selectedCell?: SelectedCell
  queueCount: number
  onOpenInspector: () => void
}) {
  return (
    <div
      data-slot="roster-board-statusbar"
      className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t bg-background px-4 py-2 text-xs text-muted-foreground"
    >
      <div className="flex min-w-0 flex-wrap items-center gap-3">
        <span>{model.summary.employeeCount} 人</span>
        <span>{model.summary.generatedShiftCount} 格已生成</span>
        <span>{model.summary.exceptionCount} 异常</span>
        <span>{model.summary.pendingEmployeeCount} 待排</span>
      </div>
      <Button variant="ghost" size="sm" onClick={onOpenInspector}>
        {selectedCell
          ? `${selectedCell.employeeName} / ${selectedCell.date}`
          : "详情与队列"}
        <Badge variant="secondary">{queueCount}</Badge>
      </Button>
    </div>
  )
}

function RosterInspectorDrawer({
  selectedCell,
  items,
  onLocateCell,
}: {
  selectedCell?: SelectedCell
  items: QueueItem[]
  onLocateCell: (employeeId: string, date: string, view?: WorkbenchView) => void
}) {
  return (
    <DrawerContent
      data-slot="roster-inspector-drawer"
      className="sm:max-w-md"
    >
      <DrawerHeader className="border-b">
        <DrawerTitle>详情与队列</DrawerTitle>
        <DrawerDescription>
          只读查看格子详情，并从队列定位到对应员工和日期。
        </DrawerDescription>
      </DrawerHeader>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <Tabs defaultValue="detail" className="flex min-h-0 flex-col gap-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="detail">格子详情</TabsTrigger>
            <TabsTrigger value="queue">处理队列</TabsTrigger>
          </TabsList>
          <TabsContent value="detail" className="m-0">
            <CellInspectorPanel selectedCell={selectedCell} />
          </TabsContent>
          <TabsContent value="queue" className="m-0">
            <WorkbenchQueuePanel items={items} onLocateCell={onLocateCell} />
          </TabsContent>
        </Tabs>
      </div>
      <DrawerFooter className="border-t">
        <DrawerClose asChild>
          <Button variant="outline">关闭</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  )
}

function CellInspectorPanel({ selectedCell }: { selectedCell?: SelectedCell }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      {selectedCell ? (
        <div className="flex flex-col gap-4">
          <div>
            <div className="text-sm font-medium">{selectedCell.employeeName}</div>
            <div className="text-xs text-muted-foreground">
              {selectedCell.teamName} / {selectedCell.date}
            </div>
          </div>
          <Separator />
          <div className="grid gap-3 text-sm">
            <InspectorRow label="班种" value={selectedCell.cell.shiftCode ?? "待确认"} />
            <InspectorRow
              label="时间段"
              value={selectedCell.detail?.intervalLabel ?? "-"}
            />
            <InspectorRow
              label="来源日期"
              value={selectedCell.detail?.sourceDate ?? selectedCell.cell.sourceDate ?? "-"}
            />
            <InspectorRow label="状态" value={statusLabels[selectedCell.cell.status]} />
            <InspectorRow
              label="原因"
              value={
                selectedCell.detail?.reason ??
                selectedCell.cell.reason ??
                statusLabels[selectedCell.cell.status]
              }
            />
          </div>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">选择一个排班格子查看详情。</div>
      )}
    </div>
  )
}

function InspectorRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[72px_minmax(0,1fr)] gap-3">
      <div className="text-muted-foreground">{label}</div>
      <div className="min-w-0 break-words font-medium">{value}</div>
    </div>
  )
}

function WorkbenchQueuePanel({
  items,
  onLocateCell,
}: {
  items: QueueItem[]
  onLocateCell: (employeeId: string, date: string, view?: WorkbenchView) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onLocateCell(item.employeeId, item.date, "week")}
          className="rounded-lg border bg-card p-3 text-left transition hover:bg-muted"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{item.employeeName}</div>
              <div className="text-xs text-muted-foreground">{item.teamName}</div>
            </div>
            <Badge variant="outline">{queueLabels[item.kind]}</Badge>
          </div>
          <div className="mt-2 text-sm">{item.label}</div>
          <div className="mt-1 text-xs text-muted-foreground">{item.description}</div>
          <div className="mt-2 text-xs font-medium">定位到格子：{item.meta}</div>
        </button>
      ))}
    </div>
  )
}

function buildQueueItems(
  model: RosterDraftViewModel,
  selectedWeek?: RosterWeek
): QueueItem[] {
  const fallbackDate = selectedWeek?.days[0]?.date ?? model.monthDays[0]?.date ?? model.targetMonth
  const exceptionItems = model.exceptions.map((item) => ({
    id: `exception-${item.employeeId}-${item.targetDate}-${item.reason}`,
    kind: "exception" as const,
    employeeId: item.employeeId,
    employeeName: item.employeeName,
    teamName: item.teamName,
    date: item.targetDate,
    label: item.reasonLabel,
    description: item.suggestion,
    meta: item.targetDate,
  }))
  const pendingItems = model.pendingEmployees.map((item) => ({
    id: `pending-${item.employeeId}`,
    kind: "pending" as const,
    employeeId: item.employeeId,
    employeeName: item.employeeName,
    teamName: item.teamName,
    date: fallbackDate,
    label: item.reasonLabel,
    description: "需要排班师在周度处理网格中确认后续安排。",
    meta: fallbackDate,
  }))
  const annotationItems = model.filteredAnnotations.map((item) => ({
    id: `annotation-${item.employeeId}-${item.sourceDate}-${item.annotationCode}`,
    kind: "annotation" as const,
    employeeId: item.employeeId,
    employeeName: item.employeeName,
    teamName: item.teamName,
    date: item.targetDate,
    label: item.annotationCode,
    description: item.reason,
    meta: item.targetDate,
  }))

  return [...exceptionItems, ...pendingItems, ...annotationItems]
}

function getSelectedCell(model: RosterDraftViewModel, key: string): SelectedCell | undefined {
  const [employeeId, date] = key.split("|")
  const row = model.monthRows.find((item) => item.employeeId === employeeId)
  const cell = row?.cells.find((item) => item.date === date)
  if (!row || !cell) {
    return undefined
  }

  return {
    employeeId: row.employeeId,
    employeeName: row.employeeName,
    teamName: row.teamName,
    date,
    cell,
    detail: model.weekDetails.find(
      (item) => item.employeeId === row.employeeId && item.businessDate === date
    ),
  }
}

function firstActionableCellKey(model: RosterDraftViewModel): string {
  const exception = model.exceptions[0]
  if (exception) {
    return cellKey(exception.employeeId, exception.targetDate)
  }

  const pending = model.pendingEmployees[0]
  if (pending) {
    return cellKey(pending.employeeId, model.monthDays[0]?.date ?? model.targetMonth)
  }

  return firstCellKey(model)
}

function firstCellKey(model: RosterDraftViewModel): string {
  const firstRow = model.monthRows[0]
  const firstDate = model.monthDays[0]?.date ?? model.targetMonth
  return cellKey(firstRow?.employeeId ?? "", firstDate)
}

function cellKey(employeeId: string, date: string): string {
  return `${employeeId}|${date}`
}
