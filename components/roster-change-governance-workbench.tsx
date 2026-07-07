"use client"

import * as React from "react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import type { RosterDraftViewModel } from "@/lib/roster-drafts"
import { cn } from "@/lib/utils"

type RosterChangeVisibility = "scheduler" | "team_lead" | "frontline"
type ChangeTab = "pending" | "all" | "employees"

type RosterChangeCellSnapshot = {
  assignment_kind: string
  shift_code?: string | null
  annotation_code?: string | null
  interval_start_at?: string | null
  interval_end_at?: string | null
  manually_adjusted?: boolean
}

type RosterChangeLinkedIssue = {
  request_id: string
  action_type: string
  requester_role: string
  requester_id: string
  resolved_at?: string | null
  scheduler_resolution_note?: string | null
}

type RosterChangeConfirmation = {
  status: "pending" | "confirmed"
  confirmed_at?: string | null
  confirmed_by?: string | null
  internal_confirmation_note?: string | null
}

type RosterChangeEvent = {
  change_event_id: string
  employee_id: string
  employee_name: string
  business_date: string
  weekday?: string | null
  change_type: string
  source_category: string
  source_summary: string
  before: RosterChangeCellSnapshot
  after: RosterChangeCellSnapshot
  linked_issues: RosterChangeLinkedIssue[]
  confirmation: RosterChangeConfirmation
}

type RosterChangeEmployeeGroup = {
  employee_id: string
  employee_name: string
  pending_count: number
  confirmed_count: number
  events: string[]
}

type RosterChangeCenterResponse = {
  summary: {
    pending_count: number
    confirmed_count: number
    affected_employee_count: number
    linked_issue_count: number
  }
  change_events: RosterChangeEvent[]
  grouped_by_employee: RosterChangeEmployeeGroup[]
  selected_event?: RosterChangeEvent | null
}

const fixedTeamId = "G1"
const fixedWorkplaceId = "SHANGHAI"
const schedulerActorId = "scheduler-1"

