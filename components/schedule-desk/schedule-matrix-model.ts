// 排班计划台只读模型：将排班周期 matrix / coverage API 响应整理为
// 员工×日期网格、半小时覆盖序列与周维度汇总，全部为纯函数（配 scripts/tests）。

export type SchedulePeriodApiStatus = "draft" | "published"

export type ScheduleDeskApiWeek = {
  week_id: string
  label: string
  date_from: string
  date_to: string
}

export type ScheduleDeskApiPeriod = {
  period_id: string
  month: string
  status: SchedulePeriodApiStatus
  date_from: string
  date_to: string
  version: number
  weeks: ScheduleDeskApiWeek[]
}

export type ScheduleDeskApiSegment = {
  shift_code: string | null
  activity_type: string
  start_time: string
  end_time: string
  crosses_day: boolean
  skill_id: string | null
  allocation_ratio: number
  skill_coefficient: number | null
  activity_coverage: number
}

export type ScheduleDeskApiCell = {
  employee_id: string
  schedule_date: string
  locked: boolean
  segments: ScheduleDeskApiSegment[]
}

export type ScheduleDeskApiMatrix = {
  period_id: string
  version: number
  date_from: string
  date_to: string
  week: ScheduleDeskApiWeek | null
  employees: string[]
  cells: ScheduleDeskApiCell[]
  total: number
  next_cursor: string | null
}

export type ScheduleDeskApiCoverageInterval = {
  date: string
  interval_start: string
  demand_headcount: number
  planned_headcount: number
  gap: number
  coverage_rate: number | null
  std_demand_headcount: number
  std_planned_headcount: number
  std_gap: number
  std_coverage_rate: number | null
}

export type ScheduleDeskApiCoverage = {
  period_id: string
  date_from: string
  date_to: string
  intervals: ScheduleDeskApiCoverageInterval[]
}

export type ScheduleMatrixSegmentSummary = {
  key: string
  shiftCodeLabel: string
  activityTypeLabel: string
  timeRangeText: string
  crossesDay: boolean
  summaryText: string
}

export type ScheduleMatrixCellSummary = {
  isEmpty: boolean
  locked: boolean
  segments: ScheduleMatrixSegmentSummary[]
}

export type ScheduleMatrixRowSummary = {
  employeeId: string
  cells: Record<string, ScheduleMatrixCellSummary>
}

export type ScheduleMatrixSummary = {
  dates: string[]
  employees: string[]
  rows: ScheduleMatrixRowSummary[]
  version: number
  totalCells: number
}

export type CoverageIntervalPoint = {
  timeLabel: string
  demandHeadcount: number
  plannedHeadcount: number
  gap: number
  coverageRate: number | null
  coverageRateLabel: string
}

export type CoverageDailySummary = {
  date: string
  weekdayLabel: string
  demandTotal: number
  plannedTotal: number
  gapTotal: number
  averageCoverageRate: number | null
  averageCoverageRateLabel: string
}

export type CoverageOverallSummary = {
  demandTotal: number
  plannedTotal: number
  gapTotal: number
  averageCoverageRate: number | null
  averageCoverageRateLabel: string
}

const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  work: "出勤",
  rest: "休息",
  meal: "用餐",
  training: "培训",
}

const WEEKDAY_LABELS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]

export const COVERAGE_INTERVAL_COUNT = 48

export function activityTypeLabel(activityType: string): string {
  return ACTIVITY_TYPE_LABELS[activityType] ?? activityType
}

export function schedulePeriodStatusLabel(status: SchedulePeriodApiStatus): string {
  return status === "published" ? "已发布" : "草稿"
}

export function formatCoverageRateLabel(rate: number | null): string {
  if (rate === null || Number.isNaN(rate)) {
    return "—"
  }

  return `${(rate * 100).toFixed(1)}%`
}

export function formatWeekdayLabel(date: string): string {
  const parsed = parseDate(date)

  if (parsed === null) {
    return "—"
  }

  return WEEKDAY_LABELS[parsed.getUTCDay()] ?? "—"
}

export function expandDateRange(dateFrom: string, dateTo: string): string[] {
  const start = parseDate(dateFrom)
  const end = parseDate(dateTo)

  if (start === null || end === null || start.getTime() > end.getTime()) {
    return []
  }

  const dates: string[] = []
  const cursor = new Date(start)

  while (cursor.getTime() <= end.getTime()) {
    dates.push(cursor.toISOString().slice(0, 10))
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }

  return dates
}

function parseDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null
  }

  const parsed = new Date(`${value}T00:00:00.000Z`)

  return Number.isNaN(parsed.getTime()) ? null : parsed
}

// ---- 矩阵：员工×日期网格 ----

export function summarizeScheduleMatrix(matrix: ScheduleDeskApiMatrix): ScheduleMatrixSummary {
  const dates = expandDateRange(matrix.date_from, matrix.date_to)
  const employees = Array.from(
    new Set([...(matrix.employees ?? []), ...matrix.cells.map((cell) => cell.employee_id)])
  ).sort((left, right) => left.localeCompare(right, "zh-CN"))

  const cellsByEmployee: Record<string, Record<string, ScheduleDeskApiCell>> = {}

  for (const cell of matrix.cells) {
    const perDate = cellsByEmployee[cell.employee_id] ?? {}
    perDate[cell.schedule_date] = cell
    cellsByEmployee[cell.employee_id] = perDate
  }

  const rows = employees.map((employeeId) => {
    const perDate = cellsByEmployee[employeeId] ?? {}
    const cells: Record<string, ScheduleMatrixCellSummary> = {}

    for (const date of dates) {
      const cell = perDate[date]
      cells[date] = cell
        ? {
            isEmpty: cell.segments.length === 0,
            locked: cell.locked,
            segments: cell.segments.map((segment, index) =>
              summarizeMatrixSegment(segment, `${employeeId}-${date}-${index}`)
            ),
          }
        : { isEmpty: true, locked: false, segments: [] }
    }

    return { employeeId, cells }
  })

  return {
    dates,
    employees,
    rows,
    version: matrix.version,
    totalCells: matrix.cells.length,
  }
}

export function summarizeMatrixSegment(
  segment: ScheduleDeskApiSegment,
  key: string
): ScheduleMatrixSegmentSummary {
  const activityLabel = activityTypeLabel(segment.activity_type)
  const crossesDay = Boolean(segment.crosses_day)
  const timeRangeText = `${segment.start_time}-${segment.end_time}`
  const crossDaySuffix = crossesDay ? "（+1天）" : ""
  const shiftCodeLabel = segment.shift_code ?? "—"
  const headLabel = segment.shift_code ?? activityLabel
  const summaryText = `${headLabel} ${timeRangeText}${crossDaySuffix}`

  return {
    key,
    shiftCodeLabel,
    activityTypeLabel: activityLabel,
    timeRangeText,
    crossesDay,
    summaryText,
  }
}

// ---- 覆盖：半小时区间序列与周维度汇总 ----

function buildIntervalTimeLabels(): string[] {
  const labels: string[] = []

  for (let index = 0; index < COVERAGE_INTERVAL_COUNT; index += 1) {
    const hours = Math.floor(index / 2)
    const minutes = index % 2 === 0 ? "00" : "30"
    labels.push(`${String(hours).padStart(2, "0")}:${minutes}`)
  }

  return labels
}

const INTERVAL_TIME_LABELS = buildIntervalTimeLabels()

export function summarizeCoverageIntervalSeries(
  coverage: ScheduleDeskApiCoverage,
  date: string
): CoverageIntervalPoint[] {
  const byInterval: Record<string, ScheduleDeskApiCoverageInterval> = {}

  for (const interval of coverage.intervals) {
    if (interval.date === date) {
      byInterval[interval.interval_start] = interval
    }
  }

  return INTERVAL_TIME_LABELS.map((timeLabel) => {
    const interval = byInterval[timeLabel]

    if (!interval) {
      return {
        timeLabel,
        demandHeadcount: 0,
        plannedHeadcount: 0,
        gap: 0,
        coverageRate: null,
        coverageRateLabel: "—",
      }
    }

    return {
      timeLabel,
      demandHeadcount: interval.demand_headcount,
      plannedHeadcount: interval.planned_headcount,
      gap: interval.gap,
      coverageRate: interval.coverage_rate,
      coverageRateLabel: formatCoverageRateLabel(interval.coverage_rate),
    }
  })
}

export function summarizeCoverageDailySummaries(
  coverage: ScheduleDeskApiCoverage
): CoverageDailySummary[] {
  const dates = Array.from(new Set(coverage.intervals.map((interval) => interval.date))).sort()

  return dates.map((date) => {
    const intervals = coverage.intervals.filter((interval) => interval.date === date)
    const demandTotal = round2(
      intervals.reduce((sum, interval) => sum + interval.demand_headcount, 0)
    )
    const plannedTotal = round2(
      intervals.reduce((sum, interval) => sum + interval.planned_headcount, 0)
    )
    const gapTotal = round2(intervals.reduce((sum, interval) => sum + interval.gap, 0))
    const averageCoverageRate = averageCoverageRateOf(intervals)

    return {
      date,
      weekdayLabel: formatWeekdayLabel(date),
      demandTotal,
      plannedTotal,
      gapTotal,
      averageCoverageRate,
      averageCoverageRateLabel: formatCoverageRateLabel(averageCoverageRate),
    }
  })
}

