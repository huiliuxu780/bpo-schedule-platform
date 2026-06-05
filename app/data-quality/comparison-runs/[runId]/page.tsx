import { AppShell } from "@/components/app-shell"
import { ImportCenterComparisonRunDetailWorkspace } from "@/components/import-center-comparison-run-detail-workspace"
import {
  type ImportBatchListRow,
  type ImportComparisonRunDetailResponse,
  type ImportReviewCaseRecord,
  buildImportApiUrl,
  buildImportComparisonRunDetailApiUrl,
  buildImportReviewCasesUrl,
} from "@/components/import-center-model"

export const dynamic = "force-dynamic"

type ComparisonRunDetailPageProps = {
  params: Promise<{
    runId: string
  }>
}

type ApiResult<T> = {
  data: T | null
  error: string | null
}

export default async function ComparisonRunDetailPage({
  params,
}: ComparisonRunDetailPageProps) {
  const routeParams = await params
  const runId = routeParams.runId
  const result = await fetchImportComparisonRunDetail(runId)
  const reviewCasesResult = result.data
    ? await fetchImportReviewCases(result.data.run.business_date_from)
    : { data: [], error: result.error }
  const batchResult = result.data
    ? await fetchImportBatches()
    : { data: [], error: result.error }

  return (
    <AppShell title="对比运行详情" searchPlaceholder="搜索运行、版本或结果">
      <ImportCenterComparisonRunDetailWorkspace
        runId={runId}
        detail={result.data}
        error={result.error}
        reviewCases={reviewCasesResult.data ?? []}
        reviewError={reviewCasesResult.error}
        batches={batchResult.data ?? []}
        batchError={batchResult.error}
      />
    </AppShell>
  )
}

async function fetchImportComparisonRunDetail(
  runId: string
): Promise<ApiResult<ImportComparisonRunDetailResponse>> {
  try {
    const response = await fetch(buildImportComparisonRunDetailApiUrl(runId), {
      cache: "no-store",
    })

    if (!response.ok) {
      return {
        data: null,
        error: `对比运行读取失败（状态码 ${response.status}）`,
      }
    }

    return {
      data: (await response.json()) as ImportComparisonRunDetailResponse,
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: formatApiError(error),
    }
  }
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

async function fetchImportReviewCases(
  businessDate: string
): Promise<ApiResult<ImportReviewCaseRecord[]>> {
  try {
    const response = await fetch(buildImportReviewCasesUrl(businessDate), {
      cache: "no-store",
    })

    if (!response.ok) {
      return {
        data: [],
        error: `复核案例读取失败（状态码 ${response.status}）`,
      }
    }

    const payload = (await response.json()) as { items?: ImportReviewCaseRecord[] }

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

function formatApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return "读取失败"
}
