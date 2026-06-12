import { AppShell } from "@/components/app-shell"
import { BpoHeatmap } from "@/components/bpo-heatmap"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { Button } from "@/components/ui/button"

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

export default function DashboardPage() {
  return (
    <AppShell title="经营总览">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto pb-6">
        <GlobalFilterBar />
        <SectionCards />
        <section className="grid gap-4 px-4 lg:grid-cols-[1.25fr_0.75fr] lg:px-6">
          <ChartAreaInteractive />
          <BpoHeatmap />
        </section>
        <section className="grid gap-4 px-4 lg:px-6">
          <DataTable />
        </section>
      </main>
    </AppShell>
  )
}
