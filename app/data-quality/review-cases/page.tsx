import { AppShell } from "@/components/app-shell"
import { ImportCenterReviewCasesWorkspace } from "@/components/import-center-review-cases-workspace"
import {
  type ImportReviewCaseDetailResponse,
  type ImportReviewCaseProcessingStageSnapshot,
  type ImportReviewCaseRecord,
  type ImportReviewCasesWorkspaceFilters,
  buildImportReviewCaseDetailApiUrl,
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
    processingStage?: ImportReviewCasesWorkspaceFilters["processingStage"]
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
    processingStage: params?.processingStage,
    query: params?.query,
  }
  const result = await fetchImportReviewCases(filters)
  const processingStages = await fetchReviewCaseProcessingStages(result.data ?? [])

  return (
    <AppShell title="复核案例" searchPlaceholder="搜索复核案例、owner 或来源">
      <ImportCenterReviewCasesWorkspace
        cases={result.data ?? []}
        filters={filters}
        processingStages={processingStages}
        error={result.error}
      />
    </AppShell>
  )
}

async function fetchReviewCaseProcessingStages(
  cases: ImportReviewCaseRecord[]
): Promise<Record<string, ImportReviewCaseProcessingStageSnapshot | undefined>> {
  const entries = await Promise.all(
    cases.map(async (reviewCase) => {
      try {
        const response = await fetch(
          buildImportReviewCaseDetailApiUrl(reviewCase.case_id),
          { cache: "no-store" }
        )

        if (!response.ok) {
          return [reviewCase.case_id, undefined] as const
        }

        const detail = (await response.json()) as ImportReviewCaseDetailResponse

        return [
          reviewCase.case_id,
          {
            evidenceCount: detail.evidence.length,
            conclusionCount: detail.conclusions.length,
            isClosed: detail.case.status === "closed" || detail.closure !== null,
          },
        ] as const
      } catch {
        return [reviewCase.case_id, undefined] as const
      }
    })
  )

  return Object.fromEntries(entries)
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
        error: `复核案例 服务返回 ${response.status}`,
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
