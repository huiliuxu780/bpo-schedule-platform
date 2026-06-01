import Link from "next/link"
import type { ReactNode } from "react"
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CircleSlash,
  ClipboardList,
  ExternalLink,
} from "lucide-react"

import {
  type ImportApplyReadinessResponse,
  type ImportBatchListRow,
  type ImportBatchPersistenceDetail,
  type ImportComparisonRunRecord,
  type ImportDownstreamResultDrilldown,
  type ImportQualityImpactAggregation,
  type ImportResultTrace,
  type ImportReviewCaseRecord,
  buildImportApiUrl,
  summarizeImportDownstreamResultDrilldown,
  summarizeImportQualityImpactAggregation,
  summarizeImportResultTrace,
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

type ImportCenterResultTracePanelProps = {
  batch: ImportBatchListRow | null
  readiness: ImportApplyReadinessResponse | null
  detail: ImportBatchPersistenceDetail | null
  businessDate: string | null
  comparisonRuns: ImportComparisonRunRecord[]
  comparisonError: string | null
  reviewCases: ImportReviewCaseRecord[]
  reviewError: string | null
}

export function ImportCenterResultTracePanel({
  batch,
  readiness,
  detail,
  businessDate,
  comparisonRuns,
  comparisonError,
  reviewCases,
  reviewError,
}: ImportCenterResultTracePanelProps) {
  const trace = summarizeImportResultTrace({
    businessDate,
    comparisonRuns,
    reviewCases,
    comparisonError,
    reviewError,
  })
  const drilldown = summarizeImportDownstreamResultDrilldown({
    batch,
    readiness,
    businessDate,
    comparisonRuns,
    reviewCases,
    comparisonError,
    reviewError,
  })
  const qualityImpact = summarizeImportQualityImpactAggregation({
    detail,
    comparisonRuns,
    reviewCases,
    comparisonError,
    reviewError,
  })

  return (
    <Card id="import-result-trace" className="scroll-mt-16 overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle className="text-base">结果追踪</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            {businessDate
              ? `按业务日 ${businessDate} 读取已有对比结果和复核案例`
              : "等待选中批次业务日"}
          </p>
        </div>
        <Badge variant={drilldown.tone === "blocked" ? "destructive" : "outline"}>
          {formatDrilldownTone(drilldown.tone)}
        </Badge>
      </CardHeader>
      <CardContent className="grid gap-4">
        <ResultDrilldownSummary drilldown={drilldown} />
        <QualityImpactAggregationPanel aggregation={qualityImpact} />
        <ResultTraceSummary trace={trace} />

        <section className="grid gap-4 xl:grid-cols-2">
          <ComparisonRunsTable runs={comparisonRuns} error={comparisonError} />
          <ReviewCasesTable cases={reviewCases} error={reviewError} />
        </section>
      </CardContent>
    </Card>
  )
}

