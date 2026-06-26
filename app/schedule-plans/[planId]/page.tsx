import Link from "next/link"
import { notFound } from "next/navigation"

import { AppShell } from "@/components/app-shell"
import { SchedulePlanIntervalTable } from "@/components/schedule-plan-interval-table"
import {
  formatCoverageRate,
  getSchedulePlan,
  getSchedulePlanLifecycleAction,
  getScheduleRisks,
  schedulePlanStatusLabel,
  summarizeSchedulePlanFulfillmentIssues,
  summarizeSchedulePlanLifecycleFeedback,
} from "@/lib/schedule-plans"
import { getUnavailability } from "@/lib/unavailability"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  submitReviewAction,
  publishSchedulePlanAction,
} from "./actions"

type PageProps = {
  params: Promise<{
    planId: string
  }>
  searchParams?: Promise<{
    lifecycle?: string
  }>
}

export default async function SchedulePlanDetailPage({ params, searchParams }: PageProps) {
  const { planId } = await params
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const plan = await getSchedulePlan(planId)

  if (!plan) {
    notFound()
  }

  const gapIntervals = plan.intervals.filter((item) => item.gap_agents > 0)
  const lifecycleAction = getSchedulePlanLifecycleAction(plan.summary.status)
  const lifecycleFeedback = summarizeSchedulePlanLifecycleFeedback(
    resolvedSearchParams.lifecycle
  )
  const [scheduleRisks, unavailabilityRows] = await Promise.all([
    getScheduleRisks(plan.summary.site_name),
    getUnavailability({ query: plan.summary.site_name }),
  ])
  const fulfillmentIssueSummary = summarizeSchedulePlanFulfillmentIssues(
    plan,
    scheduleRisks,
    unavailabilityRows
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
        {lifecycleFeedback ? (
          <Card
            className={
              lifecycleFeedback.tone === "error"
                ? "border-destructive/50"
                : undefined
            }
          >
            <CardHeader>
              <CardTitle className="text-base">{lifecycleFeedback.title}</CardTitle>
              <CardDescription>{lifecycleFeedback.description}</CardDescription>
            </CardHeader>
          </Card>
        ) : null}

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
            {lifecycleAction ? (
              <form
                action={
                  lifecycleAction.key === "submit_review"
                    ? submitReviewAction
                    : publishSchedulePlanAction
                }
              >
                <input type="hidden" name="plan_id" value={plan.summary.id} />
                <Button type="submit" size="sm">
                  {lifecycleAction.label}
                </Button>
              </form>
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
              <CardTitle>计划复核摘要</CardTitle>
              <CardDescription>
                当前计划的 0.5h 时段和缺口分布。
              </CardDescription>
            </div>
            <Badge variant="outline">计划内</Badge>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-3 md:grid-cols-3">
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
                title="覆盖缺口"
                value={`${plan.summary.gap_agents}`}
                description="按计划口径汇总"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>履约处理摘要</CardTitle>
              <CardDescription>
                展示当前计划关联风险和不可用处理状态，不自动重算排班覆盖。
              </CardDescription>
            </div>
            <Badge variant="outline">处理状态</Badge>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            <InlineMetric
              title="关联风险"
              value={`${fulfillmentIssueSummary.riskTotal}`}
              description={`待处理 ${fulfillmentIssueSummary.riskOpen}`}
            />
            <InlineMetric
              title="已确认 / 已处理"
              value={`${fulfillmentIssueSummary.riskConfirmed} / ${fulfillmentIssueSummary.riskResolved}`}
              description="风险处理状态"
            />
            <InlineMetric
              title="不可用影响"
              value={`${fulfillmentIssueSummary.unavailabilityActive}`}
              description={`已处理 ${fulfillmentIssueSummary.unavailabilityResolved}`}
            />
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

function InlineMetric({
  title,
  value,
  description,
}: {
  title: string
  value: string
  description: string
}) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <p className="text-xs text-muted-foreground">{title}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
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
