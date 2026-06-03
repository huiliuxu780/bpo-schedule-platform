import Link from "next/link"
import { Activity, ArrowLeft, ExternalLink, GitBranch, ShieldAlert, Table2 } from "lucide-react"

import {
  type ImportBatchListRow,
  type ImportComparisonRunDetailResponse,
  type ImportReviewCaseRecord,
  summarizeImportComparisonRunDetail,
  summarizeImportComparisonRunReturnLinks,
  summarizeImportComparisonRunReviewCases,
} from "@/components/import-center-model"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type ImportCenterComparisonRunDetailWorkspaceProps = {
  runId: string
  detail: ImportComparisonRunDetailResponse | null
  error: string | null
  reviewCases: ImportReviewCaseRecord[]
  reviewError: string | null
  batches: ImportBatchListRow[]
  batchError: string | null
}

export function ImportCenterComparisonRunDetailWorkspace({
  runId,
  detail,
  error,
  reviewCases,
  reviewError,
  batches,
  batchError,
}: ImportCenterComparisonRunDetailWorkspaceProps) {
  const summary = summarizeImportComparisonRunDetail({ detail, error })
  const returnLinks = summarizeImportComparisonRunReturnLinks({
    detail,
    error,
    batches,
    batchError,
  })
  const relatedReviewCases = summarizeImportComparisonRunReviewCases({
    detail,
    reviewCases,
    reviewError,
  })

  return (
    <main className="grid flex-1 auto-rows-max gap-4 overflow-x-hidden overflow-y-auto px-4 py-4 lg:px-6">
      <section className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="grid gap-2">
          <Button asChild size="sm" variant="ghost" className="w-fit px-0">
            <Link href="/data-quality/review-cases">
              <ArrowLeft data-icon="inline-start" />
              返回复核案例
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-semibold tracking-normal">对比运行详情</h1>
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
              {summary.title}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={summary.tone === "blocked" ? "destructive" : "outline"}>
            {summary.tone === "blocked" ? "需处理" : "只读"}
          </Badge>
          <Badge variant="secondary">{runId}</Badge>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {summary.metricCards.map((card) => (
          <MetricCard
            key={card.label}
            label={card.label}
            value={card.value}
            detail={card.detail}
          />
        ))}
      </section>

      <section className="grid gap-4">
        <Card>
          <CardHeader className="gap-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="grid gap-1">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Activity className="size-4 text-muted-foreground" />
                  {summary.resultReviewContext.title}
                </CardTitle>
                <p className="max-w-3xl text-sm text-muted-foreground">
                  {summary.resultReviewContext.detail}
                </p>
              </div>
              <Badge variant="secondary" className="w-fit">
                {summary.resultReviewContext.scopeLabel}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm md:grid-cols-3">
            <div className="grid gap-1">
              <span className="text-muted-foreground">来源版本</span>
              <span className="font-medium">
                {summary.resultReviewContext.sourceVersionLabel}
              </span>
            </div>
            <div className="grid gap-1">
              <span className="text-muted-foreground">业务日</span>
              <span className="font-medium">
                {summary.resultReviewContext.businessDateLabel}
              </span>
            </div>
            <div className="grid gap-1">
              <span className="text-muted-foreground">下一步</span>
              <span className="font-medium">
                {summary.resultReviewContext.nextAction}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="gap-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="grid gap-1">
                <CardTitle className="flex items-center gap-2 text-base">
                  <GitBranch className="size-4 text-muted-foreground" />
                  {returnLinks.title}
                </CardTitle>
                <p className="max-w-3xl text-sm text-muted-foreground">
                  {returnLinks.detail}
                </p>
              </div>
              <Badge
                variant={returnLinks.tone === "blocked" ? "destructive" : "outline"}
                className="w-fit"
              >
                {returnLinks.sourceBatchLabel}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-1 text-sm">
                <span className="text-muted-foreground">来源批次</span>
                <span className="font-medium">{returnLinks.sourceBatchLabel}</span>
              </div>
              <div className="grid gap-1 text-sm">
                <span className="text-muted-foreground">版本台账</span>
                <span className="font-medium">{returnLinks.versionWorkbenchLabel}</span>
              </div>
            </div>
            {returnLinks.evidence.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {returnLinks.evidence.map((item) => (
                  <Badge key={item} variant="secondary">
                    {item}
                  </Badge>
                ))}
              </div>
            ) : null}
            <div className="flex flex-wrap gap-2">
              {returnLinks.primaryHref ? (
                <Button asChild size="sm" variant="outline">
                  <Link href={returnLinks.primaryHref}>
                    {returnLinks.primaryActionLabel}
                    <ExternalLink data-icon="inline-end" />
                  </Link>
                </Button>
              ) : (
                <Badge variant="destructive" className="h-9 px-3">
                  {returnLinks.primaryActionLabel}
                </Badge>
              )}
              {returnLinks.secondaryHref ? (
                <Button asChild size="sm" variant="outline">
                  <Link href={returnLinks.secondaryHref}>
                    {returnLinks.secondaryActionLabel}
                    <ExternalLink data-icon="inline-end" />
                  </Link>
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="gap-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="grid gap-1">
                <CardTitle className="flex items-center gap-2 text-base">
                  <GitBranch className="size-4 text-muted-foreground" />
                  运行来源
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {summary.versionLabel}
                </p>
              </div>
              <Button asChild size="sm" variant="outline" className="w-fit">
                <Link href={summary.apiHref}>
                  查看运行 API
                  <ExternalLink data-icon="inline-end" />
                </Link>
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Table2 className="size-4 text-muted-foreground" />
              结果明细
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              只展示该运行已返回的计算结果，不在本页触发计算或写入。
            </p>
          </CardHeader>
          <CardContent className="p-0">
            {summary.resultRows.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">
                当前运行还没有可展示的结果。
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px]">来源</TableHead>
                    <TableHead className="min-w-[280px]">维度</TableHead>
                    <TableHead className="min-w-[240px]">指标</TableHead>
                    <TableHead className="min-w-[96px]">状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary.resultRows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.source}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {row.dimension}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {row.metric}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{row.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="grid gap-1">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShieldAlert className="size-4 text-muted-foreground" />
                  关联复核案例
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {relatedReviewCases.detail}
                </p>
              </div>
              <Badge
                variant={
                  relatedReviewCases.tone === "blocked"
                    ? "destructive"
                    : "outline"
                }
              >
                {relatedReviewCases.title}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {relatedReviewCases.cases.length === 0 ? (
              <div className="grid gap-2 p-4 text-sm text-muted-foreground">
                <p>{relatedReviewCases.nextAction}</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[160px]">复核案例</TableHead>
                    <TableHead className="min-w-[140px]">来源结果</TableHead>
                    <TableHead className="min-w-[140px]">责任人</TableHead>
                    <TableHead className="min-w-[96px]">风险</TableHead>
                    <TableHead className="min-w-[96px]">状态</TableHead>
                    <TableHead className="min-w-[96px] text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {relatedReviewCases.cases.map((reviewCase) => (
                    <TableRow key={reviewCase.caseId}>
                      <TableCell className="font-medium">
                        {reviewCase.caseId}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {reviewCase.resultLabel}
                      </TableCell>
                      <TableCell>{reviewCase.ownerLabel}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{reviewCase.severityLabel}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{reviewCase.statusLabel}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild size="sm" variant="outline">
                          <Link href={reviewCase.href}>
                            查看详情
                            <ExternalLink data-icon="inline-end" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="size-4 text-muted-foreground" />
              处理边界
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm text-muted-foreground">
            <p>本页只读展示，不触发重新计算、发布、审批、导出或批量处理。</p>
            <p>
              从复核案例进入时，只用于追踪来源运行和结果，不改变任何复核状态。
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}

function MetricCard({
  label,
  value,
  detail,
}: {
  label: string
  value: string
  detail: string
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="truncate text-sm font-semibold tracking-normal">{value}</div>
        <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  )
}