function QualityImpactAggregationPanel({
  aggregation,
}: {
  aggregation: ImportQualityImpactAggregation
}) {
  return (
    <section className="grid gap-4 rounded-md border bg-muted/30 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="grid min-w-0 gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <AlertTriangle className="size-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">质量影响聚合</h3>
            <Badge
              variant={aggregation.tone === "blocked" ? "destructive" : "outline"}
            >
              {formatQualityImpactTone(aggregation.tone)}
            </Badge>
          </div>
          <div>
            <div className="font-medium">{aggregation.title}</div>
            <p className="mt-1 text-sm text-muted-foreground">{aggregation.detail}</p>
          </div>
        </div>
        <div className="grid gap-2 text-sm">
          <TraceMetric
            icon={<ClipboardList className="size-4" />}
            value={aggregation.downstreamLabel}
          />
          <TraceMetric
            icon={<AlertTriangle className="size-4" />}
            value={`首要问题：${aggregation.topIssueLabel}`}
          />
        </div>
      </div>

      {aggregation.groups.length === 0 ? (
        <PanelState title={aggregation.title} detail={aggregation.nextAction} />
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[220px]">质量问题</TableHead>
                <TableHead>行数</TableHead>
                <TableHead className="min-w-[180px]">下游影响候选</TableHead>
                <TableHead className="min-w-[220px]">证据</TableHead>
                <TableHead className="min-w-[240px]">下一步</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aggregation.groups.map((group) => (
                <TableRow key={group.key}>
                  <TableCell>
                    <div className="grid gap-1">
                      <span className="font-mono text-xs">{group.title}</span>
                      <span className="text-xs text-muted-foreground">
                        失败 {group.failedRows} 行 · 警告 {group.warningRows} 行
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{group.rowCount}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {group.impactLabel}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {group.evidence.map((item) => (
                        <Badge key={item} variant="outline">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {group.nextAction}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">{aggregation.nextAction}</p>
        <Button asChild size="sm" variant="outline">
          <Link href="#import-row-correction">
            查看失败行修正
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </div>
    </section>
  )
}

function ResultDrilldownSummary({
  drilldown,
}: {
  drilldown: ImportDownstreamResultDrilldown
}) {
  return (
    <section className="grid gap-4 rounded-md border bg-muted/30 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="grid min-w-0 gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <CheckCircle2 className="size-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">下游结果判断</h3>
            <Badge
              variant={drilldown.tone === "blocked" ? "destructive" : "secondary"}
            >
              {formatDrilldownTone(drilldown.tone)}
            </Badge>
          </div>
          <div>
            <div className="font-medium">{drilldown.title}</div>
            <p className="mt-1 text-sm text-muted-foreground">{drilldown.detail}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href={drilldown.primaryHref}>
              {drilldown.primaryActionLabel}
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href={drilldown.secondaryHref}>
              {drilldown.secondaryActionLabel}
              <ExternalLink data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <TraceFocus
          icon={<Activity className="size-4" />}
          label="优先对比线索"
          value={drilldown.comparisonFocus}
        />
        <TraceFocus
          icon={<ClipboardList className="size-4" />}
          label="优先复核线索"
          value={drilldown.reviewFocus}
        />
      </div>

      <div className="grid gap-2">
        <div className="text-xs font-medium text-muted-foreground">判断证据</div>
        <div className="flex flex-wrap gap-2">
          {drilldown.evidence.map((item) => (
            <Badge key={item} variant="outline">
              {item}
            </Badge>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{drilldown.nextAction}</p>
    </section>
  )
}

function ResultTraceSummary({ trace }: { trace: ImportResultTrace }) {
  return (
    <section className="grid gap-3 rounded-md border bg-muted/30 p-3 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="font-medium">{trace.title}</div>
          <p className="mt-1 text-muted-foreground">{trace.nextAction}</p>
        </div>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <TraceMetric icon={<Activity className="size-4" />} value={trace.comparisonSummary} />
        <TraceMetric
          icon={<ClipboardList className="size-4" />}
          value={trace.reviewSummary}
        />
      </div>
    </section>
  )
}

function ComparisonRunsTable({
  runs,
  error,
}: {
  runs: ImportComparisonRunRecord[]
  error: string | null
}) {
  return (
    <section className="grid min-w-0 gap-2">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Activity className="size-4 text-muted-foreground" />
        对比结果
      </div>
      {error ? (
        <PanelState title="对比结果读取失败" detail={error} />
      ) : runs.length === 0 ? (
        <PanelState title="暂无对比结果" detail="当前业务日还没有可展示的对比计算记录。" />
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[180px]">运行</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">结果</TableHead>
                <TableHead className="min-w-[180px]">来源版本</TableHead>
                <TableHead className="w-20 text-right">详情</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {runs.map((run) => (
                <TableRow key={run.run_id}>
                  <TableCell>
                    <div className="grid gap-1">
                      <span className="font-mono text-xs">{run.run_id}</span>
                      <span className="text-xs text-muted-foreground">
                        {run.business_date_from} 至 {run.business_date_to}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{formatComparisonType(run.comparison_type)}</TableCell>
                  <TableCell>
                    <Badge variant={run.status === "failed" ? "destructive" : "secondary"}>
                      {formatComparisonStatus(run.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs">
                    {run.total_results.toLocaleString("zh-CN")}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {formatComparisonVersions(run)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="icon-sm" variant="ghost" aria-label="查看对比详情">
                      <Link
                        href={buildImportApiUrl(
                          `/api/v1/comparison-runs/${encodeURIComponent(run.run_id)}`
                        )}
                      >
                        <ExternalLink className="size-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  )
}

function ReviewCasesTable({
  cases,
  error,
}: {
  cases: ImportReviewCaseRecord[]
  error: string | null
}) {
  return (
    <section className="grid min-w-0 gap-2">
      <div className="flex items-center gap-2 text-sm font-medium">
        <ClipboardList className="size-4 text-muted-foreground" />
        复核案例
      </div>
      {error ? (
        <PanelState title="复核案例读取失败" detail={error} />
      ) : cases.length === 0 ? (
        <PanelState title="暂无复核案例" detail="当前业务日还没有可展示的异常复核案例。" />
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[160px]">案例</TableHead>
                <TableHead>级别</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead className="min-w-[150px]">来源</TableHead>
                <TableHead className="w-20 text-right">详情</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.map((reviewCase) => (
                <TableRow key={reviewCase.case_id}>
                  <TableCell>
                    <div className="grid gap-1">
                      <span className="font-mono text-xs">{reviewCase.case_id}</span>
                      <span className="text-xs text-muted-foreground">
                        {reviewCase.business_date}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{reviewCase.severity}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={reviewCase.status === "closed" ? "secondary" : "outline"}
                    >
                      {formatReviewStatus(reviewCase.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{reviewCase.owner_id}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {formatReviewSource(reviewCase)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="icon-sm" variant="ghost" aria-label="查看复核详情">
                      <Link
                        href={buildImportApiUrl(
                          `/api/v1/review-cases/${encodeURIComponent(reviewCase.case_id)}`
                        )}
                      >
                        <ExternalLink className="size-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  )
}

function TraceFocus({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-md border bg-background/70 p-3">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="mt-1 truncate text-sm font-medium">{value}</div>
      </div>
    </div>
  )
}

function TraceMetric({ icon, value }: { icon: ReactNode; value: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-md border bg-background/70 p-2">
      <span className="text-muted-foreground">{icon}</span>
      <span className="truncate text-xs font-medium">{value}</span>
    </div>
  )
}

function PanelState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="grid min-h-40 place-items-center rounded-md border border-dashed p-4 text-center">
      <div className="grid max-w-sm gap-2">
        <CircleSlash className="mx-auto size-5 text-muted-foreground" />
        <div className="text-sm font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">{detail}</div>
      </div>
    </div>
  )
}

function formatDrilldownTone(
  tone: ImportDownstreamResultDrilldown["tone"]
): string {
  if (tone === "ready") {
    return "可追踪"
  }

  if (tone === "blocked") {
    return "需处理"
  }

  return "等待结果"
}

function formatQualityImpactTone(
  tone: ImportQualityImpactAggregation["tone"]
): string {
  if (tone === "blocked") {
    return "影响候选"
  }

  if (tone === "warning") {
    return "需复核"
  }

  if (tone === "ready") {
    return "无质量问题"
  }

  return "等待明细"
}

function formatComparisonType(
  type: ImportComparisonRunRecord["comparison_type"]
): string {
  if (type === "forecast_vs_schedule") {
    return "预测 vs 排班"
  }

  return "排班 vs 实际"
}

function formatComparisonStatus(status: ImportComparisonRunRecord["status"]): string {
  if (status === "completed") {
    return "完成"
  }

  return "失败"
}

function formatComparisonVersions(run: ImportComparisonRunRecord): string {
  if (run.comparison_type === "forecast_vs_schedule") {
    return `${run.forecast_version_id ?? "-"} / ${run.schedule_version_id ?? "-"}`
  }

  return `${run.schedule_version_id ?? "-"} / ${run.actual_import_version_id ?? "-"}`
}

function formatReviewStatus(status: string): string {
  if (status === "closed") {
    return "已关闭"
  }

  if (status === "open") {
    return "未关闭"
  }

  return status
}

function formatReviewSource(reviewCase: ImportReviewCaseRecord): string {
  const source =
    reviewCase.source_result_type === "forecast_schedule"
      ? "预测排班"
      : "排班实际"

  return `${source} #${reviewCase.source_result_id}`
}
