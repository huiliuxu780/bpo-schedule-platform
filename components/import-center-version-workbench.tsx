import Link from "next/link"
import { AlertTriangle, ArrowLeft, ArrowRight, Filter, GitBranch, Layers3 } from "lucide-react"

import { triggerVersionWorkbenchLocalComparisonRunAction } from "@/app/data-quality/actions"
import {
  type ImportBatchListRow,
  type ImportComparisonRunRecord,
  type ImportReviewCaseRecord,
  type ImportVersionComparisonCandidate,
  type ImportVersionWorkbenchFilters,
  summarizeImportVersionWorkbenchComparisonResultReview,
  summarizeImportVersionWorkbench,
} from "@/components/import-center-model"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type ImportCenterVersionWorkbenchProps = {
  batches: ImportBatchListRow[]
  comparisonRuns: ImportComparisonRunRecord[]
  reviewCases: ImportReviewCaseRecord[]
  filters: ImportVersionWorkbenchFilters
  error: string | null
  comparisonStatus?: string | null
  comparisonRunId?: string | null
  comparisonReason?: string | null
}

export function ImportCenterVersionWorkbench({
  batches,
  comparisonRuns,
  reviewCases,
  filters,
  error,
  comparisonStatus,
  comparisonRunId,
  comparisonReason,
}: ImportCenterVersionWorkbenchProps) {
  const summary = summarizeImportVersionWorkbench({
    batches,
    comparisonRuns,
    reviewCases,
    filters,
  })
  const comparisonResultReview = summarizeImportVersionWorkbenchComparisonResultReview({
    status: comparisonStatus,
    runId: comparisonRunId,
    comparisonRuns,
  })
  const comparisonNotice = comparisonResultReview ?? summarizeVersionWorkbenchSubmitNotice({
    status: comparisonStatus,
    runId: comparisonRunId,
    reason: comparisonReason,
  })

  return (
    <main className="grid flex-1 auto-rows-max gap-4 overflow-x-hidden overflow-y-auto px-4 py-4 lg:px-6">
      <section className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="grid gap-2">
          <Button asChild size="sm" variant="ghost" className="w-fit px-0">
            <Link href="/data-quality">
              <ArrowLeft data-icon="inline-start" />
              返回数据质量
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-semibold tracking-normal">业务版本工作台</h1>
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
              查看当前业务版本、来源批次、阻塞状态、下游影响和本地比对入口。
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={summary.tone === "blocked" ? "destructive" : "outline"}>
            {summary.tone === "blocked" ? "需处理" : summary.tone === "ready" ? "已成链" : "待建立"}
          </Badge>
          {filters.businessDate ? (
            <Badge variant="secondary">业务日 {filters.businessDate}</Badge>
          ) : (
            <Badge variant="outline">全部业务日</Badge>
          )}
        </div>
      </section>

      {error ? (
        <Card className="border-destructive/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="size-4 text-destructive" />
              版本台账读取失败
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{error}</CardContent>
        </Card>
      ) : null}

      {comparisonNotice ? (
        <Card
          className={
            comparisonNotice.tone === "success"
              ? "border-primary/40"
              : "border-destructive/50"
          }
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <GitBranch
                className={
                  comparisonNotice.tone === "success"
                    ? "size-4 text-primary"
                    : "size-4 text-destructive"
                }
              />
              {comparisonNotice.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm text-muted-foreground">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="grid gap-1">
                <p>{comparisonNotice.detail}</p>
                <p className="font-mono text-xs">{comparisonNotice.runLabel}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {comparisonNotice.primaryHref ? (
                  <Button asChild size="sm">
                    <Link href={comparisonNotice.primaryHref}>
                      {comparisonNotice.primaryActionLabel}
                      <ArrowRight data-icon="inline-end" />
                    </Link>
                  </Button>
                ) : null}
                <Button asChild size="sm" variant="outline">
                  <Link href={comparisonNotice.secondaryHref}>
                    {comparisonNotice.secondaryActionLabel}
                  </Link>
                </Button>
              </div>
            </div>
            {comparisonNotice.metricCards ? (
              <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                {comparisonNotice.metricCards.map((metric) => (
                  <div key={metric.label} className="rounded-md border bg-muted/20 p-3">
                    <div className="text-xs text-muted-foreground">{metric.label}</div>
                    <div className="mt-1 text-lg font-semibold tracking-normal text-foreground">
                      {metric.value}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {metric.detail}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="当前业务域"
          value={summary.totalDomains.toLocaleString("zh-CN")}
          detail={summary.title}
          tone="default"
        />
        <MetricCard
          label="已形成版本"
          value={summary.readyCount.toLocaleString("zh-CN")}
          detail="当前按最近已应用批次汇总"
          tone={summary.readyCount > 0 ? "done" : "default"}
        />
        <MetricCard
          label="待处理"
          value={summary.blockedCount.toLocaleString("zh-CN")}
          detail="未应用、版本缺失或仍有阻塞"
          tone={summary.blockedCount > 0 ? "blocked" : "default"}
        />
        <MetricCard
          label="空白业务域"
          value={summary.emptyCount.toLocaleString("zh-CN")}
          detail="当前没有导入批次"
          tone="default"
        />
      </section>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Filter className="size-4 text-muted-foreground" />
                筛选版本台账
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">{summary.detail}</p>
            </div>
            <Button asChild size="sm" variant="ghost">
              <Link href="/data-quality/versions">重置</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form
            action="/data-quality/versions"
            className="grid gap-3 md:grid-cols-[minmax(160px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)_auto]"
          >
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium">业务日</span>
              <Input
                name="businessDate"
                defaultValue={filters.businessDate ?? ""}
                placeholder="2026-05-12"
              />
            </label>
            <FilterSelect
              label="业务域"
              name="domain"
              value={filters.domain ?? "all"}
              options={[
                ["all", "全部"],
                ["master_data", "主数据"],
                ["personnel_schedule", "人员排班"],
                ["demand_forecast", "需求预测"],
                ["actual_logs", "登录/状态日志"],
              ]}
            />
            <FilterSelect
              label="状态"
              name="status"
              value={filters.status ?? "all"}
              options={[
                ["all", "全部"],
                ["ready", "已形成版本"],
                ["blocked", "待处理"],
                ["empty", "暂无批次"],
              ]}
            />
            <div className="flex items-end">
              <Button type="submit" className="w-full md:w-auto">
                应用筛选
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card id="version-ledger" className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Layers3 className="size-4 text-muted-foreground" />
            当前版本台账
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="min-w-[1880px]">
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[160px]">业务域</TableHead>
                <TableHead className="min-w-[180px]">当前版本</TableHead>
                <TableHead className="min-w-[160px]">来源批次</TableHead>
                <TableHead className="min-w-[150px]">当前可见时间</TableHead>
                <TableHead className="min-w-[110px]">状态</TableHead>
                <TableHead className="min-w-[320px]">阻塞摘要</TableHead>
                <TableHead className="min-w-[280px]">下游影响</TableHead>
                <TableHead className="min-w-[300px]">本地比对</TableHead>
                <TableHead className="min-w-[220px] text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary.rows.map((row) => (
                <TableRow key={row.domainKey}>
                  <TableCell>
                    <div className="grid gap-1">
                      <div className="font-medium">{row.domainLabel}</div>
                      <div className="text-xs text-muted-foreground">
                        {row.sourceFileLabel} · {row.businessDateLabel}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{row.versionLabel}</TableCell>
                  <TableCell>{row.sourceBatchLabel}</TableCell>
                  <TableCell>{row.visibleTimeLabel}</TableCell>
                  <TableCell>
                    <Badge
                      variant={row.tone === "blocked" ? "destructive" : "outline"}
                    >
                      {row.statusLabel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="grid gap-1">
                      <div className="text-sm">{row.blockerSummary}</div>
                      <div className="text-xs text-muted-foreground">{row.nextAction}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="grid gap-1">
                      <div className="text-sm">{row.downstreamSummary}</div>
                      <div className="text-xs text-muted-foreground">
                        {row.downstreamDetail}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <ComparisonCandidateSummary
                      candidate={row.comparisonCandidate}
                      filters={filters}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={row.primaryActionHref ?? "/data-quality"}>
                          {row.primaryActionLabel}
                          <ArrowRight data-icon="inline-end" />
                        </Link>
                      </Button>
                      {row.secondaryActionHref ? (
                        <Button asChild size="sm">
                          <Link href={row.secondaryActionHref}>
                            {row.secondaryActionLabel}
                            <ArrowRight data-icon="inline-end" />
                          </Link>
                        </Button>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  )
}

function ComparisonCandidateSummary({
  candidate,
  filters,
}: {
  candidate: ImportVersionComparisonCandidate
  filters: ImportVersionWorkbenchFilters
}) {
  const badgeVariant = candidate.tone === "ready" ? "secondary" : "outline"

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={badgeVariant}>{candidate.comparisonTypeLabel}</Badge>
        <span className="text-xs text-muted-foreground">{candidate.businessDateLabel}</span>
      </div>
      <div className="grid gap-1">
        <div className="text-sm font-medium">{candidate.title}</div>
        <div className="font-mono text-xs text-muted-foreground">
          {candidate.versionPairLabel}
        </div>
        <div className="text-xs text-muted-foreground">{candidate.detail}</div>
      </div>
      {candidate.canSubmit && candidate.request && candidate.sourceBatchId ? (
        <form action={triggerVersionWorkbenchLocalComparisonRunAction} className="w-fit">
          <input type="hidden" name="source_batch_id" value={candidate.sourceBatchId} />
          <input
            type="hidden"
            name="comparison_type"
            value={candidate.request.comparisonType}
          />
          <input
            type="hidden"
            name="forecast_version_id"
            value={candidate.request.forecastVersionId ?? ""}
          />
          <input
            type="hidden"
            name="schedule_version_id"
            value={candidate.request.scheduleVersionId ?? ""}
          />
          <input
            type="hidden"
            name="actual_import_version_id"
            value={candidate.request.actualImportVersionId ?? ""}
          />
          <input
            type="hidden"
            name="business_date_from"
            value={candidate.request.businessDateFrom}
          />
          <input
            type="hidden"
            name="business_date_to"
            value={candidate.request.businessDateTo}
          />
          <input
            type="hidden"
            name="return_business_date"
            value={filters.businessDate ?? ""}
          />
          <input type="hidden" name="return_domain" value={filters.domain ?? "all"} />
          <input type="hidden" name="return_status" value={filters.status ?? "all"} />
          <Button type="submit" size="sm" variant="outline" className="w-fit">
            {candidate.actionLabel}
            <ArrowRight data-icon="inline-end" />
          </Button>
        </form>
      ) : (
        <Badge variant="outline" className="w-fit">
          {candidate.actionLabel}
        </Badge>
      )}
    </div>
  )
}

function summarizeVersionWorkbenchSubmitNotice({
  status,
  runId,
  reason,
}: {
  status?: string | null
  runId?: string | null
  reason?: string | null
}): {
  tone: "success" | "failed"
  title: string
  detail: string
  runLabel: string
  metricCards?: Array<{ label: string; value: string; detail: string }>
  primaryActionLabel: string
  primaryHref: string | null
  secondaryActionLabel: string
  secondaryHref: string
} | null {
  if (status === "success" && runId) {
    return {
      tone: "success",
      title: "本地比对已提交",
      detail: "当前版本组合已生成或复用一个本地对比运行；重复提交时后端会返回已有运行，不创建多条重复结果。",
      runLabel: runId,
      primaryActionLabel: "查看对比运行",
      primaryHref: `/data-quality/comparison-runs/${encodeURIComponent(runId)}`,
      secondaryActionLabel: "回到版本台账",
      secondaryHref: "#version-ledger",
    }
  }

  if (status === "failed") {
    return {
      tone: "failed",
      title: "本地比对未提交",
      detail: formatVersionWorkbenchSubmitFailure(reason),
      runLabel: runId ?? "未生成运行",
      primaryActionLabel: "查看对比运行",
      primaryHref: runId
        ? `/data-quality/comparison-runs/${encodeURIComponent(runId)}`
        : null,
      secondaryActionLabel: "回到版本台账",
      secondaryHref: "#version-ledger",
    }
  }

  return null
}

function formatVersionWorkbenchSubmitFailure(reason?: string | null): string {
  if (!reason) {
    return "提交未返回成功结果，请确认版本组合和本地 API 状态。"
  }

  if (reason === "missing_required_fields") {
    return "提交参数不完整，当前版本组合还不能发起本地比对。"
  }

  if (reason.startsWith("api_")) {
    return `本地 API 返回 ${reason.replace("api_", "")}，请先回看版本组合和服务状态。`
  }

  return reason
}

function MetricCard({
  label,
  value,
  detail,
  tone,
}: {
  label: string
  value: string
  detail: string
  tone: "default" | "blocked" | "done"
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
          <Badge
            variant={
              tone === "blocked" ? "destructive" : tone === "done" ? "secondary" : "outline"
            }
          >
            {tone === "blocked" ? "需处理" : tone === "done" ? "已形成" : "台账"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tracking-normal">{value}</div>
        <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  )
}

function FilterSelect({
  label,
  name,
  value,
  options,
}: {
  label: string
  name: string
  value: string
  options: Array<[string, string]>
}) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium">{label}</span>
      <select
        name={name}
        defaultValue={value}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  )
}
