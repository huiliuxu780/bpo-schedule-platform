import { AppShell } from "@/components/app-shell"
import { ImportCenterComparisonRunDetailWorkspace } from "@/components/import-center-comparison-run-detail-workspace"
import {
  type ImportComparisonRunDetailResponse,
  buildImportComparisonRunDetailApiUrl,
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

  return (
    <AppShell title="对比运行详情" searchPlaceholder="搜索运行、版本或结果">
      <ImportCenterComparisonRunDetailWorkspace
        runId={runId}
        detail={result.data}
        error={result.error}
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
        error: `对比运行 API 返回 ${response.status}`,
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

function formatApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return "本地 API 暂不可用"
}
