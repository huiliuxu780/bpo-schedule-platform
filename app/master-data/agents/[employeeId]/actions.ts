"use server"

import { redirect } from "next/navigation"

import {
  buildEmployeeRestrictionsApiPath,
  buildEmployeeRestrictionsPayload,
  normalizeUnavailableDates,
} from "@/components/employee-restrictions-model"
import { buildImportApiUrl } from "@/components/import-center-model"

// 员工详情页「排班限制」区块提交：PATCH 夜班/跨日班开关与不可排班日期，
// 成功/失败均 redirect 回详情页并以 maintenance_* 查询参数承载反馈横幅。
export async function submitEmployeeRestrictions(
  formData: FormData
): Promise<void> {
  let redirectHref: string
  const employeeId = getFormValue(formData, "employee_id")
  const detailPath = buildRestrictionsDetailPath(employeeId)

  try {
    if (!employeeId) {
      redirectHref = buildRestrictionsRedirect(detailPath, {
        maintenance_status: "error",
        record_type: "排班限制",
        maintenance_code: "MISSING_REQUIRED_FIELD",
        maintenance_message: "人员 ID 不能为空",
      })
    } else {
      const normalized = normalizeUnavailableDates(
        formData.getAll("unavailable_dates").map(String)
      )

      if (normalized.errors.length > 0) {
        redirectHref = buildRestrictionsRedirect(detailPath, {
          maintenance_status: "error",
          record_type: "排班限制",
          maintenance_code: "INVALID_UNAVAILABLE_DATE",
          maintenance_message: normalized.errors.join("；"),
        })
      } else {
        const payload = buildEmployeeRestrictionsPayload({
          nightShiftAllowed: formData.get("night_shift_allowed") === "on",
          crossDayAllowed: formData.get("cross_day_allowed") === "on",
          unavailableDates: normalized.dates,
        })
        const response = await fetch(
          buildImportApiUrl(buildEmployeeRestrictionsApiPath(employeeId)),
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
            cache: "no-store",
          }
        )

        if (!response.ok) {
          const error = await readRestrictionsApiError(response)
          redirectHref = buildRestrictionsRedirect(detailPath, {
            maintenance_status: "error",
            record_type: "排班限制",
            maintenance_code: error.code,
            maintenance_message: error.message,
          })
        } else {
          const result = (await response.json()) as {
            employee_id?: string
          }
          redirectHref = buildRestrictionsRedirect(detailPath, {
            maintenance_status: "success",
            record_type: "排班限制",
            action_status: "restrictions_updated",
            record_id: result.employee_id ?? employeeId,
            record_name: "夜班/跨日班开关与不可排班日期",
            record_status: "已生效",
          })
        }
      }
    }
  } catch (error) {
    redirectHref = buildRestrictionsRedirect(detailPath, {
      maintenance_status: "error",
      record_type: "排班限制",
      maintenance_code: "EMPLOYEE_RESTRICTIONS_SUBMIT_FAILED",
      maintenance_message: formatRestrictionsError(error),
    })
  }

  redirect(redirectHref)
}

function buildRestrictionsDetailPath(employeeId: string): string {
  if (!employeeId) {
    return "/base-config?tab=employees"
  }

  return `/master-data/agents/${encodeURIComponent(employeeId)}`
}

// detailPath 可能已携带 query（兜底 /base-config?tab=employees），需 merge 而非直接拼 ?。
function buildRestrictionsRedirect(
  detailPath: string,
  params: Record<string, string>
): string {
  const [pathname, existingQuery = ""] = detailPath.split("?")
  const searchParams = new URLSearchParams(existingQuery)

  for (const [key, value] of Object.entries(params)) {
    searchParams.set(key, value)
  }

  return `${pathname}?${searchParams.toString()}`
}

function getFormValue(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim()
}

async function readRestrictionsApiError(response: Response) {
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
      message: error?.message ?? `排班限制保存失败（状态码 ${response.status}）`,
    }
  } catch {
    return {
      code: `HTTP_${response.status}`,
      message: `排班限制保存失败（状态码 ${response.status}）`,
    }
  }
}

function formatRestrictionsError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return "排班限制保存失败"
}
