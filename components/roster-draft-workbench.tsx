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
import { Input } from "@/components/ui/input"
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
type RosterLifecycleState = "draft" | "publishing" | "published" | "revision_draft"

type RosterCellDraftEdit = {
  shiftCode: string
  note: string
}

type ShiftCountSummary = {
  shiftCode: string
  count: number
  intervalLabel: string
}

type HalfHourCoverageSummary = {
  slotLabel: string
  arrangedCount: number
}

type RosterDerivedCoverage = {
  shiftCounts: ShiftCountSummary[]
  halfHourCoverage: HalfHourCoverageSummary[]
  totalShiftCount: number
  coveredSlotCount: number
}

type RosterVersionSummary = {
  version_id: string
  business_month: string
  status: string
  project_id?: string
  workplace_id?: string
  team_id?: string
  activated_at?: string
  parent_version_id?: string | null
  supersedes_version_id?: string | null
}

type PublishedRosterCell = {
  cell_id: string
  assignment_id: string
  employee_id: string
  business_date: string
  sequence: number
  assignment_kind: string
  project_id: string
  workplace_id?: string | null
  team_id: string
  shift_code?: string | null
  annotation_code?: string | null
  interval_start_at?: string | null
  interval_end_at?: string | null
  source_cell_id?: string | null
  manually_adjusted: boolean
}

type RosterRevisionDraft = {
  status: "draft" | "missing"
  version: RosterVersionSummary | null
  cells: PublishedRosterCell[]
}

type RosterRevisionCellSource = {
  cellId: string
  sourceCellId?: string | null
}

