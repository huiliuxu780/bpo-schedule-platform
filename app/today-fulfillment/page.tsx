import { AppShell } from "@/components/app-shell"
import {
  buildTodayFulfillmentInputRows,
  summarizeTodayFulfillmentRecords,
  type DashboardImportRecordSummary,
} from "@/components/data-table-model"
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
    <AppShell title="今日履约" searchPlaceholder="搜索今日履约、坐席或状态">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <section className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-normal">今日履约</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              汇总今日坐席主数据、状态数据和登录数据，展示履约覆盖与待关注信号。
            </p>
          </div>
          <Badge variant="outline">履约概览</Badge>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard
            title="履约数据"
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
            description="今日履约口径"
            compact
          />
        </section>

        <Card>
          <CardHeader>
            <CardTitle>今日履约输入表</CardTitle>
            <CardDescription>
              展示今日履约需要的主数据、状态和登录信号。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>信号</TableHead>
                    <TableHead className="text-right">行数</TableHead>
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
                        <TableCell>
                          <Badge variant="outline">{row.statusLabel}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="h-16 text-center text-muted-foreground"
                      >
                        暂无履约输入。补齐坐席主数据、状态数据和登录数据后可查看。
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
            description="按坐席状态记录核对在线、培训和离线时段"
            rows={sampleRows(statusRecord)}
            emptyText="暂无状态数据。"
          />
          <RecordSampleCard
            title="今日登录样本"
            description="对比计划登录、实际登录和在线时长"
            rows={sampleRows(loginRecord)}
            emptyText="暂无登录数据。"
          />
        </section>
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
