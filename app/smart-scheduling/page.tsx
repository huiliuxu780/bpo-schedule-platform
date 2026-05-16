import { AppShell } from "@/components/app-shell"
import {
  summarizeSmartSchedulingRecords,
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

export default async function SmartSchedulingPage() {
  const records = await getDemoImportRecords()
  const summary = summarizeSmartSchedulingRecords(records)
  const staffRecord = findRecord(records, "staff_master")
  const statusRecord = findRecord(records, "status_log")
  const loginRecord = findRecord(records, "login_log")
  const scheduleRecord = findRecord(records, "schedule_plan")

  return (
    <AppShell title="智能排班" searchPlaceholder="搜索建议、计划或批次">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <section className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-normal">智能排班</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              基于本机导入 records 展示只读排班建议 readiness，不自动生成或发布排班。
            </p>
          </div>
          <Badge variant="outline">本机建议预览</Badge>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard
            title="智能排班 records"
            value={`${summary.importedRows}`}
            description={`${summary.sourceCount} 类导入数据`}
          />
          <MetricCard
            title="建议信号"
            value={`${summary.recommendationSignals}/3`}
            description="主数据 / 履约 / 排班"
          />
          <MetricCard
            title="计划覆盖"
            value={`${summary.planCount}`}
            description={`${summary.scheduleRows} 行 schedule_plan`}
          />
          <MetricCard
            title="建议状态"
            value={summary.statusLabel}
            description={summary.latestBatch}
            compact
          />
        </section>

        <ImportedRecordsSummary
          records={records}
          title="智能排班 records"
          description="从本机 processed records 读取智能排班建议输入覆盖"
        />

        <section className="grid gap-4 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>本机排班建议</CardTitle>
              <CardDescription>
                只读核对是否具备生成建议所需的数据输入，不执行自动排班。
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              <SignalRow
                title="坐席主数据"
                value={`${summary.staffRows} 行`}
                batch={staffRecord?.latest_batch_id}
              />
              <SignalRow
                title="履约状态与登录"
                value={`${summary.fulfillmentRows} 行`}
                batch={statusRecord?.latest_batch_id ?? loginRecord?.latest_batch_id}
              />
              <SignalRow
                title="排班计划输入"
                value={`${summary.scheduleRows} 行`}
                batch={scheduleRecord?.latest_batch_id}
              />
              <div className="pt-2 text-xs text-muted-foreground">
                最新批次：{summary.latestSource} / {summary.latestBatch}
              </div>
            </CardContent>
          </Card>

          <RecordSampleCard
            title="排班计划样本"
            description={scheduleRecord?.latest_batch_id ?? "等待导入排班数据"}
            rows={sampleRows(scheduleRecord)}
            emptyText="暂无排班计划样本。请先在文件导入页导入排班数据 CSV。"
          />
        </section>

        <BoundaryCard
          title="智能排班边界"
          description="当前只证明建议入口可以读取本机导入结果。"
          lines={[
            "不自动生成或发布排班。",
            "不做人员级调班、生产计划写回或审批流。",
            "不做导出、批量操作、数据库持久化或真实接口写回。",
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
    <div className="flex items-center justify-between gap-3 rounded-md border bg-muted/20 px-3 py-2">
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
