// 「班次与活动」标签模型层：纯函数，不依赖 React/Next，供 node:test 直接覆盖。
// 版本语义（后端 shift_definition 契约）：新建/修订班次都追加新版本，
// 旧版本归档保留，历史永不覆写；客户端校验对齐后端并叠加更严格的产品规则。

export type ShiftActivityType = "work" | "rest" | "meal" | "training"

export const shiftActivityOptions: {
  value: ShiftActivityType
  label: string
}[] = [
  { value: "work", label: "工作" },
  { value: "meal", label: "用餐" },
  { value: "rest", label: "休息" },
  { value: "training", label: "培训" },
]

export function getShiftActivityLabel(activityType: string): string {
  return (
    shiftActivityOptions.find((option) => option.value === activityType)
      ?.label ?? activityType
  )
}

export const SHIFT_MINUTES_PER_DAY = 1440
export const SHIFT_SEGMENT_GRANULARITY_MINUTES = 15

export type ShiftSegmentFormInput = {
  activity_type: string
  start_time: string
  end_time: string
}

export type ShiftDefinitionFormInput = {
  shift_code: string
  shift_name: string
  effective_from: string
  effective_to: string
  is_cross_day: boolean
  segments: ShiftSegmentFormInput[]
}

export type ShiftDefinitionPayload = {
  shift_code: string
  shift_name: string
  effective_from: string
  effective_to: string
  segments: ShiftSegmentFormInput[]
  is_cross_day: boolean
  night_attribution: "start_date"
}

export type ShiftDefinitionApiRecord = {
  shift_definition_id: string
  shift_code: string
  version_number: number
  shift_name: string
  effective_from: string
  effective_to: string
  segments: ShiftSegmentFormInput[]
  is_cross_day: boolean
  night_attribution: string
  status: string
  created_at: string
}

export type ShiftDefinitionNormalized = {
  errors: string[]
  payload: ShiftDefinitionPayload | null
}

const SHIFT_TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/
const SHIFT_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

// 解析 HH:MM 为当日分钟数；非法格式返回 null（与后端 parse_time_to_minutes 对齐）。
export function parseShiftTimeToMinutes(value: string): number | null {
  const match = SHIFT_TIME_PATTERN.exec(value.trim())

  if (!match) {
    return null
  }

  return Number(match[1]) * 60 + Number(match[2])
}

export function formatShiftDuration(totalMinutes: number): string {
  const minutes = Math.max(0, Math.round(totalMinutes))
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60

  if (hours === 0) {
    return `${rest}分钟`
  }

  return rest === 0 ? `${hours}小时` : `${hours}小时${rest}分钟`
}

// 分段时长：结束早于开始时仅跨日班次允许回绕到次日；非法返回 null。
export function shiftSegmentDurationMinutes(
  segment: ShiftSegmentFormInput,
  isCrossDay: boolean
): number | null {
  const start = parseShiftTimeToMinutes(segment.start_time)
  const end = parseShiftTimeToMinutes(segment.end_time)

  if (start === null || end === null || start === end) {
    return null
  }

  if (end > start) {
    return end - start
  }

  return isCrossDay ? SHIFT_MINUTES_PER_DAY - start + end : null
}