export function RosterChangeGovernanceWorkbench({
  model,
  targetMonths,
  initialCellId,
  initialIssueId,
  initialVisibility,
  initialEmployeeId,
  initialRequesterId,
}: {
  model: RosterDraftViewModel
  targetMonths: string[]
  initialCellId: string | null
  initialIssueId: string | null
  initialVisibility: string
  initialEmployeeId: string | null
  initialRequesterId: string | null
}) {
  const [payload, setPayload] = React.useState<RosterChangeCenterResponse>(emptyChangeCenter())
  const [loading, setLoading] = React.useState(true)
  const [activeTab, setActiveTab] = React.useState<ChangeTab>("pending")
  const [selectedEventId, setSelectedEventId] = React.useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [internalNote, setInternalNote] = React.useState("")
  const [isConfirming, setIsConfirming] = React.useState(false)
  const [actionMessage, setActionMessage] = React.useState<string | null>(null)

  const visibility = normalizeVisibility(initialVisibility)

  const loadChangeCenter = React.useCallback(async () => {
    setLoading(true)
    const nextPayload = await fetchRosterChangeCenter({
      model,
      visibility,
      cellId: initialCellId,
      issueId: initialIssueId,
      employeeId: initialEmployeeId,
      requesterId: initialRequesterId,
    })
    setPayload(nextPayload)
    setSelectedEventId((current) => {
      if (current && nextPayload.change_events.some((event) => event.change_event_id === current)) {
        return current
      }
      return nextPayload.selected_event?.change_event_id ?? nextPayload.change_events[0]?.change_event_id ?? null
    })
    setLoading(false)
  }, [
    model,
    visibility,
    initialCellId,
    initialIssueId,
    initialEmployeeId,
    initialRequesterId,
  ])

  React.useEffect(() => {
    let cancelled = false
    fetchRosterChangeCenter({
      model,
      visibility,
      cellId: initialCellId,
      issueId: initialIssueId,
      employeeId: initialEmployeeId,
      requesterId: initialRequesterId,
    }).then((nextPayload) => {
      if (cancelled) {
        return
      }
      setPayload(nextPayload)
      setSelectedEventId(
        nextPayload.selected_event?.change_event_id ?? nextPayload.change_events[0]?.change_event_id ?? null
      )
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [
    model,
    visibility,
    initialCellId,
    initialIssueId,
    initialEmployeeId,
    initialRequesterId,
  ])

  const selectedEvent = selectedEventId
    ? payload.change_events.find((event) => event.change_event_id === selectedEventId) ?? null
    : null
  const pendingEvents = payload.change_events.filter(
    (event) => event.confirmation.status === "pending"
  )
  const listedEvents = activeTab === "pending" ? pendingEvents : payload.change_events

  async function handleConfirm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedEvent || !internalNote.trim()) {
      return
    }
    setIsConfirming(true)
    setActionMessage(null)
    const confirmed = await confirmRosterChangeEvent({
      model,
      eventId: selectedEvent.change_event_id,
      note: internalNote,
    })
    if (confirmed) {
      setInternalNote("")
      setActionMessage("已确认")
      await loadChangeCenter()
    } else {
      setActionMessage("确认失败")
    }
    setIsConfirming(false)
  }

  return (
    <section
      data-slot="roster-change-center-shell"
      className="flex min-h-0 flex-1 flex-col bg-background"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold">班表变更中心</div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>{model.project.projectName}</span>
            <span>{model.project.workplaceName}</span>
            <span>{fixedTeamId}</span>
            <span>{loading ? "读取中" : `${payload.summary.pending_count} 条待处理`}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={model.targetMonth}
            onValueChange={(month) => {
              window.location.href = `/roster-change-governance?month=${month}`
            }}
          >
            <SelectTrigger className="h-9 w-[128px]" aria-label="目标月份">
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
          <Button asChild variant="outline" size="sm">
            <Link href={`/published-roster?month=${model.targetMonth}`}>正式班表</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-3 border-b bg-muted/30 px-4 py-3 md:grid-cols-4">
        <Metric label="待处理" value={payload.summary.pending_count} />
        <Metric label="已确认" value={payload.summary.confirmed_count} />
        <Metric label="影响员工" value={payload.summary.affected_employee_count} />
        <Metric label="关联问题" value={payload.summary.linked_issue_count} />
      </div>

      <Tabs
        data-slot="roster-change-event-tabs"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as ChangeTab)}
        className="min-h-0 flex-1 gap-0"
      >
        <div className="flex items-center justify-between gap-3 border-b px-4 py-2">
          <TabsList>
            <TabsTrigger value="pending">待处理</TabsTrigger>
            <TabsTrigger value="all">全部变更</TabsTrigger>
            <TabsTrigger value="employees">按员工</TabsTrigger>
          </TabsList>
          <Badge variant="secondary">{payload.change_events.length}</Badge>
        </div>

        <TabsContent value="pending" className="min-h-0 overflow-auto p-4">
          <EventList
            events={listedEvents}
            selectedEventId={selectedEventId}
            emptyText="暂无待处理变更"
            onSelect={(eventId) => {
              setSelectedEventId(eventId)
              setDrawerOpen(true)
              setInternalNote("")
            }}
          />
        </TabsContent>
        <TabsContent value="all" className="min-h-0 overflow-auto p-4">
          <EventList
            events={listedEvents}
            selectedEventId={selectedEventId}
            emptyText="暂无班表变更"
            onSelect={(eventId) => {
              setSelectedEventId(eventId)
              setDrawerOpen(true)
              setInternalNote("")
            }}
          />
        </TabsContent>
        <TabsContent value="employees" className="min-h-0 overflow-auto p-4">
          <EmployeeGroups
            groups={payload.grouped_by_employee}
            events={payload.change_events}
            selectedEventId={selectedEventId}
            onSelect={(eventId) => {
              setSelectedEventId(eventId)
              setDrawerOpen(true)
              setInternalNote("")
            }}
          />
        </TabsContent>
      </Tabs>

      <Sheet open={drawerOpen && selectedEvent !== null} onOpenChange={setDrawerOpen}>
        <SheetContent
          data-slot="roster-change-detail-drawer"
          className="w-[92vw] sm:max-w-xl"
        >
          {selectedEvent ? (
            <>
              <SheetHeader>
                <SheetTitle>
                  {selectedEvent.employee_name} / {selectedEvent.business_date}
                </SheetTitle>
                <SheetDescription>
                  {selectedEvent.source_category} · {selectedEvent.source_summary}
                </SheetDescription>
              </SheetHeader>
              <div className="min-h-0 flex-1 overflow-auto px-4">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={selectedEvent.confirmation.status} />
                  <Badge variant="outline">{selectedEvent.weekday ?? "-"}</Badge>
                  <Badge variant="secondary">{selectedEvent.change_type}</Badge>
                </div>
                <Separator className="my-4" />
                <div className="grid gap-3 md:grid-cols-2">
                  <ChangeSnapshot title="修订前" snapshot={selectedEvent.before} />
                  <ChangeSnapshot title="修订后" snapshot={selectedEvent.after} />
                </div>
                <Separator className="my-4" />
                <div className="grid gap-2">
                  <div className="text-sm font-medium">关联问题</div>
                  {selectedEvent.linked_issues.length === 0 ? (
                    <EmptyBlock text="无关联问题" />
                  ) : (
                    selectedEvent.linked_issues.map((issue) => (
                      <IssueBlock key={issue.request_id} issue={issue} />
                    ))
                  )}
                </div>
                {selectedEvent.confirmation.status === "confirmed" ? (
                  <div className="mt-4 rounded-md border bg-muted/30 p-3">
                    <div className="text-sm font-medium">内部备注</div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {selectedEvent.confirmation.internal_confirmation_note ?? "-"}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {selectedEvent.confirmation.confirmed_by ?? "-"} ·{" "}
                      {selectedEvent.confirmation.confirmed_at ?? "-"}
                    </div>
                  </div>
                ) : null}
              </div>
              <SheetFooter>
                {selectedEvent.confirmation.status === "pending" ? (
                  <form className="grid gap-2" onSubmit={handleConfirm}>
                    <label className="text-sm font-medium" htmlFor="change-confirm-note">
                      内部备注
                    </label>
                    <textarea
                      id="change-confirm-note"
                      value={internalNote}
                      onChange={(event) => setInternalNote(event.target.value)}
                      className="min-h-24 w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                      placeholder="填写排班师内部确认说明"
                    />
                    {actionMessage ? (
                      <div className="text-xs text-muted-foreground">{actionMessage}</div>
                    ) : null}
                    <Button
                      type="submit"
                      disabled={isConfirming || !internalNote.trim()}
                    >
                      确认变更
                    </Button>
                  </form>
                ) : (
                  <Button type="button" variant="outline" onClick={() => setDrawerOpen(false)}>
                    关闭
                  </Button>
                )}
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </section>
  )
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border bg-card px-3 py-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-xl font-semibold tabular-nums">{value}</div>
    </div>
  )
}

