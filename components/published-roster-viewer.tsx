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
  type DownstreamRosterCalendarDay,
  type DownstreamRosterCell,
  type DownstreamRosterRequestAction,
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

type PublishedRosterIssueIntent = {
  request_id: string
  business_month: string
  project_id?: string | null
  workplace_id?: string | null
  team_id?: string | null
  roster_version_id: string
  roster_cell_id: string
  employee_id: string
  business_date: string
  action_type: "leave" | "swap" | "exception_fix" | "site_adjustment"
  requester_role: "frontline" | "team_lead"
  requester_id: string
  note: string
  status: "open" | "resolved"
  created_at: string
  resolved_at?: string | null
  resolved_by?: string | null
  linked_revision_version_id?: string | null
  scheduler_resolution_note?: string | null
}

type PublishedRosterIssueSummary = {
  totals: Record<"open" | "resolved", number>
  by_cell: Record<string, { open?: number; resolved?: number; latest_created_at?: string }>
  by_action: Record<string, { open?: number; resolved?: number }>
  by_employee: Record<string, { open?: number; resolved?: number }>
}

const fixedTeamId = "G1"
const publishedIssueActionLabels: Record<PublishedRosterIssueIntent["action_type"], string> = {
  leave: "请假",
  swap: "换班",
  exception_fix: "异常修复",
  site_adjustment: "现场调配",
}

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
  const [issueStatusOpen, setIssueStatusOpen] = React.useState(false)
  const [issueIntents, setIssueIntents] = React.useState<PublishedRosterIssueIntent[]>([])
  const [issueSummary, setIssueSummary] =
    React.useState<PublishedRosterIssueSummary | null>(null)

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

  const refreshRosterIssues = React.useCallback(async () => {
    const [items, summary] = await Promise.all([
      fetchRosterIssueIntents(model, role, selectedEmployeeId),
      fetchRosterIssueSummary(model, role, selectedEmployeeId),
    ])
    setIssueIntents(items)
    setIssueSummary(summary)
  }, [model, role, selectedEmployeeId])

  React.useEffect(() => {
    let cancelled = false

    async function loadRosterIssues() {
      const [items, summary] = await Promise.all([
        fetchRosterIssueIntents(model, role, selectedEmployeeId),
        fetchRosterIssueSummary(model, role, selectedEmployeeId),
      ])
      if (cancelled) {
        return
      }
      setIssueIntents(items)
      setIssueSummary(summary)
    }

    void loadRosterIssues()

    return () => {
      cancelled = true
    }
  }, [model, role, selectedEmployeeId])

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
  const weekRows = selectedWeek?.rows ?? []
  const weekDays = selectedWeek?.days ?? []

  function openCellDetail(row: DownstreamRosterRow, cell: DownstreamRosterCell) {
    setSelectedCell({ row, cell })
    setDetailOpen(true)
  }

  function openWeekFromCalendar(day: DownstreamRosterCalendarDay) {
    if (!day.weekId) {
      return
    }

    setSelectedWeekId(day.weekId)
    setMode("week")
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
            <TabsTrigger value="month">月历概览</TabsTrigger>
            <TabsTrigger value="week">周明细</TabsTrigger>
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
        <Button
          type="button"
          variant="outline"
          className="h-9"
          onClick={() => setIssueStatusOpen(true)}
        >
          {role === "team_lead" ? "团队问题状态" : "我的问题状态"}
        </Button>
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
          {mode === "month" ? (
            <MonthCalendarOverview
              days={activeRoleView.monthCalendarDays}
              role={role}
              selectedWeekId={selectedWeek?.weekId ?? null}
              onSelectDay={openWeekFromCalendar}
            />
          ) : (
            <RosterGrid
              days={weekDays}
              rows={weekRows}
              onOpenCell={openCellDetail}
            />
          )}
        </div>
      )}

      <div
        data-slot="published-roster-statusbar"
        className="flex min-h-10 items-center justify-between border-t bg-background px-4 text-xs text-muted-foreground"
      >
        <span>{downstreamView.versionLabel || "正式版待发布"}</span>
        <span>{selectedWeek?.label ? `当前周：${selectedWeek.label}` : "申请入口待开通"}</span>
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
            <PublishedRosterDetail
              cell={selectedCell.cell}
              role={role}
              model={model}
              openIssueCount={getPublishedRosterOpenIssueCount(
                issueSummary,
                selectedCell.cell.detail.cellId
              )}
              onIssueCreated={refreshRosterIssues}
            />
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

      <IssueStatusDrawer
        open={issueStatusOpen}
        role={role}
        model={model}
        intents={issueIntents}
        summary={issueSummary}
        onOpenChange={setIssueStatusOpen}
      />
    </section>
  )
}

