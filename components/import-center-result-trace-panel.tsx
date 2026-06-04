"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { useSearchParams } from "next/navigation"
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CircleSlash,
  ClipboardCheck,
  ClipboardList,
  ExternalLink,
} from "lucide-react"

import { triggerLocalComparisonRunAction } from "@/app/data-quality/actions"
import {
  type ImportApplyReadinessResponse,
  type ImportAppliedVersionResultContext,
  type ImportBatchListRow,
  type ImportBatchPersistenceDetail,
  type ImportComparisonRunRecord,
  type ImportDownstreamResultDrilldown,
  type ImportQualityImpactAggregation,
  type ImportReviewConclusionPreview,
  type ImportReviewEvidenceGapDrilldown,
  type ImportResultTrace,
  type ImportReviewCaseRecord,
  type ImportVersionComparisonTrigger,
  buildImportComparisonRunDetailWorkspaceHref,
  buildImportReviewCaseDetailWorkspaceHref,
  buildImportReviewCasesWorkspaceHref,
  summarizeImportAppliedVersionResultContext,
  summarizeImportLatestComparisonRunCallback,
  summarizeImportVersionComparisonTrigger,
  summarizeImportVersionComparisonTriggerNotice,
  summarizeImportDownstreamResultDrilldown,
  summarizeImportQualityImpactAggregation,
  summarizeImportReviewConclusionPreview,
  summarizeImportReviewEvidenceGapDrilldown,
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
    businessDate,
  })
  const conclusionPreview = summarizeImportReviewConclusionPreview({
    businessDate,
    comparisonRuns,
    reviewCases,
    qualityImpact,
    comparisonError,
    reviewError,
  })
  const evidenceGap = summarizeImportReviewEvidenceGapDrilldown({
    businessDate,
    comparisonRuns,
    reviewCases,
    qualityImpact,
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
        <AppliedVersionResultContextSection
          batch={batch}
          readiness={readiness}
          comparisonRuns={comparisonRuns}
          reviewCases={reviewCases}
        />
        <ResultDrilldownSummary drilldown={drilldown} />
        <QualityImpactAggregationPanel aggregation={qualityImpact} />
        <ReviewEvidenceGapPanel businessDate={businessDate} drilldown={evidenceGap} />
        <ReviewConclusionPreviewPanel
          businessDate={businessDate}
          preview={conclusionPreview}
        />
        <ResultTraceSummary trace={trace} />

        <section className="grid gap-4 xl:grid-cols-2">
          <ComparisonRunsTable runs={comparisonRuns} error={comparisonError} />
          <ReviewCasesTable cases={reviewCases} error={reviewError} />
        </section>
      </CardContent>
    </Card>
  )
}

