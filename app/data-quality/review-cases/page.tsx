import { AppShell } from "@/components/app-shell"
import { ImportCenterReviewCasesWorkspace } from "@/components/import-center-review-cases-workspace"
import {
  type ImportReviewCaseRecord,
  type ImportReviewCasesWorkspaceFilters,
  buildImportReviewCasesApiUrl,
} from "@/components/import-center-model"

export const dynamic = "force-dynamic"

type ReviewCasesPageProps = {
  searchParams?: Promise<{
    businessDate?: string
    ownerId?: string
    status?: string
    severity?: string
    sourceResultType?: ImportReviewCaseRecord["source_result_type"] | "all"
    query?: string
  }>
}

type ApiResult<T> = {
  data: T | null
  error: string | null
}

export default async function ReviewCasesPage({
  searchParams,
}: ReviewCasesPageProps) {
  const params = await searchParams
  const filters: ImportReviewCasesWorkspaceFilters = {
    businessDate: params?.businessDate,
    ownerId: params?.ownerId,
    status: params?.status,
    severity: params?.severity,
    sourceResultType: params?.sourceResultType,
    query: params?.query,
  }
  const result = await fetchImportReviewCases(filters)

  return (
    <AppShell title="复核案例" searchPlaceholder="搜索复核案例、owner 或来源">
      <ImportCenterReviewCasesWorkspace
        cases={result.data ?? []}
        filters={filters}
        error={result.error}
      />
    </AppShell>
  )
}

async function fetchImportReviewCases(
  filters: ImportReviewCasesWorkspaceFilters
): Promise<ApiResult<ImportReviewCaseRecord[]>> {
  try {
    const response = await fetch(buildImportReviewCasesApiUrl(filters), {
      cache: "no-store",
    })

    if (!response.ok) {
      return {
        data: [],
        error: `复核案例 API 返回 ${response.status}`,
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

  return "本地 API 暂不可用"
}
