import { AppShell } from "@/components/app-shell"
import {
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
import { getDemoImportRecords } from "@/lib/demo-imports"

export default async function RuleConfigurationPage() {
  const records = await getDemoImportRecords()
  const summary = summarizeRuleConfigurationRecords(records)

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
            <div className="grid gap-2 md:grid-cols-2">
              {ruleConfigurationPreviewItems.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center justify-between rounded-md border bg-muted/20 px-3 py-2 text-sm"
                >
                  <span>{item.title}</span>
                  <Badge
                    variant={item.status === "enabled" ? "outline" : "secondary"}
                  >
                    {item.status === "enabled" ? "本机只读" : "开发中"}
                  </Badge>
                </div>
              ))}
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