type DownstreamRosterRequestIntent = {
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

type PublishedRosterSnapshot = {
  status: "published" | "missing"
  published: RosterVersionSummary | null
  cells: PublishedRosterCell[]
  snapshot: {
    shift_counts: Record<string, number>
    arranged_coverage: {
      slot_start_at: string
      arranged_count: number
      assignment_ids: string[]
    }[]
    hard_errors: PublishedRosterIssue[]
    soft_risks: PublishedRosterIssue[]
    diff_summary: {
      added_cell_ids: string[]
      deleted_cell_ids: string[]
      changed_cell_ids: string[]
      coverage_deltas: {
        slot_start_at: string
        baseline_count: number
        candidate_count: number
        delta: number
      }[]
    }
    created_at: string
  } | null
}

type PublishedRosterIssue = {
  code: string
  assignment_id: string | null
  message: string
}

type RosterLockState = {
  acquired: boolean
  readOnly: boolean
  message: string
  lock?: {
    versionId: string
    actorId: string
    expiresAt: string
  }
}

type RosterLockApiPayload = {
  acquired?: boolean
  read_only?: boolean
  message?: string
  lock?: {
    version_id?: string
    actor_id?: string
    expires_at?: string
  } | null
}

type RosterGapStatus = "shortage" | "balanced" | "surplus"

type WorkbenchInspectorTab = "detail" | "preview" | "gaps" | "queue"

type RosterGapRelatedCell = {
  employeeId: string
  employeeName: string
  teamName: string
  shiftCode: string
  intervalLabel: string
  isDraftEdited: boolean
}

type RosterGapPreviewRow = {
  id: string
  businessDate: string
  slotLabel: string
  forecastAgents: number
  arrangedAgents: number
  actualAgents: number
  forecastGap: number
  actualGap: number
  status: RosterGapStatus
  reason: string
  sourceLabel: string
  relatedEmployeeIds: string[]
  relatedCells: RosterGapRelatedCell[]
}

type SelectedCell = {
  employeeId: string
  employeeName: string
  teamName: string
  date: string
  cell: RosterMonthCell
  originalCell: RosterMonthCell
  draftEdit?: RosterCellDraftEdit
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

type ShiftCodeOption = {
  shiftCode: string
  label: string
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

const requestLabels: Record<DownstreamRosterRequestIntent["action_type"], string> = {
  leave: "请假",
  swap: "换班",
  exception_fix: "异常修复",
  site_adjustment: "现场调配",
}

const gapStatusLabels: Record<RosterGapStatus, string> = {
  shortage: "缺口",
  balanced: "平衡",
  surplus: "富余",
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
  const [inspectorTab, setInspectorTab] =
    React.useState<WorkbenchInspectorTab>("detail")
  const [cellEdits, setCellEdits] = React.useState<Record<string, RosterCellDraftEdit>>({})
  const [rosterLifecycleState, setRosterLifecycleState] =
    React.useState<RosterLifecycleState>("draft")
  const [publishedSnapshot, setPublishedSnapshot] =
    React.useState<PublishedRosterSnapshot | null>(null)
  const [revisionDraft, setRevisionDraft] =
    React.useState<RosterRevisionDraft | null>(null)
  const [lockState, setLockState] = React.useState<RosterLockState | null>(null)
  const [publishMessage, setPublishMessage] = React.useState<string | null>(null)
  const [downstreamRequests, setDownstreamRequests] = React.useState<
    DownstreamRosterRequestIntent[]
  >([])
  const [issueStatusFilter, setIssueStatusFilter] =
    React.useState<DownstreamRosterRequestIntent["status"]>("open")
  const [issueActionFilter, setIssueActionFilter] = React.useState("all")
  const [issueEmployeeFilter, setIssueEmployeeFilter] = React.useState("all")
  const [resolutionNotes, setResolutionNotes] = React.useState<Record<string, string>>({})

  const selectedWeek =
    model.weeks.find((week) => week.weekId === selectedWeekId) ?? model.weeks[0]
  const queueItems = buildQueueItems(model, selectedWeek)
  const selectedCell =
    getSelectedCell(model, selectedCellKey, cellEdits) ??
    getSelectedCell(model, firstCellKey(model), cellEdits)
  const teamNames = Array.from(new Set(model.monthRows.map((row) => row.teamName)))
  const shiftCodeOptions = buildShiftCodeOptions(model, selectedCell)
  const editedCellCount = Object.keys(cellEdits).length
  const derivedCoverage = React.useMemo(
    () => buildRosterDerivedCoverage(model, cellEdits),
    [model, cellEdits]
  )
  const gapRows = React.useMemo(
    () => buildRosterGapPreview(model, cellEdits),
    [model, cellEdits]
  )
  const publishedGapRows = React.useMemo(
    () => buildPublishedRosterGapPreview(model, publishedSnapshot),
    [model, publishedSnapshot]
  )
  const visibleGapRows =
    publishedSnapshot?.status === "published" ? publishedGapRows : gapRows
  const downstreamRequestRows = React.useMemo(
    () =>
      downstreamRequests.filter((request) => {
        if (request.status !== issueStatusFilter) {
          return false
        }
        if (issueActionFilter !== "all" && request.action_type !== issueActionFilter) {
          return false
        }
        if (issueEmployeeFilter !== "all" && request.employee_id !== issueEmployeeFilter) {
          return false
        }
        return true
      }),
    [downstreamRequests, issueActionFilter, issueEmployeeFilter, issueStatusFilter]
  )
  const downstreamIssueEmployeeOptions = React.useMemo(
    () => Array.from(new Set(downstreamRequests.map((request) => request.employee_id))),
    [downstreamRequests]
  )
  const revisionCellSourceByKey = React.useMemo(
    () => buildRevisionCellSourceByKey(revisionDraft),
    [revisionDraft]
  )
  const isRosterReadOnly =
    rosterLifecycleState === "published" || Boolean(lockState?.readOnly)

  React.useEffect(() => {
    let cancelled = false

    async function initializePublishState() {
      const [currentSnapshot, activeRevisionDraft, currentLock] = await Promise.all([
        fetchCurrentPublishedSnapshot(model),
        fetchActiveRevisionDraft(model),
        acquireRosterDraftLock(model),
      ])
      if (cancelled) {
        return
      }
      if (currentSnapshot?.status === "published") {
        setPublishedSnapshot(currentSnapshot)
        setRosterLifecycleState("published")
        setInspectorTab("preview")
      }
      if (activeRevisionDraft?.status === "draft") {
        setRevisionDraft(activeRevisionDraft)
        setRosterLifecycleState("revision_draft")
        setInspectorTab("preview")
        setLockState(null)
        return
      }
      if (currentLock) {
        setLockState(currentLock)
        if (currentLock.readOnly) {
          setPublishMessage(currentLock.message)
        }
      }
    }

    initializePublishState()

    return () => {
      cancelled = true
    }
  }, [model])

  React.useEffect(() => {
    let cancelled = false

    async function loadDownstreamRequests() {
      const rows = await fetchDownstreamRosterRequests(model)
      if (!cancelled) {
        setDownstreamRequests(rows)
      }
    }

    void loadDownstreamRequests()

    return () => {
      cancelled = true
    }
  }, [model, publishedSnapshot?.published?.version_id])

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

  function selectGapRelatedCell(employeeId: string, date: string) {
    locateCell(employeeId, date, "week")
    setInspectorTab("detail")
  }

  function locateDownstreamRequest(request: DownstreamRosterRequestIntent) {
    locateCell(request.employee_id, request.business_date, "week")
    setInspectorTab("detail")
  }

  function updateCellDraftEdit(key: string, nextEdit: RosterCellDraftEdit) {
    if (isRosterReadOnly) {
      return
    }
    const selected = getSelectedCell(model, key, cellEdits)
    if (!selected || selected.originalCell.status !== "copied") {
      return
    }

    setRosterLifecycleState(revisionDraft ? "revision_draft" : "draft")
    setCellEdits((current) => {
      const generatedShiftCode = selected.originalCell.shiftCode ?? ""
      const normalizedNote = nextEdit.note.trim()
      if (nextEdit.shiftCode === generatedShiftCode && !normalizedNote) {
        const rest = { ...current }
        delete rest[key]
        return rest
      }

      return {
        ...current,
        [key]: {
          shiftCode: nextEdit.shiftCode,
          note: normalizedNote,
        },
      }
    })
  }

  function resetCellDraftEdit(key: string) {
    if (isRosterReadOnly) {
      return
    }
    setRosterLifecycleState(revisionDraft ? "revision_draft" : "draft")
    setCellEdits((current) => {
      const rest = { ...current }
      delete rest[key]
      return rest
    })
  }

  async function publishCurrentRosterDraft() {
    if (revisionDraft) {
      await publishRevisionDraft()
      return
    }
    if (isRosterReadOnly || rosterLifecycleState === "publishing") {
      return
    }
    setRosterLifecycleState("publishing")
    setPublishMessage(null)
    setInspectorOpen(true)
    setInspectorTab("preview")

    try {
      const response = await fetch(buildRosterPublishApiUrl("/api/v1/roster-drafts/publish"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildRosterPublishPayload(model, cellEdits)),
      })
      const payload = await response.json()
      if (!response.ok) {
        const message =
          payload?.error?.message ?? payload?.detail?.error?.message ?? "发布未完成"
        setPublishMessage(message)
        if (response.status === 409) {
          setLockState({
            acquired: false,
            readOnly: true,
            message,
          })
        }
        setRosterLifecycleState("draft")
        return
      }

      setPublishedSnapshot(normalizePublishedRosterSnapshot(payload))
      setRosterLifecycleState("published")
      setPublishMessage("已发布为当前正式班表")
    } catch {
      setPublishMessage("发布服务暂时不可用")
      setRosterLifecycleState("draft")
    }
  }

  async function createRosterRevisionDraft() {
    if (!publishedSnapshot?.published || rosterLifecycleState === "publishing") {
      return
    }
    setRosterLifecycleState("publishing")
    setPublishMessage(null)
    setInspectorOpen(true)
    setInspectorTab("preview")

    try {
      const response = await fetch(
        buildRosterPublishApiUrl("/api/v1/roster-drafts/revisions/create"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            business_month: model.targetMonth,
            project_id: model.project.projectId,
            workplace_id: model.project.workplaceName,
            team_id: ROSTER_TEAM_ID,
            actor_id: ROSTER_PUBLISH_ACTOR_ID,
            occurred_at: currentLocalIsoMinute(),
            revision_version_id: buildRosterRevisionVersionId(model.targetMonth),
          }),
        }
      )
      const payload = await response.json()
      if (!response.ok) {
        setPublishMessage(
          payload?.error?.message ?? payload?.detail?.error?.message ?? "修订草稿未创建"
        )
        setRosterLifecycleState("published")
        return
      }

      setRevisionDraft(normalizeRosterRevisionDraft(payload))
      setCellEdits({})
      setLockState(null)
      setPublishMessage("修订草稿已创建")
      setRosterLifecycleState("revision_draft")
    } catch {
      setPublishMessage("修订草稿服务暂时不可用")
      setRosterLifecycleState("published")
    }
  }

  async function publishRevisionDraft() {
    if (!revisionDraft?.version || rosterLifecycleState === "publishing") {
      return
    }
    setRosterLifecycleState("publishing")
    setPublishMessage(null)
    setInspectorOpen(true)
    setInspectorTab("preview")

    try {
      const response = await fetch(buildRosterPublishApiUrl("/api/v1/roster-drafts/publish"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          buildRosterPublishPayload(model, cellEdits, revisionDraft)
        ),
      })
      const payload = await response.json()
      if (!response.ok) {
        setPublishMessage(
          payload?.error?.message ?? payload?.detail?.error?.message ?? "修订发布未完成"
        )
        setRosterLifecycleState("revision_draft")
        return
      }

      setPublishedSnapshot(normalizePublishedRosterSnapshot(payload))
      setRevisionDraft(null)
      setCellEdits({})
      setPublishMessage("修订已发布为当前正式班表")
      setRosterLifecycleState("published")
      await refreshDownstreamRequests()
    } catch {
      setPublishMessage("修订发布服务暂时不可用")
      setRosterLifecycleState("revision_draft")
    }
  }

  async function resolveDownstreamRequest(
    request: DownstreamRosterRequestIntent,
    schedulerResolutionNote: string
  ) {
    const linkedVersionId =
      revisionDraft?.version?.version_id ?? publishedSnapshot?.published?.version_id
    if (!linkedVersionId) {
      setPublishMessage("先创建修订草稿并重新发布后，再关闭处理意图")
      setInspectorOpen(true)
      setInspectorTab("queue")
      return
    }
    if (!schedulerResolutionNote.trim()) {
      setPublishMessage("关闭问题前必须填写处理说明")
      setInspectorOpen(true)
      setInspectorTab("queue")
      return
    }

    try {
      const response = await fetch(
        buildRosterPublishApiUrl(`/api/v1/roster-requests/${encodeURIComponent(request.request_id)}/resolve`),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resolver_id: ROSTER_PUBLISH_ACTOR_ID,
            resolved_at: currentLocalIsoMinute(),
            linked_revision_version_id: linkedVersionId,
            scheduler_resolution_note: schedulerResolutionNote,
          }),
        }
      )
      if (!response.ok) {
        setPublishMessage("处理意图未关闭")
        return
      }
      await refreshDownstreamRequests()
      setResolutionNotes((current) => {
        const next = { ...current }
        delete next[request.request_id]
        return next
      })
      setPublishMessage("处理意图已关闭")
    } catch {
      setPublishMessage("处理队列服务暂时不可用")
    }
  }

  async function refreshDownstreamRequests() {
    setDownstreamRequests(await fetchDownstreamRosterRequests(model))
  }

  async function releaseOwnRosterLock() {
    const released = await releaseRosterDraftLock(model)
    if (released) {
      setLockState(released)
      setPublishMessage("编辑锁已释放")
    }
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
          editedCellCount={editedCellCount}
          rosterLifecycleState={rosterLifecycleState}
          isRosterReadOnly={isRosterReadOnly}
          lockState={lockState}
          publishMessage={publishMessage}
          derivedCoverage={derivedCoverage}
          gapRows={visibleGapRows}
          revisionDraft={revisionDraft}
          onPublishCurrentRosterDraft={publishCurrentRosterDraft}
          onCreateRosterRevisionDraft={createRosterRevisionDraft}
          onPublishRevisionDraft={publishRevisionDraft}
          onReleaseOwnRosterLock={releaseOwnRosterLock}
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
                cellEdits={cellEdits}
                selectedCellKey={selectedCellKey}
                onLocateCell={(employeeId, date) => locateCell(employeeId, date, "month")}
              />
            </TabsContent>
            <TabsContent value="week" className="m-0 size-full">
              <WeekScheduleGrid
                model={model}
                week={selectedWeek}
                cellEdits={cellEdits}
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
          editedCellCount={editedCellCount}
          rosterLifecycleState={rosterLifecycleState}
          isRosterReadOnly={isRosterReadOnly}
          derivedCoverage={derivedCoverage}
        gapRows={visibleGapRows}
        downstreamRequestCount={downstreamRequestRows.length}
        onOpenInspector={() => setInspectorOpen(true)}
      />
      </div>

      <RosterInspectorDrawer
        selectedCell={selectedCell}
        items={queueItems}
        shiftCodeOptions={shiftCodeOptions}
        rosterLifecycleState={rosterLifecycleState}
        isRosterReadOnly={isRosterReadOnly}
        publishedSnapshot={publishedSnapshot}
        revisionDraft={revisionDraft}
        revisionCellSourceByKey={revisionCellSourceByKey}
        publishMessage={publishMessage}
        derivedCoverage={derivedCoverage}
        gapRows={publishedGapRows}
        draftGapRows={gapRows}
        downstreamRequests={downstreamRequestRows}
        downstreamIssueEmployeeOptions={downstreamIssueEmployeeOptions}
        issueStatusFilter={issueStatusFilter}
        issueActionFilter={issueActionFilter}
        issueEmployeeFilter={issueEmployeeFilter}
        resolutionNotes={resolutionNotes}
        editedCellCount={editedCellCount}
        activeTab={inspectorTab}
        onActiveTabChange={setInspectorTab}
        onIssueStatusFilterChange={setIssueStatusFilter}
        onIssueActionFilterChange={setIssueActionFilter}
        onIssueEmployeeFilterChange={setIssueEmployeeFilter}
        onResolutionNoteChange={(requestId, note) =>
          setResolutionNotes((current) => ({ ...current, [requestId]: note }))
        }
        onUpdateCellDraftEdit={updateCellDraftEdit}
        onResetCellDraftEdit={resetCellDraftEdit}
        onLocateCell={locateCell}
        onSelectRelatedCell={selectGapRelatedCell}
        onLocateDownstreamRequest={locateDownstreamRequest}
        onResolveDownstreamRequest={resolveDownstreamRequest}
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
  editedCellCount,
  rosterLifecycleState,
  isRosterReadOnly,
  lockState,
  publishMessage,
  derivedCoverage,
  gapRows,
  revisionDraft,
  onPublishCurrentRosterDraft,
  onCreateRosterRevisionDraft,
  onPublishRevisionDraft,
  onReleaseOwnRosterLock,
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
  editedCellCount: number
  rosterLifecycleState: RosterLifecycleState
  isRosterReadOnly: boolean
  lockState: RosterLockState | null
  publishMessage: string | null
  derivedCoverage: RosterDerivedCoverage
  gapRows: RosterGapPreviewRow[]
  revisionDraft: RosterRevisionDraft | null
  onPublishCurrentRosterDraft: () => void
  onCreateRosterRevisionDraft: () => void
  onPublishRevisionDraft: () => void
  onReleaseOwnRosterLock: () => void
  onOpenInspector: () => void
}) {
  const shortageCount = gapRows.filter((row) => row.status === "shortage").length
  const lifecycleLabel =
    rosterLifecycleState === "published"
      ? "已发布"
      : rosterLifecycleState === "publishing"
        ? "发布中"
        : rosterLifecycleState === "revision_draft"
          ? "修订草稿"
        : isRosterReadOnly
          ? "只读"
          : "草稿"
  const canCreateRevision = rosterLifecycleState === "published"
  const publishButtonLabel =
    rosterLifecycleState === "revision_draft" ? "重新发布修订" : "发布当前草稿"
  const publishButtonAction =
    rosterLifecycleState === "revision_draft"
      ? onPublishRevisionDraft
      : onPublishCurrentRosterDraft

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
        <Badge variant={rosterLifecycleState === "draft" ? "outline" : "default"}>
          {lifecycleLabel}
        </Badge>
        <Badge variant="outline">班次数 {derivedCoverage.totalShiftCount}</Badge>
        <Badge variant="outline">半小时覆盖 {derivedCoverage.coveredSlotCount}</Badge>
        <Badge variant={shortageCount > 0 ? "default" : "outline"}>
          缺口 {shortageCount}
        </Badge>
        {editedCellCount > 0 && (
          <Badge variant="outline">已调整 {editedCellCount}</Badge>
        )}
        <Button variant="outline" onClick={onOpenInspector}>
          详情与队列
          <Badge variant="secondary">{queueCount}</Badge>
        </Button>
        {lockState?.lock && !lockState.readOnly ? (
          <Button type="button" variant="outline" onClick={onReleaseOwnRosterLock}>
            释放编辑锁
          </Button>
        ) : null}
        {canCreateRevision ? (
          <Button
            type="button"
            variant="outline"
            onClick={onCreateRosterRevisionDraft}
            title={revisionDraft?.version?.version_id ?? publishMessage ?? undefined}
          >
            创建修订草稿
          </Button>
        ) : null}
        <Button
          type="button"
          variant="outline"
          onClick={publishButtonAction}
          disabled={
            rosterLifecycleState === "revision_draft"
              ? false
              : isRosterReadOnly || rosterLifecycleState === "publishing"
          }
          title={publishMessage ?? undefined}
        >
          {publishButtonLabel}
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
  cellEdits,
  selectedCellKey,
  onLocateCell,
}: {
  model: RosterDraftViewModel
  cellEdits: Record<string, RosterCellDraftEdit>
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
              {row.cells.map((cell) => {
                const key = cellKey(row.employeeId, cell.date)
                const effectiveCell = getEffectiveCell(cell, key, cellEdits)
                const hasDraftEdit = Boolean(cellEdits[key])

                return (
                  <button
                    key={cell.date}
                    data-roster-cell-key={key}
                    type="button"
                    onClick={() => onLocateCell(row.employeeId, cell.date)}
                    className={cn(
                      "min-h-11 border-r border-b px-1 text-xs transition hover:bg-muted",
                      selectedCellKey === key && "ring-2 ring-ring ring-inset"
                    )}
                    title={`${row.employeeName} ${cell.date} ${effectiveCell.shiftCode ?? statusLabels[effectiveCell.status]}`}
                  >
                    <span
                      className={cn(
                        "relative mx-auto flex size-8 items-center justify-center rounded-md border text-[11px] font-medium",
                        statusClasses[effectiveCell.status]
                      )}
                    >
                      {effectiveCell.shiftCode ?? (effectiveCell.status === "exception" ? "!" : "待")}
                      {hasDraftEdit ? (
                        <span className="absolute -right-1 -top-1 rounded-sm bg-primary px-0.5 text-[9px] leading-3 text-primary-foreground">
                          改
                        </span>
                      ) : null}
                    </span>
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

function WeekScheduleGrid({
  model,
  week,
  cellEdits,
  selectedCellKey,
  onLocateCell,
}: {
  model: RosterDraftViewModel
  week?: RosterWeek
  cellEdits: Record<string, RosterCellDraftEdit>
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
                const key = cellKey(row.employeeId, day.date)
                const effectiveCell = cell ? getEffectiveCell(cell, key, cellEdits) : undefined
                const detail = model.weekDetails.find(
                  (item) =>
                    item.employeeId === row.employeeId && item.businessDate === day.date
                )

                return (
                  <button
                    key={day.date}
                    data-roster-cell-key={key}
                    type="button"
                    onClick={() => onLocateCell(row.employeeId, day.date)}
                    className={cn(
                      "min-h-24 border-r border-b p-2 text-left transition hover:bg-muted/70",
                      selectedCellKey === key && "ring-2 ring-ring ring-inset"
                    )}
                  >
                    <ShiftBlock
                      cell={effectiveCell}
                      detail={detail}
                      draftEdit={cellEdits[key]}
                    />
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
  draftEdit,
}: {
  cell?: RosterMonthCell
  detail?: RosterWeekDetail
  draftEdit?: RosterCellDraftEdit
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
      {draftEdit ? (
        <Badge variant="secondary" className="mt-2">
          已调整
        </Badge>
      ) : null}
      <div className="mt-1 text-xs">{detail?.intervalLabel ?? "-"}</div>
      <div className="mt-2 text-[11px] opacity-80">
        来源 {detail?.sourceDate ?? cell.sourceDate ?? "-"}
      </div>
      <div className="mt-1 line-clamp-2 text-[11px] opacity-80">
        {draftEdit?.note || detail?.reason || cell.reason || statusLabels[cell.status]}
      </div>
    </div>
  )
}

function RosterBoardStatusbar({
  model,
  selectedCell,
  queueCount,
  editedCellCount,
  rosterLifecycleState,
  isRosterReadOnly,
  derivedCoverage,
  gapRows,
  downstreamRequestCount,
  onOpenInspector,
}: {
  model: RosterDraftViewModel
  selectedCell?: SelectedCell
  queueCount: number
  editedCellCount: number
  rosterLifecycleState: RosterLifecycleState
  isRosterReadOnly: boolean
  derivedCoverage: RosterDerivedCoverage
  gapRows: RosterGapPreviewRow[]
  downstreamRequestCount: number
  onOpenInspector: () => void
}) {
  const shortageCount = gapRows.filter((row) => row.status === "shortage").length
  const lifecycleLabel =
    rosterLifecycleState === "published"
      ? "已发布快照"
      : rosterLifecycleState === "publishing"
        ? "发布中"
        : isRosterReadOnly
          ? "只读"
          : "草稿"

  return (
    <div
      data-slot="roster-board-statusbar"
      className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t bg-background px-4 py-2 text-xs text-muted-foreground"
    >
      <div className="flex min-w-0 flex-wrap items-center gap-3">
        <span>{model.summary.employeeCount} 人</span>
        <span>{model.summary.generatedShiftCount} 格已生成</span>
        <span>{editedCellCount} 格已调整</span>
        <span>{lifecycleLabel}</span>
        <span>{derivedCoverage.totalShiftCount} 班次</span>
        <span>{derivedCoverage.coveredSlotCount} 个半小时覆盖点</span>
        <span>{shortageCount} 个缺口</span>
        <span>{downstreamRequestCount} 个下游处理</span>
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
  shiftCodeOptions,
  rosterLifecycleState,
  isRosterReadOnly,
  publishedSnapshot,
  revisionDraft,
  revisionCellSourceByKey,
  publishMessage,
  derivedCoverage,
  gapRows,
  draftGapRows,
  downstreamRequests,
  downstreamIssueEmployeeOptions,
  issueStatusFilter,
  issueActionFilter,
  issueEmployeeFilter,
  resolutionNotes,
  editedCellCount,
  activeTab,
  onActiveTabChange,
  onIssueStatusFilterChange,
  onIssueActionFilterChange,
  onIssueEmployeeFilterChange,
  onResolutionNoteChange,
  onUpdateCellDraftEdit,
  onResetCellDraftEdit,
  onLocateCell,
  onSelectRelatedCell,
  onLocateDownstreamRequest,
  onResolveDownstreamRequest,
}: {
  selectedCell?: SelectedCell
  items: QueueItem[]
  shiftCodeOptions: ShiftCodeOption[]
  rosterLifecycleState: RosterLifecycleState
  isRosterReadOnly: boolean
  publishedSnapshot: PublishedRosterSnapshot | null
  revisionDraft: RosterRevisionDraft | null
  revisionCellSourceByKey: Map<string, RosterRevisionCellSource>
  publishMessage: string | null
  derivedCoverage: RosterDerivedCoverage
  gapRows: RosterGapPreviewRow[]
  draftGapRows: RosterGapPreviewRow[]
  downstreamRequests: DownstreamRosterRequestIntent[]
  downstreamIssueEmployeeOptions: string[]
  issueStatusFilter: DownstreamRosterRequestIntent["status"]
  issueActionFilter: string
  issueEmployeeFilter: string
  resolutionNotes: Record<string, string>
  editedCellCount: number
  activeTab: WorkbenchInspectorTab
  onActiveTabChange: (tab: WorkbenchInspectorTab) => void
  onIssueStatusFilterChange: (status: DownstreamRosterRequestIntent["status"]) => void
  onIssueActionFilterChange: (action: string) => void
  onIssueEmployeeFilterChange: (employeeId: string) => void
  onResolutionNoteChange: (requestId: string, note: string) => void
  onUpdateCellDraftEdit: (key: string, edit: RosterCellDraftEdit) => void
  onResetCellDraftEdit: (key: string) => void
  onLocateCell: (employeeId: string, date: string, view?: WorkbenchView) => void
  onSelectRelatedCell: (employeeId: string, date: string) => void
  onLocateDownstreamRequest: (request: DownstreamRosterRequestIntent) => void
  onResolveDownstreamRequest: (
    request: DownstreamRosterRequestIntent,
    schedulerResolutionNote: string
  ) => void
}) {
  return (
    <DrawerContent
      data-slot="roster-inspector-drawer"
      className="sm:max-w-md"
    >
      <DrawerHeader className="border-b">
        <DrawerTitle>详情与队列</DrawerTitle>
        <DrawerDescription>
          查看格子详情，生成格子可做当前草稿内的受控调整。
        </DrawerDescription>
      </DrawerHeader>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <Tabs
          value={activeTab}
          onValueChange={(value) => onActiveTabChange(value as WorkbenchInspectorTab)}
          className="flex min-h-0 flex-col gap-4"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="detail">格子详情</TabsTrigger>
            <TabsTrigger value="preview">发布预览</TabsTrigger>
            <TabsTrigger value="gaps">缺口</TabsTrigger>
            <TabsTrigger value="queue">处理队列</TabsTrigger>
          </TabsList>
          <TabsContent value="detail" className="m-0">
            <div className="flex flex-col gap-4">
              <CellInspectorPanel selectedCell={selectedCell} />
              <RosterCellEditPanel
                selectedCell={selectedCell}
                shiftCodeOptions={shiftCodeOptions}
                isRosterReadOnly={isRosterReadOnly}
                onUpdateCellDraftEdit={onUpdateCellDraftEdit}
                onResetCellDraftEdit={onResetCellDraftEdit}
              />
            </div>
          </TabsContent>
          <TabsContent value="preview" className="m-0">
            <RosterReleasePreviewPanel
              rosterLifecycleState={rosterLifecycleState}
              publishedSnapshot={publishedSnapshot}
              revisionDraft={revisionDraft}
              revisionCellSourceByKey={revisionCellSourceByKey}
              publishMessage={publishMessage}
              derivedCoverage={derivedCoverage}
              editedCellCount={editedCellCount}
            />
          </TabsContent>
          <TabsContent value="gaps" className="m-0">
            <RosterGapWorkbenchPanel
              rows={
                publishedSnapshot?.status === "published" ? gapRows : draftGapRows
              }
              title={
                publishedSnapshot?.status === "published"
                  ? "正式班表缺口"
                  : "缺口队列"
              }
              description={
                publishedSnapshot?.status === "published"
                  ? "Forecast / Arranged / Actual，Arranged 从正式版派生。"
                  : "Forecast / Arranged / Actual"
              }
              missingPublishedNotice={
                publishedSnapshot?.status === "published"
                  ? null
                  : "先发布正式班表后，可查看基于当前正式版的正式班表缺口。"
              }
              fallbackEmployeeId={selectedCell?.employeeId}
              onLocateCell={onLocateCell}
              onSelectRelatedCell={onSelectRelatedCell}
            />
          </TabsContent>
          <TabsContent value="queue" className="m-0">
            <div className="grid gap-4">
              <DownstreamIssueWorkspacePanel
                requests={downstreamRequests}
                employeeOptions={downstreamIssueEmployeeOptions}
                issueStatusFilter={issueStatusFilter}
                issueActionFilter={issueActionFilter}
                issueEmployeeFilter={issueEmployeeFilter}
                resolutionNotes={resolutionNotes}
                onIssueStatusFilterChange={onIssueStatusFilterChange}
                onIssueActionFilterChange={onIssueActionFilterChange}
                onIssueEmployeeFilterChange={onIssueEmployeeFilterChange}
                onResolutionNoteChange={onResolutionNoteChange}
                onLocateRequest={onLocateDownstreamRequest}
                onResolveRequest={onResolveDownstreamRequest}
              />
              <WorkbenchQueuePanel items={items} onLocateCell={onLocateCell} />
            </div>
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

function RosterReleasePreviewPanel({
  rosterLifecycleState,
  publishedSnapshot,
  revisionDraft,
  revisionCellSourceByKey,
  publishMessage,
  derivedCoverage,
  editedCellCount,
}: {
  rosterLifecycleState: RosterLifecycleState
  publishedSnapshot: PublishedRosterSnapshot | null
  revisionDraft: RosterRevisionDraft | null
  revisionCellSourceByKey: Map<string, RosterRevisionCellSource>
  publishMessage: string | null
  derivedCoverage: RosterDerivedCoverage
  editedCellCount: number
}) {
  if (rosterLifecycleState === "published" && publishedSnapshot?.snapshot) {
    return (
      <div
        data-slot="roster-published-snapshot"
        className="rounded-lg border bg-card p-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-medium">已发布快照</div>
            <div className="mt-1 text-xs text-muted-foreground">
              {publishedSnapshot.published?.version_id} / {publishedSnapshot.snapshot.created_at}
            </div>
          </div>
          <Badge>当前正式班表</Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-md border p-3">
            <div className="text-xs text-muted-foreground">班次数</div>
            <div className="mt-1 text-lg font-semibold">
              {sumPublishedShiftCounts(publishedSnapshot.snapshot.shift_counts)}
            </div>
          </div>
          <div className="rounded-md border p-3">
            <div className="text-xs text-muted-foreground">半小时覆盖</div>
            <div className="mt-1 text-lg font-semibold">
              {publishedSnapshot.snapshot.arranged_coverage.length}
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-2 text-sm">
          <InspectorRow
            label="上一版来源"
            value={
              publishedSnapshot.published?.parent_version_id ??
              publishedSnapshot.published?.supersedes_version_id ??
              "-"
            }
          />
          <InspectorRow
            label="本次修改摘要"
            value={`${publishedSnapshot.snapshot.diff_summary.changed_cell_ids.length} 格变更`}
          />
        </div>

        {publishedSnapshot.snapshot.soft_risks.length > 0 ? (
          <div className="mt-4">
            <div className="text-xs font-medium text-muted-foreground">软风险</div>
            <div className="mt-2 grid gap-2">
              {publishedSnapshot.snapshot.soft_risks.map((risk, index) => (
                <div
                  key={`${risk.code}-${risk.assignment_id ?? index}`}
                  className="rounded-md border px-3 py-2 text-sm"
                >
                  <div className="font-medium">{risk.code}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {risk.message}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-4">
          <div className="text-xs font-medium text-muted-foreground">班种分布</div>
          <div className="mt-2 grid gap-2">
            {Object.entries(publishedSnapshot.snapshot.shift_counts).map(
              ([shiftCode, count]) => (
                <div
                  key={shiftCode}
                  className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                >
                  <span>{shiftCode}</span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              )
            )}
          </div>
        </div>

        <div className="mt-4">
          <div className="text-xs font-medium text-muted-foreground">覆盖变化</div>
          <div className="mt-2 grid gap-2">
            {publishedSnapshot.snapshot.diff_summary.coverage_deltas
              .slice(0, 6)
              .map((delta) => (
                <div
                  key={delta.slot_start_at}
                  className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                >
                  <span>{formatPublishedSlot(delta.slot_start_at)}</span>
                  <span className="font-medium">
                    {delta.baseline_count} → {delta.candidate_count}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    )
  }

  if (rosterLifecycleState === "revision_draft" && revisionDraft?.version) {
    const sourceVersion =
      revisionDraft.version.parent_version_id ??
      revisionDraft.version.supersedes_version_id ??
      publishedSnapshot?.published?.version_id ??
      "-"

    return (
      <div
        data-slot="roster-publish-preview-panel"
        className="rounded-lg border bg-card p-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-medium">发布预览</div>
            <div className="mt-1 text-xs text-muted-foreground">
              {revisionDraft.version.version_id}
            </div>
          </div>
          <Badge>修订草稿</Badge>
        </div>

        <div className="mt-4 grid gap-2 text-sm">
          <InspectorRow label="上一版来源" value={sourceVersion} />
          <InspectorRow
            label="本次修改摘要"
            value={`${editedCellCount} 格已调整 / ${revisionCellSourceByKey.size} 格继承`}
          />
        </div>

        {publishMessage ? (
          <div className="mt-3 rounded-md border bg-muted/40 px-3 py-2 text-sm">
            {publishMessage}
          </div>
        ) : null}

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-md border p-3">
            <div className="text-xs text-muted-foreground">班次数</div>
            <div className="mt-1 text-lg font-semibold">
              {derivedCoverage.totalShiftCount}
            </div>
          </div>
          <div className="rounded-md border p-3">
            <div className="text-xs text-muted-foreground">半小时覆盖</div>
            <div className="mt-1 text-lg font-semibold">
              {derivedCoverage.coveredSlotCount}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-xs font-medium text-muted-foreground">班种分布</div>
          <div className="mt-2 grid gap-2">
            {derivedCoverage.shiftCounts.map((item) => (
              <div
                key={item.shiftCode}
                className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm"
              >
                <div className="min-w-0">
                  <div className="font-medium">{item.shiftCode}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {item.intervalLabel}
                  </div>
                </div>
                <Badge variant="secondary">{item.count}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      data-slot="roster-publish-preview-panel"
      className="rounded-lg border bg-card p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-medium">发布预览</div>
          <div className="mt-1 text-xs text-muted-foreground">
            本地预览 / {editedCellCount} 格已调整
          </div>
        </div>
        <Badge variant={rosterLifecycleState === "draft" ? "outline" : "default"}>
          {rosterLifecycleState === "publishing" ? "发布中" : "草稿"}
        </Badge>
      </div>
      {publishMessage ? (
        <div className="mt-3 rounded-md border bg-muted/40 px-3 py-2 text-sm">
          {publishMessage}
        </div>
      ) : null}

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-md border p-3">
          <div className="text-xs text-muted-foreground">班次数</div>
          <div className="mt-1 text-lg font-semibold">
            {derivedCoverage.totalShiftCount}
          </div>
        </div>
        <div className="rounded-md border p-3">
          <div className="text-xs text-muted-foreground">半小时覆盖</div>
          <div className="mt-1 text-lg font-semibold">
            {derivedCoverage.coveredSlotCount}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <div>
          <div className="text-xs font-medium text-muted-foreground">班种分布</div>
          <div className="mt-2 grid gap-2">
            {derivedCoverage.shiftCounts.map((item) => (
              <div
                key={item.shiftCode}
                className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm"
              >
                <div className="min-w-0">
                  <div className="font-medium">{item.shiftCode}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {item.intervalLabel}
                  </div>
                </div>
                <Badge variant="secondary">{item.count}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-medium text-muted-foreground">覆盖高峰</div>
          <div className="mt-2 grid gap-2">
            {derivedCoverage.halfHourCoverage.slice(0, 8).map((item) => (
              <div
                key={item.slotLabel}
                className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm"
              >
                <span>{item.slotLabel}</span>
                <span className="font-medium">{item.arrangedCount} 人</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function RosterGapWorkbenchPanel({
  rows,
  title = "缺口队列",
  description = "Forecast / Arranged / Actual",
  missingPublishedNotice,
  fallbackEmployeeId,
  onLocateCell,
  onSelectRelatedCell,
}: {
  rows: RosterGapPreviewRow[]
  title?: string
  description?: string
  missingPublishedNotice?: string | null
  fallbackEmployeeId?: string
  onLocateCell: (employeeId: string, date: string, view?: WorkbenchView) => void
  onSelectRelatedCell: (employeeId: string, date: string) => void
}) {
  return (
    <div data-slot="roster-gap-workbench-panel" className="rounded-lg border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-medium">{title}</div>
          <div className="mt-1 text-xs text-muted-foreground">
            {description}
          </div>
        </div>
        <Badge variant="outline">{rows.length}</Badge>
      </div>

      {missingPublishedNotice ? (
        <div className="mt-4 rounded-md border bg-muted/40 p-3 text-sm text-muted-foreground">
          {missingPublishedNotice}
        </div>
      ) : null}

      <div className="mt-4 flex flex-col gap-3">
        {rows.map((row) => {
          const primaryEmployeeId = row.relatedEmployeeIds[0]

          return (
            <div key={row.id} className="rounded-md border p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium">
                    {row.businessDate} / {row.slotLabel}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {row.reason}
                  </div>
                </div>
                <Badge variant={row.status === "shortage" ? "default" : "outline"}>
                  {gapStatusLabels[row.status]}
                </Badge>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
                <div className="rounded-md border p-2">
                  <div className="text-xs text-muted-foreground">Forecast</div>
                  <div className="mt-1 font-semibold">{row.forecastAgents}</div>
                </div>
                <div className="rounded-md border p-2">
                  <div className="text-xs text-muted-foreground">Arranged</div>
                  <div className="mt-1 font-semibold">{row.arrangedAgents}</div>
                </div>
                <div className="rounded-md border p-2">
                  <div className="text-xs text-muted-foreground">Actual</div>
                  <div className="mt-1 font-semibold">{row.actualAgents}</div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                <span>
                  F-A {row.forecastGap} / A-Actual {row.actualGap}
                </span>
                {primaryEmployeeId ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      onLocateCell(primaryEmployeeId, row.businessDate, "week")
                    }
                  >
                    定位缺口
                  </Button>
                ) : null}
              </div>

              <RosterGapRelatedCellList
                row={row}
                fallbackEmployeeId={fallbackEmployeeId}
                onLocateCell={onLocateCell}
                onSelectRelatedCell={onSelectRelatedCell}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function RosterGapRelatedCellList({
  row,
  fallbackEmployeeId,
  onLocateCell,
  onSelectRelatedCell,
}: {
  row: RosterGapPreviewRow
  fallbackEmployeeId?: string
  onLocateCell: (employeeId: string, date: string, view?: WorkbenchView) => void
  onSelectRelatedCell: (employeeId: string, date: string) => void
}) {
  if (row.relatedCells.length === 0) {
    return (
      <div className="mt-3 rounded-md border bg-muted/40 p-3 text-sm">
        <div className="font-medium">当前无覆盖人员</div>
        <div className="mt-1 text-xs text-muted-foreground">
          该半小时没有已覆盖格子，本轮不提供可调格子。
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3"
          disabled={!fallbackEmployeeId}
          onClick={() => {
            if (fallbackEmployeeId) {
              onLocateCell(fallbackEmployeeId, row.businessDate, "week")
            }
          }}
        >
          定位当天
        </Button>
      </div>
    )
  }

  return (
    <div className="mt-3">
      <div className="text-xs font-medium text-muted-foreground">
        相关覆盖格子 / 复用格子详情
      </div>
      <div className="mt-2 flex flex-col gap-2">
        {row.relatedCells.map((cell) => (
          <Button
            key={`${row.id}-${cell.employeeId}`}
            type="button"
            variant="outline"
            onClick={() => onSelectRelatedCell(cell.employeeId, row.businessDate)}
            className="h-auto w-full justify-start p-2 text-left font-normal"
          >
            <div className="w-full">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate font-medium">{cell.employeeName}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {cell.teamName}
                  </div>
                </div>
                {cell.isDraftEdited ? (
                  <Badge variant="secondary">已调整</Badge>
                ) : null}
              </div>
              <div className="mt-2 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>{cell.shiftCode}</span>
                <span>{cell.intervalLabel}</span>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
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

function RosterCellEditPanel({
  selectedCell,
  shiftCodeOptions,
  isRosterReadOnly,
  onUpdateCellDraftEdit,
  onResetCellDraftEdit,
}: {
  selectedCell?: SelectedCell
  shiftCodeOptions: ShiftCodeOption[]
  isRosterReadOnly: boolean
  onUpdateCellDraftEdit: (key: string, edit: RosterCellDraftEdit) => void
  onResetCellDraftEdit: (key: string) => void
}) {
  if (!selectedCell) {
    return null
  }

  const key = cellKey(selectedCell.employeeId, selectedCell.date)
  const canEdit = selectedCell.originalCell.status === "copied"
  const currentShiftCode =
    selectedCell.draftEdit?.shiftCode ?? selectedCell.originalCell.shiftCode ?? ""
  const currentNote = selectedCell.draftEdit?.note ?? ""

  if (isRosterReadOnly) {
    return (
      <div
        data-slot="roster-cell-edit-panel"
        className="rounded-lg border bg-muted/40 p-4 text-sm"
      >
        <div className="font-medium">格子调整</div>
        <div className="mt-2 text-muted-foreground">
          当前版本只读。发布后如需调整，后续通过修订草稿入口处理。
        </div>
      </div>
    )
  }

  if (!canEdit) {
    return (
      <div
        data-slot="roster-cell-edit-panel"
        className="rounded-lg border bg-muted/40 p-4 text-sm"
      >
        <div className="font-medium">格子调整</div>
        <div className="mt-2 text-muted-foreground">
          异常和待确认格子不在本轮编辑，本轮保持只读，请从处理队列定位后继续补齐原因或来源。
        </div>
      </div>
    )
  }

  return (
    <div data-slot="roster-cell-edit-panel" className="rounded-lg border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-medium">格子调整</div>
          <div className="mt-1 text-xs text-muted-foreground">
            仅当前草稿预览，不写入生产数据。
          </div>
        </div>
        {selectedCell.draftEdit ? <Badge variant="secondary">已调整</Badge> : null}
      </div>

      <div className="mt-4 grid gap-3">
        <label className="grid gap-1.5 text-sm">
          <span className="text-muted-foreground">班种</span>
          <Select
            value={currentShiftCode}
            onValueChange={(shiftCode) =>
              onUpdateCellDraftEdit(key, {
                shiftCode,
                note: currentNote,
              })
            }
          >
            <SelectTrigger aria-label="班种">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start">
              {shiftCodeOptions.map((option) => (
                <SelectItem key={option.shiftCode} value={option.shiftCode}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <label className="grid gap-1.5 text-sm">
          <span className="text-muted-foreground">调整备注</span>
          <Input
            value={currentNote}
            onChange={(event) =>
              onUpdateCellDraftEdit(key, {
                shiftCode: currentShiftCode,
                note: event.target.value,
              })
            }
            placeholder="例如：排班师根据一线反馈调整"
          />
        </label>

        <div className="flex items-center justify-between gap-2">
          <div className="text-xs text-muted-foreground">
            生成值：{selectedCell.originalCell.shiftCode ?? "-"}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onResetCellDraftEdit(key)}
          >
            恢复生成值
          </Button>
        </div>
      </div>
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

function DownstreamIssueWorkspacePanel({
  requests,
  employeeOptions,
  issueStatusFilter,
  issueActionFilter,
  issueEmployeeFilter,
  resolutionNotes,
  onIssueStatusFilterChange,
  onIssueActionFilterChange,
  onIssueEmployeeFilterChange,
  onResolutionNoteChange,
  onLocateRequest,
  onResolveRequest,
}: {
  requests: DownstreamRosterRequestIntent[]
  employeeOptions: string[]
  issueStatusFilter: DownstreamRosterRequestIntent["status"]
  issueActionFilter: string
  issueEmployeeFilter: string
  resolutionNotes: Record<string, string>
  onIssueStatusFilterChange: (status: DownstreamRosterRequestIntent["status"]) => void
  onIssueActionFilterChange: (action: string) => void
  onIssueEmployeeFilterChange: (employeeId: string) => void
  onResolutionNoteChange: (requestId: string, note: string) => void
  onLocateRequest: (request: DownstreamRosterRequestIntent) => void
  onResolveRequest: (
    request: DownstreamRosterRequestIntent,
    schedulerResolutionNote: string
  ) => void
}) {
  return (
    <div
      data-slot="downstream-issue-workspace"
      className="rounded-lg border bg-card p-3"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-medium">下游问题工作区</div>
          <div className="mt-1 text-xs text-muted-foreground">
            小组长和一线登记的本地问题，定位到正式班表格子后进入修订。
          </div>
        </div>
        <Badge variant="secondary">{requests.length}</Badge>
      </div>
      <div className="mt-3 grid gap-2 @sm:grid-cols-3">
        <Tabs
          value={issueStatusFilter}
          onValueChange={(value) =>
            onIssueStatusFilterChange(value as DownstreamRosterRequestIntent["status"])
          }
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="open">待处理</TabsTrigger>
            <TabsTrigger value="resolved">已处理</TabsTrigger>
          </TabsList>
        </Tabs>
        <Select value={issueActionFilter} onValueChange={onIssueActionFilterChange}>
          <SelectTrigger className="h-9" aria-label="问题动作">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部动作</SelectItem>
            {Object.entries(requestLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={issueEmployeeFilter} onValueChange={onIssueEmployeeFilterChange}>
          <SelectTrigger className="h-9" aria-label="问题人员">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部人员</SelectItem>
            {employeeOptions.map((employeeId) => (
              <SelectItem key={employeeId} value={employeeId}>
                {employeeId}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mt-3 grid gap-2">
        {requests.length === 0 ? (
          <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
            暂无下游问题
          </div>
        ) : (
          requests.map((request) => (
            <div key={request.request_id} className="rounded-md border p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">
                    {request.employee_id} / {request.business_date}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {requestLabels[request.action_type]} · {request.requester_role}
                  </div>
                </div>
                <Badge variant="outline">{request.status}</Badge>
              </div>
              <div className="mt-2 text-sm">{request.note}</div>
              <div className="mt-2 grid gap-1 text-xs text-muted-foreground">
                <div>问题编号：{request.request_id}</div>
                <div>定位到正式班表格子：{request.roster_cell_id}</div>
                <div>登记时间：{request.created_at}</div>
                {request.status === "resolved" ? (
                  <>
                    <div>处理时间：{request.resolved_at ?? "-"}</div>
                    <div>关联修订：{request.linked_revision_version_id ?? "-"}</div>
                    <div>处理说明：{request.scheduler_resolution_note ?? "-"}</div>
                  </>
                ) : null}
              </div>
              {request.status === "open" ? (
                <textarea
                  className="mt-3 min-h-16 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={resolutionNotes[request.request_id] ?? ""}
                  onChange={(event) =>
                    onResolutionNoteChange(request.request_id, event.target.value)
                  }
                  placeholder="处理说明"
                />
              ) : null}
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onLocateRequest(request)}
                >
                  定位到正式班表格子
                </Button>
                {request.status === "open" ? (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() =>
                      onResolveRequest(
                        request,
                        resolutionNotes[request.request_id] ?? ""
                      )
                    }
                  >
                    关闭问题
                  </Button>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

async function fetchCurrentPublishedSnapshot(
  model: RosterDraftViewModel
): Promise<PublishedRosterSnapshot | null> {
  const params = new URLSearchParams({
    business_month: model.targetMonth,
    project_id: model.project.projectId,
    workplace_id: model.project.workplaceName,
    team_id: ROSTER_TEAM_ID,
  })
  try {
    const response = await fetch(
      buildRosterPublishApiUrl(
        `/api/v1/roster-drafts/current-published?${params.toString()}`
      ),
      { cache: "no-store" }
    )
    if (!response.ok) {
      return null
    }
    return normalizePublishedRosterSnapshot(await response.json())
  } catch {
    return null
  }
}

async function fetchDownstreamRosterRequests(
  model: RosterDraftViewModel
): Promise<DownstreamRosterRequestIntent[]> {
  const params = new URLSearchParams({
    business_month: model.targetMonth,
    project_id: model.project.projectId,
    workplace_id: model.project.workplaceName,
    team_id: ROSTER_TEAM_ID,
  })
  try {
    const response = await fetch(
      buildRosterPublishApiUrl(`/api/v1/roster-requests?${params.toString()}`),
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

async function fetchActiveRevisionDraft(
  model: RosterDraftViewModel
): Promise<RosterRevisionDraft | null> {
  const params = new URLSearchParams({
    business_month: model.targetMonth,
    project_id: model.project.projectId,
    workplace_id: model.project.workplaceName,
    team_id: ROSTER_TEAM_ID,
  })
  try {
    const response = await fetch(
      buildRosterPublishApiUrl(
        `/api/v1/roster-drafts/active-draft?${params.toString()}`
      ),
      { cache: "no-store" }
    )
    if (!response.ok) {
      return null
    }
    return normalizeRosterRevisionDraft(await response.json())
  } catch {
    return null
  }
}

async function acquireRosterDraftLock(
  model: RosterDraftViewModel
): Promise<RosterLockState | null> {
  try {
    const response = await fetch(
      buildRosterPublishApiUrl("/api/v1/roster-drafts/locks/acquire"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          version_id: buildRosterVersionId(model.targetMonth),
          actor_id: ROSTER_PUBLISH_ACTOR_ID,
          now: currentLocalIsoMinute(),
        }),
      }
    )
    const payload = await response.json()
    if (!response.ok) {
      return {
        acquired: false,
        readOnly: true,
        message: payload?.detail?.error?.message ?? "当前班表已被其他排班师锁定",
      }
    }
    return normalizeRosterLockState(payload)
  } catch {
    return null
  }
}

async function releaseRosterDraftLock(
  model: RosterDraftViewModel
): Promise<RosterLockState | null> {
  try {
    const response = await fetch(
      buildRosterPublishApiUrl("/api/v1/roster-drafts/locks/release"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          version_id: buildRosterVersionId(model.targetMonth),
          actor_id: ROSTER_PUBLISH_ACTOR_ID,
          now: currentLocalIsoMinute(),
        }),
      }
    )
    const payload = await response.json()
    if (!response.ok) {
      return {
        acquired: false,
        readOnly: true,
        message: payload?.detail?.error?.message ?? "编辑锁未释放",
      }
    }
    return normalizeRosterLockState(payload)
  } catch {
    return null
  }
}

function buildRosterPublishPayload(
  model: RosterDraftViewModel,
  cellEdits: Record<string, RosterCellDraftEdit>,
  revisionDraft?: RosterRevisionDraft | null
) {
  const intervalByShiftCode = buildShiftIntervalMap(model)
  const revisionCellSourceByKey = buildRevisionCellSourceByKey(revisionDraft)
  const cells = model.monthRows.flatMap((row) =>
    row.cells.flatMap((cell, index) => {
      const key = cellKey(row.employeeId, cell.date)
      const effectiveCell = getEffectiveCell(cell, key, cellEdits)
      if (effectiveCell.status !== "copied" || !effectiveCell.shiftCode) {
        return []
      }
      const revisionSource = revisionCellSourceByKey.get(key)
      const intervalLabel = intervalByShiftCode.get(effectiveCell.shiftCode)
      const interval = intervalLabel
        ? intervalLabelToIsoBounds(cell.date, intervalLabel)
        : null
      const assignmentKind = effectiveCell.shiftCode === "REST" ? "rest" : "shift"

      return [
        {
          cell_id: revisionSource?.cellId ?? `CELL-${row.employeeId}-${cell.date}`,
          assignment_id: `ASSIGN-${row.employeeId}-${cell.date}`,
          employee_id: row.employeeId,
          business_date: cell.date,
          sequence: index + 1,
          assignment_kind: assignmentKind,
          project_id: model.project.projectId,
          workplace_id: model.project.workplaceName,
          team_id: teamIdFromTeamName(row.teamName) ?? row.teamName,
          shift_code: effectiveCell.shiftCode,
          interval_start_at: interval?.startAt,
          interval_end_at: interval?.endAt,
          source_cell_id: revisionSource?.sourceCellId ?? undefined,
          manually_adjusted: Boolean(cellEdits[key]),
        },
      ]
    })
  )

  return {
    version_id: revisionDraft?.version?.version_id ?? buildRosterVersionId(model.targetMonth),
    actor_id: ROSTER_PUBLISH_ACTOR_ID,
    occurred_at: currentLocalIsoMinute(),
    business_month: model.targetMonth,
    project_id: model.project.projectId,
    workplace_id: model.project.workplaceName,
    team_id: ROSTER_TEAM_ID,
    valid_shift_codes: uniqueValues(cells.map((cell) => cell.shift_code)),
    required_coverage_slots: model.forecastIntervals.map((item) =>
      rosterSlotToIso(item.businessDate, item.slotLabel)
    ),
    employees: model.monthRows.map((row) => ({
      employee_id: row.employeeId,
      active: true,
      project_id: model.project.projectId,
      workplace_id: model.project.workplaceName,
      team_id: teamIdFromTeamName(row.teamName) ?? row.teamName,
      status: "active",
    })),
    cells,
  }
}

function normalizePublishedRosterSnapshot(payload: Partial<PublishedRosterSnapshot>): PublishedRosterSnapshot {
  return {
    status: payload.status ?? "missing",
    published: payload.published ?? null,
    snapshot: payload.snapshot ?? null,
    cells: payload.cells ?? [],
  }
}

function normalizeRosterRevisionDraft(payload: Partial<RosterRevisionDraft>): RosterRevisionDraft {
  return {
    status: payload.status ?? "missing",
    version: payload.version ?? null,
    cells: payload.cells ?? [],
  }
}

function normalizeRosterLockState(payload: RosterLockApiPayload): RosterLockState {
  return {
    acquired: Boolean(payload.acquired),
    readOnly: Boolean(payload.read_only),
    message: String(payload.message ?? ""),
    lock: payload.lock
      ? {
          versionId: String(payload.lock.version_id),
          actorId: String(payload.lock.actor_id),
          expiresAt: String(payload.lock.expires_at),
        }
      : undefined,
  }
}

function buildRosterPublishApiUrl(path: string): string {
  const base =
    process.env.NEXT_PUBLIC_BPO_API_BASE_URL?.replace(/\/$/, "") ??
    "http://127.0.0.1:8000"
  return `${base}${path.startsWith("/") ? path : `/${path}`}`
}

function buildRosterVersionId(targetMonth: string): string {
  return `ROSTER-${targetMonth}-DRAFT`
}

function buildRosterRevisionVersionId(targetMonth: string): string {
  return `ROSTER-${targetMonth}-REV-${currentLocalIsoMinute().replace(/[-:T]/g, "")}`
}

function buildRevisionCellSourceByKey(
  revisionDraft?: RosterRevisionDraft | null
): Map<string, RosterRevisionCellSource> {
  const revisionCellSourceByKey = new Map<string, RosterRevisionCellSource>()
  if (!revisionDraft) {
    return revisionCellSourceByKey
  }

  for (const cell of revisionDraft.cells) {
    revisionCellSourceByKey.set(cellKey(cell.employee_id, cell.business_date), {
      cellId: cell.cell_id,
      sourceCellId: cell.source_cell_id,
    })
  }

  return revisionCellSourceByKey
}

function currentLocalIsoMinute(): string {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60 * 1000
  return new Date(now.getTime() - offset).toISOString().slice(0, 16)
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

function addDateDays(date: string, days: number): string {
  const parsed = new Date(`${date}T00:00:00`)
  parsed.setDate(parsed.getDate() + days)
  return parsed.toISOString().slice(0, 10)
}

function uniqueValues<T>(values: T[]): T[] {
  return Array.from(new Set(values))
}

function sumPublishedShiftCounts(counts: Record<string, number>): number {
  return Object.values(counts).reduce((sum, count) => sum + count, 0)
}

function formatPublishedSlot(slotStartAt: string): string {
  return slotStartAt.replace("T", " ")
}

const ROSTER_PUBLISH_ACTOR_ID = "scheduler-1"
const ROSTER_TEAM_ID = "G1"

function teamIdFromTeamName(teamName: string): string | null {
  return teamName === "G1 投诉组" ? "G1" : teamName === "G2 在线组" ? "G2" : null
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

function getSelectedCell(
  model: RosterDraftViewModel,
  key: string,
  cellEdits: Record<string, RosterCellDraftEdit>
): SelectedCell | undefined {
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
    cell: getEffectiveCell(cell, key, cellEdits),
    originalCell: cell,
    draftEdit: cellEdits[key],
    detail: model.weekDetails.find(
      (item) => item.employeeId === row.employeeId && item.businessDate === date
    ),
  }
}

function getEffectiveCell(
  cell: RosterMonthCell,
  key: string,
  cellEdits: Record<string, RosterCellDraftEdit>
): RosterMonthCell {
  const edit = cellEdits[key]
  if (!edit || cell.status !== "copied") {
    return cell
  }

  return {
    ...cell,
    shiftCode: edit.shiftCode,
    reason: edit.note || "本地草稿调整",
  }
}

function buildShiftCodeOptions(
  model: RosterDraftViewModel,
  selectedCell?: SelectedCell
): ShiftCodeOption[] {
  const options = new Map<string, string>()

  for (const assignment of model.assignments) {
    options.set(
      assignment.shiftCode,
      `${assignment.shiftCode} / ${assignment.intervalLabel}`
    )
  }
  for (const detail of model.weekDetails) {
    if (detail.shiftCode) {
      options.set(
        detail.shiftCode,
        `${detail.shiftCode} / ${detail.intervalLabel ?? "班种"}`
      )
    }
  }

  const selectedShiftCode =
    selectedCell?.draftEdit?.shiftCode ?? selectedCell?.originalCell.shiftCode
  if (selectedShiftCode && !options.has(selectedShiftCode)) {
    options.set(selectedShiftCode, `${selectedShiftCode} / 当前班种`)
  }

  return Array.from(options, ([shiftCode, label]) => ({ shiftCode, label }))
}

function buildRosterDerivedCoverage(
  model: RosterDraftViewModel,
  cellEdits: Record<string, RosterCellDraftEdit>
): RosterDerivedCoverage {
  const intervalByShiftCode = buildShiftIntervalMap(model)
  const shiftCounts = new Map<string, ShiftCountSummary>()
  const halfHourCoverage = new Map<string, number>()

  for (const row of model.monthRows) {
    for (const cell of row.cells) {
      const key = cellKey(row.employeeId, cell.date)
      const effectiveCell = getEffectiveCell(cell, key, cellEdits)
      if (effectiveCell.status !== "copied" || !effectiveCell.shiftCode) {
        continue
      }

      const intervalLabel =
        intervalByShiftCode.get(effectiveCell.shiftCode) ?? "未配置时间段"
      const currentShift = shiftCounts.get(effectiveCell.shiftCode)
      shiftCounts.set(effectiveCell.shiftCode, {
        shiftCode: effectiveCell.shiftCode,
        intervalLabel,
        count: (currentShift?.count ?? 0) + 1,
      })

      for (const slotLabel of parseHalfHourSlots(intervalLabel)) {
        halfHourCoverage.set(
          slotLabel,
          (halfHourCoverage.get(slotLabel) ?? 0) + 1
        )
      }
    }
  }

  const sortedShiftCounts = Array.from(shiftCounts.values()).sort((left, right) =>
    left.shiftCode.localeCompare(right.shiftCode)
  )
  const sortedHalfHourCoverage = Array.from(
    halfHourCoverage,
    ([slotLabel, arrangedCount]) => ({ slotLabel, arrangedCount })
  ).sort((left, right) => slotStartMinutes(left.slotLabel) - slotStartMinutes(right.slotLabel))

  return {
    shiftCounts: sortedShiftCounts,
    halfHourCoverage: sortedHalfHourCoverage,
    totalShiftCount: sortedShiftCounts.reduce((sum, item) => sum + item.count, 0),
    coveredSlotCount: sortedHalfHourCoverage.length,
  }
}

function buildRosterGapPreview(
  model: RosterDraftViewModel,
  cellEdits: Record<string, RosterCellDraftEdit>
): RosterGapPreviewRow[] {
  const intervalByShiftCode = buildShiftIntervalMap(model)
  const arrangedBySlot = new Map<string, number>()
  const employeesBySlot = new Map<string, string[]>()
  const relatedCellsBySlot = new Map<string, RosterGapRelatedCell[]>()
  const actualBySlot = new Map(
    model.actualIntervals.map((item) => [
      dateSlotKey(item.businessDate, item.slotLabel),
      item,
    ])
  )

  for (const row of model.monthRows) {
    for (const cell of row.cells) {
      const key = cellKey(row.employeeId, cell.date)
      const effectiveCell = getEffectiveCell(cell, key, cellEdits)
      if (effectiveCell.status !== "copied" || !effectiveCell.shiftCode) {
        continue
      }

      const intervalLabel = intervalByShiftCode.get(effectiveCell.shiftCode)
      if (!intervalLabel) {
        continue
      }

      for (const slotLabel of parseHalfHourSlots(intervalLabel)) {
        const slotKey = dateSlotKey(cell.date, slotLabel)
        arrangedBySlot.set(slotKey, (arrangedBySlot.get(slotKey) ?? 0) + 1)
        employeesBySlot.set(slotKey, [
          ...(employeesBySlot.get(slotKey) ?? []),
          row.employeeId,
        ])
        relatedCellsBySlot.set(slotKey, [
          ...(relatedCellsBySlot.get(slotKey) ?? []),
          {
            employeeId: row.employeeId,
            employeeName: row.employeeName,
            teamName: row.teamName,
            shiftCode: effectiveCell.shiftCode,
            intervalLabel,
            isDraftEdited: Boolean(cellEdits[key]),
          },
        ])
      }
    }
  }

  return model.forecastIntervals
    .map((forecast) => {
      const slotKey = dateSlotKey(forecast.businessDate, forecast.slotLabel)
      const actual = actualBySlot.get(slotKey)
      const arrangedAgents = arrangedBySlot.get(slotKey) ?? 0
      const actualAgents = actual?.actualAgents ?? 0
      const forecastGap = forecast.requiredAgents - arrangedAgents
      const actualGap = arrangedAgents - actualAgents

      return {
        id: forecast.id,
        businessDate: forecast.businessDate,
        slotLabel: forecast.slotLabel,
        forecastAgents: forecast.requiredAgents,
        arrangedAgents,
        actualAgents,
        forecastGap,
        actualGap,
        status: gapStatusFromForecastGap(forecastGap),
        reason: forecast.reason,
        sourceLabel: actual?.sourceLabel ?? "本地实际到岗样例",
        relatedEmployeeIds: employeesBySlot.get(slotKey) ?? [],
        relatedCells: relatedCellsBySlot.get(slotKey) ?? [],
      }
    })
    .sort((left, right) => {
      const leftPriority = left.status === "shortage" ? 0 : left.status === "surplus" ? 1 : 2
      const rightPriority = right.status === "shortage" ? 0 : right.status === "surplus" ? 1 : 2
      if (leftPriority !== rightPriority) {
        return leftPriority - rightPriority
      }

      const dateCompare = left.businessDate.localeCompare(right.businessDate)
      if (dateCompare !== 0) {
        return dateCompare
      }

      return slotStartMinutes(left.slotLabel) - slotStartMinutes(right.slotLabel)
    })
}

function buildPublishedRosterGapPreview(
  model: RosterDraftViewModel,
  publishedSnapshot: PublishedRosterSnapshot | null
): RosterGapPreviewRow[] {
  if (publishedSnapshot?.status !== "published") {
    return []
  }

  const actualBySlot = new Map(
    model.actualIntervals.map((item) => [
      dateSlotKey(item.businessDate, item.slotLabel),
      item,
    ])
  )
  const employeeById = new Map(
    model.monthRows.map((row) => [
      row.employeeId,
      {
        employeeName: row.employeeName,
        teamName: row.teamName,
      },
    ])
  )
  const arrangedBySlot = new Map<string, number>()
  const employeesBySlot = new Map<string, string[]>()
  const relatedCellsBySlot = new Map<string, RosterGapRelatedCell[]>()

  for (const cell of publishedSnapshot.cells) {
    if (cell.assignment_kind !== "shift" || !cell.shift_code) {
      continue
    }

    const intervalLabel = intervalLabelFromPublishedCell(cell)
    if (!intervalLabel) {
      continue
    }

    const employee = employeeById.get(cell.employee_id)
    for (const slotLabel of parseHalfHourSlots(intervalLabel)) {
      const slotKey = dateSlotKey(cell.business_date, slotLabel)
      arrangedBySlot.set(slotKey, (arrangedBySlot.get(slotKey) ?? 0) + 1)
      employeesBySlot.set(slotKey, [
        ...(employeesBySlot.get(slotKey) ?? []),
        cell.employee_id,
      ])
      relatedCellsBySlot.set(slotKey, [
        ...(relatedCellsBySlot.get(slotKey) ?? []),
        {
          employeeId: cell.employee_id,
          employeeName: employee?.employeeName ?? cell.employee_id,
          teamName: employee?.teamName ?? cell.team_id,
          shiftCode: cell.shift_code,
          intervalLabel,
          isDraftEdited: cell.manually_adjusted,
        },
      ])
    }
  }

  return model.forecastIntervals
    .map((forecast) => {
      const slotKey = dateSlotKey(forecast.businessDate, forecast.slotLabel)
      const actual = actualBySlot.get(slotKey)
      const arrangedAgents = arrangedBySlot.get(slotKey) ?? 0
      const actualAgents = actual?.actualAgents ?? 0
      const forecastGap = forecast.requiredAgents - arrangedAgents
      const actualGap = arrangedAgents - actualAgents

      return {
        id: `published-${forecast.id}`,
        businessDate: forecast.businessDate,
        slotLabel: forecast.slotLabel,
        forecastAgents: forecast.requiredAgents,
        arrangedAgents,
        actualAgents,
        forecastGap,
        actualGap,
        status: gapStatusFromForecastGap(forecastGap),
        reason: `${forecast.reason} / 当前正式版`,
        sourceLabel: actual?.sourceLabel ?? "本地实际到岗样例",
        relatedEmployeeIds: employeesBySlot.get(slotKey) ?? [],
        relatedCells: relatedCellsBySlot.get(slotKey) ?? [],
      }
    })
    .sort(compareRosterGapRows)
}

function intervalLabelFromPublishedCell(cell: PublishedRosterCell): string | null {
  if (!cell.interval_start_at || !cell.interval_end_at) {
    return null
  }
  return `${slotLabelFromIso(cell.interval_start_at)}-${slotLabelFromIso(cell.interval_end_at)}`
}

function slotLabelFromIso(value: string): string {
  return value.slice(11, 16)
}

function compareRosterGapRows(left: RosterGapPreviewRow, right: RosterGapPreviewRow): number {
  const leftPriority = left.status === "shortage" ? 0 : left.status === "surplus" ? 1 : 2
  const rightPriority = right.status === "shortage" ? 0 : right.status === "surplus" ? 1 : 2
  if (leftPriority !== rightPriority) {
    return leftPriority - rightPriority
  }

  const dateCompare = left.businessDate.localeCompare(right.businessDate)
  if (dateCompare !== 0) {
    return dateCompare
  }

  return slotStartMinutes(left.slotLabel) - slotStartMinutes(right.slotLabel)
}

function buildShiftIntervalMap(model: RosterDraftViewModel): Map<string, string> {
  const intervalByShiftCode = new Map<string, string>()

  for (const assignment of model.assignments) {
    intervalByShiftCode.set(assignment.shiftCode, assignment.intervalLabel)
  }
  for (const detail of model.weekDetails) {
    if (detail.shiftCode && detail.intervalLabel) {
      intervalByShiftCode.set(detail.shiftCode, detail.intervalLabel)
    }
  }

  return intervalByShiftCode
}

function gapStatusFromForecastGap(forecastGap: number): RosterGapStatus {
  if (forecastGap > 0) {
    return "shortage"
  }
  if (forecastGap < 0) {
    return "surplus"
  }
  return "balanced"
}

function dateSlotKey(businessDate: string, slotLabel: string): string {
  return `${businessDate}|${slotLabel}`
}

function parseHalfHourSlots(intervalLabel: string): string[] {
  const match = intervalLabel.match(/^(\d{2}:\d{2})-(\d{2}:\d{2})$/)
  if (!match) {
    return []
  }

  const start = timeToMinutes(match[1])
  let end = timeToMinutes(match[2])
  if (end <= start) {
    end += 24 * 60
  }

  const slots: string[] = []
  for (let minute = start; minute < end; minute += 30) {
    slots.push(minutesToTime(minute))
  }

  return slots
}

function timeToMinutes(value: string): number {
  const [hour, minute] = value.split(":").map(Number)
  return hour * 60 + minute
}

function minutesToTime(value: number): string {
  const normalized = value % (24 * 60)
  const hour = Math.floor(normalized / 60)
  const minute = normalized % 60
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
}

function slotStartMinutes(slotLabel: string): number {
  return timeToMinutes(slotLabel)
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
