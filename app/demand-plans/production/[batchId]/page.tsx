import { fetchImportBatches } from "@/lib/import-api"
import { formatApiError } from "@/lib/api-error"
import type { ApiResult } from "@/lib/api-result"
import { AppShell } from "@/components/app-shell"
import { DemandForecastProductionDetail } from "@/components/demand-forecast-production-workbench"
import { buildImportApiUrl } from "@/components/import-center-model"
import type { DemandForecastProductionApiDetail } from "@/components/demand-forecast-production-model"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{
    batchId: string
  }>
}

export default async function DemandForecastProductionDetailPage({
  params,
}: PageProps) {
  const { batchId } = await params
  const decodedBatchId = decodeURIComponent(batchId)
  const batchResult = await fetchImportBatches()
  const detailResult = await fetchDemandForecastProductionDetail(decodedBatchId)
  const error = [batchResult.error, detailResult.error].filter(Boolean).join("；") || null

  return (
    <AppShell
      title="预测版本详情"
      breadcrumbItems={[
        { label: "需求计划", href: "/demand-plans" },
        { label: "预测版本", href: "/demand-plans/production" },
        { label: "预测版本详情" },
      ]}
    >
      <DemandForecastProductionDetail
        batches={batchResult.data ?? []}
        batchId={decodedBatchId}
        error={error}
        apiDetail={detailResult.data}
      />
    </AppShell>
  )
}

async function fetchDemandForecastProductionDetail(
  batchId: string
): Promise<ApiResult<DemandForecastProductionApiDetail>> {
  try {
    const response = await fetch(
      buildImportApiUrl(
        `/api/v1/demand-forecast/production/${encodeURIComponent(batchId)}`
      ),
      {
        cache: "no-store",
      }
    )

    if (!response.ok) {
      return {
        data: null,
        error:
          response.status === 404
            ? null
            : `预测版本详情读取失败（状态码 ${response.status}）`,
      }
    }

    return {
      data: (await response.json()) as DemandForecastProductionApiDetail,
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: formatApiError(error),
    }
  }
}
