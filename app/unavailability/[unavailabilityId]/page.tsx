import Link from "next/link"
import { notFound } from "next/navigation"

import { AppShell } from "@/components/app-shell"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  formatCoverageRate,
  getScheduleRisks,
  getShiftDetails,
  schedulePlanStatusLabel,
  scheduleRiskLevelLabel,
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
              <Link href={`/shift-details?query=${record.site_name}`}>全部班次</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>计划</TableHead>
                  <TableHead>时段</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">预测</TableHead>
                  <TableHead className="text-right">已排</TableHead>
                  <TableHead className="text-right">缺口</TableHead>
                  <TableHead className="text-right">覆盖率</TableHead>
                  <TableHead>备注</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {impactedShiftDetails.map((row) => (
                  <TableRow key={`${row.plan_id}-${row.interval_start}`}>
                    <TableCell className="font-medium">{row.plan_id}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {row.interval_start}-{row.interval_end}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {schedulePlanStatusLabel(row.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.forecast_agents}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.scheduled_agents}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.gap_agents}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCoverageRate(row.coverage_rate)}
                    </TableCell>
                    <TableCell>{row.note}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/schedule-plans/${row.plan_id}`}>计划</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {impactedShiftDetails.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="h-20 text-center text-sm text-muted-foreground"
                    >
                      当前不可用时段暂无匹配班次
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>风险</TableHead>
                  <TableHead>时段</TableHead>
                  <TableHead className="text-right">缺口</TableHead>
                  <TableHead className="text-right">不可用</TableHead>
                  <TableHead>原因</TableHead>
                  <TableHead>建议</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {relatedRisks.map((risk) => (
                  <TableRow key={risk.risk_id}>
                    <TableCell>
                      <Badge
                        variant={risk.risk_level === "high" ? "default" : "outline"}
                      >
                        {scheduleRiskLevelLabel(risk.risk_level)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {risk.interval_start}-{risk.interval_end}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {risk.gap_agents}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {risk.affected_unavailability}
                    </TableCell>
                    <TableCell>{risk.reason}</TableCell>
                    <TableCell>{risk.recommendation}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/schedule-risks/${encodeURIComponent(risk.risk_id)}`}>
                          明细
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {relatedRisks.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-20 text-center text-sm text-muted-foreground"
                    >
                      当前不可用时段暂无关联风险提示
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
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
