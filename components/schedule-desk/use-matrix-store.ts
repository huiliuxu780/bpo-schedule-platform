"use client"

// 排班矩阵编辑状态库：客户端直连 API + 乐观更新（本项目数据流约定的唯一例外）。
// 编辑即改本地状态并标脏，300ms debounce 聚合批量 PATCH（乐观锁 base_version）；
// 409 冲突按 conflicts 精确回滚冲突 cell。行级订阅（useSyncExternalStore）保证
// 单 cell 编辑不触发全表重渲染。
//
// 竞态防护约定：
// - 发送时快照：每轮 flush 为发送的 cell 记录快照（segments 引用 + locked），
//   成功回调中快照不一致（in-flight 期间又被编辑）的 cell 保持脏标记等下一轮，
//   防止「防抖窗口内继续编辑已发送 cell」丢变更。
// - 周期归属：flush 发起时记录 flushPeriodId，响应回调校验当前周期一致才写
//   权威状态；范围切换时等待在途 flush 完成并刷出脏改动后再重建。
// - pendingCopies 只在成功/409 分支消费，错误分支恢复到队首等待重试。
// - 同批次「复制 + 直接改写目标」时直接编辑优先：buildFlushPayload 展开
//   copies 前剔除已被 changes/clears 覆盖的目标。
// - 单元格寻址使用嵌套 Map（employeeId → scheduleDate），不做分隔符反解。

import { useSyncExternalStore } from "react"
import { toast } from "sonner"

import {
  type CoverageDeltaRow,
  type MatrixBatchPayload,
  type MatrixCellSnapshot,
  type MatrixCopyRequest,
  type MatrixDirtyCell,
  type ScheduleDeskApiCell,
  type ScheduleDeskApiSegment,
  type ScheduleValidationIssue,
  aggregateDirtyCells,
  cellSnapshotMatches,
  conflictCellAddressSet,
  conflictReasonLabel,
  expandCopyOperation,
  isFlushPeriodCurrent,
  pruneCopyTargets,
} from "@/components/schedule-desk/schedule-matrix-model"
import {
  type MatrixBatchUpdatePayload,
  patchScheduleMatrixBatch,
} from "@/components/schedule-desk/schedule-matrix-api"

const FLUSH_DEBOUNCE_MS = 300

export type MatrixCellView = {
  employeeId: string
  scheduleDate: string
  segments: ScheduleDeskApiSegment[]
  locked: boolean
  dirty: boolean
  isEmpty: boolean
}

export type MatrixRowView = {
  employeeId: string
  cells: Record<string, MatrixCellView>
}

export type MatrixStatusView = {
  periodId: string | null
  readOnly: boolean
  saving: boolean
  dirtyCount: number
  lastSavedAt: string | null
  baseVersion: number
  selectedCount: number
  validationErrorCount: number
  validationWarningCount: number
  validationLoading: boolean
  validationRanAt: string | null
  focusToken: number
}

export type MatrixFocusTarget = {
  employeeId: string
  scheduleDate: string
  segmentIndex: number | null
  token: number
}

type InternalCell = {
  segments: ScheduleDeskApiSegment[]
  locked: boolean
  baseSegments: ScheduleDeskApiSegment[]
  baseLocked: boolean
  segmentsDirty: boolean
  lockDirty: boolean
  cleared: boolean
  copyPending: boolean
}

type StoreState = {
  periodId: string | null
  rangeKey: string | null
  dateFrom: string
  dateTo: string
  readOnly: boolean
  baseVersion: number
  employees: string[]
  dates: string[]
  // 结构化寻址：employeeId → scheduleDate → cell。
  cells: Map<string, Map<string, InternalCell>>
  pendingCopies: MatrixCopyRequest[]
  selectedEmployees: Set<string>
  saving: boolean
  lastSavedAt: string | null
  validation: {
    loading: boolean
    ranAt: string | null
    errors: ScheduleValidationIssue[]
    warnings: ScheduleValidationIssue[]
    errorText: string | null
  }
  focusTarget: MatrixFocusTarget | null
  lastCoverageDelta: CoverageDeltaRow[] | null
}