export function summarizeCoverageOverall(
  coverage: ScheduleDeskApiCoverage
): CoverageOverallSummary {
  const demandTotal = round2(
    coverage.intervals.reduce((sum, interval) => sum + interval.demand_headcount, 0)
  )
  const plannedTotal = round2(
    coverage.intervals.reduce((sum, interval) => sum + interval.planned_headcount, 0)
  )
  const gapTotal = round2(coverage.intervals.reduce((sum, interval) => sum + interval.gap, 0))
  const averageCoverageRate = averageCoverageRateOf(coverage.intervals)

  return {
    demandTotal,
    plannedTotal,
    gapTotal,
    averageCoverageRate,
    averageCoverageRateLabel: formatCoverageRateLabel(averageCoverageRate),
  }
}

function averageCoverageRateOf(intervals: ScheduleDeskApiCoverageInterval[]): number | null {
  const rates = intervals
    .map((interval) => interval.coverage_rate)
    .filter((rate): rate is number => rate !== null && !Number.isNaN(rate))

  if (rates.length === 0) {
    return null
  }

  return rates.reduce((sum, rate) => sum + rate, 0) / rates.length
}

function round2(value: number): number {
  return Math.round(value * 100) / 100
}

// ---- 本地即时覆盖计算（镜像 backend/app/coverage_calculation.py）----
// 公式（产品设计文档 V2.0 13.3）：区间标准人力 = 区间重叠比例 × 技能分配比例 ×
// 技能标准人力系数 × 活动覆盖系数；黄金用例与后端
// backend/tests/test_coverage_calculation.py 双端保持一致。

const INTERVAL_MINUTES = 30
const MINUTES_PER_DAY = 24 * 60
const WORK_ACTIVITY_TYPE = "work"

export type CoverageIntervalContribution = {
  date: string
  intervalStart: string
  overlapRatio: number
  stdHeadcount: number
}

export type CoverageCalcRow = {
  date: string
  intervalStart: string
  demandHeadcount: number
  plannedHeadcount: number
  gap: number
  coverageRate: number | null
  stdPlannedHeadcount: number
}

// Python round(x, n) 采用银行家舍入（round half to even），保持一致。
function roundHalfEven(value: number, digits: number): number {
  const factor = 10 ** digits
  const scaled = value * factor
  const floored = Math.floor(scaled)
  const diff = scaled - floored

  if (Math.abs(diff - 0.5) < 1e-9) {
    return (floored % 2 === 0 ? floored : floored + 1) / factor
  }

  return Math.round(scaled) / factor
}

export function parseTimeToMinutes(value: string): number {
  const match = /^(\d{1,2}):(\d{1,2})$/.exec(value)

  if (!match) {
    throw new Error(`time ${value} is not a valid HH:MM value`)
  }

  const hours = Number(match[1])
  const minutes = Number(match[2])

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error(`time ${value} is not a valid HH:MM value`)
  }

  return hours * 60 + minutes
}

export function minutesToTime(minutes: number): string {
  const normalized = ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY
  const hours = Math.floor(normalized / 60)
  const rest = normalized % 60

  return `${String(hours).padStart(2, "0")}:${String(rest).padStart(2, "0")}`
}

export function nextDate(scheduleDate: string): string {
  const parsed = parseDate(scheduleDate)

  if (parsed === null) {
    throw new Error(`date ${scheduleDate} is not a valid YYYY-MM-DD value`)
  }

  const next = new Date(parsed)
  next.setUTCDate(next.getUTCDate() + 1)

  return next.toISOString().slice(0, 10)
}

export function segmentDurationMinutes(segment: ScheduleDeskApiSegment): number {
  const start = parseTimeToMinutes(segment.start_time)
  const end = parseTimeToMinutes(segment.end_time)
  let duration = end - start

  if (duration <= 0) {
    duration += MINUTES_PER_DAY
  }

  if (duration === MINUTES_PER_DAY && !segment.crosses_day && end !== start) {
    throw new Error("segment duration cannot be 24 hours")
  }

  return duration
}

