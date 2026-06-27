import Link from "next/link"

import { AppShell } from "@/components/app-shell"
import { BpoHeatmap } from "@/components/bpo-heatmap"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { ReadinessBanner } from "@/components/readiness-banner"
import { SectionCards } from "@/components/section-cards"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  type DashboardOperationalFilters,
  buildDashboardOperationalViewModel,
  parseDashboardFilters,
} from "@/lib/dashboard"
import {
  getSchedulePlansResult,
  getScheduleRisksResult,
} from "@/lib/schedule-plans"
import { getUnavailabilityResult } from "@/lib/unavailability"

const planStatusLabels: Record<string, string> = {
  draft: "草稿",
  review_ready: "待复核",
  published: "已发布",
}

function dashboardScopeLabels(filters: DashboardOperationalFilters): string[] {
  const labels: string[] = []

  if (filters.project) {
    labels.push(`项目：${filters.project}`)
  }
  if (filters.site) {
    labels.push(`职场：${filters.site}`)
  }
  if (filters.planStatus) {
    labels.push(`计划状态：${planStatusLabels[filters.planStatus] ?? filters.planStatus}`)
  }

  return labels
}

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
  const scopeLabels = dashboardScopeLabels(viewModel.filters)

  return (
    <AppShell title="经营总览">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto pb-6">
        <ReadinessBanner
          message={viewModel.readiness.message}
          hasData={viewModel.readiness.hasFilteredData}
          overallSource={bannerSource}
        />
        {viewModel.hasActiveFilters ? (
          <section className="mx-4 flex flex-wrap items-center gap-2 rounded-lg border bg-muted/25 px-3 py-2 text-sm lg:mx-6">
            <span className="font-medium text-foreground">当前总览范围</span>
            {scopeLabels.map((label) => (
              <Badge key={label} variant="outline">
                {label}
              </Badge>
            ))}
            <Button asChild variant="ghost" size="sm" className="ml-auto">
              <Link href="/dashboard">查看全部</Link>
            </Button>
          </section>
        ) : null}
        <SectionCards cards={viewModel.metricCards} />
        <section className="grid gap-4 px-4 lg:grid-cols-[1.25fr_0.75fr] lg:px-6">
          <ChartAreaInteractive />
          <BpoHeatmap
            rows={viewModel.heatmapRows}
            slots={viewModel.heatmapSlots}
            drilldown={viewModel.heatmapDrilldown}
          />
        </section>
        <section className="grid gap-4 px-4 lg:px-6">
          <DataTable anomalies={viewModel.anomalies} />
        </section>
      </main>
    </AppShell>
  )
}
