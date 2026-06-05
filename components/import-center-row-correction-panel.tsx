import { AlertTriangle, CheckCircle2, RotateCcw } from "lucide-react"

import { correctImportFailedRowAction } from "@/app/data-quality/actions"
import {
  type ImportBatchPersistenceDetail,
  type ImportRowCorrectionNotice,
  type ImportBatchRowResult,
  formatImportBatchDisplayLabel,
  getImportRowStandardFieldsPreview,
  summarizeImportRowCorrectionNotice,
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

type ImportCenterRowCorrectionPanelProps = {
  detail: ImportBatchPersistenceDetail | null
  detailError: string | null
  correctionStatus?: string
  correctionReason?: string
  correctionRow?: string
}

export function ImportCenterRowCorrectionPanel({
  detail,
  detailError,
  correctionStatus,
  correctionReason,
  correctionRow,
}: ImportCenterRowCorrectionPanelProps) {
  const failedRows = detail?.failed_rows ?? []
  const correctionNotice = summarizeImportRowCorrectionNotice({
    status: correctionStatus,
    reason: correctionReason,
    row: correctionRow,
    remainingFailedRows: failedRows.length,
  })

  return (
    <Card id="import-row-correction" className="scroll-mt-16 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base">失败行修正</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            {detail
              ? formatImportBatchDisplayLabel(detail.batch.batch_id)
              : (detailError ?? "选择批次后读取失败行")}
          </p>
        </div>
        <StatusBadge
          status={correctionStatus}
          row={correctionRow}
          failedCount={failedRows.length}
        />
      </CardHeader>
      <CardContent className="p-0">
        {detailError ? (
          <PanelState title="批次明细读取失败" detail={detailError} />
        ) : !detail ? (
          <PanelState title="暂无批次明细" detail="没有选中可读取的导入批次。" />
        ) : failedRows.length === 0 ? (
          <PanelState
            title="没有失败行"
            detail="当前批次没有可修正的失败行。"
            positive
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">行号</TableHead>
                  <TableHead className="min-w-[220px]">错误</TableHead>
                  <TableHead className="min-w-[260px]">标准字段</TableHead>
                  <TableHead className="min-w-[360px]">单行修正</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {failedRows.map((row) => (
                  <FailedRow key={row.row_id} batchId={detail.batch.batch_id} row={row} />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {correctionNotice ? <CorrectionNotice notice={correctionNotice} /> : null}
      </CardContent>
    </Card>
  )
}

function FailedRow({ batchId, row }: { batchId: string; row: ImportBatchRowResult }) {
  return (
    <TableRow>
      <TableCell className="align-top font-mono text-xs">{row.row_number}</TableCell>
      <TableCell className="align-top">
        <div className="grid gap-1 text-sm">
          <div className="font-mono text-xs text-muted-foreground">
            {row.error_code ?? "UNKNOWN_ERROR"}
          </div>
          <div>{row.error_message ?? "未返回错误说明"}</div>
          {row.error_field ? <Badge variant="outline">{row.error_field}</Badge> : null}
        </div>
      </TableCell>
      <TableCell className="align-top">
        <pre className="max-h-32 max-w-[360px] overflow-auto rounded-md bg-muted p-2 text-xs">
          {getImportRowStandardFieldsPreview(row)}
        </pre>
      </TableCell>
      <TableCell className="align-top">
        <form action={correctImportFailedRowAction} className="grid gap-2">
          <input type="hidden" name="batch_id" value={batchId} />
          <input type="hidden" name="row_number" value={row.row_number} />
          <textarea
            name="standard_fields"
            defaultValue={getImportRowStandardFieldsPreview(row)}
            className="min-h-24 w-full rounded-lg border border-input bg-background px-2.5 py-2 font-mono text-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <div className="flex justify-end">
            <Button type="submit" size="sm" variant="outline">
              <RotateCcw className="size-4" />
              提交修正
            </Button>
          </div>
        </form>
      </TableCell>
    </TableRow>
  )
}

function StatusBadge({
  status,
  row,
  failedCount,
}: {
  status?: string
  row?: string
  failedCount: number
}) {
  if (status === "success") {
    return <Badge variant="secondary">第 {row ?? "-"} 行已修正</Badge>
  }

  if (status === "failed") {
    return <Badge variant="destructive">修正失败</Badge>
  }

  if (failedCount > 0) {
    return <Badge variant="destructive">{failedCount} 行待修正</Badge>
  }

  return <Badge variant="outline">无失败行</Badge>
}

function CorrectionNotice({ notice }: { notice: ImportRowCorrectionNotice }) {
  const isSuccess = notice.tone === "success"
  const Icon = isSuccess ? CheckCircle2 : AlertTriangle
  const panelClass = isSuccess
    ? "border-t bg-primary/10 px-4 py-3 text-sm text-primary"
    : "border-t bg-destructive/10 px-4 py-3 text-sm text-destructive"

  return (
    <div className={panelClass}>
      <div className="flex items-start gap-2">
        <Icon className="mt-0.5 size-4 shrink-0" />
        <div className="grid gap-1">
          <div className="font-medium">{notice.title}</div>
          <div>{notice.detail}</div>
          <div className="text-xs opacity-80">{notice.nextAction}</div>
        </div>
      </div>
    </div>
  )
}

function PanelState({
  title,
  detail,
  positive = false,
}: {
  title: string
  detail: string
  positive?: boolean
}) {
  const Icon = positive ? CheckCircle2 : AlertTriangle

  return (
    <div className="flex min-h-44 flex-col items-center justify-center gap-2 p-6 text-center">
      <Icon className="size-5 text-muted-foreground" />
      <div className="text-sm font-medium">{title}</div>
      <div className="max-w-md text-sm text-muted-foreground">{detail}</div>
    </div>
  )
}