function EventList({
  events,
  selectedEventId,
  emptyText,
  onSelect,
}: {
  events: RosterChangeEvent[]
  selectedEventId: string | null
  emptyText: string
  onSelect: (eventId: string) => void
}) {
  if (events.length === 0) {
    return <EmptyBlock text={emptyText} />
  }
  return (
    <div data-slot="roster-change-event-list" className="grid gap-2">
      {events.map((event) => (
        <EventRow
          key={event.change_event_id}
          event={event}
          selected={event.change_event_id === selectedEventId}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

function EmployeeGroups({
  groups,
  events,
  selectedEventId,
  onSelect,
}: {
  groups: RosterChangeEmployeeGroup[]
  events: RosterChangeEvent[]
  selectedEventId: string | null
  onSelect: (eventId: string) => void
}) {
  if (groups.length === 0) {
    return <EmptyBlock text="暂无员工变更" />
  }
  const eventById = new Map(events.map((event) => [event.change_event_id, event]))
  return (
    <div data-slot="roster-change-event-list" className="grid gap-3">
      {groups.map((group) => (
        <div key={group.employee_id} className="rounded-md border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2">
            <div className="text-sm font-medium">{group.employee_name}</div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{group.pending_count} 待处理</Badge>
              <Badge variant="outline">{group.confirmed_count} 已确认</Badge>
            </div>
          </div>
          <div className="grid gap-2 p-2">
            {group.events.map((eventId) => {
              const event = eventById.get(eventId)
              if (!event) {
                return null
              }
              return (
                <EventRow
                  key={event.change_event_id}
                  event={event}
                  selected={event.change_event_id === selectedEventId}
                  onSelect={onSelect}
                />
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

function EventRow({
  event,
  selected,
  onSelect,
}: {
  event: RosterChangeEvent
  selected: boolean
  onSelect: (eventId: string) => void
}) {
  return (
    <button
      type="button"
      className={cn(
        "grid gap-3 rounded-md border bg-card p-3 text-left transition-colors hover:bg-muted/50 md:grid-cols-[minmax(0,1fr)_180px]",
        selected && "border-primary"
      )}
      onClick={() => onSelect(event.change_event_id)}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">
            {event.employee_name} / {event.business_date}
          </span>
          <StatusBadge status={event.confirmation.status} />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{event.source_category}</span>
          <span>{event.source_summary}</span>
          <span>{event.linked_issues.length} 个关联问题</span>
        </div>
      </div>
      <div className="grid gap-1 text-xs text-muted-foreground">
        <span>修订前：{formatAssignment(event.before)}</span>
        <span>修订后：{formatAssignment(event.after)}</span>
      </div>
    </button>
  )
}

function ChangeSnapshot({
  title,
  snapshot,
}: {
  title: string
  snapshot: RosterChangeCellSnapshot
}) {
  return (
    <div className="rounded-md border bg-muted/30 p-3 text-sm">
      <div className="font-medium">{title}</div>
      <div className="mt-2 grid gap-1 text-xs text-muted-foreground">
        <div>类型：{snapshot.assignment_kind}</div>
        <div>班次：{snapshot.shift_code ?? snapshot.annotation_code ?? "-"}</div>
        <div>
          时间：{snapshot.interval_start_at ?? "-"} - {snapshot.interval_end_at ?? "-"}
        </div>
        <div>人工调整：{snapshot.manually_adjusted ? "是" : "否"}</div>
      </div>
    </div>
  )
}

function IssueBlock({ issue }: { issue: RosterChangeLinkedIssue }) {
  return (
    <div className="rounded-md border bg-card p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium">{issue.request_id}</span>
        <Badge variant="secondary">{issue.action_type}</Badge>
      </div>
      <div className="mt-2 grid gap-1 text-xs text-muted-foreground">
        <div>登记人：{issue.requester_role} / {issue.requester_id}</div>
        <div>关闭时间：{issue.resolved_at ?? "-"}</div>
        <div>处理说明：{issue.scheduler_resolution_note ?? "-"}</div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: RosterChangeConfirmation["status"] }) {
  return (
    <Badge variant={status === "pending" ? "default" : "outline"}>
      {status === "pending" ? "待处理" : "已确认"}
    </Badge>
  )
}

function EmptyBlock({ text }: { text: string }) {
  return (
    <div className="rounded-md border bg-muted/30 px-3 py-8 text-center text-sm text-muted-foreground">
      {text}
    </div>
  )
}

async function fetchRosterChangeCenter({
  model,
  visibility,
  cellId,
  issueId,
  employeeId,
  requesterId,
}: {
  model: RosterDraftViewModel
  visibility: RosterChangeVisibility
  cellId: string | null
  issueId: string | null
  employeeId: string | null
  requesterId: string | null
}): Promise<RosterChangeCenterResponse> {
  const params = new URLSearchParams({
    business_month: model.targetMonth,
    project_id: model.project.projectId,
    workplace_id: fixedWorkplaceId,
    team_id: fixedTeamId,
    visibility,
  })
  addOptionalParam(params, "cell_id", cellId)
  addOptionalParam(params, "issue_id", issueId)
  addOptionalParam(params, "employee_id", employeeId)
  addOptionalParam(params, "requester_id", requesterId)

  try {
    const response = await fetch(
      buildRosterApiUrl(`/api/v1/roster-change-governance?${params.toString()}`),
      { cache: "no-store" }
    )
    if (!response.ok) {
      return emptyChangeCenter()
    }
    return response.json()
  } catch {
    return emptyChangeCenter()
  }
}

async function confirmRosterChangeEvent({
  model,
  eventId,
  note,
}: {
  model: RosterDraftViewModel
  eventId: string
  note: string
}): Promise<RosterChangeEvent | null> {
  try {
    const response = await fetch(
      buildRosterApiUrl(
        `/api/v1/roster-change-governance/events/${encodeURIComponent(eventId)}/confirm`
      ),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          business_month: model.targetMonth,
          project_id: model.project.projectId,
          workplace_id: fixedWorkplaceId,
          team_id: fixedTeamId,
          actor_id: schedulerActorId,
          confirmed_at: new Date().toISOString(),
          internal_confirmation_note: note,
        }),
      }
    )
    if (!response.ok) {
      return null
    }
    return response.json()
  } catch {
    return null
  }
}

function addOptionalParam(params: URLSearchParams, key: string, value: string | null) {
  if (value) {
    params.set(key, value)
  }
}

function normalizeVisibility(value: string): RosterChangeVisibility {
  if (value === "frontline" || value === "team_lead") {
    return value
  }
  return "scheduler"
}

function emptyChangeCenter(): RosterChangeCenterResponse {
  return {
    summary: {
      pending_count: 0,
      confirmed_count: 0,
      affected_employee_count: 0,
      linked_issue_count: 0,
    },
    change_events: [],
    grouped_by_employee: [],
    selected_event: null,
  }
}

function formatAssignment(snapshot: RosterChangeCellSnapshot): string {
  const code = snapshot.shift_code ?? snapshot.annotation_code ?? snapshot.assignment_kind
  const start = snapshot.interval_start_at?.slice(11, 16)
  const end = snapshot.interval_end_at?.slice(11, 16)
  if (start && end) {
    return `${code} ${start}-${end}`
  }
  return code
}

function buildRosterApiUrl(path: string): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_BPO_API_BASE_URL?.replace(/\/$/, "") ??
    "http://127.0.0.1:8000"
  return `${baseUrl}${path}`
}
