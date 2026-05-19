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
  fallbackFieldMappings,
  groupFieldMappingsByTemplate,
  mappingStatusLabel,
  summarizeFieldMappings,
} from "@/lib/field-mapping-preview"

export default function FieldMappingPage() {
  const rows = fallbackFieldMappings
  const summary = summarizeFieldMappings(rows)
  const groups = groupFieldMappingsByTemplate(rows)

  return (
    <AppShell title="字段映射" searchPlaceholder="搜索源字段、目标字段或模板">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <h1 className="text-lg font-semibold">字段映射预览</h1>
            <p className="text-sm text-muted-foreground">
              查看模板字段如何映射到业务对象，快速发现缺失字段、转换规则和校验风险。
            </p>
          </div>
          <Badge variant="outline">预览</Badge>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <Metric title="字段数" value={`${summary.total}`} description={`${summary.required} 个必填`} />
          <Metric title="已映射" value={`${summary.mapped}`} description="可进入导入校验" />
          <Metric title="需确认" value={`${summary.warning}`} description="转换或默认值需确认" />
          <Metric title="缺失" value={`${summary.missing}`} description="阻断导入" />
        </section>

        <section className="grid gap-4">
          {Object.entries(groups).map(([templateName, mappings]) => (
            <Card key={templateName}>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <CardTitle>{templateName}</CardTitle>
                    <CardDescription>
                      {mappings.length} 个字段映射，覆盖源字段、目标字段、转换和校验。
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{mappings[0]?.templateId}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>源字段</TableHead>
                      <TableHead>目标对象</TableHead>
                      <TableHead>目标字段</TableHead>
                      <TableHead>转换</TableHead>
                      <TableHead>校验</TableHead>
                      <TableHead>状态</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mappings.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>
                          {row.sourceField}
                          {row.required ? (
                            <div className="text-xs text-muted-foreground">必填</div>
                          ) : null}
                        </TableCell>
                        <TableCell>{row.targetObject}</TableCell>
                        <TableCell>{row.targetField}</TableCell>
                        <TableCell className="text-xs">{row.transform}</TableCell>
                        <TableCell className="text-xs">{row.validation}</TableCell>
                        <TableCell>
                          <Badge variant={row.status === "missing" ? "destructive" : "secondary"}>
                            {mappingStatusLabel(row.status)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </section>

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
