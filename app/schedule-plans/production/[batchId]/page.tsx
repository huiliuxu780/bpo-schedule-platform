import { AppShell } from "@/components/app-shell"
import { PersonnelScheduleProductionDetail } from "@/components/personnel-schedule-production-workbench"
import {
  type ImportBatchListRow,
  buildImportApiUrl,
} from "@/components/import-center-model"
import type { PersonnelScheduleProductionApiDetail } from "@/components/personnel-schedule-production-model"

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

export default async function PersonnelScheduleProductionDetailPage({
  params,
}: PageProps) {
  const { batchId } = await params
  const decodedBatchId = decodeURIComponent(batchId)
  const batchResult = await fetchImportBatches()
  const detailResult = await fetchPersonnelScheduleProductionDetail(decodedBatchId)
  const error = [batchResult.error, detailResult.error].filter(Boolean).join("；") || null

  return (
    <AppShell
      title="排班版本详情"
      searchPlaceholder="搜索排班版本或来源批次"
      breadcrumbItems={[
        { label: "排班计划", href: "/schedule-plans" },
        { label: "排班版本", href: "/schedule-plans/production" },
        { label: "排班版本详情" },
      ]}
    >
      <PersonnelScheduleProductionDetail
        batches={batchResult.data ?? []}
        batchId={decodedBatchId}
        error={error}
        apiDetail={detailResult.data}
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

async function fetchPersonnelScheduleProductionDetail(
  batchId: string
): Promise<ApiResult<PersonnelScheduleProductionApiDetail>> {
  try {
    const response = await fetch(
      buildImportApiUrl(
        `/api/v1/personnel-schedule/production/${encodeURIComponent(batchId)}`
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
            : `排班版本详情读取失败（状态码 ${response.status}）`,
      }
    }

    return {
      data: (await response.json()) as PersonnelScheduleProductionApiDetail,
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
