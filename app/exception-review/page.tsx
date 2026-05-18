import { AppShell } from "@/components/app-shell"
import {
  summarizeExceptionReviewRecords,
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
  return record?.sample_rows.slice(0, 4) ?? []
}

function buildReviewRows(
  statusRecord: DashboardImportRecordSummary | undefined,
  loginRecord: DashboardImportRecordSummary | undefined
) {
  const statusRows = sampleRows(statusRecord)
  const loginRows = sampleRows(loginRecord)
  const rowCount = Math.max(statusRows.length, loginRows.length)

  return Array.from({ length: rowCount }, (_, index) => {
    const statusRow = statusRows[index]
    const loginRow = loginRows[index]

    return {
      staff_id: statusRow?.staff_id ?? loginRow?.staff_id ?? "-",
      date: statusRow?.date ?? loginRow?.date ?? "-",
      status: statusRow?.status ?? "等待状态数据",
      actual_login: loginRow?.actual_login ?? "等待登录数据",
      queue_status: "只读待复核",
    }
  })
}

export default async function ExceptionReviewPage() {
  const records = await getDemoImportRecords()
  const summary = summarizeExceptionReviewRecords(records)
  const statusRecord = findRecord(records, "status_log")
  const loginRecord = findRecord(records, "login_log")
  const reviewRows = buildReviewRows(statusRecord, loginRecord)
  const fulfillmentRecords = records.filter(
    (record) => record.kind === "status_log" || record.kind === "login_log"
  )

  return (
    <AppShell title="异常复核" searchPlaceholder="搜索坐席、状态或复核批次">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <section className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-normal">异常复核</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              展示异常复核队列、状态线索和登录线索。
            </p>
          </div>
          <Badge variant="outline">复核队列</Badge>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard
            title="复核队列"
            value={`${summary.reviewQueueRows}`}
            description="只读待查看"
          />
          <MetricCard
            title="状态数据"
            value={`${summary.statusRows}`}
            description="状态数据"
          />
          <MetricCard
            title="登录数据"
            value={`${summary.loginRows}`}
            description="登录数据"
          />
          <MetricCard
            title="复核状态"
            value={summary.statusLabel}
            description={summary.latestSource}
          />
        </section>

        <ImportedRecordsSummary
          records={fulfillmentRecords}
          title="复核队列 records"
          description="从本机导入 processed records 读取状态与登录覆盖"
        />

        <Card>
          <CardHeader>
            <CardTitle>只读复核队列</CardTitle>
            <CardDescription>
              仅展示待人工查看线索，不提供通过、驳回、派单或状态写回。
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reviewRows.length > 0 ? (
              <div className="grid gap-2">
                {reviewRows.map((row, index) => (
                  <div
                    key={`exception-review-${index}`}
                    className="rounded-md border bg-muted/20 p-3 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="grid gap-1">
                        <span className="font-medium">{row.staff_id}</span>
                        <span className="text-muted-foreground">{row.date}</span>
                      </div>
                      <Badge variant="outline">{row.queue_status}</Badge>
                    </div>
                    <div className="mt-2 grid gap-1 text-muted-foreground sm:grid-cols-2">
                      <span>状态：{row.status}</span>
                      <span>登录：{row.actual_login}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
                暂无复核队列。请先导入坐席状态和登录 CSV。
              </div>
            )}
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