// 表单归一化与校验：先对齐后端规则（必填、生效区间、分段非空、
// 起止不同、必须含工作分段），再叠加产品规则（15 分钟粒度、24 小时上限、
// 非跨日班次不允许结束早于开始）。
export function normalizeShiftDefinitionForm(
  input: ShiftDefinitionFormInput
): ShiftDefinitionNormalized {
  const errors: string[] = []
  const shiftCode = input.shift_code.trim()
  const shiftName = input.shift_name.trim()
  const effectiveFrom = input.effective_from.trim()
  const effectiveTo = input.effective_to.trim()

  if (!shiftCode) {
    errors.push("SHIFT_CODE_REQUIRED: 班次代码不能为空")
  }

  if (!shiftName) {
    errors.push("SHIFT_NAME_REQUIRED: 班次名称不能为空")
  }

  if (!effectiveFrom || !effectiveTo) {
    errors.push("EFFECTIVE_DATE_REQUIRED: 生效起止日期不能为空")
  } else if (
    !SHIFT_DATE_PATTERN.test(effectiveFrom) ||
    !SHIFT_DATE_PATTERN.test(effectiveTo)
  ) {
    errors.push("INVALID_EFFECTIVE_PERIOD: 生效日期需为 YYYY-MM-DD 格式")
  } else if (effectiveTo < effectiveFrom) {
    errors.push("INVALID_EFFECTIVE_PERIOD: 生效日期范围无效")
  }

  const segments = (input.segments ?? []).map((segment) => ({
    activity_type: segment.activity_type.trim(),
    start_time: segment.start_time.trim(),
    end_time: segment.end_time.trim(),
  }))

  if (segments.length === 0) {
    errors.push("SHIFT_SEGMENTS_REQUIRED: 班次至少需要一个活动分段")

    return { errors, payload: null }
  }

  let totalMinutes = 0
  let hasWorkSegment = false

  segments.forEach((segment, index) => {
    const position = `分段${index + 1}`
    const knownActivity = shiftActivityOptions.some(
      (option) => option.value === segment.activity_type
    )

    if (!knownActivity) {
      errors.push(`SHIFT_SEGMENT_ACTIVITY_INVALID: ${position}的活动类型无效`)
    }

    const start = parseShiftTimeToMinutes(segment.start_time)
    const end = parseShiftTimeToMinutes(segment.end_time)

    if (start === null || end === null) {
      errors.push(`SHIFT_SEGMENT_TIME_INVALID: ${position}的时间需为 HH:MM 格式`)

      return
    }

    if (
      start % SHIFT_SEGMENT_GRANULARITY_MINUTES !== 0 ||
      end % SHIFT_SEGMENT_GRANULARITY_MINUTES !== 0
    ) {
      errors.push(`SHIFT_SEGMENT_GRANULARITY: ${position}的时间需按 15 分钟粒度对齐`)
    }

    if (start === end) {
      errors.push(`SHIFT_SEGMENT_INVALID: ${position}的起止时间不能相同`)

      return
    }

    if (end < start && !input.is_cross_day) {
      errors.push(
        `SHIFT_SEGMENT_CROSS_DAY: ${position}结束早于开始，请勾选「跨日班次」`
      )

      return
    }

    const duration = shiftSegmentDurationMinutes(segment, input.is_cross_day)

    if (duration === null) {
      errors.push(`SHIFT_SEGMENT_INVALID: ${position}的起止时间无法计算时长`)

      return
    }

    totalMinutes += duration

    if (segment.activity_type === "work") {
      hasWorkSegment = true
    }
  })

  if (!hasWorkSegment) {
    errors.push("SHIFT_WORK_SEGMENT_REQUIRED: 班次必须包含至少一个工作分段")
  }

  if (totalMinutes > SHIFT_MINUTES_PER_DAY) {
    errors.push("SHIFT_DURATION_EXCEEDED: 班次分段总时长不能超过 24 小时")
  }

  if (errors.length > 0) {
    return { errors, payload: null }
  }

  return {
    errors: [],
    payload: {
      shift_code: shiftCode,
      shift_name: shiftName,
      effective_from: effectiveFrom,
      effective_to: effectiveTo,
      segments,
      is_cross_day: input.is_cross_day,
      night_attribution: "start_date",
    },
  }
}

// 版本分组：同一班次码下按版本号倒序，latest 恒为最大版本号。
export type ShiftVersionGroup = {
  shift_code: string
  latest: ShiftDefinitionApiRecord
  versions: ShiftDefinitionApiRecord[]
  latestTotalMinutes: number
}

