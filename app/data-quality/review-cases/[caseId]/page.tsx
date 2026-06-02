import { AppShell } from "@/components/app-shell"
import { ImportCenterReviewCaseDetailWorkspace } from "@/components/import-center-review-case-detail-workspace"
import {
  type ImportReviewCaseDetailResponse,
  buildImportReviewCaseDetailApiUrl,
} from "@/components/import-center-model"

export const dynamic = "force-dynamic"

type ReviewCaseDetailPageProps = {
  params: Promise<{
    caseId: string
  }>
}

type ApiResult<T> = {
  data: T | null
  error: string | null
}

export default async function ReviewCaseDetailPage({
  params,
}: ReviewCaseDetailPageProps) {
  const routeParams = await params
  const caseId = routeParams.caseId
  const result = await fetchImportReviewCaseDetail(caseId)

  return (
    <AppShell title="复核案例详情" searchPlaceholder="搜索复核案例、owner 或来源">
      <ImportCenterReviewCaseDetailWorkspace
        caseId={caseId}
        detail={result.data}
        error={result.error}
      />
    </AppShell>
  )
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
        error: `复核案例 API 返回 ${response.status}`,
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

  return "本地 API 暂不可用"
}
