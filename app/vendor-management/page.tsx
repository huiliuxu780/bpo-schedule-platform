import { AppShell } from "@/components/app-shell"
import {
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
import { getDemoImportRecords } from "@/lib/demo-imports"

function getStaffRecord(records: DashboardImportRecordSummary[]) {
  return records.find((record) => record.kind === "staff_master")
}

function buildVendorRows(staffRecord: DashboardImportRecordSummary | undefined) {
  const counts = new Map<string, number>()

  for (const row of staffRecord?.sample_rows ?? []) {
    const vendor = row.vendor?.trim() || "未标注"
    counts.set(vendor, (counts.get(vendor) ?? 0) + 1)
  }

  return Array.from(counts.entries())
    .map(([vendor, count]) => ({ vendor, count }))
    .sort((a, b) => b.count - a.count)
}

export default async function VendorManagementPage() {
  const records = await getDemoImportRecords()
  const staffRecord = getStaffRecord(records)
  const summary = summarizeVendorManagementRecords(records)
  const vendorRows = buildVendorRows(staffRecord)

  return (
    <AppShell title="供应商管理" searchPlaceholder="搜索供应商、团队或批次">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <section className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-normal">供应商管理</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              基于本机坐席主数据中的 vendor 字段展示供应商覆盖，不维护合同或结算。
            </p>
          </div>
          <Badge variant="outline">本机供应商预览</Badge>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard
            title="供应商管理 records"
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
              <CardTitle>本机供应商分布</CardTitle>
              <CardDescription>
                按样本 vendor 字段聚合，仅用于演示供应商入口已开放。
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              {vendorRows.length > 0 ? (
                vendorRows.map((row) => (
                  <div
                    key={row.vendor}
                    className="flex items-center justify-between rounded-md border bg-muted/20 px-3 py-2 text-sm"
                  >
                    <span>{row.vendor}</span>
                    <Badge variant="outline">{row.count}</Badge>
                  </div>
                ))
              ) : (
                <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                  暂无供应商样本。请先在文件导入页导入坐席主数据 CSV。
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>本机供应商样本</CardTitle>
              <CardDescription>
                只读展示人员主数据样本，不提供供应商新增、编辑或写回。
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

        <Card>
          <CardHeader>
            <CardTitle>供应商管理边界</CardTitle>
            <CardDescription>
              当前只证明供应商字段能进入系统管理页面。
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm text-muted-foreground">
            <p>不接数据库，不维护供应商合同、结算、收费因子或 KPI 规则。</p>
            <p>不做供应商写回、批量操作、审批、导出或权限配置。</p>
            <p>后续若要真实供应商主数据，必须单独过数据库和权限 Gate。</p>
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
