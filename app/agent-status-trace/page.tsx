import { AppShell } from "@/components/app-shell"
import {
  summarizeAgentStatusTraceRecords,
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
  return record?.sample_rows.slice(0, 5) ?? []
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

export default async function AgentStatusTracePage() {
  const records = await getDemoImportRecords()
  const summary = summarizeAgentStatusTraceRecords(records)
  const statusRecord = findStatusRecord(records)
  const statusRows = sampleRows(statusRecord)
  const statusDistribution = summarizeStatuses(statusRecord)

  return (
    <AppShell title="坐席状态轨迹" searchPlaceholder="搜索坐席、状态或批次">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <section className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-normal">
              坐席状态轨迹
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              展示坐席状态轨迹覆盖，辅助查看在线、培训、离线等状态分布。
            </p>
          </div>
          <Badge variant="outline">状态轨迹</Badge>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard
            title="状态数据"
            value={`${summary.statusRows}`}
            description="status_log processed rows"
          />
          <MetricCard
            title="状态类型"
            value={`${summary.statusTypes}`}
            description="来自样本 rows"
          />
          <MetricCard
            title="最近批次"
            value={summary.latestBatch}
            description={summary.latestSource}
            compact
          />
          <MetricCard
            title="轨迹状态"
            value={summary.statusLabel}
            description="状态数据覆盖"
          />
        </section>

        <ImportedRecordsSummary
          records={statusRecord ? [statusRecord] : []}
          title="状态轨迹 records"
          description="从本机导入 processed records 读取坐席状态覆盖"
        />

        <div className="grid gap-4 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>状态分布</CardTitle>
              <CardDescription>
                按导入样本中的 status 字段聚合，不代表生产遵守率。
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
            title="状态日志样本"
            description={statusRecord?.latest_batch_id ?? "等待导入坐席状态数据"}
            rows={statusRows}
          />
        </div>

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
