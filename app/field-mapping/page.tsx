import { AppShell } from "@/components/app-shell"
import {
  fieldMappingSpecs,
  getRecordFieldNames,
  summarizeFieldMappingRecords,
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

function buildMappingRows(records: DashboardImportRecordSummary[]) {
  return fieldMappingSpecs.map((spec) => {
    const record = records.find((item) => item.kind === spec.kind)
    const fieldNames = getRecordFieldNames(record)
    const fieldSet = new Set(fieldNames)
    const mappedFields = spec.expectedFields.filter((field) => fieldSet.has(field))
    const missingFields = spec.expectedFields.filter((field) => !fieldSet.has(field))

    return {
      ...spec,
      record,
      mappedFields,
      missingFields,
      extraFields: fieldNames.filter((field) => !spec.expectedFields.includes(field)),
      statusLabel: record
        ? missingFields.length > 0
          ? "缺少字段"
          : "可查看"
        : "等待导入",
    }
  })
}

export default async function FieldMappingPage() {
  const records = await getDemoImportRecords()
  const summary = summarizeFieldMappingRecords(records)
  const mappingRows = buildMappingRows(records)

  return (
    <AppShell title="字段映射" searchPlaceholder="搜索字段、数据源或批次">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <section className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-normal">字段映射</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              展示字段识别覆盖、缺失字段和映射样本。
            </p>
          </div>
          <Badge variant="outline">字段覆盖</Badge>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard
            title="字段覆盖"
            value={`${summary.mappedFields}`}
            description={`${summary.importedSources} 类数据源`}
          />
          <MetricCard
            title="缺失字段"
            value={`${summary.missingFields}`}
            description="按预期字段检查"
          />
          <MetricCard
            title="映射状态"
            value={summary.statusLabel}
            description="字段覆盖预览"
          />
          <MetricCard
            title="最近批次"
            value={summary.latestBatch}
            description={summary.latestSource}
            compact
          />
        </section>

        <ImportedRecordsSummary
          records={records}
          title="字段映射 records"
          description="从本机导入 processed records 读取样本字段覆盖"
        />

        <Card>
          <CardHeader>
            <CardTitle>字段映射预览</CardTitle>
            <CardDescription>
              展示已识别字段、缺失字段和额外字段；当前不提供保存、发布或写回动作。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {mappingRows.map((row) => (
                <div
                  key={row.kind}
                  className="grid gap-3 rounded-md border bg-muted/20 p-3 text-sm xl:grid-cols-[13rem_1fr]"
                >
                  <div className="grid gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{row.title}</span>
                      <Badge variant="outline">{row.statusLabel}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {row.record?.latest_batch_id ?? "等待导入"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {row.record?.total_rows ?? 0} 行 / {row.record?.sample_rows.length ?? 0} 条样本
                    </span>
                  </div>

                  <div className="grid gap-3 lg:grid-cols-3">
                    <FieldGroup title="已识别字段" fields={row.mappedFields} />
                    <FieldGroup title="缺失字段" fields={row.missingFields} />
                    <FieldGroup
                      title="额外字段"
                      fields={row.extraFields}
                      emptyText="无额外字段"
                    />
                  </div>
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

function FieldGroup({
  title,
  fields,
  emptyText = "暂无字段",
}: {
  title: string
  fields: string[]
  emptyText?: string
}) {
  return (
    <div className="grid gap-2">
      <div className="text-xs font-medium text-muted-foreground">{title}</div>
      {fields.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {fields.map((field) => (
            <Badge key={field} variant="outline" className="font-mono text-[11px]">
              {field}
            </Badge>
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-dashed p-3 text-xs text-muted-foreground">
          {emptyText}
        </div>
      )}
    </div>
  )
}
