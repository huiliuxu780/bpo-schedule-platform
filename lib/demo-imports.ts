import type {
  DashboardImportRecordSummary,
  DashboardSyncStatusRow,
} from "@/components/data-table-model"

export type DemoImportKind = "staff_master" | "status_log" | "login_log"

export type DemoImportRowError = {
  row_number: number
  message: string
}

export type DemoImportBatchSummary = {
  batch_id: string
  kind: DemoImportKind
  source_name: string
  status: "imported" | "needs_attention"
  success_rows: number
  failed_rows: number
  imported_at: string
}

export type DemoImportResponse = {
  batch: DemoImportBatchSummary
  errors: DemoImportRowError[]
}

type DemoImportBatchListResponse = {
  items: DemoImportBatchSummary[]
}

type DemoImportRecordListResponse = {
  items: DashboardImportRecordSummary[]
}

const API_BASE_URL =
  process.env.BPO_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000"

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    })

    if (!response.ok) {
      return null
    }

    return (await response.json()) as T
  } catch {
    return null
  }
}

async function writeJson<T>(path: string, payload: unknown): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      return null
    }

    return (await response.json()) as T
  } catch {
    return null
  }
}

export async function getDemoImportBatches() {
  const response = await fetchJson<DemoImportBatchListResponse>(
    "/api/v1/demo-imports/batches"
  )

  return response?.items ?? []
}

export async function getDemoImportRecords() {
  const response = await fetchJson<DemoImportRecordListResponse>(
    "/api/v1/demo-imports/records"
  )

  return response?.items ?? []
}

export async function importDemoCsv(kind: DemoImportKind, csvText: string) {
  return writeJson<DemoImportResponse>(`/api/v1/demo-imports/${kind}`, {
    csv_text: csvText,
  })
}

export function demoImportBatchStatusLabel(
  status: DemoImportBatchSummary["status"]
) {
  return status === "imported" ? "已同步" : "需关注"
}

export function mapDemoBatchesToSyncStatus(
  batches: DemoImportBatchSummary[]
): DashboardSyncStatusRow[] {
  return batches.map((batch) => ({
    source: batch.source_name,
    batch: batch.batch_id,
    status: demoImportBatchStatusLabel(batch.status),
    syncedAt: batch.imported_at,
  }))
}
