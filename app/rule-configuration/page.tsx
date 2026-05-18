import { AppShell } from "@/components/app-shell"
import {
  buildRuleConfigurationTableRows,
  ruleConfigurationPreviewItems,
  summarizeRuleConfigurationRecords,
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

export default async function RuleConfigurationPage() {
  const records = await getDemoImportRecords()
  const summary = summarizeRuleConfigurationRecords(records)
  const ruleRows = buildRuleConfigurationTableRows(ruleConfigurationPreviewItems)

  return (
    <AppShell title="规则配置" searchPlaceholder="搜索规则、数据源或批次">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <section className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-normal">规则配置</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              展示本机可演示规则目录和暂不开放边界，不提供编辑、发布或生产写入。
            </p>
          </div>
          <Badge variant="outline">本机规则目录</Badge>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard
            title="规则配置 records"
            value={`${summary.importedRows}`}
            description={`${summary.importedSources} 类导入数据`}
          />
          <MetricCard
            title="已开放预览"
            value={`${summary.enabledPreviewRules}`}
            description="本机只读规则"
          />
          <MetricCard
            title="开发中规则"
            value={`${summary.deferredRules}`}
            description="需后续 Gate"
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
          title="规则配置 records"
          description="从本机 processed records 读取规则预览输入覆盖"
        />

        <Card>
          <CardHeader>
            <CardTitle>本机规则目录</CardTitle>
            <CardDescription>
              只读列出本机演示当前能证明的规则边界，未开放项统一标注开发中。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>规则</TableHead>
                    <TableHead>说明</TableHead>
                    <TableHead>状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ruleRows.length > 0 ? (
                    ruleRows.map((row) => (
                      <TableRow key={row.rule}>
                        <TableCell className="font-medium">
                          {row.rule}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {row.description}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              row.statusLabel === "本机只读"
                                ? "outline"
                                : "secondary"
                            }
                          >
                            {row.statusLabel}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="h-16 text-center text-muted-foreground"
                      >
                        暂无规则目录。本机规则预览恢复后会在这里展示。
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
            <CardTitle>规则配置边界</CardTitle>
            <CardDescription>
              当前只证明规则配置入口已开放并能解释可演示范围。
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm text-muted-foreground">
            <p>不保存规则、不发布规则、不变更生产状态码或公式。</p>
            <p>不做权限、审批、导出、批量操作、结算规则或收费因子。</p>
            <p>不接真实外部接口，不接数据库或生产持久化配置。</p>
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
