import Link from "next/link"

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
  dataQualityGroupRiskLabel,
  fallbackDataQualityGroups,
  summarizeDataQualityGroups,
} from "@/lib/data-quality-groups"

export default function DataQualityGroupsPage() {
  const groups = fallbackDataQualityGroups
  const summary = summarizeDataQualityGroups(groups)

  return (
    <AppShell title="质量分组" searchPlaceholder="搜索质量分组、模板或追溯键">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <div className="text-xs text-muted-foreground">
              <Link href="/data-quality">数据质量</Link> / 质量分组
            </div>
            <h1 className="text-lg font-semibold">数据质量分组</h1>
            <p className="text-sm text-muted-foreground">
              按业务原因聚合同类质量问题，用于从导入批次追溯到主数据、排班、预测和实际日志的影响面。
            </p>
          </div>
          <Badge variant="outline">只读分组</Badge>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <Metric title="分组数" value={`${summary.totalGroups}`} description="业务原因" />
          <Metric title="关联问题" value={`${summary.totalIssues}`} description="质量问题 ID" />
          <Metric title="高风险组" value={`${summary.highRiskGroups}`} description="优先复核" />
          <Metric title="来源模板" value={`${summary.sourceTemplateCount}`} description="导入模板" />
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {groups.map((group) => (
            <Card key={group.id}>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-col gap-1">
                    <CardTitle>{group.title}</CardTitle>
                    <CardDescription>{group.description}</CardDescription>
                  </div>
                  <Badge variant={group.risk === "high" ? "destructive" : "secondary"}>
                    {dataQualityGroupRiskLabel(group.risk)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <Detail label="负责人" value={group.owner} />
                  <Detail label="问题数" value={`${group.issueIds.length}`} />
                  <Detail label="模板数" value={`${group.sourceTemplates.length}`} />
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.sourceTemplates.map((template) => (
                    <Badge key={template} variant="outline">
                      {template}
                    </Badge>
                  ))}
                </div>
                <div className="flex justify-end">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/data-quality/groups/${group.id}`}>查看分组</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card>
          <CardHeader>
            <CardTitle>暂不实现动作</CardTitle>
            <CardDescription>本页只解释分组和追溯关系，不执行生产修复动作。</CardDescription>
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
        <CardTitle className="text-2xl font-semibold tabular-nums">{value}</CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">{description}</CardContent>
    </Card>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 break-words text-sm font-medium">{value}</div>
    </div>
  )
}
