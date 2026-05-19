import Link from "next/link"

import { AppShell } from "@/components/app-shell"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  fallbackAnomalySources,
  summarizeAnomalySources,
} from "@/lib/anomaly-source-drilldown"

export default function AnomalySourcesPage() {
  const rows = fallbackAnomalySources
  const summary = summarizeAnomalySources(rows)

  return (
    <AppShell title="异常来源" searchPlaceholder="搜索来源、输入对象或追溯键">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <h1 className="text-lg font-semibold">异常来源</h1>
            <p className="text-sm text-muted-foreground">
              拆解预测排班、排班登录、排班状态、主数据和数据质量来源。
            </p>
          </div>
          <Badge variant="outline">来源分析</Badge>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <Metric title="来源类型" value={`${summary.totalSources}`} description="第一阶段来源" />
          <Metric title="示例异常" value={`${summary.totalExamples}`} description="来自异常复核清单" />
          <Metric title="触发条件" value={`${summary.totalTriggerConditions}`} description="业务判断条件" />
          <Metric title="追溯字段" value={`${rows.reduce((total, row) => total + row.traceKeys.length, 0)}`} description="定位明细" />
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {rows.map((row) => (
            <Link key={row.id} href={`/anomaly-review/sources/${row.id}`}>
              <Card className="h-full transition-colors hover:bg-muted/40">
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-col gap-1">
                      <CardTitle>{row.label}</CardTitle>
                      <CardDescription>{row.id}</CardDescription>
                    </div>
                    <Badge variant="secondary">
                      {summary.sourceCaseCounts[row.id]} 条样例
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground">输入对象</div>
                    <div className="mt-1">{row.inputObjects.join(" / ")}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">触发条件</div>
                    <div className="mt-1">{row.triggerConditions.join("；")}</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>
      </main>
    </AppShell>
  )
}

function Metric({
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
