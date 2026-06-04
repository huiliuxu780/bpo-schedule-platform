import { AppShell } from "@/components/app-shell"
import { ImportCenterApiPanel } from "@/components/import-center-api-panel"
import {
  type ImportApplyReadinessResponse,
  type ImportBatchListRow,
  type ImportBatchFilters,
  buildImportApiUrl,
  filterImportBatches,
} from "@/components/import-center-model"

export const dynamic = "force-dynamic"

type DataQualityPageProps = {
  searchParams?: Promise<{
    batch?: string
    batchQuery?: string
    batchFileType?: string
    batchProcessingStatus?: string
    batchApplicationStatus?: string
  }>
}

type ApiResult<T> = {
  data: T | null
  error: string | null
}

export default async function DataQualityPage({
  searchParams,
}: DataQualityPageProps) {
  const params = await searchParams
  const batchResult = await fetchImportBatches()
  const batches = batchResult.data ?? []
  const batchFilters: ImportBatchFilters = {
    query: params?.batchQuery,
    fileType: params?.batchFileType,
    processingStatus: params?.batchProcessingStatus,
    applicationStatus: params?.batchApplicationStatus,
  } as ImportBatchFilters
  const filteredBatches = filterImportBatches(batches, batchFilters)
  const selectedBatchId =
    params?.batch && batches.some((batch) => batch.batch_id === params.batch)
      ? params.batch
      : filteredBatches[0]?.batch_id ?? null
  const readinessResult = selectedBatchId
    ? await fetchImportReadiness(selectedBatchId)
    : { data: null, error: null }

  return (
    <AppShell title="数据质量" searchPlaceholder="搜索导入批次、文件或上传人">
      <ImportCenterApiPanel
        batches={batches}
        selectedBatchId={selectedBatchId}
        readiness={readinessResult.data}
        batchError={batchResult.error}
        readinessError={readinessResult.error}
        batchFilters={batchFilters}
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
        error: `导入批次 服务返回 ${response.status}`,
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

async function fetchImportReadiness(
  batchId: string
): Promise<ApiResult<ImportApplyReadinessResponse>> {
  try {
    const response = await fetch(
      buildImportApiUrl(
        `/api/v1/import-batches/${encodeURIComponent(batchId)}/apply-readiness`
      ),
      {
        cache: "no-store",
      }
    )

    if (!response.ok) {
      return {
        data: null,
        error: `准备度 服务返回 ${response.status}`,
      }
    }

    return {
      data: (await response.json()) as ImportApplyReadinessResponse,
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
