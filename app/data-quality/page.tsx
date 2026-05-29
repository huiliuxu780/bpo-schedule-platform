import { AppShell } from "@/components/app-shell"
import { ImportCenterApiPanel } from "@/components/import-center-api-panel"
import { ImportCenterRowCorrectionPanel } from "@/components/import-center-row-correction-panel"
import { ImportCenterUploadForm } from "@/components/import-center-upload-form"
import {
  type ImportApplyReadinessResponse,
  type ImportBatchPersistenceDetail,
  type ImportBatchListRow,
  buildImportApiUrl,
  buildImportBatchDetailUrl,
} from "@/components/import-center-model"

export const dynamic = "force-dynamic"

type DataQualityPageProps = {
  searchParams?: Promise<{
    batch?: string
    upload?: string
    correction?: string
    reason?: string
    row?: string
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
  const selectedBatchId =
    params?.batch && batches.some((batch) => batch.batch_id === params.batch)
      ? params.batch
      : batches[0]?.batch_id ?? null
  const readinessResult = selectedBatchId
    ? await fetchImportReadiness(selectedBatchId)
    : { data: null, error: null }
  const detailResult = selectedBatchId
    ? await fetchImportBatchDetail(selectedBatchId)
    : { data: null, error: null }

  return (
    <AppShell title="数据质量" searchPlaceholder="搜索导入批次、文件或上传人">
      <ImportCenterApiPanel
        batches={batches}
        selectedBatchId={selectedBatchId}
        readiness={readinessResult.data}
        batchError={batchResult.error}
        readinessError={readinessResult.error}
        uploadForm={
          <ImportCenterUploadForm
            uploadStatus={params?.upload}
            uploadReason={params?.reason}
          />
        }
        rowCorrectionPanel={
          <ImportCenterRowCorrectionPanel
            detail={detailResult.data}
            detailError={detailResult.error}
            correctionStatus={params?.correction}
            correctionReason={params?.reason}
            correctionRow={params?.row}
          />
        }
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
        error: `准备度 API 返回 ${response.status}`,
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
        error: `批次明细 API 返回 ${response.status}`,
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

  return "本地 API 暂不可用"
}
