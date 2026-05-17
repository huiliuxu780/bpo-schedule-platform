import Link from "next/link"
import { notFound } from "next/navigation"

import { AppShell } from "@/components/app-shell"
import { ReviewChecklistRail } from "@/components/review-checklist-rail"
import { SchedulePlanIntervalTable } from "@/components/schedule-plan-interval-table"
import {
  buildPlanEditHref,
  buildReviewBackLink,
  buildReviewScopeLabel,
  buildSchedulePlansHref,
  buildScheduleRisksHref,
  buildShiftDetailsHref,
  buildUnavailabilityHref,
} from "@/lib/review-navigation"
import {
  formatCoverageRate,
  getSchedulePlan,
  getScheduleRisks,
  schedulePlanStatusLabel,
  summarizeDraftReviewReadiness,
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
  searchParams: Promise<{
    from?: string
    query?: string
    draft?: string
    date?: string
    project?: string
    site?: string
    intervalStart?: string
    intervalEnd?: string
    startTime?: string
    endTime?: string
    status?: string
  }>
}

export default async function SchedulePlanDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { planId } = await params
  const scopeParams = await searchParams
  const draft = scopeParams.draft?.trim() ?? ""
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
  const reviewReadiness = summarizeDraftReviewReadiness(
    plan,
    relatedRisks,
    relatedUnavailability
  )
  const shiftHref = buildShiftDetailsHref({
    from: "schedule-plans",
    planId: plan.summary.id,
    date: scopeParams.date ?? plan.summary.plan_date,
    project: scopeParams.project ?? plan.summary.project_name,
    site: scopeParams.site ?? plan.summary.site_name,
    intervalStart: scopeParams.intervalStart ?? scopeParams.startTime,
    intervalEnd: scopeParams.intervalEnd ?? scopeParams.endTime,
  })
  const riskHref = buildScheduleRisksHref({
    from: "schedule-plans",
    planId: plan.summary.id,
    project: scopeParams.project ?? plan.summary.project_name,
    site: scopeParams.site ?? plan.summary.site_name,
    date: scopeParams.date ?? plan.summary.plan_date,
    intervalStart: scopeParams.intervalStart ?? scopeParams.startTime,
    intervalEnd: scopeParams.intervalEnd ?? scopeParams.endTime,
  })
  const unavailabilityHref = buildUnavailabilityHref({
    from: "schedule-plans",
    query: scopeParams.query,
    planId: plan.summary.id,
    project: scopeParams.project ?? plan.summary.project_name,
    site: scopeParams.site ?? plan.summary.site_name,
    date: scopeParams.date ?? plan.summary.plan_date,
    startTime: scopeParams.startTime ?? scopeParams.intervalStart,
    endTime: scopeParams.endTime ?? scopeParams.intervalEnd,
    status: scopeParams.status ?? "active",
  })
  const scopeLabel = buildReviewScopeLabel({
    planId: plan.summary.id,
    date: scopeParams.date ?? plan.summary.plan_date,
    project: scopeParams.project ?? plan.summary.project_name,
    site: scopeParams.site ?? plan.summary.site_name,
    intervalStart: scopeParams.intervalStart ?? scopeParams.startTime,
    intervalEnd: scopeParams.intervalEnd ?? scopeParams.endTime,
  })
  const backLink = buildReviewBackLink(
    {
      from: scopeParams.from,
      query: scopeParams.query,
      status: scopeParams.status,
      planId: scopeParams.from === "schedule-plans" ? undefined : plan.summary.id,
      project: scopeParams.project ?? plan.summary.project_name,
      site: scopeParams.site ?? plan.summary.site_name,
      date: scopeParams.date ?? plan.summary.plan_date,
      intervalStart: scopeParams.intervalStart ?? scopeParams.startTime,
      intervalEnd: scopeParams.intervalEnd ?? scopeParams.endTime,
      startTime: scopeParams.startTime,
      endTime: scopeParams.endTime,
    },
    {
      href: buildSchedulePlansHref({
        query: scopeParams.query,
        status: scopeParams.status,
      }),
      label: "返回列表",
    },
  )

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
                <Link
                  href={buildPlanEditHref(plan.summary.id, {
                    from: scopeParams.from,
                    query: scopeParams.query,
                    status: scopeParams.status,
                    date: scopeParams.date ?? plan.summary.plan_date,
                    project: scopeParams.project ?? plan.summary.project_name,
                    site: scopeParams.site ?? plan.summary.site_name,
                    intervalStart: scopeParams.intervalStart ?? scopeParams.startTime,
                    intervalEnd: scopeParams.intervalEnd ?? scopeParams.endTime,
                  })}
                >
                  编辑草稿
                </Link>
              </Button>
            ) : null}
            <Button asChild variant="outline" size="sm">
              <Link href={backLink.href}>{backLink.label}</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-start">
          <div className="grid gap-4">
            {draft === "failed" ? (
              <Card className="border-destructive/40 bg-destructive/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">草稿操作失败</CardTitle>
                  <CardDescription>
                    本地 draft 保存未完成，请检查当前输入后重试。
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : null}
            {draft === "created" ? (
              <Card className="border-emerald-500/40 bg-emerald-500/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">草稿已创建</CardTitle>
                  <CardDescription>
                    本地 draft 已创建完成，可以继续复核时段、风险和不可用。
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : null}
            {draft === "updated" ? (
              <Card className="border-emerald-500/40 bg-emerald-500/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">草稿已保存</CardTitle>
                  <CardDescription>
                    本地 draft 已保存完成，可以继续沿当前上下文复核。
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : null}
            <Card>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle>复核准备</CardTitle>
                  <CardDescription>
                    基于当前草稿缺口、关联风险和生效不可用给出本机下一步。
                  </CardDescription>
                </div>
                <Badge variant="outline">{reviewReadiness.statusLabel}</Badge>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-3 md:grid-cols-4">
                  <DetailCard
                    title="缺口时段"
                    value={`${reviewReadiness.gapIntervals}`}
                    description="需要先补齐"
                  />
                  <DetailCard
                    title="高风险"
                    value={`${reviewReadiness.highRiskCount}`}
                    description="需要继续复核"
                  />
                  <DetailCard
                    title="生效不可用"
                    value={`${reviewReadiness.activeUnavailabilityCount}`}
                    description="同日期同职场"
                  />
                  <DetailCard
                    title="准备信号"
                    value={`${reviewReadiness.readinessSignals}/3`}
                    description="本机 readiness"
                  />
                </div>
                <div className="rounded-md border bg-muted/20 p-3 text-sm">
                  <p className="font-medium">{reviewReadiness.nextStep}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    不提交审批、不发布排班、不做自动排班或生产写回。
                  </p>
                </div>
              </CardContent>
            </Card>
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

          <ReviewChecklistRail
            scopeLabel={scopeLabel}
            scopeFallbackLabel={scopeLabel}
            scopeDescription="宽屏下固定显示，保持 detail 页复核姿态"
            taskDescription="继续沿着当前计划范围检查风险、班次和不可用"
            currentStep="确认当前计划的缺口时段、关联风险和生效不可用。"
            nextStep="继续查看风险、班次与不可用，沿同一范围完成计划复核。"
            summaryItems={[
              { label: "缺口时段", value: gapIntervals.length },
              { label: "关联风险", value: relatedRisks.length },
              { label: "生效不可用", value: relatedUnavailability.length },
            ]}
            actions={[
              { label: "查看班次", href: shiftHref },
              { label: "查看风险", href: riskHref },
              { label: "查看不可用", href: unavailabilityHref },
            ]}
            backHref={backLink.href}
            backLabel={backLink.label}
          />
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