export function crossesMidnight(segment: ScheduleDeskApiSegment): boolean {
  const start = parseTimeToMinutes(segment.start_time)
  const end = parseTimeToMinutes(segment.end_time)

  return Boolean(segment.crosses_day) || end <= start
}

function skillCoefficientOf(segment: ScheduleDeskApiSegment): number {
  return segment.skill_coefficient === null || segment.skill_coefficient === undefined
    ? 1.0
    : segment.skill_coefficient
}

export function segmentIntervalContributions(
  scheduleDate: string,
  segment: ScheduleDeskApiSegment
): CoverageIntervalContribution[] {
  const start = parseTimeToMinutes(segment.start_time)
  const duration = segmentDurationMinutes(segment)

  if (duration > MINUTES_PER_DAY) {
    throw new Error("segment duration cannot exceed 24 hours")
  }

  const coefficient = skillCoefficientOf(segment)
  const contributions: CoverageIntervalContribution[] = []
  const dates = [scheduleDate, nextDate(scheduleDate)]
  let cursor = start
  const end = start + duration

  while (cursor < end) {
    const slotIndex = Math.floor(cursor / INTERVAL_MINUTES)
    const slotStart = slotIndex * INTERVAL_MINUTES
    const slotEnd = slotStart + INTERVAL_MINUTES
    const overlapMinutes = Math.min(end, slotEnd) - cursor
    const overlapRatio = overlapMinutes / INTERVAL_MINUTES
    const dayOffset = Math.min(Math.floor((slotIndex * INTERVAL_MINUTES) / MINUTES_PER_DAY), 1)

    contributions.push({
      date: dates[dayOffset] ?? scheduleDate,
      intervalStart: minutesToTime(slotIndex * INTERVAL_MINUTES),
      overlapRatio: roundHalfEven(overlapRatio, 6),
      stdHeadcount: roundHalfEven(
        overlapRatio * segment.allocation_ratio * coefficient * segment.activity_coverage,
        6
      ),
    })
    cursor = slotEnd
  }

  return contributions
}

export function calculateRangeCoverage(
  dateFrom: string,
  dateTo: string,
  cellsByDate: Record<string, Record<string, ScheduleDeskApiSegment[]>>,
  demandByDate: Record<string, Record<string, number>>
): CoverageCalcRow[] {
  if (dateTo < dateFrom) {
    throw new Error("date_to must not be before date_from")
  }

  const stdByKey = new Map<string, number>()
  const coveredByEmployee = new Map<string, Set<string>>()

  for (const [scheduleDate, cells] of Object.entries(cellsByDate)) {
    for (const [employeeId, segments] of Object.entries(cells)) {
      let covered = coveredByEmployee.get(employeeId)

      if (!covered) {
        covered = new Set()
        coveredByEmployee.set(employeeId, covered)
      }

      for (const segment of segments) {
        if (segment.activity_type !== WORK_ACTIVITY_TYPE) {
          continue
        }

        for (const contribution of segmentIntervalContributions(scheduleDate, segment)) {
          const key = `${contribution.date}|${contribution.intervalStart}`
          stdByKey.set(key, (stdByKey.get(key) ?? 0) + contribution.stdHeadcount)
          covered.add(key)
        }
      }
    }
  }

  const physicalByKey = new Map<string, number>()

  for (const covered of coveredByEmployee.values()) {
    for (const key of covered) {
      physicalByKey.set(key, (physicalByKey.get(key) ?? 0) + 1)
    }
  }

  const rows: CoverageCalcRow[] = []

  for (const scheduleDate of expandDateRange(dateFrom, dateTo)) {
    const demandByInterval = demandByDate[scheduleDate] ?? {}

    for (let slotIndex = 0; slotIndex < COVERAGE_INTERVAL_COUNT; slotIndex += 1) {
      const intervalStart = minutesToTime(slotIndex * INTERVAL_MINUTES)
      const key = `${scheduleDate}|${intervalStart}`
      const demand = Number(demandByInterval[intervalStart] ?? 0)
      const planned = physicalByKey.get(key) ?? 0
      const stdPlanned = roundHalfEven(stdByKey.get(key) ?? 0, 6)

      rows.push({
        date: scheduleDate,
        intervalStart,
        demandHeadcount: demand,
        plannedHeadcount: planned,
        gap: roundHalfEven(demand - planned, 6),
        coverageRate: demand > 0 ? roundHalfEven(planned / demand, 6) : null,
        stdPlannedHeadcount: stdPlanned,
      })
    }
  }

  return rows
}

