import { formatApiError } from "@/lib/api-error"
import type { ApiResult } from "@/lib/api-result"
import { AppShell } from "@/components/app-shell"
import { uploadImportCsvAction } from "@/app/data-quality/actions"
import { PersonnelScheduleImportDialog } from "@/components/personnel-schedule-import-dialog"
import {
  PersonnelScheduleProductionPageActions,
  PersonnelScheduleProductionWorkbench,
} from "@/components/personnel-schedule-production-workbench"
import {
  type ImportFieldMappingTemplate,
  type ImportBatchListRow,
  buildImportApiUrl,
  buildImportFieldMappingTemplatesUrl,
} from "@/components/import-center-model"
import { summarizePersonnelScheduleImportDialog } from "@/components/personnel-schedule-production-model"

export const dynamic = "force-dynamic"

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function PersonnelScheduleProductionPage({ searchParams }: PageProps) {
  const batchResult = await fetchImportBatches()
  const templateResult = await fetchImportFieldMappingTemplates()
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const importDialog = summarizePersonnelScheduleImportDialog({
    batches: batchResult.data ?? [],
    templates: templateResult.data ?? [],
    uploadStatus: getSingleSearchParam(resolvedSearchParams.upload),
    uploadReason: getSingleSearchParam(resolvedSearchParams.reason),
    uploadBatchId: getSingleSearchParam(resolvedSearchParams.batch),
  })
  const importDialogOpen =
    getSingleSearchParam(resolvedSearchParams.import_dialog) === "1" ||
    Boolean(getSingleSearchParam(resolvedSearchParams.upload))

  return (
    <AppShell
      title="排班版本"
      breadcrumbItems={[
        { label: "排班计划", href: "/schedule-plans" },
        { label: "排班版本" },
      ]}
      actions={<PersonnelScheduleProductionPageActions dialog={importDialog} />}
    >
      <PersonnelScheduleProductionWorkbench
        batches={batchResult.data ?? []}
        error={batchResult.error}
      />
      {importDialogOpen ? (
        <PersonnelScheduleImportDialog
          dialog={importDialog}
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

function getSingleSearchParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? ""
  }

  return value ?? ""
}
