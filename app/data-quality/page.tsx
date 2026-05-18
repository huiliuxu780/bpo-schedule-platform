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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  dataQualitySeverityLabel,
  dataQualitySourceLabels,
  dataQualityStatusLabel,
  fallbackDataQualityIssues,
  summarizeDataQualityIssues,
} from "@/lib/data-quality"

export default function DataQualityPage() {
  const rows = fallbackDataQualityIssues
  const summary = summarizeDataQualityIssues(rows)
  const openRows = rows.filter((row) => row.status === "open")

  return (
    <AppShell title="数据质量" searchPlaceholder="搜索错误码、字段或来源">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <h1 className="text-lg font-semibold">数据质量</h1>
            <p className="text-sm text-muted-foreground">
              本地只读中心，用于查看生产雏形导入、主数据、排班、预测、登录和状态日志的数据问题。
            </p>
          </div>
          <Badge variant="outline">只读演示</Badge>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <Metric title="问题总数" value={`${summary.total}`} description="本地样例" />
          <Metric title="未解决" value={`${summary.open}`} description="需要复核" />
          <Metric title="高严重度" value={`${summary.highSeverity}`} description="阻断风险" />
          <Metric title="阻断行数" value={`${summary.blockedRows}`} description="样例行数" />
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>来源分布</CardTitle>
              <CardDescription>对应生产雏形导入合同和异常识别的数据源。</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {Object.entries(summary.sourceCounts).map(([source, count]) => (
                <div
                  key={source}
                  className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg border p-3"
                >
                  <div>
                    <div className="text-sm font-medium">
                      {dataQualitySourceLabels[source as keyof typeof dataQualitySourceLabels]}
                    </div>
                    <div className="text-xs text-muted-foreground">{source}</div>
                  </div>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>暂不实现动作</CardTitle>
              <CardDescription>
                本批只提供查看和定位，不产生真实修复、审批、权限或批量能力。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {summary.deferredActions.map((item) => (
                  <Badge key={item} variant="outline">
                    {item}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <CardTitle>未解决问题</CardTitle>
                <CardDescription>优先定位阻断导入和履约对比的数据质量问题。</CardDescription>
              </div>
              <Badge variant="secondary">{openRows.length} 条</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 lg:grid-cols-2">
            {openRows.map((row) => (
              <div key={row.id} className="rounded-lg border p-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{row.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {row.id} / {row.code}
                    </div>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/data-quality/${row.id}`}>详情</Link>
                  </Button>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {row.recommendation}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>数据质量清单</CardTitle>
            <CardDescription>覆盖第一阶段导入合同和异常识别所需的质量问题。</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>问题</TableHead>
                  <TableHead>来源</TableHead>
                  <TableHead>字段</TableHead>
                  <TableHead>严重度</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>阻断行</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <div className="flex min-w-48 flex-col gap-1">
                        <span className="font-medium">{row.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {row.id} / {row.code}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{dataQualitySourceLabels[row.source]}</TableCell>
                    <TableCell>
                      {row.entity}.{row.fieldName}
                    </TableCell>
                    <TableCell>{dataQualitySeverityLabel(row.severity)}</TableCell>
                    <TableCell>{dataQualityStatusLabel(row.status)}</TableCell>
                    <TableCell>{row.blockedRows}</TableCell>
                    <TableCell>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/data-quality/${row.id}`}>详情</Link>
                      </Button>
                    </TableCell>
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
