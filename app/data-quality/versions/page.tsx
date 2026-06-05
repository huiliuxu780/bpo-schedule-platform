import { AppShell } from "@/components/app-shell"
import { ImportCenterVersionWorkbench } from "@/components/import-center-version-workbench"
import {
  type ImportBatchListRow,
  type ImportComparisonRunRecord,
  type ImportReviewCaseRecord,
  type ImportVersionWorkbenchFilters,
  buildImportApiUrl,
  buildImportComparisonRunsUrl,
  buildImportReviewCasesUrl,
} from "@/components/import-center-model"

export const dynamic = "force-dynamic"

type VersionWorkbenchPageProps = {
  searchParams?: Promise<{
    businessDate?: string
    domain?: ImportVersionWorkbenchFilters["domain"]
    status?: ImportVersionWorkbenchFilters["status"]
    compare?: string
    compareRun?: string
    compareReason?: string
  }>
}

type ApiResult<T> = {
  data: T | null
  error: string | null
}

export default async function VersionWorkbenchPage({
  searchParams,
}: VersionWorkbenchPageProps) {
  const params = await searchParams
  const filters: ImportVersionWorkbenchFilters = {
    businessDate: params?.businessDate,
    domain: params?.domain,
    status: params?.status,
  }
  const batchResult = await fetchImportBatches()
  const comparisonRunsResult = await fetchImportComparisonRuns(
    batchResult.data ?? [],
    filters.businessDate ?? null
  )
  const reviewCasesResult = await fetchImportReviewCases(
    batchResult.data ?? [],
    filters.businessDate ?? null
  )

  return (
    <AppShell
      title="业务版本列表"
      searchPlaceholder="搜索版本、批次或业务日"
      breadcrumbItems={[
        { label: "导入批次", href: "/data-quality" },
        { label: "业务版本列表" },
      ]}
    >
      <ImportCenterVersionWorkbench
        batches={batchResult.data ?? []}
        comparisonRuns={comparisonRunsResult.data ?? []}
        reviewCases={reviewCasesResult.data ?? []}
        filters={filters}
        error={batchResult.error ?? comparisonRunsResult.error ?? reviewCasesResult.error}
        comparisonStatus={params?.compare}
        comparisonRunId={params?.compareRun}
        comparisonReason={params?.compareReason}
      />
    </AppShell>
  )
}

async function fetchImportBatches(): Promise<ApiResult<ImportBatchListRow[]>> {
  try {
    const response = await fetch(buildImportApiUrl("/api/v1/import-batches"), {
      cache: "no-store",
    })

    if (!response.ok) {
      return {
        data: [],
        error: `导入批次读取失败（状态码 ${response.status}）`,
      }
    }

    const payload = (await response.json()) as { items?: ImportBatchListRow[] }

    return {
      data: Array.isArray(payload.items) ? payload.items : [],
      error: null,
    }
  } catch (error) {
    return {
      data: [],
      error: formatApiError(error),
    }
  }
}

async function fetchImportComparisonRuns(
  batches: ImportBatchListRow[],
  businessDate: string | null
): Promise<ApiResult<ImportComparisonRunRecord[]>> {
  const targetDates = collectVersionWorkbenchBusinessDates(batches, businessDate)

  if (targetDates.length === 0) {
    return { data: [], error: null }
  }

  const results = await Promise.all(
    targetDates.map(async (date) => {
      try {
        const response = await fetch(buildImportComparisonRunsUrl(date), {
          cache: "no-store",
        })

        if (!response.ok) {
          return {
            items: [] as ImportComparisonRunRecord[],
            error: `对比运行读取失败（状态码 ${response.status}）`,
          }
        }

        const payload = (await response.json()) as {
          items?: ImportComparisonRunRecord[]
        }

        return {
          items: Array.isArray(payload.items) ? payload.items : [],
          error: null,
        }
      } catch (error) {
        return {
          items: [] as ImportComparisonRunRecord[],
          error: formatApiError(error),
        }
      }
    })
  )

  return {
    data: results.flatMap((result) => result.items),
    error: results.find((result) => result.error)?.error ?? null,
  }
}

async function fetchImportReviewCases(
  batches: ImportBatchListRow[],
  businessDate: string | null
): Promise<ApiResult<ImportReviewCaseRecord[]>> {
  const targetDates = collectVersionWorkbenchBusinessDates(batches, businessDate)

  if (targetDates.length === 0) {
    return { data: [], error: null }
  }

  const results = await Promise.all(
    targetDates.map(async (date) => {
      try {
        const response = await fetch(buildImportReviewCasesUrl(date), {
          cache: "no-store",
        })

        if (!response.ok) {
          return {
            items: [] as ImportReviewCaseRecord[],
            error: `复核案例读取失败（状态码 ${response.status}）`,
          }
        }

        const payload = (await response.json()) as {
          items?: ImportReviewCaseRecord[]
        }

        return {
          items: Array.isArray(payload.items) ? payload.items : [],
          error: null,
        }
      } catch (error) {
        return {
          items: [] as ImportReviewCaseRecord[],
          error: formatApiError(error),
        }
      }
    })
  )

  return {
    data: results.flatMap((result) => result.items),
    error: results.find((result) => result.error)?.error ?? null,
  }
}

function collectVersionWorkbenchBusinessDates(
  batches: ImportBatchListRow[],
  businessDate: string | null
): string[] {
  if (businessDate) {
    return [businessDate]
  }

  return Array.from(
    new Set(
      batches
        .filter(
          (batch) => batch.application_status === "applied" && batch.business_date_from
        )
        .map((batch) => batch.business_date_from)
    )
  )
}

function formatApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return "读取失败"
}
