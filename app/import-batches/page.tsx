import Link from "next/link"

import { AppShell } from "@/components/app-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  getImportBatches,
  importBatchStatusLabel,
  summarizeImportBatches,
} from "@/lib/import-batch-history"

export default async function ImportBatchesPage() {
  const rows = await getImportBatches()
  const summary = summarizeImportBatches(rows)

  return (
    <AppShell title="导入批次" searchPlaceholder="搜索批次、模板或错误码">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <h1 className="text-lg font-semibold">导入批次</h1>
            <p className="text-sm text-muted-foreground">
              查看上传批次状态、成功/失败行、错误码和数据质量问题追溯。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">批次追踪</Badge>
            <Button asChild size="sm">
              <Link href="/import-batches/new?type=login-log">上传 CSV</Link>
            </Button>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <Metric title="批次数" value={`${summary.total}`} description={`${summary.completed} 个已完成`} />
          <Metric title="总行数" value={`${summary.totalRows}`} description="跨批次合计" />
          <Metric title="失败行" value={`${summary.failedRows}`} description={`失败率 ${(summary.failureRate * 100).toFixed(1)}%`} />
          <Metric title="待复核" value={`${summary.pendingReview}`} description={`${summary.warningRows} 行警告`} />
        </section>

        <Card>
          <CardHeader>
            <CardTitle>批次历史</CardTitle>
            <CardDescription>
              按批次追踪模板、行数、错误码、质量问题和处理状态。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>批次</TableHead>
                  <TableHead>模板</TableHead>
                  <TableHead>行数</TableHead>
                  <TableHead>错误码</TableHead>
                  <TableHead>数据质量</TableHead>
                  <TableHead>状态</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Link href={`/import-batches/${row.id}`} className="font-medium text-primary hover:underline">
                        {row.id}
                      </Link>
                      <div className="text-xs text-muted-foreground">
                        {row.uploadedAt} / {row.owner}
                      </div>
                    </TableCell>
                    <TableCell>
                      {row.templateName}
                      <div className="text-xs text-muted-foreground">{row.sourceFile}</div>
                    </TableCell>
                    <TableCell>
                      {row.successRows}/{row.totalRows}
                      <div className="text-xs text-muted-foreground">
                        失败 {row.failedRows} / 警告 {row.warningRows}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      {row.errorCodes.length > 0 ? row.errorCodes.join(", ") : "无"}
                    </TableCell>
                    <TableCell className="text-xs">
                      {row.qualityIssueIds.length > 0 ? row.qualityIssueIds.join(", ") : "无"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={row.status === "failed" ? "destructive" : "secondary"}>
                        {importBatchStatusLabel(row.status)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </main>
    </AppShell>
  )
}

function Metric({
  title,
  value,
  description,
}: {
  title: string
  value: string
  description: string
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums">
          {value}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">
        {description}
      </CardContent>
    </Card>
  )
}