const state: StoreState = {
  periodId: null,
  rangeKey: null,
  dateFrom: "",
  dateTo: "",
  readOnly: false,
  baseVersion: 0,
  employees: [],
  dates: [],
  cells: new Map(),
  pendingCopies: [],
  selectedEmployees: new Set(),
  saving: false,
  lastSavedAt: null,
  validation: { loading: false, ranAt: null, errors: [], warnings: [], errorText: null },
  focusTarget: null,
  lastCoverageDelta: null,
}

const globalListeners = new Set<() => void>()
const rowListeners = new Map<string, Set<() => void>>()
const selectionListeners = new Set<() => void>()
const rowViews = new Map<string, MatrixRowView>()
let statusSnapshot: MatrixStatusView = buildStatusSnapshot()
let validationSnapshot: StoreState["validation"] = state.validation
let flushTimer: ReturnType<typeof setTimeout> | null = null
let activeFlush: Promise<MatrixFlushResult> | null = null
let initToken = 0

function buildStatusSnapshot(): MatrixStatusView {
  return {
    periodId: state.periodId,
    readOnly: state.readOnly,
    saving: state.saving,
    dirtyCount: countDirtyCells(),
    lastSavedAt: state.lastSavedAt,
    baseVersion: state.baseVersion,
    selectedCount: state.selectedEmployees.size,
    validationErrorCount: state.validation.errors.length,
    validationWarningCount: state.validation.warnings.length,
    validationLoading: state.validation.loading,
    validationRanAt: state.validation.ranAt,
    focusToken: state.focusTarget?.token ?? 0,
  }
}

function countDirtyCells(): number {
  let count = 0

  for (const perDate of state.cells.values()) {
    for (const cell of perDate.values()) {
      if (cell.segmentsDirty || cell.lockDirty || cell.copyPending) {
        count += 1
      }
    }
  }

  return count
}

function emitGlobal() {
  statusSnapshot = buildStatusSnapshot()
  validationSnapshot = state.validation

  for (const listener of globalListeners) {
    listener()
  }
}

function emitRow(employeeId: string) {
  rowViews.delete(employeeId)

  const listeners = rowListeners.get(employeeId)

  if (listeners) {
    for (const listener of listeners) {
      listener()
    }
  }
}

function emitSelection() {
  for (const listener of selectionListeners) {
    listener()
  }
}

// 行选择专用订阅：勾选变化只通知选择通道，不触发全表/全行重渲染。
export function subscribeSelection(listener: () => void): () => void {
  selectionListeners.add(listener)

  return () => {
    selectionListeners.delete(listener)
  }
}

function touchCell(employeeId: string): void {
  emitRow(employeeId)
  emitGlobal()
}

// ---- 结构化寻址辅助 ----

function getInternalCell(employeeId: string, scheduleDate: string): InternalCell | undefined {
  return state.cells.get(employeeId)?.get(scheduleDate)
}

function upsertInternalCell(employeeId: string, scheduleDate: string): InternalCell {
  let perDate = state.cells.get(employeeId)

  if (!perDate) {
    perDate = new Map()
    state.cells.set(employeeId, perDate)
  }

  const existing = perDate.get(scheduleDate)

  if (existing) {
    return existing
  }

  const created: InternalCell = {
    segments: [],
    locked: false,
    baseSegments: [],
    baseLocked: false,
    segmentsDirty: false,
    lockDirty: false,
    cleared: false,
    copyPending: false,
  }
  perDate.set(scheduleDate, created)

  return created
}

// ---- 初始化 ----

export type MatrixStoreInitInput = {
  periodId: string
  rangeKey: string
  dateFrom: string
  dateTo: string
  readOnly: boolean
  version: number
  employees: string[]
  dates: string[]
  cells: ScheduleDeskApiCell[]
}

