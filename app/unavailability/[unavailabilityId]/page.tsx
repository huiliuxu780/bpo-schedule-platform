import Link from "next/link"
import { notFound } from "next/navigation"

import { AppShell } from "@/components/app-shell"
import { ReviewChecklistRail } from "@/components/review-checklist-rail"
import { UnavailabilityImpactRiskTable } from "@/components/unavailability-impact-risk-table"
import { UnavailabilityImpactShiftTable } from "@/components/unavailability-impact-shift-table"
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
  getScheduleRisks,
  getShiftDetails,
} from "@/lib/schedule-plans"
import {
  getUnavailabilityRecord,
  unavailabilityStatusLabel,
} from "@/lib/unavailability"
import {
  buildPlanDetailHref,
  buildReviewBackLink,
  buildReviewScopeLabel,
  buildScheduleRisksHref,
  buildShiftDetailsHref,
  buildUnavailabilityHref,
} from "@/lib/review-navigation"

type PageProps = {
  params: Promise<{
    unavailabilityId: string
  }>
  searchParams: Promise<{
    from?: string
    query?: string
    status?: string
    project?: string
    site?: string
    date?: string
    startTime?: string
    endTime?: string
  }>
}

export default async function UnavailabilityImpactPage({
  params,
  searchParams,
}: PageProps) {
  const { unavailabilityId } = await params
  const scopeParams = await searchParams
  const record = await getUnavailabilityRecord(decodeURIComponent(unavailabilityId))

  if (!record) {
    notFound()
  }

  const [shiftDetails, risks] = await Promise.all([
    getShiftDetails({ query: record.site_name }),
    getScheduleRisks(record.site_name),
  ])
  const impactedShiftDetails = shiftDetails.filter(
    (row) =>
      row.project_name === record.project_name &&
      row.site_name === record.site_name &&
      row.plan_date === record.unavailable_date &&
      row.interval_start < record.end_time &&
      row.interval_end > record.start_time
  )
  const relatedRisks = risks.filter(
    (risk) =>
      risk.project_name === record.project_name &&
      risk.site_name === record.site_name &&
      risk.plan_date === record.unavailable_date &&
      risk.interval_start < record.end_time &&
      risk.interval_end > record.start_time
  )
  const totalGap = impactedShiftDetails.reduce(
    (sum, row) => sum + row.gap_agents,
    0
  )
  const primaryPlanId = impactedShiftDetails[0]?.plan_id
  const scopeLabel = buildReviewScopeLabel({
    project: record.project_name,
    site: record.site_name,
    date: record.unavailable_date,
    startTime: record.start_time,
    endTime: record.end_time,
  })
  const sourceFrom = scopeParams.from ?? "unavailability"
  const shiftHref = buildShiftDetailsHref({
    from: sourceFrom,
    project: record.project_name,
    site: record.site_name,
    date: record.unavailable_date,
    intervalStart: record.start_time,
    intervalEnd: record.end_time,
  })
  const riskHref = buildScheduleRisksHref({
    from: sourceFrom,
    project: record.project_name,
    site: record.site_name,
    date: record.unavailable_date,
    intervalStart: record.start_time,
    intervalEnd: record.end_time,
  })
  const planHref = buildPlanDetailHref(primaryPlanId, {
    from: sourceFrom,
    project: record.project_name,
    site: record.site_name,
    date: record.unavailable_date,
    startTime: record.start_time,
    endTime: record.end_time,
  })
  const listHref = buildUnavailabilityHref({
    from: sourceFrom,
    query: scopeParams.query,
    status: scopeParams.status ?? record.status,
    project: record.project_name,
    site: record.site_name,
    date: record.unavailable_date,
    startTime: record.start_time,
    endTime: record.end_time,
  })
  const backLink = buildReviewBackLink(
    {
      from: scopeParams.from,
      query: scopeParams.query,
      status: scopeParams.status ?? record.status,
      project: scopeParams.project ?? record.project_name,
      site: scopeParams.site ?? record.site_name,
      date: scopeParams.date ?? record.unavailable_date,
      startTime: scopeParams.startTime ?? record.start_time,
      endTime: scopeParams.endTime ?? record.end_time,
    },
    {
      href: listHref,
      label: "返回不可用",
    },
  )

  return (
    <AppShell title="不可用影响定位" searchPlaceholder="搜索不可用、班次或风险">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold">不可用影响定位</h1>
            <p className="text-sm text-muted-foreground">
              {record.staff_name} / {record.team_name} / {record.unavailable_date} /{" "}
              {record.start_time}-{record.end_time}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={shiftHref}>查看班次</Link>
            </Button>
            {primaryPlanId ? (
              <Button asChild variant="outline" size="sm">
                <Link href={planHref}>计划详情</Link>
              </Button>
            ) : null}
            <Button asChild variant="outline" size="sm">
              <Link href={backLink.href}>{backLink.label}</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-start">
          <div className="grid gap-4">
            <section className="grid gap-4 md:grid-cols-4">
              <MetricCard
                title="不可用状态"
                value={unavailabilityStatusLabel(record.status)}
                description={record.unavailability_id}
              />
              <MetricCard
                title="影响班次"
                value={`${impactedShiftDetails.length}`}
                description="按 0.5h 时段匹配"
              />
              <MetricCard
                title="关联风险"
                value={`${relatedRisks.length}`}
                description="同项目同职场重叠时段"
              />
              <MetricCard
                title="排班缺口"
                value={`${totalGap}`}
                description="影响班次缺口合计"
              />
            </section>

            <Card>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle>不可用记录</CardTitle>
                  <CardDescription>
                    本页只定位影响，不触发审批、批量调班或自动排班
                  </CardDescription>
                </div>
                <Badge variant={record.status === "active" ? "default" : "outline"}>
                  {unavailabilityStatusLabel(record.status)}
                </Badge>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <InfoBlock label="人员与团队" value={`${record.staff_name} / ${record.team_name}`} />
                <InfoBlock label="项目与职场" value={`${record.project_name} / ${record.site_name}`} />
                <InfoBlock label="不可用原因" value={record.reason} />
                <InfoBlock label="备注" value={record.note} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle>影响班次</CardTitle>
                  <CardDescription>
                    与不可用时间重叠的排班计划 0.5h 时段
                  </CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={shiftHref}>查看班次</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <UnavailabilityImpactShiftTable
                  rows={impactedShiftDetails}
                  sourceFrom={sourceFrom}
                  project={record.project_name}
                  site={record.site_name}
                  date={record.unavailable_date}
                  intervalStart={record.start_time}
                  intervalEnd={record.end_time}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle>关联风险</CardTitle>
                  <CardDescription>
                    同项目、同职场、同日期且与不可用时间重叠的风险提示
                  </CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={riskHref}>查看风险列表</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <UnavailabilityImpactRiskTable
                  rows={relatedRisks}
                  sourceFrom={sourceFrom}
                />
              </CardContent>
            </Card>
          </div>

          <ReviewChecklistRail
            scopeLabel={scopeLabel}
            scopeFallbackLabel={scopeLabel}
            scopeDescription="宽屏下固定显示，保持 detail 页复核姿态"
            taskDescription="继续沿着当前不可用范围检查风险、班次和计划"
            currentStep="确认当前不可用的影响班次、关联风险和排班缺口。"
            nextStep="继续查看班次、风险与计划，确认不可用影响是否已定位清楚。"
            summaryItems={[
              { label: "影响班次", value: impactedShiftDetails.length },
              { label: "关联风险", value: relatedRisks.length },
              { label: "排班缺口", value: totalGap },
            ]}
            actions={[
              { label: "查看班次", href: shiftHref },
              { label: "查看风险", href: riskHref },
              { label: "查看计划", href: planHref },
            ]}
            backHref={backLink.href}
            backLabel={backLink.label}
          />
        </div>
      </main>
    </AppShell>
  )
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm">{value}</p>
    </div>
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