function AppliedVersionResultContextSection({
  batch,
  readiness,
  comparisonRuns,
  reviewCases,
}: {
  batch: ImportBatchListRow | null
  readiness: ImportApplyReadinessResponse | null
  comparisonRuns: ImportComparisonRunRecord[]
  reviewCases: ImportReviewCaseRecord[]
}) {
  const searchParams = useSearchParams()

  if (!batch) {
    return null
  }

  const context = summarizeImportAppliedVersionResultContext({
    batch,
    readiness,
    comparisonRuns,
    reviewCases,
  })

  if (!context) {
    return null
  }
  const comparisonAction = summarizeImportVersionComparisonTrigger({
    batch,
    readiness,
    comparisonRuns,
  })
  const comparisonNotice = summarizeImportVersionComparisonTriggerNotice({
    status: searchParams.get("compare"),
    runId: searchParams.get("compareRun"),
    reason: searchParams.get("compareReason"),
  })
  const latestComparisonRunCallback = summarizeImportLatestComparisonRunCallback({
    status: searchParams.get("compare"),
    runId: searchParams.get("compareRun"),
    reason: searchParams.get("compareReason"),
    comparisonRuns,
  })

  return (
    <section className="grid gap-4 rounded-md border bg-muted/30 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="grid min-w-0 gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Activity className="size-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">版本结果定位</h3>
            <Badge
              variant={context.tone === "blocked" ? "destructive" : "outline"}
            >
              {formatAppliedVersionContextTone(context.tone)}
            </Badge>
          </div>
          <div>
            <div className="font-medium">{context.title}</div>
            <p className="mt-1 text-sm text-muted-foreground">{context.detail}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href={context.primaryHref}>
              {context.primaryActionLabel}
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href={context.secondaryHref}>
              {context.secondaryActionLabel}
              <ExternalLink data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-4">
        <ContextMetric label="来源批次" value={context.sourceBatchLabel} />
        <ContextMetric label="应用目标" value={context.targetLabel} />
        <ContextMetric label="当前版本" value={context.versionLabel} />
        <ContextMetric label="下游状态" value={context.downstreamStatusLabel} />
      </div>

      <div className="grid gap-2">
        <div className="text-xs font-medium text-muted-foreground">定位依据</div>
        <div className="flex flex-wrap gap-2">
          {context.evidence.map((item) => (
            <Badge key={item} variant="outline">
              {item}
            </Badge>
          ))}
        </div>
      </div>

      {comparisonNotice ? (
        <ComparisonTriggerNoticeSection notice={comparisonNotice} />
      ) : null}

      {latestComparisonRunCallback ? (
        <LatestComparisonRunCallbackSection summary={latestComparisonRunCallback} />
      ) : null}

      {comparisonAction ? (
        <ComparisonTriggerActionSection
          batchId={batch.batch_id}
          action={comparisonAction}
        />
      ) : null}
    </section>
  )
}

