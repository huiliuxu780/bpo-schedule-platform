import Link from "next/link"

import { AppShell } from "@/components/app-shell"
import { Badge } from "@/components/ui/badge"
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
  fallbackImportBatches,
  importBatchStatusLabel,
  summarizeImportBatches,
} from "@/lib/import-batch-history"

export default function ImportBatchesPage() {
  const rows = fallbackImportBatches
  const summary = summarizeImportBatches(rows)

  return (
    <AppShell title="导入批次" searchPlaceholder="搜索批次、模板或错误码">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <h1 className="text-lg font-semibold">导入批次</h1>
            <p className="text-sm text-muted-foreground">
              本地只读入口，用于查看上传/导入批次状态、成功/失败行和数据质量问题追溯。
            </p>
          </div>
          <Badge variant="outline">无真实导入</Badge>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <Metric title="批次数" value={`${summary.total}`} description={`${summary.completed} 个已完成`} />
          <Metric title="总行数" value={`${summary.totalRows}`} description="本地样例合计" />
          <Metric title="失败行" value={`${summary.failedRows}`} description={`失败率 ${(summary.failureRate * 100).toFixed(1)}%`} />
          <Metric title="待复核" value={`${summary.pendingReview}`} description={`${summary.warningRows} 行警告`} />
        </section>

        <Card>
          <CardHeader>
            <CardTitle>批次历史</CardTitle>
            <CardDescription>
              只展示批次结果和追溯关系，不写入失败行、不触发修复或审批。
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

        <Card>
          <CardHeader>
            <CardTitle>暂不实现动作</CardTitle>
            <CardDescription>本页只提供验收视图，不执行生产导入。</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {summary.deferredActions.map((item) => (
              <Badge key={item} variant="secondary">
                {item}
              </Badge>
            ))}
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
