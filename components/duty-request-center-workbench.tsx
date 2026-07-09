"use client"

import * as React from "react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { RosterDraftViewModel } from "@/lib/roster-drafts"
import { cn } from "@/lib/utils"

type RoleView = "frontline" | "team_lead"
type StatusFilter = "all" | "pending" | "follow_up" | "adjusted" | "rejected" | "closed"
type RequestAction = "leave" | "swap" | "exception_fix" | "site_adjustment"
type RequestStatus = "open" | "in_progress" | "resolved"
type ResultType = "adjusted" | "rejected" | "closed"

type DutyRequestIntent = {
  request_id: string
  business_month: string
  project_id?: string | null
  workplace_id?: string | null
  team_id?: string | null
  roster_version_id: string
  roster_cell_id: string
  employee_id: string
  business_date: string
  action_type: RequestAction
  requester_role: RoleView
  requester_id: string
  note: string
  status: RequestStatus
  result_type?: ResultType | null
  created_at?: string | null
  resolved_at?: string | null
  resolved_by?: string | null
  scheduler_resolution_note?: string | null
}

type DutyRequestItem = {
  id: string
  employeeId: string
  employeeName: string
  teamName: string
  businessDate: string
  typeLabel: string
  statusLabel: string
  statusKey: StatusFilter
  statusTone: "default" | "secondary" | "outline" | "destructive"
  currentShift: string
  requestText: string
  resultText: string
  handlerText: string
  handledAtText: string
  rosterCellId: string
  requesterRole: RoleView
  updatedAtText: string
}

const fixedTeamId = "G1"
const defaultEmployeeId = "EMP-001"

const requestTypeLabels: Record<RequestAction, string> = {
  leave: "请假",
  swap: "换班",
  exception_fix: "异常修复",
  site_adjustment: "现场调配",
}

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "全部状态" },
  { value: "pending", label: "待处理" },
  { value: "follow_up", label: "跟进中" },
  { value: "adjusted", label: "已调整" },
  { value: "rejected", label: "已拒绝" },
  { value: "closed", label: "已关闭" },
]

export function DutyRequestCenterWorkbench({
  model,
  targetMonths,
}: {
  model: RosterDraftViewModel
  targetMonths: string[]
}) {
  const [role, setRole] = React.useState<RoleView>("frontline")
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all")
  const [query, setQuery] = React.useState("")
  const [items, setItems] = React.useState<DutyRequestItem[]>([])
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false

    async function loadRequests() {
      setLoading(true)
      const nextItems = await fetchDutyRequests(model, role)
      if (cancelled) {
        return
      }
      setItems(nextItems)
      setSelectedId((current) =>
        current && nextItems.some((item) => item.id === current)
          ? current
          : nextItems[0]?.id ?? null
      )
      setLoading(false)
    }

    void loadRequests()

    return () => {
      cancelled = true
    }
  }, [model, role])

  const filteredItems = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return items.filter((item) => {
      if (statusFilter !== "all" && item.statusKey !== statusFilter) {
        return false
      }
      if (!normalizedQuery) {
        return true
      }
      return [
        item.employeeName,
        item.employeeId,
        item.businessDate,
        item.typeLabel,
        item.requestText,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    })
  }, [items, query, statusFilter])

  const selectedItem =
    filteredItems.find((item) => item.id === selectedId) ??
    filteredItems[0] ??
    items.find((item) => item.id === selectedId) ??
    null

  return (
    <section
      data-slot="duty-request-center-shell"
      className="flex min-h-0 flex-1 flex-col bg-background"
    >
      <div
        data-slot="duty-request-center-toolbar"
        className="flex min-h-14 flex-wrap items-center gap-3 border-b px-4 py-2"
      >
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-sm font-semibold">班务申请</h1>
          <p className="text-xs text-muted-foreground">
            查看班务申请进度、处理说明和最终班表结果。
          </p>
        </div>
        <Select
          value={model.targetMonth}
          onValueChange={(month) => {
            window.location.href = `/duty-requests?month=${encodeURIComponent(month)}`
          }}
        >
          <SelectTrigger className="w-[124px]" aria-label="月份">
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
      </div>

      <div className="flex flex-wrap items-center gap-3 border-b bg-muted/30 px-4 py-3">
        <Tabs
          value={role}
          onValueChange={(value) => {
            setRole(value as RoleView)
            setSelectedId(null)
          }}
        >
          <TabsList>
            <TabsTrigger value="frontline">我的申请</TabsTrigger>
            <TabsTrigger value="team_lead">团队申请</TabsTrigger>
          </TabsList>
        </Tabs>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
          <SelectTrigger className="w-[140px]" aria-label="状态筛选">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜索员工 / 日期 / 申请内容"
          className="w-full sm:w-[260px]"
        />
      </div>

      <div
        data-slot="duty-request-center-layout"
        className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(360px,0.9fr)_minmax(520px,1.4fr)]"
      >
        <div
          data-slot="duty-request-center-list"
          className="min-h-0 overflow-auto border-b p-4 lg:border-r lg:border-b-0"
        >
          <RequestList
            loading={loading}
            items={filteredItems}
            selectedId={selectedItem?.id ?? null}
            onSelect={setSelectedId}
          />
        </div>
        <RequestDetail item={selectedItem} month={model.targetMonth} />
      </div>
    </section>
  )
}

