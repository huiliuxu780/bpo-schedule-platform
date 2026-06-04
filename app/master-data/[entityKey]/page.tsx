import { notFound } from "next/navigation"

import { AppShell } from "@/components/app-shell"
import {
  MasterDataMaintenanceEntityDetail,
} from "@/components/master-data-maintenance-workbench"
import {
  type MasterDataMaintenanceEntityKey,
  getMasterDataMaintenanceEntity,
  summarizeMasterDataAgentMaintenanceFeedback,
  summarizeMasterDataMaintenanceEntityDetail,
} from "@/components/master-data-maintenance-model"
import {
  type ImportBatchListRow,
  buildImportApiUrl,
} from "@/components/import-center-model"
import { submitMasterDataAgentMaintenance } from "./actions"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{
    entityKey: string
  }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

type ApiResult<T> = {
  data: T | null
  error: string | null
}

export default async function MasterDataEntityDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { entityKey } = await params
  const entity = getMasterDataMaintenanceEntity(decodeURIComponent(entityKey))

  if (!entity) {
    notFound()
  }

  const batchResult = await fetchImportBatches()
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const summary = summarizeMasterDataMaintenanceEntityDetail(
    entity.key as MasterDataMaintenanceEntityKey,
    batchResult.data ?? []
  )
  const feedback = summarizeMasterDataAgentMaintenanceFeedback(resolvedSearchParams)

  return (
    <AppShell
      title={`${entity.label}详情`}
      searchPlaceholder="搜索主数据对象或来源批次"
    >
      <MasterDataMaintenanceEntityDetail
        summary={summary}
        error={batchResult.error}
        feedback={feedback}
        agentSubmitAction={
          entity.key === "agents" ? submitMasterDataAgentMaintenance : undefined
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

function formatApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return "本地 API 暂不可用"
}
