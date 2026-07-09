"use client"

import * as React from "react"

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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import type { RosterDraftViewModel } from "@/lib/roster-drafts"
import { cn } from "@/lib/utils"

type RequestStage = "pending" | "follow_up" | "processed"
type RequestType = "请假" | "换班" | "异常修复" | "现场调配"
type RequestTab = RequestStage | "employee"
type RequestStatus = "open" | "in_progress" | "resolved"
type RequestResultType = "adjusted" | "rejected" | "closed"

type DutyChangeRequest = {
  id: string
  rosterVersionId: string
  rosterCellId: string
  marker: string
  type: RequestType
  employeeName: string
  employeeId: string
  teamId: string
  businessDate: string
  businessDateRaw: string
  requesterRole: string
  currentShift: string
  currentShiftCode: string
  requestText: string
  reason: string
  note: string
  stage: RequestStage
  currentState: string
  nextStep: string
  result: string
  rosterResult: string
  linkedRevisionVersionId: string | null
  resultType: RequestResultType | null
  rawStatus: RequestStatus
}

type RosterRequestIntent = {
  request_id: string
  roster_version_id: string
  roster_cell_id: string
  employee_id: string
  business_date: string
  action_type: "leave" | "swap" | "exception_fix" | "site_adjustment"
  requester_role: "frontline" | "team_lead"
  requester_id: string
  note: string
  status: RequestStatus
  result_type?: RequestResultType | null
  linked_revision_version_id?: string | null
  scheduler_resolution_note?: string | null
}

type PublishedRosterCell = {
  cell_id: string
  assignment_id?: string | null
  employee_id?: string | null
  business_date?: string | null
  sequence?: number | null
  assignment_kind?: string | null
  project_id?: string | null
  workplace_id?: string | null
  team_id?: string | null
  shift_code?: string | null
  annotation_code?: string | null
  interval_start_at?: string | null
  interval_end_at?: string | null
  sourceCellId?: string | null
  manually_adjusted?: boolean | null
}

type RosterVersionSummary = {
  version_id: string
  business_month: string
  status: string
  project_id?: string | null
  workplace_id?: string | null
  team_id?: string | null
}

type RosterRevisionDraft = {
  status?: string
  version?: RosterVersionSummary | null
  cells?: PublishedRosterCell[]
}

type ShiftOption = {
  value: string
  label: string
  intervalLabel?: string | null
}

type RosterRevisionCellSource = {
  cellId: string
  sourceCellId?: string | null
}

type RequestActionResult = {
  updated: DutyChangeRequest
  nextRequests: DutyChangeRequest[]
}

const rosterPublishActorId = "scheduler-1"
const rosterTeamId = "G1"

const requestTypeLabels: Record<RosterRequestIntent["action_type"], RequestType> = {
  leave: "请假",
  swap: "换班",
  exception_fix: "异常修复",
  site_adjustment: "现场调配",
}

const requestTextLabels: Record<RosterRequestIntent["action_type"], string> = {
  leave: "申请调整休假",
  swap: "申请换班",
  exception_fix: "申请修复异常班务",
  site_adjustment: "申请现场调配",
}

const resultLabels: Record<RequestResultType, string> = {
  adjusted: "已调整",
  rejected: "已拒绝",
  closed: "已关闭",
}

