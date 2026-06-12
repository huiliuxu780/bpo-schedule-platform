import { fetchImportBatches } from "@/lib/import-api"
import { formatApiError } from "@/lib/api-error"
import type { ApiResult } from "@/lib/api-result"
import { AppShell } from "@/components/app-shell"
import { ActualLogProcessingDetail } from "@/components/actual-log-production-workbench"
import {
  type ImportBatchPersistenceDetail,
  buildImportBatchDetailUrl,
} from "@/components/import-center-model"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{
    batchId: string
  }>
}

export default async function ActualLogProcessingDetailPage({ params }: PageProps) {
  const { batchId } = await params
  const decodedBatchId = decodeURIComponent(batchId)
  const [batchResult, detailResult] = await Promise.all([
    fetchImportBatches(),
    fetchImportBatchDetail(decodedBatchId),
  ])

  return (
    <AppShell
      title="日志处理解释"
      breadcrumbItems={[
        { label: "登录/状态日志", href: "/actual-logs/production" },
        { label: "日志处理解释" },
      ]}
    >
      <ActualLogProcessingDetail
        batches={batchResult.data ?? []}
        batchId={decodedBatchId}
        detail={detailResult.data}
        error={batchResult.error ?? detailResult.error}
      />
    </AppShell>
  )
}

async function fetchImportBatchDetail(
  batchId: string
): Promise<ApiResult<ImportBatchPersistenceDetail>> {
  try {
    const response = await fetch(buildImportBatchDetailUrl(batchId), {
      cache: "no-store",
    })

    if (!response.ok) {
      return {
        data: null,
        error: `批次明细读取失败（状态码 ${response.status}）`,
      }
    }

    return {
      data: (await response.json()) as ImportBatchPersistenceDetail,
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: formatApiError(error),
    }
  }
}
