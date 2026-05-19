import Link from "next/link"
import { notFound } from "next/navigation"

import { AppShell } from "@/components/app-shell"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  fallbackAnomalySources,
  getAnomalySourceById,
} from "@/lib/anomaly-source-drilldown"

type PageProps = {
  params: Promise<{ sourceId: string }>
}

export function generateStaticParams() {
  return fallbackAnomalySources.map((source) => ({
    sourceId: source.id,
  }))
}

export default async function AnomalySourceDetailPage({ params }: PageProps) {
  const { sourceId } = await params
  const source = getAnomalySourceById(sourceId)

  if (!source) {
    notFound()
  }

  return (
    <AppShell title={source.label} searchPlaceholder="搜索异常来源字段">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <div className="text-xs text-muted-foreground">
              <Link href="/anomaly-review/sources">异常来源</Link> / {source.id}
            </div>
            <h1 className="text-lg font-semibold">{source.label}</h1>
            <p className="text-sm text-muted-foreground">
              解释该异常来源需要哪些输入、用哪些键对齐、如何追溯，不执行真实异常计算。
            </p>
          </div>
          <Badge variant="outline">{source.owner}</Badge>
        </div>

        <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>输入对象</CardTitle>
              <CardDescription>异常识别需要同时拿到的本地对象。</CardDescription>
            </CardHeader>
            <CardContent>
              <BadgeList values={source.inputObjects} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>对齐键</CardTitle>
              <CardDescription>用于把预测、排班、登录、状态和主数据拼到同一口径。</CardDescription>
            </CardHeader>
            <CardContent>
              <BadgeList values={source.alignmentKeys} />
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>触发条件</CardTitle>
            <CardDescription>
              本地解释口径，不代表生产阈值、公式或自动处理规则。
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {source.triggerConditions.map((condition) => (
              <div key={condition} className="rounded-lg border p-3 text-sm">
                {condition}
              </div>
            ))}
          </CardContent>
        </Card>

        <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>追溯键</CardTitle>
              <CardDescription>后续定位异常明细时需要保留的字段。</CardDescription>
            </CardHeader>
            <CardContent>
              <BadgeList values={source.traceKeys} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>样例异常</CardTitle>
              <CardDescription>对应异常复核页中的本地样例 ID。</CardDescription>
            </CardHeader>
            <CardContent>
              <BadgeList values={source.exampleCaseIds} />
              <Separator className="my-4" />
              <div className="text-xs text-muted-foreground">
                本页不做复核提交、审批、导出、批量或生产公式。
              </div>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>暂不实现动作</CardTitle>
            <CardDescription>后续开发必须单独 Gate。</CardDescription>
          </CardHeader>
          <CardContent>
            <BadgeList values={source.deferredActions} />
          </CardContent>
        </Card>
      </main>
    </AppShell>
  )
}

function BadgeList({ values }: { values: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {values.map((value) => (
        <Badge key={value} variant="secondary">
          {value}
        </Badge>
      ))}
    </div>
  )
}