function RequestList({
  loading,
  items,
  selectedId,
  onSelect,
}: {
  loading: boolean
  items: DutyRequestItem[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        暂无符合条件的班务申请。
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item.id)}
          className={cn(
            "rounded-lg border bg-card p-3 text-left transition-colors hover:bg-muted/50",
            selectedId === item.id && "border-primary bg-muted"
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">
                {formatShortDate(item.businessDate)} {item.typeLabel}
              </div>
              <div className="mt-1 truncate text-xs text-muted-foreground">
                {item.employeeName} · {item.currentShift}
              </div>
            </div>
            <Badge variant={item.statusTone}>{item.statusLabel}</Badge>
          </div>
          <div className="mt-2 line-clamp-2 text-xs text-muted-foreground">
            {item.requestText}
          </div>
        </button>
      ))}
    </div>
  )
}

function RequestDetail({
  item,
  month,
}: {
  item: DutyRequestItem | null
  month: string
}) {
  if (!item) {
    return (
      <div
        data-slot="duty-request-center-detail"
        className="min-h-0 overflow-auto p-4"
      >
        <Card>
          <CardHeader>
            <CardTitle>申请详情</CardTitle>
            <CardDescription>选择左侧申请后查看处理结果。</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div
      data-slot="duty-request-center-detail"
      className="min-h-0 overflow-auto p-4"
    >
      <Card className="h-full">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <CardTitle>{item.typeLabel}申请详情</CardTitle>
              <CardDescription>
                {item.employeeName} · {item.teamName} · {item.businessDate}
              </CardDescription>
            </div>
            <Badge variant={item.statusTone}>{item.statusLabel}</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <section className="grid gap-3 md:grid-cols-2">
            <DetailBlock title="原班表" value={item.currentShift} />
            <DetailBlock title="申请内容" value={item.requestText} />
          </section>

          <Separator />

          <section
            data-slot="duty-request-result-card"
            className="rounded-lg border bg-muted/30 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium">最终班表结果</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  员工可直接看懂申请是否落到月班表。
                </div>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href={buildRosterHref(month, item)}>查看月班表</Link>
              </Button>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <DetailBlock title="调整前" value={item.currentShift} />
              <DetailBlock title="调整后" value={item.resultText} />
              <DetailBlock title="处理人" value={item.handlerText} />
              <DetailBlock title="处理时间" value={item.handledAtText} />
            </div>
          </section>

          <section className="rounded-lg border p-4">
            <div className="text-sm font-medium">处理说明</div>
            <div className="mt-2 text-sm text-muted-foreground">
              {item.resultText === "待排班师处理"
                ? "排班师尚未处理，结果生成后会显示在这里。"
                : item.resultText === "排班师跟进中"
                  ? "排班师已接收申请，正在确认或调整月班表。"
                  : item.resultText}
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              申请编号：{item.id} · 最近更新：{item.updatedAtText}
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}

function DetailBlock({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-md border bg-background p-3">
      <div className="text-xs text-muted-foreground">{title}</div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  )
}

async function fetchDutyRequests(
  model: RosterDraftViewModel,
  role: RoleView
): Promise<DutyRequestItem[]> {
  const params = new URLSearchParams({
    business_month: model.targetMonth,
    project_id: model.project.projectId,
    workplace_id: model.project.workplaceName,
    team_id: fixedTeamId,
  })
  if (role === "frontline") {
    params.set("employee_id", defaultEmployeeId)
  }

  try {
    const response = await fetch(
      buildRosterApiUrl(`/api/v1/roster-requests?${params.toString()}`),
      { cache: "no-store" }
    )
    if (!response.ok) {
      return []
    }
    const payload = await response.json()
    const rawItems: DutyRequestIntent[] = Array.isArray(payload?.items)
      ? payload.items
      : []
    return rawItems.map((item) => mapDutyRequest(item, model))
  } catch {
    return []
  }
}

function mapDutyRequest(
  item: DutyRequestIntent,
  model: RosterDraftViewModel
): DutyRequestItem {
  const employee = model.monthRows.find((row) => row.employeeId === item.employee_id)
  const cell = employee?.cells.find((entry) => entry.date === item.business_date)
  const status = mapRequestStatus(item)

  return {
    id: item.request_id,
    employeeId: item.employee_id,
    employeeName: employee?.employeeName ?? item.employee_id,
    teamName: employee?.teamName ?? item.team_id ?? "-",
    businessDate: item.business_date,
    typeLabel: requestTypeLabels[item.action_type],
    statusLabel: status.label,
    statusKey: status.key,
    statusTone: status.tone,
    currentShift: formatShift(cell?.shiftCode, cell?.reason),
    requestText: item.note || `${requestTypeLabels[item.action_type]}申请`,
    resultText: buildResultText(item),
    handlerText: item.resolved_by || "-",
    handledAtText: formatDateTime(item.resolved_at),
    rosterCellId: item.roster_cell_id,
    requesterRole: item.requester_role,
    updatedAtText: formatDateTime(item.resolved_at ?? item.created_at),
  }
}

function mapRequestStatus(item: DutyRequestIntent): {
  key: StatusFilter
  label: string
  tone: DutyRequestItem["statusTone"]
} {
  if (item.status === "open") {
    return { key: "pending", label: "待处理", tone: "outline" }
  }
  if (item.status === "in_progress") {
    return { key: "follow_up", label: "跟进中", tone: "secondary" }
  }
  if (item.result_type === "rejected") {
    return { key: "rejected", label: "已拒绝", tone: "destructive" }
  }
  if (item.result_type === "closed") {
    return { key: "closed", label: "已关闭", tone: "outline" }
  }
  return { key: "adjusted", label: "已调整", tone: "default" }
}

function buildResultText(item: DutyRequestIntent) {
  if (item.status === "open") {
    return "待排班师处理"
  }
  if (item.status === "in_progress") {
    return "排班师跟进中"
  }
  if (item.scheduler_resolution_note) {
    return item.scheduler_resolution_note
  }
  if (item.result_type === "rejected") {
    return "申请未通过，班表未变更。"
  }
  if (item.result_type === "closed") {
    return "申请已关闭，无需继续处理。"
  }
  return "已调整到正式月班表。"
}

function formatShift(shiftCode?: string, fallback?: string) {
  if (!shiftCode) {
    return fallback ?? "-"
  }
  if (shiftCode === "REST") {
    return "休息"
  }
  return shiftCode
}

function formatShortDate(date: string) {
  const [, month, day] = date.split("-")
  return month && day ? `${Number(month)}/${Number(day)}` : date
}

function formatDateTime(value?: string | null) {
  if (!value) {
    return "-"
  }
  return value.replace("T", " ")
}

function buildRosterHref(month: string, item: DutyRequestItem) {
  const params = new URLSearchParams({
    month,
    cell_id: item.rosterCellId,
    employee_id: item.employeeId,
    visibility: item.requesterRole,
  })
  return `/published-roster?${params.toString()}`
}

function buildRosterApiUrl(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BPO_API_BASE_URL
  if (!baseUrl) {
    return path
  }
  return `${baseUrl.replace(/\/$/, "")}${path}`
}
