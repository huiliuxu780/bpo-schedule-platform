// 「状态映射」标签模型层：纯函数，不依赖 React/Next，供 node:test 直接覆盖。
// 契约（后端 status_mapping）：status/sub_status/status_cd 三元组为复合主键，
// PUT /api/v1/status-mappings 按复合主键 upsert 合并；映射到业务活动并携带六个计数开关。

export type StatusMappingCountFlagKey =
  | "counts_attendance"
  | "counts_valid_hours"
  | "counts_production_hours"
  | "counts_coverage"
  | "counts_rest"
  | "counts_punctuality"

export const statusMappingCountFlagOptions: {
  key: StatusMappingCountFlagKey
  label: string
}[] = [
  { key: "counts_attendance", label: "计入考勤" },
  { key: "counts_valid_hours", label: "计入有效工时" },
  { key: "counts_production_hours", label: "计入生产工时" },
  { key: "counts_coverage", label: "计入覆盖" },
  { key: "counts_rest", label: "计入休息" },
  { key: "counts_punctuality", label: "计入准时性" },
]

export type StatusMappingApiRecord = {
  status: string
  sub_status: string
  status_cd: string
  activity_code: string
  activity_name: string
  counts_attendance: boolean
  counts_valid_hours: boolean
  counts_production_hours: boolean
  counts_coverage: boolean
  counts_rest: boolean
  counts_punctuality: boolean
}

export type StatusMappingFormRow = StatusMappingApiRecord

export type StatusMappingPutPayload = {
  items: StatusMappingApiRecord[]
}

export type StatusMappingNormalized = {
  errors: string[]
  items: StatusMappingApiRecord[]
}

export function emptyStatusMappingRow(): StatusMappingFormRow {
  return {
    status: "",
    sub_status: "",
    status_cd: "",
    activity_code: "",
    activity_name: "",
    counts_attendance: false,
    counts_valid_hours: false,
    counts_production_hours: false,
    counts_coverage: false,
    counts_rest: false,
    counts_punctuality: false,
  }
}

function isBlankRow(row: StatusMappingFormRow): boolean {
  return (
    !row.status.trim() &&
    !row.sub_status.trim() &&
    !row.status_cd.trim() &&
    !row.activity_code.trim() &&
    !row.activity_name.trim()
  )
}

// 归一化：trim 文本字段、强制布尔、整行空白则跳过、必填校验带行号、
// 复合主键重复时保留最后一行（与 PUT upsert 合并语义一致），最后稳定排序。
export function normalizeStatusMappingRows(
  rows: StatusMappingFormRow[]
): StatusMappingNormalized {
  const errors: string[] = []
  const merged = new Map<string, StatusMappingApiRecord>()

  rows.forEach((row, index) => {
    if (isBlankRow(row)) {
      return
    }

    const position = `第${index + 1}行`
    const status = row.status.trim()
    const subStatus = row.sub_status.trim()
    const statusCd = row.status_cd.trim()
    const activityCode = row.activity_code.trim()
    const activityName = row.activity_name.trim()
    const missing: string[] = []

    if (!status) missing.push("状态")
    if (!subStatus) missing.push("子状态")
    if (!statusCd) missing.push("状态码")
    if (!activityCode) missing.push("业务活动代码")
    if (!activityName) missing.push("业务活动名称")

    if (missing.length > 0) {
      errors.push(`STATUS_MAPPING_FIELD_REQUIRED: ${position}缺少${missing.join("、")}`)

      return
    }

    merged.set(`${status}\u0000${subStatus}\u0000${statusCd}`, {
      status,
      sub_status: subStatus,
      status_cd: statusCd,
      activity_code: activityCode,
      activity_name: activityName,
      // 严格比较：FormData/JSON 来源可能是 "false"/"0"/1 等脏值，一律不当作开启。
      counts_attendance: row.counts_attendance === true,
      counts_valid_hours: row.counts_valid_hours === true,
      counts_production_hours: row.counts_production_hours === true,
      counts_coverage: row.counts_coverage === true,
      counts_rest: row.counts_rest === true,
      counts_punctuality: row.counts_punctuality === true,
    })
  })

  if (errors.length > 0) {
    return { errors, items: [] }
  }

  const items = Array.from(merged.values()).sort(
    (left, right) =>
      compareMappingStrings(left.status, right.status) ||
      compareMappingStrings(left.sub_status, right.sub_status) ||
      compareMappingStrings(left.status_cd, right.status_cd)
  )

  return { errors: [], items }
}

// 码位比较保证排序在任何运行时都确定（展示用，无语言学区分需求）。
function compareMappingStrings(left: string, right: string): number {
  if (left < right) return -1
  if (left > right) return 1

  return 0
}

export function buildStatusMappingPutPayload(
  items: StatusMappingApiRecord[]
): StatusMappingPutPayload {
  return { items: items.map((item) => ({ ...item })) }
}

// 已开启的计数口径中文描述（列表只读渲染用）。
export function summarizeStatusMappingCountFlags(
  record: StatusMappingApiRecord
): string[] {
  return statusMappingCountFlagOptions
    .filter((option) => record[option.key])
    .map((option) => option.label)
}

export function buildStatusMappingKey(record: StatusMappingApiRecord): string {
  return `${record.status} / ${record.sub_status} / ${record.status_cd}`
}

// 状态映射保存反馈横幅：由 server action redirect 携带 mapping_feedback_* 参数驱动。
export function summarizeStatusMappingFeedback(
  searchParams: Record<string, string | string[] | undefined>
): { tone: "success" | "error"; title: string; detail: string } | null {
  const getParam = (key: string): string => {
    const value = searchParams[key]

    if (Array.isArray(value)) {
      return value[0] ?? ""
    }

    return value ?? ""
  }

  const status = getParam("mapping_feedback_status")

  if (status === "success") {
    const savedCount = getParam("mapping_feedback_saved_count")

    return {
      tone: "success",
      title: "状态映射保存成功",
      detail: savedCount
        ? `已按状态三元组合并保存 ${savedCount} 条映射。`
        : "状态映射已按状态三元组合并保存。",
    }
  }

  if (status === "error") {
    const code =
      getParam("mapping_feedback_code") || "STATUS_MAPPING_SUBMIT_FAILED"
    const message = getParam("mapping_feedback_message") || "后端未返回错误说明"

    return {
      tone: "error",
      title: "状态映射保存失败",
      detail: `${code}: ${message}`,
    }
  }

  return null
}
