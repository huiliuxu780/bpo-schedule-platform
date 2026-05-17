import {
  buildImportedRecordSourceRows,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
  const sourceRows = buildImportedRecordSourceRows(records)

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
        <div className="grid gap-3 text-sm">
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
          <div className="rounded-md border bg-background/60">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>数据源</TableHead>
                  <TableHead className="text-right">行数</TableHead>
                  <TableHead className="text-right">样本</TableHead>
                  <TableHead>最新批次</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sourceRows.length > 0 ? (
                  sourceRows.map((row) => (
                    <TableRow key={row.kind}>
                      <TableCell className="font-medium">{row.label}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {row.totalRows}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {row.sampleRows}
                      </TableCell>
                      <TableCell className="max-w-[220px] truncate text-xs text-muted-foreground">
                        {row.latestBatch}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-16 text-center text-muted-foreground"
                    >
                      暂无导入 records。请先在文件导入页导入 CSV。
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        仅读取本机运行态导入结果，不使用数据库或生产公式。
      </CardFooter>
    </Card>
  )
}
