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
              本地只读 drilldown，拆解预测排班、排班登录、排班状态、主数据和数据质量来源。
            </p>
          </div>
          <Badge variant="outline">无真实异常计算</Badge>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <Metric title="来源类型" value={`${summary.totalSources}`} description="第一阶段来源" />
          <Metric title="示例异常" value={`${summary.totalExamples}`} description="来自异常复核样例" />
          <Metric title="触发条件" value={`${summary.totalTriggerConditions}`} description="本地说明口径" />
          <Metric title="待开发动作" value={`${summary.deferredActions.length}`} description="全部暂缓" />
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

        <Card>
          <CardHeader>
            <CardTitle>暂不实现动作</CardTitle>
            <CardDescription>
              本页只解释异常来源，不提交复核、不产生生产计算结果。
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {summary.deferredActions.map((item) => (
              <Badge key={item} variant="secondary">
                {item}
              </Badge>
            ))}
          </CardContent>
        </Card>
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
