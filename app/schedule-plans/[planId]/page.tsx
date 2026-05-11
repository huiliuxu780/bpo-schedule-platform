import Link from "next/link"
import { notFound } from "next/navigation"

import { AppShell } from "@/components/app-shell"
import {
  formatCoverageRate,
  getSchedulePlan,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
              <CardTitle>0.5h 时段明细</CardTitle>
              <CardDescription>
                只读展示预测人数、已排人数、缺口与备注
              </CardDescription>
            </div>
            <Badge variant="outline">{plan.summary.id}</Badge>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>开始</TableHead>
                  <TableHead>结束</TableHead>
                  <TableHead className="text-right">预测</TableHead>
                  <TableHead className="text-right">已排</TableHead>
                  <TableHead className="text-right">缺口</TableHead>
                  <TableHead className="text-right">覆盖率</TableHead>
                  <TableHead>备注</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plan.intervals.map((item) => (
                  <TableRow key={`${item.interval_start}-${item.interval_end}`}>
                    <TableCell className="font-mono text-xs">
                      {item.interval_start}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {item.interval_end}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {item.forecast_agents}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {item.scheduled_agents}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {item.gap_agents}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCoverageRate(item.coverage_rate)}
                    </TableCell>
                    <TableCell>{item.note}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