// 初始化必须在 effect 中调用（异步）：render 阶段不通知订阅者，
// 避免发布后 readOnly 翻转时在渲染期间触发其它组件副作用。
export async function initMatrixStore(input: MatrixStoreInitInput): Promise<void> {
  const sameRange = state.periodId === input.periodId && state.rangeKey === input.rangeKey

  // 只读态（发布状态）变化需要即时生效；同范围内的服务端刷新不覆盖本地未保存改动。
  if (sameRange) {
    if (state.readOnly !== input.readOnly) {
      state.readOnly = input.readOnly
      emitGlobal()
    }

    return
  }

  const token = ++initToken

  // 范围切换：先等待在途 flush 完成并把未保存改动刷出，再重建本地状态。
  // 旧周期响应因此一定在重建前处理完毕，不会覆盖新周期的权威状态；
  // in-flight 期间新产生的脏改动也会被 flushNow 的链式补发覆盖到。
  if (state.periodId !== null) {
    await flushNow()

    if (token !== initToken) {
      // 等待期间又发生了新的范围切换，本次重建作废。
      return
    }
  }

  if (flushTimer) {
    clearTimeout(flushTimer)
    flushTimer = null
  }

  state.periodId = input.periodId
  state.rangeKey = input.rangeKey
  state.dateFrom = input.dateFrom
  state.dateTo = input.dateTo
  state.readOnly = input.readOnly
  state.baseVersion = input.version
  state.employees = input.employees
  state.dates = input.dates
  state.cells = new Map()
  state.pendingCopies = []
  state.selectedEmployees = new Set()
  state.saving = false
  state.lastSavedAt = null
  state.validation = { loading: false, ranAt: null, errors: [], warnings: [], errorText: null }
  state.focusTarget = null
  state.lastCoverageDelta = null
  rowViews.clear()

  for (const cell of input.cells) {
    upsertInternalCell(cell.employee_id, cell.schedule_date)
    const internal = getInternalCell(cell.employee_id, cell.schedule_date)

    if (internal) {
      internal.segments = cell.segments
      internal.locked = cell.locked
      internal.baseSegments = cell.segments
      internal.baseLocked = cell.locked
    }
  }

  emitGlobal()
}

// ---- 订阅 ----

function subscribeGlobal(listener: () => void): () => void {
  globalListeners.add(listener)

  return () => {
    globalListeners.delete(listener)
  }
}

function subscribeRow(employeeId: string, listener: () => void): () => void {
  let listeners = rowListeners.get(employeeId)

  if (!listeners) {
    listeners = new Set()
    rowListeners.set(employeeId, listeners)
  }

  listeners.add(listener)

  return () => {
    listeners?.delete(listener)
  }
}

export function useMatrixStatus(): MatrixStatusView {
  return useSyncExternalStore(subscribeGlobal, () => statusSnapshot, () => statusSnapshot)
}

export function getMatrixStatus(): MatrixStatusView {
  return statusSnapshot
}

export function getPeriodId(): string | null {
  return state.periodId
}

export function useMatrixRow(employeeId: string): MatrixRowView {
  return useSyncExternalStore(
    (listener) => subscribeRow(employeeId, listener),
    () => getRowView(employeeId),
    () => getRowView(employeeId)
  )
}

export function getRowView(employeeId: string): MatrixRowView {
  const cached = rowViews.get(employeeId)

  if (cached) {
    return cached
  }

  const cells: Record<string, MatrixCellView> = {}

  for (const date of state.dates) {
    const internal = getInternalCell(employeeId, date)

    cells[date] = {
      employeeId,
      scheduleDate: date,
      segments: internal?.segments ?? [],
      locked: internal?.locked ?? false,
      dirty: Boolean(internal && (internal.segmentsDirty || internal.lockDirty || internal.copyPending)),
      isEmpty: (internal?.segments.length ?? 0) === 0,
    }
  }

  const view: MatrixRowView = { employeeId, cells }
  rowViews.set(employeeId, view)

  return view
}

export function getEmployees(): string[] {
  return state.employees
}

export function getDates(): string[] {
  return state.dates
}

export function getRange(): { dateFrom: string; dateTo: string } {
  return { dateFrom: state.dateFrom, dateTo: state.dateTo }
}

