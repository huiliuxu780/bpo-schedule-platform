import { AppShell } from "@/components/app-shell"
import {
  buildVendorDistributionTableRows,
  summarizeVendorManagementRecords,
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

function getStaffRecord(records: DashboardImportRecordSummary[]) {
  return records.find((record) => record.kind === "staff_master")
}

export default async function VendorManagementPage() {
  const records = await getDemoImportRecords()
  const staffRecord = getStaffRecord(records)
  const summary = summarizeVendorManagementRecords(records)
  const vendorRows = buildVendorDistributionTableRows(staffRecord)

  return (
    <AppShell title="供应商管理" searchPlaceholder="搜索供应商、团队或批次">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <section className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-normal">供应商管理</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              展示供应商人员覆盖、样本分布和管理入口状态。
            </p>
          </div>
          <Badge variant="outline">供应商概览</Badge>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard
            title="供应商坐席"
            value={`${summary.staffRows}`}
            description="来自坐席主数据"
          />
          <MetricCard
            title="供应商数"
            value={`${summary.vendorCount}`}
            description={`${summary.sampleRows} 条样本`}
          />
          <MetricCard
            title="样本最大供应商"
            value={summary.largestVendor}
            description="按样本 vendor 聚合"
            compact
          />
          <MetricCard
            title="最近批次"
            value={summary.latestBatch}
            description={summary.latestSource}
            compact
          />
        </section>

        <ImportedRecordsSummary
          records={staffRecord ? [staffRecord] : []}
          title="供应商管理 records"
          description="从本机 staff_master processed records 读取供应商字段覆盖"
        />

        <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <CardTitle>供应商分布</CardTitle>
              <CardDescription>
                按供应商字段聚合人员覆盖，辅助查看供应商分布。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>供应商</TableHead>
                      <TableHead className="text-right">样本坐席数</TableHead>
                      <TableHead>状态</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendorRows.length > 0 ? (
                      vendorRows.map((row) => (
                        <TableRow key={row.vendor}>
                          <TableCell className="font-medium">
                            {row.vendor}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {row.sampleAgents}
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
                          暂无供应商样本。请先在文件导入页导入坐席主数据 CSV。
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>供应商样本</CardTitle>
              <CardDescription>
                展示人员主数据中的供应商样本。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {(staffRecord?.sample_rows.slice(0, 5) ?? []).map((row, index) => (
                  <div
                    key={`${row.staff_id ?? "staff"}-${index}`}
                    className="grid gap-2 rounded-md border bg-muted/20 p-3 text-sm sm:grid-cols-4"
                  >
                    <SampleField label="坐席" value={row.name ?? row.staff_id} />
                    <SampleField label="供应商" value={row.vendor} />
                    <SampleField label="团队" value={row.team} />
                    <SampleField label="职场" value={row.site} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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

function SampleField({
  label,
  value,
}: {
  label: string
  value: string | undefined
}) {
  return (
    <div className="grid gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="truncate">{value || "未标注"}</span>
    </div>
  )
}
