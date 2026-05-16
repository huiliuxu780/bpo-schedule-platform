import { AppShell } from "@/components/app-shell"
import {
  summarizeAdherenceMonitoringRecords,
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

function buildAdherenceRows(
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
      status: statusRow?.status ?? "等待状态 records",
      actual_login: loginRow?.actual_login ?? "等待登录 records",
      preview_status: "本机预览",
    }
  })
}

export default async function AdherenceMonitoringPage() {
  const records = await getDemoImportRecords()
  const summary = summarizeAdherenceMonitoringRecords(records)
  const statusRecord = findRecord(records, "status_log")
  const loginRecord = findRecord(records, "login_log")
  const adherenceRows = buildAdherenceRows(statusRecord, loginRecord)
  const adherenceRecords = records.filter(
    (record) => record.kind === "status_log" || record.kind === "login_log"
  )

  return (
    <AppShell title="实时遵守率" searchPlaceholder="搜索坐席、状态或登录批次">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <section className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-normal">实时遵守率</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              基于本机 status_log/login_log records 做预览入口，不计算生产遵守率，不接实时流。
            </p>
          </div>
          <Badge variant="outline">本机 records 预览</Badge>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard
            title="预览 records"
            value={`${summary.importedRows}`}
            description="状态 + 登录"
          />
          <MetricCard
            title="状态数据"
            value={`${summary.statusRows}`}
            description="status_log records"
          />
          <MetricCard
            title="登录数据"
            value={`${summary.loginRows}`}
            description="login_log records"
          />
          <MetricCard
            title="预览状态"
            value={summary.statusLabel}
            description={summary.latestSource}
          />
        </section>

        <ImportedRecordsSummary
          records={adherenceRecords}
          title="遵守率预览 records"
          description="从本机导入 processed records 读取状态与登录覆盖"
        />

        <Card>
          <CardHeader>
            <CardTitle>本机遵守率预览样本</CardTitle>
            <CardDescription>
              仅拼接状态和登录样本，帮助演示导入结果已进入模块页面。
            </CardDescription>
          </CardHeader>
          <CardContent>
            {adherenceRows.length > 0 ? (
              <div className="grid gap-2">
                {adherenceRows.map((row, index) => (
                  <div
                    key={`adherence-preview-${index}`}
                    className="rounded-md border bg-muted/20 p-3 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="grid gap-1">
                        <span className="font-medium">{row.staff_id}</span>
                        <span className="text-muted-foreground">{row.date}</span>
                      </div>
                      <Badge variant="outline">{row.preview_status}</Badge>
                    </div>
                    <div className="mt-2 grid gap-1 text-muted-foreground sm:grid-cols-2">
                      <span>状态：{row.status}</span>
                      <span>实际登录：{row.actual_login}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
                暂无遵守率预览样本。请先导入坐席状态和登录 CSV。
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>本机预览边界</CardTitle>
            <CardDescription>
              当前只证明导入结果进入实时遵守率页面。
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm text-muted-foreground">
            <p>不接数据库，不接真实 CORN/HR/WFM API。</p>
            <p>不接实时流，不固化生产状态码或生产遵守率公式。</p>
            <p>不做状态写回、导出、批量处理、结算规则或收费因子。</p>
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
