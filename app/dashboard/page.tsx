import { AppShell } from "@/components/app-shell"
import { GlobalFilterBar } from "@/components/global-filter-bar"
import { BpoHeatmap } from "@/components/bpo-heatmap"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { ReadinessBanner } from "@/components/readiness-banner"
import { SectionCards } from "@/components/section-cards"
import {
  buildDashboardOperationalViewModel,
  parseDashboardFilters,
} from "@/lib/dashboard"
import {
  getSchedulePlansResult,
  getScheduleRisksResult,
} from "@/lib/schedule-plans"
import { getUnavailabilityResult } from "@/lib/unavailability"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = (await searchParams) || {}
  const filters = parseDashboardFilters(resolvedSearchParams)

  const [plansResult, risksResult, unavailabilityResult] = await Promise.all([
    getSchedulePlansResult(),
    getScheduleRisksResult(),
    getUnavailabilityResult(),
  ])

  const sites = Array.from(
    new Set([
      ...plansResult.items.map((p) => p.site_name),
      ...risksResult.items.map((r) => r.site_name),
      ...unavailabilityResult.items.map((u) => u.site_name),
    ])
  ).sort()

  const projects = Array.from(
    new Set([
      ...plansResult.items.map((p) => p.project_name),
      ...risksResult.items.map((r) => r.project_name),
      ...unavailabilityResult.items.map((u) => u.project_name),
    ])
  ).sort()

  const planStatusOrder = ["draft", "review_ready", "published"]
  const planStatuses = planStatusOrder.filter((status) =>
    plansResult.items.some((plan) => plan.status === status)
  )

  const viewModel = buildDashboardOperationalViewModel({
    plans: plansResult.items,
    risks: risksResult.items,
    unavailability: unavailabilityResult.items,
    plansSource: { source: plansResult.source, failed: plansResult.failed },
    risksSource: { source: risksResult.source, failed: risksResult.failed },
    unavailabilitySource: {
      source: unavailabilityResult.source,
      failed: unavailabilityResult.failed,
    },
    filters,
  })
  const bannerSource = viewModel.readiness.isFilteredEmpty
    ? "api_empty"
    : viewModel.readiness.overallSource

  return (
    <AppShell title="经营总览">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto pb-6">
        <ReadinessBanner
          message={viewModel.readiness.message}
          hasData={viewModel.readiness.hasFilteredData}
          overallSource={bannerSource}
        />
        <GlobalFilterBar
          filters={viewModel.filters}
          hasActiveFilters={viewModel.hasActiveFilters}
          sites={sites}
          projects={projects}
          planStatuses={planStatuses}
        />
        <SectionCards cards={viewModel.metricCards} />
        <section className="grid gap-4 px-4 lg:grid-cols-[1.25fr_0.75fr] lg:px-6">
          <ChartAreaInteractive />
          <BpoHeatmap
            rows={viewModel.heatmapRows}
            slots={viewModel.heatmapSlots}
          />
        </section>
        <section className="grid gap-4 px-4 lg:px-6">
          <DataTable anomalies={viewModel.anomalies} />
        </section>
      </main>
    </AppShell>
  )
}
