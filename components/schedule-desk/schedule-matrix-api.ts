// 排班矩阵客户端直连 API（写路径）：本项目数据流约定的唯一例外，
// 读路径仍由 lib/schedule-desk.ts 的服务端 fetch 承担。
//
// API base 运行时注入：服务端组件（app/schedule-desk/page.tsx）在请求时求值
// 后以 prop 传入并经 configureScheduleDeskApiBase 注入。客户端代码不读取
// process.env.NEXT_PUBLIC_* 内联值，避免构建期冻结 base 导致构建环境与
// 运行环境端口不一致（干净构建 + e2e 8810 的场景）。

import {
  type CoverageDeltaRow,
  type ScheduleDeskApiCoverage,
  type ScheduleMatrixConflict,
  type ScheduleValidationResult,
} from "@/components/schedule-desk/schedule-matrix-model"

export type MatrixSegmentPayload = {
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

export type MatrixCellTargetPayload = {
  employee_id: string
  schedule_date: string
}

export type MatrixBatchUpdatePayload = {
  base_version: number
  changes: Array<{
    employee_id: string
    schedule_date: string
    segments: MatrixSegmentPayload[]
  }>
  copies: Array<{
    source_employee_id: string
    source_date: string
    targets: MatrixCellTargetPayload[]
  }>
  clears: MatrixCellTargetPayload[]
  locks: Array<{ employee_id: string; schedule_date: string; locked: boolean }>
}

export type MatrixBatchUpdateResponse = {
  version: number
  accepted: number
  conflicts: ScheduleMatrixConflict[]
  coverage_delta: CoverageDeltaRow[]
}

export type MatrixSaveResult =
  | { kind: "success"; data: MatrixBatchUpdateResponse }
  | {
      kind: "conflict"
      currentVersion: number
      conflicts: ScheduleMatrixConflict[]
      message: string
    }
  | { kind: "error"; message: string }

export type SchedulePublishResponse = {
  publication_id: string
  version_id: string
  published_at: string
}

let injectedApiBase: string | null = null

// 由服务端组件在挂载/刷新时注入运行时求值的 API base。
export function configureScheduleDeskApiBase(apiBase: string): void {
  injectedApiBase = apiBase.replace(/\/+$/, "")
}

function getClientApiBase(): string {
  return injectedApiBase ?? "http://127.0.0.1:8000"
}

export function buildScheduleDeskApiUrl(path: string): string {
  const base = getClientApiBase()
  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  return `${base}${normalizedPath}`
}

async function readErrorDetail(response: Response): Promise<{
  code: string | null
  message: string
  error: Record<string, unknown> | null
}> {
  try {
    const body = (await response.json()) as {
      detail?: { error?: Record<string, unknown> & { code?: string; message?: string } }
    }
    const error = body?.detail?.error ?? null

    return {
      code: typeof error?.code === "string" ? error.code : null,
      message:
        typeof error?.message === "string" && error.message
          ? error.message
          : `请求失败（状态码 ${response.status}）`,
      error,
    }
  } catch {
    return { code: null, message: `请求失败（状态码 ${response.status}）`, error: null }
  }
}

export async function patchScheduleMatrixBatch(
  periodId: string,
  payload: MatrixBatchUpdatePayload
): Promise<MatrixSaveResult> {
  try {
    const response = await fetch(
      buildScheduleDeskApiUrl(
        `/api/v1/schedule-periods/${encodeURIComponent(periodId)}/matrix/batch`
      ),
      {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    )

    if (response.status === 409) {
      const detail = await readErrorDetail(response)

      if (detail.code === "SCHEDULE_MATRIX_VERSION_CONFLICT" && detail.error) {
        const currentVersion =
          typeof detail.error.current_version === "number" ? detail.error.current_version : 0
        const conflicts = Array.isArray(detail.error.conflicts)
          ? (detail.error.conflicts as ScheduleMatrixConflict[])
          : []

        return { kind: "conflict", currentVersion, conflicts, message: detail.message }
      }

      return { kind: "error", message: detail.message }
    }

    if (!response.ok) {
      const detail = await readErrorDetail(response)

      return { kind: "error", message: detail.message }
    }

    return { kind: "success", data: (await response.json()) as MatrixBatchUpdateResponse }
  } catch {
    return { kind: "error", message: "后端服务不可用，改动暂未保存" }
  }
}

export async function postScheduleValidation(
  periodId: string,
  dateFrom: string,
  dateTo: string
): Promise<{ data: ScheduleValidationResult | null; error: string | null }> {
  try {
    const response = await fetch(
      buildScheduleDeskApiUrl(`/api/v1/schedule-periods/${encodeURIComponent(periodId)}/validate`),
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ org_scope: "*", date_from: dateFrom, date_to: dateTo }),
      }
    )

    if (!response.ok) {
      const detail = await readErrorDetail(response)

      return { data: null, error: detail.message }
    }

    const body = (await response.json()) as ScheduleValidationResult

    return {
      data: {
        errors: Array.isArray(body.errors) ? body.errors : [],
        warnings: Array.isArray(body.warnings) ? body.warnings : [],
      },
      error: null,
    }
  } catch {
    return { data: null, error: "后端服务不可用，校验未能执行" }
  }
}

export async function postSchedulePublish(
  periodId: string,
  request: { date_from: string; date_to: string; note?: string }
): Promise<{ data: SchedulePublishResponse | null; error: string | null }> {
  try {
    const response = await fetch(
      buildScheduleDeskApiUrl(`/api/v1/schedule-periods/${encodeURIComponent(periodId)}/publish`),
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ org_scope: "*", ...request }),
      }
    )

    if (!response.ok) {
      const detail = await readErrorDetail(response)

      return { data: null, error: detail.message }
    }

    return { data: (await response.json()) as SchedulePublishResponse, error: null }
  } catch {
    return { data: null, error: "后端服务不可用，发布未能执行" }
  }
}

export async function postCoverageRecalculate(
  periodId: string,
  dateFrom: string,
  dateTo: string
): Promise<{ data: ScheduleDeskApiCoverage | null; error: string | null }> {
  try {
    const response = await fetch(
      buildScheduleDeskApiUrl(
        `/api/v1/schedule-periods/${encodeURIComponent(periodId)}/coverage/recalculate`
      ),
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date_from: dateFrom, date_to: dateTo }),
      }
    )

    if (!response.ok) {
      const detail = await readErrorDetail(response)

      return { data: null, error: detail.message }
    }

    return { data: (await response.json()) as ScheduleDeskApiCoverage, error: null }
  } catch {
    return { data: null, error: "后端服务不可用" }
  }
}
