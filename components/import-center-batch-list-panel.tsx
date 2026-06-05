import Link from "next/link"
import { CircleSlash, Upload } from "lucide-react"

import {
  type ImportApplyReadinessResponse,
  type ImportBatchFilters,
  type ImportBatchListRow,
  buildImportBatchProcessingHref,
  buildImportUploadWorkspaceHref,
  filterImportBatches,
  formatImportBatchFileDisplayName,
  formatImportBatchDisplayLabel,
  formatImportApplicationStatus,
  formatImportFileType,
  getImportBatchHealth,
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
import { cn } from "@/lib/utils"

type ImportCenterBatchListPanelProps = {
  batches: ImportBatchListRow[]
  selectedBatch: ImportBatchListRow | null
  selectedBatchId: string | null
  readiness: ImportApplyReadinessResponse | null
  batchError: string | null
  batchFilters: ImportBatchFilters
  selectedBatchDetailHref?: string | null
}

export function ImportCenterBatchListPanel({
  batches,
  selectedBatch,
  selectedBatchId,
  readiness,
  batchError,
  batchFilters,
  selectedBatchDetailHref,
}: ImportCenterBatchListPanelProps) {
  const filteredBatches = filterImportBatches(batches, batchFilters)

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle className="text-base">导入批次</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            {batchError ??
              `${filteredBatches.length}/${batches.length} 批匹配`}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {batchError ? <Badge variant="destructive">读取失败</Badge> : null}
          <Button asChild size="sm">
            <Link href={buildImportUploadWorkspaceHref()}>
              <Upload data-icon="inline-start" />
              上传 CSV
            </Link>
          </Button>
        </div>
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
              "当前没有返回批次。上传完成后，这里会直接显示。"
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
                  <TableHead>健康度</TableHead>
                  <TableHead className="text-right">成功/失败</TableHead>
                  <TableHead>应用状态</TableHead>
                  <TableHead className="text-right">版本</TableHead>
                  <TableHead className="text-right">操作</TableHead>
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
                    <TableRow
                      key={batch.batch_id}
                      data-state={isSelected ? "selected" : undefined}
                    >
                      <TableCell>
                        <Link
                          href={buildBatchListHref(
                            batch.batch_id,
                            batchFilters,
                            "#import-batch-workspace"
                          )}
                          className="grid gap-1"
                        >
                          <span className="font-mono text-xs font-medium">
                            {formatImportBatchDisplayLabel(batch.batch_id)}
                          </span>
                          <span className="max-w-[320px] truncate text-xs text-muted-foreground">
                            {formatImportBatchFileDisplayName(batch.file_name)}
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
                      <TableCell className="text-right">
                        <Button asChild size="sm" variant={isSelected ? "default" : "outline"}>
                          <Link
                            href={
                              isSelected && selectedBatchDetailHref
                                ? selectedBatchDetailHref
                                : buildImportBatchProcessingHref(batch.batch_id)
                            }
                          >
                            处理
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
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
        <Input
          name="batchQuery"
          defaultValue={filters.query ?? ""}
          placeholder="批次、文件、上传人"
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
        <Button type="submit" size="sm" variant="outline">
          筛选
        </Button>
      </div>
      <div className="flex items-end">
        <Button asChild size="sm" variant="ghost">
          <Link
            href={
              selectedBatchId
                ? `/data-quality?batch=${encodeURIComponent(selectedBatchId)}`
                : "/data-quality"
            }
          >
            重置
          </Link>
        </Button>
      </div>
    </form>
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
  options: [string, string][]
}) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium">{label}</span>
      <select
        name={name}
        defaultValue={value}
        className="h-8 rounded-md border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
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
