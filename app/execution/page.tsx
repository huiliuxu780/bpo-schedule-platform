import {
  ActualLogProductionPageActions,
  ActualLogProductionWorkbench,
} from "@/components/actual-log-production-workbench"
import { AppShell } from "@/components/app-shell"
import { uploadImportCsvAction } from "@/app/data-quality/actions"
import { ImportTaskDialog } from "@/components/import-task-dialog"
import {
  type ImportFieldMappingTemplate,
  type ImportBatchListRow,
  buildImportApiUrl,
  buildImportFieldMappingTemplatesUrl,
} from "@/components/import-center-model"
import { summarizeImportTaskDialog } from "@/lib/import-task-model"

export const dynamic = "force-dynamic"

type ApiResult<T> = {
  data: T | null
  error: string | null
}

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function ExecutionPage({ searchParams }: PageProps) {
  const batchResult = await fetchImportBatches()
  const templateResult = await fetchImportFieldMappingTemplates()
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const logType = resolveImportTaskLogType(
    getSingleSearchParam(resolvedSearchParams.log_type)
  )
  const loginDialog = summarizeImportTaskDialog({
    variant: "actual-log",
    routePrefix: "/execution",
    logType: "login",
    batches: batchResult.data ?? [],
    templates: templateResult.data ?? [],
    uploadStatus: logType === "login" ? getSingleSearchParam(resolvedSearchParams.upload) : null,
    uploadReason: logType === "login" ? getSingleSearchParam(resolvedSearchParams.reason) : null,
    uploadBatchId: logType === "login" ? getSingleSearchParam(resolvedSearchParams.batch) : null,
  })
  const statusDialog = summarizeImportTaskDialog({
    variant: "actual-log",
    routePrefix: "/execution",
    logType: "status",
    batches: batchResult.data ?? [],
    templates: templateResult.data ?? [],
    uploadStatus: logType === "status" ? getSingleSearchParam(resolvedSearchParams.upload) : null,
    uploadReason: logType === "status" ? getSingleSearchParam(resolvedSearchParams.reason) : null,
    uploadBatchId: logType === "status" ? getSingleSearchParam(resolvedSearchParams.batch) : null,
  })
  const activeDialog = logType === "status" ? statusDialog : loginDialog
  const importDialogOpen =
    getSingleSearchParam(resolvedSearchParams.import_dialog) === "1" ||
    Boolean(getSingleSearchParam(resolvedSearchParams.upload))

  return (
    <AppShell
      title="实际执行"
      breadcrumbItems={[{ label: "实际执行" }]}
      actions={
        <ActualLogProductionPageActions
          loginDialog={loginDialog}
          statusDialog={statusDialog}
        />
      }
    >
      <ActualLogProductionWorkbench
        batches={batchResult.data ?? []}
        error={batchResult.error}
      />
      {importDialogOpen ? (
        <ImportTaskDialog
          dialog={activeDialog}
          templateError={templateResult.error}
          action={uploadImportCsvAction}
        />
      ) : null}
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

async function fetchImportFieldMappingTemplates(): Promise<
  ApiResult<ImportFieldMappingTemplate[]>
> {
  try {
    const response = await fetch(buildImportFieldMappingTemplatesUrl(), {
      cache: "no-store",
    })

    if (!response.ok) {
      return {
        data: [],
        error: `字段映射模板读取失败（状态码 ${response.status}）`,
      }
    }

    const payload = (await response.json()) as {
      items?: ImportFieldMappingTemplate[]
    }

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

function getSingleSearchParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? ""
  }

  return value ?? ""
}

function resolveImportTaskLogType(
  value: string
): "login" | "status" {
  return value === "status" ? "status" : "login"
}