// 编辑后的本地即时覆盖（物理人数口径，与后端 recalculate 响应形状一致；
// 一期标准口径字段与物理口径保持同步）。demand 来自服务端覆盖响应。
export function computeLocalCoverage(
  dateFrom: string,
  dateTo: string,
  cells: Array<{ employee_id: string; schedule_date: string; segments: ScheduleDeskApiSegment[] }>,
  coverage: ScheduleDeskApiCoverage
): ScheduleDeskApiCoverage {
  const cellsByDate: Record<string, Record<string, ScheduleDeskApiSegment[]>> = {}

  for (const cell of cells) {
    const perDate = cellsByDate[cell.schedule_date] ?? {}
    perDate[cell.employee_id] = cell.segments
    cellsByDate[cell.schedule_date] = perDate
  }

  const demandByDate: Record<string, Record<string, number>> = {}

  for (const interval of coverage.intervals) {
    const perDate = demandByDate[interval.date] ?? {}
    perDate[interval.interval_start] = interval.demand_headcount
    demandByDate[interval.date] = perDate
  }

  const rows = calculateRangeCoverage(dateFrom, dateTo, cellsByDate, demandByDate)

  return {
    period_id: coverage.period_id,
    date_from: dateFrom,
    date_to: dateTo,
    intervals: rows.map((row) => ({
      date: row.date,
      interval_start: row.intervalStart,
      demand_headcount: row.demandHeadcount,
      planned_headcount: row.plannedHeadcount,
      gap: row.gap,
      coverage_rate: row.coverageRate,
      std_demand_headcount: row.demandHeadcount,
      std_planned_headcount: row.plannedHeadcount,
      std_gap: row.gap,
      std_coverage_rate: row.coverageRate,
    })),
  }
}

// ---- 编辑操作：脏标记聚合与冲突回滚辅助 ----

export type MatrixCellKey = { employee_id: string; schedule_date: string }

export type MatrixDirtyCell = {
  employee_id: string
  schedule_date: string
  segments: ScheduleDeskApiSegment[]
  segmentsDirty: boolean
  cleared: boolean
  locked: boolean
  lockDirty: boolean
}

export type MatrixBatchPayload = {
  changes: Array<{ employee_id: string; schedule_date: string; segments: ScheduleDeskApiSegment[] }>
  copies: Array<{
    source_employee_id: string
    source_date: string
    targets: MatrixCellKey[]
  }>
  clears: MatrixCellKey[]
  locks: Array<{ employee_id: string; schedule_date: string; locked: boolean }>
}

// 单元格寻址统一走结构化键（employeeId → scheduleDate 二级结构），
// 不再拼接/反解分隔符字符串，避免员工 ID 含特殊字符时错位。

// 脏单元格聚合为批量 PATCH 载荷：clear 优先于 set；锁操作单独进 locks。
export function aggregateDirtyCells(cells: MatrixDirtyCell[]): MatrixBatchPayload {
  const payload: MatrixBatchPayload = { changes: [], copies: [], clears: [], locks: [] }

  for (const cell of cells) {
    if (cell.segmentsDirty && cell.cleared) {
      payload.clears.push({ employee_id: cell.employee_id, schedule_date: cell.schedule_date })
    } else if (cell.segmentsDirty) {
      payload.changes.push({
        employee_id: cell.employee_id,
        schedule_date: cell.schedule_date,
        segments: cell.segments,
      })
    }

    if (cell.lockDirty) {
      payload.locks.push({
        employee_id: cell.employee_id,
        schedule_date: cell.schedule_date,
        locked: cell.locked,
      })
    }
  }

  return payload
}

export type MatrixCopyRequest = {
  source_employee_id: string
  source_date: string
  targets: MatrixCellKey[]
  sourceDirty: boolean
  sourceSegments: ScheduleDeskApiSegment[]
}

// 复制操作展开：源单元格未脏时走服务端 copies（服务端取源分段），
// 源已脏时降级为本地分段 changes，避免服务端取到旧值。
export function expandCopyOperation(copy: MatrixCopyRequest): Pick<MatrixBatchPayload, "changes" | "copies"> {
  if (copy.targets.length === 0) {
    return { changes: [], copies: [] }
  }

  if (copy.sourceDirty) {
    return {
      changes: copy.targets.map((target) => ({
        employee_id: target.employee_id,
        schedule_date: target.schedule_date,
        segments: copy.sourceSegments,
      })),
      copies: [],
    }
  }

  return {
    changes: [],
    copies: [
      {
        source_employee_id: copy.source_employee_id,
        source_date: copy.source_date,
        targets: copy.targets,
      },
    ],
  }
}

