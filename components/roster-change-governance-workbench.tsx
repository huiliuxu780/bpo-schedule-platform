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
import type { RosterDraftViewModel } from "@/lib/roster-drafts"
import { cn } from "@/lib/utils"

type RosterChangeVisibility = "scheduler" | "team_lead" | "frontline"

type RosterChangeGovernanceTimelineItem = {
  version_id: string
  published_at?: string | null
  status: string
  parent_version_id?: string | null
  supersedes_version_id?: string | null
  changed_cell_count: number
  linked_issue_count: number
}

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

type RosterChangeDiffRow = {
  diff_id: string
  revision_version_id: string
  parent_version_id: string
  roster_cell_id: string
  source_cell_id: string
  employee_id: string
  business_date: string
  before: RosterChangeCellSnapshot
  after: RosterChangeCellSnapshot
  linked_issues: RosterChangeLinkedIssue[]
}

type RosterChangeGovernanceResponse = {
  selected_revision_id?: string | null
  timeline: RosterChangeGovernanceTimelineItem[]
  diff_rows: RosterChangeDiffRow[]
  selected_diff?: RosterChangeDiffRow | null
}

const fixedTeamId = "G1"

const actionLabels: Record<string, string> = {
  leave: "请假",
  swap: "换班",
  exception_fix: "异常修复",
  site_adjustment: "现场调配",
}

