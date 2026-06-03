import { AppShell } from "@/components/app-shell"
import { DemandForecastProductionDetail } from "@/components/demand-forecast-production-workbench"
import {
  type ImportBatchListRow,
  buildImportApiUrl,
} from "@/components/import-center-model"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{
    batchId: string
  }>
}

type ApiResult<T> = {
  data: T | null
  error: string | null
}

export default async function DemandForecastProductionDetailPage({
  params,
}: PageProps) {
  const { batchId } = await params
  const batchResult = await fetchImportBatches()

  return (
    <AppShell title="预测版本详情" searchPlaceholder="搜索预测版本或来源批次">
      <DemandForecastProductionDetail
        batches={batchResult.data ?? []}
        batchId={batchId}
        error={batchResult.error}
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
        error: `导入批次 API 返回 ${response.status}`,
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

function formatApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return "本地 API 暂不可用"
}
