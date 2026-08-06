import Link from "next/link"
import { notFound } from "next/navigation"

import { AppShell } from "@/components/app-shell"
import { BackendErrorAlert } from "@/components/backend-error-alert"
import { SchedulePlanIntervalTable } from "@/components/schedule-plan-interval-table"
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
  const planResult = await getSchedulePlan(planId)

  if (planResult.error) {
    return (
      <AppShell
        title="排班计划详情"
        breadcrumbItems={[
          { label: "排班计划", href: "/schedule-plans" },
          { label: "排班计划详情" },
        ]}
      >
        <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
          <BackendErrorAlert error={planResult.error} />
        </main>
      </AppShell>
    )
  }

  const plan = planResult.data

  if (!plan) {
    notFound()
  }

  const [risksResult, activeUnavailabilityResult] = await Promise.all([
    getScheduleRisks(plan.summary.id),
    getUnavailability({ query: plan.summary.site_name, status: "active" }),
  ])
  const relatedError = risksResult.error ?? activeUnavailabilityResult.error

  if (relatedError) {
    return (
      <AppShell
        title="排班计划详情"
        breadcrumbItems={[
          { label: "排班计划", href: "/schedule-plans" },
          { label: "排班计划详情" },
        ]}
      >
        <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
          <BackendErrorAlert error={relatedError} />
        </main>
      </AppShell>
    )
  }

  const risks = risksResult.data ?? []
  const activeUnavailability = activeUnavailabilityResult.data ?? []
  const gapIntervals = plan.intervals.filter((item) => item.gap_agents > 0)
  const relatedRisks = risks.filter(
    (risk) =>
      risk.plan_id === plan.summary.id &&
      risk.plan_date === plan.summary.plan_date
  )
  const primaryRisk = relatedRisks[0] ?? null
  const relatedUnavailability = activeUnavailability.filter(
    (row) =>
      row.project_name === plan.summary.project_name &&
      row.site_name === plan.summary.site_name &&
      row.unavailable_date === plan.summary.plan_date
  )

  return (
    <AppShell
      title="排班计划详情"
      breadcrumbItems={[
        { label: "排班计划", href: "/schedule-plans" },
        { label: "排班计划详情" },
      ]}
    >
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-foreground">{plan.summary.project_name}</p>
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
                继续检查班次、风险和不可用影响。
              </CardDescription>
            </div>
            <Badge variant="outline">复核中</Badge>
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
                description="同计划风险提示"
              />
              <DetailCard
                title="生效不可用"
                value={`${relatedUnavailability.length}`}
                description="同日期同职场"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/shift-details?query=${plan.summary.id}`}>查看班次</Link>
              </Button>
              {primaryRisk ? (
                <Button asChild variant="outline" size="sm">
                  <Link
                    href={`/schedule-risks/${encodeURIComponent(primaryRisk.risk_id)}`}
                  >
                    查看风险
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  查看风险
                </Button>
              )}
              <Button asChild variant="outline" size="sm">
                <Link
                  href={`/unavailability?query=${encodeURIComponent(plan.summary.site_name)}&status=active`}
                >
                  查看不可用
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>0.5h 时段明细</CardTitle>
              <CardDescription>
                展示预测人数、已排人数、缺口与备注
              </CardDescription>
            </div>
            <Badge variant="outline">{plan.summary.id}</Badge>
          </CardHeader>
          <CardContent>
            <SchedulePlanIntervalTable intervals={plan.intervals} />
          </CardContent>
        </Card>
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
