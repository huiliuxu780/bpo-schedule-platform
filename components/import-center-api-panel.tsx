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
  type ImportBatchListRow,
  formatImportApplicationStatus,
  formatImportFileType,
  formatImportProcessingStatus,
  formatImportReadinessStatus,
  getImportBatchHealth,
  summarizeImportApplyActionGuidance,
  summarizeImportBatches,
} from "@/components/import-center-model"
import { Badge } from "@/components/ui/badge"
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
  uploadForm?: React.ReactNode
  rowCorrectionPanel?: React.ReactNode
}

export function ImportCenterApiPanel({
  batches,
  selectedBatchId,
  readiness,
  batchError,
  readinessError,
  uploadForm,
  rowCorrectionPanel,
}: ImportCenterApiPanelProps) {
  const summary = summarizeImportBatches(batches)
  const selectedBatch =
    batches.find((batch) => batch.batch_id === selectedBatchId) ?? batches[0] ?? null

  return (
    <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto px-4 py-4 lg:px-6">
      {uploadForm}
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

      <section className="grid min-h-0 gap-4 xl:grid-cols-[1fr_380px]">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">接入批次</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {batchError ?? "来自 /api/v1/import-batches"}
              </p>
            </div>
            {batchError ? <Badge variant="destructive">API 异常</Badge> : null}
          </CardHeader>
          <CardContent className="p-0">
            {batches.length === 0 ? (
              <EmptyState
                title={batchError ? "批次读取失败" : "暂无导入批次"}
                detail={
                  batchError ??
                  "本地 API 当前没有返回批次。上传 API 写入批次后，这里会直接显示。"
                }
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
                    {batches.map((batch) => {
                      const isSelected = batch.batch_id === selectedBatch?.batch_id
                      const health = getImportBatchHealth(
                        batch,
                        isSelected ? readiness : null
                      )

                      return (
                        <TableRow key={batch.batch_id} data-state={isSelected ? "selected" : undefined}>
                          <TableCell>
                            <Link
                              href={`/data-quality?batch=${encodeURIComponent(batch.batch_id)}`}
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

        <Card>
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
