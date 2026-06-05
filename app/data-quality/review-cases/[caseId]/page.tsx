import { AppShell } from "@/components/app-shell"
import { ImportCenterReviewCaseDetailWorkspace } from "@/components/import-center-review-case-detail-workspace"
import {
  type ImportReviewCaseDetailResponse,
  type ImportReviewCaseProcessingStageSnapshot,
  type ImportReviewCaseRecord,
  buildImportReviewCaseDetailApiUrl,
  buildImportReviewCasesApiUrl,
} from "@/components/import-center-model"

export const dynamic = "force-dynamic"

type ReviewCaseDetailPageProps = {
  params: Promise<{
    caseId: string
  }>
  searchParams: Promise<{
    evidence?: string | string[]
    conclusion?: string | string[]
    closure?: string | string[]
  }>
}

type ApiResult<T> = {
  data: T | null
  error: string | null
}

export default async function ReviewCaseDetailPage({
  params,
  searchParams,
}: ReviewCaseDetailPageProps) {
  const routeParams = await params
  const routeSearchParams = await searchParams
  const caseId = routeParams.caseId
  const result = await fetchImportReviewCaseDetail(caseId)
  const ownerCasesResult = await fetchSameOwnerReviewCases(result.data?.case ?? null)
  const ownerProcessingStages = await fetchReviewCaseProcessingStages(
    ownerCasesResult.data ?? [],
    result.data
  )

  return (
    <AppShell
      title="复核案例详情"
      breadcrumbItems={[
        { label: "导入批次", href: "/data-quality" },
        { label: "复核案例", href: "/data-quality/review-cases" },
        { label: "复核案例详情" },
      ]}
    >
      <ImportCenterReviewCaseDetailWorkspace
        caseId={caseId}
        detail={result.data}
        error={result.error}
        ownerCases={ownerCasesResult.data ?? []}
        ownerProcessingStages={ownerProcessingStages}
        ownerContextError={ownerCasesResult.error}
        actionFeedback={{
          evidence: getFirstSearchParam(routeSearchParams.evidence),
          conclusion: getFirstSearchParam(routeSearchParams.conclusion),
          closure: getFirstSearchParam(routeSearchParams.closure),
        }}
      />
    </AppShell>
  )
}

function getFirstSearchParam(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value ?? null
}

async function fetchSameOwnerReviewCases(
  currentCase: ImportReviewCaseRecord | null
): Promise<ApiResult<ImportReviewCaseRecord[]>> {
  if (!currentCase) {
    return {
      data: [],
      error: null,
    }
  }

  try {
    const response = await fetch(
      buildImportReviewCasesApiUrl({
        businessDate: currentCase.business_date,
        ownerId: currentCase.owner_id,
        status: "all",
      }),
      { cache: "no-store" }
    )

    if (!response.ok) {
      return {
        data: [],
        error: `同 Owner 复核案例读取失败（状态码 ${response.status}）`,
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

async function fetchReviewCaseProcessingStages(
  cases: ImportReviewCaseRecord[],
  currentDetail: ImportReviewCaseDetailResponse | null
): Promise<Record<string, ImportReviewCaseProcessingStageSnapshot | undefined>> {
  const entries = await Promise.all(
    cases.map(async (reviewCase) => {
      if (currentDetail && reviewCase.case_id === currentDetail.case.case_id) {
        return [
          reviewCase.case_id,
          {
            evidenceCount: currentDetail.evidence.length,
            conclusionCount: currentDetail.conclusions.length,
            isClosed:
              currentDetail.case.status === "closed" || currentDetail.closure !== null,
          },
        ] as const
      }

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

async function fetchImportReviewCaseDetail(
  caseId: string
): Promise<ApiResult<ImportReviewCaseDetailResponse>> {
  try {
    const response = await fetch(buildImportReviewCaseDetailApiUrl(caseId), {
      cache: "no-store",
    })

    if (!response.ok) {
      return {
        data: null,
        error: `复核案例读取失败（状态码 ${response.status}）`,
      }
    }

    return {
      data: (await response.json()) as ImportReviewCaseDetailResponse,
      error: null,
    }
  } catch (error) {
    return {
      data: null,
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