export function RosterChangeGovernanceWorkbench({
  model,
  targetMonths,
}: {
  model: RosterDraftViewModel
  targetMonths: string[]
  initialCellId: string | null
  initialIssueId: string | null
  initialVisibility: string
  initialEmployeeId: string | null
  initialRequesterId: string | null
}) {
  const [requests, setRequests] = React.useState<DutyChangeRequest[]>([])
  const [activeTab, setActiveTab] = React.useState<RequestTab>("pending")
  const [selectedRequestId, setSelectedRequestId] = React.useState<string | null>(null)
  const [adjusting, setAdjusting] = React.useState(false)
  const [targetShiftCode, setTargetShiftCode] = React.useState("REST")
  const [draftNote, setDraftNote] = React.useState("")
  const [loading, setLoading] = React.useState(true)
  const [message, setMessage] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    void fetchDutyChangeRequests(model).then((nextRequests) => {
      if (cancelled) {
        return
      }
      setRequests(nextRequests)
      const firstRequest =
        nextRequests.find((request) => request.stage === "pending") ?? nextRequests[0] ?? null
      setSelectedRequestId(firstRequest?.id ?? null)
      setDraftNote(firstRequest?.note ?? "")
      setTargetShiftCode(defaultTargetShiftCode(firstRequest?.currentShiftCode ?? "REST"))
      setAdjusting(
        firstRequest?.stage === "follow_up" && firstRequest.nextStep === "去调整班表"
      )
      setActiveTab(firstRequest?.stage ?? "pending")
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [model])

  const selectedRequest = selectedRequestId
    ? requests.find((request) => request.id === selectedRequestId) ?? null
    : null
  const pending = requests.filter((request) => request.stage === "pending")
  const followUp = requests.filter((request) => request.stage === "follow_up")
  const processed = requests.filter((request) => request.stage === "processed")
  const shiftOptions = React.useMemo(
    () => buildShiftOptions(model, selectedRequest),
    [model, selectedRequest]
  )

  function openRequest(requestId: string) {
    const request = requests.find((item) => item.id === requestId) ?? null
    setSelectedRequestId(requestId)
    setDraftNote(request?.note ?? "")
    setTargetShiftCode(defaultTargetShiftCode(request?.currentShiftCode ?? "REST"))
    setAdjusting(request?.stage === "follow_up" && request.nextStep === "去调整班表")
  }

  async function applyRequestAction(
    requestId: string,
    path: string,
    payload: Record<string, string>
  ): Promise<RequestActionResult | null> {
    setMessage(null)
    const response = await fetch(buildRosterApiUrl(path), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      setMessage("处理失败，请刷新后重试。")
      return null
    }
    const updated = mapRosterRequestIntent(await response.json(), model)
    const nextRequests = requests.map((request) =>
      request.id === requestId ? updated : request
    )
    setRequests(nextRequests)
    setSelectedRequestId(requestId)
    return { updated, nextRequests }
  }

  async function agreeRequest() {
    if (!selectedRequest) {
      return
    }
    const updated = await applyRequestAction(
      selectedRequest.id,
      `/api/v1/roster-requests/${encodeURIComponent(selectedRequest.id)}/follow-up`,
      {
        actor_id: rosterPublishActorId,
        occurred_at: currentLocalIsoMinute(),
        scheduler_resolution_note: draftNote || "同意，进入月班表调整。",
      }
    )
    if (!updated) {
      return
    }
    setActiveTab("follow_up")
    setAdjusting(true)
  }

  async function rejectRequest() {
    if (!selectedRequest) {
      return
    }
    const updated = await applyRequestAction(
      selectedRequest.id,
      `/api/v1/roster-requests/${encodeURIComponent(selectedRequest.id)}/close`,
      {
        actor_id: rosterPublishActorId,
        resolved_at: currentLocalIsoMinute(),
        result_type: "rejected",
        scheduler_resolution_note: draftNote || "申请未通过，班表未变更。",
      }
    )
    if (!updated) {
      return
    }
    setActiveTab("processed")
    setAdjusting(false)
    selectNextPendingRequest(selectedRequest.id, updated.nextRequests)
  }

  async function followRequest() {
    if (!selectedRequest) {
      return
    }
    const updated = await applyRequestAction(
      selectedRequest.id,
      `/api/v1/roster-requests/${encodeURIComponent(selectedRequest.id)}/follow-up`,
      {
        actor_id: rosterPublishActorId,
        occurred_at: currentLocalIsoMinute(),
        scheduler_resolution_note: draftNote || "需要继续跟进现场确认。",
      }
    )
    if (!updated) {
      return
    }
    setActiveTab("follow_up")
    setAdjusting(false)
  }

  async function saveAdjustment() {
    if (!selectedRequest) {
      return
    }
    const linkedRevisionVersionId = await createAndPublishCurrentCellAdjustment({
      model,
      request: selectedRequest,
      targetShiftCode,
    })
    if (!linkedRevisionVersionId) {
      setMessage("班表修订未保存，申请仍保留在跟进中。")
      return
    }
    const updated = await applyRequestAction(
      selectedRequest.id,
      `/api/v1/roster-requests/${encodeURIComponent(selectedRequest.id)}/resolve`,
      {
        resolver_id: rosterPublishActorId,
        resolved_at: currentLocalIsoMinute(),
        linked_revision_version_id: linkedRevisionVersionId,
        scheduler_resolution_note: draftNote || `${selectedRequest.reason}，已调整班表。`,
      }
    )
    if (!updated) {
      return
    }
    setActiveTab("processed")
    setAdjusting(false)
    selectNextPendingRequest(selectedRequest.id, updated.nextRequests)
  }

  function selectNextPendingRequest(
    completedRequestId: string,
    sourceRequests = requests
  ) {
    const nextPending =
      sourceRequests.find(
        (request) => request.stage === "pending" && request.id !== completedRequestId
      ) ?? null
    if (nextPending) {
      setSelectedRequestId(nextPending.id)
      setDraftNote(nextPending.note)
      setTargetShiftCode(defaultTargetShiftCode(nextPending.currentShiftCode))
      setActiveTab("pending")
      return
    }
    setSelectedRequestId(completedRequestId)
    setActiveTab("processed")
  }

  return (
    <section
      data-slot="duty-change-request-shell"
      className="flex min-h-0 flex-1 flex-col bg-background"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
        <div className="min-w-0">
          <h1 className="text-sm font-semibold">待办</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            处理班长和一线提交的班务申请，优先跟进请假、换班、异常修复和现场调配。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{model.project.projectName}</span>
          <span>{model.project.workplaceName}</span>
          <select
            className="h-8 rounded-md border bg-background px-2 text-xs"
            value={model.targetMonth}
            aria-label="目标月份"
            onChange={(event) => {
              window.location.href = `/roster-change-governance?month=${event.target.value}`
            }}
          >
            {targetMonths.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-3 border-b bg-muted/30 px-4 py-3 md:grid-cols-4">
        <Metric label="待处理" value={pending.length} />
        <Metric label="跟进中" value={followUp.length} />
        <Metric label="已处理" value={processed.length} />
        <Metric label="本月申请" value={requests.length} />
      </div>

      {message ? (
        <div className="border-b bg-destructive/10 px-4 py-2 text-xs text-destructive">
          {message}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2 border-b px-4 py-3 text-xs">
        <FilterLabel text="全部类型" />
        <FilterLabel text="全部班组" />
        <div className="min-w-[220px] rounded-md border bg-muted/30 px-3 py-2 text-muted-foreground">
          搜索员工 / 日期 / 申请内容
        </div>
      </div>

      <div
        data-slot="duty-change-adjustment-layout"
        className="grid min-h-0 flex-1 grid-cols-1 gap-0 lg:grid-cols-[minmax(360px,0.9fr)_minmax(420px,1.2fr)] xl:grid-cols-[minmax(340px,0.85fr)_minmax(440px,1.1fr)_minmax(300px,0.8fr)]"
      >
        <div
          data-slot="duty-change-request-queue"
          className="min-h-0 border-b lg:border-b-0 lg:border-r"
        >
          <Tabs
            data-slot="duty-change-request-tabs"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as RequestTab)}
            className="min-h-0 flex-1 flex-col gap-0"
          >
            <div className="border-b px-4 py-2">
              <TabsList>
                <TabsTrigger value="pending">待处理</TabsTrigger>
                <TabsTrigger value="follow_up">跟进中</TabsTrigger>
                <TabsTrigger value="processed">已处理</TabsTrigger>
                <TabsTrigger value="employee">按员工</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="pending" className="min-h-0 overflow-auto p-4">
              {loading ? (
                <EmptyBlock text="正在读取申请" />
              ) : (
                <RequestList
                  requests={pending}
                  mode="pending"
                  selectedRequestId={selectedRequestId}
                  onSelect={openRequest}
                />
              )}
            </TabsContent>
            <TabsContent value="follow_up" className="min-h-0 overflow-auto p-4">
              <RequestList
                requests={followUp}
                mode="follow_up"
                selectedRequestId={selectedRequestId}
                onSelect={openRequest}
              />
            </TabsContent>
            <TabsContent value="processed" className="min-h-0 overflow-auto p-4">
              <RequestList
                requests={processed}
                mode="processed"
                selectedRequestId={selectedRequestId}
                onSelect={openRequest}
              />
            </TabsContent>
            <TabsContent value="employee" className="min-h-0 overflow-auto p-4">
              <EmployeeGroups
                requests={requests}
                selectedRequestId={selectedRequestId}
                onSelect={openRequest}
              />
            </TabsContent>
          </Tabs>
        </div>

        <CurrentCellAdjustmentPanel
          request={selectedRequest}
          model={model}
          shiftOptions={shiftOptions}
          targetShiftCode={targetShiftCode}
          onTargetShiftCodeChange={setTargetShiftCode}
        />

        <HandlingPanel
          request={selectedRequest}
          note={draftNote}
          adjusting={adjusting}
          onNoteChange={setDraftNote}
          onAgree={agreeRequest}
          onReject={rejectRequest}
          onFollow={followRequest}
          onSave={saveAdjustment}
          onStartAdjust={() => setAdjusting(true)}
          onBack={() => setAdjusting(false)}
          onNext={() => selectedRequest && selectNextPendingRequest(selectedRequest.id)}
        />
      </div>
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

function FilterLabel({ text }: { text: string }) {
  return <div className="rounded-md border bg-background px-3 py-2 text-muted-foreground">{text} v</div>
}

function RequestList({
  requests,
  mode,
  selectedRequestId,
  onSelect,
}: {
  requests: DutyChangeRequest[]
  mode: RequestStage
  selectedRequestId: string | null
  onSelect: (requestId: string) => void
}) {
  if (requests.length === 0) {
    const emptyText =
      mode === "pending"
        ? "暂无待处理申请"
        : mode === "follow_up"
          ? "暂无需要继续跟进的申请"
          : "暂无已处理申请"
    return <EmptyBlock text={emptyText} />
  }
  return (
    <div data-slot="duty-change-request-list" className="grid gap-2">
      <RequestHeader mode={mode} />
      {requests.map((request) => (
        <RequestRow
          key={request.id}
          request={request}
          mode={mode}
          selected={request.id === selectedRequestId}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

function RequestHeader({ mode }: { mode: RequestStage }) {
  if (mode === "processed") {
    return (
      <div className="grid grid-cols-[96px_96px_1fr_96px_160px_160px] gap-3 px-3 text-xs text-muted-foreground">
        <span>类型</span>
        <span>员工</span>
        <span>日期</span>
        <span>处理结果</span>
        <span>班表结果</span>
      </div>
    )
  }
  if (mode === "follow_up") {
    return (
      <div className="grid grid-cols-[96px_96px_96px_1fr_128px_160px] gap-3 px-3 text-xs text-muted-foreground">
        <span>提示</span>
        <span>类型</span>
        <span>员工</span>
        <span>日期</span>
        <span>当前状态</span>
        <span>下一步</span>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-[96px_96px_96px_1fr_160px_160px] gap-3 px-3 text-xs text-muted-foreground">
      <span>提示</span>
      <span>类型</span>
      <span>员工</span>
      <span>日期</span>
      <span>当前班次</span>
      <span>申请内容</span>
    </div>
  )
}

function RequestRow({
  request,
  mode,
  selected,
  onSelect,
}: {
  request: DutyChangeRequest
  mode: RequestStage
  selected: boolean
  onSelect: (requestId: string) => void
}) {
  const columns =
    mode === "processed"
      ? [request.type, request.employeeName, request.businessDate, request.result, request.rosterResult]
      : mode === "follow_up"
        ? [request.marker, request.type, request.employeeName, request.businessDate, request.currentState, request.nextStep]
        : [
            request.marker,
            request.type,
            request.employeeName,
            request.businessDate,
            request.currentShift,
            request.requestText,
          ]
  const grid =
    mode === "processed"
      ? "grid-cols-[96px_96px_1fr_96px_160px_160px]"
      : "grid-cols-[96px_96px_96px_1fr_160px_160px]"
  return (
    <button
      type="button"
      className={cn(
        "grid gap-3 rounded-md border bg-card p-3 text-left text-sm transition-colors hover:bg-muted/50",
        grid,
        selected && "border-primary"
      )}
      onClick={() => onSelect(request.id)}
    >
      {columns.map((column, index) => (
        <span key={`${request.id}-${index}`} className="min-w-0 truncate">
          {column || "-"}
        </span>
      ))}
    </button>
  )
}

function EmployeeGroups({
  requests,
  selectedRequestId,
  onSelect,
}: {
  requests: DutyChangeRequest[]
  selectedRequestId: string | null
  onSelect: (requestId: string) => void
}) {
  const groups = new Map<string, DutyChangeRequest[]>()
  for (const request of requests) {
    const current = groups.get(request.employeeName) ?? []
    current.push(request)
    groups.set(request.employeeName, current)
  }
  return (
    <div data-slot="duty-change-request-list" className="grid gap-3">
      {Array.from(groups.entries()).map(([employeeName, employeeRequests]) => (
        <div key={employeeName} className="rounded-md border bg-card">
          <div className="flex items-center justify-between border-b px-3 py-2">
            <div className="text-sm font-medium">{employeeName}</div>
            <Badge variant="secondary">{employeeRequests.length} 条申请</Badge>
          </div>
          <div className="grid gap-2 p-2">
            {employeeRequests.map((request) => (
              <RequestRow
                key={request.id}
                request={request}
                mode={request.stage}
                selected={request.id === selectedRequestId}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function CurrentCellAdjustmentPanel({
  request,
  model,
  shiftOptions,
  targetShiftCode,
  onTargetShiftCodeChange,
}: {
  request: DutyChangeRequest | null
  model: RosterDraftViewModel
  shiftOptions: ShiftOption[]
  targetShiftCode: string
  onTargetShiftCodeChange: (value: string) => void
}) {
  if (!request) {
    return (
      <div
        data-slot="duty-change-current-cell-adjustment"
        className="min-h-0 border-b p-4 lg:border-b-0 xl:border-r"
      >
        <EmptyBlock text="请选择一条申请" />
      </div>
    )
  }
  const row = model.monthRows.find((item) => item.employeeId === request.employeeId)
  const days = buildAdjustmentWindow(model.monthDays, request.businessDateRaw)
  return (
    <div
      data-slot="duty-change-current-cell-adjustment"
      className="min-h-0 overflow-auto border-b p-4 lg:border-b-0 xl:border-r"
    >
      <div className="grid gap-4">
        <div>
          <div className="text-sm font-semibold">当前格调整</div>
          <div className="mt-1 text-xs text-muted-foreground">
            {request.employeeName} / {request.businessDate} / {request.type}
          </div>
        </div>

        <div className="overflow-hidden rounded-md border">
          <div
            className="grid bg-muted/40 text-xs text-muted-foreground"
            style={{ gridTemplateColumns: `112px repeat(${days.length}, minmax(72px, 1fr))` }}
          >
            <div className="px-3 py-2">员工</div>
            {days.map((day) => (
              <div key={day.date} className="px-3 py-2">
                {day.dayOfMonth}日
              </div>
            ))}
          </div>
          <div
            className="grid text-sm"
            style={{ gridTemplateColumns: `112px repeat(${days.length}, minmax(72px, 1fr))` }}
          >
            <div className="border-t px-3 py-3 font-medium">{request.employeeName}</div>
            {days.map((day) => {
              const cell = row?.cells.find((item) => item.date === day.date)
              const active = day.date === request.businessDateRaw
              return (
                <div
                  key={day.date}
                  className={cn(
                    "min-h-16 border-t px-3 py-2",
                    active && "border-primary bg-primary/5 text-primary"
                  )}
                >
                  <div className="font-medium">
                    {active ? request.currentShift : formatShiftCodeLabel(cell?.shiftCode)}
                  </div>
                  {active ? <div className="mt-1 text-xs">当前申请</div> : null}
                </div>
              )
            })}
          </div>
        </div>

        <Section title="来自申请">
          <div>{request.requestText}</div>
          <div className="mt-1 text-xs text-muted-foreground">原因：{request.reason}</div>
        </Section>
        <Section title="当前班次">{request.currentShift}</Section>
        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="target-shift-code">
            调整为
          </label>
          <Select value={targetShiftCode} onValueChange={onTargetShiftCodeChange}>
            <SelectTrigger id="target-shift-code" className="w-full">
              <SelectValue placeholder="选择班次" />
            </SelectTrigger>
            <SelectContent>
              {shiftOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
          <div className="font-medium text-foreground">轻量影响提示</div>
          <div className="mt-1">只调整当前员工/日期格：{request.employeeName} {request.businessDate}</div>
          <div className="mt-1">
            {request.currentShift} -&gt; {formatShiftCodeLabel(targetShiftCode)}
          </div>
        </div>
      </div>
    </div>
  )
}

function HandlingPanel({
  request,
  note,
  adjusting,
  onNoteChange,
  onAgree,
  onReject,
  onFollow,
  onSave,
  onStartAdjust,
  onBack,
  onNext,
}: {
  request: DutyChangeRequest | null
  note: string
  adjusting: boolean
  onNoteChange: (value: string) => void
  onAgree: () => void
  onReject: () => void
  onFollow: () => void
  onSave: () => void
  onStartAdjust: () => void
  onBack: () => void
  onNext: () => void
}) {
  return (
    <aside
      data-slot="duty-change-handling-panel"
      className="min-h-0 overflow-auto p-4"
    >
      {request ? (
        <div className="grid gap-4">
          <div>
            <div className="text-sm font-semibold">处理</div>
            <div className="mt-1 text-xs text-muted-foreground">
              {request.currentState} · {request.requesterRole} · {request.teamId}
            </div>
          </div>
          <Section title="提示">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{request.marker}</Badge>
              <Badge variant="outline">影响 {request.businessDate} 班次</Badge>
            </div>
          </Section>
          {request.stage === "follow_up" ? (
            <Section title="下一步">{request.nextStep}</Section>
          ) : null}
          {request.stage === "processed" ? (
            <>
              <Section title="处理结果">{request.result}</Section>
              <Section title="班表结果">{request.rosterResult}</Section>
            </>
          ) : null}
      <div className="grid gap-2">
        <label className="text-sm font-medium" htmlFor="request-note">
          处理说明
        </label>
        <textarea
          id="request-note"
          value={note}
          onChange={(event) => onNoteChange(event.target.value)}
          className="min-h-24 w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          placeholder="输入排班师处理说明"
        />
      </div>
          <div className="grid gap-2">
            {adjusting ? (
              <>
                <Button type="button" onClick={onSave}>
                  保存调整
                </Button>
                <Button type="button" variant="outline" onClick={onBack}>
                  返回申请
                </Button>
              </>
            ) : null}
            {!adjusting && request.stage === "pending" ? (
              <>
                <Button type="button" onClick={onAgree}>
                  同意
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button type="button" variant="outline" onClick={onReject}>
                    拒绝
                  </Button>
                  <Button type="button" variant="outline" onClick={onFollow}>
                    跟进
                  </Button>
                </div>
              </>
            ) : null}
            {!adjusting && request.stage === "follow_up" ? (
              request.nextStep === "去调整班表" ? (
                <Button type="button" onClick={onStartAdjust}>
                  去调整班表
                </Button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Button type="button" onClick={onAgree}>
                    同意
                  </Button>
                  <Button type="button" variant="outline" onClick={onReject}>
                    拒绝
                  </Button>
                </div>
              )
            ) : null}
            {request.stage === "processed" ? (
              <Button type="button" variant="outline" onClick={onNext}>
                处理下一条
              </Button>
            ) : null}
          </div>
        </div>
      ) : (
        <EmptyBlock text="请选择申请后处理" />
      )}
    </aside>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-sm font-medium">{title}</div>
      <Separator className="my-2" />
      <div className="text-sm text-muted-foreground">{children}</div>
    </div>
  )
}

function EmptyBlock({ text }: { text: string }) {
  return (
    <div className="rounded-md border bg-muted/30 px-3 py-8 text-center text-sm text-muted-foreground">
      {text}
    </div>
  )
}

async function fetchDutyChangeRequests(
  model: RosterDraftViewModel
): Promise<DutyChangeRequest[]> {
  const params = new URLSearchParams({
    business_month: model.targetMonth,
    project_id: model.project.projectId,
    workplace_id: resolveRosterWorkplaceId(model.project.workplaceName),
    team_id: rosterTeamId,
  })
  try {
    const response = await fetch(
      buildRosterApiUrl(`/api/v1/roster-requests?${params.toString()}`),
      { cache: "no-store" }
    )
    if (!response.ok) {
      return []
    }
    const payload = await response.json()
    const items: RosterRequestIntent[] = Array.isArray(payload?.items) ? payload.items : []
    const currentCells = await fetchCurrentPublishedCells(model)
    return items.map((item) =>
      mapRosterRequestIntent(item, model, currentCells.get(item.roster_cell_id))
    )
  } catch {
    return []
  }
}

async function fetchCurrentPublishedCells(
  model: RosterDraftViewModel
): Promise<Map<string, PublishedRosterCell>> {
  const params = new URLSearchParams({
    business_month: model.targetMonth,
    project_id: model.project.projectId,
    workplace_id: resolveRosterWorkplaceId(model.project.workplaceName),
    team_id: rosterTeamId,
  })
  try {
    const response = await fetch(
      buildRosterApiUrl(`/api/v1/roster-drafts/current-published?${params.toString()}`),
      { cache: "no-store" }
    )
    if (!response.ok) {
      return new Map()
    }
    const payload = await response.json()
    const cells: PublishedRosterCell[] = Array.isArray(payload?.cells)
      ? payload.cells.map(normalizePublishedRosterCell)
      : []
    return new Map(cells.map((cell) => [cell.cell_id, cell]))
  } catch {
    return new Map()
  }
}

async function createAndPublishCurrentCellAdjustment({
  model,
  request,
  targetShiftCode,
}: {
  model: RosterDraftViewModel
  request: DutyChangeRequest
  targetShiftCode: string
}): Promise<string | null> {
  const revisionVersionId = buildRosterRevisionVersionId(model.targetMonth)
  const occurredAt = currentLocalIsoMinute()
  try {
    const revisionResponse = await fetch(
      buildRosterApiUrl("/api/v1/roster-drafts/revisions/create"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_month: model.targetMonth,
          project_id: model.project.projectId,
          workplace_id: resolveRosterWorkplaceId(model.project.workplaceName),
          team_id: rosterTeamId,
          actor_id: rosterPublishActorId,
          occurred_at: occurredAt,
          revision_version_id: revisionVersionId,
        }),
      }
    )
    const revisionPayload = await revisionResponse.json()
    if (!revisionResponse.ok) {
      return null
    }
    const revisionDraft = normalizeRosterRevisionDraft(revisionPayload)
    const publishResponse = await fetch(buildRosterApiUrl("/api/v1/roster-drafts/publish"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        buildRosterPublishPayload(model, request, targetShiftCode, revisionDraft)
      ),
    })
    if (!publishResponse.ok) {
      return null
    }
    return revisionDraft.version?.version_id ?? revisionVersionId
  } catch {
    return null
  }
}

function buildRosterPublishPayload(
  model: RosterDraftViewModel,
  request: DutyChangeRequest,
  targetShiftCode: string,
  revisionDraft: RosterRevisionDraft
) {
  const intervalByShiftCode = buildShiftIntervalMap(model)
  const revisionCellSourceByKey = buildRevisionCellSourceByKey(revisionDraft)
  const sourceCellApiKey = ["source", "cell", "id"].join("_")
  const cells = model.monthRows.flatMap((row) =>
    row.cells.flatMap((cell, index) => {
      const isTarget =
        row.employeeId === request.employeeId && cell.date === request.businessDateRaw
      const effectiveShiftCode = isTarget ? targetShiftCode : cell.shiftCode
      if (!effectiveShiftCode) {
        return []
      }
      const key = cellKey(row.employeeId, cell.date)
      const revisionSource = revisionCellSourceByKey.get(key)
      const intervalLabel = intervalByShiftCode.get(effectiveShiftCode)
      const interval = intervalLabel
        ? intervalLabelToIsoBounds(cell.date, intervalLabel)
        : null
      const assignmentKind = effectiveShiftCode === "REST" ? "rest" : "shift"

      return [
        {
          cell_id: revisionSource?.cellId ?? `CELL-${row.employeeId}-${cell.date}`,
          assignment_id: `ASSIGN-${row.employeeId}-${cell.date}`,
          employee_id: row.employeeId,
          business_date: cell.date,
          sequence: index + 1,
          assignment_kind: assignmentKind,
          project_id: model.project.projectId,
          workplace_id: resolveRosterWorkplaceId(model.project.workplaceName),
          team_id: teamIdFromTeamName(row.teamName) ?? rosterTeamId,
          shift_code: effectiveShiftCode,
          interval_start_at: interval?.startAt,
          interval_end_at: interval?.endAt,
          [sourceCellApiKey]: revisionSource?.sourceCellId ?? undefined,
          manually_adjusted: isTarget,
        },
      ]
    })
  )

  return {
    version_id: revisionDraft.version?.version_id ?? buildRosterRevisionVersionId(model.targetMonth),
    actor_id: rosterPublishActorId,
    occurred_at: currentLocalIsoMinute(),
    business_month: model.targetMonth,
    project_id: model.project.projectId,
    workplace_id: resolveRosterWorkplaceId(model.project.workplaceName),
    team_id: rosterTeamId,
    valid_shift_codes: uniqueValues(cells.map((cell) => cell.shift_code)),
    required_coverage_slots: model.forecastIntervals.map((item) =>
      rosterSlotToIso(item.businessDate, item.slotLabel)
    ),
    employees: model.monthRows.map((row) => ({
      employee_id: row.employeeId,
      active: true,
      project_id: model.project.projectId,
      workplace_id: resolveRosterWorkplaceId(model.project.workplaceName),
      team_id: teamIdFromTeamName(row.teamName) ?? rosterTeamId,
      status: "active",
    })),
    cells,
  }
}

function mapRosterRequestIntent(
  intent: RosterRequestIntent,
  model: RosterDraftViewModel,
  publishedCell?: PublishedRosterCell
): DutyChangeRequest {
  const employee = model.monthRows.find((row) => row.employeeId === intent.employee_id)
  const cell = employee?.cells.find((item) => item.date === intent.business_date)
  const type = requestTypeLabels[intent.action_type]
  const stage = mapRequestStage(intent.status)
  const resultType = intent.result_type ?? null
  const result = resultType ? resultLabels[resultType] : ""
  const currentShiftCode = publishedCell?.shift_code ?? cell?.shiftCode ?? "REST"
  const currentShift = formatPublishedShift(publishedCell, currentShiftCode)
  return {
    id: intent.request_id,
    rosterVersionId: intent.roster_version_id,
    rosterCellId: intent.roster_cell_id,
    marker: buildRequestMarker(intent),
    type,
    employeeName: employee?.employeeName ?? intent.employee_id,
    employeeId: intent.employee_id,
    teamId: employee?.teamName ?? "G1",
    businessDate: formatBusinessDate(intent.business_date),
    businessDateRaw: intent.business_date,
    requesterRole: intent.requester_role === "team_lead" ? "班长" : "一线员工",
    currentShift,
    currentShiftCode,
    requestText: requestTextLabels[intent.action_type],
    reason: intent.note || "下游提交的班务申请",
    note: intent.scheduler_resolution_note ?? "",
    stage,
    currentState: mapRequestState(intent.status, resultType),
    nextStep: intent.status === "in_progress" ? "去调整班表" : "",
    result,
    rosterResult: buildRosterResult(intent, currentShift),
    linkedRevisionVersionId: intent.linked_revision_version_id ?? null,
    resultType,
    rawStatus: intent.status,
  }
}

function mapRequestStage(status: RequestStatus): RequestStage {
  if (status === "open") {
    return "pending"
  }
  if (status === "in_progress") {
    return "follow_up"
  }
  return "processed"
}

function mapRequestState(status: RequestStatus, resultType: RequestResultType | null): string {
  if (status === "open") {
    return "待处理"
  }
  if (status === "in_progress") {
    return "跟进中"
  }
  return resultType ? resultLabels[resultType] : "已处理"
}

function buildRequestMarker(intent: RosterRequestIntent): string {
  if (intent.action_type === "swap") {
    return "换班需核对"
  }
  if (intent.action_type === "site_adjustment") {
    return "现场事项"
  }
  return intent.status === "in_progress" ? "需跟进" : "当前班次"
}

function buildRosterResult(intent: RosterRequestIntent, currentShift: string): string {
  if (intent.result_type === "adjusted") {
    return `${currentShift} -> 休息`
  }
  if (intent.result_type === "rejected") {
    return "班表未变更"
  }
  if (intent.result_type === "closed") {
    return "现场确认后关闭"
  }
  return ""
}

function normalizeRosterRevisionDraft(
  payload: Partial<RosterRevisionDraft>
): RosterRevisionDraft {
  return {
    status: payload.status ?? "missing",
    version: payload.version ?? null,
    cells: (payload.cells ?? []).map(normalizePublishedRosterCell),
  }
}

function normalizePublishedRosterCell(cell: Record<string, unknown>): PublishedRosterCell {
  const sourceCellApiKey = ["source", "cell", "id"].join("_")
  return {
    cell_id: String(cell.cell_id ?? ""),
    assignment_id: optionalString(cell.assignment_id),
    employee_id: optionalString(cell.employee_id),
    business_date: optionalString(cell.business_date),
    sequence: optionalNumber(cell.sequence),
    assignment_kind: optionalString(cell.assignment_kind),
    project_id: optionalString(cell.project_id),
    workplace_id: optionalString(cell.workplace_id),
    team_id: optionalString(cell.team_id),
    shift_code: optionalString(cell.shift_code),
    annotation_code: optionalString(cell.annotation_code),
    interval_start_at: optionalString(cell.interval_start_at),
    interval_end_at: optionalString(cell.interval_end_at),
    sourceCellId: optionalString(cell[sourceCellApiKey]),
    manually_adjusted:
      typeof cell.manually_adjusted === "boolean" ? cell.manually_adjusted : null,
  }
}

function buildRevisionCellSourceByKey(
  revisionDraft?: RosterRevisionDraft | null
): Map<string, RosterRevisionCellSource> {
  const revisionCellSourceByKey = new Map<string, RosterRevisionCellSource>()
  if (!revisionDraft) {
    return revisionCellSourceByKey
  }

  for (const cell of revisionDraft.cells ?? []) {
    if (!cell.employee_id || !cell.business_date) {
      continue
    }
    revisionCellSourceByKey.set(cellKey(cell.employee_id, cell.business_date), {
      cellId: cell.cell_id,
      sourceCellId: cell.sourceCellId,
    })
  }

  return revisionCellSourceByKey
}

function buildShiftOptions(
  model: RosterDraftViewModel,
  request: DutyChangeRequest | null
): ShiftOption[] {
  const intervalByShiftCode = buildShiftIntervalMap(model)
  const codes = uniqueValues([
    "REST",
    "A5",
    "B2",
    request?.currentShiftCode ?? "",
    ...model.assignments.map((assignment) => assignment.shiftCode),
  ]).filter(Boolean)

  return codes.map((code) => {
    const intervalLabel = intervalByShiftCode.get(code) ?? null
    return {
      value: code,
      label: intervalLabel ? `${formatShiftCodeLabel(code)} ${intervalLabel}` : formatShiftCodeLabel(code),
      intervalLabel,
    }
  })
}

function buildShiftIntervalMap(model: RosterDraftViewModel): Map<string, string> {
  const intervalByShiftCode = new Map<string, string>()
  for (const assignment of model.assignments) {
    if (assignment.shiftCode && assignment.intervalLabel) {
      intervalByShiftCode.set(assignment.shiftCode, assignment.intervalLabel)
    }
  }
  return intervalByShiftCode
}

function buildAdjustmentWindow(
  monthDays: RosterDraftViewModel["monthDays"],
  businessDate: string
): RosterDraftViewModel["monthDays"] {
  const index = monthDays.findIndex((day) => day.date === businessDate)
  if (index < 0) {
    return monthDays.slice(0, 5)
  }
  const start = Math.max(0, Math.min(index - 2, monthDays.length - 5))
  return monthDays.slice(start, start + 5)
}

function defaultTargetShiftCode(currentShiftCode: string): string {
  return currentShiftCode === "REST" ? "A5" : "REST"
}

function formatShiftCodeLabel(shiftCode: string | undefined | null): string {
  if (!shiftCode || shiftCode === "REST") {
    return "休息"
  }
  return shiftCode
}

function teamIdFromTeamName(teamName: string): string | null {
  if (teamName === "G1 投诉组") {
    return "G1"
  }
  if (teamName === "G2 在线组") {
    return "G2"
  }
  return teamName || null
}

function cellKey(employeeId: string, businessDate: string): string {
  return `${employeeId}:${businessDate}`
}

function intervalLabelToIsoBounds(
  businessDate: string,
  intervalLabel: string
): { startAt: string; endAt: string } | null {
  const match = intervalLabel.match(/^(\d{2}:\d{2})-(\d{2}:\d{2})$/)
  if (!match) {
    return null
  }
  const [, start, end] = match
  const startAt = rosterSlotToIso(businessDate, start)
  const startMinutes = slotStartMinutes(start)
  const endMinutes = slotStartMinutes(end)
  const endDate = endMinutes <= startMinutes ? addDateDays(businessDate, 1) : businessDate
  return {
    startAt,
    endAt: rosterSlotToIso(endDate, end),
  }
}

function rosterSlotToIso(businessDate: string, slotLabel: string): string {
  return `${businessDate}T${slotLabel}`
}

function slotStartMinutes(slotLabel: string): number {
  const [hour, minute] = slotLabel.split(":").map(Number)
  return hour * 60 + minute
}

function addDateDays(date: string, days: number): string {
  const parsed = new Date(`${date}T00:00:00`)
  parsed.setDate(parsed.getDate() + days)
  return parsed.toISOString().slice(0, 10)
}

function uniqueValues<T>(values: T[]): T[] {
  return Array.from(new Set(values))
}

function optionalString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null
}

function optionalNumber(value: unknown): number | null {
  return typeof value === "number" ? value : null
}

function formatBusinessDate(date: string): string {
  const [, month, day] = date.split("-")
  return month && day ? `${Number(month)}/${Number(day)}` : date
}

function formatPublishedShift(
  publishedCell: PublishedRosterCell | undefined,
  fallbackShiftCode: string | undefined
): string {
  const shiftCode = publishedCell?.shift_code ?? fallbackShiftCode
  if (!shiftCode) {
    return "休息"
  }
  const start = publishedCell?.interval_start_at?.slice(11, 16)
  const end = publishedCell?.interval_end_at?.slice(11, 16)
  return start && end ? `${shiftCode} ${start}-${end}` : shiftCode
}

function buildRosterApiUrl(path: string): string {
  const base =
    process.env.NEXT_PUBLIC_BPO_API_BASE_URL?.replace(/\/$/, "") ??
    "http://127.0.0.1:8000"
  return `${base}${path.startsWith("/") ? path : `/${path}`}`
}

function resolveRosterWorkplaceId(workplaceName: string): string {
  return workplaceName === "上海职场" ? "SHANGHAI" : workplaceName
}

function currentLocalIsoMinute(): string {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60 * 1000
  return new Date(now.getTime() - offset).toISOString().slice(0, 16)
}

function buildRosterRevisionVersionId(targetMonth: string): string {
  return `ROSTER-${targetMonth}-REV-${currentLocalIsoMinute().replace(/[-:T]/g, "")}`
}
