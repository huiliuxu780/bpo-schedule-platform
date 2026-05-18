import { AppShell } from "@/components/app-shell"
import {
  buildTodayFulfillmentInputRows,
  summarizeTodayFulfillmentRecords,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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

export default async function TodayFulfillmentPage() {
  const records = await getDemoImportRecords()
  const summary = summarizeTodayFulfillmentRecords(records)
  const inputRows = buildTodayFulfillmentInputRows(records)
  const statusRecord = findRecord(records, "status_log")
  const loginRecord = findRecord(records, "login_log")

  return (
    <AppShell title="今日履约" searchPlaceholder="搜索今日履约、坐席或批次">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <section className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-normal">今日履约</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              读取本机导入后的坐席主数据、状态数据和登录数据，展示今日履约演示口径。
            </p>
          </div>
          <Badge variant="outline">本机只读预览</Badge>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard
            title="今日履约 records"
            value={`${summary.importedRows}`}
            description={`${summary.readySignals}/3 类信号已接入`}
          />
          <MetricCard
            title="坐席主数据"
            value={`${summary.staffRows}`}
            description="staff_master"
          />
          <MetricCard
            title="状态/登录"
            value={`${summary.statusRows}/${summary.loginRows}`}
            description="status_log / login_log"
          />
          <MetricCard
            title="履约状态"
            value={summary.statusLabel}
            description={summary.latestBatch}
            compact
          />
        </section>

        <ImportedRecordsSummary
          records={records}
          title="今日履约 records"
          description="从本机 processed records 读取今日履约输入覆盖"
        />

        <Card>
          <CardHeader>
            <CardTitle>今日履约输入表</CardTitle>
            <CardDescription>
              只读展示进入今日履约页面的本机 processed records。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>数据源</TableHead>
                    <TableHead className="text-right">行数</TableHead>
                    <TableHead>最新批次</TableHead>
                    <TableHead>状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inputRows.length > 0 ? (
                    inputRows.map((row) => (
                      <TableRow key={row.kind}>
                        <TableCell className="font-medium">
                          {row.sourceName}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {row.totalRows}
                        </TableCell>
                        <TableCell className="max-w-[260px] truncate font-mono text-xs text-muted-foreground">
                          {row.latestBatch}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{row.statusLabel}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="h-16 text-center text-muted-foreground"
                      >
                        暂无履约输入 records。请先在文件导入页导入坐席主数据、状态数据和登录数据 CSV。
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <section className="grid gap-4 xl:grid-cols-2">
          <RecordSampleCard
            title="今日状态样本"
            description={statusRecord?.latest_batch_id ?? "等待导入坐席状态数据"}
            rows={sampleRows(statusRecord)}
            emptyText="暂无状态数据。请先在文件导入页导入坐席状态 CSV。"
          />
          <RecordSampleCard
            title="今日登录样本"
            description={loginRecord?.latest_batch_id ?? "等待导入登录数据"}
            rows={sampleRows(loginRecord)}
            emptyText="暂无登录数据。请先在文件导入页导入登录 CSV。"
          />
        </section>

        <BoundaryCard
          title="今日履约边界"
          description="当前只证明导入结果能被履约页面读取。"
          lines={[
            "不接数据库，不接真实 CORN/HR/WFM API。",
            "不固化生产履约公式、结算规则、处罚规则或收费因子。",
            "不提供审批、导出、批量处理或自动排班动作。",
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
