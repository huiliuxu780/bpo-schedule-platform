import { AppShell } from "@/components/app-shell"
import {
  summarizeDataQualityRecords,
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

const sourceLabels: Record<DashboardImportRecordSummary["kind"], string> = {
  staff_master: "坐席主数据",
  status_log: "坐席状态数据",
  login_log: "登录数据",
}

function buildQualityRows(records: DashboardImportRecordSummary[]) {
  const recordsByKind = new Map(records.map((record) => [record.kind, record]))

  return (["staff_master", "status_log", "login_log"] as const).map((kind) => {
    const record = recordsByKind.get(kind)

    return {
      kind,
      title: sourceLabels[kind],
      rows: record?.total_rows ?? 0,
      samples: record?.sample_rows.length ?? 0,
      latestBatch: record?.latest_batch_id ?? "等待导入",
      qualityStatus: record ? "可查看" : "待补齐",
      sampleRows: record?.sample_rows.slice(0, 2) ?? [],
    }
  })
}

export default async function DataQualityPage() {
  const records = await getDemoImportRecords()
  const summary = summarizeDataQualityRecords(records)
  const qualityRows = buildQualityRows(records)

  return (
    <AppShell title="数据质量" searchPlaceholder="搜索数据源、批次或坐席">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <section className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-normal">数据质量</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              展示主数据、状态数据和登录数据的覆盖、样本和基础缺口提示。
            </p>
          </div>
          <Badge variant="outline">质量概览</Badge>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard
            title="数据覆盖"
            value={`${summary.importedRows}`}
            description={`${summary.importedSources} 类数据源`}
          />
          <MetricCard
            title="坐席主数据"
            value={`${summary.staffRows}`}
            description="坐席主数据"
          />
          <MetricCard
            title="状态/登录"
            value={`${summary.statusRows}/${summary.loginRows}`}
            description="status_log / login_log"
          />
          <MetricCard
            title="质量状态"
            value={summary.statusLabel}
            description={summary.latestSource}
          />
        </section>

        <ImportedRecordsSummary
          records={records}
          title="数据质量 records"
          description="从本机导入 processed records 读取三类数据覆盖"
        />

        <Card>
          <CardHeader>
            <CardTitle>质量预览明细</CardTitle>
            <CardDescription>
              展示数据覆盖、样本字段和质量关注点。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {qualityRows.map((row) => (
                <div
                  key={row.kind}
                  className="grid gap-3 rounded-md border bg-muted/20 p-3 text-sm lg:grid-cols-[12rem_1fr]"
                >
                  <div className="grid gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{row.title}</span>
                      <Badge variant="outline">{row.qualityStatus}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {row.latestBatch}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {row.rows} 行 / {row.samples} 条样本
                    </span>
                  </div>
                  {row.sampleRows.length > 0 ? (
                    <div className="grid gap-2">
                      {row.sampleRows.map((sample, index) => (
                        <div
                          key={`${row.kind}-${index}`}
                          className="rounded-md border bg-background/70 p-2 font-mono text-xs"
                        >
                          {Object.entries(sample).map(([key, value]) => (
                            <div
                              key={key}
                              className="grid grid-cols-[8rem_1fr] gap-2"
                            >
                              <span className="text-muted-foreground">{key}</span>
                              <span>{value}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-md border border-dashed p-4 text-xs text-muted-foreground">
                      暂无样本。请先在文件导入页导入对应 CSV。
                    </div>
                  )}
                </div>
              ))}
            </div>
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