// 最近一次保存响应携带的 coverage_delta（后端权威口径）；
// 非消费式读取，下次成功保存或重建 store 时自然替换。
export function getCoverageDelta(): CoverageDeltaRow[] | null {
  return state.lastCoverageDelta
}

// 供本地即时覆盖计算读取当前单元格（含未保存改动）。
export function getCurrentCells(): Array<{
  employee_id: string
  schedule_date: string
  segments: ScheduleDeskApiSegment[]
}> {
  const cells: Array<{
    employee_id: string
    schedule_date: string
    segments: ScheduleDeskApiSegment[]
  }> = []

  for (const employeeId of state.employees) {
    for (const date of state.dates) {
      const internal = getInternalCell(employeeId, date)

      if (internal && internal.segments.length > 0) {
        cells.push({
          employee_id: employeeId,
          schedule_date: date,
          segments: internal.segments,
        })
      }
    }
  }

  return cells
}

// ---- 编辑操作 ----

function assertEditable(employeeId: string, scheduleDate: string): InternalCell | null {
  if (state.readOnly || !state.periodId) {
    toast.info("当前周期已发布或不可编辑")

    return null
  }

  const cell = getInternalCell(employeeId, scheduleDate)

  if (cell && cell.locked) {
    toast.info(`${employeeId} ${scheduleDate} 单元格已锁定，请先解锁`)

    return null
  }

  return cell ?? null
}

export function setCellSegments(
  employeeId: string,
  scheduleDate: string,
  segments: ScheduleDeskApiSegment[]
): void {
  if (state.readOnly) {
    return
  }

  const editable = assertEditable(employeeId, scheduleDate)

  if (editable === null && getInternalCell(employeeId, scheduleDate)?.locked) {
    return
  }

  const cell = upsertInternalCell(employeeId, scheduleDate)

  if (cell.locked) {
    return
  }

  cell.segments = segments
  cell.segmentsDirty = true
  cell.cleared = false
  cell.copyPending = false
  touchCell(employeeId)
  scheduleFlush()
}

export function clearCell(employeeId: string, scheduleDate: string): void {
  const existing = getInternalCell(employeeId, scheduleDate)

  if (state.readOnly) {
    return
  }

  if (existing && existing.locked) {
    toast.info(`${employeeId} ${scheduleDate} 单元格已锁定，请先解锁`)

    return
  }

  if (!existing || (existing.segments.length === 0 && !existing.segmentsDirty)) {
    return
  }

  existing.segments = []
  existing.segmentsDirty = true
  existing.cleared = true
  existing.copyPending = false
  touchCell(employeeId)
  scheduleFlush()
}

export function setCellLock(employeeId: string, scheduleDate: string, locked: boolean): void {
  if (state.readOnly) {
    return
  }

  const cell = upsertInternalCell(employeeId, scheduleDate)
  const baseLocked = cell.baseLocked

  cell.locked = locked
  cell.lockDirty = locked !== baseLocked
  touchCell(employeeId)
  scheduleFlush()
}

// 整行复制：源日期分段复制到同行其他日期。源已脏时降级为本地分段写入。
export function copyRowCells(employeeId: string, sourceDate: string, targetDates: string[]): void {
  if (state.readOnly) {
    return
  }

  const source = getInternalCell(employeeId, sourceDate)

  if (!source || source.segments.length === 0) {
    toast.info(`${employeeId} 在 ${sourceDate} 没有可复制的分段`)

    return
  }

  const writableTargets = targetDates.filter((date) => {
    const target = getInternalCell(employeeId, date)

    if (target?.locked) {
      return false
    }

    return date !== sourceDate
  })

  if (writableTargets.length === 0) {
    toast.info("没有其他可写入的日期（目标单元格均已锁定）")

    return
  }

  const targets = writableTargets.map((date) => ({
    employee_id: employeeId,
    schedule_date: date,
  }))

  state.pendingCopies.push({
    source_employee_id: employeeId,
    source_date: sourceDate,
    targets,
    sourceDirty: source.segmentsDirty,
    sourceSegments: source.segments,
  })

  // 乐观应用：目标单元格立即显示源分段。
  for (const target of targets) {
    const cell = upsertInternalCell(target.employee_id, target.schedule_date)
    cell.segments = [...source.segments]
    cell.copyPending = true
    cell.cleared = false
  }

  emitRow(employeeId)
  emitGlobal()
  scheduleFlush()
}

