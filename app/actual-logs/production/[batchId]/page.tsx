import { AppShell } from "@/components/app-shell"
import { ActualLogProcessingDetail } from "@/components/actual-log-production-workbench"
import {
  type ImportBatchListRow,
  type ImportBatchPersistenceDetail,
  buildImportApiUrl,
  buildImportBatchDetailUrl,
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

function formatApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return "读取失败"
}
