import { fetchImportBatches, fetchImportFieldMappingTemplates } from "@/lib/import-api"
import {
  ActualLogProductionPageActions,
  ActualLogProductionWorkbench,
} from "@/components/actual-log-production-workbench"
import { AppShell } from "@/components/app-shell"
import { uploadImportCsvAction } from "@/app/data-quality/actions"
import { ActualLogImportDialog } from "@/components/actual-log-import-dialog"
import {
  type ActualLogImportDialogLogType,
  summarizeActualLogImportDialog,
} from "@/components/actual-log-production-model"

export const dynamic = "force-dynamic"

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function ActualLogProductionPage({ searchParams }: PageProps) {
  const batchResult = await fetchImportBatches()
  const templateResult = await fetchImportFieldMappingTemplates()
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const logType = resolveActualLogImportDialogLogType(
    getSingleSearchParam(resolvedSearchParams.log_type)
  )
  const loginDialog = summarizeActualLogImportDialog({
    logType: "login",
    batches: batchResult.data ?? [],
    templates: templateResult.data ?? [],
    uploadStatus: logType === "login" ? getSingleSearchParam(resolvedSearchParams.upload) : null,
    uploadReason: logType === "login" ? getSingleSearchParam(resolvedSearchParams.reason) : null,
    uploadBatchId: logType === "login" ? getSingleSearchParam(resolvedSearchParams.batch) : null,
  })
  const statusDialog = summarizeActualLogImportDialog({
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
      title="登录/状态日志"
      breadcrumbItems={[{ label: "登录/状态日志" }]}
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
        <ActualLogImportDialog
          dialog={activeDialog}
          templateError={templateResult.error}
          action={uploadImportCsvAction}
        />
      ) : null}
    </AppShell>
  )
}

function getSingleSearchParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? ""
  }

  return value ?? ""
}

function resolveActualLogImportDialogLogType(
  value: string
): ActualLogImportDialogLogType {
  return value === "status" ? "status" : "login"
}