// 批量工具条：对选中员工行整行设置/清空/锁定。
export function applySegmentsToSelectedRows(segments: ScheduleDeskApiSegment[]): void {
  if (state.readOnly || state.selectedEmployees.size === 0) {
    return
  }

  let touched = 0

  for (const employeeId of state.selectedEmployees) {
    for (const date of state.dates) {
      const cell = getInternalCell(employeeId, date)

      if (cell?.locked) {
        continue
      }

      const target = upsertInternalCell(employeeId, date)
      target.segments = segments
      target.segmentsDirty = true
      target.cleared = false
      target.copyPending = false
      touched += 1
    }

    emitRow(employeeId)
  }

  if (touched === 0) {
    toast.info("选中行的单元格均已锁定，未做改动")

    return
  }

  emitGlobal()
  scheduleFlush()
}

export function clearSelectedRows(): void {
  if (state.readOnly || state.selectedEmployees.size === 0) {
    return
  }

  let touched = 0

  for (const employeeId of state.selectedEmployees) {
    for (const date of state.dates) {
      const cell = getInternalCell(employeeId, date)

      if (!cell || cell.locked || (cell.segments.length === 0 && !cell.copyPending)) {
        continue
      }

      cell.segments = []
      cell.segmentsDirty = true
      cell.cleared = true
      cell.copyPending = false
      touched += 1
    }

    emitRow(employeeId)
  }

  if (touched > 0) {
    emitGlobal()
    scheduleFlush()
  }
}

export function lockSelectedRows(locked: boolean): void {
  if (state.readOnly || state.selectedEmployees.size === 0) {
    return
  }

  for (const employeeId of state.selectedEmployees) {
    for (const date of state.dates) {
      const cell = upsertInternalCell(employeeId, date)
      cell.locked = locked
      cell.lockDirty = locked !== cell.baseLocked
    }

    emitRow(employeeId)
  }

  emitGlobal()
  scheduleFlush()
}

export function copySelectedRows(): void {
  if (state.readOnly || state.selectedEmployees.size === 0) {
    return
  }

  for (const employeeId of state.selectedEmployees) {
    const sourceDate = state.dates.find((date) => {
      const cell = getInternalCell(employeeId, date)

      return cell !== undefined && cell.segments.length > 0
    })

    if (!sourceDate) {
      continue
    }

    copyRowCells(employeeId, sourceDate, state.dates)
  }
}

// ---- 行选择 ----

export function toggleEmployeeSelected(employeeId: string): void {
  if (state.selectedEmployees.has(employeeId)) {
    state.selectedEmployees.delete(employeeId)
  } else {
    state.selectedEmployees.add(employeeId)
  }

  emitSelection()
  emitGlobal()
}

export function clearSelection(): void {
  if (state.selectedEmployees.size === 0) {
    return
  }

  state.selectedEmployees = new Set()
  emitSelection()
  emitGlobal()
}

export function isEmployeeSelected(employeeId: string): boolean {
  return state.selectedEmployees.has(employeeId)
}

// ---- 校验问题定位 ----

export function requestFocus(
  employeeId: string,
  scheduleDate: string,
  segmentIndex: number | null
): void {
  const token = (state.focusTarget?.token ?? 0) + 1

  state.focusTarget = { employeeId, scheduleDate, segmentIndex, token }
  emitGlobal()
}

export function getFocusTarget(): MatrixFocusTarget | null {
  return state.focusTarget
}

export function getEmployeeRowIndex(employeeId: string): number {
  return state.employees.indexOf(employeeId)
}

