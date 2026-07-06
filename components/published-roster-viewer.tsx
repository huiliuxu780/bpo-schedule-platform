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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  type DownstreamPublishedRosterCellInput,
  type DownstreamPublishedRosterInput,
  type DownstreamRosterCell,
  type DownstreamRosterRole,
  type DownstreamRosterRow,
  buildDownstreamPublishedRosterView,
} from "@/lib/published-roster-view"
import type { RosterDraftViewModel } from "@/lib/roster-drafts"
import { cn } from "@/lib/utils"

type FormalRosterApiSnapshot = {
  status?: "published" | "missing"
  published?: {
    version_id?: string
  } | null
  cells?: DownstreamPublishedRosterCellInput[]
}

type ViewerMode = "month" | "week"

type SelectedPublishedCell = {
  row: DownstreamRosterRow
  cell: DownstreamRosterCell
}

const fixedTeamId = "G1"

export function PublishedRosterViewer({
  model,
  targetMonths,
}: {
  model: RosterDraftViewModel
  targetMonths: string[]
}) {
  const [role, setRole] = React.useState<DownstreamRosterRole>("team_lead")
  const [mode, setMode] = React.useState<ViewerMode>("month")
  const [selectedWeekId, setSelectedWeekId] = React.useState(
    model.weeks[0]?.weekId ?? "W1"
  )
  const [selectedEmployeeId, setSelectedEmployeeId] = React.useState(
    model.monthRows[0]?.employeeId ?? null
  )
  const [formalRoster, setFormalRoster] =
    React.useState<DownstreamPublishedRosterInput>({
      status: "missing",
      versionId: null,
      cells: [],
    })
  const [isLoading, setIsLoading] = React.useState(true)
  const [selectedCell, setSelectedCell] =
    React.useState<SelectedPublishedCell | null>(null)
  const [detailOpen, setDetailOpen] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false

    async function loadFormalRoster() {
      setIsLoading(true)
      const snapshot = await fetchFormalRoster(model)
      if (cancelled) {
        return
      }
      setFormalRoster(snapshot)
      setIsLoading(false)
    }

    void loadFormalRoster()

    return () => {
      cancelled = true
    }
  }, [model])

  const downstreamView = React.useMemo(
    () =>
      buildDownstreamPublishedRosterView({
        model,
        published: formalRoster,
        fixedTeamId,
        selectedEmployeeId,
      }),
    [formalRoster, model, selectedEmployeeId]
  )
  const activeRoleView =
    role === "team_lead" ? downstreamView.teamLead : downstreamView.frontline
  const selectedWeek =
    activeRoleView.weeks.find((week) => week.weekId === selectedWeekId) ??
    activeRoleView.weeks[0]
  const visibleRows = mode === "month" ? activeRoleView.monthRows : selectedWeek?.rows ?? []
  const visibleDays = mode === "month" ? downstreamView.monthDays : selectedWeek?.days ?? []

  function openCellDetail(row: DownstreamRosterRow, cell: DownstreamRosterCell) {
    setSelectedCell({ row, cell })
    setDetailOpen(true)
  }

  return (
    <section
      data-slot="published-roster-shell"
      className="flex min-h-0 flex-1 flex-col overflow-hidden"
    >
      <div
        data-slot="published-roster-toolbar"
        className="flex min-h-14 flex-wrap items-center gap-3 border-b bg-background px-4 py-2"
      >
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">
            {model.project.projectName} / {model.project.workplaceName}
          </div>
          <div className="text-xs text-muted-foreground">
            {role === "team_lead" ? "团队查看" : "我的班表"}
          </div>
        </div>
        <Select
          value={model.targetMonth}
          onValueChange={(month) => {
            window.location.href = `/published-roster?month=${encodeURIComponent(month)}`
          }}
        >
          <SelectTrigger className="h-9 w-[132px]" aria-label="月份">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {targetMonths.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Tabs
          value={role}
          onValueChange={(value) => setRole(value as DownstreamRosterRole)}
        >
          <TabsList aria-label="本地角色">
            <TabsTrigger value="team_lead">小组长</TabsTrigger>
            <TabsTrigger value="frontline">一线</TabsTrigger>
          </TabsList>
        </Tabs>
        {role === "frontline" ? (
          <Select
            value={selectedEmployeeId ?? ""}
            onValueChange={setSelectedEmployeeId}
          >
            <SelectTrigger className="h-9 w-[168px]" aria-label="人员">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {downstreamView.frontline.employeeOptions.map((employee) => (
                <SelectItem key={employee.employeeId} value={employee.employeeId}>
                  {employee.employeeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Badge variant="secondary">{downstreamView.teamLead.teamName}</Badge>
        )}
        <Tabs value={mode} onValueChange={(value) => setMode(value as ViewerMode)}>
          <TabsList>
            <TabsTrigger value="month">月视图</TabsTrigger>
            <TabsTrigger value="week">周视图</TabsTrigger>
          </TabsList>
        </Tabs>
        {mode === "week" ? (
          <Select value={selectedWeekId} onValueChange={setSelectedWeekId}>
            <SelectTrigger className="h-9 w-[116px]" aria-label="周">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {downstreamView.weeks.map((week) => (
                <SelectItem key={week.weekId} value={week.weekId}>
                  {week.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-0 border-b bg-background @3xl/main:grid-cols-4">
        <SummaryTile label="人员" value={activeRoleView.summary.staffCount} />
        <SummaryTile label="上班格" value={activeRoleView.summary.workCellCount} />
        <SummaryTile label="休息格" value={activeRoleView.summary.restCellCount} />
        <SummaryTile label="调整提示" value={activeRoleView.summary.manualCellCount} />
      </div>

      {isLoading ? (
        <PublishedRosterEmptyState
          title="正在读取正式班表"
          description="正在读取排班师发布后的正式版本。"
        />
      ) : downstreamView.status === "missing" ? (
        <PublishedRosterEmptyState
          title={downstreamView.emptyState.title || "暂无正式班表"}
          description={downstreamView.emptyState.description || "先由排班师发布正式班表。"}
        />
      ) : (
        <div
          data-slot="published-roster-grid-canvas"
          className="min-h-0 flex-1 overflow-auto p-4"
        >
          <RosterGrid
            days={visibleDays}
            rows={visibleRows}
            onOpenCell={openCellDetail}
          />
        </div>
      )}

      <div
        data-slot="published-roster-statusbar"
        className="flex min-h-10 items-center justify-between border-t bg-background px-4 text-xs text-muted-foreground"
      >
        <span>{downstreamView.versionLabel || "正式版待发布"}</span>
        <span>申请入口待开通</span>
      </div>

      <Drawer open={detailOpen} onOpenChange={setDetailOpen} direction="right">
        <DrawerContent className="inset-y-0 right-0 left-auto mt-0 h-dvh w-[min(420px,calc(100vw-24px))] rounded-none">
          <DrawerHeader>
            <DrawerTitle>只读详情</DrawerTitle>
            <DrawerDescription>
              仅展示正式班表内容，不能在这里编辑或发起流程。
            </DrawerDescription>
          </DrawerHeader>
          {selectedCell?.cell.detail ? (
            <PublishedRosterDetail cell={selectedCell.cell} />
          ) : (
            <div className="px-4 text-sm text-muted-foreground">当天暂无班次。</div>
          )}
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">关闭</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </section>
  )
}

function SummaryTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-r px-4 py-3 last:border-r-0">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-xl font-semibold tabular-nums">{value}</div>
    </div>
  )
}

function PublishedRosterEmptyState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center p-6">
      <div className="max-w-md rounded-lg border bg-background p-6 text-center shadow-sm">
        <div className="text-base font-medium">{title}</div>
        <div className="mt-2 text-sm text-muted-foreground">{description}</div>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/roster-drafts?month=2026-08">去发布正式班表</Link>
        </Button>
      </div>
    </div>
  )
}

function RosterGrid({
  days,
  rows,
  onOpenCell,
}: {
  days: DownstreamPublishedRosterCellDay[]
  rows: DownstreamRosterRow[]
  onOpenCell: (row: DownstreamRosterRow, cell: DownstreamRosterCell) => void
}) {
  return (
    <div className="min-w-max overflow-hidden rounded-lg border bg-background shadow-sm">
      <div
        className="grid border-b bg-muted/60"
        style={{ gridTemplateColumns: `168px repeat(${days.length}, minmax(76px, 1fr))` }}
      >
        <div className="sticky left-0 z-10 border-r bg-muted/90 px-3 py-2 text-xs font-medium">
          人员
        </div>
        {days.map((day) => (
          <div
            key={day.date}
            className="border-r px-2 py-2 text-center text-xs last:border-r-0"
          >
            <div className="font-medium">{day.dayOfMonth}</div>
            <div className="text-muted-foreground">周{day.weekdayLabel}</div>
          </div>
        ))}
      </div>
      {rows.map((row) => (
        <div
          key={row.employeeId}
          data-roster-person-row=""
          data-employee-id={row.employeeId}
          className="grid border-b last:border-b-0"
          style={{ gridTemplateColumns: `168px repeat(${days.length}, minmax(76px, 1fr))` }}
        >
          <div className="sticky left-0 z-10 border-r bg-background px-3 py-2">
            <div className="truncate text-sm font-medium">{row.employeeName}</div>
            <div className="truncate text-xs text-muted-foreground">{row.teamName}</div>
          </div>
          {row.cells.map((cell) => (
            <button
              key={`${row.employeeId}-${cell.date}`}
              data-roster-cell-date={cell.date}
              type="button"
              className={cn(
                "min-h-16 border-r px-2 py-2 text-left text-xs transition last:border-r-0 hover:bg-muted",
                cell.shiftCode ? "bg-background" : "bg-muted/30 text-muted-foreground"
              )}
              onClick={() => onOpenCell(row, cell)}
            >
              <div className="font-medium">{cell.shiftCode || "未排"}</div>
              <div className="mt-1 truncate text-muted-foreground">{cell.intervalLabel}</div>
              {cell.isManual ? (
                <Badge variant="outline" className="mt-1 h-5 px-1.5 text-[10px]">
                  已调整
                </Badge>
              ) : null}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}

type DownstreamPublishedRosterCellDay = {
  date: string
  dayOfMonth: number
  weekdayLabel: string
}

function PublishedRosterDetail({ cell }: { cell: DownstreamRosterCell }) {
  const detail = cell.detail

  if (!detail) {
    return null
  }

  return (
    <div className="flex flex-col gap-4 px-4">
      <div className="grid gap-3 rounded-lg border p-3 text-sm">
        <DetailRow label="人员" value={`${detail.employeeName} / ${detail.teamName}`} />
        <DetailRow label="日期" value={detail.date} />
        <DetailRow label="班次" value={detail.shiftCode} />
        <DetailRow label="时间" value={detail.intervalLabel} />
        <DetailRow label="来源版本" value={detail.sourceVersionLabel} />
        <DetailRow label="提示" value={detail.riskLabel} />
      </div>
      <Separator />
      <div>
        <div className="text-sm font-medium">后续动作</div>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {detail.requestActions.map((action) => (
            <Button
              key={action.key}
              disabled={action.disabled}
              variant="outline"
              className="h-9 px-2 text-xs"
              title="申请能力待开通"
            >
              {action.label}
            </Button>
          ))}
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          申请能力待开通，当前仅用于确认后续路径位置。
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate text-right font-medium">{value}</span>
    </div>
  )
}

async function fetchFormalRoster(
  model: RosterDraftViewModel
): Promise<DownstreamPublishedRosterInput> {
  const params = new URLSearchParams({
    business_month: model.targetMonth,
    project_id: model.project.projectId,
    workplace_id: model.project.workplaceName,
  })

  try {
    const response = await fetch(
      buildRosterApiUrl(`/api/v1/roster-drafts/current-published?${params.toString()}`),
      { cache: "no-store" }
    )
    if (!response.ok) {
      return missingFormalRoster()
    }
    return normalizeFormalRoster(await response.json())
  } catch {
    return missingFormalRoster()
  }
}

function normalizeFormalRoster(
  payload: FormalRosterApiSnapshot
): DownstreamPublishedRosterInput {
  if (payload.status !== "published") {
    return missingFormalRoster()
  }

  return {
    status: "published",
    versionId: payload.published?.version_id ?? null,
    cells: payload.cells ?? [],
  }
}

function missingFormalRoster(): DownstreamPublishedRosterInput {
  return {
    status: "missing",
    versionId: null,
    cells: [],
  }
}

function buildRosterApiUrl(path: string): string {
  const base =
    process.env.NEXT_PUBLIC_BPO_API_BASE_URL?.replace(/\/$/, "") ??
    "http://127.0.0.1:8000"
  return `${base}${path.startsWith("/") ? path : `/${path}`}`
}
