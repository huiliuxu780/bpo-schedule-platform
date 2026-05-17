import { AppShell } from "@/components/app-shell"
import {
  summarizeOperationAuditRecords,
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

export default async function OperationAuditPage() {
  const records = await getDemoImportRecords()
  const summary = summarizeOperationAuditRecords(records)
  const staffRecord = findRecord(records, "staff_master")
  const statusRecord = findRecord(records, "status_log")
  const loginRecord = findRecord(records, "login_log")
  const scheduleRecord = findRecord(records, "schedule_plan")

  return (
    <AppShell title="操作审计" searchPlaceholder="搜索批次、模块或证据">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <section className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-normal">操作审计</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              基于本机导入 records 展示只读操作证据口径，不做生产审计日志。
            </p>
          </div>
          <Badge variant="outline">本机审计预览</Badge>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard
            title="操作审计 records"
            value={`${summary.importedRows}`}
            description={`${summary.sourceCount} 类本机来源`}
          />
          <MetricCard
            title="导入批次"
            value={`${summary.batchCount}`}
            description="可追溯的本机批次"
          />
          <MetricCard
            title="模块证据"
            value={`${summary.auditSignals}/4`}
            description="主数据 / 状态 / 登录 / 排班"
          />
          <MetricCard
            title="审计状态"
            value={summary.statusLabel}
            description={summary.latestBatch}
            compact
          />
        </section>

        <ImportedRecordsSummary
          records={records}
          title="操作审计 records"
          description="从本机 processed records 读取导入批次和模块证据"
        />

        <section className="grid gap-4 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>本机审计证据</CardTitle>
              <CardDescription>
                只读展示当前演示链路可解释的来源，不创建生产审计链。
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              <SignalRow
                title="坐席主数据证据"
                value={`${summary.staffRows} 行`}
                batch={staffRecord?.latest_batch_id}
              />
              <SignalRow
                title="履约操作证据"
                value={`${summary.workflowRows} 行`}
                batch={statusRecord?.latest_batch_id ?? loginRecord?.latest_batch_id}
              />
              <SignalRow
                title="排班批次证据"
                value={scheduleRecord ? `${scheduleRecord.total_rows} 行` : "等待导入"}
                batch={scheduleRecord?.latest_batch_id}
              />
              <div className="pt-2 text-xs text-muted-foreground">
                最新批次：{summary.latestSource} / {summary.latestBatch}
              </div>
            </CardContent>
          </Card>

          <RecordSampleCard
            title="审计样本"
            description={staffRecord?.latest_batch_id ?? "等待导入坐席主数据"}
            rows={sampleRows(staffRecord)}
            emptyText="暂无审计样本。请先在文件导入页导入本机 CSV。"
          />
        </section>

        <BoundaryCard
          title="操作审计边界"
          description="当前只证明本机演示链路可以被解释。"
          lines={[
            "不做账号登录、认证、权限或角色管理。",
            "不生成生产审计日志或不可篡改审计存储。",
            "不做审批、导出、批量操作、数据库持久化、真实接口或锁账。",
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