export function getDateColumnIndex(scheduleDate: string): number {
  return state.dates.indexOf(scheduleDate)
}

// ---- 校验 ----

export function setValidationState(next: Partial<StoreState["validation"]>): void {
  state.validation = { ...state.validation, ...next }
  emitGlobal()
}

export function getValidationState(): StoreState["validation"] {
  return validationSnapshot
}

export function useValidationState(): StoreState["validation"] {
  return useSyncExternalStore(subscribeGlobal, getValidationState, getValidationState)
}

// ---- 防抖保存与乐观锁 ----

function scheduleFlush(): void {
  if (state.readOnly) {
    return
  }

  if (flushTimer) {
    clearTimeout(flushTimer)
  }

  flushTimer = setTimeout(() => {
    flushTimer = null
    void flushNow()
  }, FLUSH_DEBOUNCE_MS)
}

type PreparedFlush = {
  payload: MatrixBatchUpdatePayload
  // 发送时快照：employeeId → scheduleDate → 快照。
  sentSnapshots: Map<string, Map<string, MatrixCellSnapshot>>
  sentCopies: MatrixCopyRequest[]
}

function recordSentSnapshot(
  sentSnapshots: Map<string, Map<string, MatrixCellSnapshot>>,
  employeeId: string,
  scheduleDate: string
): void {
  const cell = getInternalCell(employeeId, scheduleDate)

  if (!cell) {
    return
  }

  let perDate = sentSnapshots.get(employeeId)

  if (!perDate) {
    perDate = new Map()
    sentSnapshots.set(employeeId, perDate)
  }

  if (!perDate.has(scheduleDate)) {
    perDate.set(scheduleDate, { segments: cell.segments, locked: cell.locked })
  }
}

function markAddress(addresses: Map<string, Set<string>>, employeeId: string, scheduleDate: string): void {
  let dates = addresses.get(employeeId)

  if (!dates) {
    dates = new Set()
    addresses.set(employeeId, dates)
  }

  dates.add(scheduleDate)
}

function buildFlushPayload(): PreparedFlush | null {
  const dirtyCells: MatrixDirtyCell[] = []

  for (const [employeeId, perDate] of state.cells) {
    for (const [scheduleDate, cell] of perDate) {
      if (cell.segmentsDirty || cell.lockDirty) {
        dirtyCells.push({
          employee_id: employeeId,
          schedule_date: scheduleDate,
          segments: cell.segments,
          segmentsDirty: cell.segmentsDirty,
          cleared: cell.cleared,
          locked: cell.locked,
          lockDirty: cell.lockDirty,
        })
      }
    }
  }

  const aggregated: MatrixBatchPayload = aggregateDirtyCells(dirtyCells)

  // 直接编辑（changes/clears）优先：记录其覆盖的地址，供 copy 目标剔除。
  const directEdits = new Map<string, Set<string>>()

  for (const change of aggregated.changes) {
    markAddress(directEdits, change.employee_id, change.schedule_date)
  }

  for (const clear of aggregated.clears) {
    markAddress(directEdits, clear.employee_id, clear.schedule_date)
  }

  const sentSnapshots = new Map<string, Map<string, MatrixCellSnapshot>>()

  for (const change of aggregated.changes) {
    recordSentSnapshot(sentSnapshots, change.employee_id, change.schedule_date)
  }

  for (const clear of aggregated.clears) {
    recordSentSnapshot(sentSnapshots, clear.employee_id, clear.schedule_date)
  }

  for (const lock of aggregated.locks) {
    recordSentSnapshot(sentSnapshots, lock.employee_id, lock.schedule_date)
  }

  const sentCopies: MatrixCopyRequest[] = []

  for (const copy of pruneCopyTargets(state.pendingCopies, directEdits)) {
    const expanded = expandCopyOperation(copy)
    aggregated.changes.push(...expanded.changes)
    aggregated.copies.push(...expanded.copies)

    // 源已脏降级出的 changes 同样属于直接写入，纳入直接编辑集合，
    // 防止后续 copy 在后端 changes→copies 顺序下覆盖它们。
    for (const change of expanded.changes) {
      markAddress(directEdits, change.employee_id, change.schedule_date)
      recordSentSnapshot(sentSnapshots, change.employee_id, change.schedule_date)
    }

    for (const target of copy.targets) {
      recordSentSnapshot(sentSnapshots, target.employee_id, target.schedule_date)
    }

    sentCopies.push(copy)
  }

  if (
    aggregated.changes.length === 0 &&
    aggregated.copies.length === 0 &&
    aggregated.clears.length === 0 &&
    aggregated.locks.length === 0
  ) {
    return null
  }

  return {
    payload: { base_version: state.baseVersion, ...aggregated },
    sentSnapshots,
    sentCopies,
  }
}

