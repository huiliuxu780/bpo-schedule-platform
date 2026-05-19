import { AppShell } from "@/components/app-shell"
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
import {
  fallbackImportTemplates,
  importTemplateKindLabel,
  summarizeImportTemplates,
} from "@/lib/import-template-guide"

export default function ImportTemplatesPage() {
  const rows = fallbackImportTemplates
  const summary = summarizeImportTemplates(rows)

  return (
    <AppShell title="导入模板" searchPlaceholder="搜索模板、字段或校验规则">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <h1 className="text-lg font-semibold">导入模板</h1>
            <p className="text-sm text-muted-foreground">
              统一查看导入对象、字段、主键和校验规则，支撑批次导入前的模板检查。
            </p>
          </div>
          <Badge variant="outline">模板规范</Badge>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <Metric title="模板数" value={`${summary.total}`} description="上传对象" />
          <Metric title="必填字段" value={`${summary.totalRequiredFields}`} description="跨模板合计" />
          <Metric title="校验规则" value={`${summary.totalValidationRules}`} description="字段规则" />
          <Metric title="模板类型" value={`${summary.templateKinds.length}`} description="稳定 kind key" />
        </section>

        <Card>
          <CardHeader>
            <CardTitle>模板清单</CardTitle>
            <CardDescription>
              展示主数据、人员排班、需求预测、登录日志和状态日志的最低导入契约。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>模板</TableHead>
                  <TableHead>主键</TableHead>
                  <TableHead>必填字段</TableHead>
                  <TableHead>校验规则</TableHead>
                  <TableHead>下游用途</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <div className="flex min-w-48 flex-col gap-1">
                        <span className="font-medium">{row.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {importTemplateKindLabel(row.kind)} / {row.sampleSheetName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      {row.primaryKeys.join(", ")}
                    </TableCell>
                    <TableCell>{row.requiredFields.length} 个</TableCell>
                    <TableCell>
                      <div className="flex max-w-80 flex-wrap gap-1">
                        {row.validationRules.map((rule) => (
                          <Badge key={rule} variant="secondary">
                            {rule}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      {row.downstreamUse.join(" / ")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </main>
    </AppShell>
  )
}

function Metric({
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
