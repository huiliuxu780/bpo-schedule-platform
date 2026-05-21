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
  dataQualitySeverityLabel,
  dataQualitySourceLabels,
  dataQualityStatusLabel,
  getDataQualityIssue,
} from "@/lib/data-quality"
import {
  dataQualityGroupRiskLabel,
  fallbackDataQualityGroups,
  getDataQualityGroup,
} from "@/lib/data-quality-groups"

type PageProps = {
  params: Promise<{
    groupId: string
  }>
}

export function generateStaticParams() {
  return fallbackDataQualityGroups.map((group) => ({
    groupId: group.id,
  }))
}

export default async function DataQualityGroupDetailPage({ params }: PageProps) {
  const { groupId } = await params
  const group = getDataQualityGroup(decodeURIComponent(groupId))

  if (!group) {
    notFound()
  }

  const issues = group.issueIds
    .map((issueId) => getDataQualityIssue(issueId))
    .filter((issue) => issue !== undefined)

  return (
    <AppShell title={group.title} searchPlaceholder="搜索质量问题或追溯键">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <div className="text-xs text-muted-foreground">
              <Link href="/data-quality">数据质量</Link> /{" "}
              <Link href="/data-quality/groups">质量分组</Link> / {group.id}
            </div>
            <h1 className="text-lg font-semibold">{group.title}</h1>
            <p className="text-sm text-muted-foreground">{group.description}</p>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link href="/data-quality/groups">返回分组</Link>
          </Button>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <Metric title="风险" value={dataQualityGroupRiskLabel(group.risk)} />
          <Metric title="负责人" value={group.owner} />
          <Metric title="问题数" value={`${group.issueIds.length}`} />
          <Metric title="模板数" value={`${group.sourceTemplates.length}`} />
        </section>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <CardTitle>业务原因追溯</CardTitle>
                <CardDescription>
                  展示定位该组问题所需的来源模板、业务追溯键和影响对象。
                </CardDescription>
              </div>
              <Badge variant={group.risk === "high" ? "destructive" : "secondary"}>
                {dataQualityGroupRiskLabel(group.risk)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-2">
            <TagBlock title="来源模板" values={group.sourceTemplates} />
            <TagBlock title="追溯键" values={group.traceKeys} />
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
              <CardTitle>关联质量问题</CardTitle>
              <CardDescription>
              可进入单个问题查看字段、原值和建议处理。
              </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 lg:grid-cols-2">
            {issues.map((issue) => (
              <div key={issue.id} className="rounded-lg border p-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{issue.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {issue.id} / {dataQualitySourceLabels[issue.source]}
                    </div>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/data-quality/${issue.id}`}>问题详情</Link>
                  </Button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="secondary">{dataQualitySeverityLabel(issue.severity)}</Badge>
                  <Badge variant="outline">{dataQualityStatusLabel(issue.status)}</Badge>
                  <Badge variant="outline">阻断 {issue.blockedRows} 行</Badge>
                </div>
                <div className="mt-3 grid gap-2 text-xs text-muted-foreground">
                  <span>{issue.sourceTemplateName} / {issue.sourceField}</span>
                  <span>
                    影响对象：{issue.affectedObjects.map((object) => object.label).join("、")}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>建议复核</CardTitle>
            <CardDescription>用于现场主管和数据管理员协同判断处理优先级。</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{group.recommendedReview}</p>
          </CardContent>
        </Card>
      </main>
    </AppShell>
  )
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="break-words text-2xl font-semibold tabular-nums">
          {value}
        </CardTitle>
      </CardHeader>
    </Card>
  )
}

function TagBlock({ title, values }: { title: string; values: string[] }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="text-xs text-muted-foreground">{title}</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {values.map((value) => (
          <Badge key={value} variant="secondary">
            {value}
          </Badge>
        ))}
      </div>
    </div>
  )
}