function rollbackCell(employeeId: string, scheduleDate: string): void {
  const cell = getInternalCell(employeeId, scheduleDate)

  if (!cell) {
    return
  }

  cell.segments = cell.baseSegments
  cell.locked = cell.baseLocked
  cell.segmentsDirty = false
  cell.lockDirty = false
  cell.cleared = false
  cell.copyPending = false
  emitRow(employeeId)
}

// 快照一致才确认：in-flight 期间又被编辑的 cell（分段引用或锁状态变化）
// 保持脏标记，由成功分支末尾的 scheduleFlush 接力发送新值。
function confirmCellIfMatches(
  employeeId: string,
  scheduleDate: string,
  snapshot: MatrixCellSnapshot
): boolean {
  const cell = getInternalCell(employeeId, scheduleDate)

  if (!cell) {
    return false
  }

  if (!cellSnapshotMatches(snapshot, { segments: cell.segments, locked: cell.locked })) {
    return false
  }

  cell.baseSegments = cell.segments
  cell.baseLocked = cell.locked
  cell.segmentsDirty = false
  cell.lockDirty = false
  cell.cleared = false
  cell.copyPending = false

  return true
}

export type MatrixFlushResult =
  | {
      kind: "saved"
      version: number
      accepted: number
      conflictCount: number
      coverageDelta: CoverageDeltaRow[]
    }
  | { kind: "empty" }
  | { kind: "failed"; message: string }

// 对外 flush 入口：若有在途请求，先等它完成再重新评估脏状态补发一轮，
// 保证调用方（发布/范围切换）拿到的结果覆盖所有可保存改动。
// 上一轮失败时直接透传失败，避免网络故障下的无限补发。
export function flushNow(): Promise<MatrixFlushResult> {
  if (activeFlush) {
    return activeFlush.then((previous) => {
      if (previous.kind === "failed") {
        return previous
      }

      return flushNow()
    })
  }

  return runFlush()
}

function runFlush(): Promise<MatrixFlushResult> {
  if (!state.periodId) {
    return Promise.resolve({ kind: "empty" })
  }

  const prepared = buildFlushPayload()

  if (prepared === null) {
    return Promise.resolve({ kind: "empty" })
  }

  const flushPeriodId = state.periodId
  state.saving = true
  state.pendingCopies = []
  emitGlobal()

  const promise = (async (): Promise<MatrixFlushResult> => {
    const result = await patchScheduleMatrixBatch(flushPeriodId, prepared.payload)

    return handleFlushResult(flushPeriodId, prepared, result)
  })().finally(() => {
    if (activeFlush === promise) {
      activeFlush = null
    }
  })

  activeFlush = promise

  return promise
}

function finishFlush(): void {
  state.saving = false
  emitGlobal()
}

