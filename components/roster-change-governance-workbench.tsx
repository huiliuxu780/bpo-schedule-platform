"use client"

import * as React from "react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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

type RequestStage = "pending" | "follow_up" | "processed"
type RequestType = "请假" | "换班" | "异常修复" | "现场调配"
type RequestTab = RequestStage | "employee"

type DutyChangeRequest = {
  id: string
  marker: string
  type: RequestType
  employeeName: string
  employeeId: string
  teamId: string
  businessDate: string
  requesterRole: string
  currentShift: string
  requestText: string
  reason: string
  note: string
  stage: RequestStage
  currentState: string
  nextStep: string
  result: string
  rosterResult: string
}

const initialRequests: DutyChangeRequest[] = [
  {
    id: "REQ-LEAVE-001",
    marker: "今日班次",
    type: "请假",
    employeeName: "张三",
    employeeId: "EMP-001",
    teamId: "G1",
    businessDate: "8/12",
    requesterRole: "一线员工",
    currentShift: "A5 09:00-14:30",
    requestText: "改为休息",
    reason: "病假",
    note: "",
    stage: "pending",
    currentState: "待处理",
    nextStep: "",
    result: "",
    rosterResult: "",
  },
  {
    id: "REQ-SWAP-002",
    marker: "换班需核对",
    type: "换班",
    employeeName: "李四",
    employeeId: "EMP-002",
    teamId: "G1",
    businessDate: "8/13",
    requesterRole: "一线员工",
    currentShift: "B2 14:00-22:00",
    requestText: "与王五换班",
    reason: "个人事项",
    note: "",
    stage: "pending",
    currentState: "待处理",
    nextStep: "",
    result: "",
    rosterResult: "",
  },
  {
    id: "REQ-FIX-003",
    marker: "当前有班",
    type: "异常修复",
    employeeName: "王五",
    employeeId: "EMP-003",
    teamId: "G1",
    businessDate: "8/14",
    requesterRole: "班长",
    currentShift: "休息",
    requestText: "需要补班",
    reason: "现场记录与正式班表不一致",
    note: "",
    stage: "pending",
    currentState: "待处理",
    nextStep: "",
    result: "",
    rosterResult: "",
  },
  {
    id: "REQ-SITE-004",
    marker: "现场事项",
    type: "现场调配",
    employeeName: "赵六",
    employeeId: "EMP-004",
    teamId: "G1",
    businessDate: "8/15",
    requesterRole: "班长",
    currentShift: "A5 09:00-14:30",
    requestText: "调到二线支援",
    reason: "现场临时支援",
    note: "已联系班长确认是否需要二线支援。",
    stage: "follow_up",
    currentState: "现场跟进中",
    nextStep: "等待现场确认",
    result: "",
    rosterResult: "",
  },
  {
    id: "REQ-DONE-005",
    marker: "今日班次",
    type: "请假",
    employeeName: "陈七",
    employeeId: "EMP-005",
    teamId: "G1",
    businessDate: "8/10",
    requesterRole: "一线员工",
    currentShift: "A5 09:00-14:30",
    requestText: "改为休息",
    reason: "事假",
    note: "已核对申请。",
    stage: "processed",
    currentState: "已处理",
    nextStep: "",
    result: "已完成班表调整",
    rosterResult: "A5 -> 休息",
  },
]

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
  const [requests, setRequests] = React.useState<DutyChangeRequest[]>(initialRequests)
  const [activeTab, setActiveTab] = React.useState<RequestTab>("pending")
  const [selectedRequestId, setSelectedRequestId] = React.useState(initialRequests[0]?.id ?? null)
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [adjusting, setAdjusting] = React.useState(false)
  const [draftNote, setDraftNote] = React.useState("")

  const selectedRequest = selectedRequestId
    ? requests.find((request) => request.id === selectedRequestId) ?? null
    : null
  const pending = requests.filter((request) => request.stage === "pending")
  const followUp = requests.filter((request) => request.stage === "follow_up")
  const processed = requests.filter((request) => request.stage === "processed")

  function openRequest(requestId: string) {
    const request = requests.find((item) => item.id === requestId) ?? null
    setSelectedRequestId(requestId)
    setDraftNote(request?.note ?? "")
    setAdjusting(false)
    setDrawerOpen(true)
  }

  function updateRequest(requestId: string, updater: (request: DutyChangeRequest) => DutyChangeRequest) {
    setRequests((current) => current.map((request) => (request.id === requestId ? updater(request) : request)))
  }

  function agreeRequest() {
    if (!selectedRequest) {
      return
    }
    updateRequest(selectedRequest.id, (request) => ({
      ...request,
      note: draftNote,
      stage: "follow_up",
      currentState: "已同意",
      nextStep: "去调整班表",
    }))
    setActiveTab("follow_up")
    setAdjusting(true)
  }

  function rejectRequest() {
    if (!selectedRequest) {
      return
    }
    updateRequest(selectedRequest.id, (request) => ({
      ...request,
      note: draftNote,
      stage: "processed",
      currentState: "已处理",
      result: "已拒绝",
      rosterResult: "班表未变更",
      nextStep: "",
    }))
    setActiveTab("processed")
  }

  function followRequest() {
    if (!selectedRequest) {
      return
    }
    updateRequest(selectedRequest.id, (request) => ({
      ...request,
      note: draftNote,
      stage: "follow_up",
      currentState: "现场跟进中",
      nextStep: "等待现场确认",
    }))
    setActiveTab("follow_up")
  }

  function saveAdjustment() {
    if (!selectedRequest) {
      return
    }
    updateRequest(selectedRequest.id, (request) => ({
      ...request,
      note: draftNote || `${request.reason}，已同意申请`,
      stage: "processed",
      currentState: "已处理",
      result: "已完成班表调整",
      rosterResult: `${request.currentShift.split(" ")[0]} -> 休息`,
      nextStep: "",
    }))
    setActiveTab("processed")
    setAdjusting(false)
  }

  return (
    <section
      data-slot="duty-change-request-shell"
      className="flex min-h-0 flex-1 flex-col bg-background"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
        <div className="min-w-0">
          <h1 className="text-sm font-semibold">班务变更申请</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            处理班长和一线提交的请假、换班、异常修复、现场调配申请。
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
        <Metric label="今日新增" value={3} />
      </div>

      <div className="flex flex-wrap gap-2 border-b px-4 py-3 text-xs">
        <FilterLabel text="全部类型" />
        <FilterLabel text="全部班组" />
        <div className="min-w-[220px] rounded-md border bg-muted/30 px-3 py-2 text-muted-foreground">
          搜索员工 / 日期 / 申请内容
        </div>
      </div>

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
          <RequestList
            requests={pending}
            mode="pending"
            selectedRequestId={selectedRequestId}
            onSelect={openRequest}
          />
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

      <Sheet open={drawerOpen && selectedRequest !== null} onOpenChange={setDrawerOpen}>
        <SheetContent
          data-slot="duty-change-request-detail-drawer"
          className="w-[92vw] overflow-hidden sm:max-w-xl"
        >
          {selectedRequest ? (
            <>
              <SheetHeader>
                <SheetTitle>
                  {selectedRequest.employeeName} / {selectedRequest.businessDate} / {selectedRequest.type}
                </SheetTitle>
                <SheetDescription>
                  状态：{selectedRequest.currentState} · 来源：{selectedRequest.requesterRole} · 班组：
                  {selectedRequest.teamId}
                </SheetDescription>
              </SheetHeader>
              <div className="min-h-0 flex-1 overflow-auto px-4">
                {adjusting ? (
                  <MonthlyAdjustmentPanel request={selectedRequest} note={draftNote} onNoteChange={setDraftNote} />
                ) : (
                  <RequestDetail request={selectedRequest} note={draftNote} onNoteChange={setDraftNote} />
                )}
              </div>
              <SheetFooter>
                {adjusting ? (
                  <div className="grid w-full gap-2">
                    <Button type="button" onClick={saveAdjustment}>
                      保存调整
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setAdjusting(false)}>
                      返回申请
                    </Button>
                  </div>
                ) : (
                  <div className="grid w-full gap-2">
                    {selectedRequest.stage === "pending" ? (
                      <>
                        <Button type="button" onClick={agreeRequest}>
                          同意
                        </Button>
                        <div className="grid grid-cols-2 gap-2">
                          <Button type="button" variant="outline" onClick={rejectRequest}>
                            拒绝
                          </Button>
                          <Button type="button" variant="outline" onClick={followRequest}>
                            现场跟进
                          </Button>
                        </div>
                      </>
                    ) : null}
                    {selectedRequest.stage === "follow_up" ? (
                      selectedRequest.nextStep === "去调整班表" ? (
                        <Button type="button" onClick={() => setAdjusting(true)}>
                          去调整班表
                        </Button>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          <Button type="button" onClick={agreeRequest}>
                            同意
                          </Button>
                          <Button type="button" variant="outline" onClick={rejectRequest}>
                            拒绝
                          </Button>
                        </div>
                      )
                    ) : null}
                    {selectedRequest.stage === "processed" ? (
                      <Button type="button" variant="outline" onClick={() => setDrawerOpen(false)}>
                        处理下一条
                      </Button>
                    ) : null}
                  </div>
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

function RequestDetail({
  request,
  note,
  onNoteChange,
}: {
  request: DutyChangeRequest
  note: string
  onNoteChange: (value: string) => void
}) {
  return (
    <div className="grid gap-4">
      <Section title="当前班次">{request.currentShift}</Section>
      <Section title="申请内容">
        <div>{request.requestText}</div>
        <div className="mt-1 text-xs text-muted-foreground">原因：{request.reason}</div>
      </Section>
      <Section title="提示">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{request.marker}</Badge>
          <Badge variant="outline">当前申请会影响 {request.businessDate} 班次安排</Badge>
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
      {request.stage === "pending" ? (
        <div className="text-xs text-muted-foreground">
          同意后进入跟进中，并打开月班表调整。正式班表不会自动变更。
        </div>
      ) : null}
    </div>
  )
}

function MonthlyAdjustmentPanel({
  request,
  note,
  onNoteChange,
}: {
  request: DutyChangeRequest
  note: string
  onNoteChange: (value: string) => void
}) {
  return (
    <div className="grid gap-4">
      <div className="rounded-md border bg-muted/30 p-3">
        <div className="text-sm font-medium">当前处理申请</div>
        <div className="mt-2 text-sm">
          {request.employeeName} / {request.businessDate} / {request.type}
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          当前班次：{request.currentShift} · 申请内容：{request.requestText}
        </div>
      </div>
      <div className="overflow-hidden rounded-md border">
        <div className="grid grid-cols-6 bg-muted/40 text-xs text-muted-foreground">
          <div className="px-3 py-2">员工</div>
          <div className="px-3 py-2">8/10</div>
          <div className="px-3 py-2">8/11</div>
          <div className="px-3 py-2">8/12</div>
          <div className="px-3 py-2">8/13</div>
          <div className="px-3 py-2">8/14</div>
        </div>
        <div className="grid grid-cols-6 text-sm">
          <div className="border-t px-3 py-2">{request.employeeName}</div>
          <div className="border-t px-3 py-2">A5</div>
          <div className="border-t px-3 py-2">A5</div>
          <div className="border-t border-primary bg-primary/5 px-3 py-2">
            {request.currentShift}
            <div className="text-xs text-primary">当前申请</div>
          </div>
          <div className="border-t px-3 py-2">休息</div>
          <div className="border-t px-3 py-2">A5</div>
        </div>
      </div>
      <Section title="来自申请">{request.type}：{request.requestText}</Section>
      <Section title="当前班次">{request.currentShift}</Section>
      <div className="grid gap-2">
        <div className="text-sm font-medium">调整为</div>
        <div className="rounded-md border bg-background px-3 py-2 text-sm">休息 v</div>
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium" htmlFor="adjustment-note">
          备注
        </label>
        <textarea
          id="adjustment-note"
          value={note}
          onChange={(event) => onNoteChange(event.target.value)}
          className="min-h-20 w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          placeholder={`${request.reason}，已同意申请`}
        />
      </div>
      <Button asChild variant="outline">
        <Link href={`/roster-drafts?month=2026-08&request_id=${request.id}`}>打开月班表调整页</Link>
      </Button>
    </div>
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
