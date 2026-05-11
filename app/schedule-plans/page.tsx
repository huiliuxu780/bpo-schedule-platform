import { AppShell } from "@/components/app-shell"
import { SchedulePlanTable } from "@/components/schedule-plan-table"
import {
  formatCoverageRate,
  getSchedulePlans,
} from "@/lib/schedule-plans"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function SchedulePlansPage() {
  const plans = await getSchedulePlans()
  const totalForecast = plans.reduce((sum, plan) => sum + plan.forecast_agents, 0)
  const totalScheduled = plans.reduce(
    (sum, plan) => sum + plan.scheduled_agents,
    0
  )
  const totalGap = plans.reduce((sum, plan) => sum + plan.gap_agents, 0)
  const coverageRate = totalForecast === 0 ? 1 : totalScheduled / totalForecast

  return (
    <AppShell title="排班计划" searchPlaceholder="搜索计划、项目或职场">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <section className="grid gap-4 md:grid-cols-4">
          <SummaryCard title="计划数量" value={`${plans.length}`} description="本地只读纵切" />
          <SummaryCard title="预测人次" value={`${totalForecast}`} description="0.5h 时段汇总" />
          <SummaryCard title="已排人次" value={`${totalScheduled}`} description="种子数据回传" />
          <SummaryCard
            title="整体覆盖率"
            value={formatCoverageRate(coverageRate)}
            description={`缺口 ${totalGap} 人次`}
          />
        </section>
        <SchedulePlanTable plans={plans} />
      </main>
    </AppShell>
  )
}

function SummaryCard({
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
