import Link from "next/link"

import { AppShell } from "@/components/app-shell"
import { DemandPlanTable } from "@/components/demand-plan-table"
import { MetricCard } from "@/components/metric-card"
import { SearchInputBar } from "@/components/search-input-bar"
import { Button } from "@/components/ui/button"
import { getDemandPlans, type DemandPlanRow } from "@/lib/schedule-plans"

type PageProps = {
  searchParams: Promise<{
    query?: string
  }>
}

export default async function DemandPlansPage({ searchParams }: PageProps) {
  const params = await searchParams
  const query = params.query?.trim() ?? ""
  const rows = await getDemandPlans(query)
  const totalForecast = rows.reduce((sum, row) => sum + row.forecast_agents, 0)
  const peak = rows.reduce<DemandPlanRow | null>(
    (current, row) =>
      !current || row.forecast_agents > current.forecast_agents ? row : current,
    null
  )
  const siteCount = new Set(rows.map((row) => row.site_name)).size

  return (
    <AppShell
      title="需求计划"
      breadcrumbItems={[{ label: "需求计划" }]}
    >
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">
              查看预测需求，作为排班计划输入
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/schedule-plans">查看排班计划</Link>
          </Button>
        </div>

        <SearchInputBar
          defaultQuery={query}
          placeholder="搜索日期、项目、职场、时段"
        >
          {query ? (
            <Button asChild variant="ghost" size="sm">
              <Link href="/demand-plans">清空</Link>
            </Button>
          ) : null}
        </SearchInputBar>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard title="需求时段" value={`${rows.length}`} description="0.5h 颗粒度" />
          <MetricCard title="预测人次" value={`${totalForecast}`} description="当前筛选汇总" />
          <MetricCard title="覆盖职场" value={`${siteCount}`} description="需求来源" />
          <MetricCard
            title="峰值需求"
            value={peak ? `${peak.forecast_agents}` : "0"}
            description={peak ? `${peak.plan_date} ${peak.interval_start}` : "暂无数据"}
          />
        </section>

        <DemandPlanTable description={query || "全部需求"} rows={rows} />
      </main>
    </AppShell>
  )
}
