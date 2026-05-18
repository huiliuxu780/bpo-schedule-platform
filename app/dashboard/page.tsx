import { DashboardClient } from "@/components/dashboard-client"
import type { DashboardFilterState } from "@/components/data-table-model"

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : {}
  const filters: DashboardFilterState = {
    date: firstParam(params.date) ?? "2026-05-11",
    site: firstParam(params.site) ?? "all",
    vendor: firstParam(params.vendor) ?? "all",
    dataVersion: "effective",
  }

  return (
    <DashboardClient
      filters={filters}
    />
  )
}
