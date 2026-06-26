import { AppShell } from "@/components/app-shell"
import { BpoHeatmap } from "@/components/bpo-heatmap"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { ReadinessBanner } from "@/components/readiness-banner"
import { SectionCards } from "@/components/section-cards"
import { Button } from "@/components/ui/button"
import { buildDashboardOperationalViewModel } from "@/lib/dashboard"
import {
  getSchedulePlansResult,
  getScheduleRisksResult,
} from "@/lib/schedule-plans"
import { getUnavailabilityResult } from "@/lib/unavailability"

function GlobalFilterBar() {
  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-3 lg:px-6">
      <Button variant="outline" size="sm">
        日期范围：2026-05-01 至 2026-05-31
      </Button>
      <Button variant="outline" size="sm">
        供应商：全部
      </Button>
      <Button variant="outline" size="sm">
        团队：全部团队
      </Button>
      <Button variant="outline" size="sm">
        数据版本：生效版本
      </Button>
    </div>
  )
}

export default async function DashboardPage() {
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
  })

  return (
    <AppShell title="经营总览">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto pb-6">
        <ReadinessBanner
          message={viewModel.readiness.message}
          hasData={viewModel.readiness.hasData}
          overallSource={viewModel.readiness.overallSource}
        />
        <GlobalFilterBar />
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
