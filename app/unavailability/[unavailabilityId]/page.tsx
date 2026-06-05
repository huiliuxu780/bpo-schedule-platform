import Link from "next/link"
import { notFound } from "next/navigation"

import { AppShell } from "@/components/app-shell"
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

type PageProps = {
  params: Promise<{
    unavailabilityId: string
  }>
}

export default async function UnavailabilityImpactPage({ params }: PageProps) {
  const { unavailabilityId } = await params
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

  return (
    <AppShell title="不可用影响定位">
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
              <Link href={`/shift-details?query=${record.site_name}`}>查看班次</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/unavailability">返回不可用</Link>
            </Button>
          </div>
        </div>

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
                查看不可用原因、人员团队和排班影响。
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
              <Link href={`/shift-details?query=${record.site_name}`}>全部班次</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <UnavailabilityImpactShiftTable rows={impactedShiftDetails} />
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
              <Link href={`/schedule-plans?query=${record.site_name}`}>查看风险列表</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <UnavailabilityImpactRiskTable rows={relatedRisks} />
          </CardContent>
        </Card>
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
