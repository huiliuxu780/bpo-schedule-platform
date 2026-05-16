import { AppShell } from "@/components/app-shell"
import {
  summarizeInterfaceIntegrationRecords,
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

export default async function InterfaceIntegrationPage() {
  const records = await getDemoImportRecords()
  const summary = summarizeInterfaceIntegrationRecords(records)
  const staffRecord = findRecord(records, "staff_master")
  const statusRecord = findRecord(records, "status_log")
  const loginRecord = findRecord(records, "login_log")
  const scheduleRecord = findRecord(records, "schedule_plan")

  return (
    <AppShell title="接口集成" searchPlaceholder="搜索接口、字段或批次">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <section className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-normal">接口集成</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              基于本机导入 records 展示接入 readiness，不连接真实接口或配置接口凭证。
            </p>
          </div>
          <Badge variant="outline">本机接入预览</Badge>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard
            title="接口集成 records"
            value={`${summary.importedRows}`}
            description={`${summary.sourceCount} 类本机来源`}
          />
          <MetricCard
            title="字段 readiness"
            value={`${summary.mappedFields}/${summary.mappedFields + summary.missingFields}`}
            description={`${summary.missingFields} 个字段待补齐`}
          />
          <MetricCard
            title="状态日志"
            value={`${summary.statusRows}`}
            description={`${summary.cornStatusTypes} 类状态样本`}
          />
          <MetricCard
            title="接入状态"
            value={summary.statusLabel}
            description={summary.latestBatch}
            compact
          />
        </section>

        <ImportedRecordsSummary
          records={records}
          title="接口集成 records"
          description="从本机 processed records 读取接入来源、字段和状态 readiness"
        />

        <section className="grid gap-4 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>本机接入 readiness</CardTitle>
              <CardDescription>
                只读核对当前演示链路能解释的数据来源，不创建真实外部连接。
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              <SignalRow
                title="坐席主数据"
                value={staffRecord ? "已导入" : "等待导入"}
                batch={staffRecord?.latest_batch_id}
              />
              <SignalRow
                title="状态与登录来源"
                value={`${summary.statusRows} 行状态`}
                batch={statusRecord?.latest_batch_id ?? loginRecord?.latest_batch_id}
              />
              <SignalRow
                title="排班数据来源"
                value={scheduleRecord ? `${scheduleRecord.total_rows} 行` : "等待导入"}
                batch={scheduleRecord?.latest_batch_id}
              />
              <div className="pt-2 text-xs text-muted-foreground">
                最新批次：{summary.latestSource} / {summary.latestBatch}
              </div>
            </CardContent>
          </Card>

          <RecordSampleCard
            title="状态日志样本"
            description={statusRecord?.latest_batch_id ?? "等待导入坐席状态数据"}
            rows={sampleRows(statusRecord)}
            emptyText="暂无状态日志样本。请先在文件导入页导入坐席状态数据 CSV。"
          />
        </section>

        <BoundaryCard
          title="接口集成边界"
          description="当前只证明接口前置数据 readiness。"
          lines={[
            "不连接真实接口或配置接口凭证。",
            "不写回 CORN、HR、WFM 或任何第三方系统。",
            "不做认证、权限、审批、导出、批量操作、数据库持久化或生产同步。",
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
