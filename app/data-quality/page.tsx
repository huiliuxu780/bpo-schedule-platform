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
  summarizeDataQualityExceptionCauses,
  summarizeDataQualityPersonViewOrder,
  summarizeDataQualityExceptionTop,
  summarizeDataQualityIssues,
} from "@/lib/data-quality"
import {
  fallbackDataQualityGroups,
  getUngroupedDataQualityIssueIds,
  summarizeDataQualityGroups,
} from "@/lib/data-quality-groups"

export default function DataQualityPage() {
  const rows = fallbackDataQualityIssues
  const summary = summarizeDataQualityIssues(rows)
  const exceptionTopSummary = summarizeDataQualityExceptionTop(rows)
  const exceptionCauseSummary = summarizeDataQualityExceptionCauses(rows)
  const personViewOrderSummary = summarizeDataQualityPersonViewOrder(rows)
  const groupSummary = summarizeDataQualityGroups(fallbackDataQualityGroups)
  const ungroupedIssueIds = getUngroupedDataQualityIssueIds(rows.map((row) => row.id))
  const openRows = rows.filter((row) => row.status === "open")

  return (
    <AppShell title="数据质量" searchPlaceholder="搜索错误码、字段或来源">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <h1 className="text-lg font-semibold">数据质量</h1>
            <p className="text-sm text-muted-foreground">
              集中查看导入、主数据、排班、预测、登录和状态日志的数据问题。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/data-quality/groups">查看质量分组</Link>
            </Button>
            <Badge variant="outline">质量监控</Badge>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <Metric title="问题总数" value={`${summary.total}`} description="当前范围" />
          <Metric title="未解决" value={`${summary.open}`} description="需要复核" />
          <Metric title="高严重度" value={`${summary.highSeverity}`} description="阻断风险" />
          <Metric title="阻断行数" value={`${summary.blockedRows}`} description="样例行数" />
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>来源分布</CardTitle>
              <CardDescription>对应导入规则和异常识别的数据源。</CardDescription>
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
              <CardTitle>分组覆盖</CardTitle>
              <CardDescription>
                质量问题按业务原因分组，便于从字段问题回到主数据、排班和实际日志。
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="grid grid-cols-3 gap-3">
                <Detail label="分组" value={`${groupSummary.totalGroups}`} />
                <Detail label="已覆盖" value={`${groupSummary.groupedIssueCount}`} />
                <Detail label="未分组" value={`${ungroupedIssueIds.length}`} />
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href="/data-quality/groups">查看分组覆盖</Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle>影响异常 Top</CardTitle>
                <CardDescription>
                  按影响异常、人员和阻断行聚合，帮助主管优先查看高影响数据问题。
                </CardDescription>
              </div>
              <Badge variant="secondary">
                {exceptionTopSummary.totalImpactedExceptionCount} 项异常
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-3 gap-3">
              <Detail label="影响问题" value={`${exceptionTopSummary.totalIssueCount}`} />
              <Detail label="影响异常" value={`${exceptionTopSummary.totalImpactedExceptionCount}`} />
              <Detail label="影响人员" value={`${exceptionTopSummary.totalImpactedPeopleCount}`} />
            </div>

            {exceptionTopSummary.items.length > 0 ? (
              <div className="grid gap-3 lg:grid-cols-2">
                {exceptionTopSummary.items.slice(0, 4).map((item) => (
                  <div key={item.issueId} className="rounded-lg border p-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">
                          {item.issueId} / {item.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {dataQualitySeverityLabel(item.severity)} / {dataQualityStatusLabel(item.status)} / {item.owner}
                        </div>
                      </div>
                      <Button asChild size="sm" variant="outline">
                        <Link href={item.href}>查看问题</Link>
                      </Button>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                      <Detail label="异常" value={`${item.impactedExceptionCount}`} />
                      <Detail label="人员" value={`${item.impactedPeople.length}`} />
                      <Detail label="阻断行" value={`${item.blockedRows}`} />
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground">
                      影响对象：{item.affectedObjects.join(" / ")}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      下一查看：{item.nextViewHint}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                当前数据质量问题没有匹配到履约异常影响。
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {exceptionTopSummary.deferredActions.map((action) => (
                <Badge key={action} variant="outline">
                  {action}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle>人员履约查看顺序</CardTitle>
                <CardDescription>
                  按受影响人员聚合原因和异常，帮助主管先进入个人履约核对。
                </CardDescription>
              </div>
              <Badge variant="secondary">
                {personViewOrderSummary.totalPersonCount} 人
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-3 gap-3">
              <Detail label="影响人员" value={`${personViewOrderSummary.totalPersonCount}`} />
              <Detail label="影响异常" value={`${personViewOrderSummary.totalImpactedExceptionCount}`} />
              <Detail label="首要人员" value={personViewOrderSummary.topPerson?.employeeId ?? "无"} />
            </div>

            {personViewOrderSummary.items.length > 0 ? (
              <div className="grid gap-3 lg:grid-cols-2">
                {personViewOrderSummary.items.slice(0, 4).map((item) => (
                  <div key={item.employeeId} className="rounded-lg border p-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">
                          {item.employeeId} / {item.representativeCause}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.representativeIssueId} / {item.representativeIssueTitle}
                        </div>
                      </div>
                      <Button asChild size="sm" variant="outline">
                        <Link href={item.href}>查看个人履约</Link>
                      </Button>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                      <Detail label="原因" value={`${item.causeCount}`} />
                      <Detail label="异常" value={`${item.impactedExceptionCount}`} />
                      <Detail label="阻断行" value={`${item.blockedRows}`} />
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground">
                      下一查看：{item.nextViewHint}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                当前数据质量问题没有匹配到需要进入个人履约的人员。
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {personViewOrderSummary.deferredActions.map((action) => (
                <Badge key={action} variant="outline">
                  {action}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle>异常影响原因汇总</CardTitle>
                <CardDescription>
                  按错误码、字段和来源聚合，先看影响异常最多的数据质量原因。
                </CardDescription>
              </div>
              <Badge variant="secondary">
                {exceptionCauseSummary.totalCauseCount} 类原因
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-3 gap-3">
              <Detail label="原因类型" value={`${exceptionCauseSummary.totalCauseCount}`} />
              <Detail label="影响异常" value={`${exceptionCauseSummary.totalImpactedExceptionCount}`} />
              <Detail label="影响人员" value={`${exceptionCauseSummary.totalImpactedPeopleCount}`} />
            </div>

            {exceptionCauseSummary.items.length > 0 ? (
              <div className="grid gap-3 lg:grid-cols-2">
                {exceptionCauseSummary.items.slice(0, 4).map((item) => (
                  <div key={item.key} className="rounded-lg border p-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">
                          {item.errorCode}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {dataQualitySourceLabels[item.source]} / {item.sourceField}
                        </div>
                      </div>
                      <Button asChild size="sm" variant="outline">
                        <Link href={item.href}>查看代表问题</Link>
                      </Button>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                      <Detail label="异常" value={`${item.impactedExceptionCount}`} />
                      <Detail label="人员" value={`${item.impactedPeople.length}`} />
                      <Detail label="阻断行" value={`${item.blockedRows}`} />
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground">
                      代表问题：{item.representativeIssueId} / {item.representativeIssueTitle}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      下一查看：{item.nextViewHint}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                当前数据质量问题没有匹配到履约异常影响原因。
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {exceptionCauseSummary.deferredActions.map((action) => (
                <Badge key={action} variant="outline">
                  {action}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

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

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium tabular-nums">{value}</div>
    </div>
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