export function RosterChangeGovernanceWorkbench({
  model,
  targetMonths,
  initialRevisionId,
  initialCellId,
  initialIssueId,
  initialVisibility,
  initialEmployeeId,
  initialRequesterId,
}: {
  model: RosterDraftViewModel
  targetMonths: string[]
  initialRevisionId: string | null
  initialCellId: string | null
  initialIssueId: string | null
  initialVisibility: string
  initialEmployeeId: string | null
  initialRequesterId: string | null
}) {
  const [selectedRevisionId, setSelectedRevisionId] = React.useState(initialRevisionId)
  const [payload, setPayload] = React.useState<RosterChangeGovernanceResponse | null>(null)

  const visibility = normalizeVisibility(initialVisibility)

  React.useEffect(() => {
    let cancelled = false
    fetchRosterChangeGovernance({
      model,
      visibility,
      revisionId: selectedRevisionId,
      cellId: initialCellId,
      issueId: initialIssueId,
      employeeId: initialEmployeeId,
      requesterId: initialRequesterId,
    })
      .then((nextPayload) => {
        if (!cancelled) {
          setPayload(nextPayload)
          if (!selectedRevisionId && nextPayload.selected_revision_id) {
            setSelectedRevisionId(nextPayload.selected_revision_id)
          }
        }
      })
    return () => {
      cancelled = true
    }
  }, [
    model,
    visibility,
    selectedRevisionId,
    initialCellId,
    initialIssueId,
    initialEmployeeId,
    initialRequesterId,
  ])

  const timeline = payload?.timeline ?? []
  const diffRows = payload?.diff_rows ?? []
  const selectedDiff = payload?.selected_diff ?? diffRows[0] ?? null

  return (
    <section
      data-slot="roster-change-governance-shell"
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-background px-4 py-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold">正式班表变更治理</div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>{model.project.projectName}</span>
            <span>{model.project.workplaceName}</span>
            <span>{fixedTeamId}</span>
            <span>{payload === null ? "读取中" : `${diffRows.length} 条差异`}</span>
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

      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden @4xl/main:grid-cols-[280px_minmax(0,1fr)_340px]">
        <aside
          data-slot="roster-change-timeline"
          className="min-h-0 overflow-auto border-b bg-background p-3 @4xl/main:border-r @4xl/main:border-b-0"
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-medium">版本时间线</div>
            <Badge variant="secondary">{timeline.length}</Badge>
          </div>
          <div className="grid gap-2">
            {timeline.length === 0 ? (
              <EmptyBlock text="暂无正式班表发布记录" />
            ) : (
              timeline.map((item) => (
                <button
                  key={item.version_id}
                  type="button"
                  className={cn(
                    "rounded-md border bg-card p-3 text-left text-sm hover:bg-muted/50",
                    item.version_id === payload?.selected_revision_id && "border-primary"
                  )}
                  onClick={() => setSelectedRevisionId(item.version_id)}
                >
                  <div className="truncate font-medium">{item.version_id}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {item.published_at ?? "-"}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <Badge variant="outline">{item.changed_cell_count} 格变更</Badge>
                    <Badge variant="secondary">{item.linked_issue_count} 个问题</Badge>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        <div
          data-slot="roster-change-diff-list"
          className="min-h-0 overflow-auto border-b p-3 @4xl/main:border-r @4xl/main:border-b-0"
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-medium">人员-日期差异</div>
              <div className="mt-1 text-xs text-muted-foreground">
                source_cell_id 对齐父版本同格
              </div>
            </div>
            <Badge>{payload?.selected_revision_id ?? "-"}</Badge>
          </div>
          <div className="grid gap-2">
            {diffRows.length === 0 ? (
              <EmptyBlock text="当前筛选下暂无修订差异" />
            ) : (
              diffRows.map((row) => (
                <div
                  key={row.diff_id}
                  className={cn(
                    "rounded-md border bg-card p-3",
                    row.diff_id === selectedDiff?.diff_id && "border-primary"
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium">
                        {row.employee_id} / {row.business_date}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        source_cell_id：{row.source_cell_id}
                      </div>
                    </div>
                    <Badge variant="outline">{row.linked_issues.length} 个关联问题</Badge>
                  </div>
                  <div className="mt-3 grid gap-2 @md:grid-cols-2">
                    <DiffSnapshot title="修订前" snapshot={row.before} />
                    <DiffSnapshot title="修订后" snapshot={row.after} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <aside
          data-slot="roster-change-linked-issues"
          className="min-h-0 overflow-auto bg-background p-3"
        >
          <div className="mb-2 text-sm font-medium">关联问题</div>
          {selectedDiff ? (
            <div className="rounded-md border bg-card p-3 text-sm">
              <div className="font-medium">
                {selectedDiff.employee_id} / {selectedDiff.business_date}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {selectedDiff.revision_version_id}
              </div>
              <Separator className="my-3" />
              <div className="grid gap-2">
                {selectedDiff.linked_issues.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    该差异没有关联已处理问题
                  </div>
                ) : (
                  selectedDiff.linked_issues.map((issue) => (
                    <div key={issue.request_id} className="rounded-md border p-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium">{issue.request_id}</span>
                        <Badge variant="secondary">
                          {actionLabels[issue.action_type] ?? issue.action_type}
                        </Badge>
                      </div>
                      <div className="mt-2 grid gap-1 text-xs text-muted-foreground">
                        <div>登记人：{issue.requester_role} / {issue.requester_id}</div>
                        <div>关闭时间：{issue.resolved_at ?? "-"}</div>
                        <div>处理说明：{issue.scheduler_resolution_note ?? "-"}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <EmptyBlock text="选择一条差异查看关联问题" />
          )}
        </aside>
      </div>
    </section>
  )
}

function DiffSnapshot({
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

function EmptyBlock({ text }: { text: string }) {
  return (
    <div className="rounded-md border bg-muted/30 px-3 py-6 text-center text-sm text-muted-foreground">
      {text}
    </div>
  )
}

async function fetchRosterChangeGovernance({
  model,
  visibility,
  revisionId,
  cellId,
  issueId,
  employeeId,
  requesterId,
}: {
  model: RosterDraftViewModel
  visibility: RosterChangeVisibility
  revisionId: string | null
  cellId: string | null
  issueId: string | null
  employeeId: string | null
  requesterId: string | null
}): Promise<RosterChangeGovernanceResponse> {
  const params = new URLSearchParams({
    business_month: model.targetMonth,
    project_id: model.project.projectId,
    workplace_id: model.project.workplaceName,
    team_id: fixedTeamId,
    visibility,
  })
  addOptionalParam(params, "revision_id", revisionId)
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
      return emptyGovernance()
    }
    return response.json()
  } catch {
    return emptyGovernance()
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

function emptyGovernance(): RosterChangeGovernanceResponse {
  return {
    selected_revision_id: null,
    timeline: [],
    diff_rows: [],
    selected_diff: null,
  }
}

function buildRosterApiUrl(path: string): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_BPO_API_BASE_URL?.replace(/\/$/, "") ??
    "http://127.0.0.1:8000"
  return `${baseUrl}${path}`
}
