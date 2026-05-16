import { AppShell } from "@/components/app-shell"
import {
  summarizeReportCenterRecords,
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

export default async function ReportCenterPage() {
  const records = await getDemoImportRecords()
  const summary = summarizeReportCenterRecords(records)
  const staffRecord = findRecord(records, "staff_master")
  const statusRecord = findRecord(records, "status_log")
  const loginRecord = findRecord(records, "login_log")
  const scheduleRecord = findRecord(records, "schedule_plan")

  return (
    <AppShell title="报表中心" searchPlaceholder="搜索报表、数据源或批次">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <section className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-normal">报表中心</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              基于本机导入 records 汇总可演示报表覆盖，不生成生产报表或导出文件。
            </p>
          </div>
          <Badge variant="outline">本机报表预览</Badge>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard
            title="报表中心 records"
            value={`${summary.importedRows}`}
            description={`${summary.sourceCount} 类导入数据`}
          />
          <MetricCard
            title="报表分区"
            value={`${summary.reportSections}/4`}
            description="主数据 / 状态 / 登录 / 排班"
          />
          <MetricCard
            title="排班/履约"
            value={`${summary.scheduleRows}/${summary.fulfillmentRows}`}
            description="schedule_plan / status+login"
          />
          <MetricCard
            title="报表状态"
            value={summary.statusLabel}
            description={summary.latestBatch}
            compact
          />
        </section>

        <ImportedRecordsSummary
          records={records}
          title="报表中心 records"
          description="从本机 processed records 读取报表中心输入覆盖"
        />

        <Card>
          <CardHeader>
            <CardTitle>本机报表目录</CardTitle>
            <CardDescription>
              只读展示当前演示可以解释的数据覆盖，不提供文件下载或生产报表生成。
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 md:grid-cols-2">
            <SignalRow
              title="人员主数据报表"
              value={`${summary.staffRows} 行`}
              batch={staffRecord?.latest_batch_id}
            />
            <SignalRow
              title="履约状态报表"
              value={`${summary.fulfillmentRows} 行`}
              batch={statusRecord?.latest_batch_id ?? loginRecord?.latest_batch_id}
            />
            <SignalRow
              title="排班覆盖报表"
              value={`${summary.scheduleRows} 行`}
              batch={scheduleRecord?.latest_batch_id}
            />
            <SignalRow
              title="最近批次"
              value={summary.latestSource}
              batch={summary.latestBatch}
            />
          </CardContent>
        </Card>

        <BoundaryCard
          title="报表中心边界"
          description="当前只证明模块数据能汇总到报表入口。"
          lines={[
            "不生成生产报表或导出文件。",
            "不固化生产 KPI 公式、结算公式或收费因子。",
            "不做审批、批量操作、数据库持久化或真实接口写回。",
          ]}
        />
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

function SignalRow({
  title,
  value,
  batch,
}: {
  title: string
  value: string
  batch?: string
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border bg-muted/20 px-3 py-2 text-sm">
      <div className="min-w-0">
        <div className="font-medium">{title}</div>
        <div className="truncate text-xs text-muted-foreground">
          {batch ?? "等待导入"}
        </div>
      </div>
      <Badge variant="outline">{value}</Badge>
    </div>
  )
}

function BoundaryCard({
  title,
  description,
  lines,
}: {
  title: string
  description: string
  lines: string[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm text-muted-foreground">
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </CardContent>
    </Card>
  )
}
