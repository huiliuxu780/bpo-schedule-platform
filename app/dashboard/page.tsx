import { DashboardClient } from "@/components/dashboard-client"
import type { DashboardFilterState } from "@/components/data-table-model"
import {
  getDemoImportBatches,
  mapDemoBatchesToSyncStatus,
} from "@/lib/demo-imports"

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function parseDataVersion(value: string | undefined) {
  return value === "effective" ? "effective" : "imported"
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : {}
  const importedBatches = await getDemoImportBatches()
  const importedRows = mapDemoBatchesToSyncStatus(importedBatches)
  const filters: DashboardFilterState = {
    date: firstParam(params.date) ?? "2026-05-11",
    site: firstParam(params.site) ?? "all",
    vendor: firstParam(params.vendor) ?? "all",
    dataVersion: parseDataVersion(firstParam(params.dataVersion)),
  }

  return (
    <DashboardClient
      filters={filters}
      importBatches={importedBatches}
      syncStatusRows={importedRows}
    />
  )
}