function LatestComparisonRunCallbackSection({
  summary,
}: {
  summary: ReturnType<typeof summarizeImportLatestComparisonRunCallback>
}) {
  if (!summary) {
    return null
  }

  return (
    <section className="grid gap-3 rounded-md border bg-background/80 p-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="grid gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <Activity className="size-4 text-muted-foreground" />
            <div className="text-sm font-medium">{summary.title}</div>
            <Badge variant={summary.tone === "success" ? "secondary" : "destructive"}>
              {summary.tone === "success" ? "最新结果" : "待刷新"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{summary.detail}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href={summary.primaryHref}>
              {summary.primaryActionLabel}
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href={summary.secondaryHref}>
              {summary.secondaryActionLabel}
              <ExternalLink data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </div>
      <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-4">
        {summary.metricCards.map((metric) => (
          <div key={metric.label} className="rounded-md border bg-background/60 p-3">
            <div className="text-xs text-muted-foreground">{metric.label}</div>
            <div className="mt-1 break-all font-mono text-xs font-medium">
              {metric.value}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{metric.detail}</div>
          </div>
        ))}
      </div>
      <div className="text-xs font-mono text-muted-foreground">{summary.runLabel}</div>
    </section>
  )
}

function ComparisonTriggerNoticeSection({
  notice,
}: {
  notice: ReturnType<typeof summarizeImportVersionComparisonTriggerNotice>
}) {
  if (!notice) {
    return null
  }

  return (
    <section className="grid gap-3 rounded-md border bg-background/80 p-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="grid gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <CheckCircle2 className="size-4 text-muted-foreground" />
            <div className="text-sm font-medium">{notice.title}</div>
            <Badge variant={notice.tone === "success" ? "secondary" : "destructive"}>
              {notice.tone === "success" ? "已生成" : "未提交"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{notice.detail}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href={notice.primaryHref}>
              {notice.primaryActionLabel}
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href={notice.secondaryHref}>
              {notice.secondaryActionLabel}
              <ExternalLink data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </div>
      <div className="text-xs font-mono text-muted-foreground">{notice.runLabel}</div>
    </section>
  )
}

function ComparisonTriggerActionSection({
  batchId,
  action,
}: {
  batchId: string
  action: ImportVersionComparisonTrigger
}) {
  return (
    <section className="grid gap-4 rounded-md border bg-background/80 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="grid gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <ClipboardCheck className="size-4 text-muted-foreground" />
            <h4 className="text-sm font-medium">比对计算</h4>
            <Badge variant={action.canSubmit ? "outline" : "destructive"}>
              {action.canSubmit ? "可提交" : "已阻塞"}
            </Badge>
          </div>
          <div>
            <div className="font-medium">{action.title}</div>
            <p className="mt-1 text-sm text-muted-foreground">{action.detail}</p>
          </div>
        </div>
        {action.canSubmit && action.request ? (
          <form action={triggerLocalComparisonRunAction}>
            <input type="hidden" name="batch_id" value={batchId} />
            <input
              type="hidden"
              name="comparison_type"
              value={action.request.comparisonType}
            />
            <input
              type="hidden"
              name="forecast_version_id"
              value={action.request.forecastVersionId ?? ""}
            />
            <input
              type="hidden"
              name="schedule_version_id"
              value={action.request.scheduleVersionId ?? ""}
            />
            <input
              type="hidden"
              name="actual_import_version_id"
              value={action.request.actualImportVersionId ?? ""}
            />
            <input
              type="hidden"
              name="business_date_from"
              value={action.request.businessDateFrom}
            />
            <input
              type="hidden"
              name="business_date_to"
              value={action.request.businessDateTo}
            />
            <Button size="sm" type="submit">
              {action.actionLabel}
              <ArrowRight data-icon="inline-end" />
            </Button>
          </form>
        ) : null}
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <ContextMetric label="对比口径" value={action.comparisonTypeLabel} />
        <ContextMetric label="来源版本" value={action.versionPairLabel} />
        <ContextMetric label="业务日期" value={action.businessDateLabel} />
      </div>

      <div className="grid gap-2">
        <div className="text-xs font-medium text-muted-foreground">执行约束</div>
        <p className="text-sm text-muted-foreground">{action.nextAction}</p>
        <div className="flex flex-wrap gap-2">
          {action.evidence.map((item) => (
            <Badge key={item} variant="outline">
              {item}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContextMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-background/60 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 break-all font-mono text-xs font-medium">{value}</div>
    </div>
  )
}

function ReviewEvidenceGapPanel({
  businessDate,
  drilldown,
}: {
  businessDate: string | null
  drilldown: ImportReviewEvidenceGapDrilldown
}) {
  return (
    <section className="grid gap-4 rounded-md border bg-muted/30 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="grid min-w-0 gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <ClipboardList className="size-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">复核证据缺口</h3>
            <Badge
              variant={drilldown.tone === "blocked" ? "destructive" : "outline"}
            >
              {formatReviewEvidenceGapTone(drilldown.tone)}
            </Badge>
          </div>
          <div>
            <div className="font-medium">{drilldown.title}</div>
            <p className="mt-1 text-sm text-muted-foreground">{drilldown.summary}</p>
          </div>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link
            href={
              businessDate
                ? buildImportReviewCasesWorkspaceHref({ businessDate, status: "open" })
                : "#import-result-trace"
            }
          >
            查看复核案例
            <ExternalLink data-icon="inline-end" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <TraceFocus
          icon={<ClipboardCheck className="size-4" />}
          label="责任人"
          value={drilldown.ownerSummary}
        />
        <TraceFocus
          icon={<AlertTriangle className="size-4" />}
          label="下一步"
          value={drilldown.nextAction}
        />
      </div>

      {drilldown.gaps.length === 0 ? (
        <PanelState title={drilldown.title} detail={drilldown.nextAction} />
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[180px]">缺口</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead className="min-w-[240px]">需补证据</TableHead>
                <TableHead className="min-w-[220px]">影响线索</TableHead>
                <TableHead className="min-w-[220px]">依据</TableHead>
                <TableHead className="min-w-[240px]">下一步</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drilldown.gaps.map((gap) => (
                <TableRow key={gap.key}>
                  <TableCell>
                    <div className="grid gap-1">
                      <span className="font-mono text-xs">{gap.title}</span>
                      <Badge
                        variant={gap.riskTone === "blocked" ? "destructive" : "outline"}
                      >
                        {formatReviewEvidenceGapTone(gap.riskTone)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{gap.ownerId}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {gap.evidenceNeed}
                  </TableCell>
                  <TableCell>
                    <div className="grid gap-1 text-xs text-muted-foreground">
                      <span>{gap.relatedQualityIssue}</span>
                      <span>{gap.relatedComparison}</span>
                      <span>{gap.riskLabel}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {gap.evidence.map((item) => (
                        <Badge key={item} variant="outline">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {gap.nextAction}
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

function ReviewConclusionPreviewPanel({
  businessDate,
  preview,
}: {
  businessDate: string | null
  preview: ImportReviewConclusionPreview
}) {
  return (
    <section className="grid gap-4 rounded-md border bg-muted/30 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="grid min-w-0 gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <ClipboardCheck className="size-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">复核结论预览</h3>
            <Badge
              variant={preview.tone === "blocked" ? "destructive" : "outline"}
            >
              {formatReviewConclusionTone(preview.tone)}
            </Badge>
          </div>
          <div>
            <div className="font-medium">{preview.title}</div>
            <p className="mt-1 text-sm text-muted-foreground">
              {preview.suggestedConclusion}
            </p>
          </div>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link
            href={
              businessDate
                ? buildImportReviewCasesWorkspaceHref({ businessDate })
                : "#import-result-trace"
            }
          >
            查看复核案例
            <ExternalLink data-icon="inline-end" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <TraceFocus
          icon={<ClipboardList className="size-4" />}
          label="建议证据"
          value={preview.evidenceSummary}
        />
        <TraceFocus
          icon={<AlertTriangle className="size-4" />}
          label="残余风险"
          value={preview.residualRisk}
        />
      </div>

      <div className="grid gap-2">
        <div className="text-xs font-medium text-muted-foreground">结论依据</div>
        <div className="flex flex-wrap gap-2">
          {preview.evidence.map((item) => (
            <Badge key={item} variant="outline">
              {item}
            </Badge>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{preview.nextAction}</p>
    </section>
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
                    <div className="grid gap-2">
                      <span>{group.nextAction}</span>
                      <Button asChild size="sm" variant="outline" className="w-fit">
                        <Link href={group.reviewCasesHref}>
                          {group.reviewCasesActionLabel}
                          <ExternalLink data-icon="inline-end" />
                        </Link>
                      </Button>
                    </div>
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
    <section id="comparison-runs-list" className="grid min-w-0 gap-2">
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
                      <Link href={buildImportComparisonRunDetailWorkspaceHref(run.run_id)}>
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
                      <Link href={buildImportReviewCaseDetailWorkspaceHref(reviewCase.case_id)}>
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

function formatReviewConclusionTone(
  tone: ImportReviewConclusionPreview["tone"]
): string {
  if (tone === "blocked") {
    return "暂缓关闭"
  }

  if (tone === "warning") {
    return "需复核"
  }

  if (tone === "ready") {
    return "可摘要"
  }

  return "等待结果"
}

function formatReviewEvidenceGapTone(
  tone: ImportReviewEvidenceGapDrilldown["tone"]
): string {
  if (tone === "blocked") {
    return "需补证"
  }

  if (tone === "warning") {
    return "需复核"
  }

  if (tone === "ready") {
    return "低风险"
  }

  return "暂无缺口"
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

function formatAppliedVersionContextTone(
  tone: ImportAppliedVersionResultContext["tone"]
): string {
  if (tone === "ready") {
    return "已定位"
  }

  if (tone === "blocked") {
    return "待补全"
  }

  return "空态"
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
