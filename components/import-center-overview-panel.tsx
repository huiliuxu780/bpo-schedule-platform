import type { ComponentType } from "react"

import {
  AlertTriangle,
  CheckCircle2,
  Database,
  ShieldCheck,
} from "lucide-react"

import {
  type ImportApplyReadinessResponse,
  type ImportBatchListRow,
  type ImportExceptionGuidance,
  formatImportReadinessStatus,
  summarizeImportBatches,
} from "@/components/import-center-model"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type ImportCenterOverviewPanelProps = {
  batches: ImportBatchListRow[]
  selectedBatch: ImportBatchListRow | null
  readiness: ImportApplyReadinessResponse | null
  exceptionGuidance: ImportExceptionGuidance[]
}

export function ImportCenterOverviewPanel({
  batches,
  selectedBatch,
  readiness,
  exceptionGuidance,
}: ImportCenterOverviewPanelProps) {
  const summary = summarizeImportBatches(batches)

  return (
    <section className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
      </div>

      {exceptionGuidance.some((item) => item.tone !== "ready") ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">异常态处理建议</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              汇总批次、准备度和字段映射模板的前置异常，先处理阻塞项再继续操作。
            </p>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {exceptionGuidance.map((item) => (
              <div
                key={item.scope}
                className={cn(
                  "grid gap-2 rounded-md border p-3 text-sm",
                  item.tone === "blocked"
                    ? "border-destructive/40 bg-destructive/10"
                    : item.tone === "ready"
                      ? "bg-muted/30"
                      : "bg-muted/30"
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{item.title}</span>
                  <Badge variant={item.tone === "blocked" ? "destructive" : "outline"}>
                    {formatExceptionTone(item.tone)}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{item.detail}</p>
                <p className="text-xs text-muted-foreground">{item.nextAction}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </section>
  )
}

type SummaryCardProps = {
  title: string
  value: string
  detail: string
  icon: ComponentType<{ className?: string }>
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

function formatExceptionTone(tone: ImportExceptionGuidance["tone"]): string {
  if (tone === "blocked") {
    return "阻塞"
  }

  if (tone === "ready") {
    return "正常"
  }

  return "提醒"
}
