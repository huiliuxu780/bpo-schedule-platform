import Link from "next/link"
import {
  AlertTriangle,
  CheckCircle2,
  CircleSlash,
  Database,
  ShieldCheck,
} from "lucide-react"

import {
  type ImportApplyReadinessResponse,
  type ImportBatchFilters,
  type ImportBatchListRow,
  type ImportDownstreamResultNavigation,
  type ImportExceptionGuidance,
  buildImportApiUrl,
  filterImportBatches,
  formatImportApplicationStatus,
  formatImportFileType,
  formatImportProcessingStatus,
  formatImportReadinessStatus,
  getImportBatchHealth,
  summarizeImportApplyActionGuidance,
  summarizeImportApplicationVisibility,
  summarizeImportBatchReviewGuide,
  summarizeImportBatches,
  summarizeImportDownstreamResultNavigation,
  summarizeImportExceptionGuidance,
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
import { cn } from "@/lib/utils"

type ImportCenterApiPanelProps = {
  batches: ImportBatchListRow[]
  selectedBatchId: string | null
  readiness: ImportApplyReadinessResponse | null
  batchError: string | null
  readinessError: string | null
  batchFilters?: ImportBatchFilters
  templateError?: string | null
  templateCount?: number
  uploadForm?: React.ReactNode
  rowCorrectionPanel?: React.ReactNode
}

export function ImportCenterApiPanel({
  batches,
  selectedBatchId,
  readiness,
  batchError,
  readinessError,
  batchFilters = {},
  templateError = null,
  templateCount = 0,
  uploadForm,
  rowCorrectionPanel,
}: ImportCenterApiPanelProps) {
  const filteredBatches = filterImportBatches(batches, batchFilters)
  const summary = summarizeImportBatches(filteredBatches)
  const selectedBatch =
    batches.find((batch) => batch.batch_id === selectedBatchId) ??
    filteredBatches[0] ??
    batches[0] ??
    null
  const exceptionGuidance = summarizeImportExceptionGuidance({
    batchError,
    readinessError,
    templateError,
    selectedBatchId: selectedBatch?.batch_id ?? selectedBatchId,
    batchCount: batches.length,
    templateCount,
  })

  return (
    <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto px-4 py-4 lg:px-6">
      {uploadForm}
      <ExceptionGuidancePanel items={exceptionGuidance} />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="导入批次"
          value={summary.totalBatches.toLocaleString("zh-CN")}
          detail={`${summary.totalRows.toLocaleString("zh-CN")} 行`}
          icon={Database}
        />
        <SummaryCard
          title="失败行"
          value={summary.failedRows.toLocaleString("zh-CN")}
          detail={`${summary.warningRows.toLocaleString("zh-CN")} 行需关注`}
          icon={AlertTriangle}
          tone={summary.failedRows > 0 ? "destructive" : "default"}
        />
        <SummaryCard
          title="已应用"
          value={summary.appliedBatches.toLocaleString("zh-CN")}
          detail={`${summary.notAppliedBatches.toLocaleString("zh-CN")} 批未应用`}
          icon={CheckCircle2}
        />
        <SummaryCard
          title="当前准备度"
          value={readiness ? formatImportReadinessStatus(readiness.readiness_status) : "-"}
          detail={selectedBatch?.batch_id ?? "暂无选中批次"}
          icon={ShieldCheck}
          tone={readiness?.readiness_status === "blocked" ? "destructive" : "default"}
        />
      </section>

      {selectedBatch ? (
        <BatchReviewGuideCard batch={selectedBatch} readiness={readiness} />
      ) : null}

      <section className="grid min-h-0 gap-4 xl:grid-cols-[1fr_380px]">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">接入批次</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {batchError ??
                  `来自 /api/v1/import-batches · ${filteredBatches.length}/${batches.length} 批匹配`}
              </p>
            </div>
            {batchError ? <Badge variant="destructive">API 异常</Badge> : null}
          </CardHeader>
          <CardContent className="grid gap-0 p-0">
            <BatchFilterForm
              filters={batchFilters}
              selectedBatchId={selectedBatch?.batch_id ?? selectedBatchId}
            />
            {batches.length === 0 ? (
              <EmptyState
                title={batchError ? "批次读取失败" : "暂无导入批次"}
                detail={
                  batchError ??
                  "本地 API 当前没有返回批次。上传 API 写入批次后，这里会直接显示。"
                }
              />
            ) : filteredBatches.length === 0 ? (
              <EmptyState
                title="没有匹配批次"
                detail="调整关键词、文件类型、处理状态或应用状态后重新筛选。"
              />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[220px]">批次</TableHead>
                      <TableHead>类型</TableHead>
                      <TableHead>处理状态</TableHead>
                      <TableHead className="text-right">成功/失败</TableHead>
                      <TableHead>应用状态</TableHead>
                      <TableHead className="text-right">版本</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBatches.map((batch) => {
                      const isSelected = batch.batch_id === selectedBatch?.batch_id
                      const health = getImportBatchHealth(
                        batch,
                        isSelected ? readiness : null
                      )

                      return (
                        <TableRow key={batch.batch_id} data-state={isSelected ? "selected" : undefined}>
                          <TableCell>
                            <Link
                              href={buildBatchListHref(
                                batch.batch_id,
                                batchFilters,
                                "#import-batch-detail"
                              )}
                              className="grid gap-1"
                            >
                              <span className="font-mono text-xs font-medium">
                                {batch.batch_id}
                              </span>
                              <span className="max-w-[320px] truncate text-xs text-muted-foreground">
                                {batch.file_name}
                              </span>
                            </Link>
                          </TableCell>
                          <TableCell>{formatImportFileType(batch.file_type)}</TableCell>
                          <TableCell>
                            <HealthBadge health={health} />
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="font-mono text-xs">
                              {batch.success_rows}/{batch.failed_rows}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                batch.application_status === "applied"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {formatImportApplicationStatus(batch.application_status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">{batch.version_count}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card id="import-apply-readiness" className="scroll-mt-16">
          <CardHeader>
            <CardTitle className="text-base">应用准备度</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {selectedBatch
                ? `${formatImportFileType(selectedBatch.file_type)} · ${formatImportProcessingStatus(selectedBatch.processing_status)}`
                : "暂无批次"}
            </p>
          </CardHeader>
          <CardContent className="grid gap-4">
            {!selectedBatch ? (
              <EmptyState title="暂无选中批次" detail="导入批次列表为空。" compact />
            ) : (
              <>
                <ApplyActionGuidance
                  readiness={readiness}
                  readinessError={readinessError}
                />
                <ApplicationVisibilityPanel batch={selectedBatch} readiness={readiness} />
                <DownstreamNavigationPanel batch={selectedBatch} readiness={readiness} />
                {readinessError ? (
                  <EmptyState title="准备度读取失败" detail={readinessError} compact />
                ) : readiness ? (
                  <ReadinessDetail readiness={readiness} />
                ) : (
                  <EmptyState title="暂无准备度" detail="未返回 readiness 结果。" compact />
                )}
              </>
            )}
          </CardContent>
        </Card>
      </section>
      {rowCorrectionPanel}
    </main>
  )
}

function BatchFilterForm({
  filters,
  selectedBatchId,
}: {
  filters: ImportBatchFilters
  selectedBatchId: string | null
}) {
  return (
    <form
      action="/data-quality"
      className="grid gap-3 border-t px-4 py-3 md:grid-cols-[minmax(180px,1fr)_repeat(3,minmax(120px,160px))_auto_auto]"
    >
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">关键词</span>
        <input
          name="batchQuery"
          defaultValue={filters.query ?? ""}
          placeholder="批次、文件、上传人"
          className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </label>
      <FilterSelect
        label="文件类型"
        name="batchFileType"
        value={filters.fileType ?? "all"}
        options={[
          ["all", "全部"],
          ["master_data", "主数据"],
          ["personnel_schedule", "人员排班"],
          ["demand_forecast", "需求预测"],
          ["login_log", "登录日志"],
          ["status_log", "状态日志"],
        ]}
      />
      <FilterSelect
        label="处理状态"
        name="batchProcessingStatus"
        value={filters.processingStatus ?? "all"}
        options={[
          ["all", "全部"],
          ["completed", "已完成"],
          ["completed_with_errors", "有失败行"],
          ["failed", "失败"],
        ]}
      />
      <FilterSelect
        label="应用状态"
        name="batchApplicationStatus"
        value={filters.applicationStatus ?? "all"}
        options={[
          ["all", "全部"],
          ["not_applied", "未应用"],
          ["applied", "已应用"],
        ]}
      />
      <div className="flex items-end">
        <button
          type="submit"
          className="h-8 rounded-lg border border-input px-3 text-sm font-medium hover:bg-muted"
        >
          筛选
        </button>
      </div>
      <div className="flex items-end">
        <Link
          href={selectedBatchId ? `/data-quality?batch=${encodeURIComponent(selectedBatchId)}` : "/data-quality"}
          className="flex h-8 items-center rounded-lg border border-input px-3 text-sm font-medium hover:bg-muted"
        >
          重置
        </Link>
      </div>
    </form>
  )
}

function buildBatchListHref(
  batchId: string,
  filters: ImportBatchFilters,
  anchor = ""
): string {
  const searchParams = new URLSearchParams({ batch: batchId })

  if (filters.query?.trim()) {
    searchParams.set("batchQuery", filters.query.trim())
  }

  if (filters.fileType && filters.fileType !== "all") {
    searchParams.set("batchFileType", filters.fileType)
  }

  if (filters.processingStatus && filters.processingStatus !== "all") {
    searchParams.set("batchProcessingStatus", filters.processingStatus)
  }

  if (filters.applicationStatus && filters.applicationStatus !== "all") {
    searchParams.set("batchApplicationStatus", filters.applicationStatus)
  }

  return `/data-quality?${searchParams.toString()}${anchor}`
}

function BatchReviewGuideCard({
  batch,
  readiness,
}: {
  batch: ImportBatchListRow
  readiness: ImportApplyReadinessResponse | null
}) {
  const guide = summarizeImportBatchReviewGuide({ batch, readiness })

  return (
    <Card
      className={cn(
        "border-l-4",
        guide.tone === "blocked"
          ? "border-l-destructive"
          : guide.tone === "ready"
            ? "border-l-emerald-500"
            : guide.tone === "done"
              ? "border-l-primary"
              : "border-l-muted-foreground"
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
        <div>
          <CardTitle className="text-base">批次处理导览</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            {batch.batch_id} · {formatImportFileType(batch.file_type)}
          </p>
        </div>
        <Badge
          variant={
            guide.tone === "blocked"
              ? "destructive"
              : guide.tone === "done"
                ? "secondary"
                : "outline"
          }
        >
          {formatReviewGuideTone(guide.tone)}
        </Badge>
      </CardHeader>
      <CardContent className="grid gap-3 pt-0">
        <div>
          <div className="text-sm font-medium">{guide.title}</div>
          <p className="mt-1 text-sm text-muted-foreground">{guide.detail}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={guide.primaryAnchor}
            className="inline-flex h-8 items-center rounded-lg border border-input px-3 text-sm font-medium hover:bg-muted"
          >
            {guide.primaryActionLabel}
          </a>
          <a
            href={guide.secondaryAnchor}
            className="inline-flex h-8 items-center rounded-lg border border-input px-3 text-sm font-medium hover:bg-muted"
          >
            查看关联区域
          </a>
        </div>
      </CardContent>
    </Card>
  )
}

function formatReviewGuideTone(
  tone: ReturnType<typeof summarizeImportBatchReviewGuide>["tone"]
): string {
  if (tone === "blocked") {
    return "需处理"
  }

  if (tone === "ready") {
    return "可复核"
  }

  if (tone === "done") {
    return "已完成"
  }

  if (tone === "warning") {
    return "需关注"
  }

  return "待判断"
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
  options: [string, string][]
}) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium">{label}</span>
      <select
        name={name}
        defaultValue={value}
        className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {options.map(([optionValue, labelText]) => (
          <option key={optionValue} value={optionValue}>
            {labelText}
          </option>
        ))}
      </select>
    </label>
  )
}

function ExceptionGuidancePanel({ items }: { items: ImportExceptionGuidance[] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">异常态处理建议</CardTitle>
        <p className="mt-1 text-sm text-muted-foreground">
          汇总批次、准备度和字段映射模板的前置异常，先处理阻塞项再继续操作。
        </p>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.scope}
            className={cn(
              "grid gap-2 rounded-md border p-3 text-sm",
              item.tone === "blocked"
                ? "border-destructive/40 bg-destructive/10"
                : item.tone === "ready"
                  ? "border-emerald-500/30 bg-emerald-500/10"
                  : "bg-muted/30"
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium">{item.title}</span>
              <Badge
                variant={
                  item.tone === "blocked"
                    ? "destructive"
                    : item.tone === "ready"
                      ? "secondary"
                      : "outline"
                }
              >
                {formatExceptionTone(item.tone)}
              </Badge>
            </div>
            <p className="text-muted-foreground">{item.detail}</p>
            <p className="text-xs text-muted-foreground">{item.nextAction}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function formatExceptionTone(tone: ImportExceptionGuidance["tone"]): string {
  if (tone === "blocked") {
    return "阻塞"
  }

  if (tone === "ready") {
    return "正常"
  }

  return "提醒"
}

function ApplyActionGuidance({
  readiness,
  readinessError,
}: {
  readiness: ImportApplyReadinessResponse | null
  readinessError: string | null
}) {
  const guidance = summarizeImportApplyActionGuidance(readiness, readinessError)

  return (
    <div
      className={cn(
        "grid gap-2 rounded-md border p-3 text-sm",
        guidance.tone === "blocked"
          ? "border-destructive/40 bg-destructive/10"
          : guidance.tone === "ready"
            ? "border-emerald-500/30 bg-emerald-500/10"
            : "bg-muted/30"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium">应用前行动建议</span>
        <Badge
          variant={
            guidance.tone === "blocked"
              ? "destructive"
              : guidance.tone === "ready"
                ? "secondary"
                : "outline"
          }
        >
          {formatGuidanceTone(guidance.tone)}
        </Badge>
      </div>
      <div className="font-medium">{guidance.title}</div>
      <p className="text-muted-foreground">{guidance.detail}</p>
      <p className="text-xs text-muted-foreground">{guidance.nextAction}</p>
    </div>
  )
}

function ApplicationVisibilityPanel({
  batch,
  readiness,
}: {
  batch: ImportBatchListRow
  readiness: ImportApplyReadinessResponse | null
}) {
  const visibility = summarizeImportApplicationVisibility({ batch, readiness })

  return (
    <div
      className={cn(
        "grid gap-3 rounded-md border p-3 text-sm",
        visibility.tone === "blocked"
          ? "border-destructive/40 bg-destructive/10"
          : visibility.tone === "ready"
            ? "border-emerald-500/30 bg-emerald-500/10"
            : visibility.tone === "done"
              ? "bg-muted/40"
              : "bg-muted/30"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium">应用状态概览</span>
        <Badge
          variant={
            visibility.tone === "blocked"
              ? "destructive"
              : visibility.tone === "done"
                ? "secondary"
                : "outline"
          }
        >
          {visibility.statusLabel}
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <ApplicationMetric label="应用目标" value={visibility.targetLabel} />
        <ApplicationMetric label="已应用记录" value={visibility.appliedRecordLabel} />
        <ApplicationMetric
          label="导入版本"
          value={visibility.versionLabel}
          className="col-span-2"
        />
      </div>
      <div>
        <div className="font-medium">{visibility.title}</div>
        <p className="mt-1 text-muted-foreground">{visibility.detail}</p>
        <p className="mt-1 text-xs text-muted-foreground">{visibility.nextAction}</p>
      </div>
    </div>
  )
}

function DownstreamNavigationPanel({
  batch,
  readiness,
}: {
  batch: ImportBatchListRow
  readiness: ImportApplyReadinessResponse | null
}) {
  const navigation = summarizeImportDownstreamResultNavigation({ batch, readiness })

  return (
    <div
      className={cn(
        "grid gap-3 rounded-md border p-3 text-sm",
        navigation.tone === "blocked"
          ? "border-destructive/40 bg-destructive/10"
          : navigation.tone === "ready"
            ? "border-emerald-500/30 bg-emerald-500/10"
            : navigation.tone === "done"
              ? "bg-muted/40"
              : "bg-muted/30"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium">下游结果导航</span>
        <Badge
          variant={
            navigation.tone === "blocked"
              ? "destructive"
              : navigation.tone === "done"
                ? "secondary"
                : "outline"
          }
        >
          {formatDownstreamNavigationTone(navigation.tone)}
        </Badge>
      </div>
      <div>
        <div className="font-medium">{navigation.title}</div>
        <p className="mt-1 text-muted-foreground">{navigation.detail}</p>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <ApplicationMetric label="结果线索" value={navigation.comparisonLabel} />
        <ApplicationMetric label="复核线索" value={navigation.reviewLabel} />
        <ApplicationMetric
          label="证据"
          value={navigation.evidenceLabel}
          className="md:col-span-2"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button asChild size="sm" variant={navigation.tone === "blocked" ? "outline" : "default"}>
          <Link href={formatDownstreamHref(navigation.primaryHref)}>
            {navigation.primaryActionLabel}
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href={formatDownstreamHref(navigation.secondaryHref)}>
            {navigation.secondaryActionLabel}
          </Link>
        </Button>
      </div>
    </div>
  )
}

function formatDownstreamHref(href: string): string {
  if (href.startsWith("/api/")) {
    return buildImportApiUrl(href)
  }

  return href
}

function formatDownstreamNavigationTone(
  tone: ImportDownstreamResultNavigation["tone"]
): string {
  if (tone === "blocked") {
    return "先处理"
  }

  if (tone === "ready") {
    return "待应用"
  }

  if (tone === "done") {
    return "可追踪"
  }

  return "待判断"
}

function ApplicationMetric({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div className={cn("rounded-md border bg-background/60 p-2", className)}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 truncate font-mono text-xs font-medium">{value}</div>
    </div>
  )
}

function formatGuidanceTone(
  tone: ReturnType<typeof summarizeImportApplyActionGuidance>["tone"]
): string {
  if (tone === "ready") {
    return "可复核"
  }

  if (tone === "blocked") {
    return "需处理"
  }

  if (tone === "done") {
    return "已完成"
  }

  return "未知"
}

type SummaryCardProps = {
  title: string
  value: string
  detail: string
  icon: React.ComponentType<{ className?: string }>
  tone?: "default" | "destructive"
}

function SummaryCard({
  title,
  value,
  detail,
  icon: Icon,
  tone = "default",
}: SummaryCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon
          className={cn(
            "size-4",
            tone === "destructive" ? "text-destructive" : "text-muted-foreground"
          )}
        />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
        <p className="mt-1 truncate text-sm text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  )
}

function HealthBadge({ health }: { health: ReturnType<typeof getImportBatchHealth> }) {
  if (health === "blocked") {
    return <Badge variant="destructive">未就绪</Badge>
  }

  if (health === "warning") {
    return <Badge variant="outline">需关注</Badge>
  }

  if (health === "applied") {
    return <Badge variant="secondary">已应用</Badge>
  }

  return <Badge>可预检</Badge>
}

function ReadinessDetail({ readiness }: { readiness: ImportApplyReadinessResponse }) {
  const blockers = readiness.blockers.filter(
    (blocker) => blocker.code !== "IMPORT_BATCH_ALREADY_APPLIED"
  )

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge
          variant={readiness.readiness_status === "ready" ? "secondary" : "destructive"}
        >
          {formatImportReadinessStatus(readiness.readiness_status)}
        </Badge>
        <Badge variant="outline">{readiness.application_target}</Badge>
      </div>
      <div className="grid grid-cols-3 gap-3 text-sm">
        <Metric label="成功" value={readiness.success_rows} />
        <Metric label="失败" value={readiness.failed_rows} />
        <Metric label="版本" value={readiness.version_count} />
      </div>
      {blockers.length === 0 && readiness.row_blockers.length === 0 ? (
        <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
          没有阻塞项。
        </div>
      ) : null}
      {blockers.length > 0 ? (
        <div className="grid gap-2">
          <div className="text-sm font-medium">批次阻塞</div>
          {blockers.map((blocker) => (
            <div key={blocker.code} className="rounded-md border p-3 text-sm">
              <div className="font-mono text-xs text-muted-foreground">
                {blocker.code}
              </div>
              <div className="mt-1">{blocker.message}</div>
            </div>
          ))}
        </div>
      ) : null}
      {readiness.row_blockers.length > 0 ? (
        <div className="grid gap-2">
          <div className="text-sm font-medium">行级阻塞</div>
          <div className="grid max-h-72 gap-2 overflow-y-auto pr-1">
            {readiness.row_blockers.map((blocker) => (
              <div
                key={`${blocker.row_number}-${blocker.code}-${blocker.field_name ?? ""}`}
                className="rounded-md border p-3 text-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">第 {blocker.row_number} 行</span>
                  {blocker.field_name ? (
                    <Badge variant="outline">{blocker.field_name}</Badge>
                  ) : null}
                </div>
                <div className="mt-1 text-muted-foreground">{blocker.message}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 font-mono text-lg font-semibold">{value}</div>
    </div>
  )
}

function EmptyState({
  title,
  detail,
  compact = false,
}: {
  title: string
  detail: string
  compact?: boolean
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 text-center",
        compact ? "min-h-36" : "min-h-64"
      )}
    >
      <CircleSlash className="size-5 text-muted-foreground" />
      <div className="text-sm font-medium">{title}</div>
      <div className="max-w-md text-sm text-muted-foreground">{detail}</div>
    </div>
  )
}
