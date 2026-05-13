import Link from "next/link"
import { notFound } from "next/navigation"

import { AppShell } from "@/components/app-shell"
import { SchedulePlanIntervalTable } from "@/components/schedule-plan-interval-table"
import {
  buildReviewScopeLabel,
  buildScheduleRisksHref,
  buildShiftDetailsHref,
  buildUnavailabilityHref,
} from "@/lib/review-navigation"
import {
  formatCoverageRate,
  getSchedulePlan,
  getScheduleRisks,
  schedulePlanStatusLabel,
} from "@/lib/schedule-plans"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getUnavailability } from "@/lib/unavailability"

type PageProps = {
  params: Promise<{
    planId: string
  }>
}

export default async function SchedulePlanDetailPage({ params }: PageProps) {
  const { planId } = await params
  const plan = await getSchedulePlan(planId)

  if (!plan) {
    notFound()
  }

  const [risks, activeUnavailability] = await Promise.all([
    getScheduleRisks(plan.summary.id),
    getUnavailability({ query: plan.summary.site_name, status: "active" }),
  ])
  const gapIntervals = plan.intervals.filter((item) => item.gap_agents > 0)
  const relatedRisks = risks.filter(
    (risk) =>
      risk.plan_id === plan.summary.id &&
      risk.plan_date === plan.summary.plan_date
  )
  const relatedUnavailability = activeUnavailability.filter(
    (row) =>
      row.project_name === plan.summary.project_name &&
      row.site_name === plan.summary.site_name &&
      row.unavailable_date === plan.summary.plan_date
  )
  const shiftHref = buildShiftDetailsHref({
    planId: plan.summary.id,
    date: plan.summary.plan_date,
    project: plan.summary.project_name,
    site: plan.summary.site_name,
  })
  const riskHref = buildScheduleRisksHref({
    planId: plan.summary.id,
    project: plan.summary.project_name,
    site: plan.summary.site_name,
    date: plan.summary.plan_date,
  })
  const unavailabilityHref = buildUnavailabilityHref({
    project: plan.summary.project_name,
    site: plan.summary.site_name,
    date: plan.summary.plan_date,
    status: "active",
  })
  const scopeLabel = buildReviewScopeLabel({
    planId: plan.summary.id,
    date: plan.summary.plan_date,
    project: plan.summary.project_name,
    site: plan.summary.site_name,
  })

  return (
    <AppShell title="排班计划详情" searchPlaceholder="搜索计划、项目或职场">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold">{plan.summary.project_name}</h1>
            <p className="text-sm text-muted-foreground">
              {plan.summary.site_name} / {plan.summary.plan_date} /{" "}
              {plan.summary.version}
            </p>
          </div>
          <div className="flex gap-2">
            {plan.summary.status === "draft" ? (
              <Button asChild size="sm">
                <Link href={`/schedule-plans/${plan.summary.id}/edit`}>
                  编辑草稿
                </Link>
              </Button>
            ) : null}
            <Button asChild variant="outline" size="sm">
              <Link href="/schedule-plans">返回列表</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-start">
          <div className="grid gap-4">
            <section className="grid gap-4 md:grid-cols-4">
              <DetailCard title="状态" value={schedulePlanStatusLabel(plan.summary.status)} />
              <DetailCard title="预测人次" value={`${plan.summary.forecast_agents}`} />
              <DetailCard title="已排人次" value={`${plan.summary.scheduled_agents}`} />
              <DetailCard
                title="覆盖率"
                value={formatCoverageRate(plan.summary.coverage_rate)}
                description={`缺口 ${plan.summary.gap_agents} 人次`}
              />
            </section>

            <Card>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle>复核链路</CardTitle>
                  <CardDescription>
                    在本地 MVP 内继续检查班次、风险和不可用，不接数据库
                  </CardDescription>
                </div>
                <Badge variant="outline">No Database</Badge>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid gap-3 md:grid-cols-4">
                  <DetailCard
                    title="0.5h 时段"
                    value={`${plan.intervals.length}`}
                    description="当前计划时段数"
                  />
                  <DetailCard
                    title="缺口时段"
                    value={`${gapIntervals.length}`}
                    description="需人工复核"
                  />
                  <DetailCard
                    title="关联风险"
                    value={`${relatedRisks.length}`}
                    description="同计划本地风险提示"
                  />
                  <DetailCard
                    title="生效不可用"
                    value={`${relatedUnavailability.length}`}
                    description="同日期同职场"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={shiftHref}>查看班次</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href={riskHref}>查看风险</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href={unavailabilityHref}>查看不可用</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle>0.5h 时段明细</CardTitle>
                  <CardDescription>
                    只读展示预测人数、已排人数、缺口与备注
                  </CardDescription>
                </div>
                <Badge variant="outline">{plan.summary.id}</Badge>
              </CardHeader>
              <CardContent>
                <SchedulePlanIntervalTable
                  intervals={plan.intervals}
                  planId={plan.summary.id}
                  planDate={plan.summary.plan_date}
                  projectName={plan.summary.project_name}
                  siteName={plan.summary.site_name}
                />
              </CardContent>
            </Card>
          </div>

          <aside className="grid gap-4 xl:sticky xl:top-16">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">当前复核范围</CardTitle>
                <CardDescription>宽屏下固定显示，保持 detail 页复核姿态</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm">
                <div className="rounded-lg border bg-background p-3">
                  <p className="text-xs text-muted-foreground">范围摘要</p>
                  <p className="mt-1">{scopeLabel}</p>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between rounded-lg border bg-background px-3 py-2">
                    <span className="text-muted-foreground">缺口时段</span>
                    <span className="font-medium tabular-nums">{gapIntervals.length}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border bg-background px-3 py-2">
                    <span className="text-muted-foreground">关联风险</span>
                    <span className="font-medium tabular-nums">{relatedRisks.length}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border bg-background px-3 py-2">
                    <span className="text-muted-foreground">生效不可用</span>
                    <span className="font-medium tabular-nums">
                      {relatedUnavailability.length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">复核任务</CardTitle>
                <CardDescription>继续沿着当前计划范围检查风险、班次和不可用</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={shiftHref}>查看班次</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href={riskHref}>查看风险</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href={unavailabilityHref}>查看不可用</Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/schedule-plans">回到全部计划</Link>
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </AppShell>
  )
}

function DetailCard({
  title,
  value,
  description,
}: {
  title: string
  value: string
  description?: string
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums">
          {value}
        </CardTitle>
      </CardHeader>
      {description ? (
        <CardContent className="text-xs text-muted-foreground">
          {description}
        </CardContent>
      ) : null}
    </Card>
  )
}