function MonthCalendarOverview({
  days,
  role,
  selectedWeekId,
  onSelectDay,
}: {
  days: DownstreamRosterCalendarDay[]
  role: DownstreamRosterRole
  selectedWeekId: string | null
  onSelectDay: (day: DownstreamRosterCalendarDay) => void
}) {
  return (
    <div
      data-slot="published-roster-month-calendar"
      className="overflow-hidden rounded-lg border bg-background shadow-sm"
    >
      <div
        data-slot="published-roster-month-calendar-weekdays"
        className="grid grid-cols-7 border-b bg-muted/60 text-center text-xs font-medium text-muted-foreground"
      >
        {["日", "一", "二", "三", "四", "五", "六"].map((weekday) => (
          <div
            key={weekday}
            data-slot="published-roster-month-calendar-weekday"
            className="border-r px-2 py-2 last:border-r-0"
          >
            周{weekday}
          </div>
        ))}
      </div>
      <div data-slot="published-roster-month-calendar-grid" className="grid grid-cols-7">
        {days.map((day) =>
          day.isPlaceholder ? (
            <div
              key={day.key}
              data-slot="published-roster-month-calendar-placeholder"
              className="min-h-28 border-r border-b bg-muted/20 last:border-r-0"
            />
          ) : (
            <button
              key={day.key}
              type="button"
              data-slot="published-roster-month-calendar-day"
              data-roster-calendar-date={day.date}
              className={cn(
                "flex min-h-28 flex-col border-r border-b p-2 text-left text-xs transition hover:bg-muted/70 last:border-r-0",
                day.weekId === selectedWeekId ? "bg-muted/60" : "bg-background"
              )}
              onClick={() => onSelectDay(day)}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-semibold tabular-nums">
                  {day.dayOfMonth}
                </span>
                {day.manualCellCount > 0 ? (
                  <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
                    调整
                  </Badge>
                ) : null}
              </div>
              <div className="mt-3 font-medium">{day.summaryLabel}</div>
              {role === "team_lead" ? (
                <div className="mt-2 flex flex-wrap gap-1">
                  {day.shiftCodes.slice(0, 3).map((shiftCode) => (
                    <Badge
                      key={shiftCode}
                      variant="secondary"
                      className="h-5 px-1.5 text-[10px]"
                    >
                      {shiftCode}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="mt-2 text-muted-foreground">
                  {day.primaryCell?.intervalLabel ?? "点击查看周明细"}
                </div>
              )}
              <div className="mt-auto pt-3 text-[11px] text-muted-foreground">
                {day.weekLabel}
              </div>
            </button>
          )
        )}
      </div>
    </div>
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

function PublishedRosterDetail({
  cell,
  role,
  model,
  openIssueCount,
  onIssueCreated,
}: {
  cell: DownstreamRosterCell
  role: DownstreamRosterRole
  model: RosterDraftViewModel
  openIssueCount: number
  onIssueCreated: () => Promise<void>
}) {
  const detail = cell.detail
  const [selectedActionKey, setSelectedActionKey] =
    React.useState<DownstreamRosterRequestAction["key"]>("leave")
  const [intentNote, setIntentNote] = React.useState("")
  const [intentMessage, setIntentMessage] = React.useState<string | null>(null)
  const [isCreatingIntent, setIsCreatingIntent] = React.useState(false)

  if (!detail) {
    return null
  }

  const selectedAction =
    detail.requestActions.find((action) => action.key === selectedActionKey) ??
    detail.requestActions[0]

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
      {openIssueCount > 0 ? (
        <div
          data-slot="published-roster-cell-open-issue-hint"
          className="rounded-md border bg-muted/60 px-3 py-2 text-sm text-foreground"
        >
          已有待处理问题 {openIssueCount} 条，可继续登记。
        </div>
      ) : null}
      <Separator />
      <div>
        <div className="text-sm font-medium">后续动作</div>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {detail.requestActions.map((action) => (
            <Button
              key={action.key}
              variant={selectedAction.key === action.key ? "default" : "outline"}
              className="h-9 px-2 text-xs"
              title="查看申请边界"
              onClick={() => setSelectedActionKey(action.key)}
            >
              {action.label}
            </Button>
          ))}
        </div>
        <RequestIntentPanel
          action={selectedAction}
          note={intentNote}
          message={intentMessage}
          isCreating={isCreatingIntent}
          onNoteChange={setIntentNote}
          onCreateIntent={async () => {
            setIsCreatingIntent(true)
            setIntentMessage(null)
            try {
              const response = await fetch(buildRosterApiUrl(selectedAction.intentEndpoint), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  request_id: `REQ-${Date.now()}`,
                  business_month: model.targetMonth,
                  project_id: model.project.projectId,
                  workplace_id: model.project.workplaceName,
                  team_id: "G1",
                  roster_cell_id: detail.cellId,
                  action_type: selectedAction.key,
                  requester_role: role,
                  requester_id: role === "frontline" ? detail.employeeId : "LEAD-G1",
                  note:
                    intentNote.trim() ||
                    `${selectedAction.label} / ${detail.employeeName} / ${detail.date}`,
                  occurred_at: currentLocalIsoMinute(),
                }),
              })
              const payload = await response.json().catch(() => null)
              if (!response.ok) {
                setIntentMessage(
                  payload?.error?.message ??
                    payload?.detail?.error?.message ??
                    "处理意图未登记"
                )
                return
              }
              setIntentMessage("已进入排班师本地处理队列")
              await onIssueCreated()
            } catch {
              setIntentMessage("处理队列服务暂时不可用")
            } finally {
              setIsCreatingIntent(false)
            }
          }}
        />
      </div>
    </div>
  )
}

function RequestIntentPanel({
  action,
  note,
  message,
  isCreating,
  onNoteChange,
  onCreateIntent,
}: {
  action: DownstreamRosterRequestAction
  note: string
  message: string | null
  isCreating: boolean
  onNoteChange: (note: string) => void
  onCreateIntent: () => void
}) {
  return (
    <div
      data-slot="published-roster-request-intent"
      data-request-action={action.key}
      className="mt-3 rounded-lg border bg-muted/30 p-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-medium">{action.boundaryTitle}</div>
          <div className="mt-1 text-xs text-muted-foreground">
            {action.boundaryDescription}
          </div>
        </div>
        <Badge variant="secondary" className="shrink-0">
          {action.ownerLabel}
        </Badge>
      </div>
      <div className="mt-3 text-xs text-muted-foreground">需要信息</div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {action.requiredFields.map((field) => (
          <Badge key={field} variant="outline" className="h-6 px-2 text-[11px]">
            {field}
          </Badge>
        ))}
      </div>
      <div className="mt-3 text-xs text-muted-foreground">
        本地队列记录处理意图；不进入审批、不通知、不做权限判断。
      </div>
      <textarea
        className="mt-3 min-h-20 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        value={note}
        onChange={(event) => onNoteChange(event.target.value)}
        placeholder="补充现场情况"
      />
      <div className="mt-3 flex items-center justify-between gap-3">
        <Button
          type="button"
          size="sm"
          onClick={onCreateIntent}
          disabled={isCreating}
        >
          登记处理意图
        </Button>
        {message ? (
          <span className="text-xs text-muted-foreground">{message}</span>
        ) : null}
      </div>
    </div>
  )
}

function IssueStatusDrawer({
  open,
  role,
  model,
  intents,
  summary,
  onOpenChange,
}: {
  open: boolean
  role: DownstreamRosterRole
  model: RosterDraftViewModel
  intents: PublishedRosterIssueIntent[]
  summary: PublishedRosterIssueSummary | null
  onOpenChange: (open: boolean) => void
}) {
  const openItems = intents.filter((intent) => intent.status === "open")
  const resolvedItems = intents.filter((intent) => intent.status === "resolved")
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent
        data-slot="published-roster-issue-status-drawer"
        className="inset-y-0 right-0 left-auto mt-0 h-dvh w-[min(460px,calc(100vw-24px))] rounded-none"
      >
        <DrawerHeader>
          <DrawerTitle>
            {role === "team_lead" ? "团队问题状态" : "我的问题状态"}
          </DrawerTitle>
          <DrawerDescription>
            open 与 resolved 本地问题状态；不进入审批流。
          </DrawerDescription>
        </DrawerHeader>
        <div className="min-h-0 flex-1 overflow-auto px-4">
          <div className="grid grid-cols-2 gap-2">
            <SummaryTile label="待处理" value={summary?.totals.open ?? openItems.length} />
            <SummaryTile
              label="已处理"
              value={summary?.totals.resolved ?? resolvedItems.length}
            />
          </div>
          <IssueStatusSection
            title="待处理"
            role={role}
            model={model}
            intents={openItems}
          />
          <IssueStatusSection
            title="已处理"
            role={role}
            model={model}
            intents={resolvedItems}
          />
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">关闭</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function IssueStatusSection({
  title,
  role,
  model,
  intents,
}: {
  title: string
  role: DownstreamRosterRole
  model: RosterDraftViewModel
  intents: PublishedRosterIssueIntent[]
}) {
  return (
    <div className="mt-4">
      <div className="mb-2 text-sm font-medium">{title}</div>
      <div className="grid gap-2">
        {intents.length === 0 ? (
          <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
            暂无{title}问题
          </div>
        ) : (
          intents.map((intent) => (
            <div key={intent.request_id} className="rounded-md border p-3 text-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate font-medium">
                    {intent.employee_id} / {intent.business_date}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {publishedIssueActionLabels[intent.action_type]} · {intent.requester_role}
                  </div>
                </div>
                <Badge variant={intent.status === "open" ? "default" : "secondary"}>
                  {intent.status === "open" ? "待处理" : "已处理"}
                </Badge>
              </div>
              <div className="mt-2">{intent.note}</div>
              {intent.status === "resolved" ? (
                <div className="mt-3 grid gap-1 text-xs text-muted-foreground">
                  <div>处理时间：{intent.resolved_at ?? "-"}</div>
                  <div>关联修订：{intent.linked_revision_version_id ?? "-"}</div>
                  <div>处理说明：{intent.scheduler_resolution_note ?? "-"}</div>
                  {intent.linked_revision_version_id ? (
                    <Button asChild variant="outline" size="sm" className="mt-2 w-fit">
                      <Link href={buildGovernanceHref(model, role, intent)}>
                        查看处理结果
                      </Link>
                    </Button>
                  ) : null}
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function buildGovernanceHref(
  model: RosterDraftViewModel,
  role: DownstreamRosterRole,
  intent: PublishedRosterIssueIntent
): string {
  const params = new URLSearchParams({
    month: model.targetMonth,
    revision_id: intent.linked_revision_version_id ?? "",
    cell_id: intent.roster_cell_id,
    issue_id: intent.request_id,
    visibility: role,
    employee_id: intent.employee_id,
    requester_id: intent.requester_id,
  })
  return `/roster-change-governance?${params.toString()}`
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
    team_id: fixedTeamId,
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

async function fetchRosterIssueIntents(
  model: RosterDraftViewModel,
  role: DownstreamRosterRole,
  selectedEmployeeId: string | null
): Promise<PublishedRosterIssueIntent[]> {
  const params = buildRosterIssueParams(model, role, selectedEmployeeId)
  try {
    const response = await fetch(
      buildRosterApiUrl(`/api/v1/roster-requests?${params.toString()}`),
      { cache: "no-store" }
    )
    if (!response.ok) {
      return []
    }
    const payload = await response.json()
    return Array.isArray(payload?.items) ? payload.items : []
  } catch {
    return []
  }
}

async function fetchRosterIssueSummary(
  model: RosterDraftViewModel,
  role: DownstreamRosterRole,
  selectedEmployeeId: string | null
): Promise<PublishedRosterIssueSummary | null> {
  const params = buildRosterIssueParams(model, role, selectedEmployeeId)
  try {
    const response = await fetch(
      buildRosterApiUrl(`/api/v1/roster-requests/summary?${params.toString()}`),
      { cache: "no-store" }
    )
    if (!response.ok) {
      return null
    }
    return response.json()
  } catch {
    return null
  }
}

function buildRosterIssueParams(
  model: RosterDraftViewModel,
  role: DownstreamRosterRole,
  selectedEmployeeId: string | null
) {
  const params = new URLSearchParams({
    business_month: model.targetMonth,
    project_id: model.project.projectId,
    workplace_id: model.project.workplaceName,
    team_id: fixedTeamId,
  })
  if (role === "frontline" && selectedEmployeeId) {
    params.set("employee_id", selectedEmployeeId)
  }
  return params
}

function getPublishedRosterOpenIssueCount(
  summary: PublishedRosterIssueSummary | null,
  rosterCellId: string
) {
  return summary?.by_cell?.[rosterCellId]?.open ?? 0
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

function currentLocalIsoMinute(): string {
  return new Date().toISOString().slice(0, 16)
}
