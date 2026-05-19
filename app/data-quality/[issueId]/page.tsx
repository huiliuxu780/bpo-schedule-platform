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
  fallbackDataQualityIssues,
  getDataQualityIssue,
} from "@/lib/data-quality"
import {
  dataQualityGroupRiskLabel,
  getDataQualityGroupsForIssue,
} from "@/lib/data-quality-groups"

type PageProps = {
  params: Promise<{
    issueId: string
  }>
}

export function generateStaticParams() {
  return fallbackDataQualityIssues.map((row) => ({
    issueId: row.id,
  }))
}

export default async function DataQualityIssuePage({ params }: PageProps) {
  const { issueId } = await params
  const issue = getDataQualityIssue(decodeURIComponent(issueId))

  if (!issue) {
    notFound()
  }

  const groups = getDataQualityGroupsForIssue(issue.id)

  return (
    <AppShell title="数据质量详情" searchPlaceholder="搜索错误码、字段或来源">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <h1 className="text-lg font-semibold">数据质量详情</h1>
            <p className="text-sm text-muted-foreground">
              {issue.id} / {issue.code} / {dataQualitySourceLabels[issue.source]}
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/data-quality">返回数据质量</Link>
          </Button>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <Metric title="严重度" value={dataQualitySeverityLabel(issue.severity)} />
          <Metric title="状态" value={dataQualityStatusLabel(issue.status)} />
          <Metric title="阻断行" value={`${issue.blockedRows}`} />
          <Metric title="负责人" value={issue.owner} />
        </section>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <CardTitle>{issue.title}</CardTitle>
                <CardDescription>
                  定位字段、原值、建议处理和影响范围。
                </CardDescription>
              </div>
              <Badge variant="outline">{issue.code}</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 lg:grid-cols-2">
            <Detail label="来源对象" value={`${issue.source} / ${issue.entity}`} />
            <Detail label="字段" value={issue.fieldName} />
            <Detail label="原值" value={issue.rawValue || "空值"} />
            <Detail label="发现时间" value={issue.detectedAt} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>建议处理</CardTitle>
            <CardDescription>用于运营复核和数据修正排期。</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{issue.recommendation}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>所属质量分组</CardTitle>
            <CardDescription>
              从单个问题回到业务原因分组，查看同类问题和来源模板。
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 lg:grid-cols-2">
            {groups.map((group) => (
              <div key={group.id} className="rounded-lg border p-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{group.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {group.owner} / {group.issueIds.length} 个问题
                    </div>
                  </div>
                  <Badge variant={group.risk === "high" ? "destructive" : "secondary"}>
                    {dataQualityGroupRiskLabel(group.risk)}
                  </Badge>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {group.recommendedReview}
                </p>
                <div className="mt-3 flex justify-end">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/data-quality/groups/${group.id}`}>查看分组</Link>
                  </Button>
                </div>
              </div>
            ))}
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

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 break-words text-sm font-medium">{value}</div>
    </div>
  )
}
