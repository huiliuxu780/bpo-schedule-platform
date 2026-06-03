import { AppShell } from "@/components/app-shell"
import { ImportCenterVersionWorkbench } from "@/components/import-center-version-workbench"
import {
  type ImportBatchListRow,
  type ImportVersionWorkbenchFilters,
  buildImportApiUrl,
} from "@/components/import-center-model"

export const dynamic = "force-dynamic"

type VersionWorkbenchPageProps = {
  searchParams?: Promise<{
    businessDate?: string
    domain?: ImportVersionWorkbenchFilters["domain"]
    status?: ImportVersionWorkbenchFilters["status"]
  }>
}

type ApiResult<T> = {
  data: T | null
  error: string | null
}

export default async function VersionWorkbenchPage({
  searchParams,
}: VersionWorkbenchPageProps) {
  const params = await searchParams
  const filters: ImportVersionWorkbenchFilters = {
    businessDate: params?.businessDate,
    domain: params?.domain,
    status: params?.status,
  }
  const batchResult = await fetchImportBatches()

  return (
    <AppShell title="业务版本工作台" searchPlaceholder="搜索版本、批次或业务日">
      <ImportCenterVersionWorkbench
        batches={batchResult.data ?? []}
        filters={filters}
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
