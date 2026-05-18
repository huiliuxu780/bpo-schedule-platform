import { AppShell } from "@/components/app-shell"
import {
  summarizeFulfillmentExceptionRecords,
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

function buildReviewLeadRows(
  statusRecord: DashboardImportRecordSummary | undefined,
  loginRecord: DashboardImportRecordSummary | undefined
) {
  const statusRows = sampleRows(statusRecord)
  const loginRows = sampleRows(loginRecord)
  const rowCount = Math.min(statusRows.length, loginRows.length)

  return Array.from({ length: rowCount }, (_, index) => ({
    staff_id: statusRows[index]?.staff_id ?? loginRows[index]?.staff_id ?? "-",
    status: statusRows[index]?.status ?? "未标注",
    date: statusRows[index]?.date ?? loginRows[index]?.date ?? "-",
    actual_login: loginRows[index]?.actual_login ?? "-",
    lead_status: "待人工复核",
  }))
}

export default async function FulfillmentExceptionsPage() {
  const records = await getDemoImportRecords()
  const summary = summarizeFulfillmentExceptionRecords(records)
  const statusRecord = findRecord(records, "status_log")
  const loginRecord = findRecord(records, "login_log")
  const reviewLeads = buildReviewLeadRows(statusRecord, loginRecord)
  const fulfillmentRecords = records.filter(
    (record) => record.kind === "status_log" || record.kind === "login_log"
  )

  return (
    <AppShell title="异常管理" searchPlaceholder="搜索坐席、状态或批次">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <section className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-normal">异常管理</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              汇总状态和登录数据，展示可复核异常线索。
            </p>
          </div>
          <Badge variant="outline">异常线索</Badge>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard
            title="异常线索"
            value={`${summary.reviewLeadRows}`}
            description="状态/登录交叉样本"
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
            title="线索状态"
            value={summary.statusLabel}
            description={summary.latestSource}
          />
        </section>

        <ImportedRecordsSummary
          records={fulfillmentRecords}
          title="异常线索 records"
          description="从本机导入 processed records 读取状态与登录覆盖"
        />

        <div className="grid gap-4 xl:grid-cols-2">
          <ReviewLeadCard rows={reviewLeads} />
          <RecordSampleCard
            title="登录数据样本"
            description={loginRecord?.latest_batch_id ?? "等待导入登录数据"}
            rows={sampleRows(loginRecord)}
            emptyText="暂无登录数据。请先在文件导入页导入登录 CSV。"
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

function ReviewLeadCard({ rows }: { rows: Record<string, string>[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>异常线索样本</CardTitle>
        <CardDescription>
          对齐状态与登录样本，作为人工复核入口提示。
        </CardDescription>
      </CardHeader>
      <CardContent>
        {rows.length > 0 ? (
          <div className="grid gap-2">
            {rows.map((row, index) => (
              <div
                key={`review-lead-${index}`}
                className="rounded-md border bg-muted/20 p-3 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium">{row.staff_id}</span>
                  <Badge variant="outline">{row.lead_status}</Badge>
                </div>
                <div className="mt-2 grid gap-1 text-muted-foreground sm:grid-cols-3">
                  <span>{row.date}</span>
                  <span>状态：{row.status}</span>
                  <span>登录：{row.actual_login}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
            暂无可复核线索。请先导入坐席状态和登录 CSV。
          </div>
        )}
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
