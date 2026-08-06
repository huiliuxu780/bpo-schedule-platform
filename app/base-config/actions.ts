"use server"

import { redirect } from "next/navigation"

import {
  normalizeShiftDefinitionForm,
  type ShiftSegmentFormInput,
} from "@/components/base-config/shift-activity-model"
import {
  buildStatusMappingPutPayload,
  emptyStatusMappingRow,
  normalizeStatusMappingRows,
  type StatusMappingFormRow,
} from "@/components/base-config/status-mapping-model"
import { resolveScheduleDeskApiBase } from "@/lib/schedule-desk"

const SHIFTS_TAB_PATH = "/base-config?tab=shifts"
const STATUS_MAPPINGS_TAB_PATH = "/base-config?tab=status-mappings"

// 「班次与活动」标签提交：新建走 POST，修订走 PUT /{shift_code}；
// 两条路径在后端都追加新版本、归档旧版本，历史不被覆写。
// 成功/失败均 redirect 回 /base-config?tab=shifts 并以 shift_feedback_* 参数承载横幅。
export async function submitShiftDefinition(formData: FormData): Promise<void> {
  let redirectHref: string

  try {
    const editShiftCode = String(formData.get("edit_shift_code") ?? "").trim()
    const segments = collectShiftSegments(formData)
    const normalized = normalizeShiftDefinitionForm({
      shift_code: String(formData.get("shift_code") ?? ""),
      shift_name: String(formData.get("shift_name") ?? ""),
      effective_from: String(formData.get("effective_from") ?? ""),
      effective_to: String(formData.get("effective_to") ?? ""),
      is_cross_day: formData.get("is_cross_day") === "on",
      segments,
    })

    if (normalized.errors.length > 0 || normalized.payload === null) {
      redirectHref = buildTabRedirect(SHIFTS_TAB_PATH, {
        shift_feedback_status: "error",
        shift_feedback_code: "SHIFT_FORM_INVALID",
        shift_feedback_message: normalized.errors.join("；") || "班次表单校验失败",
      })
    } else {
      const payload = normalized.payload
      const isRevision = Boolean(editShiftCode)
      const url = isRevision
        ? `${resolveScheduleDeskApiBase()}/api/v1/shift-definitions/${encodeURIComponent(editShiftCode)}`
        : `${resolveScheduleDeskApiBase()}/api/v1/shift-definitions`
      const response = await fetch(url, {
        method: isRevision ? "PUT" : "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      })

      if (!response.ok) {
        const error = await readTabApiError(response, "班次定义保存失败")
        redirectHref = buildTabRedirect(SHIFTS_TAB_PATH, {
          shift_feedback_status: "error",
          shift_feedback_code: error.code,
          shift_feedback_message: error.message,
        })
      } else {
        const record = (await response.json()) as {
          shift_definition_id?: string
          shift_name?: string
        }
        redirectHref = buildTabRedirect(SHIFTS_TAB_PATH, {
          shift_feedback_status: "success",
          shift_feedback_record_id:
            record.shift_definition_id ?? payload.shift_code,
          shift_feedback_record_name: record.shift_name ?? payload.shift_name,
        })
      }
    }
  } catch (error) {
    redirectHref = buildTabRedirect(SHIFTS_TAB_PATH, {
      shift_feedback_status: "error",
      shift_feedback_code: "SHIFT_DEFINITION_SUBMIT_FAILED",
      shift_feedback_message: formatTabError(error, "班次定义保存失败"),
    })
  }

  redirect(redirectHref)
}

// 「状态映射」标签提交：整表按三元组归一化后 PUT /api/v1/status-mappings，
// 后端按 (status, sub_status, status_cd) 复合主键 upsert 合并。
export async function submitStatusMappings(formData: FormData): Promise<void> {
  let redirectHref: string

  try {
    const rows = parseStatusMappingRows(formData)
    const normalized = normalizeStatusMappingRows(rows)

    if (normalized.errors.length > 0) {
      redirectHref = buildTabRedirect(STATUS_MAPPINGS_TAB_PATH, {
        mapping_feedback_status: "error",
        mapping_feedback_code: "STATUS_MAPPING_FORM_INVALID",
        mapping_feedback_message: normalized.errors.join("；"),
      })
    } else if (normalized.items.length === 0) {
      redirectHref = buildTabRedirect(STATUS_MAPPINGS_TAB_PATH, {
        mapping_feedback_status: "error",
        mapping_feedback_code: "STATUS_MAPPING_EMPTY",
        mapping_feedback_message: "请至少新增一条状态映射后再保存",
      })
    } else {
      const response = await fetch(
        `${resolveScheduleDeskApiBase()}/api/v1/status-mappings`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(buildStatusMappingPutPayload(normalized.items)),
          cache: "no-store",
        }
      )

      if (!response.ok) {
        const error = await readTabApiError(response, "状态映射保存失败")
        redirectHref = buildTabRedirect(STATUS_MAPPINGS_TAB_PATH, {
          mapping_feedback_status: "error",
          mapping_feedback_code: error.code,
          mapping_feedback_message: error.message,
        })
      } else {
        const result = (await response.json()) as {
          items?: unknown[]
        }
        redirectHref = buildTabRedirect(STATUS_MAPPINGS_TAB_PATH, {
          mapping_feedback_status: "success",
          mapping_feedback_saved_count: String(
            Array.isArray(result.items) ? result.items.length : normalized.items.length
          ),
        })
      }
    }
  } catch (error) {
    redirectHref = buildTabRedirect(STATUS_MAPPINGS_TAB_PATH, {
      mapping_feedback_status: "error",
      mapping_feedback_code: "STATUS_MAPPING_SUBMIT_FAILED",
      mapping_feedback_message: formatTabError(error, "状态映射保存失败"),
    })
  }

  redirect(redirectHref)
}

// 三组并列的 FormData 字段按 DOM 顺序 zip 成分段列表。
function collectShiftSegments(formData: FormData): ShiftSegmentFormInput[] {
  const activityTypes = formData.getAll("segment_activity_type").map(String)
  const startTimes = formData.getAll("segment_start_time").map(String)
  const endTimes = formData.getAll("segment_end_time").map(String)

  return activityTypes.map((activityType, index) => ({
    activity_type: activityType,
    start_time: startTimes[index] ?? "",
    end_time: endTimes[index] ?? "",
  }))
}

// 每行一个 JSON 字符串（客户端组件随编辑状态同步）。FormData 内容不可信：
// 只接受对象并逐字段归一，非对象/解析失败回退空行交给必填校验，
// 避免 null 字段在 normalize 抛 TypeError 把原始 JS 错误串回显进横幅。
function parseStatusMappingRows(formData: FormData): StatusMappingFormRow[] {
  return formData.getAll("mapping_row").map((raw) => {
    try {
      const parsed: unknown = JSON.parse(String(raw))

      if (
        typeof parsed !== "object" ||
        parsed === null ||
        Array.isArray(parsed)
      ) {
        return emptyStatusMappingRow()
      }

      const record = parsed as Record<string, unknown>

      return {
        status: toRowText(record.status),
        sub_status: toRowText(record.sub_status),
        status_cd: toRowText(record.status_cd),
        activity_code: toRowText(record.activity_code),
        activity_name: toRowText(record.activity_name),
        counts_attendance: record.counts_attendance === true,
        counts_valid_hours: record.counts_valid_hours === true,
        counts_production_hours: record.counts_production_hours === true,
        counts_coverage: record.counts_coverage === true,
        counts_rest: record.counts_rest === true,
        counts_punctuality: record.counts_punctuality === true,
      }
    } catch {
      return emptyStatusMappingRow()
    }
  })
}

function toRowText(value: unknown): string {
  if (typeof value === "string") {
    return value
  }

  if (value === null || value === undefined) {
    return ""
  }

  return String(value)
}

// basePath 已携带 tab 查询参数，反馈参数需 merge 而非直接拼 ?。
function buildTabRedirect(
  basePath: string,
  params: Record<string, string>
): string {
  const [pathname, existingQuery = ""] = basePath.split("?")
  const searchParams = new URLSearchParams(existingQuery)

  for (const [key, value] of Object.entries(params)) {
    searchParams.set(key, value)
  }

  return `${pathname}?${searchParams.toString()}`
}

async function readTabApiError(response: Response, fallbackTitle: string) {
  try {
    const payload = (await response.json()) as {
      detail?: {
        error?: {
          code?: string
          message?: string
        }
      }
    }
    const error = payload.detail?.error

    return {
      code: error?.code ?? `HTTP_${response.status}`,
      message: error?.message ?? `${fallbackTitle}（状态码 ${response.status}）`,
    }
  } catch {
    return {
      code: `HTTP_${response.status}`,
      message: `${fallbackTitle}（状态码 ${response.status}）`,
    }
  }
}

function formatTabError(error: unknown, fallbackMessage: string): string {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallbackMessage
}
