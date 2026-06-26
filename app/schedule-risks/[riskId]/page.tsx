import Link from "next/link"
import { notFound } from "next/navigation"

import { AppShell } from "@/components/app-shell"
import { MetricCard } from "@/components/metric-card"
import { ScheduleRiskShiftTable } from "@/components/schedule-risk-shift-table"
import { ScheduleRiskUnavailabilityTable } from "@/components/schedule-risk-unavailability-table"
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
  getScheduleRisk,
  getScheduleRiskActions,
  getShiftDetails,
  scheduleRiskLevelLabel,
  summarizeScheduleRiskActionFeedback,
} from "@/lib/schedule-plans"
import {
  getUnavailability,
} from "@/lib/unavailability"
import { confirmScheduleRiskAction, resolveScheduleRiskAction } from "./actions"

type PageProps = {
  params: Promise<{
    riskId: string
  }>
  searchParams?: Promise<{
    riskAction?: string
  }>
}

export default async function ScheduleRiskDetailPage({ params, searchParams }: PageProps) {
  const { riskId } = await params
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const risk = await getScheduleRisk(decodeURIComponent(riskId))

  if (!risk) {
    notFound()
  }

  const riskActions = getScheduleRiskActions(risk.risk_status)
  const riskFeedback = summarizeScheduleRiskActionFeedback(resolvedSearchParams.riskAction)

  const [shiftDetails, unavailabilityRows] = await Promise.all([
    getShiftDetails({ query: risk.site_name }),
    getUnavailability({ query: risk.site_name, status: "active" }),
  ])
  const relatedShiftDetails = shiftDetails.filter(
    (row) =>
      row.plan_id === risk.plan_id &&
      row.interval_start === risk.interval_start &&
      row.interval_end === risk.interval_end
  )
  const relatedUnavailabilityRows = unavailabilityRows.filter(
    (row) =>
      row.project_name === risk.project_name &&
      row.site_name === risk.site_name &&
      row.unavailable_date === risk.plan_date &&
      row.start_time < risk.interval_end &&
      row.end_time > risk.interval_start
  )

  return (
    <AppShell title="风险明细">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        {riskFeedback ? (
          <Card
            className={
              riskFeedback.tone === "error"
                ? "border-destructive/50"
                : undefined
            }
          >
            <CardHeader>
              <CardTitle className="text-base">{riskFeedback.title}</CardTitle>
              <CardDescription>{riskFeedback.description}</CardDescription>
            </CardHeader>
          </Card>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold">风险明细</h1>
            <p className="text-sm text-muted-foreground">
              {risk.project_name} / {risk.site_name} / {risk.plan_date} /{" "}
              {risk.interval_start}-{risk.interval_end}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {riskActions.map((action) => {
              const formAction =
                action.key === "confirm"
                  ? confirmScheduleRiskAction
                  : resolveScheduleRiskAction
              return (
                <form key={action.key} action={formAction}>
                  <input type="hidden" name="risk_id" value={risk.risk_id} />
                  <Button type="submit" variant="outline" size="sm">
                    {action.label}
                  </Button>
                </form>
              )
            })}
            <Button asChild variant="outline" size="sm">
              <Link href={`/schedule-plans/${risk.plan_id}`}>计划详情</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/schedule-plans">返回列表</Link>
            </Button>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard
            title="风险状态"
            value={
              risk.risk_status === "resolved"
                ? "已处理"
                : risk.risk_status === "confirmed"
                ? "已确认"
                : "待处理"
            }
            description={risk.risk_id}
          />
          <MetricCard
            title="风险等级"
            value={scheduleRiskLevelLabel(risk.risk_level)}
            description="按缺口与不可用综合判断"
          />
          <MetricCard
            title="排班缺口"
            value={`${risk.gap_agents}`}
            description="当前风险缺口"
          />
          <MetricCard
            title="不可用影响"
            value={`${risk.affected_unavailability}`}
            description="生效中记录数量"
          />
        </section>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>复核建议</CardTitle>
              <CardDescription>
                查看风险原因、建议动作和关联影响。
              </CardDescription>
            </div>
            <Badge variant={risk.risk_level === "high" ? "default" : "outline"}>
              {scheduleRiskLevelLabel(risk.risk_level)}
            </Badge>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border bg-background p-3">
              <p className="text-xs text-muted-foreground">风险原因</p>
              <p className="mt-1 text-sm">{risk.reason}</p>
            </div>
            <div className="rounded-lg border bg-background p-3">
              <p className="text-xs text-muted-foreground">建议动作</p>
              <p className="mt-1 text-sm">{risk.recommendation}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>关联班次</CardTitle>
              <CardDescription>
                同一计划、日期、职场和 0.5h 时段的排班明细
              </CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href={`/shift-details?query=${risk.site_name}`}>查看班次</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ScheduleRiskShiftTable rows={relatedShiftDetails} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>不可用影响</CardTitle>
              <CardDescription>
                与风险时段重叠的生效中不可用记录
              </CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href={`/unavailability?query=${risk.site_name}&status=active`}>
                查看不可用
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ScheduleRiskUnavailabilityTable rows={relatedUnavailabilityRows} />
          </CardContent>
        </Card>
      </main>
    </AppShell>
  )
}
