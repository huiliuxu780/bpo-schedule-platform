import { AppShell } from "@/components/app-shell"
import {
  buildRuleConfigurationTableRows,
  ruleConfigurationPreviewItems,
  summarizeRuleConfigurationRecords,
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

export default async function RuleConfigurationPage() {
  const records = await getDemoImportRecords()
  const summary = summarizeRuleConfigurationRecords(records)
  const ruleRows = buildRuleConfigurationTableRows(ruleConfigurationPreviewItems)

  return (
    <AppShell title="规则配置" searchPlaceholder="搜索规则或状态">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <section className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-normal">规则配置</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              查看规则能力的开放状态，区分当前可查看的规则范围和仍在开发的配置能力。
            </p>
          </div>
          <Badge variant="outline">功能状态</Badge>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard
            title="规则范围"
            value={`${summary.enabledPreviewRules + summary.deferredRules}`}
            description="配置能力项"
          />
          <MetricCard
            title="已开放"
            value={`${summary.enabledPreviewRules}`}
            description="可查看规则"
          />
          <MetricCard
            title="开发中"
            value={`${summary.deferredRules}`}
            description="编辑、发布、写回"
          />
          <MetricCard
            title="关联数据"
            value={`${summary.importedSources}`}
            description="规则上下文"
          />
        </section>

        <Card>
          <CardHeader>
            <CardTitle>规则目录</CardTitle>
            <CardDescription>
              列出规则配置模块的能力状态，未开放项统一标注开发中。
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
                              row.statusLabel === "已开放"
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
                        暂无规则目录。
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
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
        <CardTitle
          className="text-2xl font-semibold tabular-nums"
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