export function groupShiftDefinitionVersions(
  items: ShiftDefinitionApiRecord[]
): ShiftVersionGroup[] {
  const byCode = new Map<string, ShiftDefinitionApiRecord[]>()

  for (const item of items) {
    if (!item.shift_code) {
      continue
    }

    const list = byCode.get(item.shift_code) ?? []
    list.push(item)
    byCode.set(item.shift_code, list)
  }

  return Array.from(byCode.entries())
    .map(([shiftCode, versions]) => {
      const sorted = [...versions].sort(
        (left, right) => right.version_number - left.version_number
      )
      const latest = sorted[0]
      const latestTotalMinutes = (latest?.segments ?? []).reduce(
        (sum, segment) =>
          sum + (shiftSegmentDurationMinutes(segment, latest.is_cross_day) ?? 0),
        0
      )

      return {
        shift_code: shiftCode,
        latest,
        versions: sorted,
        latestTotalMinutes,
      }
    })
    .sort((left, right) =>
      left.shift_code < right.shift_code
        ? -1
        : left.shift_code > right.shift_code
          ? 1
          : 0
    )
}

// 时间条：把分段投影到 00:00–24:00 轨道；跨日回绕拆成两段渲染。
export type ShiftSegmentBar = {
  key: string
  activity_type: ShiftActivityType
  label: string
  leftPercent: number
  widthPercent: number
  wrapped: boolean
}

export function buildShiftSegmentBars(
  segments: ShiftSegmentFormInput[],
  isCrossDay: boolean
): ShiftSegmentBar[] {
  const bars: ShiftSegmentBar[] = []

  segments.forEach((segment, index) => {
    const start = parseShiftTimeToMinutes(segment.start_time)
    const end = parseShiftTimeToMinutes(segment.end_time)

    if (start === null || end === null || start === end) {
      return
    }

    const activityType = (
      shiftActivityOptions.some((option) => option.value === segment.activity_type)
        ? segment.activity_type
        : "work"
    ) as ShiftActivityType
    const label = `${getShiftActivityLabel(activityType)} ${segment.start_time}-${segment.end_time}`
    const toPercent = (minutes: number) => (minutes / SHIFT_MINUTES_PER_DAY) * 100

    if (end > start) {
      bars.push({
        key: `segment-${index}`,
        activity_type: activityType,
        label,
        leftPercent: toPercent(start),
        widthPercent: toPercent(end - start),
        wrapped: false,
      })

      return
    }

    if (!isCrossDay) {
      return
    }

    bars.push({
      key: `segment-${index}-head`,
      activity_type: activityType,
      label: `${label}（当日部分）`,
      leftPercent: toPercent(start),
      widthPercent: toPercent(SHIFT_MINUTES_PER_DAY - start),
      wrapped: false,
    })

    // end 恰为 00:00 时次日部分宽度为 0，跳过避免出现「次日部分」伪影。
    if (end === 0) {
      return
    }

    bars.push({
      key: `segment-${index}-tail`,
      activity_type: activityType,
      label: `${label}（次日部分）`,
      leftPercent: 0,
      widthPercent: toPercent(end),
      wrapped: true,
    })
  })

  return bars
}

export type BaseConfigTabFeedback = {
  tone: "success" | "error"
  title: string
  detail: string
}

function getFeedbackParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
): string {
  const value = searchParams[key]

  if (Array.isArray(value)) {
    return value[0] ?? ""
  }

  return value ?? ""
}

// 班次提交反馈横幅：由 server action redirect 携带 shift_feedback_* 参数驱动。
export function summarizeShiftFeedback(
  searchParams: Record<string, string | string[] | undefined>
): BaseConfigTabFeedback | null {
  const status = getFeedbackParam(searchParams, "shift_feedback_status")

  if (status === "success") {
    const recordId = getFeedbackParam(searchParams, "shift_feedback_record_id")
    const recordName = getFeedbackParam(searchParams, "shift_feedback_record_name")

    return {
      tone: "success",
      title: "班次定义保存成功",
      detail: `${recordId || "班次"} ${recordName || ""} 已生成新版本，历史版本未被覆写。`.trim(),
    }
  }

  if (status === "error") {
    const code =
      getFeedbackParam(searchParams, "shift_feedback_code") ||
      "SHIFT_DEFINITION_SUBMIT_FAILED"
    const message =
      getFeedbackParam(searchParams, "shift_feedback_message") || "后端未返回错误说明"

    return {
      tone: "error",
      title: "班次定义保存失败",
      detail: `${code}: ${message}`,
    }
  }

  return null
}
