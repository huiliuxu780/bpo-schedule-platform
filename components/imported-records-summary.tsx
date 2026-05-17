import {
  summarizeDashboardImportRecords,
  type DashboardImportRecordSummary,
} from "@/components/data-table-model"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type ImportedRecordsSummaryProps = {
  records: DashboardImportRecordSummary[]
  title?: string
  description?: string
}

export function ImportedRecordsSummary({
  records,
  title = "本机导入 records",
  description = "后端 processed records API 返回的本机导入结果",
}: ImportedRecordsSummaryProps) {
  const summary = summarizeDashboardImportRecords(records)

  return (
    <Card className="border-dashed bg-muted/20">
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
        <div className="grid gap-1">
          <CardDescription>{description}</CardDescription>
          <CardTitle className="text-[24px] leading-8 font-semibold tabular-nums">
            {title} {summary.importedRows} 行
          </CardTitle>
        </div>
        <Badge variant={summary.importedRows > 0 ? "outline" : "secondary"}>
          {summary.statusLabel}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 text-sm">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">坐席主数据 {summary.staffRows} 行</Badge>
            <Badge variant="outline">状态数据 {summary.statusRows} 行</Badge>
            <Badge variant="outline">登录数据 {summary.loginRows} 行</Badge>
            <Badge variant="outline">排班数据 {summary.scheduleRows} 行</Badge>
          </div>
          <div className="text-xs text-muted-foreground">
            已处理 {summary.importedSources} 类数据源；最新：
            {summary.latestSource} / {summary.latestBatch}
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        仅读取本机运行态导入结果，不使用数据库或生产公式。
      </CardFooter>
    </Card>
  )
}
