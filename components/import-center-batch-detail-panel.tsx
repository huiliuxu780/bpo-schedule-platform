import { CircleSlash, Database, FileText } from "lucide-react"

import {
  type ImportBatchPersistenceDetail,
  type ImportBatchRowResult,
  type ImportQualityExceptionTrace,
  formatImportFileType,
  formatImportProcessingStatus,
  formatImportRowErrorField,
  formatImportRowStatus,
  getImportRowStandardFieldsPreview,
  summarizeImportBatchDetail,
  summarizeImportBatchDetailReadability,
  summarizeImportQualityExceptionTrace,
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

type ImportCenterBatchDetailPanelProps = {
  detail: ImportBatchPersistenceDetail | null
  detailError: string | null
}

export function ImportCenterBatchDetailPanel({
  detail,
  detailError,
}: ImportCenterBatchDetailPanelProps) {
  if (detailError) {
    return (
      <Card id="import-batch-detail" className="scroll-mt-16">
        <CardHeader>
          <CardTitle className="text-base">批次明细</CardTitle>
        </CardHeader>
        <CardContent>
          <PanelState title="批次明细读取失败" detail={detailError} />
        </CardContent>
      </Card>
    )
  }

  if (!detail) {
    return (
      <Card id="import-batch-detail" className="scroll-mt-16">
        <CardHeader>
          <CardTitle className="text-base">批次明细</CardTitle>
        </CardHeader>
        <CardContent>
          <PanelState title="暂无批次明细" detail="没有选中可读取的导入批次。" />
        </CardContent>
      </Card>
    )
  }

  const summary = summarizeImportBatchDetail(detail)
  const readability = summarizeImportBatchDetailReadability(detail)
  const exceptionTrace = summarizeImportQualityExceptionTrace(detail)

  return (
    <Card id="import-batch-detail" className="scroll-mt-16 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base">批次明细</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            {detail.batch.batch_id} · {formatImportFileType(detail.batch.file_type)} ·{" "}
            {formatImportProcessingStatus(detail.batch.processing_status)}
          </p>
        </div>
        <Badge variant={summary.failedRows > 0 ? "destructive" : "secondary"}>
          {summary.totalRows} 行
        </Badge>
      </CardHeader>
      <CardContent className="grid gap-4">
        <section className="grid gap-3 md:grid-cols-4">
          <Metric label="成功" value={summary.successRows} />
          <Metric label="失败" value={summary.failedRows} />
          <Metric label="警告" value={summary.warningRows} />
          <Metric label="版本" value={summary.versionCount} />
        </section>

        <section
          className={
            readability.tone === "blocked"
              ? "grid gap-3 rounded-md border border-destructive/40 bg-destructive/10 p-3"
              : readability.tone === "warning"
                ? "grid gap-3 rounded-md border border-amber-500/30 bg-amber-500/10 p-3"
                : "grid gap-3 rounded-md border bg-muted/30 p-3"
          }
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-sm font-medium">处理摘要</div>
              <div className="mt-1 text-sm text-muted-foreground">{readability.title}</div>
            </div>
            <Badge variant={readability.tone === "blocked" ? "destructive" : "outline"}>
              {readability.focusLabel}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{readability.detail}</p>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="rounded-md border bg-background/70 p-2">
              <div className="text-xs text-muted-foreground">错误字段</div>
              <div className="mt-1 font-mono text-xs font-medium">
                {readability.errorFieldSummary}
              </div>
            </div>
            <div className="rounded-md border bg-background/70 p-2">
              <div className="text-xs text-muted-foreground">下一步</div>
              <div className="mt-1 text-xs font-medium">{readability.nextAction}</div>
            </div>
          </div>
        </section>

        <QualityExceptionTracePanel trace={exceptionTrace} />

        <section className="grid gap-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <FileText className="size-4 text-muted-foreground" />
            版本记录
          </div>
          {detail.versions.length === 0 ? (
            <div className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
              当前批次没有版本记录。
            </div>
          ) : (
            <div className="grid gap-2">
              {detail.versions.map((version) => (
                <div key={version.version_id} className="rounded-md border p-3 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs">{version.version_id}</span>
                    <Badge variant="outline">{formatImportFileType(version.version_type)}</Badge>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {version.business_date_from} 至 {version.business_date_to} ·{" "}
                    {version.created_at}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="grid gap-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Database className="size-4 text-muted-foreground" />
            全部行结果
          </div>
          {detail.rows.length === 0 ? (
            <div className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
              当前批次没有行结果。
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">行号</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="min-w-[160px]">source_key</TableHead>
                    <TableHead className="min-w-[140px]">错误字段</TableHead>
                    <TableHead className="min-w-[220px]">错误</TableHead>
                    <TableHead className="min-w-[320px]">字段预览</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detail.rows.map((row) => (
                    <DetailRow key={row.row_id} row={row} />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </section>
      </CardContent>
    </Card>
  )
}

function DetailRow({ row }: { row: ImportBatchRowResult }) {
  return (
    <TableRow>
      <TableCell className="font-mono text-xs">{row.row_number}</TableCell>
      <TableCell>
        <Badge variant={row.row_status === "failed" ? "destructive" : "outline"}>
          {formatImportRowStatus(row.row_status)}
        </Badge>
      </TableCell>
      <TableCell className="font-mono text-xs">{row.source_key ?? "-"}</TableCell>
      <TableCell className="font-mono text-xs">{formatImportRowErrorField(row)}</TableCell>
      <TableCell>
        {row.error_code ? (
          <div className="grid gap-1 text-sm">
            <span className="font-mono text-xs text-muted-foreground">{row.error_code}</span>
            <span>{row.error_message ?? "未返回错误说明"}</span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">无错误</span>
        )}
      </TableCell>
      <TableCell>
        <pre className="max-h-28 max-w-[420px] overflow-auto rounded-md bg-muted p-2 text-xs">
          {getImportRowStandardFieldsPreview(row)}
        </pre>
      </TableCell>
    </TableRow>
  )
}

function QualityExceptionTracePanel({ trace }: { trace: ImportQualityExceptionTrace }) {
  return (
    <section
      className={
        trace.tone === "blocked"
          ? "grid gap-3 rounded-md border border-destructive/40 bg-destructive/10 p-3"
          : trace.tone === "warning"
            ? "grid gap-3 rounded-md border border-amber-500/30 bg-amber-500/10 p-3"
            : "grid gap-3 rounded-md border bg-muted/30 p-3"
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-sm font-medium">履约异常影响追踪</div>
          <div className="mt-1 text-sm text-muted-foreground">{trace.title}</div>
        </div>
        <Badge variant={trace.tone === "blocked" ? "destructive" : "outline"}>
          只读追踪
        </Badge>
      </div>
      <div className="grid gap-2 md:grid-cols-3">
        <TraceMetric label="影响链路" value={trace.impactScope} />
        <TraceMetric label="质量证据" value={trace.evidenceLabel} />
        <TraceMetric label="下一步" value={trace.nextAction} />
      </div>
      <p className="text-sm text-muted-foreground">{trace.issueSummary}</p>
    </section>
  )
}

function TraceMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-background/70 p-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-xs font-medium">{value}</div>
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

function PanelState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="flex min-h-36 flex-col items-center justify-center gap-2 text-center">
      <CircleSlash className="size-5 text-muted-foreground" />
      <div className="text-sm font-medium">{title}</div>
      <div className="max-w-md text-sm text-muted-foreground">{detail}</div>
    </div>
  )
}
