import { anomalies } from "@/app/dashboard/data"
import { AppShell } from "@/components/app-shell"
import {
  buildAnomalyAlertTableRows,
  summarizeAnomalyAlertRecords,
} from "@/components/data-table-model"
import { ImportedRecordsSummary } from "@/components/imported-records-summary"
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
import { getDemoImportRecords } from "@/lib/demo-imports"

export default async function AnomalyAlertsPage() {
  const records = await getDemoImportRecords()
  const summary = summarizeAnomalyAlertRecords(anomalies, records)
  const alertRows = buildAnomalyAlertTableRows(anomalies)

  return (
    <AppShell title="异常预警" searchPlaceholder="搜索异常、团队或批次">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <section className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-normal">异常预警</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              汇总异常线索、影响时段和待处理状态，支持快速定位履约风险。
            </p>
          </div>
          <Badge variant="outline">预警队列</Badge>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard
            title="异常预警"
            value={`${summary.alertRows}`}
            description="待处理预警"
          />
          <MetricCard
            title="高优先级"
            value={`${summary.highSeverity}`}
            description="severity = 高"
          />
          <MetricCard
            title="待复核"
            value={`${summary.pendingReview}`}
            description="status = 待复核"
          />
          <MetricCard
            title="导入覆盖"
            value={`${summary.importedRows}`}
            description={summary.statusLabel}
          />
        </section>

        <ImportedRecordsSummary
          records={records}
          title="异常预警 records"
          description="从本机 processed records 辅助展示预警输入覆盖"
        />

        <Card>
          <CardHeader>
            <CardTitle>异常预警队列</CardTitle>
            <CardDescription>
              展示当前待关注异常、影响范围和处理状态。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>异常</TableHead>
                    <TableHead>团队</TableHead>
                    <TableHead>时段</TableHead>
                    <TableHead>影响</TableHead>
                    <TableHead>级别</TableHead>
                    <TableHead>状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alertRows.length > 0 ? (
                    alertRows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>
                          <div className="grid gap-1">
                            <span className="font-medium">{row.type}</span>
                            <span className="font-mono text-xs text-muted-foreground">
                              {row.id}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{row.team}</TableCell>
                        <TableCell>{row.shiftTime}</TableCell>
                        <TableCell>{row.impactedHours}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              row.severity === "高" ? "destructive" : "outline"
                            }
                          >
                            {row.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{row.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-16 text-center text-muted-foreground"
                      >
                        暂无异常预警队列。
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

      </main>
    </AppShell>
  )
}

function MetricCard({
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
