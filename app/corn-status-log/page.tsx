import { AppShell } from "@/components/app-shell"
import {
  summarizeCornStatusLogRecords,
  type DashboardImportRecordSummary,
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
import { getDemoImportRecords } from "@/lib/demo-imports"

function findStatusRecord(records: DashboardImportRecordSummary[]) {
  return records.find((record) => record.kind === "status_log")
}

function sampleRows(record: DashboardImportRecordSummary | undefined) {
  return record?.sample_rows.slice(0, 6) ?? []
}

function summarizeStatuses(record: DashboardImportRecordSummary | undefined) {
  const counts = new Map<string, number>()

  for (const row of sampleRows(record)) {
    const status = row.status?.trim() || "未标注"
    counts.set(status, (counts.get(status) ?? 0) + 1)
  }

  return Array.from(counts.entries()).map(([status, count]) => ({
    status,
    count,
  }))
}

export default async function CornStatusLogPage() {
  const records = await getDemoImportRecords()
  const summary = summarizeCornStatusLogRecords(records)
  const statusRecord = findStatusRecord(records)
  const statusRows = sampleRows(statusRecord)
  const statusDistribution = summarizeStatuses(statusRecord)

  return (
    <AppShell title="CORN 状态日志" searchPlaceholder="搜索坐席、状态或批次">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <section className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-normal">
              CORN 状态日志
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              基于本机导入的 status_log records 展示状态日志覆盖，不接真实 CORN API 或实时流。
            </p>
          </div>
          <Badge variant="outline">本机状态日志</Badge>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard
            title="CORN 状态日志 records"
            value={`${summary.statusRows}`}
            description="status_log processed rows"
          />
          <MetricCard
            title="状态类型"
            value={`${summary.statusTypes}`}
            description="来自样本 rows"
          />
          <MetricCard
            title="样本数"
            value={`${summary.sampleRows}`}
            description="页面预览 records"
          />
          <MetricCard
            title="最近批次"
            value={summary.latestBatch}
            description={summary.latestSource}
            compact
          />
        </section>

        <ImportedRecordsSummary
          records={statusRecord ? [statusRecord] : []}
          title="CORN 状态日志 records"
          description="从本机导入 processed records 读取状态日志覆盖"
        />

        <div className="grid gap-4 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>状态日志分布</CardTitle>
              <CardDescription>
                按导入样本 status 字段聚合，只用于本机演示预览。
              </CardDescription>
            </CardHeader>
            <CardContent>
              {statusDistribution.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {statusDistribution.map((item) => (
                    <Badge key={item.status} variant="outline">
                      {item.status} {item.count}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
                  暂无状态分布。请先在文件导入页导入坐席状态 CSV。
                </div>
              )}
            </CardContent>
          </Card>

          <RecordSampleCard
            title="CORN 状态日志样本"
            description={statusRecord?.latest_batch_id ?? "等待导入坐席状态数据"}
            rows={statusRows}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>本机状态日志边界</CardTitle>
            <CardDescription>
              当前只证明导入结果进入 CORN 状态日志页面。
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm text-muted-foreground">
            <p>不接数据库，不接真实 CORN/HR/WFM API。</p>
            <p>不接实时状态流，不固化生产状态码，不做状态写回。</p>
            <p>不做真实接口检查、审批、导出、批量处理、结算规则或收费因子。</p>
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
  compact = false,
}: {
  title: string
  value: string
  description: string
  compact?: boolean
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle
          className={
            compact
              ? "break-all text-sm font-semibold leading-5"
              : "text-2xl font-semibold tabular-nums"
          }
        >
          {value}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">
        {description}
      </CardContent>
    </Card>
  )
}

function RecordSampleCard({
  title,
  description,
  rows,
}: {
  title: string
  description: string
  rows: Record<string, string>[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {rows.length > 0 ? (
          <div className="grid gap-2">
            {rows.map((row, index) => (
              <div
                key={`${title}-${index}`}
                className="rounded-md border bg-muted/20 p-3 font-mono text-xs"
              >
                {Object.entries(row).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-[8rem_1fr] gap-2">
                    <span className="text-muted-foreground">{key}</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
            暂无状态数据。请先在文件导入页导入坐席状态 CSV。
          </div>
        )}
      </CardContent>
    </Card>
  )
}
