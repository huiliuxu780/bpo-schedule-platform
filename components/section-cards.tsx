import { TrendingDown, TrendingUp } from "lucide-react"

import { metricCards } from "@/app/dashboard/data"
import {
  summarizeDashboardImportKpiPreview,
  summarizeDashboardImportRecords,
  type DashboardImportKpiBatch,
  type DashboardImportRecordSummary,
} from "@/components/data-table-model"
import {
  Card,
  CardContent,
  CardFooter,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function SectionCards({
  importBatches = [],
  importRecords = [],
}: {
  importBatches?: DashboardImportKpiBatch[]
  importRecords?: DashboardImportRecordSummary[]
}) {
  const importPreview = summarizeDashboardImportKpiPreview(importBatches)
  const recordsPreview = summarizeDashboardImportRecords(importRecords)

  return (
    <section className="@container/main px-4 lg:px-6">
      <Card className="mb-4 overflow-hidden border-dashed bg-muted/20">
        <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
          <div className="grid gap-1">
            <CardDescription>本机 KPI Preview</CardDescription>
            <CardTitle className="text-[24px] leading-8 font-semibold tabular-nums">
              导入覆盖 {importPreview.importedRows} 行
            </CardTitle>
          </div>
          <Badge variant={importPreview.attentionBatches > 0 ? "destructive" : "outline"}>
            {importPreview.statusLabel}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-sm font-medium">
            已接入 {importPreview.importedSources} 类数据
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            records API 已处理 {recordsPreview.importedRows} 行，覆盖 {recordsPreview.importedSources} 类数据源
          </div>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          最新批次：{importPreview.latestSource} / {importPreview.latestBatch}。仅用于本机演示口径。
        </CardFooter>
      </Card>
      <div className="grid gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {metricCards.map((item) => {
        const positive = item.change.startsWith("+")

        return (
          <Card
            key={item.title}
            className="min-h-[204px] overflow-hidden bg-gradient-to-t from-card to-muted/20"
          >
            <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
              <div className="grid gap-1">
                <CardDescription>{item.title}</CardDescription>
                <CardTitle className="text-[30px] leading-9 font-semibold tabular-nums">
                  {item.value}
                </CardTitle>
              </div>
              <Badge variant="outline" className="gap-1">
                {positive ? (
                  <TrendingUp className="size-3" />
                ) : (
                  <TrendingDown className="size-3" />
                )}
                {item.change}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">{item.insight}</div>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
              {item.note}
            </CardFooter>
          </Card>
        )
      })}
      </div>
    </section>
  )
}
