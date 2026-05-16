import { AppShell } from "@/components/app-shell"
import {
  summarizeFulfillmentImportRecords,
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

function findRecord(
  records: DashboardImportRecordSummary[],
  kind: DashboardImportRecordSummary["kind"]
) {
  return records.find((record) => record.kind === kind)
}

function sampleRows(record: DashboardImportRecordSummary | undefined) {
  return record?.sample_rows.slice(0, 3) ?? []
}

export default async function FulfillmentMonitoringPage() {
  const records = await getDemoImportRecords()
  const summary = summarizeFulfillmentImportRecords(records)
  const statusRecord = findRecord(records, "status_log")
  const loginRecord = findRecord(records, "login_log")

  return (
    <AppShell title="工时核验" searchPlaceholder="搜索坐席、状态或登录批次">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <section className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-normal">履约监控</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              基于本机导入的状态数据和登录数据做最小履约核验，不使用生产公式。
            </p>
          </div>
          <Badge variant="outline">本机工时核验</Badge>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard
            title="履约 records"
            value={`${summary.importedRows}`}
            description="状态 + 登录"
          />
          <MetricCard
            title="状态数据"
            value={`${summary.statusRows}`}
            description="坐席状态日志"
          />
          <MetricCard
            title="登录数据"
            value={`${summary.loginRows}`}
            description="计划/实际登录"
          />
          <MetricCard
            title="核验状态"
            value={summary.statusLabel}
            description={summary.latestSource}
          />
        </section>

        <ImportedRecordsSummary
          records={records}
          title="履约核验 records"
          description="从本机导入 processed records 读取状态与登录覆盖"
        />

        <div className="grid gap-4 xl:grid-cols-2">
          <RecordSampleCard
            title="状态日志样本"
            description={statusRecord?.latest_batch_id ?? "等待导入坐席状态数据"}
            rows={sampleRows(statusRecord)}
            emptyText="暂无状态数据。请先在文件导入页导入坐席状态 CSV。"
          />
          <RecordSampleCard
            title="登录数据样本"
            description={loginRecord?.latest_batch_id ?? "等待导入登录数据"}
            rows={sampleRows(loginRecord)}
            emptyText="暂无登录数据。请先在文件导入页导入登录 CSV。"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>本机核验边界</CardTitle>
            <CardDescription>
              当前只证明导入结果进入履约监控页面。
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm text-muted-foreground">
            <p>不接数据库，不接真实 CORN/HR/WFM API。</p>
            <p>不固化生产遵守率、薪资结算、收费因子或处罚规则。</p>
            <p>后续如需生产级履约公式，必须单独过 Gate。</p>
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

function RecordSampleCard({
  title,
  description,
  rows,
  emptyText,
}: {
  title: string
  description: string
  rows: Record<string, string>[]
  emptyText: string
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
            {emptyText}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
