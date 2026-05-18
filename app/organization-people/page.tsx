import { AppShell } from "@/components/app-shell"
import {
  summarizeOrganizationPeopleRecords,
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

const distributionFields = [
  { key: "team", title: "团队分布" },
  { key: "site", title: "职场分布" },
  { key: "vendor", title: "供应商分布" },
] as const

function getStaffRecord(records: DashboardImportRecordSummary[]) {
  return records.find((record) => record.kind === "staff_master")
}

function buildDistributionRows(
  staffRecord: DashboardImportRecordSummary | undefined,
  field: (typeof distributionFields)[number]["key"]
) {
  const counts = new Map<string, number>()

  for (const row of staffRecord?.sample_rows ?? []) {
    const value = row[field]?.trim() || "未标注"
    counts.set(value, (counts.get(value) ?? 0) + 1)
  }

  return Array.from(counts.entries()).map(([label, count]) => ({ label, count }))
}

export default async function OrganizationPeoplePage() {
  const records = await getDemoImportRecords()
  const staffRecord = getStaffRecord(records)
  const summary = summarizeOrganizationPeopleRecords(records)
  const staffSamples = staffRecord?.sample_rows.slice(0, 5) ?? []

  return (
    <AppShell title="组织与人员" searchPlaceholder="搜索人员、团队、职场或供应商">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <section className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-normal">组织与人员</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              展示人员主数据、团队分布、职场分布和供应商归属。
            </p>
          </div>
          <Badge variant="outline">人员主数据</Badge>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard
            title="人员数量"
            value={`${summary.staffRows}`}
            description={`${summary.sampleRows} 条样本`}
          />
          <MetricCard
            title="团队"
            value={`${summary.teamCount}`}
            description="按样本 team 字段"
          />
          <MetricCard
            title="职场/供应商"
            value={`${summary.siteCount}/${summary.vendorCount}`}
            description="site / vendor"
          />
          <MetricCard
            title="主数据状态"
            value={summary.statusLabel}
            description={summary.latestBatch}
            compact
          />
        </section>

        <ImportedRecordsSummary
          records={staffRecord ? [staffRecord] : []}
          title="组织与人员 records"
          description="从本机导入 processed records 读取坐席主数据覆盖"
        />

        <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>人员主数据样本</CardTitle>
              <CardDescription>
                只展示导入样本，不提供新增、编辑、停用、账号或权限动作。
              </CardDescription>
            </CardHeader>
            <CardContent>
              {staffSamples.length > 0 ? (
                <div className="grid gap-2">
                  {staffSamples.map((row, index) => (
                    <div
                      key={`${row.staff_id ?? "staff"}-${index}`}
                      className="grid gap-2 rounded-md border bg-muted/20 p-3 text-sm md:grid-cols-[8rem_1fr]"
                    >
                      <div className="grid gap-1">
                        <span className="font-medium">{row.name ?? "未命名坐席"}</span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {row.staff_id ?? "无 staff_id"}
                        </span>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-4">
                        <SampleField label="团队" value={row.team} />
                        <SampleField label="职场" value={row.site} />
                        <SampleField label="供应商" value={row.vendor} />
                        <SampleField label="状态" value={row.status} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                  暂无人员样本。请先在文件导入页导入坐席主数据 CSV。
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>组织分布</CardTitle>
              <CardDescription>
                按团队、职场和供应商字段聚合人员覆盖。
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {distributionFields.map((field) => (
                <div key={field.key} className="grid gap-2">
                  <div className="text-sm font-medium">{field.title}</div>
                  <div className="grid gap-2">
                    {buildDistributionRows(staffRecord, field.key).length > 0 ? (
                      buildDistributionRows(staffRecord, field.key).map((row) => (
                        <div
                          key={`${field.key}-${row.label}`}
                          className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                        >
                          <span>{row.label}</span>
                          <Badge variant="outline">{row.count}</Badge>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-md border border-dashed p-3 text-xs text-muted-foreground">
                        等待导入
                      </div>
                    )}
                  </div>
                </div>
              ))}
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
