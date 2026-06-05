import Link from "next/link"
import { Search } from "lucide-react"

import { AppShell } from "@/components/app-shell"
import { DemandPlanTable } from "@/components/demand-plan-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
      searchPlaceholder="搜索需求、项目或职场"
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

        <section className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-3">
          <form className="flex min-w-64 flex-1 items-center gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-md border bg-background px-2">
              <Search className="size-4 text-muted-foreground" />
              <Input
                name="query"
                defaultValue={query}
                placeholder="搜索日期、项目、职场、时段"
                className="h-8 border-0 px-0 shadow-none focus-visible:ring-0"
              />
            </div>
            <Button type="submit" variant="outline" size="sm">
              搜索
            </Button>
          </form>
          {query ? (
            <Button asChild variant="ghost" size="sm">
              <Link href="/demand-plans">清空</Link>
            </Button>
          ) : null}
        </section>

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

        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>预测需求</CardTitle>
              <CardDescription>{query || "全部需求"}</CardDescription>
            </div>
            <Badge variant="outline">需求</Badge>
          </CardHeader>
          <CardContent>
            <DemandPlanTable rows={rows} />
          </CardContent>
        </Card>
      </main>
    </AppShell>
  )
}

function MetricCard({
  title,
  value,
  description,
}: {
  title: string
  value: string
  description: string
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums">
          {value}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">
        {description}
      </CardContent>
    </Card>
  )
}
