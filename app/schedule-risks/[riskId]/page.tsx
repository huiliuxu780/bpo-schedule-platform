import Link from "next/link"
import { notFound } from "next/navigation"

import { AppShell } from "@/components/app-shell"
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
  getShiftDetails,
  scheduleRiskLevelLabel,
} from "@/lib/schedule-plans"
import {
  getUnavailability,
} from "@/lib/unavailability"

type PageProps = {
  params: Promise<{
    riskId: string
  }>
}

export default async function ScheduleRiskDetailPage({ params }: PageProps) {
  const { riskId } = await params
  const risk = await getScheduleRisk(decodeURIComponent(riskId))

  if (!risk) {
    notFound()
  }

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
    <AppShell title="风险明细" searchPlaceholder="搜索风险、计划或职场">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold">风险明细</h1>
            <p className="text-sm text-muted-foreground">
              {risk.project_name} / {risk.site_name} / {risk.plan_date} /{" "}
              {risk.interval_start}-{risk.interval_end}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
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
            title="风险等级"
            value={scheduleRiskLevelLabel(risk.risk_level)}
            description={risk.risk_id}
          />
          <MetricCard
            title="排班缺口"
            value={`${risk.gap_agents}`}
            description="本地 MVP 展示口径"
          />
          <MetricCard
            title="不可用影响"
            value={`${risk.affected_unavailability}`}
            description="生效中记录数量"
          />
          <MetricCard
            title="关联班次"
            value={`${relatedShiftDetails.length}`}
            description="同计划同一 0.5h 时段"
          />
        </section>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>复核建议</CardTitle>
              <CardDescription>
                本页只做本地展示，不触发审批、批量调班或自动排班
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