export type ScheduleMatrixConflict = {
  employee_id: string
  schedule_date: string
  reason: string
}

// 冲突单元格的结构化寻址集合：employeeId → 日期集合。
export function conflictCellAddressSet(
  conflicts: ScheduleMatrixConflict[]
): Map<string, Set<string>> {
  const addresses = new Map<string, Set<string>>()

  for (const conflict of conflicts) {
    let dates = addresses.get(conflict.employee_id)

    if (!dates) {
      dates = new Set()
      addresses.set(conflict.employee_id, dates)
    }

    dates.add(conflict.schedule_date)
  }

  return addresses
}

// ---- flush 竞态防护（纯函数层，供 store 使用，配 scripts/tests）----

// 发送时快照：记录 flush 发起时刻 cell 的分段引用与锁状态。
export type MatrixCellSnapshot = {
  segments: ScheduleDeskApiSegment[]
  locked: boolean
}

// 快照一致性判断：分段引用与锁状态都未变，说明 in-flight 期间该 cell
// 未被再次编辑，响应可以确认；任一不一致则保持脏标记等下一轮 flush，防丢变更。
export function cellSnapshotMatches(
  snapshot: MatrixCellSnapshot,
  current: MatrixCellSnapshot
): boolean {
  return current.segments === snapshot.segments && current.locked === snapshot.locked
}

// flush 响应归属判断：发起时记录的周期与当前周期一致才允许写权威状态，
// 跨周期的迟到响应（旧周期保存结果）必须丢弃，防止污染新周期。
export function isFlushPeriodCurrent(
  flushPeriodId: string,
  currentPeriodId: string | null
): boolean {
  return currentPeriodId !== null && currentPeriodId === flushPeriodId
}

// 直接编辑优先：后端按 changes → copies 顺序执行，同批次内被 changes/clears
//（含源已脏降级出的 changes）覆盖的 copy 目标必须剔除，否则 copy 会反过来
// 覆盖用户直接编辑的新值；targets 全被剔除的 copy 整体丢弃。
export function pruneCopyTargets(
  copies: MatrixCopyRequest[],
  directEdits: Map<string, Set<string>>
): MatrixCopyRequest[] {
  const pruned: MatrixCopyRequest[] = []

  for (const copy of copies) {
    const remainingTargets = copy.targets.filter(
      (target) => !directEdits.get(target.employee_id)?.has(target.schedule_date)
    )

    if (remainingTargets.length === 0) {
      continue
    }

    pruned.push(
      remainingTargets.length === copy.targets.length ? copy : { ...copy, targets: remainingTargets }
    )
  }

  return pruned
}

export function conflictReasonLabel(reason: string): string {
  switch (reason) {
    case "BASE_VERSION_STALE":
      return "矩阵版本已被更新"
    case "CELL_LOCKED":
      return "单元格已被锁定"
    case "COPY_SOURCE_MISSING":
      return "复制源单元格不存在"
    default:
      return reason
  }
}

export type ScheduleValidationIssue = {
  employee_id: string
  schedule_date: string
  segment_index: number | null
  rule_code: string
  message: string
}

export type ScheduleValidationResult = {
  errors: ScheduleValidationIssue[]
  warnings: ScheduleValidationIssue[]
}

// 保存响应 coverage_delta：以后端为权威合并进本地覆盖状态。
export type CoverageDeltaRow = {
  date: string
  interval_start: string
  planned_headcount: number
  gap: number
  coverage_rate: number | null
}

export function applyCoverageDelta(
  coverage: ScheduleDeskApiCoverage,
  delta: CoverageDeltaRow[]
): ScheduleDeskApiCoverage {
  if (delta.length === 0) {
    return coverage
  }

  const deltaByKey = new Map(delta.map((row) => [`${row.date}|${row.interval_start}`, row]))

  return {
    ...coverage,
    intervals: coverage.intervals.map((interval) => {
      const applied = deltaByKey.get(`${interval.date}|${interval.interval_start}`)

      if (!applied) {
        return interval
      }

      return {
        ...interval,
        planned_headcount: applied.planned_headcount,
        gap: applied.gap,
        coverage_rate: applied.coverage_rate,
        std_planned_headcount: applied.planned_headcount,
        std_gap: applied.gap,
        std_coverage_rate: applied.coverage_rate,
      }
    }),
  }
}
