import { AppShell } from "@/components/app-shell"
import { PersonnelScheduleProductionWorkbench } from "@/components/personnel-schedule-production-workbench"
import {
  type ImportBatchListRow,
  buildImportApiUrl,
} from "@/components/import-center-model"

export const dynamic = "force-dynamic"

type ApiResult<T> = {
  data: T | null
  error: string | null
}

export default async function PersonnelScheduleProductionPage() {
  const batchResult = await fetchImportBatches()

  return (
    <AppShell title="排班版本" searchPlaceholder="搜索排班版本或来源批次">
      <PersonnelScheduleProductionWorkbench
        batches={batchResult.data ?? []}
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

function formatApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return "读取失败"
}