function handleFlushResult(
  flushPeriodId: string,
  prepared: PreparedFlush,
  result: Awaited<ReturnType<typeof patchScheduleMatrixBatch>>
): MatrixFlushResult {
  const current = isFlushPeriodCurrent(flushPeriodId, state.periodId)

  if (result.kind === "success") {
    if (!current) {
      // 在途期间周期已切换：旧周期响应不得写新周期的权威状态，直接丢弃。
      finishFlush()

      return {
        kind: "saved",
        version: result.data.version,
        accepted: result.data.accepted,
        conflictCount: result.data.conflicts.length,
        coverageDelta: result.data.coverage_delta,
      }
    }

    state.baseVersion = result.data.version

    const conflictAddresses = conflictCellAddressSet(result.data.conflicts)
    const confirmedEmployees = new Set<string>()

    for (const [employeeId, perDate] of prepared.sentSnapshots) {
      for (const [scheduleDate, snapshot] of perDate) {
        const conflicted = conflictAddresses.get(employeeId)?.has(scheduleDate) ?? false

        if (conflicted) {
          rollbackCell(employeeId, scheduleDate)
          continue
        }

        if (confirmCellIfMatches(employeeId, scheduleDate, snapshot)) {
          confirmedEmployees.add(employeeId)
        }
      }
    }

    // 行级通知：清掉行视图缓存里已确认 cell 的 dirty 残留。
    for (const employeeId of confirmedEmployees) {
      emitRow(employeeId)
    }

    if (result.data.conflicts.length > 0) {
      const reasons = Array.from(
        new Set(result.data.conflicts.map((conflict) => conflictReasonLabel(conflict.reason)))
      )
      toast.warning(`有 ${result.data.conflicts.length} 个单元格未能保存：${reasons.join("；")}`, {
        description: "冲突单元格已回滚到最近一次服务端确认的状态。",
      })
    }

    if (result.data.coverage_delta.length > 0) {
      state.lastCoverageDelta = result.data.coverage_delta
    }

    state.lastSavedAt = new Date().toISOString()
    finishFlush()

    if (countDirtyCells() > 0) {
      scheduleFlush()
    }

    return {
      kind: "saved",
      version: result.data.version,
      accepted: result.data.accepted,
      conflictCount: result.data.conflicts.length,
      coverageDelta: result.data.coverage_delta,
    }
  }

  if (result.kind === "conflict") {
    // 409：整批被拒。按 conflicts 精确回滚冲突 cell，并同步最新版本号。
    // 复制队列在本分支视为已消费（服务端已按当前版本处理过该批语义）。
    if (current) {
      state.baseVersion = result.currentVersion

      const conflictAddresses =
        result.conflicts.length > 0 ? conflictCellAddressSet(result.conflicts) : null

      for (const [employeeId, perDate] of prepared.sentSnapshots) {
        for (const scheduleDate of perDate.keys()) {
          const conflicted =
            conflictAddresses === null ||
            (conflictAddresses.get(employeeId)?.has(scheduleDate) ?? false)

          if (conflicted) {
            rollbackCell(employeeId, scheduleDate)
          }
        }
      }

      toast.error("排班矩阵版本已更新，冲突改动已回滚", {
        description: `服务端当前版本 v${result.currentVersion}，请确认后重新编辑。`,
      })
    }

    finishFlush()

    // 与成功分支对齐：in-flight 期间新产生的脏改动接力发送。
    if (countDirtyCells() > 0) {
      scheduleFlush()
    }

    return { kind: "failed", message: result.message }
  }

  // 网络错误/400：保留脏标记等待重试，不自动回滚；
  // 本轮复制队列恢复到队首，防止复制操作在错误后永久丢失。
  if (current) {
    if (prepared.sentCopies.length > 0) {
      state.pendingCopies = [...prepared.sentCopies, ...state.pendingCopies]
    }

    toast.error("保存失败，改动仍保留在本地", { description: result.message })
  }

  finishFlush()
  scheduleFlush()

  return { kind: "failed", message: result.message }
}

// 发布后由服务端刷新页面数据时调用：以服务端状态重建基线。
export function resetStoreBaseline(version: number): void {
  for (const [employeeId, perDate] of state.cells) {
    for (const cell of perDate.values()) {
      cell.baseSegments = cell.segments
      cell.baseLocked = cell.locked
      cell.segmentsDirty = false
      cell.lockDirty = false
      cell.cleared = false
      cell.copyPending = false
    }

    emitRow(employeeId)
  }

  state.pendingCopies = []
  state.baseVersion = version
  emitGlobal()
}
